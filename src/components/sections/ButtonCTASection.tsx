import React from "react";
import { Button } from "../Button";
import { ArrowRight } from "lucide-react";

export const ButtonCTASection = () => {
  return (
    <section
      id="create-new-cta"
      className="mx-auto my-16 flex w-full items-center justify-center"
    >
      <Button
        variant="glossy"
        size="md"
        className="flex flex-row items-center justify-center font-bold"
        onClick={() => {
          // Scroll to the upload section
          const uploadSection = document.getElementById("upload-section");
          if (uploadSection) {
            uploadSection.scrollIntoView({ behavior: "smooth" });
          }
        }}
      >
        Start Creating Now
        <ArrowRight className="ml-2 h-5 w-5" />
      </Button>
    </section>
  );
};
