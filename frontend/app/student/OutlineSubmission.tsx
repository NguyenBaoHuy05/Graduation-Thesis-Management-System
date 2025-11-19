"use client";
import React, { useState } from "react";
import {
  mockRegistrations,
  mockTopics,
  mockTeachers,
} from "../../data/mockData";
import { useAuth } from "../../contexts/AuthContext";
import {
  FileText,
  Upload,
  CheckCircle,
  XCircle,
  AlertCircle,
  Clock,
} from "lucide-react";

const OutlineSubmission: React.FC = () => {
  const { user } = useAuth();
  const [outlineFile, setOutlineFile] = useState<File | null>(null);

  const myRegistration = mockRegistrations.find(
    (r) => r.studentId === user?.profileId
  );
  const myTopic = myRegistration
    ? mockTopics.find((t) => t.id === myRegistration.topicId)
    : null;
  const myTeacher = myRegistration
    ? mockTeachers.find((t) => t.id === myRegistration.teacherId)
    : null;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setOutlineFile(e.target.files[0]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (outlineFile) {
      alert(
        "Nộp đề cương thành công! (Demo mode - file không được upload thực tế)"
      );
      setOutlineFile(null);
    }
  };

  if (!myRegistration) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <div className="bg-yellow-100 p-4 rounded-full mb-4">
            <AlertCircle size={48} className="text-yellow-600" />
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">
            Chưa đăng ký đề tài
          </h3>
          <p className="text-gray-600">
            Bạn cần đăng ký đề tài trước khi nộp đề cương
          </p>
        </div>
      </div>
    );
  }

  const canSubmit =
    myRegistration.status === "registered" ||
    myRegistration.status === "outline_rejected";

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center space-x-3 mb-6">
          <div className="bg-blue-100 p-2 rounded-lg">
            <FileText size={24} className="text-blue-600" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Nộp đề cương</h2>
            <p className="text-sm text-gray-500">
              Upload đề cương chi tiết khóa luận
            </p>
          </div>
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-xl p-5 mb-6">
          <h3 className="font-semibold text-gray-900 mb-2">Thông tin đề tài</h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">Mã đề tài:</span>
              <span className="font-medium text-gray-900">{myTopic?.code}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Tên đề tài:</span>
              <span className="font-medium text-gray-900">
                {myTopic?.title}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Giáo viên HD:</span>
              <span className="font-medium text-gray-900">
                {myTeacher?.name}
              </span>
            </div>
          </div>
        </div>

        {myRegistration.status === "outline_pending" && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6 flex items-start space-x-3">
            <Clock size={20} className="text-yellow-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-medium text-yellow-800 mb-1">
                Đang chờ phản hồi
              </p>
              <p className="text-sm text-yellow-700">
                Đề cương của bạn đang được giáo viên hướng dẫn xem xét. Vui lòng
                chờ phản hồi.
              </p>
              {myRegistration.outlineSubmittedAt && (
                <p className="text-xs text-yellow-600 mt-2">
                  Nộp ngày:{" "}
                  {new Date(
                    myRegistration.outlineSubmittedAt
                  ).toLocaleDateString("vi-VN")}
                </p>
              )}
            </div>
          </div>
        )}

        {myRegistration.status === "outline_approved" && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6 flex items-start space-x-3">
            <CheckCircle
              size={20}
              className="text-green-600 flex-shrink-0 mt-0.5"
            />
            <div className="flex-1">
              <p className="font-medium text-green-800 mb-1">
                Đề cương đã được duyệt
              </p>
              <p className="text-sm text-green-700 mb-2">
                Giáo viên đã phê duyệt đề cương của bạn. Bạn có thể bắt đầu thực
                hiện khóa luận.
              </p>
              {myRegistration.outlineFeedback && (
                <div className="bg-white rounded p-3 mt-2">
                  <p className="text-xs font-medium text-gray-700 mb-1">
                    Phản hồi:
                  </p>
                  <p className="text-sm text-gray-600">
                    {myRegistration.outlineFeedback}
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        {myRegistration.status === "outline_rejected" && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6 flex items-start space-x-3">
            <XCircle size={20} className="text-red-600 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="font-medium text-red-800 mb-1">
                Đề cương cần chỉnh sửa
              </p>
              <p className="text-sm text-red-700 mb-2">
                Giáo viên yêu cầu bạn chỉnh sửa đề cương theo phản hồi dưới đây.
              </p>
              {myRegistration.outlineFeedback && (
                <div className="bg-white rounded p-3 mt-2">
                  <p className="text-xs font-medium text-gray-700 mb-1">
                    Phản hồi:
                  </p>
                  <p className="text-sm text-gray-600">
                    {myRegistration.outlineFeedback}
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        {(myRegistration.status === "in_progress" ||
          myRegistration.status === "submitted") && (
          <div className="bg-purple-50 border border-purple-200 rounded-lg p-4 mb-6 flex items-start space-x-3">
            <CheckCircle
              size={20}
              className="text-purple-600 flex-shrink-0 mt-0.5"
            />
            <div>
              <p className="font-medium text-purple-800 mb-1">
                Đã hoàn thành giai đoạn đề cương
              </p>
              <p className="text-sm text-purple-700">
                Bạn đã nộp và được duyệt đề cương. Hiện đang trong giai đoạn
                thực hiện khóa luận.
              </p>
            </div>
          </div>
        )}

        {canSubmit && (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Yêu cầu đề cương
              </label>
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 text-sm space-y-2">
                <p className="text-gray-700">Đề cương cần bao gồm các phần:</p>
                <ul className="list-disc list-inside space-y-1 text-gray-600 ml-2">
                  <li>Tên đề tài và mục tiêu nghiên cứu</li>
                  <li>Phạm vi và đối tượng nghiên cứu</li>
                  <li>Phương pháp thực hiện</li>
                  <li>Kế hoạch chi tiết (timeline)</li>
                  <li>Tài liệu tham khảo</li>
                  <li>Dự kiến kết quả đạt được</li>
                </ul>
                <p className="text-gray-700 mt-3">
                  <strong>Format:</strong> File PDF, tối đa 10MB
                </p>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Upload đề cương
              </label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-400 transition-colors">
                <Upload size={48} className="mx-auto text-gray-400 mb-3" />
                <input
                  type="file"
                  accept=".pdf"
                  onChange={handleFileChange}
                  className="hidden"
                  id="outline-file"
                />
                <label
                  htmlFor="outline-file"
                  className="cursor-pointer text-blue-600 hover:text-blue-700 font-medium"
                >
                  Chọn file PDF
                </label>
                {outlineFile && (
                  <p className="mt-2 text-sm text-gray-600">
                    Đã chọn: {outlineFile.name}
                  </p>
                )}
              </div>
            </div>

            <button
              type="submit"
              disabled={!outlineFile}
              className="w-full py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
            >
              Nộp đề cương
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default OutlineSubmission;
