import React, { useEffect, useState } from "react";
import {
  Trash2,
  Plus,
  LogOut,
  Facebook,
  Calendar,
  Image as ImageIcon,
  Upload,
  X,
  CheckCircle2,
  AlertCircle,
  Loader2,
} from "lucide-react";
import Seo from "../components/Seo";

const API_URL = process.env.REACT_APP_BACKEND_URL;
const TOKEN_STORAGE_KEY = "energeide_admin_token";

const resolveImageUrl = (url) => {
  if (!url) return "";
  if (url.startsWith("http://") || url.startsWith("https://")) return url;
  if (url.startsWith("/")) return `${API_URL}${url}`;
  return url;
};

const useAdminToken = () => {
  const [token, setToken] = useState(() =>
    typeof window !== "undefined" ? localStorage.getItem(TOKEN_STORAGE_KEY) : null
  );

  const save = (value) => {
    if (value) {
      localStorage.setItem(TOKEN_STORAGE_KEY, value);
    } else {
      localStorage.removeItem(TOKEN_STORAGE_KEY);
    }
    setToken(value);
  };

  return [token, save];
};

const LoginForm = ({ onLogin }) => {
  const [value, setValue] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/api/admin/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token: value }),
      });
      if (!res.ok) {
        setError("Token non valido. Riprova.");
        return;
      }
      onLogin(value);
    } catch (err) {
      setError("Errore di rete. Riprova.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4 py-12 bg-gray-50">
      <form
        data-testid="admin-login-form"
        onSubmit={submit}
        className="w-full max-w-sm bg-white rounded-2xl shadow-lg p-8 border border-gray-100"
      >
        <h1 className="text-2xl font-montserrat font-bold text-[#0A1F44] mb-1">
          Area Riservata
        </h1>
        <p className="text-sm text-gray-500 mb-6">
          Inserisci il token amministratore per gestire il blog.
        </p>
        <label className="block text-xs font-semibold text-[#0A1F44] mb-2 uppercase tracking-wider">
          Admin Token
        </label>
        <input
          data-testid="admin-token-input"
          type="password"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          autoFocus
          className="w-full px-4 h-11 border border-gray-200 rounded-md focus:outline-none focus:border-[#0FB36B] focus:ring-2 focus:ring-[#0FB36B]/10 transition"
          placeholder="••••••••••••"
          required
        />
        {error ? (
          <div
            data-testid="admin-login-error"
            className="mt-3 flex items-center gap-2 text-sm text-red-600"
          >
            <AlertCircle className="w-4 h-4" />
            {error}
          </div>
        ) : null}
        <button
          data-testid="admin-login-submit"
          type="submit"
          disabled={loading || !value}
          className="mt-5 w-full h-11 bg-[#0A1F44] hover:bg-[#0d2855] disabled:opacity-50 text-white rounded-md font-montserrat font-semibold text-sm transition-colors"
        >
          {loading ? "Verifica…" : "Accedi"}
        </button>
      </form>
    </div>
  );
};

