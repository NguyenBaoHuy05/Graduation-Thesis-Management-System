"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { Lock, User } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

const role = ["Sinh viên", "Giảng viên", "Nhân viên"];

const Login: React.FC = () => {
  const [selectedRole, setSelectedRole] = useState(role[0]);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const { login } = useAuth();
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!username || !password) {
      setError("Vui lòng nhập đầy đủ thông tin");
      return;
    }

    const success = login(username, password, selectedRole);
    if (!success) {
      setError("Tên đăng nhập hoặc mật khẩu không đúng");
    } else {
      router.push(
        selectedRole === "Sinh viên"
          ? "/student"
          : selectedRole === "Giảng viên"
          ? "/teacher"
          : selectedRole === "Trưởng khoa"
          ? "/head"
          : selectedRole === "Nhân viên"
          ? "/secretary"
          : "/login"
      );
    }
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-blue-50 via-white to-blue-50 items-center justify-center lg:grid grid-cols-10 gap-2">
      <div className="hidden md:block col-span-7 bg-[url(/51.jpg)] bg-cover bg-center w-full h-full"></div>
      <div className="col-span-3 w-full h-screen flex items-center justify-center lg:bg-none lg:bg-white/70 lg:backdrop-blur-sm lg:py-10 lg:px-4 bg-[url(/51.jpg)] bg-cover bg-center backdrop-blur-0">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden w-[400px] mx-2">
          <div className="bg-linear-to-r from-blue-600 to-blue-700 px-10 py-10 text-white">
            <div className="flex items-center justify-center mb-4">
              <Link
                href="/"
                className="bg-white backdrop-blur-sm p-4 rounded-full"
              >
                <Image
                  src="/LOGO_FIT_2.png"
                  alt="Logo"
                  width={48}
                  height={48}
                />
              </Link>
            </div>
            <h1 className="text-3xl font-bold text-center mb-2">
              Quản lý Khóa luận
            </h1>
            <p className="text-blue-100 text-center text-sm">
              Khoa Công nghệ Thông tin - Trường Đại học Sư phạm TP.HCM
            </p>
          </div>

          <form onSubmit={handleSubmit} className="px-8 py-8 space-y-6">
            <div className="flex gap-4 font-bold justify-center mb-4 text-black">
              {role.map((r) =>
                r === selectedRole ? (
                  <span
                    key={r}
                    className="cursor-pointer border-b-2 border-blue-600 pb-1"
                  >
                    {r}
                  </span>
                ) : (
                  <span
                    key={r}
                    className="cursor-pointer text-gray-500 hover:text-gray-800 pb-1"
                    onClick={() => setSelectedRole(r)}
                  >
                    {r}
                  </span>
                )
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tên đăng nhập
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User size={20} className="text-gray-400" />
                </div>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full placeholder:text-gray-400 text-black pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  placeholder={`Nhập mã ${selectedRole.toLowerCase()}`}
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Mật khẩu
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock size={20} className="text-gray-400" />
                </div>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full placeholder:text-gray-400 text-black pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  placeholder="Nhập mật khẩu"
                />
              </div>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                {error}
              </div>
            )}

            <button
              type="submit"
              className="w-full bg-linear-to-r from-blue-600 to-blue-700 text-white py-3 rounded-lg font-medium hover:from-blue-700 hover:to-blue-800 transition-all transform hover:scale-[1.02] active:scale-[0.98] shadow-lg hover:shadow-xl"
            >
              Đăng nhập
            </button>

            {/* <div className="mt-6 pt-6 border-t border-gray-200">
              <p className="text-xs text-gray-500 text-center mb-3">
                Tài khoản demo:
              </p>
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="bg-gray-50 p-3 rounded-lg">
                  <p className="font-medium text-gray-700 mb-1">Sinh viên</p>
                  <p className="text-gray-600">SV001 / 123456</p>
                </div>
                <div className="bg-gray-50 p-3 rounded-lg">
                  <p className="font-medium text-gray-700 mb-1">Giáo viên</p>
                  <p className="text-gray-600">GV001 / 123456</p>
                </div>
              </div>
            </div> */}
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
