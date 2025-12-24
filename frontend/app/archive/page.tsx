"use client";
import React, { useState } from "react";
import { gql } from "@apollo/client";
import { useQuery } from "@apollo/client/react";
import {
  Calendar,
  CheckCircle,
  Clock,
  ChevronDown,
  ChevronUp,
  History,
  AlertCircle,
} from "lucide-react";

import Navbar from "@/components/Navbar";
import Header from "@/components/Header";

// Query to get all periods including milestones
const GET_ALL_THESIS_PERIODS = gql`
  query GetAllThesisPeriods {
    thesisPeriods {
      id
      name
      academicYear
      startDate
      endDate
      status
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

export default function ArchivePage() {
  const { data, loading, error } = useQuery<any>(GET_ALL_THESIS_PERIODS);
  const [expandedPeriodId, setExpandedPeriodId] = useState<string | null>(null);

  const toggleExpand = (id: string) => {
    setExpandedPeriodId(expandedPeriodId === id ? null : id);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <Header />
        <Navbar />
        <div className="flex-1 flex justify-center items-center">
          <div className="flex flex-col items-center space-y-3">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
            <p className="text-gray-500">Đang tải dữ liệu...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <Header />
        <Navbar />
        <div className="flex-1 flex justify-center pt-10">
          <div className="text-red-500 bg-red-50 p-4 rounded-lg flex items-center space-x-2 h-fit">
            <AlertCircle size={20} />
            <span>Đã xảy ra lỗi khi tải dữ liệu: {error.message}</span>
          </div>
        </div>
      </div>
    );
  }

  const periods = data?.thesisPeriods || [];

  // Sort periods: Active first, then by startDate descending
  const sortedPeriods = [...periods].sort((a: any, b: any) => {
    if (a.status === "active") return -1;
    if (b.status === "active") return 1;
    return new Date(b.startDate).getTime() - new Date(a.startDate).getTime();
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return (
          <span className="flex items-center space-x-1 px-3 py-1 bg-green-100 text-green-800 rounded-full text-xs font-bold uppercase tracking-wide">
            <CheckCircle size={14} />
            <span>Đang diễn ra</span>
          </span>
        );
      case "closed":
        return (
          <span className="flex items-center space-x-1 px-3 py-1 bg-gray-200 text-gray-600 rounded-full text-xs font-bold uppercase tracking-wide">
            <History size={14} />
            <span>Đã kết thúc</span>
          </span>
        );
      case "planning":
        return (
          <span className="flex items-center space-x-1 px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-bold uppercase tracking-wide">
            <Clock size={14} />
            <span>Sắp diễn ra</span>
          </span>
        );
      default:
        return (
          <span className="px-3 py-1 bg-gray-100 text-gray-500 rounded-full text-xs font-bold uppercase">
            {status}
          </span>
        );
    }
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return "...";
    return new Date(dateString).toLocaleDateString("vi-VN", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans text-gray-800">
      <Header />
      <Navbar />

      <div className="flex-1 py-10">
        <div className="max-w-4xl mx-auto px-4">
          {/* Header */}
          <div className="text-center mb-10">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Lịch sử Kỳ Khóa luận
            </h1>
            <p className="text-gray-500">
              Theo dõi các mốc thời gian và trạng thái của các kỳ khóa luận qua
              các năm
            </p>
          </div>

          {/* Timeline List */}
          <div className="space-y-6">
            {sortedPeriods.map((period: any) => {
              const isExpanded = expandedPeriodId === period.id;
              // Sort milestones by start date
              const sortedMilestones = [...(period.milestones || [])].sort(
                (a: any, b: any) =>
                  new Date(a.startDate).getTime() -
                  new Date(b.startDate).getTime()
              );

              return (
                <div
                  key={period.id}
                  className={`bg-white rounded-xl shadow-sm border transition-all duration-300 overflow-hidden ${
                    period.status === "active"
                      ? "border-green-200 ring-4 ring-green-50/50"
                      : "border-gray-200 hover:shadow-md"
                  }`}
                >
                  {/* Card Header */}
                  <div
                    onClick={() => toggleExpand(period.id)}
                    className="p-6 cursor-pointer flex flex-col md:flex-row md:items-center justify-between gap-4"
                  >
                    <div className="flex items-start md:items-center gap-4">
                      {/* <div
                        className={`p-3 rounded-lg ${
                          period.status === "active"
                            ? "bg-green-100 text-green-600"
                            : "bg-blue-50 text-blue-600"
                        }`}
                      >
                        <Calendar size={28} />
                      </div> */}
                      <div>
                        <div className="flex items-center gap-3 mb-1">
                          <h3 className="text-xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
                            {period.name}
                          </h3>
                          {getStatusBadge(period.status)}
                        </div>
                        <div className="flex items-center text-sm text-gray-500 gap-4">
                          <span className="flex items-center gap-1">
                            <Clock size={14} className="mt-0.5" />
                            Năm học: {period.academicYear}
                          </span>
                          <span className="hidden md:inline text-gray-300">
                            |
                          </span>
                          <span>
                            {formatDate(period.startDate)} -{" "}
                            {formatDate(period.endDate)}
                          </span>
                        </div>
                      </div>
                    </div>

                    <button className="self-end md:self-auto text-gray-400 hover:text-gray-600">
                      {isExpanded ? (
                        <ChevronUp size={24} />
                      ) : (
                        <ChevronDown size={24} />
                      )}
                    </button>
                  </div>

                  {/* Collapsible Content (Milestones) */}
                  {isExpanded && (
                    <div className="border-t border-gray-100 bg-gray-50/30 p-6 pt-2">
                      <h4 className="text-sm font-bold text-gray-700 uppercase tracking-wider mb-6 mt-4 pl-2 border-l-4 border-blue-500">
                        Các mốc thời gian quan trọng
                      </h4>

                      <div className="relative pl-4 md:pl-8 space-y-8 before:absolute before:inset-0 before:ml-4 md:before:ml-8 before:-translate-x-px md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-blue-200 before:via-gray-200 before:to-gray-100">
                        {sortedMilestones.length === 0 ? (
                          <p className="text-gray-500 italic ml-6">
                            Chưa có mốc thời gian nào được cập nhật.
                          </p>
                        ) : (
                          sortedMilestones.map((m: any, idx: number) => {
                            // Check if milestone is past
                            const isPast = new Date(m.endDate) < new Date();
                            const isCurrent =
                              new Date() >= new Date(m.startDate) &&
                              new Date() <= new Date(m.endDate);

                            return (
                              <div
                                key={m.id || idx}
                                className="relative pl-8 md:pl-12 group"
                              >
                                {/* Dot */}
                                <div
                                  className={`absolute top-1 left-0 md:left-4 w-4 h-4 rounded-full border-2 transform -translate-x-[5px] md:translate-x-0 z-10 transition-colors duration-300 ${
                                    isCurrent
                                      ? "bg-green-500 border-green-200 shadow-lg shadow-green-200"
                                      : isPast
                                      ? "bg-blue-500 border-blue-200"
                                      : "bg-white border-gray-300"
                                  }`}
                                ></div>

                                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-1 sm:gap-4">
                                  <div className="flex-1">
                                    <h5
                                      className={`font-semibold text-base ${
                                        isCurrent
                                          ? "text-green-700"
                                          : "text-gray-900"
                                      }`}
                                    >
                                      {m.name}
                                    </h5>
                                    {m.description && (
                                      <p className="text-sm text-gray-500 mt-1">
                                        {m.description}
                                      </p>
                                    )}
                                  </div>
                                  <div className="text-sm font-medium text-gray-600 whitespace-nowrap bg-white px-3 py-1 rounded-md border border-gray-100 shadow-sm">
                                    {formatDate(m.startDate)} -{" "}
                                    {formatDate(m.endDate)}
                                  </div>
                                </div>
                              </div>
                            );
                          })
                        )}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
