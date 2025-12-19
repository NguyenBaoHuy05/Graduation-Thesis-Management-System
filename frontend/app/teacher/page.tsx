"use client";
import React, { useState } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { Teacher } from "../../data/mockData";
import {
  LogOut,
  Lightbulb,
  Users,
  TrendingUp,
  Bell,
  Menu,
  X,
  Scan,
} from "lucide-react";
import Image from "next/image";
import TopicProposal from "./TopicProposal";
import StudentManagement from "./StudentManagement";
import ProgressEvaluation from "./ProgressEvaluation";
import NotificationList from "../student/NotificationList";
import PlagiarismReview from "./PlagiarismReview";

type TabType =
  | "proposal"
  | "students"
  | "evaluation"
  | "plagiarism"
  | "notification";

const TeacherDashboard: React.FC = () => {
  const { profile, logout } = useAuth();
  const teacher = profile as Teacher;
  const [activeTab, setActiveTab] = useState<TabType>("proposal");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const tabs = [
    { id: "proposal" as TabType, name: "Đề xuất đề tài", icon: Lightbulb },
    { id: "students" as TabType, name: "Quản lý sinh viên", icon: Users },
    { id: "evaluation" as TabType, name: "Đánh giá tiến độ", icon: TrendingUp },
    { id: "plagiarism" as TabType, name: "Rà soát đạo văn", icon: Scan },
    { id: "notification" as TabType, name: "Thông báo", icon: Bell },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case "proposal":
        return <TopicProposal />;
      case "students":
        return <StudentManagement />;
      case "evaluation":
        return <ProgressEvaluation />;
      case "plagiarism":
        return <PlagiarismReview />;
      case "notification":
        return <NotificationList />;
      default:
        return <TopicProposal />;
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
                  width={40}
                  height={40}
                />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">
                  Quản lý Khóa luận
                </h1>
                <p className="text-sm text-gray-500">Giảng viên</p>
              </div>
            </div>

            <div className="hidden md:flex items-center space-x-4">
              <div className="text-right">
                <p className="text-sm font-medium text-gray-900">
                  {teacher.name}
                </p>
                <p className="text-xs text-gray-500">
                  {teacher.code} - {teacher.title}
                </p>
              </div>
              <div className="text-right bg-green-50 px-3 py-2 rounded-lg">
                <p className="text-xs text-gray-600">Hướng dẫn</p>
                <p className="text-sm font-bold text-green-700">
                  {teacher.currentTheses}/{teacher.maxTheses}
                </p>
              </div>
              <button
                onClick={logout}
                className="flex items-center space-x-2 px-4 py-2 bg-gray-700 hover:bg-gray-500 rounded-lg transition-colors"
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
                {teacher.name}
              </p>
              <p className="text-xs text-gray-500">
                {teacher.code} - {teacher.title}
              </p>
              <div className="mt-2 bg-green-50 px-3 py-2 rounded-lg inline-block">
                <span className="text-xs text-gray-600">Hướng dẫn: </span>
                <span className="text-sm font-bold text-green-700">
                  {teacher.currentTheses}/{teacher.maxTheses}
                </span>
              </div>
            </div>
            <button
              onClick={logout}
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
                        ? "bg-green-50 border-green-600 text-green-700"
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

export default TeacherDashboard;
