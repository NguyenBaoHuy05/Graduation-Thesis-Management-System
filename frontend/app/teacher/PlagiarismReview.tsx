"use client";
import React, { useState } from "react";
import { useQuery, useMutation } from "@apollo/client/react";
import { gql } from "@apollo/client";
import { useAuth } from "../../contexts/AuthContext";
import {
  CheckCircle,
  XCircle,
  FileText,
  Scan,
  RotateCw,
  Users,
  Monitor,
  ExternalLink,
  ShieldCheck,
  Clock,
} from "lucide-react";

// --- GraphQL ---
const GET_TEACHER_REGISTRATIONS = gql`
  query GetTeacherRegistrations($teacherId: String!) {
    teacherRegistrations(teacherId: $teacherId) {
      id
      studentId
      status
      thesisFileUrl
      thesisSubmittedAt
      codeLink
      score
      feedback: outlineFeedback
      student {
        id
        name
        code
        class
      }
      topic {
        title
      }
    }
  }
`;

const REVIEW_THESIS = gql`
  mutation ReviewThesis(
    $registrationId: String!
    $status: String!
    $score: Float
  ) {
    reviewThesis(
      registrationId: $registrationId
      status: $status
      score: $score
    ) {
      id
      status
      score
    }
  }
`;

const PlagiarismReview: React.FC = () => {
  const { user } = useAuth();
  const [selectedRegId, setSelectedRegId] = useState<string | null>(null);
  const [similarityScore, setSimilarityScore] = useState<number | string>("");
  const [evaluating, setEvaluating] = useState(false);

  const { data, loading, refetch } = useQuery<{ teacherRegistrations: any[] }>(
    GET_TEACHER_REGISTRATIONS,
    {
      variables: { teacherId: user?.profileId },
      skip: !user?.profileId,
    }
  );

  const [reviewThesis] = useMutation(REVIEW_THESIS);

  // Filter for students who reached Submission phase
  const submissions =
    data?.teacherRegistrations?.filter((r) =>
      [
        "submitted",
        "defense_ready",
        "thesis_rejected",
        "defense_registered",
        "thesis_approved",
      ].includes(r.status)
    ) || [];

  const selectedReg = submissions.find((r) => r.id === selectedRegId);

  const handleUpdateStatus = async (status: string) => {
    if (!selectedReg) return;
    if (similarityScore === "" && status === "defense_ready") {
      if (!confirm("Bạn chưa nhập % trùng lặp. Vẫn tiếp tục?")) return;
    }

    if (
      !confirm(
        status === "defense_ready"
          ? "Xác nhận ĐẠT yêu cầu rà soát?"
          : "Xác nhận KHÔNG ĐẠT và yêu cầu nộp lại?"
      )
    )
      return;

    setEvaluating(true);
    try {
      await reviewThesis({
        variables: {
          registrationId: selectedReg.id,
          status: status,
          score: similarityScore
            ? parseFloat(similarityScore.toString())
            : null,
        },
      });
      alert("Cập nhật thành công!");
      refetch();
    } catch (err: any) {
      alert("Lỗi: " + err.message);
    } finally {
      setEvaluating(false);
    }
  };

  return (
    <div className="text-black space-y-6 animate-in fade-in duration-500">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
            <Scan className="text-indigo-600" />
            Rà soát Đạo văn
          </h2>
          <p className="text-sm text-gray-500 mt-1">
            Kiểm tra mức độ trùng lặp và cấp quyền bảo vệ.
          </p>
        </div>
        <div className="flex gap-2 text-sm">
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 rounded-full bg-indigo-100 border border-indigo-500"></div>{" "}
            Đã nộp
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 rounded-full bg-green-100 border border-green-500"></div>{" "}
            Đạt
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 rounded-full bg-red-100 border border-red-500"></div>{" "}
            Không đạt
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Student List */}
        <div className="lg:col-span-1 bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden flex flex-col h-[600px]">
          <div className="p-4 border-b border-gray-100 bg-gray-50 flex justify-between items-center">
            <h3 className="font-bold text-gray-700">
              Danh sách nộp bài ({submissions.length})
            </h3>
            <button
              onClick={() => refetch()}
              className="p-1 hover:bg-gray-200 rounded"
            >
              <RotateCw size={16} className="text-gray-500" />
            </button>
          </div>
          <div className="divide-y divide-gray-100 overflow-y-auto flex-1">
            {loading ? (
              <p className="p-4 text-center text-gray-500">Đang tải...</p>
            ) : (
              submissions.map((reg) => {
                const isSelected = selectedRegId === reg.id;
                let statusColor = "bg-gray-50 border-l-4 border-gray-300";
                if (reg.status === "submitted")
                  statusColor = "bg-white border-l-4 border-indigo-500";
                if (
                  reg.status === "defense_ready" ||
                  reg.status === "thesis_approved" ||
                  reg.status === "defense_registered"
                )
                  statusColor = "bg-green-50 border-l-4 border-green-500";
                if (reg.status === "thesis_rejected")
                  statusColor = "bg-red-50 border-l-4 border-red-500";

                return (
                  <div
                    key={reg.id}
                    onClick={() => {
                      setSelectedRegId(reg.id);
                      setSimilarityScore(reg.score ?? "");
                    }}
                    className={`p-4 cursor-pointer transition hover:bg-gray-100 ${
                      isSelected
                        ? "bg-indigo-50 border-l-4 border-indigo-600"
                        : statusColor
                    }`}
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-bold text-gray-900">
                          {reg.student?.name}
                        </p>
                        <p className="text-xs text-gray-500">
                          {reg.student?.code}
                        </p>
                        <p
                          className="text-xs text-indigo-600 mt-1 truncate max-w-[180px]"
                          title={reg.topic?.title}
                        >
                          {reg.topic?.title}
                        </p>
                      </div>
                      {reg.score !== null && (
                        <span
                          className={`text-xs px-2 py-1 rounded font-bold ${
                            reg.score <= 20
                              ? "bg-green-200 text-green-800"
                              : "bg-red-200 text-red-800"
                          }`}
                        >
                          {reg.score}%
                        </span>
                      )}
                    </div>
                    <div className="mt-2 text-[10px] text-gray-400 text-right">
                      {new Date(reg.thesisSubmittedAt).toLocaleDateString(
                        "vi-VN"
                      )}
                    </div>
                  </div>
                );
              })
            )}
            {submissions.length === 0 && !loading && (
              <div className="p-8 text-center text-gray-400 text-sm">
                Chưa có bài nộp nào.
              </div>
            )}
          </div>
        </div>

        {/* Detail Panel */}
        <div className="lg:col-span-2 space-y-6">
          {selectedReg ? (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 h-full flex flex-col">
              <div className="flex justify-between items-start mb-6 pb-6 border-b border-gray-100">
                <div>
                  <h3 className="text-xl font-bold text-gray-900">
                    {selectedReg.student?.name}
                  </h3>
                  <p className="text-gray-500 text-sm">
                    MSSV: {selectedReg.student?.code} - Lớp:{" "}
                    {selectedReg.student?.class}
                  </p>
                </div>
                <div
                  className={`px-4 py-2 rounded-lg font-bold text-sm flex items-center gap-2 ${
                    selectedReg.status === "defense_ready" ||
                    selectedReg.status === "defense_registered"
                      ? "bg-green-100 text-green-700"
                      : selectedReg.status === "thesis_rejected"
                      ? "bg-red-100 text-red-700"
                      : "bg-indigo-100 text-indigo-700"
                  }`}
                >
                  {selectedReg.status === "defense_ready" ||
                  selectedReg.status === "defense_registered" ? (
                    <CheckCircle size={16} />
                  ) : selectedReg.status === "thesis_rejected" ? (
                    <XCircle size={16} />
                  ) : (
                    <Clock size={16} />
                  )}
                  {selectedReg.status === "defense_ready" ||
                  selectedReg.status === "defense_registered"
                    ? "Đủ điều kiện bảo vệ"
                    : selectedReg.status === "thesis_rejected"
                    ? "Không đạt"
                    : "Chờ rà soát"}
                </div>
              </div>

              {/* Links Section */}
              <div className="grid grid-cols-2 gap-4 mb-8">
                <div className="bg-gray-50 p-4 rounded-xl border border-gray-200 group hover:border-indigo-300 transition-colors">
                  <div className="flex items-center gap-3 mb-2">
                    <FileText className="text-indigo-600" />
                    <span className="font-bold text-gray-700 text-sm">
                      File Báo cáo
                    </span>
                  </div>
                  {selectedReg.thesisFileUrl ? (
                    <a
                      href={selectedReg.thesisFileUrl}
                      target="_blank"
                      className="text-sm text-blue-600 hover:underline flex items-center gap-1 break-all"
                    >
                      {selectedReg.thesisFileUrl} <ExternalLink size={12} />
                    </a>
                  ) : (
                    <span className="text-sm text-gray-400 italic">
                      Chưa nộp
                    </span>
                  )}
                </div>

                <div className="bg-gray-50 p-4 rounded-xl border border-gray-200 group hover:border-purple-300 transition-colors">
                  <div className="flex items-center gap-3 mb-2">
                    <Monitor className="text-purple-600" />
                    <span className="font-bold text-gray-700 text-sm">
                      Source Code
                    </span>
                  </div>
                  {selectedReg.codeLink ? (
                    <a
                      href={selectedReg.codeLink}
                      target="_blank"
                      className="text-sm text-blue-600 hover:underline flex items-center gap-1 break-all"
                    >
                      {selectedReg.codeLink} <ExternalLink size={12} />
                    </a>
                  ) : (
                    <span className="text-sm text-gray-400 italic">
                      Chưa nộp
                    </span>
                  )}
                </div>
              </div>

              {/* Action Area */}
              <div className="mt-auto bg-indigo-50/50 rounded-xl p-6 border border-indigo-100">
                <h4 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
                  <ShieldCheck className="text-indigo-600" /> Đánh giá & Kết
                  luận
                </h4>

                <div className="flex items-center gap-4 mb-6">
                  <div className="w-1/3">
                    <label className="block text-sm font-bold text-gray-700 mb-1">
                      Tỷ lệ trùng lặp (%)
                    </label>
                    <div className="relative">
                      <input
                        type="number"
                        min="0"
                        max="100"
                        className="w-full pl-3 pr-10 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                        placeholder="0"
                        value={similarityScore}
                        onChange={(e) => setSimilarityScore(e.target.value)}
                      />
                      <span className="absolute right-3 top-2 text-gray-500 font-bold">
                        %
                      </span>
                    </div>
                  </div>
                  <div className="flex-1">
                    <div className="text-sm text-gray-500 italic mt-6">
                      * Tỷ lệ {">"} 20% thường coi là không đạt. Nhập kết quả từ
                      phần mềm kiểm tra (Turnitin, etc).
                    </div>
                  </div>
                </div>

                <div className="flex gap-4 pt-4 border-t border-indigo-200">
                  <button
                    onClick={() => handleUpdateStatus("thesis_rejected")}
                    disabled={evaluating}
                    className="flex-1 py-3 bg-white border-2 border-red-500 text-red-600 rounded-xl font-bold hover:bg-red-50 transition flex justify-center items-center gap-2"
                  >
                    <XCircle size={20} /> Không Đạt
                  </button>
                  <button
                    onClick={() => handleUpdateStatus("defense_ready")}
                    disabled={evaluating}
                    className="flex-1 py-3 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 shadow-lg shadow-indigo-200 transition flex justify-center items-center gap-2"
                  >
                    <CheckCircle size={20} /> Đạt - Cho Phép Bảo Vệ
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-gray-400 p-8 border-2 border-dashed border-gray-200 rounded-xl bg-gray-50">
              <Users className="w-16 h-16 mb-4 opacity-30" />
              <p className="text-lg">
                Chọn sinh viên từ danh sách bên trái để rà soát.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PlagiarismReview;