const PostForm = ({ token, onCreated }) => {
  const [form, setForm] = useState({
    title: "",
    content: "",
    image_url: "",
    facebook_url: "",
  });
  const [saving, setSaving] = useState(false);
  const [feedback, setFeedback] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState("");

  const update = (k) => (e) => setForm((s) => ({ ...s, [k]: e.target.value }));

  const uploadFile = async (file) => {
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      setUploadError("Seleziona un file immagine (JPG, PNG, WEBP, GIF).");
      return;
    }
    if (file.size > 8 * 1024 * 1024) {
      setUploadError("File troppo grande. Max 8 MB.");
      return;
    }

    setUploadError("");
    setUploading(true);
    try {
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
        setUploadError(detail);
        return;
      }
      const result = await res.json();
      setForm((s) => ({ ...s, image_url: result.url }));
    } catch (err) {
      setUploadError("Errore di rete durante l'upload.");
    } finally {
      setUploading(false);
    }
  };

  const onFileChange = (e) => {
    const file = e.target.files?.[0];
    uploadFile(file);
    e.target.value = "";  // permette di ricaricare lo stesso file
  };

  const onDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    uploadFile(file);
  };

  const clearImage = () => setForm((s) => ({ ...s, image_url: "" }));

  const submit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setFeedback(null);
    try {
      const res = await fetch(`${API_URL}/api/posts`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Admin-Token": token,
        },
        body: JSON.stringify(form),
      });
      if (!res.ok) {
        setFeedback({ type: "error", text: "Errore nel salvataggio." });
        return;
      }
      const data = await res.json();
      setFeedback({ type: "success", text: "Post pubblicato!" });
      setForm({ title: "", content: "", image_url: "", facebook_url: "" });
      onCreated?.(data);
    } catch (err) {
      setFeedback({ type: "error", text: "Errore di rete." });
    } finally {
      setSaving(false);
    }
  };

  return (
    <form
      data-testid="admin-post-form"
      onSubmit={submit}
      className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sm:p-8 space-y-4"
    >
      <h2 className="text-xl font-montserrat font-bold text-[#0A1F44] flex items-center gap-2">
        <Plus className="w-5 h-5 text-[#0FB36B]" />
        Nuovo Post
      </h2>

      <div>
        <label className="block text-xs font-semibold text-[#0A1F44] mb-1.5 uppercase tracking-wider">
          Titolo *
        </label>
        <input
          data-testid="post-title-input"
          required
          value={form.title}
          onChange={update("title")}
          placeholder="Titolo del post"
          className="w-full px-4 h-11 border border-gray-200 rounded-md focus:outline-none focus:border-[#0FB36B] focus:ring-2 focus:ring-[#0FB36B]/10 transition"
        />
      </div>

      <div>
        <label className="block text-xs font-semibold text-[#0A1F44] mb-1.5 uppercase tracking-wider">
          Contenuto *
        </label>
        <textarea
          data-testid="post-content-input"
          required
          value={form.content}
          onChange={update("content")}
          rows={6}
          placeholder="Copia qui il testo del post di Facebook…"
          className="w-full px-4 py-3 border border-gray-200 rounded-md focus:outline-none focus:border-[#0FB36B] focus:ring-2 focus:ring-[#0FB36B]/10 transition resize-y"
        />
      </div>

      <div>
        <label className="text-xs font-semibold text-[#0A1F44] mb-1.5 uppercase tracking-wider flex items-center gap-1.5">
          <ImageIcon className="w-3.5 h-3.5" />
          Immagine del post
        </label>

        {form.image_url ? (
          <div
            data-testid="post-image-preview"
            className="relative rounded-lg overflow-hidden border border-gray-200 bg-gray-50"
          >
            <img
              src={resolveImageUrl(form.image_url)}
              alt="Anteprima"
              className="w-full max-h-64 object-cover"
            />
            <button
              type="button"
              data-testid="post-image-remove"
              onClick={clearImage}
              className="absolute top-2 right-2 w-8 h-8 rounded-full bg-black/60 hover:bg-black/80 text-white flex items-center justify-center transition-colors"
              aria-label="Rimuovi immagine"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <label
            data-testid="post-image-dropzone"
            htmlFor="post-image-file"
            onDragOver={(e) => e.preventDefault()}
            onDrop={onDrop}
            className="flex flex-col items-center justify-center gap-2 px-4 py-8 border-2 border-dashed border-gray-200 rounded-lg cursor-pointer hover:border-[#0FB36B] hover:bg-[#0FB36B]/5 transition-colors"
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
                  Clicca per caricare un'immagine
                </span>
                <span className="text-xs text-gray-500">
                  oppure trascinala qui · JPG/PNG/WEBP/GIF · max 8 MB
                </span>
              </>
            )}
            <input
              id="post-image-file"
              data-testid="post-image-file"
              type="file"
              accept="image/png,image/jpeg,image/webp,image/gif"
              className="hidden"
              onChange={onFileChange}
              disabled={uploading}
            />
          </label>
        )}

        {uploadError ? (
          <p
            data-testid="post-image-error"
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
          <input
            data-testid="post-image-input"
            value={form.image_url}
            onChange={update("image_url")}
            placeholder="https://…"
            className="mt-2 w-full px-4 h-10 text-sm border border-gray-200 rounded-md focus:outline-none focus:border-[#0FB36B] focus:ring-2 focus:ring-[#0FB36B]/10 transition"
          />
        </details>
      </div>

      <div>
        <label className="text-xs font-semibold text-[#0A1F44] mb-1.5 uppercase tracking-wider flex items-center gap-1.5">
          <Facebook className="w-3.5 h-3.5" />
          URL Post Facebook (opzionale)
        </label>
        <input
          data-testid="post-facebook-input"
          value={form.facebook_url}
          onChange={update("facebook_url")}
          placeholder="https://facebook.com/…"
          className="w-full px-4 h-11 border border-gray-200 rounded-md focus:outline-none focus:border-[#0FB36B] focus:ring-2 focus:ring-[#0FB36B]/10 transition"
        />
      </div>

      {feedback ? (
        <div
          data-testid="post-form-feedback"
          className={`flex items-center gap-2 text-sm ${
            feedback.type === "success" ? "text-[#0FB36B]" : "text-red-600"
          }`}
        >
          {feedback.type === "success" ? (
            <CheckCircle2 className="w-4 h-4" />
          ) : (
            <AlertCircle className="w-4 h-4" />
          )}
          {feedback.text}
        </div>
      ) : null}

      <button
        data-testid="post-submit-button"
        type="submit"
        disabled={saving}
        className="inline-flex items-center justify-center gap-2 h-11 px-6 bg-[#F4C542] hover:bg-[#e6b838] disabled:opacity-50 text-[#0A1F44] rounded-md font-montserrat font-bold text-sm shadow-md transition-colors"
      >
        {saving ? "Pubblicazione…" : "Pubblica Post"}
      </button>
    </form>
  );
};

