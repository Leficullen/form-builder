import React, { useRef, useState } from "react";
import { Upload, X } from "lucide-react";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

interface ImageUploadProps {
  label: string;
  onImageChange: (file: File | null, preview: string | null) => void;
  className?: string;
}

export function ImageUpload({
  label,
  onImageChange,
  className,
}: ImageUploadProps) {
  const [preview, setPreview] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        setPreview(result);
        onImageChange(file, result);
      };
      reader.readAsDataURL(file);
    }
  };

  const clearImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setPreview(null);
    onImageChange(null, null);
    if (inputRef.current) {
      inputRef.current.value = "";
    }
  };

  return (
    <div className={twMerge("flex flex-col items-center gap-3", className)}>
      <span className="text-romantic-100 font-medium tracking-wide text-sm uppercase">
        {label}
      </span>

      <div
        onClick={() => inputRef.current?.click()}
        className={clsx(
          "relative group cursor-pointer w-32 h-32 rounded-full border-2 border-dashed transition-all duration-300 flex items-center justify-center overflow-hidden",
          preview
            ? "border-romantic-500 shadow-[0_0_20px_rgba(247,29,57,0.3)]"
            : "border-white/20 hover:border-romantic-300 hover:bg-white/5"
        )}
      >
        <input
          type="file"
          ref={inputRef}
          onChange={handleFileChange}
          accept="image/*"
          className="hidden"
        />

        {preview ? (
          <>
            <img
              src={preview}
              alt="Preview"
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
            />
            <button
              onClick={clearImage}
              className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white"
            >
              <X size={24} />
            </button>
          </>
        ) : (
          <div className="flex flex-col items-center text-white/50 group-hover:text-romantic-200 transition-colors">
            <Upload size={24} className="mb-1" />
            <span className="text-xs">Upload</span>
          </div>
        )}
      </div>
    </div>
  );
}
