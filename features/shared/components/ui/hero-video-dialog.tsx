"use client";
import { AnimatePresence, motion } from "motion/react";
import { Play, X } from "lucide-react";
import type React from "react";
import { useEffect, useRef, useState } from "react";
import Image from "next/image";

interface HeroVideoDialogProps {
  videoUrl?: string;
  youtubeId?: string;
  thumbnailUrl?: string;
  title?: string;
  className?: string;
}

export const extractYoutubeId = (url: string) => {
  // Handle YouTube embed URLs: https://www.youtube.com/embed/VIDEO_ID
  const embedRegex = /\/embed\/([a-zA-Z0-9_-]+)/;
  const embedMatch = url.match(embedRegex);
  if (embedMatch) {
    return embedMatch[1];
  }

  // Handle YouTube watch URLs: https://www.youtube.com/watch?v=VIDEO_ID
  const watchRegex = /[?&]v=([a-zA-Z0-9_-]+)/;
  const watchMatch = url.match(watchRegex);
  if (watchMatch) {
    return watchMatch[1];
  }

  // Handle YouTube short URLs: https://youtu.be/VIDEO_ID
  const shortRegex = /youtu\.be\/([a-zA-Z0-9_-]+)/;
  const shortMatch = url.match(shortRegex);
  if (shortMatch) {
    return shortMatch[1];
  }

  return null;
};

const DEFAULT_VIDEO_FALLBACK_URL =
  "https://me7aitdbxq.ufs.sh/f/2wsMIGDMQRdYqvMy4kaWD2STgaJv9iAfGNzF5E06KYRULuoj";

const DEFAULT_VIDEO_THUMBNAIL =
  "https://img.youtube.com/vi/dQw4w9WgXcQ/maxresdefault.jpg";

const getYouTubeThumbnail = (id: string) =>
  `https://img.youtube.com/vi/${id}/maxresdefault.jpg`;

const getYouTubeEmbedUrl = (id: string) =>
  `https://www.youtube.com/embed/${id}?autoplay=1&rel=0`;

const HeroVideoDialog: React.FC<HeroVideoDialogProps> = ({
  videoUrl,
  youtubeId,
  thumbnailUrl,
  title = "Play Video",
  className = "",
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [buttonRect, setButtonRect] = useState<DOMRect | null>(null);

  const buttonRef = useRef<HTMLButtonElement>(null);

  const isYouTube = !!youtubeId;

  const finalThumbnail =
    thumbnailUrl ||
    (isYouTube
      ? getYouTubeThumbnail(youtubeId as string)
      : DEFAULT_VIDEO_THUMBNAIL);

  const finalVideoUrl =
    isYouTube && youtubeId
      ? getYouTubeEmbedUrl(youtubeId)
      : videoUrl || DEFAULT_VIDEO_FALLBACK_URL;

  const handleOpenModal = () => {
    if (buttonRef.current) {
      setButtonRect(buttonRef.current.getBoundingClientRect());
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => setIsModalOpen(false);

  const getTransformOrigin = () => {
    if (!buttonRect) {
      return "center center";
    }

    const centerX = buttonRect.left + buttonRect.width / 2;
    const centerY = buttonRect.top + buttonRect.height / 2;

    return `${centerX}px ${centerY}px`;
  };

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        handleCloseModal();
      }
    };
    if (isModalOpen) {
      document.addEventListener("keydown", handleEsc);
    }
    return () => document.removeEventListener("keydown", handleEsc);
  }, [isModalOpen]);

  return (
    <>
      <motion.button
        aria-label={title}
        className={`group relative overflow-hidden ${className} `}
        initial={{ scale: 1.2 }}
        onClick={handleOpenModal}
        ref={buttonRef}
        whileTap={{ scale: 0.95 }}
      >
        <div className="flex items-center">
          {/* Thumbnail Image */}
          <div className="relative aspect-video h-[12.5rem] w-max max-w-max overflow-hidden md:h-[14.5rem] lg:h-[18.5rem]">
            <Image
              alt="Video thumbnail"
              className="h-full w-full object-cover"
              fill
              src={finalThumbnail}
            />

            {/* Play Icon Overlay */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="rounded-full border border-border bg-background p-1 shadow-sm">
                <Play
                  className="ml-0.5 fill-foreground text-foreground"
                  size={18}
                />
              </div>
            </div>

            {/* YouTube Badge */}
            {isYouTube && (
              <div className="absolute right-1 bottom-1 rounded bg-red-600 px-1 py-0.5 font-bold text-[8px] text-white">
                YT
              </div>
            )}
          </div>
        </div>
      </motion.button>

      {/* Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <motion.div
            animate={{ opacity: 1 }}
            aria-label="Video Modal"
            aria-modal="true"
            className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 p-4 backdrop-blur-sm"
            exit={{ opacity: 0 }}
            initial={{ opacity: 0 }}
            onClick={handleCloseModal}
            role="dialog"
          >
            <motion.div
              animate={{ opacity: 1, scale: 1 }}
              className="relative aspect-video w-full max-w-4xl overflow-hidden rounded-2xl border border-border bg-card shadow-2xl"
              exit={{ opacity: 0, scale: 0.1 }}
              initial={{ opacity: 0, scale: 0.1 }}
              onClick={(e) => e.stopPropagation()}
              style={{ transformOrigin: getTransformOrigin() }}
              transition={{ duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
            >
              {/* Close Button */}
              <button
                aria-label="Close video"
                className="absolute top-4 right-4 z-10 rounded-full border border-white/20 bg-black/30 p-2 text-white backdrop-blur-sm transition-all duration-200 hover:cursor-pointer hover:bg-black/50"
                onClick={handleCloseModal}
                type="button"
              >
                <X size={20} />
              </button>

              {/* Video or YouTube */}
              {isYouTube ? (
                <iframe
                  allow="autoplay; encrypted-media"
                  allowFullScreen
                  className="h-full w-full"
                  src={finalVideoUrl}
                  title={title}
                />
              ) : (
                // biome-ignore lint/a11y/useMediaCaption: video does not have a caption
                <video
                  autoPlay
                  className="h-full w-full"
                  controls
                  src={finalVideoUrl}
                />
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export { HeroVideoDialog };
