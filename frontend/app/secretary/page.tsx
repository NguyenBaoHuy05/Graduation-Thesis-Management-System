"use client";
import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import {
  LogOut,
  Users,
  Menu,
  X,
  Calendar,
  GraduationCap,
  UserSquare,
  ClipboardList,
  Bell,
} from "lucide-react";
import ThesisPeriodManagement from "./ThesisPeriodManagement";
// Removed CommitteeProposal import as feature is merged to Head
import TeacherManagement from "./TeacherManagement";
import StudentManagement from "./StudentManagement";
import FormManagement from "./FormManagement";
import NotificationManagement from "./NotificationManagement";
import Image from "next/image";

type TabType =
  | "periods"
  | "committee"
  | "teachers"
  | "students"
  | "forms"
  | "notifications";

export default function DeanSecretaryDashboard() {
  const { logout } = useAuth();
  const [activeTab, setActiveTab] = useState<TabType>("periods");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const tabs = [
    {
      id: "periods" as TabType,
      name: "Quản lý kỳ khóa luận",
      icon: Calendar,
    },
    {
      id: "teachers" as TabType,
      name: "Quản lý giảng viên",
      icon: GraduationCap,
    },
    {
      id: "students" as TabType,
      name: "Quản lý sinh viên",
      icon: UserSquare,
    },
    {
      id: "forms" as TabType,
      name: "Quản lý biểu mẫu",
      icon: ClipboardList,
    },
    {
      id: "notifications" as TabType,
      name: "Quản lý thông báo",
      icon: Bell,
    },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case "periods":
        return <ThesisPeriodManagement />;
      case "teachers":
        return <TeacherManagement />;
      case "students":
        return <StudentManagement />;
      case "forms":
        return <FormManagement />;
      case "notifications":
        return <NotificationManagement />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-50 to-slate-100">
      <nav className="bg-white shadow-lg border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg flex items-center justify-center">
                <Image
                  src="/LOGO_FIT_2.png"
                  alt="Logo"
                  width={50}
                  height={50}
                />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">Thư ký khoa</h1>
                <p className="text-xs text-gray-500">
                  Quản lý hành chính khóa luận
                </p>
              </div>
            </div>
            <button
              onClick={() => logout()}
              className="hidden sm:flex items-center gap-2 px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition"
            >
              <LogOut className="w-4 h-4" />
              <span>Đăng xuất</span>
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="sm:hidden p-2 hover:bg-gray-100 rounded-lg"
            >
              {mobileMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>
      </nav>

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

          <main className="bg-white rounded flex-1 min-w-0">
            {renderContent()}
          </main>
        </div>
      </div>
    </div>
  );
}
