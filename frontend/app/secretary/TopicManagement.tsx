"use client";
import { useState } from "react";
import {
  FileText,
  User,
  CheckCircle,
  AlertCircle,
  Download,
  Eye,
} from "lucide-react";

interface Topic {
  id: string;
  code: string;
  title: string;
  teacher: string;
  students_registered: number;
  max_students: number;
  status: "pending" | "approved" | "rejected";
  created_date: string;
  description: string;
}

const mockTopics: Topic[] = [
  {
    id: "1",
    code: "DT001",
    title: "Ứng dụng Machine Learning trong dự báo thời tiết",
    teacher: "TS. Nguyễn Văn An",
    students_registered: 1,
    max_students: 2,
    status: "approved",
    created_date: "2024-10-15",
    description: "Phát triển mô hình ML để dự báo thời tiết",
  },
  {
    id: "2",
    code: "DT002",
    title: "Hệ thống quản lý bán hàng online",
    teacher: "PGS.TS. Trần Thị Bình",
    students_registered: 1,
    max_students: 1,
    status: "approved",
    created_date: "2024-10-16",
    description: "Xây dựng nền tảng thương mại điện tử",
  },
  {
    id: "3",
    code: "DT003",
    title: "Hệ thống phát hiện xâm nhập mạng",
    teacher: "ThS. Lê Minh Cường",
    students_registered: 1,
    max_students: 1,
    status: "approved",
    created_date: "2024-10-17",
    description: "Sử dụng Deep Learning để phát hiện xâm nhập",
  },
  {
    id: "4",
    code: "DT004",
    title: "Nhận diện khuôn mặt thời gian thực",
    teacher: "TS. Nguyễn Văn An",
    students_registered: 1,
    max_students: 2,
    status: "approved",
    created_date: "2024-10-18",
    description: "Ứng dụng Computer Vision cho nhận diện khuôn mặt",
  },
  {
    id: "5",
    code: "DT005",
    title: "Ứng dụng mobile quản lý học tập",
    teacher: "PGS.TS. Trần Thị Bình",
    students_registered: 0,
    max_students: 1,
    status: "pending",
    created_date: "2024-10-19",
    description: "Phát triển app React Native cho quản lý học tập",
  },
];

export default function TopicManagement() {
  const [topics, setTopics] = useState<Topic[]>(mockTopics);
  const [selectedTopic, setSelectedTopic] = useState<string | null>(null);
  const [filterStatus, setFilterStatus] = useState<
    "all" | "approved" | "pending" | "rejected"
  >("all");

  const filteredTopics =
    filterStatus === "all"
      ? topics
      : topics.filter((t) => t.status === filterStatus);

  const stats = {
    total: topics.length,
    approved: topics.filter((t) => t.status === "approved").length,
    pending: topics.filter((t) => t.status === "pending").length,
    registered: topics.reduce((sum, t) => sum + t.students_registered, 0),
  };

  const getStatusBadge = (status: string) => {
    const badges: Record<
      string,
      { bg: string; text: string; icon: typeof CheckCircle }
    > = {
      approved: {
        bg: "bg-green-100",
        text: "text-green-800",
        icon: CheckCircle,
      },
      pending: {
        bg: "bg-yellow-100",
        text: "text-yellow-800",
        icon: AlertCircle,
      },
      rejected: { bg: "bg-red-100", text: "text-red-800", icon: AlertCircle },
    };
    return badges[status] || badges.pending;
  };

  const statusLabels: Record<string, string> = {
    approved: "Đã phê duyệt",
    pending: "Chờ duyệt",
    rejected: "Từ chối",
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Quản lý danh sách đề tài
        </h2>
        <p className="text-gray-600">Tổng số đề tài: {stats.total}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <p className="text-sm text-blue-600 font-medium">Tổng đề tài</p>
          <p className="text-3xl font-bold text-blue-600 mt-1">{stats.total}</p>
        </div>
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <p className="text-sm text-green-600 font-medium">Đã phê duyệt</p>
          <p className="text-3xl font-bold text-green-600 mt-1">
            {stats.approved}
          </p>
        </div>
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <p className="text-sm text-yellow-600 font-medium">Chờ duyệt</p>
          <p className="text-3xl font-bold text-yellow-600 mt-1">
            {stats.pending}
          </p>
        </div>
        <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
          <p className="text-sm text-purple-600 font-medium">
            Sinh viên đã đăng ký
          </p>
          <p className="text-3xl font-bold text-purple-600 mt-1">
            {stats.registered}
          </p>
        </div>
      </div>

      <div className="flex gap-2 mb-4">
        {["all", "approved", "pending", "rejected"].map((status) => (
          <button
            key={status}
            onClick={() => setFilterStatus(status as any)}
            className={`px-4 py-2 rounded-lg font-medium transition ${
              filterStatus === status
                ? "bg-purple-600 text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            {status === "all" ? "Tất cả" : statusLabels[status]}
          </button>
        ))}
      </div>

      <div className="space-y-3">
        {filteredTopics.map((topic) => {
          const badge = getStatusBadge(topic.status);
          const Icon = badge.icon;
          return (
            <div
              key={topic.id}
              className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <FileText className="w-5 h-5 text-purple-600" />
                    <h3 className="font-semibold text-gray-900">
                      {topic.title}
                    </h3>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
                    <User className="w-4 h-4" />
                    <span>{topic.teacher}</span>
                  </div>
                  <p className="text-xs text-gray-500 mb-2">{topic.code}</p>
                </div>
                <span
                  className={`px-3 py-1 text-xs font-medium rounded-full flex items-center gap-1 ${badge.bg} ${badge.text}`}
                >
                  <Icon className="w-3 h-3" />
                  {statusLabels[topic.status]}
                </span>
              </div>

              <div className="flex items-center justify-between p-2 bg-gray-50 rounded mb-3">
                <span className="text-xs text-gray-600">
                  Sinh viên đã đăng ký:{" "}
                  <strong>
                    {topic.students_registered}/{topic.max_students}
                  </strong>
                </span>
                <div className="w-20 h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-purple-500"
                    style={{
                      width: `${
                        (topic.students_registered / topic.max_students) * 100
                      }%`,
                    }}
                  ></div>
                </div>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() =>
                    setSelectedTopic(
                      selectedTopic === topic.id ? null : topic.id
                    )
                  }
                  className="flex items-center gap-1 px-3 py-2 text-sm bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition"
                >
                  <Eye className="w-4 h-4" />
                  Chi tiết
                </button>
                <button className="flex items-center gap-1 px-3 py-2 text-sm bg-blue-100 hover:bg-blue-200 text-blue-700 rounded-lg transition">
                  <Download className="w-4 h-4" />
                  Tải tài liệu
                </button>
              </div>

              {selectedTopic === topic.id && (
                <div className="mt-3 pt-3 border-t border-gray-200 bg-gray-50 p-3 rounded">
                  <p className="text-sm text-gray-700 mb-2">
                    <strong>Mô tả:</strong> {topic.description}
                  </p>
                  <p className="text-xs text-gray-500">
                    Ngày đề xuất:{" "}
                    {new Date(topic.created_date).toLocaleDateString("vi-VN")}
                  </p>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
