"use client";
import Image from "next/image";
import Link from "next/link";

export default function Header() {
  return (
    <header className="bg-white py-4 shadow-sm z-40 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center gap-4">
        <Link href="/" className="flex items-center gap-4">
          <div className="relative w-16 h-16 sm:w-20 sm:h-20 shrink-0">
            <Image
              src="/LOGO_FIT_2.png"
              alt="Logo"
              fill
              className="object-contain"
            />
          </div>
          <div className="flex flex-col">
            <h1 className="text-xl sm:text-2xl font-bold text-blue-900 uppercase leading-tight">
              KHoa Công nghệ thông tin trường Đại học Sư phạm Thành phố Hồ Chí
              Minh
            </h1>
            <h2 className="text-base sm:text-lg text-red-600 font-medium">
              Ho Chi Minh City University of Education
            </h2>
          </div>
        </Link>
        <div className="ml-auto flex items-center gap-4">
          <div className="hidden md:flex w-8 h-5 bg-red-600 items-center justify-center text-yellow-300 text-xs shadow-sm rounded">
            VN
          </div>
        </div>
      </div>
    </header>
  );
}
