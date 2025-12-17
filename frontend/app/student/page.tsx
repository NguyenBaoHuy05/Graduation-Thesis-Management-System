"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { Student } from "@/data/mockData";
import {
  LogOut,
  BookOpen,
  FileText,
  TrendingUp,
  Shield,
  Bell,
  Menu,
  X,
  User,
} from "lucide-react";
import Image from "next/image";
import ThesisRegistration from "./ThesisRegistration";
import OutlineSubmission from "./OutlineSubmission";
import ThesisProgress from "./ThesisProgress";
import ComplaintForm from "./ComplaintForm";
import NotificationList from "./NotificationList";

type TabType =
  | "registration"
  | "outline"
  | "progress"
  | "complaint"
  | "notification";

const StudentDashboard: React.FC = () => {
  const router = useRouter();
  const { profile, logout } = useAuth();
  const student = profile as Student;
  const [activeTab, setActiveTab] = useState<TabType>("registration");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const tabs = [
    {
      id: "registration" as TabType,
      name: "Đăng ký khóa luận",
      icon: BookOpen,
    },
    { id: "outline" as TabType, name: "Nộp đề cương", icon: FileText },
    { id: "progress" as TabType, name: "Theo dõi tiến độ", icon: TrendingUp },
    { id: "complaint" as TabType, name: "Khiếu nại", icon: Shield },
    { id: "notification" as TabType, name: "Thông báo", icon: Bell },

  ];

  const renderContent = () => {
    switch (activeTab) {
      case "outline":
        return <OutlineSubmission />;
      case "progress":
        return <ThesisProgress />;
      case "complaint":
        return <ComplaintForm />;
      case "notification":
        return <NotificationList />;
      default:
        return <ThesisRegistration />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200 sticky top-0 z-40 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-3">
              <div className=" p-2 rounded-lg">
                <Image
                  src="/LOGO_FIT_2.png"
                  alt="Logo"
                  width={60}
                  height={60}
                />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">
                  Quản lý Khóa luận
                </h1>
                <p className="text-sm text-gray-500">Sinh viên</p>
              </div>
            </div>

            <div className="hidden md:flex items-center space-x-4">
              <div className="text-right">
                <p className="text-sm font-medium text-gray-900">
                  {student.name}
                </p>
                <p className="text-xs text-gray-500">
                  {student.code} - {student.class}
                </p>
              </div>
              <button
                onClick={() => {
                  logout();
                  router.replace("/login");
                }}
                className="flex items-center space-x-2 px-4 py-2 bg-gray-700 hover:bg-gray-500 cursor-pointer rounded-lg transition-colors"
              >
                <LogOut size={18} />
                <span className="text-sm font-medium">Đăng xuất</span>
              </button>
            </div>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {mobileMenuOpen && (
          <div className="md:hidden border-t border-gray-200 bg-white py-4 px-4">
            <div className="mb-4 pb-4 border-b border-gray-200">
              <p className="text-sm font-medium text-gray-900">
                {student.name}
              </p>
              <p className="text-xs text-gray-500">
                {student.code} - {student.class}
              </p>
            </div>
            <button
              onClick={() => {
                logout();
                router.replace("/login");
              }}
              className="w-full flex items-center justify-center space-x-2 px-4 py-2 bg-gray-700 hover:bg-gray-500 rounded-lg transition-colors"
            >
              <LogOut size={18} />
              <span className="text-sm font-medium">Đăng xuất</span>
            </button>
          </div>
        )}
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-6">
          <aside className="lg:w-64 shrink-0">
            <nav className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => {
                      setActiveTab(tab.id);
                      setMobileMenuOpen(false);
                    }}
                    className={`w-full flex items-center space-x-3 px-4 py-3 transition-all border-l-4 ${
                      activeTab === tab.id
                        ? "bg-blue-50 border-blue-600 text-blue-700"
                        : "border-transparent text-gray-700 hover:bg-gray-50"
                    }`}
                  >
                    <Icon size={20} />
                    <span className="font-medium text-sm">{tab.name}</span>
                  </button>
                );
              })}
            </nav>
          </aside>

          <main className="flex-1 min-w-0">{renderContent()}</main>
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;
