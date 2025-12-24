"use client";
import React from "react";
import { gql } from "@apollo/client";
import { useQuery } from "@apollo/client/react";
import { useAuth } from "../../contexts/AuthContext";
import {
  Users,
  Mail,
  Phone,
  BookOpen,
  FileText,
  CheckCircle,
  AlertTriangle,
} from "lucide-react";
import { mockPlagiarismChecks } from "../../data/mockData";

const GET_TEACHER_REGISTRATIONS = gql`
  query TeacherRegistrations($teacherId: String!) {
    teacherRegistrations(teacherId: $teacherId) {
      id
      topicId
      studentId
      status
      registeredAt
      outlineSubmittedAt
      outlineFeedback
      thesisSubmittedAt
      codeLink
      score
      student {
        id
        code
        name
        class
      }
      topic {
        id
        code
        title
      }
    }
  }
`;

const StudentManagement: React.FC = () => {
  const { user } = useAuth();

  // State for Confirmation Modal
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [selectedReg, setSelectedReg] = React.useState<any>(null);
  const [advisorScore, setAdvisorScore] = React.useState<number | "">("");
  const [confirmStep, setConfirmStep] = React.useState<"check" | "score">(
    "check"
  );

  const { data, loading, error } = useQuery<any>(GET_TEACHER_REGISTRATIONS, {
    variables: { teacherId: user?.profileId },
    skip: !user?.profileId,
  });

  const myStudents = data?.teacherRegistrations || [];

  const getStatusInfo = (status: string) => {
    switch (status) {
      case "registered":
        return { text: "Đã đăng ký", color: "bg-yellow-100 text-yellow-800" };
      case "outline_pending":
      case "pending": // Outline submitted but pending review mapping
        return {
          text: "Chờ duyệt đề cương",
          color: "bg-blue-100 text-blue-800",
        };
      case "outline_rejected":
        return {
          text: "Đề cương bị từ chối",
          color: "bg-red-100 text-red-800",
        };
      case "outline_approved":
        return {
          text: "Đề cương đã duyệt",
          color: "bg-green-100 text-green-800",
        };
      case "in_progress":
        return {
          text: "Đang thực hiện",
          color: "bg-purple-100 text-purple-800",
        };
      case "thesis_submitted":
      case "submitted":
        return { text: "Đã nộp khóa luận", color: "bg-teal-100 text-teal-800" };
      case "graded":
      case "thesis_approved":
        return { text: "Đã chấm điểm", color: "bg-gray-100 text-gray-800" };
      default:
        return { text: status, color: "bg-gray-100 text-gray-800" };
    }
  };

  if (loading) return <div className="p-6">Đang tải dữ liệu...</div>;
  if (error)
    return <div className="p-6 text-red-500">Lỗi: {error.message}</div>;

  // Mock data for Plagiarism (In a real app, this would come from props or API)
  const getPlagiarismResult = (studentId: string) => {
    const check = mockPlagiarismChecks.find((p) => p.studentId === studentId);
    if (!check) return { status: "pending", percentage: 0 };
    return { status: check.status, percentage: check.similarityPercentage };
  };

  const handleOpenConfirm = (reg: any) => {
    setSelectedReg(reg);
    setAdvisorScore(reg.score || "");
    setConfirmStep("check");
    setIsModalOpen(true);
  };

  const handleConfirmDefense = () => {
    if (
      advisorScore === "" ||
      Number(advisorScore) < 0 ||
      Number(advisorScore) > 10
    ) {
      alert("Vui lòng nhập điểm hợp lệ (0-10).");
      return;
    }

    if (confirm("Xác nhận sinh viên này đủ điều kiện bảo vệ?")) {
      // Update local state (mock)
      alert(
        `Đã xác nhận sinh viên ${selectedReg.student?.name} đủ điều kiện bảo vệ! Điểm: ${advisorScore}`
      );
      setIsModalOpen(false);
    }
  };

  const handleRejectDefense = () => {
    const reason = prompt("Nhập lý do từ chối (sinh viên sẽ phải sửa lại):");
    if (reason) {
      alert(`Đã gửi yêu cầu chỉnh sửa cho sinh viên. Lý do: ${reason}`);
      setIsModalOpen(false);
    }
  };

  // Calculate stats
  const stats = {
    total: myStudents.length,
    pending: myStudents.filter(
      (s: any) =>
        s.status === "outline_pending" ||
        s.status === "pending" ||
        s.status === "submitted"
    ).length,
    approved: myStudents.filter(
      (s: any) =>
        s.status === "outline_approved" ||
        s.status === "thesis_approved" ||
        s.status === "graded"
    ).length,
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Header Section */}
      <div className="bg-blue-600 rounded-sm p-8 text-white shadow-lg relative overflow-hidden">
        <div className="relative z-10 flex justify-between items-end">
          <div>
            <h2 className="text-3xl font-bold mb-2">Quản lý Sinh viên</h2>
            <p className="text-blue-100 max-w-2xl">
              Theo dõi tiến độ, phê duyệt đề cương và chấm điểm khóa luận cho
              các sinh viên bạn đang hướng dẫn.
            </p>
          </div>
          <div className="hidden md:block bg-white/10 backdrop-blur-md px-4 py-2 rounded-lg border border-white/20">
            <div className="flex items-center gap-2 text-sm font-medium">
              <Users size={18} />
              <span>Tổng số: {stats.total} sinh viên</span>
            </div>
          </div>
        </div>
        {/* Abstract Background Element */}
        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-64 h-64 bg-white/10 rounded-full blur-3xl pointer-events-none"></div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <div className="bg-blue-50 p-3 rounded-lg text-blue-600">
              <Users size={24} />
            </div>
            <span className="text-2xl font-bold text-gray-800">
              {stats.total}
            </span>
          </div>
          <p className="text-sm text-gray-500 font-medium">
            Tổng sinh viên hướng dẫn
          </p>
        </div>
        <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <div className="bg-yellow-50 p-3 rounded-lg text-yellow-600">
              <AlertTriangle size={24} />
            </div>
            <span className="text-2xl font-bold text-gray-800">
              {stats.pending}
            </span>
          </div>
          <p className="text-sm text-gray-500 font-medium">
            Cần xử lý (Duyệt/Chấm)
          </p>
        </div>
        <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <div className="bg-green-50 p-3 rounded-lg text-green-600">
              <CheckCircle size={24} />
            </div>
            <span className="text-2xl font-bold text-gray-800">
              {stats.approved}
            </span>
          </div>
          <p className="text-sm text-gray-500 font-medium">
            Đã hoàn thành/Duyệt
          </p>
        </div>
      </div>

      {/* Student List */}
      <div className="space-y-4">
        <h3 className="text-xl font-bold text-gray-800 px-1">
          Danh sách chi tiết
        </h3>

        {myStudents.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-2xl border border-dashed border-gray-300">
            <Users size={64} className="mx-auto text-gray-300 mb-4" />
            <h4 className="text-lg font-medium text-gray-900">
              Chưa có sinh viên đăng ký
            </h4>
            <p className="text-gray-500 max-w-md mx-auto mt-2">
              Các sinh viên đăng ký đề tài của bạn sẽ xuất hiện tại đây.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6">
            {myStudents.map((item: any) => {
              const statusInfo = getStatusInfo(item.status);
              const canConfirm = item.status === "submitted";

              return (
                <div
                  key={item.id}
                  className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 group"
                >
                  <div className="flex flex-col md:flex-row gap-6">
                    {/* Left: Student Info */}
                    <div className="flex items-start gap-4 min-w-[300px]">
                      <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-2xl font-bold shadow-lg shadow-indigo-200">
                        {item.student?.name?.charAt(0) || "?"}
                      </div>
                      <div>
                        <h4 className="text-lg font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
                          {item.student?.name}
                        </h4>
                        <div className="flex flex-col gap-1 mt-1">
                          <span className="text-sm font-semibold text-gray-600 bg-gray-100 px-2 py-0.5 rounded-md w-fit">
                            {item.student?.code}
                          </span>
                          <span className="text-sm text-gray-500">
                            Lớp: {item.student?.class}
                          </span>
                        </div>
                        <div className="flex gap-3 mt-3">
                          <a
                            href={`mailto:${item.student?.email}`}
                            className="text-gray-400 hover:text-blue-600 transition-colors"
                            title="Gửi Email"
                          >
                            <Mail size={16} />
                          </a>
                          <a
                            href={`tel:${item.student?.phone}`}
                            className="text-gray-400 hover:text-green-600 transition-colors"
                            title="Gọi điện"
                          >
                            <Phone size={16} />
                          </a>
                        </div>
                      </div>
                    </div>

                    {/* Middle: Topic & Progress */}
                    <div className="flex-1 border-l border-gray-100 pl-0 md:pl-6 pt-4 md:pt-0 border-t md:border-t-0">
                      <div className="mb-4">
                        <div className="flex items-center gap-2 mb-1">
                          <BookOpen size={16} className="text-blue-500" />
                          <span className="text-xs font-bold text-blue-600 uppercase tracking-wide">
                            Đề tài
                          </span>
                        </div>
                        <h5 className="font-bold text-gray-800 text-base leading-snug">
                          {item.topic?.title}
                        </h5>
                        <p className="text-xs text-gray-500 font-mono mt-1">
                          Mã ĐT: {item.topic?.code}
                        </p>
                      </div>

                      <div className="grid grid-cols-2 gap-4 text-sm mt-4">
                        <div className="bg-gray-50 p-3 rounded-lg">
                          <p className="text-xs text-gray-500 mb-1">
                            Ngày đăng ký
                          </p>
                          <p className="font-medium text-gray-900">
                            {new Date(item.registeredAt).toLocaleDateString(
                              "vi-VN"
                            )}
                          </p>
                        </div>
                        {item.thesisSubmittedAt ? (
                          <div className="bg-green-50 p-3 rounded-lg border border-green-100">
                            <p className="text-xs text-green-600 mb-1">
                              Đã nộp Khóa luận
                            </p>
                            <p className="font-medium text-green-900">
                              {new Date(
                                item.thesisSubmittedAt
                              ).toLocaleDateString("vi-VN")}
                            </p>
                          </div>
                        ) : item.outlineSubmittedAt ? (
                          <div className="bg-blue-50 p-3 rounded-lg border border-blue-100">
                            <p className="text-xs text-blue-600 mb-1">
                              Nộp Đề cương
                            </p>
                            <p className="font-medium text-blue-900">
                              {new Date(
                                item.outlineSubmittedAt
                              ).toLocaleDateString("vi-VN")}
                            </p>
                          </div>
                        ) : (
                          <div className="bg-gray-50 p-3 rounded-lg">
                            <p className="text-xs text-gray-400 mb-1">
                              Trạng thái nộp
                            </p>
                            <p className="font-medium text-gray-500 text-xs italic">
                              Chưa nộp bài
                            </p>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Right: Status & Action */}
                    <div className="flex flex-col items-end justify-between min-w-[150px] border-l border-gray-100 pl-0 md:pl-6 pt-4 md:pt-0 border-t md:border-t-0">
                      <div
                        className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 ${statusInfo.color}`}
                      >
                        {item.status.includes("approved") ||
                        item.status === "graded" ? (
                          <CheckCircle size={14} />
                        ) : (
                          <AlertTriangle size={14} />
                        )}
                        {statusInfo.text}
                      </div>

                      {item.score !== null && item.score !== undefined && (
                        <div className="mt-4 text-right">
                          <p className="text-xs text-gray-500 uppercase tracking-wide">
                            Điểm hướng dẫn
                          </p>
                          <p className="text-3xl font-extrabold text-green-600">
                            {item.score}
                          </p>
                        </div>
                      )}

                      <div className="mt-auto pt-4 w-full">
                        {canConfirm ? (
                          <button
                            onClick={() => handleOpenConfirm(item)}
                            className="w-full py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg font-medium shadow-md hover:shadow-lg hover:from-blue-700 hover:to-indigo-700 transition-all flex items-center justify-center gap-2 text-sm"
                          >
                            <CheckCircle size={16} />
                            Xác nhận Bảo vệ
                          </button>
                        ) : (
                          <div className="text-center">
                            {item.codeLink && (
                              <a
                                href={item.codeLink}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-xs text-indigo-600 hover:underline font-medium flex items-center justify-end gap-1"
                              >
                                Xem Source Code <FileText size={12} />
                              </a>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {item.outlineFeedback && (
                    <div className="mt-5 pt-4 border-t border-gray-100 bg-gray-50/50 -mx-6 -mb-6 px-6 py-4 rounded-b-xl">
                      <div className="flex gap-3">
                        <FileText
                          size={18}
                          className="text-gray-400 mt-0.5 shrink-0"
                        />
                        <div>
                          <p className="text-xs font-bold text-gray-500 uppercase mb-1">
                            Ghi chú / Nhận xét của bạn
                          </p>
                          <p className="text-sm text-gray-700 leading-relaxed italic">
                            "{item.outlineFeedback}"
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Confirmation Modal */}
      {isModalOpen && selectedReg && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-sm shadow-2xl w-full max-w-lg overflow-hidden animate-in zoom-in-95 duration-200 border border-gray-100">
            <div className="bg-gradient-to-r from-gray-50 to-white px-6 py-4 border-b border-gray-100 flex justify-between items-center">
              <h3 className="text-lg font-bold text-gray-800">
                Xác nhận Đủ điều kiện Bảo vệ
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-2 hover:bg-gray-100 rounded-full text-gray-400 hover:text-gray-600 transition"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M18 6 6 18" />
                  <path d="m6 6 12 12" />
                </svg>
              </button>
            </div>

            <div className="p-6">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-xl">
                  {selectedReg.student?.name.charAt(0)}
                </div>
                <div>
                  <h4 className="font-bold text-gray-900 text-lg">
                    {selectedReg.student?.name}
                  </h4>
                  <p className="text-sm text-gray-500 line-clamp-1">
                    {selectedReg.topic?.title}
                  </p>
                </div>
              </div>

              <div className="space-y-3 bg-gray-50 p-4 rounded-xl border border-gray-100 mb-6">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600 font-medium">
                    Trạng thái nộp:
                  </span>
                  <span className="flex items-center text-green-600 font-bold bg-green-50 px-2 py-0.5 rounded-md">
                    <CheckCircle size={14} className="mr-1" /> Đã nộp đủ tài
                    liệu
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600 font-medium">
                    Kiểm tra Đạo văn:
                  </span>
                  {getPlagiarismResult(selectedReg.studentId).percentage <
                  20 ? (
                    <span className="flex items-center text-green-600 font-bold">
                      <CheckCircle size={14} className="mr-1" /> Đạt (
                      {getPlagiarismResult(selectedReg.studentId).percentage}%)
                    </span>
                  ) : (
                    <span className="flex items-center text-red-600 font-bold">
                      <AlertTriangle size={14} className="mr-1" /> Cảnh báo (
                      {getPlagiarismResult(selectedReg.studentId).percentage}%)
                    </span>
                  )}
                </div>
              </div>

              <div className="mb-6">
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  Chấm điểm hoàn thành (0-10)
                </label>
                <div className="relative">
                  <input
                    type="number"
                    min="0"
                    max="10"
                    step="0.1"
                    value={advisorScore}
                    onChange={(e) =>
                      setAdvisorScore(
                        e.target.value === "" ? "" : Number(e.target.value)
                      )
                    }
                    className="w-full pl-4 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition text-lg font-semibold text-gray-800"
                    placeholder="Nhập điểm..."
                  />
                  <div className="absolute right-3 top-3.5 text-gray-400 text-sm font-medium">
                    / 10
                  </div>
                </div>
                <p className="text-xs text-gray-500 mt-2">
                  * Điểm này sẽ không được tính vào điểm tổng kết cuối cùng.
                </p>
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  onClick={handleRejectDefense}
                  className="px-6 py-2.5 border border-red-200 text-red-600 rounded-xl hover:bg-red-50 font-semibold transition"
                >
                  Yêu cầu sửa lại
                </button>
                <button
                  onClick={handleConfirmDefense}
                  disabled={advisorScore === ""}
                  className="flex-1 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:from-blue-700 hover:to-indigo-700 font-bold disabled:opacity-50 disabled:cursor-not-allowed transition shadow-lg shadow-blue-200"
                >
                  Xác nhận Đủ ĐK Bảo vệ
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StudentManagement;
