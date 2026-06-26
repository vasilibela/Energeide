import React, { useEffect, useState } from "react";
import {
  Trash2,
  Plus,
  LogOut,
  Facebook,
  Calendar,
  Image as ImageIcon,
  Newspaper,
  Building2,
  Sun,
  MapPin,
  Battery,
  CheckCircle2,
  AlertCircle,
  Pencil,
  X as XIcon,
} from "lucide-react";
import Seo from "../components/Seo";
import ImageUploader, { resolveImageUrl } from "../components/ImageUploader";

const API_URL = process.env.REACT_APP_BACKEND_URL;
const TOKEN_STORAGE_KEY = "energeide_admin_token";
const PROJECT_TYPES = ["Residenziale", "Commerciale", "Industriale"];
const MONTHS_IT = [
  "Gennaio", "Febbraio", "Marzo", "Aprile", "Maggio", "Giugno",
  "Luglio", "Agosto", "Settembre", "Ottobre", "Novembre", "Dicembre",
];

const parseItalianMonthYear = (value) => {
  if (!value) return { month: "", year: String(new Date().getFullYear()) };
  const text = String(value).trim();
  const yearMatch = text.match(/(20\d{2}|19\d{2})/);
  const year = yearMatch ? yearMatch[1] : String(new Date().getFullYear());
  const lower = text.toLowerCase();
  const month = MONTHS_IT.find((m) => lower.includes(m.toLowerCase())) || "";
  return { month, year };
};

