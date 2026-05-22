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
} from "lucide-react";
import Seo from "../components/Seo";
import ImageUploader, { resolveImageUrl } from "../components/ImageUploader";

const API_URL = process.env.REACT_APP_BACKEND_URL;
const TOKEN_STORAGE_KEY = "energeide_admin_token";
const PROJECT_TYPES = ["Residenziale", "Commerciale", "Industriale"];

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
// BLOG POST FORM
// -------------------------------------------------------------------
const PostForm = ({ token, onCreated }) => {
  const [form, setForm] = useState({
    title: "",
    content: "",
    images: [],
    facebook_url: "",
  });
  const [saving, setSaving] = useState(false);
  const [feedback, setFeedback] = useState(null);

  const update = (k) => (e) => setForm((s) => ({ ...s, [k]: e.target.value }));
  const setImages = (images) => setForm((s) => ({ ...s, images }));

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
      setForm({ title: "", content: "", images: [], facebook_url: "" });
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

      <Feedback feedback={feedback} />

      <button
        data-testid="post-submit-button"
        type="submit"
        disabled={saving || !form.title || !form.content}
        className="inline-flex items-center justify-center gap-2 h-11 px-6 bg-[#F4C542] hover:bg-[#e6b838] disabled:opacity-50 text-[#0A1F44] rounded-md font-montserrat font-bold text-sm shadow-md transition-colors"
      >
        {saving ? "Pubblicazione…" : "Pubblica Post"}
      </button>
    </form>
  );
};

// -------------------------------------------------------------------
// PROJECT FORM
// -------------------------------------------------------------------
const ProjectForm = ({ token, onCreated }) => {
  const empty = {
    title: "",
    location: "",
    region: "",
    type: "Residenziale",
    power: "",
    storage: "",
    year: String(new Date().getFullYear()),
    description: "",
    images: [],
  };
  const [form, setForm] = useState(empty);
  const [saving, setSaving] = useState(false);
  const [feedback, setFeedback] = useState(null);

  const update = (k) => (e) => setForm((s) => ({ ...s, [k]: e.target.value }));
  const setImages = (images) => setForm((s) => ({ ...s, images }));

  const submit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setFeedback(null);
    try {
      const res = await fetch(`${API_URL}/api/admin/projects`, {
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
      setFeedback({ type: "success", text: "Progetto pubblicato!" });
      setForm(empty);
      onCreated?.({ ...form, id: data.id });
    } catch (err) {
      setFeedback({ type: "error", text: "Errore di rete." });
    } finally {
      setSaving(false);
    }
  };

  return (
    <form
      data-testid="admin-project-form"
      onSubmit={submit}
      className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sm:p-8 space-y-4"
    >
      <h2 className="text-xl font-montserrat font-bold text-[#0A1F44] flex items-center gap-2">
        <Plus className="w-5 h-5 text-[#0FB36B]" />
        Nuovo Progetto
      </h2>

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
        <FieldLabel icon={Calendar}>Anno installazione</FieldLabel>
        <TextInput
          testid="project-year-input"
          value={form.year}
          onChange={update("year")}
          placeholder="Es. 2025"
        />
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
        {saving ? "Pubblicazione…" : "Pubblica Progetto"}
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

const ProjectList = ({ projects, token, onDelete }) => {
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
          className="bg-white border border-gray-100 rounded-xl p-4 flex items-start gap-4"
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
                  onCreated={(p) => setPosts((s) => [p, ...s])}
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
                    onDelete={(id) =>
                      setPosts((s) => s.filter((p) => p.id !== id))
                    }
                  />
                )}
              </div>
            </div>
          ) : (
            <div className="grid lg:grid-cols-5 gap-8 items-start">
              <div className="lg:col-span-3">
                <ProjectForm token={token} onCreated={() => reloadProjects()} />
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
                    onDelete={(id) =>
                      setProjects((s) => s.filter((p) => p.id !== id))
                    }
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
