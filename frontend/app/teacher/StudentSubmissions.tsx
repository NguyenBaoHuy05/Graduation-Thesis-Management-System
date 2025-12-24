"use client";

import { useState } from "react";
import { gql } from "@apollo/client";
import { useQuery, useMutation } from "@apollo/client/react";
import { useAuth } from "@/contexts/AuthContext";
import {
  FileText,
  CheckCircle,
  Clock,
  AlertCircle,
  Filter,
  Check,
  X,
  Download,
} from "lucide-react";

// --- GraphQL Operations ---
const GET_TEACHER_REGISTRATIONS = gql`
  query TeacherRegistrations($teacherId: String!) {
    teacherRegistrations(teacherId: $teacherId) {
      id
      topicId
      studentId
      status
      outlineFileUrl
      outlineSubmittedAt
      outlineFeedback
      thesisFileUrl
      thesisSubmittedAt
      codeLink
      score
      student {
        code
        name
      }
    }
  }
`;

const REVIEW_OUTLINE = gql`
  mutation ReviewOutline(
    $registrationId: String!
    $status: String!
    $feedback: String!
  ) {
    reviewOutline(
      registrationId: $registrationId
      status: $status
      feedback: $feedback
    ) {
      id
      status
      outlineFeedback
    }
  }
`;

const REVIEW_THESIS = gql`
  mutation ReviewThesis($registrationId: String!, $status: String!) {
    reviewThesis(registrationId: $registrationId, status: $status) {
      id
      status
    }
  }
`;

// Helper: map type to Vietnamese label
const typeLabels: Record<string, string> = {
  outline: "Đề Cương",
  thesis: "Khóa Luận",
};

