import React from "react";
import ImageGallery from "./ImageGallery";
import { CircularProgress } from "@mui/material";

interface ListImagesProps {
  loading: boolean;
  error: string | null;
  imageUrls: string[] | null;
  onFetch: () => void;
}

const ListImages: React.FC<ListImagesProps> = ({
  loading,
  error,
  imageUrls,
  onFetch,
}) => {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex gap-4 items-center w-4/5 mx-auto">
        <h2 className="text-xl font-bold text-[#2C3930]">Image Gallery</h2>
        <button
          onClick={onFetch}
          disabled={loading}
          className={`px-4 py-2 rounded-full ${
            loading
              ? "bg-[#e3fcd6] cursor-not-allowed"
              : "bg-[#A27B5C] hover:opacity-90 text-white cursor-pointer"
          }`}
        >
          {loading ? "Fetching..." : "Refresh Images"}
        </button>
      </div>

      {loading && (
        <div className="flex justify-center py-8">
          <CircularProgress sx={{ color: "#A27B5C" }} />
        </div>
      )}

      {error && <p className="text-red-500 text-center py-4">{error}</p>}

      {imageUrls?.length ? (
        <ImageGallery images={imageUrls} />
      ) : (
        <p className="text-[#2C3930] text-center py-8">
          No images found. Upload some images to get started!
        </p>
      )}
    </div>
  );
};

export default ListImages;