const formatItalianMonthYear = (month, year) => {
  if (month && year) return `${month} ${year}`;
  if (year) return year;
  return "";
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
          Inserisci il token amministratore per gestire il sito.
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

const FieldLabel = ({ children, icon: Icon }) => (
  <label className="text-xs font-semibold text-[#0A1F44] mb-1.5 uppercase tracking-wider flex items-center gap-1.5">
    {Icon ? <Icon className="w-3.5 h-3.5" /> : null}
    {children}
  </label>
);

const TextInput = ({ testid, value, onChange, placeholder, type = "text" }) => (
  <input
    data-testid={testid}
    type={type}
    value={value}
    onChange={onChange}
    placeholder={placeholder}
    className="w-full px-4 h-11 border border-gray-200 rounded-md focus:outline-none focus:border-[#0FB36B] focus:ring-2 focus:ring-[#0FB36B]/10 transition"
  />
);

const Feedback = ({ feedback }) =>
  feedback ? (
    <div
      data-testid="form-feedback"
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
  ) : null;

// -------------------------------------------------------------------
// BLOG POST FORM (create + edit)
// -------------------------------------------------------------------
const PostForm = ({ token, onSaved, editing, onCancelEdit }) => {
  const isEdit = Boolean(editing);
  const emptyForm = {
    title: "",
    content: "",
    images: [],
    facebook_url: "",
    published_at: "",
    publish_to_facebook: true,
  };
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [feedback, setFeedback] = useState(null);

  useEffect(() => {
    if (editing) {
      const pa = editing.published_at
        ? new Date(editing.published_at).toISOString().slice(0, 10)
        : "";
      setForm({
        title: editing.title || "",
        content: editing.content || "",
        images: Array.isArray(editing.images)
          ? [...editing.images]
          : editing.image_url
          ? [editing.image_url]
          : [],
        facebook_url: editing.facebook_url || "",
        published_at: pa,
      });
    } else {
      setForm(emptyForm);
    }
    setFeedback(null);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [editing]);

  const update = (k) => (e) => setForm((s) => ({ ...s, [k]: e.target.value }));
  const setImages = (images) => setForm((s) => ({ ...s, images }));

  const submit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setFeedback(null);
    try {
      const url = isEdit
        ? `${API_URL}/api/posts/${editing.id}`
        : `${API_URL}/api/posts`;
      const method = isEdit ? "PUT" : "POST";
      const body = {
        title: form.title,
        content: form.content,
        images: form.images,
        facebook_url: form.facebook_url,
      };
      // publish_to_facebook: solo in creazione (non si "ri-pubblica" un edit)
      if (!isEdit && form.publish_to_facebook) {
        body.publish_to_facebook = true;
      }
      // published_at: solo in edit (per cambiare la data del post)
      if (isEdit && form.published_at) {
        body.published_at = new Date(form.published_at + "T12:00:00").toISOString();
      }
      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          "X-Admin-Token": token,
        },
        body: JSON.stringify(body),
      });
      if (!res.ok) {
        setFeedback({ type: "error", text: "Errore nel salvataggio." });
        return;
      }
      const data = await res.json();
      setFeedback({
        type: "success",
        text: isEdit ? "Post aggiornato!" : "Post pubblicato!",
      });
      if (!isEdit) setForm(emptyForm);
      onSaved?.(data, isEdit);
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
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-montserrat font-bold text-[#0A1F44] flex items-center gap-2">
          {isEdit ? (
            <Pencil className="w-5 h-5 text-[#F4C542]" />
          ) : (
            <Plus className="w-5 h-5 text-[#0FB36B]" />
          )}
          {isEdit ? "Modifica Post" : "Nuovo Post"}
        </h2>
        {isEdit ? (
          <button
            type="button"
            onClick={onCancelEdit}
            className="text-xs text-gray-500 hover:text-[#0A1F44] inline-flex items-center gap-1"
          >
            <XIcon className="w-3.5 h-3.5" />
            Annulla
          </button>
        ) : null}
      </div>

      <div>
        <FieldLabel>Titolo *</FieldLabel>
        <TextInput
          testid="post-title-input"
          value={form.title}
          onChange={update("title")}
          placeholder="Titolo del post"
        />
      </div>

      <div>
        <FieldLabel>Contenuto *</FieldLabel>
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

      <ImageUploader
        token={token}
        images={form.images}
        onChange={setImages}
        label="Immagini del post"
        testIdPrefix="post"
      />

      <div>
        <FieldLabel icon={Facebook}>URL Post Facebook (opzionale)</FieldLabel>
        <TextInput
          testid="post-facebook-input"
          value={form.facebook_url}
          onChange={update("facebook_url")}
          placeholder="https://facebook.com/…"
        />
      </div>

      {isEdit ? (
        <div>
          <FieldLabel icon={Calendar}>Data di pubblicazione</FieldLabel>
          <input
            data-testid="post-date-input"
            type="date"
            value={form.published_at}
            onChange={update("published_at")}
            className="w-full px-4 h-11 border border-gray-200 rounded-md focus:outline-none focus:border-[#0FB36B] focus:ring-2 focus:ring-[#0FB36B]/10 transition"
          />
          <p className="text-[11px] text-gray-400 mt-1">
            Cambiando la data, il post si riordina nella lista pubblica.
          </p>
        </div>
      ) : (
        <label
          className="flex items-start gap-3 bg-[#1877F2]/5 border border-[#1877F2]/20 rounded-md p-3 cursor-pointer hover:bg-[#1877F2]/10 transition-colors"
          data-testid="publish-fb-toggle"
        >
          <input
            type="checkbox"
            checked={form.publish_to_facebook}
            onChange={(e) =>
              setForm((s) => ({ ...s, publish_to_facebook: e.target.checked }))
            }
            className="mt-0.5 w-4 h-4 rounded border-gray-300 text-[#1877F2] focus:ring-[#1877F2]"
          />
          <div className="flex-1">
            <p className="text-sm font-montserrat font-semibold text-[#0A1F44] flex items-center gap-1.5">
              <Facebook className="w-4 h-4 text-[#1877F2]" />
              Pubblica anche sulla Pagina Facebook
            </p>
            <p className="text-[11px] text-gray-500 mt-0.5">
              Pubblica testo + copertina sulla pagina Facebook di Energeide al
              momento del salvataggio.
            </p>
          </div>
        </label>
      )}

      <Feedback feedback={feedback} />

      <button
        data-testid="post-submit-button"
        type="submit"
        disabled={saving || !form.title || !form.content}
        className="inline-flex items-center justify-center gap-2 h-11 px-6 bg-[#F4C542] hover:bg-[#e6b838] disabled:opacity-50 text-[#0A1F44] rounded-md font-montserrat font-bold text-sm shadow-md transition-colors"
      >
        {saving ? "Salvataggio…" : isEdit ? "Salva Modifiche" : "Pubblica Post"}
      </button>
    </form>
  );
};

