"use client";
import React from "react";
import {
  mockRegistrations,
  mockStudents,
  mockTopics,
} from "../../data/mockData";
import { useAuth } from "../../contexts/AuthContext";
import {
  Users,
  Mail,
  Phone,
  BookOpen,
  FileText,
  CheckCircle,
} from "lucide-react";

const StudentManagement: React.FC = () => {
  const { user } = useAuth();

  const myStudents = mockRegistrations
    .filter((r) => r.teacherId === user?.profileId)
    .map((reg) => {
      const student = mockStudents.find((s) => s.id === reg.studentId);
      const topic = mockTopics.find((t) => t.id === reg.topicId);
      return { ...reg, student, topic };
    });

  const getStatusInfo = (status: string) => {
    switch (status) {
      case "registered":
        return { text: "Đã đăng ký", color: "bg-yellow-100 text-yellow-800" };
      case "outline_pending":
        return {
          text: "Chờ duyệt đề cương",
          color: "bg-blue-100 text-blue-800",
        };
      case "outline_rejected":
        return {
          text: "Đề cương bị từ chối",
          color: "bg-red-100 text-red-800",
        };
      case "outline_approved":
        return {
          text: "Đề cương đã duyệt",
          color: "bg-green-100 text-green-800",
        };
      case "in_progress":
        return {
          text: "Đang thực hiện",
          color: "bg-purple-100 text-purple-800",
        };
      case "submitted":
        return { text: "Đã nộp", color: "bg-teal-100 text-teal-800" };
      case "graded":
        return { text: "Đã chấm điểm", color: "bg-gray-100 text-gray-800" };
      default:
        return { text: status, color: "bg-gray-100 text-gray-800" };
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <div className="flex items-center space-x-3 mb-6">
        <div className="bg-blue-100 p-2 rounded-lg">
          <Users size={24} className="text-blue-600" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-gray-900">
            Quản lý sinh viên
          </h2>
          <p className="text-sm text-gray-500">
            Danh sách sinh viên đang hướng dẫn ({myStudents.length})
          </p>
        </div>
      </div>

      {myStudents.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-xl">
          <Users size={48} className="mx-auto text-gray-300 mb-3" />
          <p className="text-gray-500">Chưa có sinh viên đăng ký</p>
        </div>
      ) : (
        <div className="space-y-4">
          {myStudents.map((item) => {
            const statusInfo = getStatusInfo(item.status);

            return (
              <div
                key={item.id}
                className="border border-gray-200 rounded-xl p-5 hover:shadow-md transition-all"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-start space-x-4">
                    <div className="bg-gradient-to-br from-blue-500 to-blue-600 text-white w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg flex-shrink-0">
                      {item.student?.name.charAt(0)}
                    </div>

                    <div className="flex-1">
                      <h3 className="text-lg font-bold text-gray-900 mb-1">
                        {item.student?.name}
                      </h3>
                      <div className="flex items-center space-x-3 text-sm text-gray-600 mb-2">
                        <span className="font-medium">
                          {item.student?.code}
                        </span>
                        <span>•</span>
                        <span>{item.student?.class}</span>
                      </div>

                      <div className="flex flex-wrap gap-2 mb-3">
                        <div className="flex items-center space-x-1 text-xs text-gray-600">
                          <Mail size={14} />
                          <span>{item.student?.email}</span>
                        </div>
                        <div className="flex items-center space-x-1 text-xs text-gray-600">
                          <Phone size={14} />
                          <span>{item.student?.phone}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium ${statusInfo.color}`}
                  >
                    {statusInfo.text}
                  </span>
                </div>

                <div className="bg-gray-50 rounded-lg p-4 mb-3">
                  <div className="flex items-start space-x-2 mb-2">
                    <BookOpen
                      size={16}
                      className="text-gray-500 mt-0.5 flex-shrink-0"
                    />
                    <div>
                      <p className="text-xs font-medium text-gray-500 mb-1">
                        Đề tài
                      </p>
                      <p className="text-sm font-semibold text-gray-900">
                        {item.topic?.title}
                      </p>
                      <p className="text-xs text-gray-600 mt-1">
                        {item.topic?.code}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-sm">
                  <div className="bg-white border border-gray-200 rounded-lg p-3">
                    <p className="text-xs text-gray-500 mb-1">Ngày đăng ký</p>
                    <p className="font-medium text-gray-900">
                      {new Date(item.registeredAt).toLocaleDateString("vi-VN")}
                    </p>
                  </div>

                  {item.outlineSubmittedAt && (
                    <div className="bg-white border border-gray-200 rounded-lg p-3">
                      <p className="text-xs text-gray-500 mb-1">Nộp đề cương</p>
                      <p className="font-medium text-gray-900">
                        {new Date(item.outlineSubmittedAt).toLocaleDateString(
                          "vi-VN"
                        )}
                      </p>
                    </div>
                  )}

                  {item.thesisSubmittedAt && (
                    <div className="bg-white border border-gray-200 rounded-lg p-3">
                      <p className="text-xs text-gray-500 mb-1">
                        Nộp khóa luận
                      </p>
                      <p className="font-medium text-gray-900">
                        {new Date(item.thesisSubmittedAt).toLocaleDateString(
                          "vi-VN"
                        )}
                      </p>
                    </div>
                  )}
                </div>

                {item.outlineFeedback && (
                  <div className="mt-3 pt-3 border-t border-gray-200">
                    <div className="flex items-start space-x-2">
                      <FileText
                        size={16}
                        className="text-blue-500 mt-0.5 flex-shrink-0"
                      />
                      <div className="flex-1">
                        <p className="text-xs font-medium text-gray-700 mb-1">
                          Phản hồi đề cương:
                        </p>
                        <p className="text-sm text-gray-600">
                          {item.outlineFeedback}
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {item.codeLink && (
                  <div className="mt-3 pt-3 border-t border-gray-200">
                    <p className="text-xs font-medium text-gray-700 mb-1">
                      Source code:
                    </p>
                    <a
                      href={item.codeLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-blue-600 hover:underline"
                    >
                      {item.codeLink}
                    </a>
                  </div>
                )}

                {item.score && (
                  <div className="mt-3 pt-3 border-t border-gray-200">
                    <div className="flex items-center space-x-2">
                      <CheckCircle size={18} className="text-green-600" />
                      <span className="text-sm text-gray-700">Điểm:</span>
                      <span className="text-lg font-bold text-green-600">
                        {item.score}/10
                      </span>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default StudentManagement;
