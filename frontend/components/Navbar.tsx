"use client";
import Link from "next/link";
import { Search } from "lucide-react";

export default function Navbar() {
  const navLinks = [
    { name: "TRANG CHỦ", href: "/" },
    { name: "TRA CỨU BIỂU MẪU", href: "/forms" },
    { name: "LỊCH SỬ KỲ KHÓA LUẬN", href: "/archive" },
    { name: "CẨM NANG GIẢNG VIÊN", href: "#" },
    // { name: "CỔNG THÔNG TIN", href: "#" },
  ];

  return (
    <nav className="bg-[#004c8c] text-white sticky top-0 z-50 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-12">
          {/* Main Navigation */}
          <div className="flex space-x-1 overflow-x-auto no-scrollbar">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className="px-4 py-3 text-sm font-semibold hover:bg-[#003d73] transition whitespace-nowrap"
              >
                {link.name}
              </Link>
            ))}
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-4 shrink-0">
            {/* <button className="p-2 hover:bg-[#003d73] rounded-full transition">
                <Search size={18} />
            </button> */}
            <Link
              href="/login"
              className="bg-[#f26522] hover:bg-[#d95516] text-white text-sm font-bold px-4 py-1.5 rounded shadow-sm transition"
            >
              Đăng nhập
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
