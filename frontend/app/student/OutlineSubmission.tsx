"use client";
import React, { useState } from "react";
import {
  mockRegistrations,
  mockTopics,
  mockTeachers,
  mockThesisPeriods,
} from "../../data/mockData";
import { useAuth } from "../../contexts/AuthContext";
import {
  FileText,
  Upload,
  CheckCircle,
  XCircle,
  AlertCircle,
  Clock,
  AlertTriangle,
} from "lucide-react";

const OutlineSubmission: React.FC = () => {
  const { user } = useAuth();
  const [outlineFile, setOutlineFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showOverwriteConfirm, setShowOverwriteConfirm] = useState(false);
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const [submissionTime, setSubmissionTime] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // In a real app, use SWR or React Query to fetch fresh data
  const myRegistration = mockRegistrations.find(
    (r) => r.studentId === user?.profileId
  );
  const myTopic = myRegistration
    ? mockTopics.find((t) => t.id === myRegistration.topicId)
    : null;
  const myTeacher = myRegistration
    ? mockTeachers.find((t) => t.id === myRegistration.teacherId)
    : null;

  // Find active thesis period and submission milestone
  // Assuming the user's topic belongs to the first active period or we find one matching
  // For simplicty in mock, using the first active period
  const activePeriod = mockThesisPeriods.find((p) => p.status === "active");
  const submissionMilestone = activePeriod?.milestones.find(
    (m) => m.name === "Nộp đề cương chi tiết" && m.type === "submission"
  );

  const checkSubmissionPeriod = () => {
    if (!submissionMilestone)
      return { isValid: false, message: "Không tìm thấy đợt nộp đề cương." };

    // For testing/mocking, simple string comparison might work if format is ISO YYYY-MM-DD
    // But ideally parse dates
    const now = new Date();
    const startDate = new Date(submissionMilestone.startDate);
    const endDate = new Date(submissionMilestone.endDate || "2099-12-31");
    // Reset times for simpler date comparison or keep strict time
    // Assuming mock dates are YYYY-MM-DD

    if (now < startDate)
      return {
        isValid: false,
        message: `Chưa đến thời gian nộp đề cương (Bắt đầu: ${submissionMilestone.startDate})`,
      };
    if (now > endDate)
      return {
        isValid: false,
        message: `Đã hết hạn nộp đề cương (Hạn chót: ${submissionMilestone.endDate})`,
      };

    return { isValid: true, message: "" };
  };

  const periodValidation = checkSubmissionPeriod();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setErrorMessage(null);
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (file.type !== "application/pdf") {
        setErrorMessage("Vui lòng chỉ chọn file định dạng PDF.");
        return;
      }
      setOutlineFile(file);
    }
  };

  const handlePreSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!outlineFile) return;

    if (myRegistration?.outlineFileUrl) {
      setShowOverwriteConfirm(true);
    } else {
      executeSubmit();
    }
  };

  const executeSubmit = () => {
    setShowOverwriteConfirm(false);
    setIsSubmitting(true);

    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      setShowSuccessPopup(true);
      setSubmissionTime(new Date().toISOString());
      setOutlineFile(null);
    }, 1500);
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

  // If period invalid, show error
  if (!periodValidation.isValid) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <div className="bg-red-100 p-4 rounded-full mb-4">
            <Clock size={48} className="text-red-600" />
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">
            Ngoài thời gian nộp
          </h3>
          <p className="text-gray-600 max-w-md">{periodValidation.message}</p>
          <div className="mt-4 p-3 bg-gray-50 rounded-lg text-sm text-gray-500">
            Thời gian quy định: {submissionMilestone?.startDate} đến{" "}
            {submissionMilestone?.endDate}
          </div>
        </div>
      </div>
    );
  }

  const canSubmit =
    myRegistration.status === "registered" ||
    myRegistration.status === "outline_rejected" ||
    myRegistration.status === "outline_pending"; // Allow re-submit while pending (overwrite)

  // Determine display status based on simulation or current data
  const effectiveStatus = submissionTime
    ? "outline_pending"
    : myRegistration.status;

  const effectiveSubmissionDate =
    submissionTime || myRegistration.outlineSubmittedAt;

  return (
    <div className="space-y-6 relative">
      {/* Overwrite Confirmation Modal */}
      {showOverwriteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-lg max-w-md w-full p-6 animate-in fade-in zoom-in duration-200">
            <div className="flex items-center space-x-3 mb-4 text-amber-600">
              <AlertTriangle size={28} />
              <h3 className="text-xl font-bold text-gray-900">
                Ghi đè file cũ
              </h3>
            </div>
            <p className="text-gray-600 mb-6">
              Bạn đã nộp đề cương trước đó. Bạn có chắc chắn muốn nộp file mới
              này và ghi đè lên file cũ không?
            </p>
            <div className="flex space-x-3 justify-end">
              <button
                onClick={() => setShowOverwriteConfirm(false)}
                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 font-medium transition-colors"
              >
                Hủy bỏ
              </button>
              <button
                onClick={executeSubmit}
                className="px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 font-medium transition-colors shadow-sm"
              >
                Xác nhận
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Success Popup */}
      {showSuccessPopup && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-lg max-w-sm w-full p-6 text-center animate-in fade-in zoom-in duration-200">
            <div className="mx-auto bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mb-4">
              <CheckCircle size={32} className="text-green-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              Thành công!
            </h3>
            <p className="text-gray-600 mb-6">
              Đề cương của bạn đã được cập nhật lên hệ thống thành công.
            </p>
            <button
              onClick={() => setShowSuccessPopup(false)}
              className="w-full py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium transition-colors"
            >
              Đóng
            </button>
          </div>
        </div>
      )}

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

        {effectiveStatus === "outline_pending" && (
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
              {effectiveSubmissionDate && (
                <p className="text-xs text-yellow-600 mt-2">
                  Nộp ngày:{" "}
                  {new Date(effectiveSubmissionDate).toLocaleDateString(
                    "vi-VN"
                  )}{" "}
                  {new Date(effectiveSubmissionDate).toLocaleTimeString(
                    "vi-VN"
                  )}
                </p>
              )}
            </div>
          </div>
        )}

        {effectiveStatus === "outline_approved" && (
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

        {effectiveStatus === "outline_rejected" && (
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

        {(effectiveStatus === "in_progress" ||
          effectiveStatus === "submitted") && (
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
          <form onSubmit={handlePreSubmit} className="space-y-4">
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
              <div
                className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
                  errorMessage
                    ? "border-red-300 bg-red-50"
                    : "border-gray-300 hover:border-blue-400"
                }`}
              >
                <Upload
                  size={48}
                  className={`mx-auto mb-3 ${
                    errorMessage ? "text-red-400" : "text-gray-400"
                  }`}
                />
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
                {outlineFile && !errorMessage ? (
                  <p className="mt-2 text-sm text-green-600 font-medium">
                    Đã chọn: {outlineFile.name}
                  </p>
                ) : (
                  <p className="mt-2 text-sm text-gray-500">Chưa chọn file</p>
                )}
                {errorMessage && (
                  <p className="mt-2 text-sm text-red-600 flex items-center justify-center">
                    <XCircle size={14} className="mr-1" />
                    {errorMessage}
                  </p>
                )}
              </div>
            </div>

            <button
              type="submit"
              disabled={!outlineFile || isSubmitting || !!errorMessage}
              className="w-full py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors flex items-center justify-center"
            >
              {isSubmitting ? (
                <>
                  <svg
                    className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Đang nộp...
                </>
              ) : (
                "Nộp đề cương"
              )}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default OutlineSubmission;
