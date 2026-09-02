import { useEffect, useMemo, useState } from "react";
import { PlayCircle } from "lucide-react";
import { Link } from "@tanstack/react-router";
import heroCell from "@/assets/hero-cell.jpg";
import { useHeroSlides } from "@/lib/content";
import { resolveImage } from "@/lib/images";

export function Hero() {
  const { data: slidesData } = useHeroSlides();
  const [index, setIndex] = useState(0);

  const slides = useMemo(() => (slidesData ?? []).filter((s) => s.active !== false), [slidesData]);

  useEffect(() => {
    if (slides.length === 0) return;
    const id = setInterval(() => setIndex((i) => (i + 1) % slides.length), 6000);
    return () => clearInterval(id);
  }, [slides.length]);

  if (slides.length === 0) {
    return (
      <section className="relative overflow-hidden rounded-2xl border border-border bio-hero-bg">
        <div className="grid items-center gap-6 md:grid-cols-[1fr_minmax(0,44%)]">
          <div className="p-8 md:p-10">
            <h1 className="font-display text-4xl font-bold md:text-5xl">Welcome</h1>
            <p className="mt-2 text-xl font-medium text-primary">Explore &amp; Learn</p>
          </div>
          <img
            src={heroCell}
            alt="Cross-section render of a living cell with a glowing nucleus and mitochondria"
            width={1024}
            height={768}
            className="h-full w-full object-cover md:max-h-80"
          />
        </div>
      </section>
    );
  }

  const slide = slides[index] ?? slides[0]!;
  const slideLink = slide.link_to ?? null;
  
  // Determine the explore link
  let exploreLink = "/";
  
  // Check if it's a valid link
  if (slideLink && !slideLink.startsWith("/components/") && !slideLink.startsWith("/src/") && !slideLink.startsWith("./")) {
    // Handle special redirects
    if (slideLink === "/photosynthese" || slideLink === "/s/plants") {
      // Both old paths redirect to the new photosynthesis route
      exploreLink = "/photosynthesis";
    } else {
      exploreLink = slideLink;
    }
  } else {
    // Fallback: check if title contains photosynthesis
    if (slide.title.toLowerCase().includes("photosynth")) {
      exploreLink = "/photosynthesis";
    }
  }
  const isVideoLink =
    (slideLink && slideLink.includes("/videos")) || Boolean(slide.video_url);
  const watchLink = slide.video_url ?? (isVideoLink && slideLink ? slideLink : null);
  
  // Debug logging
  if (slide.title.toLowerCase().includes("photosynth")) {
    console.log("Photosynthesis slide detected:", { slideLink, exploreLink, title: slide.title });
  }

  return (
    <section className="relative overflow-hidden rounded-2xl border border-border bio-hero-bg">
      <div className="grid items-center gap-6 md:grid-cols-[1fr_minmax(0,44%)]">
        <div className="p-8 md:p-10">
          <h1 className="font-display text-4xl font-bold md:text-5xl">{slide.title}</h1>
          <p className="mt-2 text-xl font-medium text-primary">{slide.subtitle}</p>
          <p className="mt-4 max-w-md text-sm leading-relaxed text-muted-foreground">
            {slide.body}
          </p>

          <div className="mt-7 flex flex-wrap gap-3">
            <Link
              to={exploreLink}
              className="rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90"
            >
              Explore Topic
            </Link>
            <Link
              to="/download"
              className="rounded-lg border border-border bg-card/60 px-5 py-2.5 text-sm font-medium text-foreground transition-colors hover:bg-secondary"
            >
              Download App
            </Link>
            <Link
              to="/signup"
              className="rounded-lg border border-border bg-card/60 px-5 py-2.5 text-sm font-medium text-foreground transition-colors hover:bg-secondary"
            >
              Sign up
            </Link>
            <Link
              to="/auth"
              className="rounded-lg border border-border bg-card/60 px-5 py-2.5 text-sm font-medium text-foreground transition-colors hover:bg-secondary"
            >
              Log in
            </Link>
            {watchLink ? (
              <Link
                to={watchLink}
                className="flex items-center gap-2 rounded-lg border border-border bg-card/60 px-5 py-2.5 text-sm font-medium text-foreground transition-colors hover:bg-secondary"
              >
                <PlayCircle className="size-4" />
                Watch Video
              </Link>
            ) : (
              <button className="flex items-center gap-2 rounded-lg border border-border bg-card/60 px-5 py-2.5 text-sm font-medium text-foreground transition-colors hover:bg-secondary">
                <PlayCircle className="size-4" />
                Watch Video
              </button>
            )}
          </div>

          <div className="mt-8 flex gap-2">
            {slides.map((s, i) => (
              <button
                key={s.id}
                onClick={() => setIndex(i)}
                aria-label={`Show ${s.title}`}
                className={`size-2.5 rounded-full transition-colors ${
                  i === index ? "bg-primary" : "bg-muted-foreground/40"
                }`}
              />
            ))}
          </div>
        </div>

        <img
          src={resolveImage(slide.image_url, slide.image_key)}
          alt={slide.title}
          width={1024}
          height={768}
          className="h-full w-full object-cover md:max-h-80"
        />
      </div>
    </section>
  );
}
