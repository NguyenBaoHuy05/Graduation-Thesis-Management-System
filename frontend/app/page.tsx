"use client";

import { useState, useEffect } from "react";
import { gql } from "@apollo/client";
import { useQuery } from "@apollo/client/react";
import Navbar from "@/components/Navbar";
import Header from "@/components/Header";
import TimelineSection from "@/components/TimelineSection";
import {
  mockNotifications,
  Notification,
  ThesisPeriod,
} from "../data/mockData";
import { Globe, Book, Users, FileText, Bell } from "lucide-react";
import Image from "next/image";
import { useAuth } from "@/contexts/AuthContext"; // Added import

interface GetThesisPeriodsData {
  thesisPeriods: ThesisPeriod[];
}

const GET_THESIS_PERIODS = gql`
  query GetThesisPeriods {
    thesisPeriods {
      id
      name
      academicYear
      startDate
      endDate
      status
      maxGroupSize
      milestones {
        id
        name
        startDate
        endDate
        type
        description
      }
    }
  }
`;

export default function Home() {
  const { user } = useAuth(); // Get user

  const { loading, error, data } =
    useQuery<GetThesisPeriodsData>(GET_THESIS_PERIODS);

  // Get the active period or the first one from fetched data
  const periods = data?.thesisPeriods || [];
  const activePeriod =
    periods.find((p: any) => p.status === "active") || periods[0];

  const quickLinks = [
    { name: "KHOA HỌC MÁY TÍNH", color: "bg-[#005c9d]", icon: Globe },
    { name: "CÔNG NGHỆ PHẦN MỀM", color: "bg-[#ff0055]", icon: Book },
    { name: "MẠNG MÁY TÍNH", color: "bg-[#455a64]", icon: Users },
    { name: "AN TOÀN THÔNG TIN", color: "bg-[#4db6ac]", icon: Users },
    { name: "HỆ THỐNG THÔNG TIN", color: "bg-[#ff9800]", icon: FileText },
  ];

  const newsItems = [
    {
      title: "Thông báo chung",
      active: true,
    },
    // { title: "Thông báo từ phòng KHTC", active: false },
    // { title: "Khảo sát lấy ý kiến người học", active: false },
    // { title: "Hành chính", active: false, hasSub: true },
    // { title: "Đào tạo", active: false, hasSub: true },
    // { title: "Khảo thí", active: false, hasSub: true },
    // { title: "Công tác SV", active: false, hasSub: true },
  ];

  const [displayNotifications, setDisplayNotifications] = useState<
    Notification[]
  >([]);

  useEffect(() => {
    // Filter only public notifications
    const visible = mockNotifications.filter((n) => n.type === "public");

    // Sort by date desc
    visible.sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
    );

    setDisplayNotifications(visible);
  }, [user]);

  return (
    <div className="min-h-screen bg-white font-sans text-gray-800">
      <Header />
      <Navbar />

      {/* Main Content Area */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Quick Links Section */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
          {quickLinks.map((link) => (
            <div
              key={link.name}
              className={`${link.color} text-white p-4 rounded-sm shadow-sm flex flex-col items-center justify-center text-center h-28 cursor-pointer hover:opacity-90 transition`}
            >
              {/* <link.icon size={28} className="mb-2 opacity-80" /> */}
              <span className="font-bold text-sm uppercase leading-tight">
                {link.name}
              </span>
            </div>
          ))}
        </div>

        <div className="flex flex-col md:flex-row gap-8">
          {/* Left Sidebar - News Menu */}
          <aside className="md:w-1/4 shrink-0 hidden md:block">
            <div className="bg-[#004c8c] text-white p-3 font-bold flex items-center gap-2 rounded-t-sm uppercase text-sm">
              <Globe size={18} /> Tin tức
            </div>
            <div className="bg-gray-50 border border-gray-200 rounded-b-sm">
              <ul className="divide-y divide-gray-200">
                {newsItems.map((item, idx) => (
                  <li
                    key={idx}
                    className={`px-4 py-3 text-sm font-medium hover:bg-gray-100 cursor-pointer flex justify-between items-center ${
                      item.active ? "text-[#004c8c]" : "text-gray-700"
                    }`}
                  >
                    <span>{item.title}</span>
                    {/* {item.hasSub && <span className="text-gray-400">›</span>} */}
                  </li>
                ))}
              </ul>
            </div>

            {/* Secondary Sidebar Widget (Optional) */}
            {/* <div className="mt-6 bg-[#f26522] text-white p-4 rounded-sm shadow-sm text-center font-bold uppercase text-sm">
              <p>Thông báo nổi bật</p>
            </div> */}
          </aside>

          {/* Center Main Content */}
          <main className="flex-1">
            {/* Search Bar & Title */}
            <div className="bg-[#004c8c] text-white p-2 sm:p-3 font-bold flex items-center justify-between rounded-t-sm mb-0">
              <div className="flex items-center gap-2 uppercase text-sm">
                <Bell size={18} /> Thông báo mới
              </div>
              <div className="flex bg-white rounded-sm overflow-hidden">
                <input
                  type="text"
                  className="px-3 py-1 text-gray-800 text-sm outline-none w-24 sm:w-auto"
                  placeholder="Tìm kiếm..."
                />
                <button className="bg-[#e91e63] text-white px-3 py-1 hover:bg-[#c2185b] transition">
                  <span className="text-xs font-bold">Tìm kiếm</span>
                </button>
              </div>
            </div>

            <div className="bg-white border border-gray-200 border-t-0 p-4 sm:p-6 rounded-b-sm shadow-sm">
              {/* Announcements List */}
              <div className="space-y-6 mb-8">
                {displayNotifications.length > 0 ? (
                  displayNotifications.map((notif) => (
                    <div key={notif.id} className="group cursor-pointer">
                      <div className="flex items-start gap-3">
                        {/* Simple Logic for 'New' badge: less than 7 days old */}
                        {new Date().getTime() - new Date(notif.date).getTime() <
                          7 * 24 * 60 * 60 * 1000 && (
                          <div className="shrink-0 animate-pulse mt-1">
                            <span className="text-[10px] font-bold text-white bg-red-600 px-1.5 py-0.5 rounded shadow-sm">
                              MỚI
                            </span>
                          </div>
                        )}
                        <div>
                          <h3 className="text-sm font-bold text-[#004c8c] hover:underline uppercase leading-relaxed text-justify">
                            {notif.type === "internal" && (
                              <span className="text-orange-600 mr-2">
                                [Nội bộ]
                              </span>
                            )}
                            {notif.title}
                          </h3>
                          <div className="text-xs text-gray-600 mt-1 line-clamp-2">
                            {notif.content}
                          </div>
                          <div className="flex items-center gap-4 mt-1 text-xs text-gray-500 italic">
                            <span>Ngày đăng tin: {notif.date}</span>
                          </div>
                        </div>
                      </div>
                      <div className="h-px bg-gray-100 mt-4 w-full"></div>
                    </div>
                  ))
                ) : (
                  <p className="text-center text-gray-500 text-sm italic">
                    Hiện chưa có thông báo nào.
                  </p>
                )}
              </div>

              {/* Timeline Widget Integration */}
              <div className="border border-blue-100 rounded-lg overflow-hidden mt-8">
                <div className="bg-blue-50 p-3 border-b border-blue-100 flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                  <h3 className="font-bold text-blue-800 text-sm uppercase">
                    Tiến độ Khóa luận hiện tại
                  </h3>
                </div>
                {activePeriod && (
                  <TimelineSection period={activePeriod} simpleMode={true} />
                )}
              </div>
            </div>
          </main>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-[#003d73] text-white py-8 mt-12 ">
        <div className="max-w-7xl mx-auto px-4 text-center text-sm">
          <p className="font-bold mb-2">
            TRƯỜNG ĐẠI HỌC SƯ PHẠM TP. HỒ CHÍ MINH
          </p>
          <p>280 An Dương Vương, Phường 4, Quận 5, TP. Hồ Chí Minh</p>
          <p className="mt-4 opacity-70">
            © 2024 Bản quyền thuộc về Trường Đại học Sư phạm TP. HCM
          </p>
        </div>
      </footer>
    </div>
  );
}
