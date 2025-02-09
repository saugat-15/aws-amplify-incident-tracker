import React, { act, useState } from "react";
import { post, get } from "aws-amplify/api";
import { fetchAuthSession } from "aws-amplify/auth";

const ServiceRequestForm = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(null);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setError(null);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      setError("Please select a file first");
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const session = await fetchAuthSession();
      const token = session.tokens?.idToken?.toString();
      if (!token) {
        throw new Error("No session found");
      }
      // Convert file to base64
      const reader = new FileReader();
      const base64Promise = new Promise<string>((resolve, reject) => {
        reader.onload = () => {
          const base64String = (reader.result as string).split(",")[1];
          resolve(base64String);
        };
        reader.onerror = reject;
      });
      reader.readAsDataURL(selectedFile);

      const base64Data = await base64Promise;

      const response = post({
        apiName: "img-api",
        path: "img",
        options: {
          headers: {
            Authorization: token,
          },
          body: {
            action: "upload",
            fileName: selectedFile.name,
            imageData: base64Data,
          },
        },
      });

      const apiResponse = await (await response.response).body.json();
      console.log("API response:", apiResponse);
      setSelectedFile(null);
      // Reset file input
      const fileInput = document.querySelector(
        'input[type="file"]'
      ) as HTMLInputElement;
      if (fileInput) fileInput.value = "";
    } catch (err) {
      console.error("Upload error:", err);
      setError("Failed to upload image. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleFetch = async () => {
    try {
      setLoading(true);
      setError(null);

      const session = await fetchAuthSession();
      const token = session.tokens?.idToken?.toString();
      if (!token) {
        throw new Error("No session found");
      }

      const response = get({
        apiName: "img-api",
        path: "img",
        options: {
          headers: {
            Authorization: token,
          },
        },
      });

      const apiResponse = await (await response.response).body.json();
      console.log("API response:", apiResponse);
      if (apiResponse) {
        setImageUrl(apiResponse);
      }
    } catch (err) {
      console.error("Fetch error:", err);
      setError("Failed to fetch image. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-xl mb-4">Upload Image</h2>
      <div className="flex gap-4 flex-col">
        <input
          type="file"
          accept="image/*"
          onChange={handleFileSelect}
          disabled={loading}
          className="border p-2 cursor-pointer rounded w-full bg-gray-100 focus:outline-none focus:ring focus:ring-blue-500 focus:ring-opacity-50"
        />

        {error && <div className="text-red-500">{error}</div>}
        <div className="flex gap-4 items-center">
          <button
            onClick={handleUpload}
            disabled={!selectedFile || loading}
            className={`px-4 py-2 rounded ${
              loading || !selectedFile
                ? "bg-gray-300 cursor-not-allowed"
                : "bg-blue-500 hover:bg-blue-600 text-white"
            }`}
          >
            {loading ? "Uploading..." : "Upload Image"}
          </button>

          <button
            onClick={handleFetch}
            disabled={loading}
            className={`px-4 py-2 rounded ${
              loading
                ? "bg-gray-300 cursor-not-allowed"
                : "bg-blue-500 hover:bg-blue-600 text-white"
            }`}
          >
            {loading ? "Fetching..." : "Fetch Image"}
          </button>
        </div>

        {imageUrl && (
          <div className="mt-4">
            <img
              src={imageUrl[0]}
              alt="Fetched"
              className="max-w-full h-auto"
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default ServiceRequestForm;
