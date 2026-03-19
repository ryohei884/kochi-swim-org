"use client";

import { ScissorsIcon } from "lucide-react";
import Image from "next/image";
import * as React from "react";
import { ChangeEvent, RefObject, useRef, useState } from "react";
import Cropper, { ReactCropperElement } from "react-cropper";
import type { UseFormRegister } from "react-hook-form";
import "../../..//node_modules/react-cropper/node_modules/cropperjs/dist/cropper.css";

import { Button } from "@/components/ui/button";
import { FormLabel } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";

type Props = {
  id: string;
  defaultValue: string | undefined | null;
  onCropped: (...event: any[]) => void;
  onRegister: UseFormRegister<{
    title: string;
    detail: string;
    fromDate: Date;
    toDate: Date | null;
    linkString: string | null;
    order: number;
    createdUserId: string;
    approvedUserId: string | null;
    linkCategory: string;
    image: string | File | null;
  }>;
};

const CropperButton = ({
  id,
  className,
  defaultValue,
  onCropped,
  onRegister,
  type,
  ...props
}: Props & React.ComponentProps<"input">) => {
  const [imageSrc, setImageSrc] = useState<string | null>(
    defaultValue !== undefined ? defaultValue : "/logo.png",
  );
  const cropperRef: RefObject<ReactCropperElement | null> =
    useRef<ReactCropperElement>(null);
  const [preview, setPreview] = useState<string | null>(
    defaultValue !== undefined ? defaultValue : "/logo.png",
  );

  const handleCrop = (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>,
  ) => {
    event.preventDefault();
    if (cropperRef.current) {
      const cropper = cropperRef.current.cropper;
      const croppedImage = cropper.getCroppedCanvas().toDataURL("image/png");

      const csvFile = new File([croppedImage], "cropped_image.png", {
        type: "image/png",
      });

      const dt = new DataTransfer();
      dt.items.add(csvFile);

      const inputUrl = document.getElementById("image") as HTMLInputElement;
      inputUrl.addEventListener("change", (e) => {
        onCropped(e);
      });
      inputUrl.files = dt.files;
      inputUrl.multiple = false;
      const e = new Event("change");
      inputUrl.dispatchEvent(e);
      setPreview(croppedImage);
    }
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImageSrc(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="container w-full">
      <Input
        id="file_input_ref"
        type="file"
        accept="image/*"
        className={className}
        onChange={(e) => {
          handleFileChange(e);
        }}
      />
      <input id="image" type="file" accept="image/*" hidden {...props} />
      {imageSrc && (
        <div className="col-md-6 col-12 mx-auto">
          <Cropper
            src={imageSrc}
            style={{ width: "100%" }}
            aspectRatio={3 / 2}
            guides={false}
            ref={cropperRef}
            viewMode={1}
          />

          <div className="w-full text-center mt-2">
            <Button
              variant="outline"
              size="icon"
              aria-label="切り取り"
              onClick={(e) => handleCrop(e)}
            >
              <ScissorsIcon />
            </Button>
          </div>

          <div className="max-w-140 mt-4">
            <FormLabel className="pb-2">プレビュー</FormLabel>
            {preview ? (
              <Image
                src={preview}
                alt="プレビュー"
                height={229}
                width={344}
                className="w-full aspect-3/2 border-2 rounded-2xl object-contain object-center"
              />
            ) : (
              <Skeleton className="w-full  aspect-3/2 border-2 rounded-2xl bg-accent  flex justify-center items-center" />
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default CropperButton;