// -------------------------------------------------------------------
// PROJECT FORM (create + edit)
// -------------------------------------------------------------------
const ProjectForm = ({ token, onSaved, editing, onCancelEdit }) => {
  const isEdit = Boolean(editing);
  const currentYear = String(new Date().getFullYear());
  const buildEmpty = () => ({
    title: "",
    location: "",
    region: "",
    type: "Residenziale",
    power: "",
    storage: "",
    month: MONTHS_IT[new Date().getMonth()],
    year: currentYear,
    description: "",
    images: [],
  });
  const [form, setForm] = useState(buildEmpty());
  const [saving, setSaving] = useState(false);
  const [feedback, setFeedback] = useState(null);

  useEffect(() => {
    if (editing) {
      const { month, year } = parseItalianMonthYear(editing.year);
      setForm({
        title: editing.title || "",
        location: editing.location || "",
        region: editing.region || "",
        type: editing.type || "Residenziale",
        power: editing.power || "",
        storage: editing.storage || "",
        month,
        year,
        description: editing.description || "",
        images: Array.isArray(editing.images)
          ? [...editing.images]
          : editing.image
          ? [editing.image]
          : [],
      });
    } else {
      setForm(buildEmpty());
    }
    setFeedback(null);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [editing]);

  const update = (k) => (e) => setForm((s) => ({ ...s, [k]: e.target.value }));
  const setImages = (images) => setForm((s) => ({ ...s, images }));

  const submit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setFeedback(null);
    try {
      const body = {
        title: form.title,
        location: form.location,
        region: form.region,
        type: form.type,
        power: form.power,
        storage: form.storage,
        year: formatItalianMonthYear(form.month, form.year),
        description: form.description,
        images: form.images,
      };
      const url = isEdit
        ? `${API_URL}/api/admin/projects/${editing.id}`
        : `${API_URL}/api/admin/projects`;
      const method = isEdit ? "PUT" : "POST";
      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          "X-Admin-Token": token,
        },
        body: JSON.stringify(body),
      });
      if (!res.ok) {
        setFeedback({ type: "error", text: "Errore nel salvataggio." });
        return;
      }
      setFeedback({
        type: "success",
        text: isEdit ? "Progetto aggiornato!" : "Progetto pubblicato!",
      });
      if (!isEdit) setForm(buildEmpty());
      onSaved?.(isEdit);
    } catch (err) {
      setFeedback({ type: "error", text: "Errore di rete." });
    } finally {
      setSaving(false);
    }
  };

  // Genera lista anni dal corrente fino a 10 anni indietro
  const yearOptions = Array.from({ length: 12 }, (_, i) =>
    String(parseInt(currentYear, 10) - i + 2)
  );

  return (
    <form
      data-testid="admin-project-form"
      onSubmit={submit}
      className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sm:p-8 space-y-4"
    >
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-montserrat font-bold text-[#0A1F44] flex items-center gap-2">
          {isEdit ? (
            <Pencil className="w-5 h-5 text-[#F4C542]" />
          ) : (
            <Plus className="w-5 h-5 text-[#0FB36B]" />
          )}
          {isEdit ? "Modifica Progetto" : "Nuovo Progetto"}
        </h2>
        {isEdit ? (
          <button
            type="button"
            onClick={onCancelEdit}
            className="text-xs text-gray-500 hover:text-[#0A1F44] inline-flex items-center gap-1"
          >
            <XIcon className="w-3.5 h-3.5" />
            Annulla
          </button>
        ) : null}
      </div>

      <div>
        <FieldLabel>Titolo *</FieldLabel>
        <TextInput
          testid="project-title-input"
          value={form.title}
          onChange={update("title")}
          placeholder="Es. Impianto fotovoltaico 6 kW residenziale"
        />
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <FieldLabel icon={MapPin}>Località</FieldLabel>
          <TextInput
            testid="project-location-input"
            value={form.location}
            onChange={update("location")}
            placeholder="Es. Quadrelle (AV)"
          />
        </div>
        <div>
          <FieldLabel>Regione</FieldLabel>
          <TextInput
            testid="project-region-input"
            value={form.region}
            onChange={update("region")}
            placeholder="Es. Campania"
          />
        </div>
      </div>

      <div className="grid sm:grid-cols-3 gap-4">
        <div>
          <FieldLabel>Tipo</FieldLabel>
          <select
            data-testid="project-type-input"
            value={form.type}
            onChange={update("type")}
            className="w-full px-4 h-11 border border-gray-200 rounded-md focus:outline-none focus:border-[#0FB36B] focus:ring-2 focus:ring-[#0FB36B]/10 transition bg-white"
          >
            {PROJECT_TYPES.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
        </div>
        <div>
          <FieldLabel icon={Sun}>Potenza</FieldLabel>
          <TextInput
            testid="project-power-input"
            value={form.power}
            onChange={update("power")}
            placeholder="Es. 6 kW"
          />
        </div>
        <div>
          <FieldLabel icon={Battery}>Accumulo</FieldLabel>
          <TextInput
            testid="project-storage-input"
            value={form.storage}
            onChange={update("storage")}
            placeholder="Es. 10 kWh"
          />
        </div>
      </div>

      <div>
        <FieldLabel icon={Calendar}>Data installazione</FieldLabel>
        <div className="grid grid-cols-2 gap-2">
          <select
            data-testid="project-month-input"
            value={form.month}
            onChange={update("month")}
            className="w-full px-4 h-11 border border-gray-200 rounded-md focus:outline-none focus:border-[#0FB36B] focus:ring-2 focus:ring-[#0FB36B]/10 transition bg-white"
          >
            <option value="">— Mese —</option>
            {MONTHS_IT.map((m) => (
              <option key={m} value={m}>
                {m}
              </option>
            ))}
          </select>
          <select
            data-testid="project-year-input"
            value={form.year}
            onChange={update("year")}
            className="w-full px-4 h-11 border border-gray-200 rounded-md focus:outline-none focus:border-[#0FB36B] focus:ring-2 focus:ring-[#0FB36B]/10 transition bg-white"
          >
            {yearOptions.map((y) => (
              <option key={y} value={y}>
                {y}
              </option>
            ))}
          </select>
        </div>
        <p className="text-[11px] text-gray-400 mt-1">
          Determina l&apos;ordine dei progetti sulla pagina (più recenti prima).
        </p>
      </div>

      <div>
        <FieldLabel>Descrizione</FieldLabel>
        <textarea
          data-testid="project-description-input"
          value={form.description}
          onChange={update("description")}
          rows={4}
          placeholder="Descrizione del progetto…"
          className="w-full px-4 py-3 border border-gray-200 rounded-md focus:outline-none focus:border-[#0FB36B] focus:ring-2 focus:ring-[#0FB36B]/10 transition resize-y"
        />
      </div>

      <ImageUploader
        token={token}
        images={form.images}
        onChange={setImages}
        label="Foto del progetto"
        testIdPrefix="project"
      />

      <Feedback feedback={feedback} />

      <button
        data-testid="project-submit-button"
        type="submit"
        disabled={saving || !form.title}
        className="inline-flex items-center justify-center gap-2 h-11 px-6 bg-[#F4C542] hover:bg-[#e6b838] disabled:opacity-50 text-[#0A1F44] rounded-md font-montserrat font-bold text-sm shadow-md transition-colors"
      >
        {saving ? "Salvataggio…" : isEdit ? "Salva Modifiche" : "Pubblica Progetto"}
      </button>
    </form>
  );
};

// -------------------------------------------------------------------
// LISTE
// -------------------------------------------------------------------
const ItemImage = ({ images, fallbackUrl }) => {
  const cover = (Array.isArray(images) && images[0]) || fallbackUrl || "";
  const count = Array.isArray(images) ? images.length : fallbackUrl ? 1 : 0;
  return cover ? (
    <div className="relative shrink-0">
      <img
        src={resolveImageUrl(cover)}
        alt=""
        className="w-16 h-16 rounded-lg object-cover"
      />
      {count > 1 ? (
        <span className="absolute -bottom-1 -right-1 bg-[#0A1F44] text-white text-[10px] font-bold rounded-full w-5 h-5 flex items-center justify-center border-2 border-white">
          {count}
        </span>
      ) : null}
    </div>
  ) : (
    <div className="w-16 h-16 rounded-lg bg-gray-100 shrink-0 flex items-center justify-center">
      <ImageIcon className="w-5 h-5 text-gray-300" />
    </div>
  );
};

const PostList = ({ posts, token, onDelete, onEdit, editingId }) => {
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
          className={`bg-white border rounded-xl p-4 flex items-start gap-4 transition-colors ${
            editingId === p.id ? "border-[#F4C542] ring-2 ring-[#F4C542]/20" : "border-gray-100"
          }`}
        >
          <ItemImage images={p.images} fallbackUrl={p.image_url} />
          <div className="flex-1 min-w-0">
            <p className="font-montserrat font-semibold text-[#0A1F44] text-sm truncate">
              {p.title}
            </p>
            <p className="text-xs text-gray-500 flex items-center gap-1 mt-0.5">
              <Calendar className="w-3 h-3" />
              {new Date(p.published_at).toLocaleDateString("it-IT")}
            </p>
            <p className="text-sm text-gray-600 mt-1 line-clamp-2">{p.content}</p>
          </div>
          <div className="flex flex-col gap-1">
            <button
              data-testid={`edit-post-${p.id}`}
              type="button"
              onClick={() => onEdit?.(p)}
              className="text-[#0A1F44] hover:text-[#F4C542] p-2 transition-colors"
              aria-label="Modifica post"
            >
              <Pencil className="w-4 h-4" />
            </button>
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
          </div>
        </li>
      ))}
    </ul>
  );
};

