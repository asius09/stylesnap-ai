"use client";

import React, { useState } from "react";
import { motion } from "motion/react";
import { useToast } from "@/components/Toast";
import { MyDropzone } from "@/components/MyDropzone";
import { StyleCard } from "@/components/StyleCard";
import { PreviewCard } from "@/components/PreviewCard";
import { Button } from "@/components/Button";
import { Loader } from "@/components/Loader";
import { SocialShare } from "@/components/SocialShare";
import { AppHeader } from "@/components/AppHeader";
import { ProgressBar } from "@/components/ProgressBar";
import { ArrowIndicator } from "@/components/ArrowIndicator";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { stylesData } from "@/data";
import { ImageData } from "@/types/style.types";
import { MessageDialog, MessageDialogProps } from "@/components/MessageDialog";

// hooks
import { useProgressSteps } from "@/hooks/useProgressSteps";
import { useImageGeneration } from "@/hooks/useImageGeneration";
import { useFileRemove } from "@/hooks/useFileRemove";
import { useStyleSelection } from "@/hooks/useStyleSelection";
import { useTrialId } from "@/hooks/useTrialId";
import { useScrollLock } from "@/hooks/useScrollLock";
import { useDownloadImage } from "@/utils/downloadUtils";

export default function UploadPage() {
  const { addToast } = useToast();

  // State
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [messageDialog, setMessageDialog] = useState<
    Partial<MessageDialogProps>
  >({});
  const [file, setFile] = useLocalStorage<ImageData | null>(
    "uploadedFile",
    null,
  );
  const [selectedStyle, setSelectedStyle] = useLocalStorage<ImageData | null>(
    "selectedStyle",
    null,
  );
  const [error, setError] = useState<string | null>(null);
  const { trialId, freeUsed } = useTrialId();
  const { handleGenerate, generateStatus, generatedImage, loading } =
    useImageGeneration({
      file,
      selectedStyle,
      trialId: typeof trialId === "string" ? trialId : null,
      freeUsed: typeof freeUsed === "boolean" ? freeUsed : false,
      setMessageDialog,
      setIsDialogOpen,
      addToast,
    });
  const handleDownloadGeneratedImage = useDownloadImage({
    generatedImage,
    selectedStyle,
    addToast,
  });
  const [steps] = useProgressSteps(file, selectedStyle, generateStatus);
  const handleRemoveFile = useFileRemove({
    file,
    setFile,
    addToast,
  });
  const handleStyleSelection = useStyleSelection({
    file,
    setSelectedStyle,
    addToast,
  });
  useScrollLock(isDialogOpen);
  const disableMotion = isDialogOpen;
  return (
    <div
      id="upload-page"
      className={`from-background via-primary/20 to-background text-text-light relative flex min-h-screen w-full items-center justify-center bg-gradient-to-br md:overflow-x-hidden ${
        isDialogOpen ? "overflow-hidden" : "overflow-auto"
      }`}
    >
      <AppHeader freeUsed={!!freeUsed} />
      <MessageDialog
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        title={messageDialog.title ?? ""}
        description={messageDialog.description ?? ""}
        primaryAction={
          messageDialog.primaryAction ?? { label: "", onClick: () => {} }
        }
        secondaryAction={messageDialog.secondaryAction}
      />

      <main className="mt-20 flex w-full max-w-4xl flex-col items-center justify-center px-4">
        <ProgressBar steps={steps} />
        <section className="relative flex h-auto min-h-[24rem] w-full items-center justify-center md:h-96">
          {loading ? (
            <Loader />
          ) : generateStatus === "success" && generatedImage?.imageUrl ? (
            <motion.div
              className="flex h-full w-full flex-col items-center justify-center gap-x-20 overflow-hidden md:flex-row"
              initial={disableMotion ? false : { opacity: 0, y: 30 }}
              animate={disableMotion ? false : { opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 30 }}
              transition={disableMotion ? undefined : { duration: 0.5 }}
            >
              <motion.div
                key="generated-preview"
                initial={
                  disableMotion ? false : { opacity: 0, scale: 0.95, y: 30 }
                }
                animate={disableMotion ? false : { opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 30 }}
                transition={disableMotion ? undefined : { duration: 0.5 }}
              >
                <PreviewCard
                  id={generatedImage.id}
                  imageUrl={generatedImage.imageUrl ?? ""}
                  title={generatedImage.title ?? ""}
                  convertedStyleLabel={generatedImage.convertedStyleLabel}
                  isStyleCard={false}
                  onRemove={() => {}}
                  disableRemoveButton={false}
                  fileSize={generatedImage.fileSize}
                />
              </motion.div>
              <motion.div
                id="image-download-actions"
                className="mt-4 flex h-full flex-col items-center justify-center gap-4 md:mt-0"
                initial={disableMotion ? false : { opacity: 0, x: 40 }}
                animate={disableMotion ? false : { opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 40 }}
                transition={
                  disableMotion ? undefined : { duration: 0.5, delay: 0.2 }
                }
              >
                <Button
                  variant={"gradient"}
                  className="w-full max-w-xs"
                  onClick={handleDownloadGeneratedImage}
                  disabled={isDialogOpen}
                >
                  Download
                </Button>
                <Button
                  variant={"outline"}
                  className="w-full max-w-xs text-white"
                  onClick={() => {}}
                  disabled={isDialogOpen}
                >
                  Generate Another for ₹9
                </Button>
                <SocialShare />
              </motion.div>
            </motion.div>
          ) : (
            <>
              {!file && (
                <motion.div
                  key="dropzone-inner"
                  initial={disableMotion ? false : { opacity: 0, scale: 0.95 }}
                  animate={disableMotion ? false : { opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={disableMotion ? undefined : { duration: 0.4 }}
                  className="flex h-full w-full max-w-sm items-center justify-center"
                >
                  <MyDropzone
                    file={file}
                    setFile={setFile}
                    setError={setError}
                    error={error}
                    disabled={isDialogOpen}
                  />
                </motion.div>
              )}

              {file && (
                <div className="flex w-full flex-col items-center justify-center md:flex-row">
                  <PreviewCard
                    id={file.imageUrl}
                    imageUrl={file.imageUrl}
                    title={file.title}
                    isStyleCard={false}
                    onRemove={handleRemoveFile}
                    disableRemoveButton={!!selectedStyle || isDialogOpen}
                    fileSize={file.fileSize}
                  />

                  {selectedStyle && (
                    <>
                      <div className="justify-centre flex h-full w-full flex-col items-center">
                        <ArrowIndicator show={!!selectedStyle} />
                        <motion.div
                          className="mt-8 hidden w-full items-center justify-center md:flex"
                          initial={
                            disableMotion ? false : { opacity: 0, y: 30 }
                          }
                          animate={disableMotion ? false : { opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: 30 }}
                          transition={
                            disableMotion
                              ? undefined
                              : { duration: 0.5, delay: 0.5 }
                          }
                        >
                          <Button
                            variant={"gradient"}
                            className="w-full max-w-xs md:max-w-1/2"
                            onClick={handleGenerate}
                            disabled={isDialogOpen}
                          >
                            Generate
                          </Button>
                        </motion.div>
                      </div>

                      <PreviewCard
                        id={selectedStyle.id}
                        imageUrl={selectedStyle.imageUrl}
                        title={selectedStyle.title}
                        isStyleCard={true}
                        stylePrompt={selectedStyle.stylePrompt}
                        onRemove={() => setSelectedStyle(null)}
                        disableRemoveButton={isDialogOpen}
                      />
                      <motion.div
                        className="mt-4 flex w-full items-center justify-center px-2 md:hidden"
                        initial={disableMotion ? false : { opacity: 0, y: 30 }}
                        animate={disableMotion ? false : { opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 30 }}
                        transition={
                          disableMotion
                            ? undefined
                            : { duration: 0.5, delay: 0.5 }
                        }
                      >
                        <Button
                          variant={"gradient"}
                          className="w-full max-w-xs md:max-w-1/2"
                          onClick={handleGenerate}
                          disabled={isDialogOpen}
                        >
                          Generate
                        </Button>
                      </motion.div>
                    </>
                  )}
                </div>
              )}
            </>
          )}
        </section>

        {/* Trending Styles */}
        <section
          id="card-slider"
          className={`flex w-full flex-col items-start justify-start px-2 pt-2 pb-3 sm:px-4 md:-mt-6 md:px-8 ${selectedStyle ? "mt-20" : "mt-3"}`}
        >
          <h2 className="selection:bg-primary/50 mb-2 w-full text-center text-xl font-bold text-white drop-shadow selection:text-white md:text-xl lg:text-2xl">
            Trending Styles
          </h2>
          <motion.div
            className="scrollbar-thin scrollbar-thumb-primary/30 scrollbar-track-transparent flex w-full items-center justify-start gap-3 overflow-x-auto px-1 py-1 sm:gap-4 md:gap-6"
            initial={disableMotion ? false : { opacity: 0, y: 20 }}
            animate={disableMotion ? false : { opacity: 1, y: 0 }}
            transition={
              disableMotion ? undefined : { duration: 0.5, delay: 0.2 }
            }
          >
            {stylesData.map((style, idx) => (
              <motion.div
                key={style.id}
                initial={disableMotion ? false : { opacity: 0, scale: 0.95 }}
                animate={disableMotion ? false : { opacity: 1, scale: 1 }}
                transition={
                  disableMotion
                    ? undefined
                    : { duration: 0.3, delay: idx * 0.05 }
                }
              >
                <StyleCard
                  style={style}
                  onClick={isDialogOpen ? () => {} : handleStyleSelection}
                  disabled={isDialogOpen}
                />
              </motion.div>
            ))}
          </motion.div>
        </section>
      </main>
    </div>
  );
}
