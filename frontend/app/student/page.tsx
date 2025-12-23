"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { Student } from "@/data/mockData";
import { useQuery } from "@apollo/client/react";
import { gql } from "@apollo/client";
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
  Upload,
} from "lucide-react";
import Image from "next/image";
import DefenseRegistration from "./DefenseRegistration";
import ThesisRegistration from "./ThesisRegistration";
import OutlineSubmission from "./OutlineSubmission";
import ThesisProgress from "./ThesisProgress";
import ThesisSubmission from "./ThesisSubmission";
import ComplaintForm from "./ComplaintForm";
import NotificationList from "./NotificationList";

type TabType =
  | "registration"
  | "outline"
  | "submission"
  | "defense"
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
    { id: "submission" as TabType, name: "Nộp khóa luận", icon: Upload },
    { id: "defense" as TabType, name: "Đăng ký bảo vệ", icon: Shield },
    { id: "progress" as TabType, name: "Theo dõi tiến độ", icon: TrendingUp },
    // { id: "complaint" as TabType, name: "Khiếu nại", icon: Shield },
    { id: "notification" as TabType, name: "Thông báo", icon: Bell },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case "outline":
        return <OutlineSubmission />;
      case "submission":
        return <ThesisSubmission />;
      case "defense":
        return <DefenseRegistration />;
      case "progress":
        return <ThesisProgress />; // ...
      case "complaint":
        return <ComplaintForm />;
      case "notification":
        return <NotificationList />;
      default:
        return <ThesisRegistration />;
    }
  };
  const { user } = useAuth();
  const [showNotifs, setShowNotifs] = useState(false);
  const [internalNotifs, setInternalNotifs] = useState<any[]>([]);
  const [selectedNotification, setSelectedNotification] = useState<any | null>(
    null
  );

  // --- Notifications Fetching for Header ---
  const GET_HEADER_NOTIFICATIONS = gql`
    query GetHeaderNotifications {
      notifications {
        id
        title
        content
        date
        type
        isRead
      }
    }
  `;

  const { data: headerNotifsData } = useQuery<{ notifications: any[] }>(
    GET_HEADER_NOTIFICATIONS,
    {
      fetchPolicy: "network-only",
    }
  );

  // Local state to track read notifications (mocking per-user read status)
  const [localReads, setLocalReads] = useState<string[]>([]);

  const handleMarkAsRead = (notification: any) => {
    if (!notification.isRead && !localReads.includes(notification.id)) {
      setLocalReads((prev) => [...prev, notification.id]);
    }
  };

  const handleMarkAllAsRead = () => {
    const unreadIds = internalNotifs
      .filter((n) => !n.isRead && !localReads.includes(n.id))
      .map((n) => n.id);
    setLocalReads((prev) => [...prev, ...unreadIds]);
  };

  useEffect(() => {
    if (user && headerNotifsData?.notifications) {
      const internal = headerNotifsData.notifications.filter(
        (n: any) => n.type === "internal"
      );
      setInternalNotifs(
        internal.map((n: any) => ({
          ...n,
          isRead: n.isRead || localReads.includes(n.id),
        }))
      );
    } else {
      setInternalNotifs([]);
    }
  }, [user, headerNotifsData, localReads]);

  const unreadCount = internalNotifs.filter((n) => !n.isRead).length;
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
              {user && (
                <div className="relative">
                  <button
                    onClick={() => setShowNotifs(!showNotifs)}
                    className="p-2 rounded-full hover:bg-gray-100 relative transition"
                  >
                    <Bell size={24} className="text-gray-600" />
                    {unreadCount > 0 && (
                      <span className="absolute top-0 right-0 inline-flex items-center justify-center px-1.5 py-0.5 text-xs font-bold leading-none text-red-100 bg-red-600 rounded-full">
                        {unreadCount}
                      </span>
                    )}
                  </button>

                  {/* Dropdown */}
                  {showNotifs && (
                    <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-xl border border-gray-200 z-50 overflow-hidden">
                      <div className="bg-gray-50 px-4 py-3 border-b border-gray-200 flex justify-between items-center">
                        <h3 className="font-bold text-sm text-gray-700">
                          Thông báo của bạn
                        </h3>
                        <button
                          onClick={handleMarkAllAsRead}
                          className="text-xs text-blue-600 hover:text-blue-800 font-medium"
                        >
                          Đánh dấu đã đọc
                        </button>
                      </div>
                      <div className="max-h-80 overflow-y-auto">
                        {internalNotifs.length > 0 ? (
                          internalNotifs.map((n) => (
                            <div
                              key={n.id}
                              onClick={() => {
                                handleMarkAsRead(n);
                                setSelectedNotification(n);
                                setShowNotifs(false);
                              }}
                              className={`px-4 py-3 hover:bg-gray-50 border-b last:border-0 border-gray-100 cursor-pointer ${
                                !n.isRead ? "bg-blue-50/50" : ""
                              }`}
                            >
                              <p className="text-sm font-semibold text-gray-800 line-clamp-1">
                                {n.title}
                              </p>
                              <p className="text-xs text-gray-500 mt-1 line-clamp-2">
                                {n.content}
                              </p>
                              <p className="text-[10px] text-gray-400 mt-2 text-right">
                                {n.date}
                              </p>
                            </div>
                          ))
                        ) : (
                          <div className="p-4 text-center text-sm text-gray-500">
                            Không có thông báo mới
                          </div>
                        )}
                      </div>
                      <div className="bg-gray-50 px-4 py-2 border-t border-gray-200 text-center">
                        <button className="text-xs font-bold text-blue-600 hover:text-blue-800">
                          Xem tất cả
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}
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

      {/* Notification Detail Modal */}
      {selectedNotification && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-xl shadow-lg w-full max-w-lg overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="bg-gray-50 px-6 py-4 border-b border-gray-200 flex justify-between items-center">
              <h3 className="text-lg font-bold text-gray-900">
                Chi tiết thông báo
              </h3>
              <button
                onClick={() => setSelectedNotification(null)}
                className="text-gray-400 hover:text-gray-600 transition"
              >
                <X size={24} />
              </button>
            </div>
            <div className="p-6">
              <h4 className="text-xl font-bold text-[#004c8c] mb-2 leading-tight">
                {selectedNotification.title}
              </h4>
              <p className="text-xs text-gray-500 mb-4 flex items-center gap-2">
                <Bell size={14} />
                {selectedNotification.date}
              </p>
              <div className="prose prose-sm max-w-none text-gray-700 whitespace-pre-line leading-relaxed">
                {selectedNotification.content}
              </div>
            </div>
            <div className="bg-gray-50 px-6 py-4 flex justify-end">
              <button
                onClick={() => setSelectedNotification(null)}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StudentDashboard;
