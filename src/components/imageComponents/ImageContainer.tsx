import React, { useState } from "react";
import { get } from "aws-amplify/api";
import { fetchAuthSession } from "aws-amplify/auth";
import ListImages from "./ListImages";
import UploadImageContainer from "./UploadImageContainer";

enum ACTION {
  LIST = "LIST",
}

const ImageContainer = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [imageUrls, setImageUrls] = useState<string[] | null>(null);

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
          queryParams: {
            action: ACTION.LIST,
          },
        },
      });

      const apiResponse = await (await response.response).body.json();
      console.log("API response:", apiResponse);
      if (apiResponse.data) {
        setImageUrls(apiResponse.data);
      }
    } catch (err) {
      console.error("Fetch error:", err);
      setError("Failed to fetch images. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleUploadSuccess = () => {
    handleFetch(); // Refetch images after a successful upload
  };

  return (
    <div className="p-4">
      <UploadImageContainer onUploadSuccess={handleUploadSuccess} />
      <ListImages
        loading={loading}
        error={error}
        imageUrls={imageUrls}
        onFetch={handleFetch}
      />
    </div>
  );
};

export default ImageContainer;
