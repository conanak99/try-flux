import { getImages } from "@/app/services/image-store";
import Link from "next/link";

export const dynamic = "force-dynamic";
export const revalidate = 0;

const getImageUrl = (imageUrl: string) => {
  if (imageUrl.startsWith("http")) {
    return `//wsrv.nl/?url=${imageUrl}`;
  }
  return imageUrl;
};

export default async function GalleryPage() {
  const images = await getImages();

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
          <div key={index} className="relative aspect-[3/4]">
            <img
              src={getImageUrl(image.image)}
              alt={image.prompt}
              className="w-full h-full object-contain object-top"
            />
            <div className="absolute top-2 right-2 bg-black bg-opacity-50 text-white p-1 text-xs max-w-[80%] line-clamp-3">
              {image.prompt}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