const ProjectList = ({ projects, token, onDelete, onEdit, editingId }) => {
  const [deletingId, setDeletingId] = useState(null);

  const remove = async (id) => {
    if (!window.confirm("Eliminare questo progetto?")) return;
    setDeletingId(id);
    try {
      const res = await fetch(`${API_URL}/api/admin/projects/${id}`, {
        method: "DELETE",
        headers: { "X-Admin-Token": token },
      });
      if (res.ok) onDelete?.(id);
    } finally {
      setDeletingId(null);
    }
  };

  if (projects.length === 0) {
    return (
      <p
        data-testid="admin-no-projects"
        className="text-sm text-gray-500 italic py-6 text-center bg-gray-50 rounded-xl"
      >
        Nessun progetto pubblicato dal pannello. <br />
        <span className="text-[11px] text-gray-400">
          (I progetti dal Google Sheet restano comunque visibili sul sito)
        </span>
      </p>
    );
  }

  return (
    <ul data-testid="admin-projects-list" className="space-y-3">
      {projects.map((p) => (
        <li
          key={p.id}
          className={`bg-white border rounded-xl p-4 flex items-start gap-4 transition-colors ${
            editingId === p.id ? "border-[#F4C542] ring-2 ring-[#F4C542]/20" : "border-gray-100"
          }`}
        >
          <ItemImage images={p.images} fallbackUrl={p.image} />
          <div className="flex-1 min-w-0">
            <p className="font-montserrat font-semibold text-[#0A1F44] text-sm">
              {p.title}
            </p>
            <p className="text-xs text-gray-500 mt-0.5 truncate">
              {p.location} {p.power ? `· ${p.power}` : ""}{" "}
              {p.year ? `· ${p.year}` : ""}
            </p>
            {p.description ? (
              <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                {p.description}
              </p>
            ) : null}
          </div>
          <div className="flex flex-col gap-1">
            <button
              data-testid={`edit-project-${p.id}`}
              type="button"
              onClick={() => onEdit?.(p)}
              className="text-[#0A1F44] hover:text-[#F4C542] p-2 transition-colors"
              aria-label="Modifica progetto"
            >
              <Pencil className="w-4 h-4" />
            </button>
            <button
              data-testid={`delete-project-${p.id}`}
              type="button"
              onClick={() => remove(p.id)}
              disabled={deletingId === p.id}
              className="text-red-500 hover:text-red-700 disabled:opacity-50 p-2 transition-colors"
              aria-label="Elimina progetto"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </li>
      ))}
    </ul>
  );
};

