import { useEffect, useState } from "react";

const BASE_FILE_URL =
  import.meta.env.VITE_FILE_URL || "http://localhost:5004/public/";

const isImagePath = (path) =>
  /\.(avif|bmp|gif|jpe?g|png|svg|webp)(?:[?#].*)?$/i.test(String(path || ""));

const isImageFile = (file) =>
  file.type.startsWith("image/") || isImagePath(file.name);

const getExistingFileUrl = (filePath) => {
  const cleanPath = String(filePath || "").replace(/\\/g, "/");
  if (/^https?:\/\//i.test(cleanPath)) return cleanPath;

  const relativePath = cleanPath
    .replace(/^public\//i, "")
    .replace(/^\/+/, "");
  return `${BASE_FILE_URL}${relativePath}`;
};

export default function LeadDocumentPreviews({
  documentType,
  files = [],
  existingFiles = [],
}) {
  const [newImagePreviews, setNewImagePreviews] = useState([]);

  useEffect(() => {
    const previews = files
      .filter(isImageFile)
      .map((file) => ({ name: file.name, url: URL.createObjectURL(file) }));
    setNewImagePreviews(previews);

    return () => {
      previews.forEach(({ url }) => URL.revokeObjectURL(url));
    };
  }, [files]);

  const existingImagePreviews = existingFiles
    .filter(isImagePath)
    .map((filePath) => ({
      name: String(filePath).replace(/\\/g, "/").split("/").pop(),
      url: getExistingFileUrl(filePath),
    }));

  const previews = [
    ...existingImagePreviews.map((preview) => ({ ...preview, isExisting: true })),
    ...newImagePreviews,
  ];

  if (previews.length === 0) return null;

  return (
    <div className="flex flex-wrap gap-3">
      {previews.map((preview, index) => (
        <div
          key={`${preview.url}-${index}`}
          className="block rounded-md border border-gray-200 bg-white p-1"
          title={preview.name}
        >
          <img
            src={preview.url}
            alt={`${documentType} ${preview.isExisting ? "existing" : "preview"}`}
            className="h-20 w-20 rounded object-cover"
          />
          <span className="block max-w-20 truncate px-1 pt-1 text-[10px] text-gray-500">
            {preview.name}
          </span>
        </div>
      ))}
    </div>
  );
}
