"use client";
import { useState } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { LogOut, CheckSquare, Users, Menu, X } from "lucide-react";
import TopicApproval from "./TopicApproval";
import AdvisorAssignment from "./AdvisorAssignment";
import Image from "next/image";

type TabType = "approval" | "advisor";

export default function DepartmentHeadDashboard() {
  const { logout } = useAuth();
  const [activeTab, setActiveTab] = useState<TabType>("approval");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const tabs = [
    { id: "approval" as TabType, name: "Phê duyệt đề tài", icon: CheckSquare },
    { id: "advisor" as TabType, name: "Phân công giảng viên", icon: Users },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case "approval":
        return <TopicApproval />;
      case "advisor":
        return <AdvisorAssignment />;
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
              <div className="w-10 h-10  rounded-lg flex items-center justify-center">
                <Image
                  src="/LOGO_FIT_2.png"
                  alt="Logo"
                  width={50}
                  height={50}
                />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">Trưởng khoa</h1>
                <p className="text-xs text-gray-500">Quản lý khóa luận</p>
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
        <div className="flex gap-4 mb-8 overflow-x-auto pb-2">
          {tabs.map(({ id, name, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setActiveTab(id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition whitespace-nowrap ${
                activeTab === id
                  ? "bg-blue-600 text-white shadow-lg"
                  : "bg-white text-gray-700 hover:bg-gray-50 border border-gray-200"
              }`}
            >
              <Icon className="w-4 h-4" />
              {name}
            </button>
          ))}
        </div>

        <div className="bg-white rounded-lg shadow-lg">{renderContent()}</div>
      </div>
    </div>
  );
}
