import { useState } from "react";
import { Dialog } from "@mui/material";

interface ImageGalleryProps {
  images: string[];
}

const ImageGallery = ({ images }: ImageGalleryProps) => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  return (
    <div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 w-4/5 mx-auto">
        {images.map((url, index) => (
          <div
            key={index}
            className="relative group cursor-pointer"
            onClick={() => setSelectedImage(url)}
          >
            <img
              src={url}
              alt={`Image ${index + 1}`}
              className="w-full h-96 object-cover rounded-lg transition-transform duration-300 group-hover:scale-105"
            />
          </div>
        ))}
      </div>

      <Dialog
        open={!!selectedImage}
        onClose={() => setSelectedImage(null)}
        maxWidth="lg"
      >
        {selectedImage && (
          <img
            src={selectedImage}
            alt="Preview"
            className="max-w-full max-h-[90vh]"
          />
        )}
      </Dialog>
    </div>
  );
};

export default ImageGallery;
