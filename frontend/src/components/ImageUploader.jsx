import React, { useState } from "react";
import {
  Upload,
  X,
  ChevronLeft,
  ChevronRight,
  Image as ImageIcon,
  AlertCircle,
  Loader2,
} from "lucide-react";

const API_URL = process.env.REACT_APP_BACKEND_URL;

export const resolveImageUrl = (url) => {
  if (!url) return "";
  if (url.startsWith("http://") || url.startsWith("https://")) return url;
  if (url.startsWith("/")) return `${API_URL}${url}`;
  return url;
};

/**
 * Uploader multi-immagine riutilizzabile (blog e progetti).
 * Props:
 *  - token: admin token
 *  - images: array di URL
 *  - onChange: (newImages: string[]) => void
 *  - label: titolo della sezione
 *  - showCoverBadge: mostra badge "Copertina" sulla prima
 *  - testIdPrefix: per i data-testid (es. "post" o "project")
 */
const ImageUploader = ({
  token,
  images,
  onChange,
  label = "Immagini",
  showCoverBadge = true,
  testIdPrefix = "image",
}) => {
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState("");
  const [externalUrl, setExternalUrl] = useState("");

  const uploadSingleFile = async (file) => {
    if (!file.type.startsWith("image/")) {
      throw new Error(`"${file.name}": non è un'immagine.`);
    }
    if (file.size > 8 * 1024 * 1024) {
      throw new Error(`"${file.name}": file troppo grande (max 8 MB).`);
    }
    const data = new FormData();
    data.append("file", file);
    const res = await fetch(`${API_URL}/api/admin/upload`, {
      method: "POST",
      headers: { "X-Admin-Token": token },
      body: data,
    });
    if (!res.ok) {
      let detail = "Errore upload.";
      try {
        const d = await res.json();
        if (typeof d?.detail === "string") detail = d.detail;
      } catch (_) {
        /* keep default */
      }
      throw new Error(detail);
    }
    const result = await res.json();
    return result.url;
  };

  const uploadFiles = async (fileList) => {
    const files = Array.from(fileList || []);
    if (files.length === 0) return;
    setUploadError("");
    setUploading(true);
    const newUrls = [];
    try {
      for (const f of files) {
        try {
          const url = await uploadSingleFile(f);
          newUrls.push(url);
        } catch (err) {
          setUploadError(err.message || "Errore upload.");
        }
      }
      if (newUrls.length > 0) onChange([...images, ...newUrls]);
    } finally {
      setUploading(false);
    }
  };

  const onFileChange = (e) => {
    uploadFiles(e.target.files);
    e.target.value = "";
  };

  const onDrop = (e) => {
    e.preventDefault();
    uploadFiles(e.dataTransfer.files);
  };

  const removeImage = (idx) => onChange(images.filter((_, i) => i !== idx));

  const moveImage = (idx, dir) => {
    const next = [...images];
    const newIdx = idx + dir;
    if (newIdx < 0 || newIdx >= next.length) return;
    [next[idx], next[newIdx]] = [next[newIdx], next[idx]];
    onChange(next);
  };

  const addExternalUrl = () => {
    const url = externalUrl.trim();
    if (!url) return;
    onChange([...images, url]);
    setExternalUrl("");
  };

  return (
    <div>
      <label className="text-xs font-semibold text-[#0A1F44] mb-1.5 uppercase tracking-wider flex items-center gap-1.5">
        <ImageIcon className="w-3.5 h-3.5" />
        {label} {images.length > 0 ? `(${images.length})` : ""}
      </label>

      {images.length > 0 ? (
        <div
          data-testid={`${testIdPrefix}-images-grid`}
          className="grid grid-cols-3 sm:grid-cols-4 gap-2 mb-3"
        >
          {images.map((src, idx) => (
            <div
              key={`${src}-${idx}`}
              className="relative group rounded-lg overflow-hidden border border-gray-200 bg-gray-50 aspect-square"
            >
              <img
                src={resolveImageUrl(src)}
                alt=""
                className="w-full h-full object-cover"
              />
              {showCoverBadge && idx === 0 ? (
                <span className="absolute top-1 left-1 text-[10px] font-bold uppercase tracking-wider bg-[#F4C542] text-[#0A1F44] px-1.5 py-0.5 rounded">
                  Copertina
                </span>
              ) : null}
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/45 transition-colors flex items-center justify-center gap-1 opacity-0 group-hover:opacity-100">
                <button
                  type="button"
                  onClick={() => moveImage(idx, -1)}
                  disabled={idx === 0}
                  className="w-7 h-7 rounded-full bg-white/90 hover:bg-white disabled:opacity-30 text-[#0A1F44] flex items-center justify-center"
                  aria-label="Sposta a sinistra"
                >
                  <ChevronLeft className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => moveImage(idx, 1)}
                  disabled={idx === images.length - 1}
                  className="w-7 h-7 rounded-full bg-white/90 hover:bg-white disabled:opacity-30 text-[#0A1F44] flex items-center justify-center"
                  aria-label="Sposta a destra"
                >
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  data-testid={`${testIdPrefix}-image-remove-${idx}`}
                  onClick={() => removeImage(idx)}
                  className="w-7 h-7 rounded-full bg-red-500 hover:bg-red-600 text-white flex items-center justify-center"
                  aria-label="Rimuovi"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : null}

      <label
        data-testid={`${testIdPrefix}-dropzone`}
        htmlFor={`${testIdPrefix}-image-file`}
        onDragOver={(e) => e.preventDefault()}
        onDrop={onDrop}
        className="flex flex-col items-center justify-center gap-2 px-4 py-6 border-2 border-dashed border-gray-200 rounded-lg cursor-pointer hover:border-[#0FB36B] hover:bg-[#0FB36B]/5 transition-colors"
      >
        {uploading ? (
          <>
            <Loader2 className="w-6 h-6 text-[#0FB36B] animate-spin" />
            <span className="text-sm text-gray-600">Caricamento in corso…</span>
          </>
        ) : (
          <>
            <Upload className="w-6 h-6 text-[#0FB36B]" />
            <span className="text-sm font-semibold text-[#0A1F44]">
              {images.length > 0
                ? "Aggiungi altre immagini"
                : "Clicca per caricare immagini"}
            </span>
            <span className="text-xs text-gray-500">
              puoi selezionarne più di una · JPG/PNG/WEBP/GIF · max 8 MB ciascuna
            </span>
          </>
        )}
        <input
          id={`${testIdPrefix}-image-file`}
          data-testid={`${testIdPrefix}-image-file`}
          type="file"
          accept="image/png,image/jpeg,image/webp,image/gif"
          multiple
          className="hidden"
          onChange={onFileChange}
          disabled={uploading}
        />
      </label>

      {uploadError ? (
        <p
          data-testid={`${testIdPrefix}-image-error`}
          className="mt-2 text-xs text-red-600 flex items-center gap-1.5"
        >
          <AlertCircle className="w-3.5 h-3.5" />
          {uploadError}
        </p>
      ) : null}

      <details className="mt-2">
        <summary className="text-xs text-gray-500 cursor-pointer hover:text-[#0A1F44]">
          …oppure incolla un URL esterno
        </summary>
        <div className="mt-2 flex gap-2">
          <input
            data-testid={`${testIdPrefix}-image-input`}
            value={externalUrl}
            onChange={(e) => setExternalUrl(e.target.value)}
            placeholder="https://…"
            className="flex-1 px-4 h-10 text-sm border border-gray-200 rounded-md focus:outline-none focus:border-[#0FB36B] focus:ring-2 focus:ring-[#0FB36B]/10 transition"
          />
          <button
            type="button"
            onClick={addExternalUrl}
            disabled={!externalUrl.trim()}
            className="h-10 px-4 bg-[#0A1F44] hover:bg-[#0d2855] disabled:opacity-40 text-white text-sm font-semibold rounded-md transition-colors"
          >
            Aggiungi
          </button>
        </div>
      </details>
    </div>
  );
};

export default ImageUploader;
