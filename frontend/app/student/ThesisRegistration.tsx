"use client";
import React, { useState } from "react";
import {
  mockTopics,
  mockRegistrations,
  mockTeachers,
  Topic,
} from "../../data/mockData";
import { useAuth } from "../../contexts/AuthContext";
import {
  BookOpen,
  User,
  Users,
  CheckCircle,
  XCircle,
  Info,
} from "lucide-react";

const ThesisRegistration: React.FC = () => {
  const { user } = useAuth();
  const [selectedTopic, setSelectedTopic] = useState<Topic | null>(null);
  const [showModal, setShowModal] = useState(false);

  const approvedTopics = mockTopics.filter((t) => t.status === "approved");
  const myRegistration = mockRegistrations.find(
    (r) => r.studentId === user?.profileId
  );

  const getTeacher = (teacherId: string) => {
    return mockTeachers.find((t) => t.id === teacherId);
  };

  const handleRegister = (topic: Topic) => {
    setSelectedTopic(topic);
    setShowModal(true);
  };

  const confirmRegister = () => {
    alert("Đăng ký thành công! (Demo mode - dữ liệu không được lưu thực tế)");
    setShowModal(false);
    setSelectedTopic(null);
  };

  if (myRegistration) {
    const myTopic = mockTopics.find((t) => t.id === myRegistration.topicId);
    const myTeacher = getTeacher(myRegistration.teacherId);

    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center space-x-3 mb-6">
          <div className="bg-green-100 p-2 rounded-lg">
            <CheckCircle size={24} className="text-green-600" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900">
              Đề tài đã đăng ký
            </h2>
            <p className="text-sm text-gray-500">Thông tin khóa luận của bạn</p>
          </div>
        </div>

        <div className="bg-gradient-to-br from-blue-50 to-blue-100 border-2 border-blue-200 rounded-xl p-6 space-y-4">
          <div>
            <p className="text-xs font-medium text-blue-600 mb-1">MÃ ĐỀ TÀI</p>
            <p className="text-lg font-bold text-gray-900">{myTopic?.code}</p>
          </div>

          <div>
            <p className="text-xs font-medium text-blue-600 mb-1">TÊN ĐỀ TÀI</p>
            <p className="text-xl font-bold text-gray-900">{myTopic?.title}</p>
          </div>

          <div className="grid md:grid-cols-2 gap-4 pt-4 border-t border-blue-200">
            <div>
              <p className="text-xs font-medium text-blue-600 mb-1">
                GIÁO VIÊN HƯỚNG DẪN
              </p>
              <p className="text-base font-semibold text-gray-900">
                {myTeacher?.name}
              </p>
              <p className="text-sm text-gray-600">{myTeacher?.email}</p>
            </div>
            <div>
              <p className="text-xs font-medium text-blue-600 mb-1">
                CHUYÊN NGÀNH
              </p>
              <p className="text-base font-semibold text-gray-900">
                {myTopic?.specialization}
              </p>
            </div>
          </div>

          <div className="pt-4 border-t border-blue-200">
            <p className="text-xs font-medium text-blue-600 mb-1">TRẠNG THÁI</p>
            <div className="flex items-center space-x-2">
              {myRegistration.status === "registered" && (
                <span className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-sm font-medium">
                  Đã đăng ký
                </span>
              )}
              {myRegistration.status === "outline_pending" && (
                <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                  Chờ duyệt đề cương
                </span>
              )}
              {myRegistration.status === "outline_approved" && (
                <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
                  Đề cương đã duyệt
                </span>
              )}
              {myRegistration.status === "in_progress" && (
                <span className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm font-medium">
                  Đang thực hiện
                </span>
              )}
              {myRegistration.status === "submitted" && (
                <span className="px-3 py-1 bg-teal-100 text-teal-800 rounded-full text-sm font-medium">
                  Đã nộp khóa luận
                </span>
              )}
            </div>
          </div>

          <div className="pt-4 border-t border-blue-200">
            <p className="text-xs font-medium text-blue-600 mb-2">
              MÔ TẢ ĐỀ TÀI
            </p>
            <p className="text-sm text-gray-700 leading-relaxed">
              {myTopic?.description}
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center space-x-3 mb-6">
          <div className="bg-blue-100 p-2 rounded-lg">
            <BookOpen size={24} className="text-blue-600" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Đăng ký đề tài</h2>
            <p className="text-sm text-gray-500">
              Chọn đề tài khóa luận tốt nghiệp
            </p>
          </div>
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6 flex items-start space-x-3">
          <Info size={20} className="text-blue-600 flex-shrink-0 mt-0.5" />
          <div className="text-sm text-blue-800">
            <p className="font-medium mb-1">Lưu ý khi đăng ký:</p>
            <ul className="list-disc list-inside space-y-1 text-blue-700">
              <li>Mỗi sinh viên chỉ được đăng ký 1 đề tài</li>
              <li>Kiểm tra số lượng còn nhận trước khi đăng ký</li>
              <li>Đọc kỹ yêu cầu và tài liệu tham khảo</li>
            </ul>
          </div>
        </div>

        <div className="space-y-4">
          {approvedTopics.map((topic) => {
            const teacher = getTeacher(topic.teacherId);
            const isFull = topic.currentStudents >= topic.maxStudents;
            const isTeacherFull =
              teacher && teacher.currentTheses >= teacher.maxTheses;

            return (
              <div
                key={topic.id}
                className={`border rounded-xl p-5 transition-all ${
                  isFull || isTeacherFull
                    ? "border-gray-200 bg-gray-50"
                    : "border-gray-200 hover:border-blue-300 hover:shadow-md"
                }`}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs font-semibold">
                        {topic.code}
                      </span>
                      <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs">
                        {topic.specialization}
                      </span>
                    </div>
                    <h3 className="text-lg font-bold text-gray-900 mb-2">
                      {topic.title}
                    </h3>
                    <p className="text-sm text-gray-600 leading-relaxed mb-3">
                      {topic.description}
                    </p>

                    <div className="flex items-center space-x-4 text-sm mb-3">
                      <div className="flex items-center space-x-2">
                        <User size={16} className="text-gray-400" />
                        <span className="text-gray-700">{teacher?.name}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Users size={16} className="text-gray-400" />
                        <span
                          className={`font-medium ${
                            isFull ? "text-red-600" : "text-green-600"
                          }`}
                        >
                          {topic.currentStudents}/{topic.maxStudents}
                        </span>
                      </div>
                    </div>

                    <div className="bg-gray-50 rounded-lg p-3 text-xs">
                      <p className="font-semibold text-gray-700 mb-1">
                        Yêu cầu:
                      </p>
                      <p className="text-gray-600">{topic.requirements}</p>
                    </div>
                  </div>

                  <div className="ml-4">
                    {isFull || isTeacherFull ? (
                      <button
                        disabled
                        className="px-4 py-2 bg-gray-200 text-gray-500 rounded-lg text-sm font-medium cursor-not-allowed"
                      >
                        Đã đầy
                      </button>
                    ) : (
                      <button
                        onClick={() => handleRegister(topic)}
                        className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-colors"
                      >
                        Đăng ký
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {showModal && selectedTopic && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-xl font-bold text-gray-900">
                Xác nhận đăng ký
              </h3>
            </div>

            <div className="p-6 space-y-4">
              <div>
                <p className="text-sm font-medium text-gray-500 mb-1">Đề tài</p>
                <p className="text-lg font-bold text-gray-900">
                  {selectedTopic.title}
                </p>
              </div>

              <div>
                <p className="text-sm font-medium text-gray-500 mb-1">
                  Giáo viên hướng dẫn
                </p>
                <p className="text-base font-semibold text-gray-900">
                  {getTeacher(selectedTopic.teacherId)?.name}
                </p>
              </div>

              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <p className="text-sm text-yellow-800">
                  <strong>Lưu ý:</strong> Sau khi đăng ký, bạn sẽ không thể thay
                  đổi đề tài. Vui lòng xem xét kỹ trước khi xác nhận.
                </p>
              </div>
            </div>

            <div className="p-6 border-t border-gray-200 flex justify-end space-x-3">
              <button
                onClick={() => {
                  setShowModal(false);
                  setSelectedTopic(null);
                }}
                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Hủy
              </button>
              <button
                onClick={confirmRegister}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Xác nhận đăng ký
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ThesisRegistration;
