"use client";

import { useState } from "react";
import { gql } from "@apollo/client";
import { useQuery, useMutation } from "@apollo/client/react";
import { useAuth } from "@/contexts/AuthContext";
import FileUpload from "./components/FileUpload";
import {
  FileText,
  CheckCircle,
  Clock,
  AlertCircle,
  X,
  UploadCloud,
  ChevronRight,
  Send,
} from "lucide-react";

// --- GraphQL Operations ---
const MY_REGISTRATIONS = gql`
  query MyRegistrations($studentId: String!) {
    myRegistrations(studentId: $studentId) {
      id
      topicId
      status
      outlineFileUrl
      outlineSubmittedAt
      outlineFeedback
    }
  }
`;

const SUBMIT_OUTLINE = gql`
  mutation SubmitOutline($registrationId: String!, $fileUrl: String!) {
    submitOutline(registrationId: $registrationId, fileUrl: $fileUrl) {
      id
      outlineFileUrl
      outlineSubmittedAt
    }
  }
`;

export default function OutlineSubmission() {
  const { user } = useAuth();
  const [showForm, setShowForm] = useState(false);
  const [fileUrl, setFileUrl] = useState<string>("");

  const { data: regData, refetch } = useQuery<any>(MY_REGISTRATIONS, {
    variables: { studentId: user?.profileId },
    skip: !user?.profileId,
  });

  const registration = regData?.myRegistrations?.[0];

  // Mutation
  const [submitOutline] = useMutation(SUBMIT_OUTLINE, {
    onCompleted: () => {
      alert("Nộp đề cương thành công!");
      setShowForm(false);
      setFileUrl("");
      refetch();
    },
    onError: (err) => alert("Lỗi: " + err.message),
  });

  const handleSubmit = () => {
    if (!registration) return;
    if (!fileUrl) {
      alert("Vui lòng upload file trước.");
      return;
    }

    submitOutline({
      variables: {
        registrationId: registration.id,
        fileUrl: fileUrl,
      },
    });
  };

  const handleUploadComplete = (urls: string[]) => {
    if (urls.length > 0) {
      setFileUrl(urls[0]);
    }
  };

  // Get Active Period for Milestones
  const GET_ACTIVE_PERIOD = gql`
    query GetActiveThesisPeriod {
      thesisPeriods {
        id
        name
        status
        milestones {
          id
          name
          startDate
          endDate
          type
        }
      }
    }
  `;

  const { data: periodData } = useQuery<any>(GET_ACTIVE_PERIOD);
  const activePeriod = periodData?.thesisPeriods?.find(
    (p: any) => p.status === "active"
  );

  // Find Outline Submission Milestone
  const outlineMilestone = activePeriod?.milestones?.find((m: any) =>
    m.name.toLowerCase().includes("đề cương")
  );

  const isSubmissionTime = () => {
    if (!outlineMilestone) return true; // Fallback if no milestone found
    const now = new Date();
    const start = new Date(outlineMilestone.startDate);
    const end = new Date(outlineMilestone.endDate);
    // Set end date to end of day
    end.setHours(23, 59, 59, 999);
    return now >= start && now <= end;
  };

  const submissionAllowed = isSubmissionTime();

  if (!registration) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
        <div className="bg-gray-50 p-4 rounded-full mb-4">
          <AlertCircle size={40} className="text-gray-400" />
        </div>
        <h3 className="text-xl font-bold text-gray-800 mb-2">
          Chưa đăng ký đề tài
        </h3>
        <p className="text-gray-500 text-center max-w-md">
          Bạn cần đăng ký đề tài khóa luận trước khi có thể nộp đề cương chi
          tiết.
        </p>
      </div>
    );
  }

  // Determine status
  let status = "pending";
  if (registration.status === "outline_approved") status = "approved";
  else if (registration.status === "outline_rejected") status = "rejected";
  else if (registration.outlineFeedback) status = "rejected";

  const isSubmitted = !!registration.outlineSubmittedAt;

  // Render Status Badge
  const renderStatusBadge = () => {
    switch (status) {
      case "approved":
        return (
          <div className="flex items-center gap-2 px-4 py-2 bg-green-100 text-green-700 rounded-full font-bold text-sm">
            <CheckCircle size={18} /> Đã Duyệt
          </div>
        );
      case "rejected":
        return (
          <div className="flex items-center gap-2 px-4 py-2 bg-red-100 text-red-700 rounded-full font-bold text-sm">
            <AlertCircle size={18} /> Yêu Cầu Sửa
          </div>
        );
      default:
        return (
          <div className="flex items-center gap-2 px-4 py-2 bg-blue-100 text-blue-700 rounded-full font-bold text-sm">
            <Clock size={18} /> Chờ Duyệt
          </div>
        );
    }
  };

  return (
    <div className="space-y-8 text-black animate-in fade-in slide-in-from-bottom-4 duration-500 pb-10">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-sm p-8 text-white shadow-lg relative overflow-hidden">
        <div className="relative z-10">
          <h2 className="text-3xl font-bold mb-2">Nộp Đề Cương</h2>
          <p className="text-blue-100 max-w-2xl text-lg">
            Nộp và theo dõi trạng thái phê duyệt đề cương chi tiết của bạn. Hãy
            đảm bảo đề cương đầy đủ nội dung theo quy định.
          </p>
          {outlineMilestone && (
            <div className="mt-4 inline-flex items-center gap-2 bg-white/20 backdrop-blur-md px-4 py-2 rounded-lg text-sm font-medium border border-white/10">
              <Clock size={16} />
              Thời gian nộp:{" "}
              {new Date(outlineMilestone.startDate).toLocaleDateString(
                "vi-VN"
              )}{" "}
              - {new Date(outlineMilestone.endDate).toLocaleDateString("vi-VN")}
              {!submissionAllowed && !isSubmitted && (
                <span className="ml-2 bg-red-500 text-white text-xs px-2 py-0.5 rounded font-bold">
                  Đã đóng / Chưa mở
                </span>
              )}
            </div>
          )}
        </div>
        {/* Abstract Background Shapes */}
        <div className="absolute top-0 right-0 -mr-10 -mt-10 w-64 h-64 bg-white opacity-10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 -ml-10 -mb-10 w-40 h-40 bg-white opacity-10 rounded-full blur-2xl"></div>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Submission Status */}
        <div className="lg:col-span-2 space-y-6">
          {/* Warning banner if submission not allowed and not done */}
          {!submissionAllowed && !isSubmitted && (
            <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-start gap-3">
              <AlertCircle className="text-red-600 mt-0.5" size={20} />
              <div>
                <h4 className="font-bold text-red-800">
                  Cổng nộp đề cương hiện đang đóng
                </h4>
                <p className="text-sm text-red-600 mt-1">
                  Hiện tại không nằm trong thời gian quy định nộp đề cương. Vui
                  lòng quay lại sau hoặc liên hệ giáo viên hướng dẫn.
                </p>
              </div>
            </div>
          )}

          {isSubmitted && !showForm ? (
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="p-6 border-b border-gray-100 bg-gray-50/50 flex justify-between items-center">
                <h3 className="font-bold text-gray-800 text-lg flex items-center gap-2">
                  <FileText className="text-blue-600" size={20} /> Thông Tin Đề
                  Cương
                </h3>
                {renderStatusBadge()}
              </div>

              <div className="p-8">
                {/* Timeline Visual */}
                <div className="flex items-center justify-between mb-8 relative">
                  {/* Line */}
                  <div className="absolute left-0 top-1/2 w-full h-1 bg-gray-100 -z-10 transform -translate-y-1/2"></div>

                  {/* Step 1: Submit */}
                  <div className="flex flex-col items-center gap-2 bg-white px-2">
                    <div className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center shadow-lg shadow-blue-200">
                      <UploadCloud size={18} />
                    </div>
                    <span className="text-xs font-bold text-blue-600">
                      Đã Nộp
                    </span>
                    <span className="text-[10px] text-gray-400">
                      {new Date(
                        registration.outlineSubmittedAt
                      ).toLocaleDateString("vi-VN")}
                    </span>
                  </div>

                  {/* Step 2: Review (Active or Done) */}
                  <div className="flex flex-col items-center gap-2 bg-white px-2">
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center shadow-lg
                          ${
                            status !== "pending"
                              ? "bg-blue-600 text-white shadow-blue-200"
                              : "bg-gray-100 text-gray-400"
                          }`}
                    >
                      <Clock size={18} />
                    </div>
                    <span
                      className={`text-xs font-bold ${
                        status !== "pending" ? "text-blue-600" : "text-gray-400"
                      }`}
                    >
                      Đang Duyệt
                    </span>
                  </div>

                  {/* Step 3: Result */}
                  <div className="flex flex-col items-center gap-2 bg-white px-2">
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center shadow-lg
                          ${
                            status === "approved"
                              ? "bg-green-500 text-white shadow-green-200"
                              : status === "rejected"
                              ? "bg-red-500 text-white shadow-red-200"
                              : "bg-gray-100 text-gray-400"
                          }`}
                    >
                      {status === "approved" ? (
                        <CheckCircle size={18} />
                      ) : status === "rejected" ? (
                        <X size={18} />
                      ) : (
                        <CheckCircle size={18} />
                      )}
                    </div>
                    <span
                      className={`text-xs font-bold ${
                        status === "approved"
                          ? "text-green-600"
                          : status === "rejected"
                          ? "text-red-600"
                          : "text-gray-400"
                      }`}
                    >
                      Kết Quả
                    </span>
                  </div>
                </div>

                {/* File Info Card */}
                <div className="bg-blue-50/50 rounded-xl p-6 border border-blue-100 flex items-center justify-between group hover:border-blue-300 transition-colors">
                  <div className="flex items-center gap-4">
                    <div className="bg-white p-3 rounded-lg shadow-sm text-blue-600">
                      <FileText size={28} />
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-800">File tài liệu</h4>
                      <p className="text-sm text-gray-500 flex items-center gap-1">
                        <Clock size={12} />{" "}
                        {new Date(
                          registration.outlineSubmittedAt
                        ).toLocaleString("vi-VN")}
                      </p>
                    </div>
                  </div>
                  {registration.outlineFileUrl && (
                    <a
                      href={registration.outlineFileUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-4 py-2 bg-white text-blue-600 text-sm font-bold rounded-lg shadow-sm border border-gray-100 hover:bg-blue-50 transition-colors"
                    >
                      Xem Chi Tiết
                    </a>
                  )}
                </div>

                {/* Feedback Section */}
                {registration.outlineFeedback && (
                  <div
                    className={`mt-6 p-6 rounded-xl border ${
                      status === "rejected"
                        ? "bg-red-50 border-red-100"
                        : "bg-green-50 border-green-100"
                    }`}
                  >
                    <h4
                      className={`font-bold mb-2 flex items-center gap-2 ${
                        status === "rejected"
                          ? "text-red-800"
                          : "text-green-800"
                      }`}
                    >
                      {status === "rejected" ? (
                        <AlertCircle size={18} />
                      ) : (
                        <CheckCircle size={18} />
                      )}
                      Nhận xét của giảng viên
                    </h4>
                    <p
                      className={`text-sm ${
                        status === "rejected"
                          ? "text-red-700"
                          : "text-green-700"
                      }`}
                    >
                      {registration.outlineFeedback}
                    </p>
                  </div>
                )}
              </div>

              {/* Footer Actions */}
              {status !== "approved" && (
                <div className="bg-gray-50 px-8 py-4 border-t border-gray-100 flex justify-end">
                  <button
                    onClick={() => {
                      if (submissionAllowed) {
                        setShowForm(true);
                        setFileUrl("");
                      } else {
                        alert("Hiện chưa đến thời gian nộp hoặc đã hết hạn!");
                      }
                    }}
                    disabled={!submissionAllowed}
                    className="text-sm font-bold text-gray-600 hover:text-blue-600 flex items-center gap-1 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Nộp lại bản mới <ChevronRight size={16} />
                  </button>
                </div>
              )}
            </div>
          ) : (
            // NOT SUBMITTED or SHOW FORM state
            <>
              {!showForm ? (
                // Empty State
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-12 text-center">
                  <div className="w-20 h-20 bg-blue-50 text-blue-500 rounded-full flex items-center justify-center mx-auto mb-6">
                    <UploadCloud size={40} />
                  </div>
                  <h3 className="text-xl font-bold text-gray-800 mb-2">
                    Chưa Nộp Đề Cương
                  </h3>
                  <p className="text-gray-500 max-w-md mx-auto mb-8">
                    Bạn chưa nộp bản đề cương nào. Vui lòng chuẩn bị file PDF và
                    nộp để giảng viên phê duyệt.
                  </p>
                  <button
                    onClick={() => setShowForm(true)}
                    disabled={!submissionAllowed}
                    className="bg-blue-600 text-white px-8 py-3 rounded-xl font-bold shadow-lg shadow-blue-200 hover:bg-blue-700 hover:shadow-blue-300 transition-all transform hover:-translate-y-1 flex items-center gap-2 mx-auto disabled:bg-gray-400 disabled:shadow-none disabled:transform-none disabled:cursor-not-allowed"
                  >
                    <Send size={18} /> Bắt Đầu Nộp Bài
                  </button>
                </div>
              ) : (
                // FORM State
                <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden animate-in zoom-in-95 duration-200">
                  <div className="px-8 py-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                    <h3 className="font-bold text-gray-800 text-lg">
                      Form Nộp Đề Cương
                    </h3>
                    <button
                      onClick={() => setShowForm(false)}
                      className="text-gray-400 hover:text-gray-600 hover:bg-gray-100 p-2 rounded-lg transition-colors"
                    >
                      <X size={20} />
                    </button>
                  </div>

                  <div className="p-8 space-y-6">
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2">
                        File Đề Cương (PDF){" "}
                        <span className="text-red-500">*</span>
                      </label>
                      <div className="border-2 border-dashed border-gray-300 rounded-xl p-1 hover:border-blue-400 transition-colors bg-gray-50/50">
                        <FileUpload
                          onUploadComplete={handleUploadComplete}
                          maxFiles={1}
                        />
                      </div>
                      {fileUrl && (
                        <div className="mt-3 flex items-center gap-2 text-sm text-green-600 bg-green-50 px-3 py-2 rounded-lg border border-green-100">
                          <CheckCircle size={16} /> Ready to submit
                        </div>
                      )}
                    </div>

                    <div className="bg-blue-50 p-4 rounded-lg text-sm text-blue-700 flex gap-3 items-start">
                      <AlertCircle className="shrink-0 mt-0.5" size={18} />
                      <p>
                        Vui lòng kiểm tra kỹ nội dung trước khi nộp. Sau khi
                        nộp, giáo viên sẽ nhận được thông báo để xem xét.
                      </p>
                    </div>

                    <div className="flex justify-end gap-3 pt-2">
                      <button
                        onClick={() => setShowForm(false)}
                        className="px-6 py-2.5 text-gray-600 font-bold hover:bg-gray-100 rounded-xl transition-colors"
                      >
                        Hủy Bỏ
                      </button>
                      <button
                        onClick={handleSubmit}
                        disabled={!fileUrl || !submissionAllowed}
                        className="px-8 py-2.5 bg-blue-600 text-white font-bold rounded-xl shadow-lg shadow-blue-200 hover:bg-blue-700 hover:shadow-blue-300 disabled:bg-gray-300 disabled:shadow-none transition-all flex items-center gap-2"
                      >
                        <Send size={18} /> Xác Nhận Nộp
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        {/* Right Column: Guidelines Card */}
        <div className="space-y-6">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sticky top-24">
            <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
              <div className="w-1 h-6 bg-orange-500 rounded-full"></div>
              Hướng Dẫn & Quy Định
            </h3>
            <ul className="space-y-4">
              {[
                "Tên đề tài và mục tiêu nghiên cứu rõ ràng.",
                "Phạm vi và đối tượng nghiên cứu cụ thể.",
                "Phương pháp thực hiện khả thi.",
                "Kế hoạch chi tiết (timeline) theo tuần.",
                "Tài liệu tham khảo chuẩn IEEE/APA.",
                "Định dạng PDF, tối đa 10MB.",
              ].map((item, idx) => (
                <li key={idx} className="flex gap-3 text-sm text-gray-600">
                  <span className="flex-shrink-0 w-6 h-6 rounded-full bg-orange-50 text-orange-600 flex items-center justify-center text-xs font-bold border border-orange-100">
                    {idx + 1}
                  </span>
                  <span className="pt-0.5">{item}</span>
                </li>
              ))}
            </ul>
            <div className="mt-6 pt-6 border-t border-gray-100">
              <p className="text-xs text-gray-400 text-center">
                Cần hỗ trợ? Liên hệ giảng viên hướng dẫn
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
