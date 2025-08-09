import React from "react";
import { MyDropzone } from "@/components/MyDropzone";
import { StyleCard } from "@/components/StyleCard";
import { MoveRight } from "lucide-react";

const steps = [
  { id: "upload-tag", label: "Upload" },
  { id: "select-style-tag", label: "Select Style" },
  { id: "generate-tag", label: "Generate" },
  { id: "download-tag", label: "Download" },
];

const trendingStyles = [
  { name: "Casual" },
  { name: "Streetwear" },
  { name: "Formal" },
  { name: "Vintage" },
  // Add more styles here if desired
];

const UploadPage = () => {
  return (
    <div
      id="upload-page"
      className="relative w-full min-h-screen bg-gradient-to-br from-background via-card to-background text-text-light flex items-center justify-center"
    >
      <header
        id="app-header"
        className="absolute top-0 left-0 w-full h-20 py-3 px-6 flex justify-between items-center z-20 bg-background/80 backdrop-blur-md border-b border-primary/10"
      >
        <h1 className="font-extrabold text-2xl sm:text-3xl text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary tracking-tight drop-shadow">
          StyleSnap AI
        </h1>
        <div className="py-2 px-4 rounded-2xl bg-primary text-text-light font-semibold text-sm shadow-lg border border-primary/20">
          Free <span className="font-mono">0/1</span>
        </div>
      </header>

      <main className="flex flex-col items-center justify-center w-full max-w-2xl mt-32 px-4">
        {/* Progress Steps */}
        <nav
          aria-label="Progress"
          className="flex flex-row gap-2 mb-8 text-sm text-white/60"
        >
          {steps.map((step, idx) => (
            <React.Fragment key={step.id}>
              <div
                id={step.id}
                className={`flex items-center gap-2 px-3 py-1 rounded-full ${
                  idx === 0
                    ? "bg-primary/80 text-white font-semibold shadow"
                    : "bg-card/60"
                }`}
              >
                <span>{step.label}</span>
                {idx < steps.length - 1 && (
                  <MoveRight className="w-5 h-5 text-primary" />
                )}
              </div>
              {idx < steps.length - 1 && (
                <span className="hidden sm:inline text-primary/40"> </span>
              )}
            </React.Fragment>
          ))}
        </nav>

        {/* Dropzone */}
        <section className="w-full max-w-xl h-96 flex items-center justify-center mb-8">
          <MyDropzone />
        </section>

        {/* Trending Styles */}
        <section
          id="card-slider"
          className="w-full flex flex-col justify-start items-start py-4 px-2 bg-card/60 rounded-xl shadow-lg"
        >
          <h2 className="text-2xl font-bold text-left mb-4 text-white drop-shadow">
            Trending Styles
          </h2>
          <div className="flex gap-4 justify-start items-center overflow-x-auto w-full px-2 py-4 scrollbar-thin scrollbar-thumb-primary/30 scrollbar-track-transparent">
            {trendingStyles.map((style, idx) => (
              <StyleCard key={style.name + idx} />
            ))}
          </div>
        </section>
      </main>
    </div>
  );
};

export default UploadPage;
