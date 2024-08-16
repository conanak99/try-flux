"use client";

import { useState } from "react";
import { generateImage as genImg } from "@/app/actions";

const ImageGenerator = () => {
  const [prompt, setPrompt] = useState("");
  const [error, setError] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const generateImage = async () => {
    if (prompt.trim() === "") return;
    if (isLoading) return;

    setIsLoading(true);
    const { translatedPrompt, imgUrl, error } = await genImg(prompt);
    console.log({ translatedPrompt, imgUrl, error });

    if (error || !imgUrl) {
      setError(error ?? "Thử lại nha bạn ei!!!");
      setIsLoading(false);
      return;
    }

    setImageUrl(imgUrl);
  };

  return (
    <div className="mt-6 max-w-full rounded-lg bg-white">
      <div className="max-w-xl mx-auto">
        <h2 className="mb-4 text-center text-xl font-bold">
          Tạo ảnh với Flux cùng Code Dạo
        </h2>

        <div className="mb-4">
          <label
            htmlFor="prompt"
            className="mb-4 block text-sm font-medium text-gray-700"
          >
            Muốn tạo gì thì gõ đây (Không tạo được ảnh người nổi tiếng)
          </label>
          <textarea
            id="prompt"
            name="prompt"
            rows={3}
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                generateImage();
              }
            }}
            placeholder="Describe the image you want to generate"
            className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <button
          onClick={generateImage}
          disabled={isLoading}
          className="w-full rounded-md bg-blue-500 px-4 py-2 text-white transition duration-300 hover:bg-blue-600"
        >
          Tạo ảnh
        </button>

        {error && (
          <div className="mt-4 p-2 bg-red-100 text-red-600 rounded-md">
            {error}
          </div>
        )}
      </div>

      <div className="relative mt-8 max-w-6xl mx-auto">
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center rounded-md bg-gray-200 bg-opacity-75">
            <div className="flex aspect-square w-full items-center justify-center">
              <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-t-2 border-blue-500"></div>
            </div>
          </div>
        )}
        {imageUrl && (
          <img
            src={imageUrl}
            alt="Generated"
            className="w-full rounded-md shadow-lg"
            onLoad={() => setIsLoading(false)}
          />
        )}
      </div>

      <div className="max-w-xl mx-auto text-center mt-8">
        <p className="text-base">
          Nếu bạn muốn học code app tương tự, nhớ để lại thông tin tại{" "}
          <a
            href="https://bit.ly/ai-codedao"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#B388FF] font-bold cursor-pointer"
          >
            bit.ly/ai-codedao
          </a>{" "}
          nha!
        </p>

        <p className="block mt-4">
          <span className="text-base">
            Powered by{" "}
            <a
              href="https://runware.ai/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#B388FF] font-bold cursor-pointer"
            >
              Runware.ai
            </a>
          </span>
        </p>
      </div>
    </div>
  );
};

export default ImageGenerator;
