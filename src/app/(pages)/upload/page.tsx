"use client";
import { AnimatePresence, motion } from "motion/react";
import React, { useState } from "react";
import { MyDropzone } from "@/components/MyDropzone";
import { StyleCard } from "@/components/StyleCard";
import { ChevronDown, ChevronRight, MoveRight } from "lucide-react";
import { stylesData } from "@/data";
import { PreviewCard } from "@/components/PreviewCard";
import { Button } from "@/components/Button";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { ImageData } from "@/types/style.types";
import { Loader } from "@/components/Loader";
import { SocialIcon } from "@/components/SocialIcon";

type Step = {
  id: string;
  label: string;
  status: boolean | ImageData | null;
};
type GenerateStatus = "success" | "failed" | "idle";

//implementation of download ui - handleGenerate -> if true(200) images comes show it to the site and have download and share option

export default function UploadPage() {
  const [selectedStyle, setSelectedStyle] = useLocalStorage<ImageData | null>(
    "selectedStyle",
    null,
  );

  const [generatedImage, setGenerateImage] = useState<ImageData | null>({
    id: "1980s-pop-art",
    name: "1980s Pop Art",
    image: "/1980s-pop-art.png",
    prompt: "",
  }); //TODO : set to null
  const [loading, setLoading] = useState<boolean>(false);
  const [generateError, setGenerateError] = useState<string | null>(null);
  const [generateStatus, setGenerateStatus] =
    useState<GenerateStatus>("success"); //TODO: Set to idle
  const [file, setFile] = useLocalStorage<ImageData | null>(
    "uploadedFile",
    null,
  );
  const [error, setError] = useState<string | null>(null);

  const [steps, setSteps] = useState<Step[]>([
    { id: "upload-tag", label: "Upload", status: file },
    { id: "select-style-tag", label: "Select Style", status: selectedStyle },
    { id: "generate-tag", label: "Generate", status: false },
    { id: "download-tag", label: "Download", status: false }, //TODO : ADD TRUE FALSE STATUS
  ]);

  const handleGenerate = () => {
    //TODO: Implement Generate Function
    setGenerateImage(null);
    console.log("Create Function");
    setLoading(true);
    setGenerateError(null);
    try {
      // Mark the "generate-tag" step as completed
      const updatedSteps = steps.map((step) =>
        step.id === "generate-tag" ? { ...step, status: true } : step,
      );
      setSteps(updatedSteps);
      setGenerateImage({
        id: "1980s-pop-art",
        name: "1980s Pop Art",
        image: "/1980s-pop-art.png",
        prompt: "",
      });
      setGenerateStatus("success");
    } catch (error: unknown) {
      if (error && typeof error === "object") {
        console.log("Failed to generate Image : ", error);
      }
      setGenerateError("Failed to generate Image, Please Try Again!");
    } finally {
      setTimeout(() => setLoading(false), 600);
    }
  };

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
                  className={`h-5 w-5 ${step.status ? "text-primary" : ""}`}
                />
              )}
            </div>
          ))}
        </nav>

        {/* Dropzone */}
        <section
          className={`relative flex w-full items-center ${
            loading || !selectedStyle || generateStatus === "success"
              ? "justify-center"
              : "justify-between"
          } h-auto min-h-[24rem] md:h-96`}
        >
          {loading ? (
            <Loader />
          ) : generateStatus === "success" ? (
            <div className="flex h-full w-full flex-col items-center justify-center gap-x-20 md:flex-row">
              <PreviewCard
                image={generatedImage?.image ?? ""}
                key={generatedImage?.id ?? ""}
                name={generatedImage?.name ?? ""}
                style={false}
                prompt={generatedImage?.prompt ?? ""}
                onRemove={() => {}}
                isRemoveBtnDisabled={false}
                size={generatedImage?.size}
              />
              <div
                id="image-download-actions"
                className="mt-4 flex h-full flex-col items-center justify-center gap-4 md:mt-0"
              >
                <Button variant={"gradient"} className="w-full max-w-xs">
                  Download
                </Button>
                <Button
                  variant={"outline"}
                  className="w-full max-w-xs text-white"
                >
                  Generate Another for ₹9
                </Button>

                <div
                  id="social-share-links"
                  className="mt-3 flex flex-col gap-2"
                >
                  <p
                    id="cta-text"
                    className="text-base font-semibold text-white"
                  >
                    Share On :-
                  </p>
                  <div className="flex w-full items-center justify-center gap-4">
                    <SocialIcon name="instagram" />
                    <SocialIcon name="discord" />
                    <SocialIcon name="reddit" />
                    <SocialIcon name="x" />
                    <SocialIcon name="whatsapp" />
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <>
              {/* Responsive: vertical flow for mobile, horizontal for md+ */}
              <div
                className={`flex w-full flex-col items-center justify-center gap-4 md:h-full md:flex-row md:gap-8`}
              >
                <AnimatePresence initial={false}>
                  {/* Dropzone */}
                  <motion.div
                    key="dropzone"
                    className="w-full shrink-0 md:w-auto"
                    layout
                    animate={{
                      x: 0,
                      opacity: 1,
                      filter: "blur(0px)",
                    }}
                    initial={false}
                    exit={
                      selectedStyle
                        ? { x: -160, opacity: 0, filter: "blur(4px)" }
                        : { x: 0, opacity: 1, filter: "blur(4px)" }
                    }
                    transition={{
                      type: "spring",
                      stiffness: 180,
                      damping: 30,
                      mass: 0.8,
                      duration: 0.7,
                    }}
                    style={{
                      minWidth: 240,
                      maxWidth: 240,
                    }}
                  >
                    {file ? (
                      <PreviewCard
                        image={file.image}
                        name={file.name}
                        style={false}
                        prompt={file?.prompt}
                        onRemove={() => setFile(null)}
                        size={file.size}
                        isRemoveBtnDisabled={selectedStyle !== null}
                      />
                    ) : (
                      <MyDropzone
                        file={file}
                        setFile={(file) => setFile(file)}
                        setError={(error) => setError(error)}
                        error={error}
                      />
                    )}
                  </motion.div>
                </AnimatePresence>

                <AnimatePresence>
                  {selectedStyle && (
                    <>
                      {/* Mobile: Downward arrow, md+: chevrons */}
                      <motion.div
                        key="arrow-indicator"
                        className={`flex w-full flex-col items-center justify-center md:w-auto ${selectedStyle ? "mt-2 md:mt-0" : ""} `}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.5, ease: "easeOut" }}
                      >
                        {/* Mobile: Downward arrow with opacity animation */}
                        <div className="mb-2 block md:hidden">
                          <motion.div
                            initial={{ opacity: 0.3 }}
                            animate={{ opacity: [0.3, 1, 0.7, 0.3] }}
                            transition={{
                              duration: 1.2,
                              repeat: Infinity,
                              ease: "easeInOut",
                            }}
                          >
                            {/* Downward arrow SVG (Lucide ChevronDown) */}
                            <ChevronDown className="text-primary h-6 w-6" />
                          </motion.div>
                        </div>
                        {/* Desktop: Chevrons as before */}
                        <div className="hidden items-center justify-center gap-2 px-6 md:flex">
                          {[...Array(5)].map((_, i) => (
                            <motion.div
                              key={i}
                              initial={{ opacity: 0.3, y: 0, scale: 1 }}
                              animate={{
                                opacity: [0.3, 1, 0.7, 0.3],
                                y: [0, -6, 0, 0],
                                scale: [1, 1.15, 1, 1],
                              }}
                              transition={{
                                duration: 1,
                                repeat: Infinity,
                                delay: i * 0.15,
                                times: [0, 0.3, 0.6, 1],
                                ease: "easeInOut",
                              }}
                            >
                              <ChevronRight className="text-primary h-6 w-6" />
                            </motion.div>
                          ))}
                        </div>
                      </motion.div>

                      {/* Selected Style Preview */}
                      <motion.div
                        key="preview"
                        className="w-full flex-shrink-0 md:w-auto"
                        initial={{ opacity: 0, y: 40, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 40, scale: 0.95 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                      >
                        <PreviewCard
                          image={selectedStyle.image}
                          name={selectedStyle.name}
                          style={true}
                          prompt={selectedStyle.prompt}
                          onRemove={() => setSelectedStyle(null)}
                          isRemoveBtnDisabled={false}
                        />
                      </motion.div>
                    </>
                  )}
                </AnimatePresence>
              </div>
              {/* Generate Button: always full width on mobile, below main content and centered on md+ */}
              {selectedStyle && (
                <motion.div
                  className="absolute -bottom-16 left-1/2 flex w-1/2 -translate-x-1/2 items-center justify-center md:bottom-24 md:mt-0 md:w-40"
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 30 }}
                  transition={{ duration: 0.5, delay: 0.5 }}
                >
                  <Button
                    variant={"gradient"}
                    className="w-full"
                    onClick={handleGenerate}
                  >
                    Generate
                  </Button>
                </motion.div>
              )}
            </>
          )}
        </section>

        {/* Trending Styles */}
        <section
          id="card-slider"
          className={`flex w-full flex-col items-start justify-start px-2 pt-2 pb-3 sm:px-4 md:-mt-6 md:max-w-4xl md:px-8 ${selectedStyle ? "mt-24" : "mt-6"}`}
        >
          <h2 className="selection:bg-primary/50 mb-2 w-full text-center text-lg font-bold text-white drop-shadow selection:text-white md:text-xl lg:text-2xl">
            Trending Styles
          </h2>
          <div className="scrollbar-thin scrollbar-thumb-primary/30 scrollbar-track-transparent flex w-full items-center justify-start gap-3 overflow-x-auto px-1 py-1 sm:gap-4 md:gap-6">
            {stylesData.map((style) => (
              <StyleCard
                key={style.id}
                style={style}
                onClick={(style) => setSelectedStyle(style)}
              />
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
