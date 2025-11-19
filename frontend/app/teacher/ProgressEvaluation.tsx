"use client";
import React, { useState } from "react";
import {
  mockRegistrations,
  mockStudents,
  mockTopics,
  mockTimelines,
} from "../../data/mockData";
import { useAuth } from "../../contexts/AuthContext";
import { TrendingUp, CheckCircle, MessageSquare, Send } from "lucide-react";

const ProgressEvaluation: React.FC = () => {
  const { user } = useAuth();
  const [selectedStudent, setSelectedStudent] = useState<string | null>(null);
  const [feedback, setFeedback] = useState("");

  const myStudents = mockRegistrations
    .filter((r) => r.teacherId === user?.profileId)
    .map((reg) => {
      const student = mockStudents.find((s) => s.id === reg.studentId);
      const topic = mockTopics.find((t) => t.id === reg.topicId);
      const timelines = mockTimelines.filter(
        (t) => t.registrationId === reg.id
      );
      return { ...reg, student, topic, timelines };
    });

  const needsOutlineReview = myStudents.filter(
    (s) => s.status === "outline_pending"
  );
  const inProgress = myStudents.filter(
    (s) => s.status === "in_progress" || s.status === "outline_approved"
  );

  const handleOutlineFeedback = (registrationId: string, approved: boolean) => {
    const action = approved ? "phê duyệt" : "yêu cầu chỉnh sửa";
    alert(`Đã ${action} đề cương! (Demo mode)`);
  };

  const handleProgressFeedback = (e: React.FormEvent) => {
    e.preventDefault();
    if (feedback && selectedStudent) {
      alert("Đã gửi phản hồi tiến độ! (Demo mode)");
      setFeedback("");
      setSelectedStudent(null);
    }
  };

  return (
    <div className="space-y-6">
      {needsOutlineReview.length > 0 && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center space-x-3 mb-6">
            <div className="bg-yellow-100 p-2 rounded-lg">
              <MessageSquare size={24} className="text-yellow-600" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">
                Đề cương chờ duyệt
              </h2>
              <p className="text-sm text-gray-500">
                {needsOutlineReview.length} đề cương cần xem xét
              </p>
            </div>
          </div>

          <div className="space-y-4">
            {needsOutlineReview.map((item) => (
              <div
                key={item.id}
                className="border-2 border-yellow-200 bg-yellow-50 rounded-xl p-5"
              >
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-bold text-gray-900 mb-1">
                      {item.student?.name}
                    </h3>
                    <p className="text-sm text-gray-600 mb-2">
                      {item.student?.code} - {item.topic?.title}
                    </p>
                    {item.outlineSubmittedAt && (
                      <p className="text-xs text-gray-500">
                        Nộp ngày:{" "}
                        {new Date(item.outlineSubmittedAt).toLocaleDateString(
                          "vi-VN"
                        )}
                      </p>
                    )}
                  </div>
                </div>

                <div className="bg-white rounded-lg p-4 mb-4">
                  <p className="text-sm text-gray-700 mb-3">
                    Sinh viên đã nộp đề cương. Vui lòng xem xét và phản hồi.
                  </p>
                  <textarea
                    placeholder="Nhập phản hồi của bạn..."
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-yellow-500 focus:border-transparent resize-none"
                  />
                </div>

                <div className="flex justify-end space-x-3">
                  <button
                    onClick={() => handleOutlineFeedback(item.id, false)}
                    className="px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors font-medium"
                  >
                    Yêu cầu chỉnh sửa
                  </button>
                  <button
                    onClick={() => handleOutlineFeedback(item.id, true)}
                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium"
                  >
                    Phê duyệt
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center space-x-3 mb-6">
          <div className="bg-purple-100 p-2 rounded-lg">
            <TrendingUp size={24} className="text-purple-600" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900">
              Đánh giá tiến độ
            </h2>
            <p className="text-sm text-gray-500">
              Theo dõi và đánh giá tiến độ sinh viên
            </p>
          </div>
        </div>

        {inProgress.length === 0 ? (
          <div className="text-center py-12 bg-gray-50 rounded-xl">
            <TrendingUp size={48} className="mx-auto text-gray-300 mb-3" />
            <p className="text-gray-500">
              Chưa có sinh viên trong giai đoạn thực hiện
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {inProgress.map((item) => {
              const completedMilestones = item.timelines.filter(
                (t) => t.status === "completed"
              ).length;
              const totalMilestones = item.timelines.length;
              const progress =
                totalMilestones > 0
                  ? (completedMilestones / totalMilestones) * 100
                  : 0;

              return (
                <div
                  key={item.id}
                  className="border border-gray-200 rounded-xl p-5 hover:shadow-md transition-all"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h3 className="text-lg font-bold text-gray-900 mb-1">
                        {item.student?.name}
                      </h3>
                      <p className="text-sm text-gray-600 mb-3">
                        {item.student?.code} - {item.topic?.title}
                      </p>

                      <div className="mb-4">
                        <div className="flex items-center justify-between text-sm mb-2">
                          <span className="text-gray-600">
                            Tiến độ tổng thể
                          </span>
                          <span className="font-semibold text-purple-600">
                            {Math.round(progress)}%
                          </span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-gradient-to-r from-purple-500 to-purple-600 h-2 rounded-full transition-all"
                            style={{ width: `${progress}%` }}
                          />
                        </div>
                      </div>

                      {item.timelines.length > 0 && (
                        <div className="space-y-2">
                          {item.timelines.map((timeline) => (
                            <div
                              key={timeline.id}
                              className={`flex items-center justify-between p-3 rounded-lg text-sm ${
                                timeline.status === "completed"
                                  ? "bg-green-50 border border-green-200"
                                  : timeline.status === "overdue"
                                  ? "bg-red-50 border border-red-200"
                                  : "bg-gray-50 border border-gray-200"
                              }`}
                            >
                              <div className="flex items-center space-x-2 flex-1">
                                {timeline.status === "completed" && (
                                  <CheckCircle
                                    size={16}
                                    className="text-green-600 flex-shrink-0"
                                  />
                                )}
                                <div>
                                  <p className="font-medium text-gray-900">
                                    {timeline.milestone}
                                  </p>
                                  <p className="text-xs text-gray-600">
                                    Hạn:{" "}
                                    {new Date(
                                      timeline.dueDate
                                    ).toLocaleDateString("vi-VN")}
                                  </p>
                                </div>
                              </div>
                              <span
                                className={`text-xs font-medium ${
                                  timeline.status === "completed"
                                    ? "text-green-700"
                                    : timeline.status === "overdue"
                                    ? "text-red-700"
                                    : "text-yellow-700"
                                }`}
                              >
                                {timeline.status === "completed"
                                  ? "Hoàn thành"
                                  : timeline.status === "overdue"
                                  ? "Quá hạn"
                                  : "Đang thực hiện"}
                              </span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  <button
                    onClick={() => setSelectedStudent(item.id)}
                    className="w-full mt-4 py-2 border-2 border-purple-200 text-purple-700 rounded-lg hover:bg-purple-50 transition-colors font-medium"
                  >
                    Gửi phản hồi
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {selectedStudent && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full">
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-xl font-bold text-gray-900">
                Gửi phản hồi tiến độ
              </h3>
            </div>

            <form onSubmit={handleProgressFeedback} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nội dung phản hồi
                </label>
                <textarea
                  value={feedback}
                  onChange={(e) => setFeedback(e.target.value)}
                  rows={6}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
                  placeholder="Nhập phản hồi về tiến độ thực hiện của sinh viên..."
                  required
                />
              </div>

              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => {
                    setSelectedStudent(null);
                    setFeedback("");
                  }}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="flex items-center space-x-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                >
                  <Send size={18} />
                  <span>Gửi phản hồi</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProgressEvaluation;
