import React, { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import {
  Upload,
  FileText,
  Monitor,
  CheckCircle,
  AlertCircle,
  Clock,
} from "lucide-react";
import {
  mockThesisRegistrations,
  mockDefenseRegistrations,
  mockTopics,
} from "../../data/mockData";

const DefenseRegistration: React.FC = () => {
  const { profile } = useAuth();
  const [loading, setLoading] = useState(true);
  const [registration, setRegistration] = useState<any>(null);
  const [thesisRegistration, setThesisRegistration] = useState<any>(null);
  const [reportFile, setReportFile] = useState<string>("");
  const [presentationFile, setPresentationFile] = useState<string>("");
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState<{
    type: "success" | "error";
    content: string;
  } | null>(null);

  useEffect(() => {
    if (profile?.id) {
      fetchData();
    }
  }, [profile]);

  // ... inside component ...

  const fetchData = async () => {
    try {
      setLoading(true);

      // 1. Get Thesis Registration from Mock
      // Assuming profile.id matches studentId in mocks (e.g., 'st1') based on AuthContext logic
      const thesisReg = mockThesisRegistrations.find(
        (tr) => tr.studentId === profile?.id
      );

      if (!thesisReg) {
        setLoading(false);
        return;
      }

      // Enrich with topic title (mock relation)
      const topic = mockTopics.find((t) => t.id === thesisReg.topicId);
      const thesisRegWithTopic = {
        ...thesisReg,
        topic: { title: topic?.title || "Unknown Topic" },
      };

      setThesisRegistration(thesisRegWithTopic);

      // 2. Get Defense Registration from Mock
      const defenseReg = mockDefenseRegistrations.find(
        (dr) => dr.registrationId === thesisReg.id
      );

      if (defenseReg) {
        setRegistration(defenseReg);
        setReportFile(defenseReg.reportFileUrl || "");
        setPresentationFile(defenseReg.presentationFileUrl || "");
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);
    setSubmitting(true);

    try {
      // Simulate network delay
      await new Promise((resolve) => setTimeout(resolve, 1000));

      if (!thesisRegistration) throw new Error("Chưa đăng ký đề tài");

      const payload = {
        id: registration?.id || `dr_${Math.random().toString(36).substr(2, 9)}`,
        studentId: profile?.id!,
        registrationId: thesisRegistration.id,
        reportFileUrl: reportFile,
        presentationFileUrl: presentationFile,
        status: "pending",
        submittedAt: new Date().toISOString(),
        supervisorApproval: false,
        secretaryApproval: false,
      };

      if (registration) {
        // Update Mock Data
        const index = mockDefenseRegistrations.findIndex(
          (dr) => dr.id === registration.id
        );
        if (index !== -1) {
          mockDefenseRegistrations[index] = {
            ...mockDefenseRegistrations[index],
            ...payload,
          } as any;
        }
      } else {
        // Insert Mock Data
        mockDefenseRegistrations.push(payload as any);
      }

      setMessage({
        type: "success",
        content: "Đăng ký bảo vệ thành công! (Mock Data)",
      });
      fetchData(); // Refresh local state
    } catch (err: any) {
      setMessage({ type: "error", content: err.message || "Có lỗi xảy ra" });
    } finally {
      setSubmitting(false);
    }
  };

  if (loading)
    return (
      <div className="min-h-[400px] flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <span className="text-gray-500 font-medium">
            Đang tải thông tin...
          </span>
        </div>
      </div>
    );

  if (!thesisRegistration) {
    return (
      <div className="flex flex-col items-center justify-center py-16 px-4">
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8 max-w-lg w-full text-center relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-yellow-400 to-orange-500"></div>
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-yellow-50 mb-6">
            <AlertCircle size={40} className="text-yellow-500" />
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-2">
            Chưa đủ điều kiện
          </h3>
          <p className="text-gray-500 mb-6 leading-relaxed">
            Bạn chưa có đề tài được duyệt hoặc đang thực hiện. <br />
            Vui lòng hoàn thành bước <strong>Đăng ký đề tài</strong> trước khi
            đăng ký bảo vệ.
          </p>
        </div>
      </div>
    );
  }

  // Determine status color/icon
  const getStatusColor = (status: string) => {
    switch (status) {
      case "approved":
        return "bg-green-50 text-green-700 border-green-200";
      case "pending":
        return "bg-blue-50 text-blue-700 border-blue-200";
      case "rejected":
        return "bg-red-50 text-red-700 border-red-200";
      default:
        return "bg-gray-50 text-gray-700 border-gray-200";
    }
  };

  const statusMap: Record<string, string> = {
    approved: "Đã được duyệt",
    pending: "Đang chờ duyệt",
    rejected: "Bị từ chối",
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      {/* Header Section */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
          Đăng ký Bảo vệ Khóa luận
        </h1>
        <p className="mt-2 text-gray-600 max-w-2xl">
          Nộp hồ sơ báo cáo và slide thuyết trình để hội đồng xem xét điều kiện
          bảo vệ.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Thesis Info */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
              <h3 className="font-semibold text-gray-900">Thông tin Đề tài</h3>
            </div>
            <div className="p-6">
              <div className="mb-4">
                <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider block mb-1">
                  Đề tài
                </label>
                <p className="text-gray-900 font-medium leading-relaxed">
                  {thesisRegistration.topic?.title}
                </p>
              </div>
              <div className="mb-4">
                <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider block mb-1">
                  Ngày đăng ký
                </label>
                <p className="text-gray-700 font-medium">
                  {thesisRegistration.registeredAt}
                </p>
              </div>
              <div>
                <span
                  className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${
                    thesisRegistration.status.includes("approved") ||
                    thesisRegistration.status === "in_progress"
                      ? "bg-green-100 text-green-800 border-green-200"
                      : "bg-gray-100 text-gray-800 border-gray-200"
                  }`}
                >
                  {thesisRegistration.status}
                </span>
              </div>
            </div>
          </div>

          {/* Status Card (if registered) */}
          {registration && (
            <div
              className={`rounded-xl shadow-sm border p-6 ${getStatusColor(
                registration.status
              )}`}
            >
              <div className="flex items-center gap-3 mb-2">
                {registration.status === "approved" ? (
                  <CheckCircle className="flex-shrink-0" size={24} />
                ) : registration.status === "rejected" ? (
                  <AlertCircle className="flex-shrink-0" size={24} />
                ) : (
                  <Clock className="flex-shrink-0" size={24} />
                )}
                <h3 className="font-bold text-lg">
                  Trạng thái: {statusMap[registration.status]}
                </h3>
              </div>
              <p className="text-sm opacity-90 pl-9">
                {registration.status === "approved"
                  ? "Hồ sơ của bạn đã được chấp nhận. Vui lòng theo dõi lịch bảo vệ."
                  : registration.status === "pending"
                  ? "Hồ sơ đang được hội đồng xem xét."
                  : "Hồ sơ chưa đạt yêu cầu. Vui lòng cập nhật lại."}
              </p>
            </div>
          )}
        </div>

        {/* Right Column: Form */}
        <div className="lg:col-span-2">
          <div className="bg-white shadow-sm border border-gray-200 rounded-xl shadow-lg border border-gray-100 overflow-hidden">
            <div className="p-8">
              <h2 className="text-xl font-bold text-gray-900 mb-6">
                Nộp Hồ sơ
              </h2>

              {message && (
                <div
                  className={`p-4 rounded-lg mb-6 flex items-start gap-3 animate-in fade-in slide-in-from-top-2 ${
                    message.type === "success"
                      ? "bg-green-50 text-green-700 border border-green-200"
                      : "bg-red-50 text-red-700 border border-red-200"
                  }`}
                >
                  {message.type === "success" ? (
                    <CheckCircle size={20} className="mt-0.5 flex-shrink-0" />
                  ) : (
                    <AlertCircle size={20} className="mt-0.5 flex-shrink-0" />
                  )}
                  <div>
                    <p className="font-medium">
                      {message.type === "success" ? "Thành công" : "Lỗi"}
                    </p>
                    <p className="text-sm opacity-90">{message.content}</p>
                  </div>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-700">
                    Link Báo cáo (PDF) <span className="text-red-500">*</span>
                  </label>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FileText
                        className="text-gray-400 group-focus-within:text-blue-500 transition-colors"
                        size={20}
                      />
                    </div>
                    <input
                      type="url"
                      required
                      placeholder="https://example.com/report.pdf"
                      value={reportFile}
                      onChange={(e) => setReportFile(e.target.value)}
                      disabled={
                        registration?.status === "approved" || submitting
                      }
                      className="pl-10 block w-full rounded-xl border-gray-200 bg-gray-50 focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all py-3 disabled:opacity-60 disabled:cursor-not-allowed"
                    />
                  </div>
                  <p className="text-xs text-gray-500 flex items-center gap-1">
                    <span className="inline-block w-1.5 h-1.5 rounded-full bg-gray-400"></span>
                    Link đến file PDF báo cáo hoàn chỉnh trên Google Drive,
                    OneDrive, vv.
                  </p>
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-700">
                    Link Slide Thuyết trình (PPT/PDF){" "}
                    <span className="text-red-500">*</span>
                  </label>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Monitor
                        className="text-gray-400 group-focus-within:text-blue-500 transition-colors"
                        size={20}
                      />
                    </div>
                    <input
                      type="url"
                      required
                      placeholder="https://example.com/presentation.pptx"
                      value={presentationFile}
                      onChange={(e) => setPresentationFile(e.target.value)}
                      disabled={
                        registration?.status === "approved" || submitting
                      }
                      className="pl-10 block w-full rounded-xl border-gray-200 bg-gray-50 focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all py-3 disabled:opacity-60 disabled:cursor-not-allowed"
                    />
                  </div>
                  <p className="text-xs text-gray-500 flex items-center gap-1">
                    <span className="inline-block w-1.5 h-1.5 rounded-full bg-gray-400"></span>
                    Slides sẽ được trình chiếu trong buổi bảo vệ.
                  </p>
                </div>

                {(!registration || registration.status !== "approved") && (
                  <div className="pt-4 border-t border-gray-100 flex justify-end">
                    <button
                      type="submit"
                      disabled={submitting}
                      className="flex items-center justify-center gap-2 px-8 py-3 border border-transparent text-base font-semibold rounded-xl shadow-lg shadow-blue-500/30 text-white bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all transform hover:-translate-y-0.5 active:translate-y-0"
                    >
                      {submitting ? (
                        <>
                          <Clock className="animate-spin" size={20} />
                          Đang xử lý...
                        </>
                      ) : registration ? (
                        <>
                          <Upload size={20} />
                          Cập nhật đăng ký
                        </>
                      ) : (
                        <>
                          <Upload size={20} />
                          Gửi đăng ký
                        </>
                      )}
                    </button>
                  </div>
                )}
              </form>
            </div>
            {/* Decorative bottom pattern */}
            <div className="h-1.5 bg-gradient-to-r from-blue-500 via-purple-500 to-blue-500 opacity-20"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DefenseRegistration;
