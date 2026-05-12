import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  Facebook,
  Calendar,
  ExternalLink,
  Newspaper,
  Images as ImagesIcon,
} from "lucide-react";
import { SITE } from "../data/mock";
import { PageHero } from "./ChiSiamo";
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

const PostCard = ({ post, onOpenGallery }) => {
  const images = getPostImages(post).map(resolveImageUrl);
  const cover = images[0];
  const extraCount = images.length - 1;

  return (
    <article
      data-testid="blog-post-card"
      className="bg-white border border-gray-100 rounded-xl overflow-hidden hover:shadow-lg transition-all duration-300 flex flex-col"
    >
      {cover ? (
        <button
          type="button"
          data-testid="blog-post-cover"
          onClick={() => onOpenGallery(images, 0)}
          className="relative aspect-[16/10] overflow-hidden bg-gray-100 group cursor-zoom-in"
        >
          <img
            src={cover}
            alt={post.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            loading="lazy"
          />
          {extraCount > 0 ? (
            <span className="absolute bottom-3 right-3 inline-flex items-center gap-1.5 bg-black/65 backdrop-blur-sm text-white text-xs font-montserrat font-semibold px-2.5 py-1 rounded-full">
              <ImagesIcon className="w-3.5 h-3.5" />+{extraCount}
            </span>
          ) : null}
        </button>
      ) : null}
      <div className="p-6 flex-1 flex flex-col">
        <div className="flex items-center gap-2 text-xs text-gray-500 mb-3">
          <Calendar className="w-3.5 h-3.5 text-[#0FB36B]" />
          <time dateTime={post.published_at}>{formatDate(post.published_at)}</time>
        </div>
        <h3 className="text-lg font-montserrat font-semibold text-[#0A1F44] mb-3 leading-snug">
          {post.title}
        </h3>
        <p className="text-sm text-gray-600 leading-relaxed whitespace-pre-line mb-5 flex-1">
          {post.content}
        </p>

        {images.length > 1 ? (
          <div className="flex gap-1.5 mb-4 flex-wrap">
            {images.slice(1, 5).map((src, i) => (
              <button
                key={src}
                type="button"
                onClick={() => onOpenGallery(images, i + 1)}
                className="w-14 h-14 rounded-md overflow-hidden border border-gray-200 hover:border-[#F4C542] transition-colors"
                aria-label={`Apri foto ${i + 2}`}
              >
                <img
                  src={src}
                  alt=""
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </button>
            ))}
            {images.length > 5 ? (
              <button
                type="button"
                onClick={() => onOpenGallery(images, 5)}
                className="w-14 h-14 rounded-md bg-gray-100 hover:bg-gray-200 text-[#0A1F44] text-xs font-montserrat font-semibold transition-colors"
              >
                +{images.length - 5}
              </button>
            ) : null}
          </div>
        ) : null}

        {post.facebook_url ? (
          <a
            href={post.facebook_url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-xs text-[#1877F2] hover:underline font-semibold mt-auto"
          >
            <Facebook className="w-3.5 h-3.5" />
            Vedi su Facebook
            <ExternalLink className="w-3 h-3" />
          </a>
        ) : null}
      </div>
    </article>
  );
};

const EmptyState = () => (
  <div
    data-testid="blog-empty-state"
    className="text-center py-16 px-6 bg-gray-50 rounded-xl border border-dashed border-gray-200"
  >
    <Newspaper className="w-12 h-12 mx-auto text-gray-300 mb-3" />
    <p className="text-[#0A1F44] font-montserrat font-semibold mb-2">
      Nessun post pubblicato al momento
    </p>
    <p className="text-sm text-gray-500 max-w-md mx-auto">
      Torna a trovarci presto: stiamo preparando nuovi contenuti su
      installazioni, novità normative e consigli per risparmiare in bolletta.
    </p>
    <a
      href={SITE.facebookUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center justify-center gap-2 mt-5 bg-[#1877F2] hover:bg-[#1466d4] text-white rounded-md px-5 h-10 font-montserrat font-semibold text-sm transition-colors"
    >
      <Facebook className="w-4 h-4" />
      Seguici su Facebook
    </a>
  </div>
);

const News = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [gallery, setGallery] = useState({ open: false, images: [], index: 0 });

  useEffect(() => {
    let cancelled = false;
    fetch(`${API_URL}/api/posts`)
      .then((r) => (r.ok ? r.json() : []))
      .then((data) => {
        if (!cancelled) setPosts(Array.isArray(data) ? data : []);
      })
      .catch(() => {
        if (!cancelled) setPosts([]);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const openGallery = (images, index) =>
    setGallery({ open: true, images, index });
  const closeGallery = () =>
    setGallery((g) => ({ ...g, open: false }));
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

  return (
    <>
      <Seo
        title="Blog"
        description="Resta aggiornato sulle nostre attività: installazioni, novità dal mondo del fotovoltaico e consigli per risparmiare in bolletta."
        path="/news"
      />
      <PageHero
        eyebrow="BLOG"
        title="Le ultime novità"
        subtitle="Foto dei cantieri, consigli energetici e aggiornamenti dal mondo del fotovoltaico."
      />

      <section className="py-16 sm:py-20 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {loading ? (
            <div
              data-testid="blog-loading"
              className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {Array.from({ length: 3 }).map((_, i) => (
                <div
                  key={i}
                  className="bg-gray-50 rounded-xl h-80 animate-pulse"
                />
              ))}
            </div>
          ) : posts.length === 0 ? (
            <EmptyState />
          ) : (
            <div
              data-testid="blog-posts-grid"
              className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {posts.map((p) => (
                <PostCard key={p.id} post={p} onOpenGallery={openGallery} />
              ))}
            </div>
          )}
        </div>
      </section>

      <section className="py-16 bg-[#0A1F44] text-white">
        <div className="mx-auto max-w-4xl px-4 text-center">
          <h2 className="text-3xl sm:text-4xl font-montserrat font-bold mb-4">
            Hai una domanda dopo aver letto un post?
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

export default News;
