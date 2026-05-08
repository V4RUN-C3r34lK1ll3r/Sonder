"use client";

import { useState, useRef, useCallback } from "react";
import { X, Upload, CheckCircle, AlertCircle, Loader } from "lucide-react";

interface Event {
  _id: string;
  name: string;
  category: string;
}

interface FileItem {
  id: string;
  file: File;
  preview: string;
  status: "pending" | "uploading" | "done" | "error";
  error?: string;
}

export function PhotoUploader({ events }: { events: Event[] }) {
  const [selectedEventId, setSelectedEventId] = useState("");
  const [files, setFiles] = useState<FileItem[]>([]);
  const [isDragOver, setIsDragOver] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadDone, setUploadDone] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const addFiles = (incoming: FileList | null) => {
    if (!incoming) return;
    const imageFiles = Array.from(incoming).filter((f) =>
      f.type.startsWith("image/")
    );
    const items: FileItem[] = imageFiles.map((f) => ({
      id: `${Date.now()}-${Math.random()}`,
      file: f,
      preview: URL.createObjectURL(f),
      status: "pending",
    }));
    setFiles((prev) => [...prev, ...items]);
    setUploadDone(false);
  };

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    addFiles(e.dataTransfer.files);
  }, []);

  const removeFile = (id: string) => {
    setFiles((prev) => {
      const item = prev.find((f) => f.id === id);
      if (item) URL.revokeObjectURL(item.preview);
      return prev.filter((f) => f.id !== id);
    });
  };

  const handleUpload = async () => {
    if (!selectedEventId || files.length === 0) return;

    setIsUploading(true);
    setUploadDone(false);

    // Upload in batches of 5
    const BATCH = 5;
    const pending = files.filter((f) => f.status === "pending");

    for (let i = 0; i < pending.length; i += BATCH) {
      const batch = pending.slice(i, i + BATCH);
      const formData = new FormData();
      formData.append("eventId", selectedEventId);
      batch.forEach((item) => formData.append("files", item.file));

      // Mark batch as uploading
      setFiles((prev) =>
        prev.map((f) =>
          batch.find((b) => b.id === f.id) ? { ...f, status: "uploading" } : f
        )
      );

      try {
        const res = await fetch("/api/upload", { method: "POST", body: formData });
        const data = await res.json();

        if (!res.ok) throw new Error(data.error || "Upload failed");

        setFiles((prev) =>
          prev.map((f) =>
            batch.find((b) => b.id === f.id) ? { ...f, status: "done" } : f
          )
        );
      } catch (err) {
        const message = err instanceof Error ? err.message : "Error";
        setFiles((prev) =>
          prev.map((f) =>
            batch.find((b) => b.id === f.id)
              ? { ...f, status: "error", error: message }
              : f
          )
        );
      }
    }

    setIsUploading(false);
    setUploadDone(true);
  };

  const doneCount = files.filter((f) => f.status === "done").length;
  const errorCount = files.filter((f) => f.status === "error").length;
  const pendingCount = files.filter((f) => f.status === "pending").length;

  return (
    <div className="space-y-8">

      {/* Event selector */}
      <div>
        <label className="block text-[10px] tracking-[0.4em] uppercase text-gold mb-3">
          Select Event
        </label>
        <select
          value={selectedEventId}
          onChange={(e) => setSelectedEventId(e.target.value)}
          className="w-full bg-surface border border-border text-ivory px-4 py-3 text-sm focus:outline-none focus:border-gold transition-colors duration-200"
        >
          <option value="">— Choose an event —</option>
          {events.map((ev) => (
            <option key={ev._id} value={ev._id}>
              {ev.category} · {ev.name}
            </option>
          ))}
        </select>
      </div>

      {/* Drop zone */}
      <div
        onDrop={handleDrop}
        onDragOver={(e) => { e.preventDefault(); setIsDragOver(true); }}
        onDragLeave={(e) => { e.preventDefault(); setIsDragOver(false); }}
        onClick={() => fileInputRef.current?.click()}
        className={`relative border-2 border-dashed transition-all duration-300 cursor-pointer p-16 text-center
          ${isDragOver
            ? "border-gold bg-gold/5 scale-[1.01]"
            : "border-border hover:border-gold/50 hover:bg-surface/50"
          }`}
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept="image/*"
          className="hidden"
          onChange={(e) => addFiles(e.target.files)}
        />
        <div className={`w-14 h-14 mx-auto mb-5 flex items-center justify-center border transition-colors duration-300
          ${isDragOver ? "border-gold text-gold" : "border-border text-muted"}`}>
          <Upload className="w-6 h-6" />
        </div>
        <p className="font-serif text-2xl text-ivory mb-2">
          {isDragOver ? "Drop to add" : "Drag photos here"}
        </p>
        <p className="text-muted text-sm">or click to browse — select multiple at once</p>
      </div>

      {/* File grid */}
      {files.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-4">
            <p className="text-[10px] tracking-[0.4em] uppercase text-muted">
              {files.length} photo{files.length !== 1 ? "s" : ""} selected
            </p>
            <button
              onClick={() => setFiles([])}
              className="text-[10px] tracking-[0.3em] uppercase text-muted hover:text-ivory transition-colors duration-200"
            >
              Clear all
            </button>
          </div>

          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2">
            {files.map((item) => (
              <div key={item.id} className="relative group aspect-square">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={item.preview}
                  alt=""
                  className={`w-full h-full object-cover transition-opacity duration-200
                    ${item.status === "done" ? "opacity-50" : "opacity-100"}`}
                />

                {/* Status overlay */}
                {item.status === "uploading" && (
                  <div className="absolute inset-0 bg-canvas/70 flex items-center justify-center">
                    <Loader className="w-5 h-5 text-gold animate-spin" />
                  </div>
                )}
                {item.status === "done" && (
                  <div className="absolute inset-0 bg-canvas/50 flex items-center justify-center">
                    <CheckCircle className="w-5 h-5 text-green-400" />
                  </div>
                )}
                {item.status === "error" && (
                  <div className="absolute inset-0 bg-red-900/60 flex items-center justify-center">
                    <AlertCircle className="w-5 h-5 text-red-300" />
                  </div>
                )}

                {/* Remove button */}
                {item.status === "pending" && (
                  <button
                    onClick={(e) => { e.stopPropagation(); removeFile(item.id); }}
                    className="absolute top-1 right-1 bg-canvas/80 p-0.5 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                  >
                    <X className="w-3 h-3 text-ivory" />
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Upload button */}
      {files.length > 0 && (
        <div className="flex items-center justify-between pt-4 border-t border-border">
          <div className="text-sm text-muted">
            {isUploading && (
              <span>Uploading {doneCount} / {files.length}…</span>
            )}
            {uploadDone && !isUploading && (
              <span className="text-green-400">
                {doneCount} uploaded{errorCount > 0 ? `, ${errorCount} failed` : ""} — publish in Studio to go live
              </span>
            )}
          </div>
          <button
            onClick={handleUpload}
            disabled={isUploading || !selectedEventId || pendingCount === 0}
            className="px-10 py-3.5 bg-gold text-canvas text-xs tracking-[0.25em] uppercase font-semibold
              hover:bg-gold-light transition-colors duration-300
              disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {isUploading ? "Uploading…" : `Upload ${pendingCount > 0 ? pendingCount : ""} Photos`}
          </button>
        </div>
      )}
    </div>
  );
}
