"use client";
import { useState } from "react";
import { Check, X, FileText, User } from "lucide-react";

interface PendingTopic {
  id: string;
  title: string;
  teacher_name: string;
  description: string;
  submitted_date: string;
  status: "pending" | "approved" | "rejected";
}

const mockTopics: PendingTopic[] = [
  {
    id: "1",
    title: "Ứng dụng Machine Learning trong dự báo thời tiết",
    teacher_name: "ThS. Nguyễn Văn A",
    description:
      "Phát triển mô hình ML để dự báo thời tiết với độ chính xác cao",
    submitted_date: "2024-10-15",
    status: "pending",
  },
  {
    id: "2",
    title: "Hệ thống quản lý bán hàng online",
    teacher_name: "ThS. Trần Thị B",
    description: "Xây dựng nền tảng thương mại điện tử đầy đủ",
    submitted_date: "2024-10-14",
    status: "pending",
  },
  {
    id: "3",
    title: "Phân tích dữ liệu big data",
    teacher_name: "TS. Lê Văn C",
    description: "Ứng dụng Spark và Hadoop trong xử lý dữ liệu lớn",
    submitted_date: "2024-10-10",
    status: "approved",
  },
];

export default function TopicApproval() {
  const [topics, setTopics] = useState<PendingTopic[]>(mockTopics);
  const [selectedTopic, setSelectedTopic] = useState<string | null>(null);
  const [rejectReason, setRejectReason] = useState<string>("");

  const handleApprove = (id: string) => {
    setTopics(
      topics.map((t) => (t.id === id ? { ...t, status: "approved" } : t))
    );
    setSelectedTopic(null);
  };

  const handleReject = (id: string) => {
    if (rejectReason.trim()) {
      setTopics(
        topics.map((t) => (t.id === id ? { ...t, status: "rejected" } : t))
      );
      setRejectReason("");
      setSelectedTopic(null);
    }
  };

  const pendingTopics = topics.filter((t) => t.status === "pending");

  return (
    <div className="p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Phê duyệt đề tài
        </h2>
        <p className="text-gray-600">
          Có {pendingTopics.length} đề tài chờ phê duyệt
        </p>
      </div>

      {pendingTopics.length === 0 ? (
        <div className="bg-green-50 border border-green-200 rounded-lg p-8 text-center">
          <Check className="w-12 h-12 text-green-600 mx-auto mb-3" />
          <p className="text-green-800 font-medium">
            Tất cả đề tài đã được xử lý
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {pendingTopics.map((topic) => (
            <div
              key={topic.id}
              className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition"
            >
              <div className="flex justify-between items-start mb-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <FileText className="w-5 h-5 text-blue-600" />
                    <h3 className="font-semibold text-gray-900 text-lg">
                      {topic.title}
                    </h3>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
                    <User className="w-4 h-4" />
                    <span>{topic.teacher_name}</span>
                  </div>
                  <p className="text-sm text-gray-600 mb-2">
                    {topic.description}
                  </p>
                  <p className="text-xs text-gray-500">
                    Ngày nộp:{" "}
                    {new Date(topic.submitted_date).toLocaleDateString("vi-VN")}
                  </p>
                </div>
                <span className="px-3 py-1 text-xs font-medium bg-yellow-100 text-yellow-800 rounded-full whitespace-nowrap ml-4">
                  Chờ duyệt
                </span>
              </div>

              {selectedTopic === topic.id && (
                <div className="pt-4 border-t border-gray-200 space-y-3">
                  <textarea
                    placeholder="Nhập lý do từ chối (nếu cần)..."
                    value={rejectReason}
                    onChange={(e) => setRejectReason(e.target.value)}
                    className="w-full text-black placeholder:text-black/30 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    rows={2}
                  />
                  <div className="flex gap-3">
                    <button
                      onClick={() => handleApprove(topic.id)}
                      className="flex-1 flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white py-2 rounded-lg font-medium transition"
                    >
                      <Check className="w-4 h-4" />
                      Phê duyệt
                    </button>
                    <button
                      onClick={() => handleReject(topic.id)}
                      disabled={!rejectReason.trim()}
                      className="flex-1 flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 disabled:bg-gray-400 text-white py-2 rounded-lg font-medium transition"
                    >
                      <X className="w-4 h-4" />
                      Từ chối
                    </button>
                    <button
                      onClick={() => setSelectedTopic(null)}
                      className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-lg font-medium transition"
                    >
                      Hủy
                    </button>
                  </div>
                </div>
              )}

              {selectedTopic !== topic.id && (
                <button
                  onClick={() => setSelectedTopic(topic.id)}
                  className="w-full mt-3 px-4 py-2 bg-blue-100 hover:bg-blue-200 text-blue-700 rounded-lg font-medium transition"
                >
                  Xem chi tiết & Quyết định
                </button>
              )}
            </div>
          ))}
        </div>
      )}

      {topics.some(
        (t) => t.status === "approved" || t.status === "rejected"
      ) && (
        <div className="mt-8 pt-8 border-t border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Đã xử lý</h3>
          <div className="space-y-3">
            {topics
              .filter((t) => t.status !== "pending")
              .map((topic) => (
                <div
                  key={topic.id}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                >
                  <div>
                    <p className="font-medium text-gray-900">{topic.title}</p>
                    <p className="text-sm text-gray-600">
                      {topic.teacher_name}
                    </p>
                  </div>
                  <span
                    className={`px-3 py-1 text-xs font-medium rounded-full ${
                      topic.status === "approved"
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {topic.status === "approved" ? "Đã duyệt" : "Đã từ chối"}
                  </span>
                </div>
              ))}
          </div>
        </div>
      )}
    </div>
  );
}
