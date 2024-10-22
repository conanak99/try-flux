import { ExternalLink } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

import codedao from './codedao.jpg';
import hoccodeai from './hoccode.jpg';

export default function Component() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-100 to-white flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-bold text-blue-600 mb-2">
            Tạm dừng dự án Tạo Ảnh Flux
          </CardTitle>
          <p className="text-gray-600">
            Hy vọng bạn đã có những trải nghiệm tuyệt vời khi tạo ảnh với dự án.
          </p>
        </CardHeader>
        <CardContent className="space-y-10">
          <div className="flex items-center justify-center space-x-4">
            <Image
              src={hoccodeai}
              width={100}
              height={100}
              className="w-12 h-12 text-blue-500"
              alt="Logo Học Code AI"
            />
            <span className="text-2xl font-semibold text-gray-700">+</span>
            <Image
              src={codedao}
              width={100}
              height={100}
              className="w-12 h-12 text-blue-500"
              alt="Logo Tôi Đi Code Dạo"
            />
          </div>
          <div className="text-center space-y-2">
            <h2 className="text-2xl font-semibold text-gray-800">
              Cảm ơn bạn đã sử dụng Tạo Ảnh AI với Flux
            </h2>
            <p className="text-gray-600">
              Dự án Tạo Ảnh Flux đã kết thúc vì lý do kinh phí duy trì server.
              <br /> Cảm ơn 2 nhà tài trợ{' '}
              <Link
                className="text-blue-600 hover:underline"
                href="https://hoccodeai.com"
                target="_blank"
              >
                Học Code AI
              </Link>{' '}
              và{' '}
              <Link
                className="text-blue-600 hover:underline"
                href="https://toidicode.com"
                target="_blank"
              >
                Tôi Đi Code Dạo
              </Link>{' '}
              đã đồng hành trong thời gian vừa qua.
            </p>
          </div>
          <div className="bg-blue-50 p-4 rounded-lg">
            <p className="text-center text-blue-700">
              Hãy ghé thăm HocCodeAI để tìm hiểu thêm về các dự án mới, cũng như
              các khoá học về AI để có thể tự code 1 dự án tương tự nhé.
            </p>
          </div>
        </CardContent>
        <CardFooter className="flex justify-center">
          <Link
            href="https://hoccodeai.com"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Button
              className="bg-blue-600 hover:bg-blue-700 text-white text-xl"
              size="lg"
            >
              Khám phá thêm tại HocCodeAI
              <ExternalLink
                className="ml-2 h-4 w-4"
                aria-label="Mở liên kết ngoài"
              />
            </Button>
          </Link>
        </CardFooter>
      </Card>
    </div>
  );
}
