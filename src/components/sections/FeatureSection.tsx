import React from "react";

export const FeatureSection = () => {
  return (
    <section
      id="feature-section"
      className="mx-auto my-10 flex w-full max-w-7xl flex-col items-center justify-center px-4 sm:px-6"
    >
      <h2 className="mb-2 text-center text-2xl font-bold text-white drop-shadow-lg md:text-3xl">
        See the Magic: Instantly Transform Your Photos
      </h2>
      <p className="mb-8 max-w-2xl text-center text-base text-white/60 md:text-lg">
        Instantly restyle your photos - no signup, just one click.
      </p>
      {/* Pinterest-like grid, 4/5 aspect ratio, 4 images only */}
      <div className="min-h-[300px] w-full columns-2 gap-4 space-y-4 lg:columns-4">
        <div className="bg-background/60 mb-4 break-inside-avoid rounded-xl p-2 shadow-lg">
          <div
            className="relative w-full overflow-hidden rounded-lg"
            style={{ aspectRatio: "4/5" }}
          >
            <img
              src="/1980s-pop-art.png"
              alt="Pop Art Style Example"
              className="h-full w-full object-cover"
              style={{ aspectRatio: "4/5" }}
            />
          </div>
          <span className="mt-2 block text-center text-sm font-semibold text-white">
            Pop Art
          </span>
        </div>
        <div className="bg-background/60 mb-4 break-inside-avoid rounded-xl p-2 shadow-lg">
          <div
            className="relative w-full overflow-hidden rounded-lg"
            style={{ aspectRatio: "4/5" }}
          >
            <img
              src="/ghibli-art.png"
              alt="Ghibli Style Example"
              className="h-full w-full object-cover"
              style={{ aspectRatio: "4/5", background: "#e0f7fa" }}
            />
          </div>
          <span className="mt-2 block text-center text-sm font-semibold text-white">
            Ghibli Art
          </span>
        </div>
        <div className="bg-background/60 mb-4 break-inside-avoid rounded-xl p-2 shadow-lg">
          <div
            className="relative w-full overflow-hidden rounded-lg"
            style={{ aspectRatio: "4/5" }}
          >
            <img
              src="/disney-art.png"
              alt="Upscaled Portrait Example"
              className="h-full w-full object-cover"
              style={{ aspectRatio: "4/5", background: "#f5f5f5" }}
            />
          </div>
          <span className="mt-2 block text-center text-sm font-semibold text-white">
            Upscaled Portrait
          </span>
        </div>
        <div className="bg-background/60 mb-4 break-inside-avoid rounded-xl p-2 shadow-lg">
          <div
            className="relative w-full overflow-hidden rounded-lg"
            style={{ aspectRatio: "4/5" }}
          >
            <img
              src="/anime-art.png"
              alt="Upscaled Anime Example"
              className="h-full w-full object-cover"
              style={{ aspectRatio: "4/5", background: "#f0eaff" }}
            />
          </div>
          <span className="mt-2 block text-center text-sm font-semibold text-white">
            Upscaled Anime
          </span>
        </div>
        {/* TODO: Show "My Images" here when user is logged in */}
        {/* TODO: Handle too big images gracefully */}
      </div>
    </section>
  );
};
