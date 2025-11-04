"use client";

import { ToolUIPart } from "ai";
import equal from "lib/equal";
import { cn } from "lib/utils";
import { ImagesIcon } from "lucide-react";
import { memo, useMemo, useState } from "react";
import { TextShimmer } from "ui/text-shimmer";
import LetterGlitch from "ui/letter-glitch";

interface ImageGeneratorToolInvocationProps {
  part: ToolUIPart;
}

interface ImageGenerationResult {
  images: {
    url: string;
    mimeType?: string;
  }[];
  mode?: "create" | "edit" | "composite";
  model: string;
}

function PureImageGeneratorToolInvocation({
  part,
}: ImageGeneratorToolInvocationProps) {
  const [loadedImages, setLoadedImages] = useState<Set<number>>(new Set());

  const isGenerating = useMemo(() => {
    return !part.state.startsWith("output");
  }, [part.state]);

  const result = useMemo(() => {
    if (!part.state.startsWith("output")) return null;
    return part.output as ImageGenerationResult;
  }, [part.state, part.output]);

  const images = useMemo(() => {
    return result?.images || [];
  }, [result]);

  const mode = useMemo(() => {
    return result?.mode || "create";
  }, [result]);

  const hasError = useMemo(() => {
    return (
      part.state === "output-error" ||
      (part.state === "output-available" && result?.images.length === 0)
    );
  }, [part.state, result]);

  const handleImageLoad = (index: number) => {
    setLoadedImages((prev) => new Set(prev).add(index));
  };

  // Get mode-specific text
  const getModeText = (mode: string) => {
    switch (mode) {
      case "edit":
        return "Editing image...";
      case "composite":
        return "Compositing images...";
      default:
        return "Generating image...";
    }
  };

  const getModeHeader = (mode: string) => {
    switch (mode) {
      case "edit":
        return "Image edited";
      case "composite":
        return "Images composited";
      default:
        return "Image generated";
    }
  };

  // Simple loading state like web-search
  if (isGenerating) {
    return (
      <div className="flex flex-col gap-4">
        <TextShimmer>{getModeText(mode)}</TextShimmer>
        <div className="w-full h-96 overflow-hidden rounded-lg">
          <LetterGlitch />
        </div>
        <p className="text-xs text-muted-foreground text-center">
          Image generation may take up to 1 minute.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-2">
        {!hasError && <ImagesIcon className="size-4" />}
        <span className="text-sm font-semibold">
          {hasError ? "Image generation failed" : getModeHeader(mode)}
        </span>
        <span className="text-xs text-muted-foreground">{result?.model}</span>
      </div>

      <div className="w-full flex flex-col gap-3 pb-2">
        {hasError ? (
          <div className="bg-card text-muted-foreground p-6 rounded-lg text-xs border border-border/20">
            {part.errorText ??
              (result?.images.length === 0
                ? "No images generated"
                : "Failed to generate image. Please try again.")}
          </div>
        ) : (
          <>
            <div
              className={cn(
                "grid gap-3",
                images.length === 1
                  ? "grid-cols-1 max-w-2xl"
                  : "grid-cols-1 md:grid-cols-2 max-w-3xl",
              )}
            >
              {images.map((image, index) => (
                <div
                  key={index}
                  className="relative group rounded-lg overflow-hidden border border-border hover:border-primary transition-all shadow-sm hover:shadow-md"
                >
                  {/* Progressive reveal animation */}
                  <div
                    className={cn(
                      "relative overflow-hidden transition-all duration-1000 ease-out",
                      loadedImages.has(index)
                        ? "opacity-100 scale-100"
                        : "opacity-0 scale-95"
                    )}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={image.url}
                      loading="lazy"
                      alt={`Generated image ${index + 1}`}
                      className={cn(
                        "w-full h-auto object-cover transition-all duration-1000",
                        loadedImages.has(index) ? "blur-0" : "blur-lg"
                      )}
                      onLoad={() => handleImageLoad(index)}
                      style={{
                        animation: loadedImages.has(index)
                          ? "revealImage 1.2s cubic-bezier(0.4, 0, 0.2, 1)"
                          : "none",
                      }}
                    />
                  </div>
                  
                  {/* Loading skeleton */}
                  {!loadedImages.has(index) && (
                    <div className="absolute inset-0 bg-gradient-to-br from-muted/50 to-muted animate-pulse" />
                  )}

                  {/* Hover overlay */}
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
                    <a
                      href={image.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-primary text-primary-foreground px-4 py-2 rounded-full text-sm font-medium hover:scale-105 transition-transform"
                    >
                      Open
                    </a>
                  </div>
                </div>
              ))}
            </div>
            
            {/* Add keyframe animation styles */}
            <style jsx>{`
              @keyframes revealImage {
                0% {
                  opacity: 0;
                  transform: scale(0.95);
                  filter: blur(20px);
                }
                50% {
                  opacity: 0.5;
                  filter: blur(10px);
                }
                100% {
                  opacity: 1;
                  transform: scale(1);
                  filter: blur(0);
                }
              }
            `}</style>
          </>
        )}
      </div>
    </div>
  );
}

export const ImageGeneratorToolInvocation = memo(
  PureImageGeneratorToolInvocation,
  (prev, next) => {
    return equal(prev.part, next.part);
  },
);
