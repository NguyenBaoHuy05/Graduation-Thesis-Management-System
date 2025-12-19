"use client";
import React, { useState } from "react";
import { mockRegistrations } from "../../data/mockData";
import { useAuth } from "../../contexts/AuthContext";
import {
  Upload,
  FileText,
  CheckCircle,
  AlertTriangle,
  Clock,
} from "lucide-react";

const ThesisSubmission: React.FC = () => {
  const { user } = useAuth();

  // Get student registration
  const myRegistration = mockRegistrations.find(
    (r) => r.studentId === user?.profileId
  );

  // Local state for UI simulation (initially load from mock)
  const [submissionTime, setSubmissionTime] = useState<string | null>(
    myRegistration?.thesisSubmittedAt || null
  );
  const [fileName, setFileName] = useState<string | null>(
    myRegistration?.thesisFileUrl ? "DoAn_KhoaLuan.zip" : null
  );

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  // Handle file selection
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      // Validation: Check for .zip extension
      if (!file.name.endsWith(".zip")) {
        alert("Chỉ chấp nhận file .zip! Vui lòng chọn lại.");
        e.target.value = ""; // Reset input
        return;
      }
      setSelectedFile(file);
    }
  };

  // Handle Submission
  const handleSubmit = () => {
    if (!selectedFile) return;

    // Check for overwrite
    if (submissionTime) {
      const confirmOverwrite = confirm(
        "Bạn đã nộp đồ án trước đó. Bạn có chắc chắn muốn ghi đè file cũ?"
      );
      if (!confirmOverwrite) return;
    }

    setIsUploading(true);

    // Simulate upload delay
    setTimeout(() => {
      const now = new Date().toLocaleString("vi-VN");
      setSubmissionTime(now);
      setFileName(selectedFile.name);
      setSelectedFile(null);
      setIsUploading(false);

      // Show Success Popup (using alert for simplicity as per requirements, or we can make a nicer one)
      // Requirement says "Popup thành công hiện lên", then "Đóng Popup". Alert satisfies this interaction flow.
      alert("Nộp đồ án thành công!");

      // Update mock data in memory (for this session)
      if (myRegistration) {
        myRegistration.thesisSubmittedAt = new Date().toISOString();
        myRegistration.thesisFileUrl = "simulated_url.zip";
        myRegistration.status = "submitted";
      }
    }, 1500);
  };

  if (!myRegistration) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 text-center">
        <AlertTriangle className="mx-auto text-yellow-500 mb-4" size={48} />
        <h3 className="text-xl font-bold text-gray-900">Chưa đăng ký đề tài</h3>
        <p className="text-gray-500 mt-2">
          Bạn cần đăng ký đề tài và được duyệt trước khi nộp đồ án.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 max-w-2xl mx-auto">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-900">
          Nộp Đồ án / Khóa luận tốt nghiệp
        </h2>
        <p className="text-sm text-gray-500 mt-1">
          Vui lòng nộp file nén (.zip) chứa toàn bộ mã nguồn và báo cáo
        </p>
      </div>

      <div className="space-y-6">
        {/* Status Card */}
        <div
          className={`p-4 rounded-xl border ${
            submissionTime
              ? "bg-green-50 border-green-200"
              : "bg-gray-50 border-gray-200"
          }`}
        >
          <div className="flex items-center space-x-3">
            <div
              className={`p-2 rounded-full ${
                submissionTime
                  ? "bg-green-100 text-green-600"
                  : "bg-gray-200 text-gray-500"
              }`}
            >
              {submissionTime ? (
                <CheckCircle size={24} />
              ) : (
                <Upload size={24} />
              )}
            </div>
            <div>
              <p className="font-semibold text-gray-900">
                {submissionTime ? "Trạng thái: Đã nộp" : "Trạng thái: Chưa nộp"}
              </p>
              {submissionTime ? (
                <p className="text-sm text-green-700 flex items-center gap-1 mt-1">
                  <Clock size={14} /> Đã nộp lúc: {submissionTime}
                </p>
              ) : (
                <p className="text-sm text-gray-500 mt-1">
                  Hạn chót chưa được thiết lập (Demo)
                </p>
              )}
            </div>
          </div>

          {fileName && (
            <div className="mt-4 pt-3 border-t border-green-200/50 flex items-center gap-2 text-sm text-gray-700">
              <FileText size={16} className="text-gray-400" />
              <span className="font-medium">File hiện tại:</span> {fileName}
            </div>
          )}
        </div>

        {/* Upload Area */}
        <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 hover:bg-gray-50 transition-colors text-center">
          <input
            type="file"
            id="thesis-upload"
            accept=".zip"
            className="hidden"
            onChange={handleFileChange}
          />

          {!selectedFile ? (
            <label
              htmlFor="thesis-upload"
              className="cursor-pointer flex flex-col items-center"
            >
              <div className="bg-blue-50 text-blue-600 p-4 rounded-full mb-4">
                <Upload size={32} />
              </div>
              <span className="text-lg font-medium text-gray-900">
                Chọn file .zip để tải lên
              </span>
              <p className="text-sm text-gray-500 mt-2">
                Kích thước tối đa: 100MB
              </p>
            </label>
          ) : (
            <div className="flex flex-col items-center animate-in zoom-in-95 duration-200">
              <div className="bg-blue-100 text-blue-700 p-4 rounded-full mb-4">
                <FileText size={32} />
              </div>
              <span className="text-lg font-medium text-gray-900">
                {selectedFile.name}
              </span>
              <p className="text-sm text-gray-500 mt-1">
                {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
              </p>
              <button
                onClick={() => setSelectedFile(null)}
                className="mt-3 text-sm text-red-500 hover:text-red-700 font-medium"
              >
                Hủy chọn
              </button>
            </div>
          )}
        </div>

        {/* Submit Button */}
        <button
          onClick={handleSubmit}
          disabled={!selectedFile || isUploading}
          className={`w-full py-3 rounded-xl font-bold text-lg shadow-lg transform transition active:scale-[0.98] ${
            !selectedFile || isUploading
              ? "bg-gray-300 text-gray-500 cursor-not-allowed shadow-none"
              : "bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:from-blue-700 hover:to-indigo-700 shadow-blue-200"
          }`}
        >
          {isUploading
            ? "Đang tải lên..."
            : submissionTime
            ? "Ghi đè & Nộp lại"
            : "Nộp bài"}
        </button>
      </div>
    </div>
  );
};

export default ThesisSubmission;
