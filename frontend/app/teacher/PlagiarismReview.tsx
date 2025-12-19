"use client";
import React, { useState, useEffect } from "react";
import {
  mockPlagiarismChecks,
  mockStudents,
  PlagiarismCheck,
  Student,
} from "../../data/mockData";
import {
  Search,
  CheckCircle,
  XCircle,
  AlertTriangle,
  FileText,
  Scan,
  RotateCw,
  Clock,
  Users,
} from "lucide-react";

/**
 * Plagiarism Review Component
 * Allows teachers to check and review plagiarism results.
 */
const PlagiarismReview: React.FC = () => {
  // State
  const [reviews, setReviews] = useState<PlagiarismCheck[]>([]);
  const [selectedStudentId, setSelectedStudentId] = useState<string | null>(
    null
  );
  const [isScanning, setIsScanning] = useState(false);
  const [scanProgress, setScanProgress] = useState(0);

  // Review Form
  const [feedback, setFeedback] = useState("");

  // Load data
  useEffect(() => {
    setReviews([...mockPlagiarismChecks]);
  }, []);

  // Handlers
  const handleCheckPlagiarism = (studentId: string) => {
    // Simulate system scan
    setIsScanning(true);
    setScanProgress(0);

    const interval = setInterval(() => {
      setScanProgress((prev) => {
        if (prev >= 90) {
          return prev;
        }
        return prev + 10;
      });
    }, 200);

    setTimeout(() => {
      clearInterval(interval);
      setScanProgress(100);

      // Generate random result
      const randomScore = Math.floor(Math.random() * 30); // 0-30%
      const passed = randomScore < 20;

      // Update or create review
      const existing = reviews.find((r) => r.studentId === studentId);
      if (existing) {
        const updated = reviews.map((r) =>
          r.studentId === studentId
            ? {
                ...r,
                similarityPercentage: randomScore,
                checkDate: new Date().toISOString().split("T")[0],
                status: passed ? ("passed" as const) : ("failed" as const), // Default logic, teacher can override
                reportFile: `turnitin_report_${studentId}.pdf`,
                feedback: "",
              }
            : r
        );
        setReviews(updated);
      } else {
        const newCheck: PlagiarismCheck = {
          id: `pc${Date.now()}`,
          studentId: studentId,
          registrationId: `reg${Date.now()}`, // Mock
          similarityPercentage: randomScore,
          checkDate: new Date().toISOString().split("T")[0],
          status: "pending", // Teacher needs to review
          reportFile: `turnitin_report_${studentId}.pdf`,
          feedback: "",
        };
        setReviews([...reviews, newCheck]);
      }

      setIsScanning(false);
      alert(`Đã hoàn tất kiểm tra! Tỷ lệ trùng lặp: ${randomScore}%`);
    }, 2500);
  };

  const handleUpdateStatus = (id: string, newStatus: "passed" | "failed") => {
    const updated = reviews.map((r) =>
      r.id === id ? { ...r, status: newStatus, feedback: feedback } : r
    );
    setReviews(updated);
    setFeedback("");
    alert("Đã cập nhật kết quả rà soát!");
  };

  // Render Helpers
  const getStudent = (id: string) => mockStudents.find((s) => s.id === id);
  const getCheck = (studentId: string) =>
    reviews.find((r) => r.studentId === studentId);

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
            <Scan className="text-blue-600" />
            Rà soát Đạo văn
          </h2>
          <p className="text-sm text-gray-500 mt-1">
            Kiểm tra và đánh giá mức độ trùng lặp tài liệu của sinh viên.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Student List */}
        <div className="lg:col-span-1 bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="p-4 border-b border-gray-100 bg-gray-50">
            <h3 className="font-bold text-gray-700">Danh sách sinh viên</h3>
          </div>
          <div className="divide-y divide-gray-100 max-h-[600px] overflow-y-auto">
            {mockStudents.map((student) => {
              const check = getCheck(student.id);
              const isSelected = selectedStudentId === student.id;

              return (
                <div
                  key={student.id}
                  onClick={() => {
                    setSelectedStudentId(student.id);
                    setFeedback(check?.feedback || "");
                  }}
                  className={`p-4 cursor-pointer transition hover:bg-gray-50 ${
                    isSelected ? "bg-blue-50 border-l-4 border-blue-600" : ""
                  }`}
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-medium text-gray-900">
                        {student.name}
                      </p>
                      <p className="text-xs text-gray-500">{student.code}</p>
                    </div>
                    {check && (
                      <span
                        className={`text-xs px-2 py-0.5 rounded font-bold ${
                          check.status === "passed"
                            ? "bg-green-100 text-green-700"
                            : check.status === "failed"
                            ? "bg-red-100 text-red-700"
                            : "bg-gray-100 text-gray-700"
                        }`}
                      >
                        {check.similarityPercentage}%
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Detail Panel */}
        <div className="lg:col-span-2 space-y-6">
          {selectedStudentId ? (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h3 className="text-xl font-bold text-gray-900">
                    {getStudent(selectedStudentId)?.name}
                  </h3>
                  <p className="text-gray-500 text-sm">
                    MSSV: {getStudent(selectedStudentId)?.code}
                  </p>
                </div>
                {getCheck(selectedStudentId) ? (
                  <div className="text-right">
                    <p className="text-xs text-gray-500">
                      Lần kiểm tra gần nhất
                    </p>
                    <p className="font-medium">
                      {getCheck(selectedStudentId)?.checkDate}
                    </p>
                  </div>
                ) : (
                  <span className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-xs font-bold">
                    Chưa kiểm tra
                  </span>
                )}
              </div>

              {/* Action Area */}
              {!getCheck(selectedStudentId) ? (
                <div className="text-center py-12 bg-gray-50 rounded-lg border border-dashed border-gray-300">
                  <FileText className="mx-auto h-12 w-12 text-gray-400 mb-3" />
                  <p className="text-gray-500 mb-4">
                    Chưa có dữ liệu kiểm tra đạo văn cho sinh viên này.
                  </p>
                  <button
                    onClick={() => handleCheckPlagiarism(selectedStudentId)}
                    disabled={isScanning}
                    className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition"
                  >
                    {isScanning ? (
                      <>
                        <RotateCw className="animate-spin mr-2" size={18} />{" "}
                        Đang quét...
                      </>
                    ) : (
                      <>
                        <Scan className="mr-2" size={18} /> Kiểm tra ngay
                      </>
                    )}
                  </button>
                </div>
              ) : (
                <div className="space-y-6">
                  {/* Results Card */}
                  <div className="bg-slate-50 p-6 rounded-xl border border-slate-200">
                    <div className="flex items-center gap-4 mb-4">
                      <div
                        className={`p-4 rounded-full ${
                          (getCheck(selectedStudentId)?.similarityPercentage ||
                            0) > 20
                            ? "bg-red-100 text-red-600"
                            : "bg-green-100 text-green-600"
                        }`}
                      >
                        <span className="text-2xl font-bold">
                          {getCheck(selectedStudentId)?.similarityPercentage}%
                        </span>
                      </div>
                      <div>
                        <h4 className="font-bold text-gray-800">
                          Kết quả trùng lặp
                        </h4>
                        <a
                          href="#"
                          className="text-blue-600 text-sm hover:underline"
                        >
                          Xem báo cáo chi tiết
                        </a>
                      </div>
                    </div>

                    {/* Simulation Progress if Re-running */}
                    {isScanning && (
                      <div className="w-full bg-gray-200 rounded-full h-2.5 mb-2">
                        <div
                          className="bg-blue-600 h-2.5 rounded-full transition-all duration-300"
                          style={{ width: `${scanProgress}%` }}
                        ></div>
                      </div>
                    )}

                    <div className="mt-4 flex gap-2">
                      <button
                        onClick={() => handleCheckPlagiarism(selectedStudentId)}
                        disabled={isScanning}
                        className="text-sm flex items-center gap-1 text-gray-600 hover:text-blue-600"
                      >
                        <RotateCw size={14} /> Quét lại
                      </button>
                    </div>
                  </div>

                  {/* Review Form */}
                  <div className="border-t border-gray-100 pt-6">
                    <h4 className="font-bold text-gray-800 mb-3 flex items-center gap-2">
                      <FileText size={18} /> Đánh giá của GVHD
                    </h4>
                    <div className="space-y-4">
                      <textarea
                        className="w-full p-3 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
                        rows={3}
                        placeholder="Nhập nhận xét về kết quả kiểm tra..."
                        value={feedback}
                        onChange={(e) => setFeedback(e.target.value)}
                      />
                      <div className="flex gap-3">
                        <button
                          onClick={() =>
                            handleUpdateStatus(
                              getCheck(selectedStudentId)!.id,
                              "passed"
                            )
                          }
                          className={`flex-1 py-2 rounded-lg font-medium flex justify-center items-center gap-2 transition ${
                            getCheck(selectedStudentId)?.status === "passed"
                              ? "bg-green-600 text-white"
                              : "bg-white border border-green-600 text-green-600 hover:bg-green-50"
                          }`}
                        >
                          <CheckCircle size={18} /> Đạt yêu cầu
                        </button>
                        <button
                          onClick={() =>
                            handleUpdateStatus(
                              getCheck(selectedStudentId)!.id,
                              "failed"
                            )
                          }
                          className={`flex-1 py-2 rounded-lg font-medium flex justify-center items-center gap-2 transition ${
                            getCheck(selectedStudentId)?.status === "failed"
                              ? "bg-red-600 text-white"
                              : "bg-white border border-red-600 text-red-600 hover:bg-red-50"
                          }`}
                        >
                          <XCircle size={18} /> Không đạt
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-gray-400 p-8 border-2 border-dashed border-gray-200 rounded-xl">
              <Users className="w-16 h-16 mb-4 opacity-50" />
              <p>Chọn sinh viên để rà soát đạo văn</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PlagiarismReview;