const PostList = ({ posts, token, onDelete }) => {
  const [deletingId, setDeletingId] = useState(null);

  const remove = async (id) => {
    if (!window.confirm("Eliminare questo post?")) return;
    setDeletingId(id);
    try {
      const res = await fetch(`${API_URL}/api/posts/${id}`, {
        method: "DELETE",
        headers: { "X-Admin-Token": token },
      });
      if (res.ok) onDelete?.(id);
    } finally {
      setDeletingId(null);
    }
  };

  if (posts.length === 0) {
    return (
      <p
        data-testid="admin-no-posts"
        className="text-sm text-gray-500 italic py-6 text-center bg-gray-50 rounded-xl"
      >
        Ancora nessun post pubblicato.
      </p>
    );
  }

  return (
    <ul data-testid="admin-posts-list" className="space-y-3">
      {posts.map((p) => (
        <li
          key={p.id}
          className="bg-white border border-gray-100 rounded-xl p-4 flex items-start gap-4"
        >
          {p.image_url ? (
            <img
              src={resolveImageUrl(p.image_url)}
              alt=""
              className="w-16 h-16 rounded-lg object-cover shrink-0"
            />
          ) : (
            <div className="w-16 h-16 rounded-lg bg-gray-100 shrink-0 flex items-center justify-center">
              <ImageIcon className="w-5 h-5 text-gray-300" />
            </div>
          )}
          <div className="flex-1 min-w-0">
            <p className="font-montserrat font-semibold text-[#0A1F44] text-sm truncate">
              {p.title}
            </p>
            <p className="text-xs text-gray-500 flex items-center gap-1 mt-0.5">
              <Calendar className="w-3 h-3" />
              {new Date(p.published_at).toLocaleDateString("it-IT")}
            </p>
            <p className="text-sm text-gray-600 mt-1 line-clamp-2">
              {p.content}
            </p>
          </div>
          <button
            data-testid={`delete-post-${p.id}`}
            type="button"
            onClick={() => remove(p.id)}
            disabled={deletingId === p.id}
            className="text-red-500 hover:text-red-700 disabled:opacity-50 p-2 transition-colors"
            aria-label="Elimina post"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </li>
      ))}
    </ul>
  );
};

const Admin = () => {
  const [token, setToken] = useAdminToken();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);

  const reload = () => {
    setLoading(true);
    fetch(`${API_URL}/api/posts`)
      .then((r) => (r.ok ? r.json() : []))
      .then((data) => setPosts(Array.isArray(data) ? data : []))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    if (token) reload();
  }, [token]);

  if (!token) {
    return (
      <>
        <Seo title="Area Riservata" path="/admin" />
        <LoginForm onLogin={setToken} />
      </>
    );
  }

  return (
    <>
      <Seo title="Area Riservata" path="/admin" />
      <div className="min-h-[70vh] bg-gray-50 py-10 sm:py-14">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <p className="text-xs text-[#0FB36B] font-montserrat font-semibold tracking-[0.2em] mb-1">
                AREA RISERVATA
              </p>
              <h1 className="text-3xl font-montserrat font-bold text-[#0A1F44]">
                Gestione Blog
              </h1>
            </div>
            <button
              data-testid="admin-logout"
              type="button"
              onClick={() => setToken(null)}
              className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-[#0A1F44] transition-colors"
            >
              <LogOut className="w-4 h-4" />
              Esci
            </button>
          </div>

          <div className="grid lg:grid-cols-5 gap-8 items-start">
            <div className="lg:col-span-3">
              <PostForm
                token={token}
                onCreated={(p) => setPosts((s) => [p, ...s])}
              />
            </div>
            <div className="lg:col-span-2">
              <h2 className="text-sm font-montserrat font-bold text-[#0A1F44] uppercase tracking-wider mb-3">
                Post Pubblicati
              </h2>
              {loading ? (
                <p className="text-sm text-gray-400">Caricamento…</p>
              ) : (
                <PostList
                  posts={posts}
                  token={token}
                  onDelete={(id) =>
                    setPosts((s) => s.filter((p) => p.id !== id))
                  }
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Admin;
