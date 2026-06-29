import React, { useEffect, useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Calendar,
  Facebook,
  ExternalLink,
  Images as ImagesIcon,
  ArrowRight,
} from "lucide-react";
import Seo from "../components/Seo";
import Lightbox from "../components/Lightbox";

const API_URL = process.env.REACT_APP_BACKEND_URL;

const resolveImageUrl = (url) => {
  if (!url) return "";
  if (url.startsWith("http://") || url.startsWith("https://")) return url;
  if (url.startsWith("/")) return `${API_URL}${url}`;
  return url;
};

const getPostImages = (post) => {
  if (Array.isArray(post.images) && post.images.length > 0) return post.images;
  if (post.image_url) return [post.image_url];
  return [];
};

const formatDate = (iso) => {
  try {
    const d = new Date(iso);
    return d.toLocaleDateString("it-IT", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });
  } catch {
    return "";
  }
};

const NewsDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [gallery, setGallery] = useState({ open: false, images: [], index: 0 });

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setNotFound(false);
    fetch(`${API_URL}/api/posts/${id}`)
      .then((r) => {
        if (r.status === 404) {
          setNotFound(true);
          return null;
        }
        return r.ok ? r.json() : null;
      })
      .then((data) => {
        if (!cancelled && data) setPost(data);
      })
      .catch(() => {
        if (!cancelled) setNotFound(true);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [id]);

  const openGallery = (images, index) =>
    setGallery({ open: true, images, index });
  const closeGallery = () => setGallery((g) => ({ ...g, open: false }));
  const prev = () =>
    setGallery((g) => ({
      ...g,
      index: (g.index - 1 + g.images.length) % g.images.length,
    }));
  const next = () =>
    setGallery((g) => ({
      ...g,
      index: (g.index + 1) % g.images.length,
    }));

  if (loading) {
    return (
      <section className="py-20 bg-white">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <div
            data-testid="post-detail-loading"
            className="space-y-4 animate-pulse"
          >
            <div className="h-6 w-32 bg-gray-100 rounded" />
            <div className="h-10 w-3/4 bg-gray-100 rounded" />
            <div className="aspect-[16/9] bg-gray-100 rounded-xl" />
            <div className="h-4 bg-gray-100 rounded" />
            <div className="h-4 w-5/6 bg-gray-100 rounded" />
            <div className="h-4 w-4/6 bg-gray-100 rounded" />
          </div>
        </div>
      </section>
    );
  }

  if (notFound || !post) {
    return (
      <section className="py-20 bg-white">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 text-center">
          <h1
            data-testid="post-not-found"
            className="text-3xl font-montserrat font-bold text-[#0A1F44] mb-3"
          >
            Post non trovato
          </h1>
          <p className="text-gray-600 mb-6">
            Il post che stai cercando non esiste o è stato rimosso.
          </p>
          <button
            type="button"
            onClick={() => navigate("/news")}
            data-testid="post-back-to-blog"
            className="inline-flex items-center gap-2 bg-[#0A1F44] hover:bg-[#0a1f44]/90 text-white rounded-md px-5 h-11 font-montserrat font-semibold text-sm transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Torna al blog
          </button>
        </div>
      </section>
    );
  }

  const images = getPostImages(post).map(resolveImageUrl);
  const cover = images[0];
  const plainText = (post.content || "").slice(0, 160);

  return (
    <>
      <Seo
        title={post.title}
        description={plainText}
        path={`/news/${post.id}`}
        image={cover || undefined}
      />

      <article className="bg-white">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 pt-10 sm:pt-14 pb-4">
          <Link
            to="/news"
            data-testid="post-detail-back"
            className="inline-flex items-center gap-1.5 text-sm font-montserrat font-semibold text-[#0A1F44] hover:text-[#F4C542] transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Torna al blog
          </Link>
        </div>

        <header className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 pb-6">
          <div className="flex items-center gap-2 text-xs text-gray-500 mb-3">
            <Calendar className="w-3.5 h-3.5 text-[#0FB36B]" />
            <time dateTime={post.published_at}>
              {formatDate(post.published_at)}
            </time>
          </div>
          <h1
            data-testid="post-detail-title"
            className="text-3xl sm:text-4xl lg:text-5xl font-montserrat font-bold text-[#0A1F44] leading-tight"
          >
            {post.title}
          </h1>
        </header>

        {cover ? (
          <div className="mx-auto max-w-5xl px-0 sm:px-6 lg:px-8 mb-8">
            <button
              type="button"
              onClick={() => openGallery(images, 0)}
              data-testid="post-detail-cover"
              className="relative w-full aspect-[16/9] overflow-hidden bg-gray-100 sm:rounded-2xl cursor-zoom-in group block"
            >
              <img
                src={cover}
                alt={post.title}
                className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-500"
              />
              {images.length > 1 ? (
                <span className="absolute bottom-3 right-3 inline-flex items-center gap-1.5 bg-black/65 backdrop-blur-sm text-white text-xs font-montserrat font-semibold px-2.5 py-1 rounded-full">
                  <ImagesIcon className="w-3.5 h-3.5" />
                  {images.length} foto
                </span>
              ) : null}
            </button>
          </div>
        ) : null}

        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 pb-12">
          <div
            data-testid="post-detail-content"
            className="text-base sm:text-lg text-gray-700 leading-relaxed whitespace-pre-line"
          >
            {post.content}
          </div>

          {images.length > 1 ? (
            <div className="mt-10 pt-8 border-t border-gray-100">
              <p className="text-xs font-montserrat font-semibold text-[#0A1F44] uppercase tracking-wider mb-4">
                Galleria foto
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {images.map((src, i) => (
                  <button
                    key={src + i}
                    type="button"
                    onClick={() => openGallery(images, i)}
                    data-testid={`post-gallery-thumb-${i}`}
                    className="aspect-square rounded-lg overflow-hidden border border-gray-200 hover:border-[#F4C542] transition-colors"
                  >
                    <img
                      src={src}
                      alt=""
                      loading="lazy"
                      className="w-full h-full object-cover hover:scale-105 transition-transform"
                    />
                  </button>
                ))}
              </div>
            </div>
          ) : null}

          {post.facebook_url ? (
            <a
              href={post.facebook_url}
              target="_blank"
              rel="noopener noreferrer"
              data-testid="post-facebook-link"
              className="inline-flex items-center gap-1.5 text-sm text-[#1877F2] hover:underline font-semibold mt-8"
            >
              <Facebook className="w-4 h-4" />
              Vedi su Facebook
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          ) : null}
        </div>
      </article>

      <section className="py-16 bg-[#0A1F44] text-white">
        <div className="mx-auto max-w-4xl px-4 text-center">
          <h2 className="text-3xl sm:text-4xl font-montserrat font-bold mb-4">
            Hai una domanda dopo aver letto questo post?
          </h2>
          <p className="text-gray-300 mb-7">
            Scrivici, ti rispondiamo entro 24 ore con un preventivo
            personalizzato.
          </p>
          <Link
            to="/contatti"
            className="inline-flex items-center justify-center gap-2 bg-[#F4C542] hover:bg-[#e6b838] text-[#0A1F44] rounded-md px-6 h-11 font-montserrat font-bold text-sm transition-colors"
          >
            Contattaci Ora
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>

      {gallery.open ? (
        <Lightbox
          images={gallery.images}
          index={gallery.index}
          onClose={closeGallery}
          onPrev={prev}
          onNext={next}
        />
      ) : null}
    </>
  );
};

export default NewsDetail;
