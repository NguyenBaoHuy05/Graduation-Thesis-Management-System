"use client";
import React, { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import {
  LogOut,
  LayoutDashboard,
  FileText,
  Menu,
  X,
  Users,
} from "lucide-react";
import Image from "next/image";
import TopicManagement from "./TopicManagement";
import CouncilManagement from "./CouncilManagement";

type TabType = "dashboard" | "topics" | "councils";

export default function HeadDashboard() {
  const { logout, user } = useAuth();
  const [activeTab, setActiveTab] = useState<TabType>("topics");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const tabs = [
    {
      id: "topics" as TabType,
      name: "Quản lý danh sách đề tài",
      icon: FileText,
    },
    {
      id: "councils" as TabType,
      name: "Quản lý hội đồng",
      icon: Users,
    },
    // Add more tabs later
  ];

  const renderContent = () => {
    switch (activeTab) {
      case "topics":
        return <TopicManagement />;
      case "councils":
        return <CouncilManagement />;
      default:
        return <div className="p-6">Tính năng đang phát triển...</div>;
    }
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-50 to-slate-100">
      {/* Navbar */}
      <nav className="bg-white shadow-lg border-b border-slate-200 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg flex items-center justify-center">
                <Image
                  src="/LOGO_FIT_2.png"
                  alt="Logo"
                  width={50}
                  height={50}
                  className="object-contain"
                />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">Trưởng Khoa</h1>
                <p className="text-xs text-gray-500">
                  {user?.username || "Department Head"}
                </p>
              </div>
            </div>

            {/* Desktop Actions */}
            <div className="hidden sm:flex items-center gap-4">
              <button
                onClick={() => logout()}
                className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition"
              >
                <LogOut className="w-4 h-4" />
                <span>Đăng xuất</span>
              </button>
            </div>

            {/* Mobile Menu Button */}
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

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Sidebar */}
          <aside className="lg:w-64 shrink-0">
            <nav className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden sticky top-24">
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

          {/* Page Content */}
          <main className="bg-white rounded-xl shadow-sm border border-gray-200 flex-1 min-w-0 p-6">
            {renderContent()}
          </main>
        </div>
      </div>
    </div>
  );
}