// -------------------------------------------------------------------
// TAB BAR
// -------------------------------------------------------------------
const Tabs = ({ active, onChange }) => {
  const tabs = [
    { id: "blog", label: "Blog", icon: Newspaper },
    { id: "projects", label: "Progetti", icon: Building2 },
  ];
  return (
    <div
      data-testid="admin-tabs"
      className="inline-flex bg-white border border-gray-200 rounded-xl p-1 mb-8 shadow-sm"
    >
      {tabs.map((t) => {
        const Icon = t.icon;
        const isActive = active === t.id;
        return (
          <button
            key={t.id}
            type="button"
            data-testid={`tab-${t.id}`}
            onClick={() => onChange(t.id)}
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-montserrat font-semibold transition-colors ${
              isActive
                ? "bg-[#0A1F44] text-white"
                : "text-gray-500 hover:text-[#0A1F44]"
            }`}
          >
            <Icon className="w-4 h-4" />
            {t.label}
          </button>
        );
      })}
    </div>
  );
};

// -------------------------------------------------------------------
// MAIN
// -------------------------------------------------------------------
const Admin = () => {
  const [token, setToken] = useAdminToken();
  const [activeTab, setActiveTab] = useState("blog");
  const [posts, setPosts] = useState([]);
  const [projects, setProjects] = useState([]);
  const [loadingPosts, setLoadingPosts] = useState(false);
  const [loadingProjects, setLoadingProjects] = useState(false);
  const [editingPost, setEditingPost] = useState(null);
  const [editingProject, setEditingProject] = useState(null);

  const reloadPosts = () => {
    setLoadingPosts(true);
    fetch(`${API_URL}/api/posts`)
      .then((r) => (r.ok ? r.json() : []))
      .then((data) => setPosts(Array.isArray(data) ? data : []))
      .finally(() => setLoadingPosts(false));
  };

  const reloadProjects = () => {
    setLoadingProjects(true);
    fetch(`${API_URL}/api/admin/projects`, {
      headers: { "X-Admin-Token": token },
    })
      .then((r) => (r.ok ? r.json() : { data: [] }))
      .then((json) => setProjects(Array.isArray(json?.data) ? json.data : []))
      .finally(() => setLoadingProjects(false));
  };

  useEffect(() => {
    if (!token) return;
    reloadPosts();
    reloadProjects();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  // Reset edit state quando cambia tab
  useEffect(() => {
    setEditingPost(null);
    setEditingProject(null);
  }, [activeTab]);

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
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <p className="text-xs text-[#0FB36B] font-montserrat font-semibold tracking-[0.2em] mb-1">
                AREA RISERVATA
              </p>
              <h1 className="text-3xl font-montserrat font-bold text-[#0A1F44]">
                Gestione Contenuti
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

          <Tabs active={activeTab} onChange={setActiveTab} />

          {activeTab === "blog" ? (
            <div className="grid lg:grid-cols-5 gap-8 items-start">
              <div className="lg:col-span-3">
                <PostForm
                  token={token}
                  editing={editingPost}
                  onCancelEdit={() => setEditingPost(null)}
                  onSaved={(_data, isEdit) => {
                    if (isEdit) setEditingPost(null);
                    reloadPosts();
                  }}
                />
              </div>
              <div className="lg:col-span-2">
                <h2 className="text-sm font-montserrat font-bold text-[#0A1F44] uppercase tracking-wider mb-3">
                  Post Pubblicati
                </h2>
                {loadingPosts ? (
                  <p className="text-sm text-gray-400">Caricamento…</p>
                ) : (
                  <PostList
                    posts={posts}
                    token={token}
                    editingId={editingPost?.id}
                    onEdit={(p) => {
                      setEditingPost(p);
                      window.scrollTo({ top: 0, behavior: "smooth" });
                    }}
                    onDelete={(id) => {
                      setPosts((s) => s.filter((p) => p.id !== id));
                      if (editingPost?.id === id) setEditingPost(null);
                    }}
                  />
                )}
              </div>
            </div>
          ) : (
            <div className="grid lg:grid-cols-5 gap-8 items-start">
              <div className="lg:col-span-3">
                <ProjectForm
                  token={token}
                  editing={editingProject}
                  onCancelEdit={() => setEditingProject(null)}
                  onSaved={(isEdit) => {
                    if (isEdit) setEditingProject(null);
                    reloadProjects();
                  }}
                />
              </div>
              <div className="lg:col-span-2">
                <h2 className="text-sm font-montserrat font-bold text-[#0A1F44] uppercase tracking-wider mb-3">
                  Progetti dal Pannello
                </h2>
                {loadingProjects ? (
                  <p className="text-sm text-gray-400">Caricamento…</p>
                ) : (
                  <ProjectList
                    projects={projects}
                    token={token}
                    editingId={editingProject?.id}
                    onEdit={(p) => {
                      setEditingProject(p);
                      window.scrollTo({ top: 0, behavior: "smooth" });
                    }}
                    onDelete={(id) => {
                      setProjects((s) => s.filter((p) => p.id !== id));
                      if (editingProject?.id === id) setEditingProject(null);
                    }}
                  />
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Admin;
