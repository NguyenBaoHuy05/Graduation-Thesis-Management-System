"use client";
import React, { useState } from "react";
import { mockComplaints, mockRegistrations, mockTopics } from "@/data/mockData";
import { useAuth } from "@/contexts/AuthContext";
import { Shield, Send, CheckCircle, Clock, XCircle } from "lucide-react";

const ComplaintForm: React.FC = () => {
  const { user } = useAuth();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const myRegistration = mockRegistrations.find(
    (r) => r.studentId === user?.profileId
  );
  const myComplaints = mockComplaints.filter(
    (c) => c.studentId === user?.profileId
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (title && description) {
      alert("Gửi khiếu nại thành công! (Demo mode)");
      setTitle("");
      setDescription("");
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center space-x-3 mb-6">
          <div className="bg-orange-100 p-2 rounded-lg">
            <Shield size={24} className="text-orange-600" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Khiếu nại</h2>
            <p className="text-sm text-gray-500">
              Gửi khiếu nại về quá trình thực hiện
            </p>
          </div>
        </div>

        {!myRegistration ? (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <p className="text-sm text-yellow-800">
              Bạn cần đăng ký đề tài trước khi có thể gửi khiếu nại.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
              <p className="text-sm text-blue-800">
                <strong>Lưu ý:</strong> Khiếu nại sẽ được xem xét bởi ban quản
                lý khoa. Vui lòng mô tả rõ ràng vấn đề và cung cấp thông tin chi
                tiết.
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tiêu đề khiếu nại
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Nhập tiêu đề ngắn gọn"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nội dung chi tiết
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Mô tả chi tiết vấn đề của bạn..."
                rows={6}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent resize-none"
                required
              />
            </div>

            <button
              type="submit"
              className="w-full flex items-center justify-center space-x-2 py-3 bg-orange-600 text-white rounded-lg font-medium hover:bg-orange-700 transition-colors"
            >
              <Send size={20} />
              <span>Gửi khiếu nại</span>
            </button>
          </form>
        )}
      </div>

      {myComplaints.length > 0 && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4">
            Lịch sử khiếu nại
          </h3>

          <div className="space-y-4">
            {myComplaints.map((complaint) => {
              const topic = mockTopics.find(
                (t) =>
                  mockRegistrations.find(
                    (r) => r.id === complaint.registrationId
                  )?.topicId === t.id
              );

              return (
                <div
                  key={complaint.id}
                  className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-900 mb-1">
                        {complaint.title}
                      </h4>
                      <p className="text-xs text-gray-500">
                        Đề tài: {topic?.title}
                      </p>
                    </div>
                    <div className="ml-4">
                      {complaint.status === "pending" && (
                        <span className="flex items-center space-x-1 px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs font-medium">
                          <Clock size={14} />
                          <span>Chờ xử lý</span>
                        </span>
                      )}
                      {complaint.status === "reviewing" && (
                        <span className="flex items-center space-x-1 px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">
                          <Clock size={14} />
                          <span>Đang xem xét</span>
                        </span>
                      )}
                      {complaint.status === "resolved" && (
                        <span className="flex items-center space-x-1 px-3 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium">
                          <CheckCircle size={14} />
                          <span>Đã giải quyết</span>
                        </span>
                      )}
                      {complaint.status === "rejected" && (
                        <span className="flex items-center space-x-1 px-3 py-1 bg-red-100 text-red-800 rounded-full text-xs font-medium">
                          <XCircle size={14} />
                          <span>Từ chối</span>
                        </span>
                      )}
                    </div>
                  </div>

                  <p className="text-sm text-gray-600 mb-3">
                    {complaint.description}
                  </p>

                  <div className="text-xs text-gray-500 mb-3">
                    Gửi ngày:{" "}
                    {new Date(complaint.createdAt).toLocaleDateString("vi-VN")}
                    {complaint.resolvedAt && (
                      <span className="ml-3">
                        | Giải quyết:{" "}
                        {new Date(complaint.resolvedAt).toLocaleDateString(
                          "vi-VN"
                        )}
                      </span>
                    )}
                  </div>

                  {complaint.response && (
                    <div className="bg-gray-50 rounded-lg p-3 border-l-4 border-blue-500">
                      <p className="text-xs font-medium text-gray-700 mb-1">
                        Phản hồi:
                      </p>
                      <p className="text-sm text-gray-600">
                        {complaint.response}
                      </p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default ComplaintForm;
