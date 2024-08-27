import { imageStore } from "@/app/services/image-store";
import Link from "next/link";

export default async function GalleryPage() {
  const images = await imageStore.getImages();

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Image Gallery</h1>
      <Link
        href="/"
        className="text-blue-500 hover:underline mb-4 inline-block"
      >
        Back to Image Generator
      </Link>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {images.map((image, index) => (
          <div key={index} className="relative aspect-square">
            <img
              src={image.url}
              alt={image.prompt}
              className="w-full h-full object-cover"
            />
            <div className="absolute bottom-2 right-2 bg-black bg-opacity-50 text-white p-1 text-xs max-w-[90%] truncate">
              {image.prompt}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
