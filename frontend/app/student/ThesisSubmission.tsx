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
  Monitor,
  Link as LinkIcon,
  ShieldCheck,
} from "lucide-react";

// --- GraphQL Operations ---
const GET_MY_REGISTRATION = gql`
  query GetMyRegistrationSubmission($studentId: String!) {
    myRegistrations(studentId: $studentId) {
      id
      topicId
      status
      registeredAt
      thesisFileUrl
      thesisSubmittedAt
      codeLink
      topic {
        title
      }
    }
  }
`;

const SUBMIT_THESIS = gql`
  mutation SubmitThesis(
    $registrationId: String!
    $fileUrl: String!
    $codeLink: String
  ) {
    submitThesis(
      registrationId: $registrationId
      fileUrl: $fileUrl
      codeLink: $codeLink
    ) {
      id
      thesisFileUrl
      thesisSubmittedAt
      status
    }
  }
`;

const GET_ACTIVE_PERIOD_SUBMISSION = gql`
  query GetActivePeriodSubmission {
    thesisPeriods {
      id
      status
      milestones {
        name
        startDate
        endDate
      }
    }
  }
`;

export default function ThesisSubmission() {
  const { user } = useAuth();
  const [showForm, setShowForm] = useState(false);
  const [thesisFileUrl, setThesisFileUrl] = useState("");
  const [codeLink, setCodeLink] = useState("");

  const { data: regData, refetch } = useQuery<any>(GET_MY_REGISTRATION, {
    variables: { studentId: user?.profileId },
    skip: !user?.profileId,
  });

  const { data: periodData } = useQuery<any>(GET_ACTIVE_PERIOD_SUBMISSION);

  const registration = regData?.myRegistrations?.[0];

  const [submitThesis, { loading: submitting }] = useMutation(SUBMIT_THESIS, {
    onCompleted: () => {
      alert("Nộp khóa luận thành công!");
      setShowForm(false);
      refetch();
    },
    onError: (err) => alert("Lỗi: " + err.message),
  });

  const handleSubmit = () => {
    if (!registration) return;
    if (!thesisFileUrl || !codeLink) {
      alert("Vui lòng nhập đầy đủ Link Báo cáo và Link Source Code.");
      return;
    }
    if (!confirm("Xác nhận nộp khóa luận?")) return;

    submitThesis({
      variables: {
        registrationId: registration.id,
        fileUrl: thesisFileUrl,
        codeLink: codeLink,
      },
    });
  };

  const handleUploadComplete = (urls: string[]) => {
    if (urls.length > 0) {
      setThesisFileUrl(urls[0]);
    }
  };

  // Helper Milestones
  const activePeriod = periodData?.thesisPeriods?.find(
    (p: any) => p.status === "active"
  );
  const submissionMilestone = activePeriod?.milestones?.find(
    (m: any) =>
      m.name.toLowerCase().includes("bảo vệ") ||
      m.name.toLowerCase().includes("thu") ||
      m.name.toLowerCase().includes("nộp")
  );

  const isSubmissionTime = () => {
    if (!submissionMilestone) return true;
    const now = new Date();
    const start = new Date(submissionMilestone.startDate);
    const end = new Date(submissionMilestone.endDate);
    end.setHours(23, 59, 59, 999);
    return now >= start && now <= end;
  };
  const submissionAllowed = true;

  if (!registration) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] bg-white rounded-sm shadow-sm border border-gray-100 p-8">
        <AlertCircle size={40} className="text-gray-400 mb-4" />
        <h3 className="text-xl font-bold text-gray-800">Chưa Đăng Ký Đề Tài</h3>
        <p className="text-gray-500 mt-2">Bạn cần có đề tài đang thực hiện.</p>
      </div>
    );
  }

  // Map status
  let status = "pending";
  if (
    registration.status === "defense_ready" ||
    registration.status === "thesis_approved" ||
    registration.status === "defense_registered"
  )
    status = "approved";
  else if (registration.status === "thesis_rejected") status = "rejected";
  else if (registration.status === "submitted") status = "submitted";
  else status = "pending";

  const isSubmitted = !!registration.thesisSubmittedAt;

  const renderStatusBadge = () => {
    if (status === "approved")
      return (
        <div className="flex items-center gap-2 px-4 py-2 bg-emerald-100 text-emerald-700 rounded-full font-bold text-sm border border-emerald-200">
          <CheckCircle size={18} /> Đủ Điều Kiện
        </div>
      );
    if (status === "rejected")
      return (
        <div className="flex items-center gap-2 px-4 py-2 bg-red-100 text-red-700 rounded-full font-bold text-sm border border-red-200">
          <AlertCircle size={18} /> Cần Sửa Lại
        </div>
      );
    if (status === "submitted")
      return (
        <div className="flex items-center gap-2 px-4 py-2 bg-indigo-100 text-indigo-700 rounded-full font-bold text-sm border border-indigo-200">
          <Clock size={18} /> Đã Nộp (Chờ Rà Soát)
        </div>
      );
    return (
      <div className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-600 rounded-full font-bold text-sm border border-gray-200">
        <Clock size={18} /> Đang Thực Hiện
      </div>
    );
  };

  return (
    <div className="space-y-8 text-black animate-in fade-in slide-in-from-bottom-4 duration-500 pb-10">
      {/* Header Styled like OutlineSubmission but Indigo/Purple Theme */}
      <div className="bg-purple-800 rounded-sm p-8 text-white shadow-xl shadow-indigo-200 relative overflow-hidden">
        <div className="relative z-10">
          <h2 className="text-3xl font-bold mb-2 flex items-center gap-3">
            <ShieldCheck className="text-indigo-300" /> Nộp Khóa Luận
          </h2>
          <p className="text-indigo-100 max-w-2xl text-lg">
            Nộp báo cáo toàn văn và mã nguồn để rà soát đạo văn trước khi bảo vệ
            trước Hội đồng.
          </p>
          {submissionMilestone && (
            <div className="mt-4 inline-flex items-center gap-2 bg-white/20 backdrop-blur-md px-4 py-2 rounded-lg text-sm font-medium border border-white/10">
              <Clock size={16} /> Thời gian nộp:{" "}
              {new Date(submissionMilestone.startDate).toLocaleDateString(
                "vi-VN"
              )}{" "}
              -{" "}
              {new Date(submissionMilestone.endDate).toLocaleDateString(
                "vi-VN"
              )}
            </div>
          )}
        </div>
        <div className="absolute top-0 right-0 -mr-10 -mt-10 w-64 h-64 bg-purple-500 opacity-20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 -ml-10 -mb-10 w-40 h-40 bg-indigo-500 opacity-20 rounded-full blur-2xl"></div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6 border border-gray-100">
          {isSubmitted && !showForm ? (
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="p-6 border-b border-gray-100 bg-gray-50/50 flex justify-between items-center">
                <h3 className="font-bold text-gray-800 text-lg flex items-center gap-2">
                  <FileText className="text-indigo-600" /> Hồ Sơ Khóa Luận
                </h3>
                {renderStatusBadge()}
              </div>

              <div className="p-8">
                {/* Timeline Visual - Indigo Theme */}
                <div className="flex items-center justify-between mb-8 relative">
                  <div className="absolute left-0 top-1/2 w-full h-1 bg-gray-100 -z-10 transform -translate-y-1/2"></div>
                  {/* Node 1: Submitted */}
                  <div className="flex flex-col items-center gap-2 bg-white px-2">
                    <div className="w-12 h-12 rounded-full bg-indigo-600 text-white flex items-center justify-center shadow-lg shadow-indigo-200 scale-110 border-4 border-white">
                      <UploadCloud size={20} />
                    </div>
                    <span className="text-xs font-bold text-indigo-700 mt-1">
                      Đã Nộp
                    </span>
                    <span className="text-[10px] text-gray-400">
                      {new Date(
                        registration.thesisSubmittedAt
                      ).toLocaleDateString("vi-VN")}
                    </span>
                  </div>
                  {/* Node 2: Checking */}
                  <div className="flex flex-col items-center gap-2 bg-white px-2">
                    <div
                      className={`w-12 h-12 rounded-full flex items-center justify-center shadow-lg border-4 border-white ${
                        status !== "submitted" && status !== "pending"
                          ? "bg-indigo-600 text-white shadow-indigo-200"
                          : "bg-orange-100 text-orange-500"
                      }`}
                    >
                      <Clock size={20} />
                    </div>
                    <span
                      className={`text-xs font-bold mt-1 ${
                        status !== "submitted" && status !== "pending"
                          ? "text-indigo-700"
                          : "text-orange-600"
                      }`}
                    >
                      Rà Soát
                    </span>
                  </div>
                  {/* Node 3: Result */}
                  <div className="flex flex-col items-center gap-2 bg-white px-2">
                    <div
                      className={`w-12 h-12 rounded-full flex items-center justify-center shadow-lg border-4 border-white ${
                        status === "approved"
                          ? "bg-emerald-500 text-white shadow-emerald-200"
                          : status === "rejected"
                          ? "bg-red-500 text-white shadow-red-200"
                          : "bg-gray-100 text-gray-400"
                      }`}
                    >
                      {status === "approved" ? (
                        <CheckCircle size={20} />
                      ) : status === "rejected" ? (
                        <X size={20} />
                      ) : (
                        <CheckCircle size={20} />
                      )}
                    </div>
                    <span
                      className={`text-xs font-bold mt-1 ${
                        status === "approved"
                          ? "text-emerald-700"
                          : status === "rejected"
                          ? "text-red-600"
                          : "text-gray-400"
                      }`}
                    >
                      Kết Quả
                    </span>
                  </div>
                </div>

                {/* Files Info - Distinct Look */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {registration.thesisFileUrl && (
                    <div className="bg-indigo-50/50 rounded-xl p-4 border border-indigo-100 flex flex-col justify-between group hover:border-indigo-300 transition-colors">
                      <div className="flex items-start gap-3 mb-2">
                        <div className="bg-white p-2.5 rounded-lg shadow-sm text-indigo-600">
                          <FileText size={24} />
                        </div>
                        <div>
                          <h4 className="font-bold text-gray-800 text-sm">
                            Báo cáo (PDF)
                          </h4>
                          <span className="text-xs text-indigo-500 font-medium">
                            Document
                          </span>
                        </div>
                      </div>
                      <a
                        href={registration.thesisFileUrl}
                        target="_blank"
                        className="text-xs text-indigo-700 bg-indigo-100/50 px-3 py-2 rounded-lg hover:bg-indigo-200 truncate block font-medium"
                      >
                        Xem tài liệu
                      </a>
                    </div>
                  )}
                  {registration.codeLink && (
                    <div className="bg-purple-50/50 rounded-xl p-4 border border-purple-100 flex flex-col justify-between group hover:border-purple-300 transition-colors">
                      <div className="flex items-start gap-3 mb-2">
                        <div className="bg-white p-2.5 rounded-lg shadow-sm text-purple-600">
                          <Monitor size={24} />
                        </div>
                        <div>
                          <h4 className="font-bold text-gray-800 text-sm">
                            Source Code
                          </h4>
                          <span className="text-xs text-purple-500 font-medium">
                            Repository
                          </span>
                        </div>
                      </div>
                      <a
                        href={registration.codeLink}
                        target="_blank"
                        className="text-xs text-purple-700 bg-purple-100/50 px-3 py-2 rounded-lg hover:bg-purple-200 truncate block font-medium"
                      >
                        Truy cập Link
                      </a>
                    </div>
                  )}
                </div>
              </div>

              {/* Re-submit Button */}
              {status !== "approved" && (
                <div className="bg-gray-50 px-8 py-4 border-t border-gray-100 flex justify-end">
                  <button
                    onClick={() => {
                      setShowForm(true);
                      setThesisFileUrl(registration.thesisFileUrl || "");
                      setCodeLink(registration.codeLink || "");
                    }}
                    className="text-sm font-bold text-indigo-600 hover:text-indigo-800 flex items-center gap-1 transition-colors bg-white border border-indigo-200 px-4 py-2 rounded-lg shadow-sm hover:shadow"
                  >
                    Nộp lại bản mới <ChevronRight size={16} />
                  </button>
                </div>
              )}
            </div>
          ) : (
            <>
              {!showForm ? (
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-12 text-center group">
                  <div className="w-24 h-24 bg-indigo-50 text-indigo-500 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                    <UploadCloud size={48} />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">
                    Chưa Nộp Khóa Luận
                  </h3>
                  <p className="text-gray-500 max-w-md mx-auto mb-8">
                    Vui lòng nộp đầy đủ Báo cáo và Source code để tiến hành rà
                    soát đạo văn.
                  </p>
                  <button
                    onClick={() => setShowForm(true)}
                    className="bg-indigo-600 text-white px-8 py-4 rounded-xl font-bold shadow-xl shadow-indigo-200 hover:bg-indigo-700 hover:shadow-indigo-300 transition-all transform hover:-translate-y-1 flex items-center gap-2 mx-auto"
                  >
                    <Send size={18} /> Bắt Đầu Nộp Bài
                  </button>
                </div>
              ) : (
                <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden animate-in zoom-in-95 duration-200">
                  <div className="px-8 py-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                    <h3 className="font-bold text-gray-800 text-lg">
                      Form Nộp Khóa Luận
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
                        File Báo Cáo (PDF){" "}
                        <span className="text-red-500">*</span>
                      </label>
                      <div className="border-2 border-dashed border-gray-300 rounded-xl p-1 hover:border-indigo-400 transition-colors bg-gray-50/50">
                        <FileUpload
                          onUploadComplete={handleUploadComplete}
                          maxFiles={1}
                        />
                      </div>
                      {thesisFileUrl && (
                        <div className="mt-3 flex items-center gap-2 text-sm text-green-600 bg-green-50 px-3 py-2 rounded-lg border border-green-100">
                          <CheckCircle size={16} /> File đã sẵn sàng: ...
                          {thesisFileUrl.slice(-20)}
                        </div>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2">
                        Link Source Code <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <Monitor
                          className="absolute left-3 top-3.5 text-gray-400"
                          size={20}
                        />
                        <input
                          type="url"
                          required
                          className="w-full pl-10 px-4 py-3 bg-white border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-purple-500 transition-all shadow-sm"
                          placeholder="https://github.com/..."
                          value={codeLink}
                          onChange={(e) => setCodeLink(e.target.value)}
                        />
                      </div>
                    </div>

                    <div className="flex justify-end gap-3 pt-4 border-t border-gray-100 mt-4">
                      <button
                        onClick={() => setShowForm(false)}
                        className="px-6 py-2.5 text-gray-600 font-bold hover:bg-gray-100 rounded-xl transition-colors"
                      >
                        Hủy Bỏ
                      </button>
                      <button
                        onClick={handleSubmit}
                        disabled={submitting}
                        className="px-8 py-2.5 bg-indigo-600 text-white font-bold rounded-xl shadow-lg shadow-indigo-200 hover:bg-indigo-700 transition-all flex items-center gap-2"
                      >
                        {submitting ? (
                          "Đang gửi..."
                        ) : (
                          <>
                            <Send size={18} /> Xác Nhận Nộp
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        <div className="space-y-6">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sticky top-24">
            <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
              <div className="w-1 h-6 bg-purple-500 rounded-full"></div>Quy Định
              Nộp Bài
            </h3>
            <ul className="space-y-4">
              <li className="flex gap-3 text-sm text-gray-600">
                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center text-xs font-bold border border-indigo-100">
                  1
                </span>
                <span className="pt-0.5">
                  Báo cáo phải định dạng PDF chuẩn.
                </span>
              </li>
              <li className="flex gap-3 text-sm text-gray-600">
                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center text-xs font-bold border border-indigo-100">
                  2
                </span>
                <span className="pt-0.5">
                  Mã nguồn phải đầy đủ và có thể chạy được.
                </span>
              </li>
              <li className="flex gap-3 text-sm text-gray-600">
                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center text-xs font-bold border border-indigo-100">
                  3
                </span>
                <span className="pt-0.5">
                  Đặt tên file theo cú pháp: MSSV_HoTen_BaoCao.
                </span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
