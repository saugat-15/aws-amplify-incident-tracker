import { useState } from "react";
import { post } from "aws-amplify/api";
import { fetchAuthSession } from "aws-amplify/auth";
import UploadImage from "./UploadImage";

enum ACTION {
  UPLOAD = "UPLOAD",
}

const UploadImageContainer = ({
  onUploadSuccess,
}: {
  onUploadSuccess: () => void;
}) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFileSelect = (file: File | null) => {
    setSelectedFile(file);
    setError(null);
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
      const base64Data = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => {
          const base64String = (reader.result as string).split(",")[1];
          resolve(base64String);
        };
        reader.onerror = reject;
        reader.readAsDataURL(selectedFile);
      });

      const response = post({
        apiName: `img-api-${import.meta.env.VITE_AWS_BRANCH}`,
        path: "img",
        options: {
          headers: {
            Authorization: token,
          },
          body: {
            action: ACTION.UPLOAD,
            fileName: selectedFile.name,
            imageData: base64Data,
          },
        },
      });

      const apiResponse = await (await response.response).body.json();
      console.log("API response:", apiResponse);
      setSelectedFile(null);
      onUploadSuccess(); // Notify parent component of successful upload
    } catch (err) {
      console.error("Upload error:", err);
      setError("Failed to upload image. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <UploadImage
      selectedFile={selectedFile}
      loading={loading}
      error={error}
      onFileSelect={handleFileSelect}
      onUpload={handleUpload}
    />
  );
};

export default UploadImageContainer;
