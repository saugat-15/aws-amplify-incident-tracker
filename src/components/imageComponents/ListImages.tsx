import React from "react";

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
    <div className="flex gap-4 flex-col">
      <button
        onClick={onFetch}
        disabled={loading}
        className={`px-4 py-2 rounded ${
          loading
            ? "bg-[#e3fcd6] cursor-not-allowed"
            : "bg-[#A27B5C] hover:opacity-90 text-white rounded-full cursor-pointer"
        }`}
      >
        {loading ? "Fetching..." : "Fetch Images"}
      </button>
      {error && <p className="text-[#2C3930]">{error}</p>}
      {imageUrls?.length > 0 ? (
        imageUrls.map((url) => (
          <img
            key={url}
            src={url}
            alt="Uploaded"
            className="h-48 w-48 object-cover"
          />
        ))
      ) : (
        <p className="text-[#2C3930] text-center">No images found.</p>
      )}
    </div>
  );
};

export default ListImages;
