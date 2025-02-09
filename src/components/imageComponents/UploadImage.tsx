import React from "react";

interface UploadImageProps {
  selectedFile: File | null;
  loading: boolean;
  error: string | null;
  onFileSelect: (file: File | null) => void;
  onUpload: () => void;
  onFetch?: () => void;
}

const UploadImage: React.FC<UploadImageProps> = ({
  selectedFile,
  loading,
  error,
  onFileSelect,
  onUpload,
}) => {
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] || null;
    onFileSelect(file);
  };

  return (
    <div className="flex flex-col items-center gap-4 p-4">
      <h2 className="text-xl text-[#2C3930]">Upload Image</h2>

      <div className="w-full max-w-md">
        {/* Custom styled file input */}
        <div className="relative w-full">
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            disabled={loading}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
          />
          <div className="border border-gray-300 rounded-full bg-white p-2 flex items-center">
            <span className="bg-[#A27B5C] text-white px-4 py-2 rounded-full text-sm">
              Choose File
            </span>
            <span className="ml-3 text-[#3F4F44]">
              {selectedFile ? selectedFile.name : "No file chosen"}
            </span>
          </div>
        </div>

        {error && (
          <div className="mt-2 text-[#3F4F44] text-sm text-center">{error}</div>
        )}

        {/* Action Buttons */}
        <div className="space-y-2 mt-4">
          <button
            onClick={onUpload}
            disabled={!selectedFile || loading}
            className={`w-full p-3 rounded-full text-center cursor-pointer bg-[#A27B5C] transition-colors text-white ${
              loading || !selectedFile ? " cursor-not-allowed" : ""
            }`}
          >
            {loading ? "Uploading..." : "Upload Image"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default UploadImage;