export default function StudentSubmissions() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<"outlines" | "theses">("outlines");
  const [selectedItem, setSelectedItem] = useState<any | null>(null);
  const [feedback, setFeedback] = useState("");

  const { data, loading, error, refetch } = useQuery<any>(
    GET_TEACHER_REGISTRATIONS,
    {
      variables: { teacherId: user?.profileId },
      skip: !user?.profileId,
    }
  );

  const [reviewOutline] = useMutation(REVIEW_OUTLINE, {
    onCompleted: () => {
      setSelectedItem(null);
      setFeedback("");
      refetch();
      alert("Đã duyệt đề cương thành công!");
    },
    onError: (err) => alert("Lỗi: " + err.message),
  });

  const [reviewThesis] = useMutation(REVIEW_THESIS, {
    onCompleted: () => {
      setSelectedItem(null);
      refetch();
      alert("Đã xác nhận khóa luận thành công!");
    },
    onError: (err) => alert("Lỗi: " + err.message),
  });

  // --- Process Data for List ---
  const registrations = data?.teacherRegistrations || [];
  let submissions: any[] = [];

  registrations.forEach((reg: any) => {
    // 1. Outline Submission
    if (reg.outlineSubmittedAt) {
      let status = "pending";
      if (reg.status === "outline_approved") status = "approved";
      else if (reg.status === "outline_rejected") status = "rejected";
      else if (reg.outlineFeedback) status = "rejected";

      submissions.push({
        id: reg.id,
        uniqueId: reg.id + "_outline",
        type: "outline",
        title: "Đề Cương Chi Tiết",
        studentId: reg.studentId,
        studentCode: reg.student?.code || "N/A",
        studentName: reg.student?.name || "N/A",
        description: reg.outlineFeedback ? "Đã có nhận xét" : "Chờ duyệt",
        fileUrl: reg.outlineFileUrl,
        submittedAt: reg.outlineSubmittedAt,
        feedback: reg.outlineFeedback,
        status: status,
        originalStatus: reg.status,
      });
    }

    // 2. Thesis Submission
    if (reg.thesisSubmittedAt) {
      let status = "pending";
      if (reg.status === "defense_ready" || reg.status === "thesis_approved")
        status = "approved";
      else if (reg.status === "thesis_rejected") status = "rejected";

      submissions.push({
        id: reg.id,
        uniqueId: reg.id + "_thesis",
        type: "thesis",
        title: "Khóa Luận Hoàn Chỉnh",
        studentId: reg.studentId,
        studentCode: reg.student?.code || "N/A",
        studentName: reg.student?.name || "N/A",
        description: `Link code: ${reg.codeLink || "Không có"}`,
        fileUrl: reg.thesisFileUrl,
        submittedAt: reg.thesisSubmittedAt,
        status: status,
        originalStatus: reg.status,
        score: reg.score,
      });
    }
  });

  // Filter Logic based on Active Tab
  const currentItems = submissions.filter((sub) => {
    if (activeTab === "outlines") return sub.type === "outline";
    if (activeTab === "theses") return sub.type === "thesis";
    return false;
  });

  const handleApprove = () => {
    if (!selectedItem) return;
    if (selectedItem.type === "outline") {
      reviewOutline({
        variables: {
          registrationId: selectedItem.id,
          status: "outline_approved",
          feedback: feedback || "Đã duyệt",
        },
      });
    } else {
      reviewThesis({
        variables: {
          registrationId: selectedItem.id,
          status: "defense_ready",
        },
      });
    }
  };

  const handleReject = () => {
    if (!selectedItem) return;
    if (selectedItem.type === "outline") {
      reviewOutline({
        variables: {
          registrationId: selectedItem.id,
          status: "outline_rejected",
          feedback: feedback,
        },
      });
    }
  };

  if (loading)
    return <div className="p-8 text-center">Đang tải dữ liệu...</div>;
  if (error)
    return (
      <div className="p-8 text-center text-red-500">Lỗi: {error.message}</div>
    );

  return (
    <div className="space-y-6 text-black">
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Quản lý Nộp bài</h2>
          <p className="text-gray-500">Duyệt đề cương và chấm điểm khóa luận</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b flex gap-6">
        {[
          { id: "outlines", label: "Duyệt Đề Cương" },
          { id: "theses", label: "Chấm Khóa Luận" },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => {
              setActiveTab(tab.id as any);
              setSelectedItem(null);
            }}
            className={`pb-3 px-1 font-medium transition-colors relative ${
              activeTab === tab.id
                ? "text-blue-600 border-b-2 border-blue-600"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Submission List */}
      <div className="grid gap-4">
        {currentItems.length === 0 ? (
          <div className="text-center py-10 bg-white rounded-xl border border-dashed text-gray-400 italic">
            Không có dữ liệu cho mục này.
          </div>
        ) : (
          currentItems.map((sub: any) => (
            <div
              key={sub.uniqueId}
              className="bg-white rounded-xl shadow-sm border p-5 hover:border-green-300 transition-colors"
            >
              <div className="flex justify-between items-start">
                <div className="flex gap-4">
                  <div
                    className={`p-3 rounded-lg h-fit ${
                      sub.type === "outline"
                        ? "bg-purple-100 text-purple-600"
                        : "bg-red-100 text-red-600"
                    }`}
                  >
                    <FileText size={24} />
                  </div>
                  <div>
                    <div className="flex items-center gap-3">
                      <h3 className="font-bold text-gray-800 text-lg">
                        {sub.title}
                      </h3>
                      <span className="text-xs font-bold bg-gray-100 text-gray-600 px-2 py-0.5 rounded">
                        MSSV: {sub.studentCode} - {sub.studentName}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                      {sub.description}
                    </p>
                    <div className="flex items-center gap-4 mt-3 text-xs text-gray-500">
                      <span className="flex items-center gap-1">
                        <Clock size={14} />{" "}
                        {new Date(sub.submittedAt).toLocaleString("vi-VN")}
                      </span>
                    </div>
                    {/* Files */}
                    <div className="mt-3 flex gap-2">
                      <a
                        href={sub.fileUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1 text-xs font-bold text-blue-600 bg-blue-50 hover:bg-blue-100 px-2 py-1.5 rounded transition"
                      >
                        <Download size={14} /> Tải tài liệu
                      </a>
                    </div>
                  </div>
                </div>

                {/* Status & Actions */}
                <div className="flex flex-col items-end gap-3">
                  <div
                    className={`px-3 py-1 rounded-full text-xs font-bold uppercase flex items-center gap-1
                                ${
                                  sub.status === "approved"
                                    ? "bg-green-100 text-green-700"
                                    : sub.status === "rejected"
                                    ? "bg-red-100 text-red-700"
                                    : "bg-yellow-100 text-yellow-700"
                                }`}
                  >
                    {sub.status === "approved" && <CheckCircle size={14} />}
                    {sub.status === "rejected" && <AlertCircle size={14} />}
                    {sub.status === "pending" && <Clock size={14} />}
                    {sub.status === "pending"
                      ? "Chờ xử lý"
                      : sub.status === "approved"
                      ? "Đã duyệt"
                      : "Yêu cầu sửa"}
                  </div>

                  {sub.status === "approved" &&
                    sub.type === "thesis" &&
                    sub.score && (
                      <div className="text-sm font-bold text-green-700">
                        Điểm: {sub.score}
                      </div>
                    )}

                  {sub.status === "pending" && (
                    <button
                      onClick={() => {
                        setSelectedItem(sub);
                        setFeedback(sub.feedback || "");
                      }}
                      className="text-sm font-medium text-blue-600 hover:underline"
                    >
                      {sub.type === "thesis" ? "Chấm điểm" : "Xem & Phê duyệt"}
                    </button>
                  )}
                </div>
              </div>
              {/* Feedback Display */}
              {sub.feedback && (
                <div className="mt-4 pt-4 border-t border-gray-100 text-sm">
                  <span className="font-bold text-gray-700">Nhận xét:</span>{" "}
                  {sub.feedback}
                </div>
              )}
            </div>
          ))
        )}
      </div>

      {/* Review Modal */}
      {selectedItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-bold text-gray-800">
                {selectedItem.type === "outline"
                  ? "Duyệt Đề Cương"
                  : "Chấm Điểm Khóa Luận"}
              </h3>
            </div>
            <div className="p-6">
              <p className="font-bold text-gray-800 mb-1">
                {selectedItem.title}
              </p>
              <p className="text-sm text-gray-500 mb-4">
                MSSV: {selectedItem.studentCode} - {selectedItem.studentName}
              </p>

              {selectedItem.type === "outline" ? (
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Nhận xét / Yêu cầu chỉnh sửa
                  </label>
                  <textarea
                    className="w-full border rounded-lg p-3 h-32 outline-none focus:ring-2 focus:ring-green-500 text-sm"
                    placeholder="Nhập nhận xét chi tiết..."
                    value={feedback}
                    onChange={(e) => setFeedback(e.target.value)}
                  ></textarea>
                </div>
              ) : (
                <div className="mb-4">
                  <p className="text-gray-600">
                    Xác nhận sinh viên này đủ điều kiện tham gia bảo vệ khóa
                    luận trước hội đồng?
                  </p>
                </div>
              )}

              <div className="flex gap-3">
                <button
                  onClick={handleApprove}
                  className="flex-1 bg-green-600 text-white py-2 rounded-lg font-bold hover:bg-green-700 transition flex items-center justify-center gap-2"
                >
                  <Check size={18} />{" "}
                  {selectedItem.type === "outline"
                    ? "Phê Duyệt"
                    : "Đồng Ý Cho Bảo Vệ"}
                </button>

                <button
                  onClick={handleReject}
                  className="flex-1 bg-red-100 text-red-600 py-2 rounded-lg font-bold hover:bg-red-200 transition flex items-center justify-center gap-2"
                >
                  <X size={18} />{" "}
                  {selectedItem.type === "outline"
                    ? "Yêu cầu sửa"
                    : "Chưa đủ điều kiện"}
                </button>
              </div>
            </div>
            <div className="bg-gray-50 px-6 py-3 text-right">
              <button
                onClick={() => setSelectedItem(null)}
                className="text-gray-500 text-sm hover:text-gray-700 font-medium"
              >
                Hủy bỏ
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
