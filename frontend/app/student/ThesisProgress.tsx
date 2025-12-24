"use client";
import React, { useState } from "react";
import { gql } from "@apollo/client";
import { useQuery, useMutation } from "@apollo/client/react";
import { useAuth } from "../../contexts/AuthContext";
import {
  TrendingUp,
  CheckCircle,
  Clock,
  AlertTriangle,
  Link as LinkIcon,
  Plus,
  History,
} from "lucide-react";
// Remove mockRegistrations, mockTopics import
// Keep ProgressReport interface if needed, or define locally
interface ProgressReport {
  id: string;
  registrationId: string;
  title: string;
  content: string;
  planNext: string;
  fileUrl?: string;
  submittedAt: string;
  status: "pending" | "approved" | "rejected";
  feedback?: string;
}

const ThesisProgress: React.FC = () => {
  const { user } = useAuth();

  // Fetch active period for deadlines
  const GET_ACTIVE_PERIOD_PROGRESS = gql`
    query GetActivePeriodProgress {
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

  const GET_MY_PROGRESS = gql`
    query GetMyProgress($studentId: String!) {
      myRegistrations(studentId: $studentId) {
        id
        status
        topic {
          id
          title
          code
        }
      }
    }
  `;

  const GET_MY_PROGRESS_REPORTS = gql`
    query GetMyProgressReports($registrationId: String!) {
      myProgressReports(registrationId: $registrationId) {
        id
        title
        content
        planNext
        submittedAt
        status
        feedback
        fileUrl
      }
    }
  `;

  const CREATE_PROGRESS_REPORT = gql`
    mutation CreateProgressReport($input: CreateProgressReportInput!) {
      createProgressReport(input: $input) {
        id
        title
        status
        submittedAt
      }
    }
  `;

  const GET_TIMELINES = gql`
    query GetTimelines($registrationId: String!) {
      timelines(registrationId: $registrationId) {
        id
        milestone
        description
        dueDate
        status
        completedAt
      }
    }
  `;

  const { data: periodData } = useQuery<any>(GET_ACTIVE_PERIOD_PROGRESS);
  const activePeriod = periodData?.thesisPeriods?.find(
    (p: any) => p.status === "active"
  );

  const { data: progressData, loading: progressLoading } = useQuery<any>(
    GET_MY_PROGRESS,
    {
      variables: { studentId: user?.profileId },
      skip: !user?.profileId,
    }
  );

  const myRegistration = progressData?.myRegistrations?.[0];
  const myTopic = myRegistration?.topic;

  const { data: reportsData, refetch: refetchReports } = useQuery<any>(
    GET_MY_PROGRESS_REPORTS,
    {
      variables: { registrationId: myRegistration?.id },
      skip: !myRegistration?.id,
    }
  );

  const { data: timelineData } = useQuery<{ timelines: any[] }>(GET_TIMELINES, {
    variables: { registrationId: myRegistration?.id },
    skip: !myRegistration?.id,
  });

  const [createProgressReport] = useMutation(CREATE_PROGRESS_REPORT);

  const reports: ProgressReport[] = reportsData?.myProgressReports || [];
  const myTimelines = timelineData?.timelines || [];

  // Progress Reporting State
  const [showReportForm, setShowReportForm] = useState(false);
  const [reportData, setReportData] = useState({
    title: "",
    content: "",
    planNext: "",
    fileLink: "",
  });

  const handleCreateReport = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!myRegistration) return;
    if (!["in_progress", "outline_approved"].includes(myRegistration.status)) {
      alert(
        "Bạn chỉ có thể nộp báo cáo khi đề tài đang thực hiện hoặc đã duyệt đề cương."
      );
      return;
    }

    if (!reportData.title || !reportData.content || !reportData.planNext) {
      alert("Vui lòng điền đầy đủ thông tin báo cáo.");
      return;
    }

    try {
      await createProgressReport({
        variables: {
          input: {
            registrationId: myRegistration.id,
            title: reportData.title,
            content: reportData.content,
            planNext: reportData.planNext,
            fileUrl: reportData.fileLink || undefined,
          },
        },
      });
      alert("Nộp báo cáo tiến độ thành công!");
      setReportData({ title: "", content: "", planNext: "", fileLink: "" });
      setShowReportForm(false);
      refetchReports();
    } catch (err: any) {
      alert("Lỗi khi nộp báo cáo: " + err.message);
      console.log(err);
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
    myRegistration.status === "submitted" ||
    myRegistration.status === "defense_ready" ||
    myRegistration.status === "defended" ||
    myRegistration.status === "completed";

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-10">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="bg-white p-3 rounded-xl shadow-sm border border-gray-100">
            <TrendingUp size={28} className="text-indigo-600" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-800">
              Theo dõi tiến độ
            </h2>
            <p className="text-sm text-gray-500">
              Quản lý và báo cáo tiến độ thực hiện khóa luận
            </p>
          </div>
        </div>
      </div>

      {/* Topic Card */}
      <div className="relative overflow-hidden bg-gradient-to-r from-indigo-600 to-purple-700 rounded-2xl shadow-lg text-white p-6 md:p-8">
        <div className="absolute top-0 right-0 p-4 opacity-10">
          <TrendingUp size={120} />
        </div>
        <div className="relative z-10">
          <div className="flex items-center space-x-3 mb-2 opacity-90">
            <span className="px-2.5 py-0.5 rounded-full bg-white/20 text-xs font-semibold backdrop-blur-sm border border-white/10">
              {myTopic?.code || "Chưa có mã"}
            </span>
            <span className="text-sm font-medium tracking-wide uppercase">
              Đề tài hiện tại
            </span>
          </div>
          <h3 className="text-2xl md:text-3xl font-bold mb-4 leading-tight">
            {myTopic?.title}
          </h3>
          <div className="flex flex-wrap items-center gap-3">
            {myRegistration.status === "in_progress" && (
              <span className="flex items-center gap-1.5 px-3 py-1.5 bg-green-500/20 border border-green-400/30 rounded-lg text-sm font-medium text-green-100">
                <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                Đang thực hiện
              </span>
            )}
            {isSubmitted && (
              <span className="px-3 py-1.5 bg-blue-500/20 border border-blue-400/30 rounded-lg text-sm font-medium text-blue-100">
                Đã nộp
              </span>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Periodic Reports */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
              <History className="text-indigo-600" size={20} />
              Lịch sử báo cáo
            </h3>
            <button
              onClick={() => setShowReportForm(!showReportForm)}
              disabled={
                !["in_progress", "outline_approved"].includes(
                  myRegistration.status
                )
              }
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all shadow-sm ${
                ["in_progress", "outline_approved"].includes(
                  myRegistration.status
                )
                  ? "bg-indigo-600 text-white hover:bg-indigo-700 hover:shadow-md hover:-translate-y-0.5"
                  : "bg-gray-100 text-gray-400 cursor-not-allowed"
              }`}
            >
              {showReportForm ? "Hủy báo cáo" : "Viết báo cáo mới"}
              {!showReportForm && <Plus size={18} />}
            </button>
          </div>

          {/* Report Form */}
          {showReportForm && (
            <div className="bg-white border border-indigo-100 rounded-2xl shadow-lg p-6 animate-in slide-in-from-top-4 duration-300">
              <h4 className="font-bold text-gray-800 mb-4 text-lg">
                Nộp báo cáo tiến độ mới
              </h4>
              <form onSubmit={handleCreateReport} className="space-y-5">
                <div className="space-y-1.5">
                  <label className="text-sm font-semibold text-gray-700">
                    Tiêu đề báo cáo
                  </label>
                  <input
                    required
                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
                    placeholder="Ví dụ: Báo cáo tuần 5 - Xây dựng cơ sở dữ liệu"
                    value={reportData.title}
                    onChange={(e) =>
                      setReportData({ ...reportData, title: e.target.value })
                    }
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div className="space-y-1.5">
                    <label className="text-sm font-semibold text-gray-700">
                      Công việc đã làm
                    </label>
                    <textarea
                      required
                      rows={4}
                      className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all resize-none"
                      placeholder="- Đã hoàn thành ERD..."
                      value={reportData.content}
                      onChange={(e) =>
                        setReportData({
                          ...reportData,
                          content: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-sm font-semibold text-gray-700">
                      Kế hoạch tiếp theo
                    </label>
                    <textarea
                      required
                      rows={4}
                      className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all resize-none"
                      placeholder="- Code API..."
                      value={reportData.planNext}
                      onChange={(e) =>
                        setReportData({
                          ...reportData,
                          planNext: e.target.value,
                        })
                      }
                    />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm font-semibold text-gray-700">
                    Link tài liệu (Google Drive/Github)
                  </label>
                  <div className="relative">
                    <LinkIcon
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                      size={18}
                    />
                    <input
                      type="url"
                      className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
                      placeholder="https://..."
                      value={reportData.fileLink}
                      onChange={(e) =>
                        setReportData({
                          ...reportData,
                          fileLink: e.target.value,
                        })
                      }
                    />
                  </div>
                </div>
                <div className="flex justify-end pt-2">
                  <button
                    type="submit"
                    className="px-6 py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-semibold shadow-lg shadow-indigo-200 hover:shadow-indigo-300 hover:-translate-y-0.5 transition-all duration-200"
                  >
                    Gửi báo cáo
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Reports Timeline List */}
          <div className="relative pl-8 border-l-2 border-indigo-100 space-y-8 py-2">
            {reports.length > 0 ? (
              reports.map((report, index) => (
                <div
                  key={report.id}
                  className="relative animate-in slide-in-from-left-4 duration-500"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  {/* Dot */}
                  <div className="absolute -left-[41px] top-4 w-5 h-5 rounded-full border-4 border-indigo-50 bg-indigo-600" />

                  <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 hover:shadow-md transition-all group">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
                      <div>
                        <h5 className="text-lg font-bold text-gray-800 group-hover:text-indigo-700 transition-colors">
                          {report.title}
                        </h5>
                        <p className="text-xs text-gray-500 font-medium flex items-center gap-1.5 mt-1">
                          <Clock size={14} />
                          {new Date(report.submittedAt).toLocaleDateString(
                            "vi-VN",
                            {
                              weekday: "long",
                              year: "numeric",
                              month: "long",
                              day: "numeric",
                            }
                          )}
                        </p>
                      </div>
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold capitalize border ${
                          report.status === "approved"
                            ? "bg-green-50 text-green-700 border-green-200"
                            : report.status === "rejected"
                            ? "bg-red-50 text-red-700 border-red-200"
                            : "bg-amber-50 text-amber-700 border-amber-200"
                        }`}
                      >
                        {report.status === "approved"
                          ? "Đã duyệt"
                          : report.status === "rejected"
                          ? "Yêu cầu sửa"
                          : "Chờ duyệt"}
                      </span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600 bg-gray-50/50 p-4 rounded-xl">
                      <div>
                        <strong className="text-gray-900 block mb-1">
                          Đã thực hiện:
                        </strong>
                        <p className="whitespace-pre-wrap">{report.content}</p>
                      </div>
                      <div>
                        <strong className="text-gray-900 block mb-1">
                          Kế hoạch tiếp theo:
                        </strong>
                        <p className="whitespace-pre-wrap">{report.planNext}</p>
                      </div>
                    </div>

                    {(report.fileUrl || report.feedback) && (
                      <div className="mt-4 pt-4 border-t border-gray-100 flex flex-col gap-3">
                        {report.fileUrl && (
                          <a
                            href={report.fileUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="flex items-center gap-2 text-sm font-medium text-indigo-600 hover:text-indigo-700 hover:underline w-fit"
                          >
                            <LinkIcon size={16} /> Xem tài liệu đính kèm
                          </a>
                        )}
                        {report.feedback && (
                          <div className="bg-green-50 border border-green-100 px-4 py-3 rounded-xl">
                            <p className="text-xs font-bold text-green-800 mb-1 uppercase tracking-wider">
                              Nhận xét của giảng viên
                            </p>
                            <p className="text-sm text-gray-700">
                              {report.feedback}
                            </p>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <div className="ml-4 p-8 text-center bg-gray-50 rounded-2xl border border-dashed border-gray-200">
                <History className="mx-auto text-gray-300 mb-2" size={32} />
                <p className="text-gray-500">
                  Chưa có báo cáo nào được ghi nhận.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Timeline & Stats */}
        <div className="space-y-6">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 sticky top-6">
            <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
              <CheckCircle className="text-green-600" size={20} />
              Mốc thời gian
            </h3>

            {myTimelines.length > 0 ? (
              <div className="space-y-6 relative pl-4 border-l-2 border-gray-100">
                {/* Render timelines basically if needed, refined style */}
                {myTimelines.map((tl: any) => (
                  <div key={tl.id} className="relative pl-4">
                    <div
                      className={`absolute -left-[21px] top-1 w-3 h-3 rounded-full border-2 border-white ring-1 ${
                        tl.status === "completed"
                          ? "bg-green-500 ring-green-200"
                          : "bg-gray-300 ring-gray-200"
                      }`}
                    />
                    <p className="text-sm font-semibold text-gray-800">
                      {tl.milestone}
                    </p>
                    <p className="text-xs text-gray-500 mb-1">{tl.dueDate}</p>
                    <span className="text-xs px-2 py-0.5 bg-gray-100 text-gray-600 rounded">
                      {tl.status === "completed" ? "Hoàn thành" : "Đang chờ"}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-400 text-sm">
                Chưa có mốc thời gian cụ thể.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ThesisProgress;
