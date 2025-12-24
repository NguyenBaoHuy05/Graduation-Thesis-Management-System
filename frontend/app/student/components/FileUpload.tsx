"use client";

import { useState } from "react";
import { createClient } from "@supabase/supabase-js";
import { UploadCloud, FileText, X } from "lucide-react";

// Initialize Supabase Client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";
const supabase = createClient(supabaseUrl, supabaseKey);

interface FileUploadProps {
  onUploadComplete: (urls: string[]) => void;
  maxFiles?: number;
}

export default function FileUpload({
  onUploadComplete,
  maxFiles = 3,
}: FileUploadProps) {
  const [files, setFiles] = useState<File[]>([]);
  const [uploading, setUploading] = useState(false);
  const [uploadedUrls, setUploadedUrls] = useState<string[]>([]);
  const [error, setError] = useState("");

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      if (files.length + newFiles.length > maxFiles) {
        setError(`Chỉ được upload tối đa ${maxFiles} file.`);
        return;
      }
      setFiles((prev) => [...prev, ...newFiles]);
      setError("");
    }
  };

  const removeFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleUpload = async () => {
    if (files.length === 0) return;

    setUploading(true);
    setError("");
    const urls: string[] = [];

    try {
      for (const file of files) {
        const formData = new FormData();
        formData.append("file", file);

        const response = await fetch("http://localhost:3000/upload/file", {
          method: "POST",
          body: formData,
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || "Upload failed");
        }

        const data = await response.json();
        urls.push(data.url);
      }

      setUploadedUrls(urls);
      onUploadComplete(urls);
      setFiles([]); // Clear queue
      alert("Upload thành công!");
    } catch (err: any) {
      console.error("Upload error:", err);
      setError("Có lỗi xảy ra khi upload: " + err.message);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="border border-dashed border-gray-300 rounded-lg p-6 bg-gray-50 text-center">
      <div className="mb-4">
        <UploadCloud className="mx-auto text-blue-500 mb-2" size={40} />
        <p className="text-sm text-gray-600">
          Kéo thả hoặc click để chọn file (PDF, Word, Zip)
        </p>
        <p className="text-xs text-gray-400 mt-1">Tối đa {maxFiles} file.</p>
      </div>

      <input
        type="file"
        multiple
        onChange={handleFileChange}
        className="hidden"
        id="file-upload"
      />
      <label
        htmlFor="file-upload"
        className="inline-block px-4 py-2 bg-white border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 cursor-pointer"
      >
        Chọn file
      </label>

      {/* File List */}
      {files.length > 0 && (
        <div className="mt-4 text-left space-y-2">
          {files.map((file, idx) => (
            <div
              key={idx}
              className="flex items-center justify-between bg-white p-2 rounded border"
            >
              <div className="flex items-center gap-2 overflow-hidden">
                <FileText size={16} className="text-blue-600 shrink-0" />
                <span className="text-sm truncate max-w-[200px]">
                  {file.name}
                </span>
                <span className="text-xs text-gray-400">
                  ({(file.size / 1024 / 1024).toFixed(2)} MB)
                </span>
              </div>
              <button
                onClick={() => removeFile(idx)}
                className="text-red-500 hover:bg-red-50 p-1 rounded"
              >
                <X size={16} />
              </button>
            </div>
          ))}
        </div>
      )}

      {error && <p className="text-red-500 text-sm mt-2">{error}</p>}

      {files.length > 0 && (
        <button
          onClick={handleUpload}
          disabled={uploading}
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-blue-300 w-full"
        >
          {uploading ? "Đang upload..." : "Xác nhận Upload"}
        </button>
      )}
    </div>
  );
}
