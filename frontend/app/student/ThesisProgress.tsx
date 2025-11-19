"use client";
import React, { useState } from "react";
import {
  mockRegistrations,
  mockTimelines,
  mockTopics,
} from "../../data/mockData";
import { useAuth } from "../../contexts/AuthContext";
import {
  TrendingUp,
  CheckCircle,
  Clock,
  AlertTriangle,
  Upload,
  Link as LinkIcon,
} from "lucide-react";

const ThesisProgress: React.FC = () => {
  const { user } = useAuth();
  const [thesisFile, setThesisFile] = useState<File | null>(null);
  const [codeLink, setCodeLink] = useState("");

  const myRegistration = mockRegistrations.find(
    (r) => r.studentId === user?.profileId
  );
  const myTopic = myRegistration
    ? mockTopics.find((t) => t.id === myRegistration.topicId)
    : null;
  const myTimelines = myRegistration
    ? mockTimelines.filter((t) => t.registrationId === myRegistration.id)
    : [];

  const handleSubmitThesis = (e: React.FormEvent) => {
    e.preventDefault();
    if (thesisFile) {
      alert("Nộp khóa luận thành công! (Demo mode)");
      setThesisFile(null);
      setCodeLink("");
    }
  };

  if (!myRegistration) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <div className="bg-yellow-100 p-4 rounded-full mb-4">
            <AlertTriangle size={48} className="text-yellow-600" />
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">
            Chưa đăng ký đề tài
          </h3>
          <p className="text-gray-600">
            Bạn cần đăng ký đề tài để theo dõi tiến độ
          </p>
        </div>
      </div>
    );
  }

  const canSubmitThesis = myRegistration.status === "in_progress";
  const isSubmitted =
    myRegistration.status === "submitted" || myRegistration.status === "graded";

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center space-x-3 mb-6">
          <div className="bg-purple-100 p-2 rounded-lg">
            <TrendingUp size={24} className="text-purple-600" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900">
              Theo dõi tiến độ
            </h2>
            <p className="text-sm text-gray-500">
              Cập nhật và theo dõi tiến độ thực hiện
            </p>
          </div>
        </div>

        <div className="bg-gradient-to-br from-purple-50 to-purple-100 border-2 border-purple-200 rounded-xl p-5 mb-6">
          <h3 className="font-bold text-gray-900 mb-2">{myTopic?.title}</h3>
          <div className="flex items-center space-x-4 text-sm">
            <span className="px-3 py-1 bg-white rounded-full font-medium text-purple-700">
              {myTopic?.code}
            </span>
            {myRegistration.status === "in_progress" && (
              <span className="px-3 py-1 bg-purple-600 text-white rounded-full text-xs font-medium">
                Đang thực hiện
              </span>
            )}
            {isSubmitted && (
              <span className="px-3 py-1 bg-green-600 text-white rounded-full text-xs font-medium">
                Đã nộp
              </span>
            )}
          </div>
        </div>

        <div className="space-y-4 mb-8">
          <h3 className="font-semibold text-gray-900 text-lg">
            Timeline thực hiện
          </h3>

          <div className="relative">
            {myTimelines.map((timeline, index) => {
              const isLast = index === myTimelines.length - 1;
              const isCompleted = timeline.status === "completed";
              const isOverdue = timeline.status === "overdue";

              return (
                <div key={timeline.id} className="flex">
                  <div className="flex flex-col items-center mr-4">
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center ${
                        isCompleted
                          ? "bg-green-500"
                          : isOverdue
                          ? "bg-red-500"
                          : "bg-gray-300"
                      }`}
                    >
                      {isCompleted ? (
                        <CheckCircle size={20} className="text-white" />
                      ) : (
                        <Clock size={20} className="text-white" />
                      )}
                    </div>
                    {!isLast && (
                      <div
                        className={`w-0.5 h-full min-h-[60px] ${
                          isCompleted ? "bg-green-300" : "bg-gray-300"
                        }`}
                      />
                    )}
                  </div>

                  <div className="flex-1 pb-8">
                    <div
                      className={`rounded-xl p-4 ${
                        isCompleted
                          ? "bg-green-50 border border-green-200"
                          : isOverdue
                          ? "bg-red-50 border border-red-200"
                          : "bg-gray-50 border border-gray-200"
                      }`}
                    >
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="font-semibold text-gray-900">
                          {timeline.milestone}
                        </h4>
                        <span
                          className={`text-xs px-2 py-1 rounded-full font-medium ${
                            isCompleted
                              ? "bg-green-100 text-green-700"
                              : isOverdue
                              ? "bg-red-100 text-red-700"
                              : "bg-yellow-100 text-yellow-700"
                          }`}
                        >
                          {isCompleted
                            ? "Hoàn thành"
                            : isOverdue
                            ? "Quá hạn"
                            : "Đang thực hiện"}
                        </span>
                      </div>

                      <p className="text-sm text-gray-600 mb-2">
                        {timeline.description}
                      </p>

                      <div className="flex items-center justify-between text-xs text-gray-500">
                        <span>
                          Hạn:{" "}
                          {new Date(timeline.dueDate).toLocaleDateString(
                            "vi-VN"
                          )}
                        </span>
                        {timeline.completedAt && (
                          <span className="text-green-600">
                            Hoàn thành:{" "}
                            {new Date(timeline.completedAt).toLocaleDateString(
                              "vi-VN"
                            )}
                          </span>
                        )}
                      </div>

                      {timeline.feedback && (
                        <div className="mt-3 pt-3 border-t border-gray-200">
                          <p className="text-xs font-medium text-gray-700 mb-1">
                            Nhận xét của giáo viên:
                          </p>
                          <p className="text-sm text-gray-600">
                            {timeline.feedback}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {canSubmitThesis && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-xl font-bold text-gray-900 mb-4">
            Nộp khóa luận
          </h3>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <p className="text-sm text-blue-800">
              <strong>Lưu ý:</strong> Vui lòng kiểm tra kỹ tài liệu trước khi
              nộp. Sau khi nộp, bạn sẽ không thể chỉnh sửa.
            </p>
          </div>

          <form onSubmit={handleSubmitThesis} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                File khóa luận (PDF)
              </label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-400 transition-colors">
                <Upload size={48} className="mx-auto text-gray-400 mb-3" />
                <input
                  type="file"
                  accept=".pdf"
                  onChange={(e) =>
                    e.target.files && setThesisFile(e.target.files[0])
                  }
                  className="hidden"
                  id="thesis-file"
                />
                <label
                  htmlFor="thesis-file"
                  className="cursor-pointer text-blue-600 hover:text-blue-700 font-medium"
                >
                  Chọn file PDF
                </label>
                {thesisFile && (
                  <p className="mt-2 text-sm text-gray-600">
                    Đã chọn: {thesisFile.name}
                  </p>
                )}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Link source code (tùy chọn)
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <LinkIcon size={18} className="text-gray-400" />
                </div>
                <input
                  type="url"
                  value={codeLink}
                  onChange={(e) => setCodeLink(e.target.value)}
                  placeholder="https://github.com/username/repository"
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={!thesisFile}
              className="w-full py-3 bg-purple-600 text-white rounded-lg font-medium hover:bg-purple-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
            >
              Nộp khóa luận
            </button>
          </form>
        </div>
      )}

      {isSubmitted && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-start space-x-3">
            <CheckCircle
              size={24}
              className="text-green-600 flex-shrink-0 mt-1"
            />
            <div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                Đã nộp khóa luận
              </h3>
              <div className="space-y-2 text-sm">
                <p className="text-gray-600">
                  <strong>Ngày nộp:</strong>{" "}
                  {myRegistration.thesisSubmittedAt &&
                    new Date(
                      myRegistration.thesisSubmittedAt
                    ).toLocaleDateString("vi-VN")}
                </p>
                {myRegistration.thesisNumber && (
                  <p className="text-gray-600">
                    <strong>Số thứ tự:</strong> {myRegistration.thesisNumber}
                  </p>
                )}
                {myRegistration.codeLink && (
                  <p className="text-gray-600">
                    <strong>Source code:</strong>{" "}
                    <a
                      href={myRegistration.codeLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline"
                    >
                      {myRegistration.codeLink}
                    </a>
                  </p>
                )}
                {myRegistration.status === "graded" && myRegistration.score && (
                  <p className="text-lg font-bold text-green-600 mt-3">
                    Điểm: {myRegistration.score}/10
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ThesisProgress;
