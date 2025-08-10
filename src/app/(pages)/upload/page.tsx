import React from "react";
import { MyDropzone } from "@/components/MyDropzone";
import { StyleCard } from "@/components/StyleCard";
import { MoveRight } from "lucide-react";
import { stylesData } from "@/data";

const steps = [
  { id: "upload-tag", label: "Upload", status: true },
  { id: "select-style-tag", label: "Select Style", status: false },
  { id: "generate-tag", label: "Generate", status: false },
  { id: "download-tag", label: "Download", status: false },
];

export default function UploadPage() {
  return (
    <div
      id="upload-page"
      className="from-background via-primary/20 to-background text-text-light relative flex min-h-screen w-full items-center justify-center bg-gradient-to-br md:overflow-x-hidden"
    >
      <header
        id="app-header"
        className="bg-background/40 border-primary/10 absolute top-0 left-0 z-20 flex h-14 w-full items-center justify-between border-b px-2 py-1 backdrop-blur-md md:h-16 md:px-6 md:py-2"
      >
        <h1 className="from-primary to-secondary bg-gradient-to-r bg-clip-text text-lg font-extrabold tracking-tight text-nowrap text-transparent drop-shadow md:text-xl lg:text-2xl">
          StyleSnap AI
        </h1>

        <div className="bg-primary border-primary/20 selection:bg-primary/50 shrink-0 rounded-2xl border px-3 py-1 text-sm font-semibold text-white shadow-lg selection:text-white">
          Free <span className="font-mono">0/1</span>
        </div>
      </header>

      <main className="mt-20 flex w-full max-w-4xl flex-col items-center justify-center px-4">
        {/* Progress Bar  */}
        <nav
          aria-label="Progress"
          className="mb-5 flex flex-row items-center gap-0.5 text-xs text-white/55 md:mb-3 md:gap-2 md:text-sm"
        >
          {steps.map((step, idx) => (
            <div
              key={step.id}
              id={step.id}
              className="flex items-center gap-0.5 md:gap-2"
            >
              <span
                className={`selection:bg-primary/50 text-nowrap selection:text-white ${
                  step.status ? "text-primary font-semibold" : ""
                }`}
              >
                {step.label}
              </span>
              {idx < steps.length - 1 && (
                <MoveRight
                  className={`h-5 w-5 ${
                    step.status ? "text-primary" : ""
                  }`}
                />
              )}
            </div>
          ))}
        </nav>
        {/* Dropzone */}
        <section className="flex h-96 w-full max-w-xl items-center justify-center">
          <MyDropzone />
        </section>

        {/* Trending Styles */}
        <section
          id="card-slider"
          className="-mt-6 flex w-full max-w-[98vw] flex-col items-start justify-start px-2 pt-2 pb-3 sm:px-4 md:max-w-4xl md:px-8 lg:max-w-5xl"
        >
          <h2 className="selection:bg-primary/50 mb-2 text-left text-lg font-bold text-white drop-shadow selection:text-white md:text-xl lg:text-2xl">
            Trending Styles
          </h2>
          <div className="scrollbar-thin scrollbar-thumb-primary/30 scrollbar-track-transparent flex w-full items-center justify-start gap-3 overflow-x-auto px-1 py-1 sm:gap-4 md:gap-6">
            {stylesData.map((style) => (
              <StyleCard key={style.id} style={style} />
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
