"use client";

import { useState } from "react";
import { Search, X, UserPlus, Check, AlertCircle } from "lucide-react";
import { mockStudents, Student, mockRegistrations, TopicInvitation } from "../../data/mockData";

interface InviteStudentModalProps {
  topicId: string;
  topicTitle: string;
  isOpen: boolean;
  onClose: () => void;
}

export default function InviteStudentModal({
  topicId,
  topicTitle,
  isOpen,
  onClose,
}: InviteStudentModalProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<Student[]>([]);
  const [invitedStudents, setInvitedStudents] = useState<string[]>([]); // List of student IDs invited in this session
  const [error, setError] = useState("");

  if (!isOpen) return null;

  const handleSearch = () => {
    setError("");
    if (!searchQuery.trim()) {
      setSearchResults([]);
      return;
    }

    const query = searchQuery.toLowerCase();
    const results = mockStudents.filter(
      (s) =>
        s.name.toLowerCase().includes(query) ||
        s.code.toLowerCase().includes(query) ||
        s.email.toLowerCase().includes(query)
    );

    setSearchResults(results);
    if (results.length === 0) {
      setError("Không tìm thấy sinh viên nào.");
    }
  };

  const handleInvite = (student: Student) => {
    // Check if student already has a registered topic
    const hasTopic = mockRegistrations.some(
      (reg) =>
        reg.studentId === student.id &&
        ["registered", "in_progress", "submitted", "defense_ready", "defended", "completed"].includes(reg.status)
    );

    if (hasTopic) {
      alert(`Sinh viên ${student.name} đã đăng ký đề tài khác!`);
      return;
    }

    // Check if already invited (Mock logic: just add to local state for visual feedback)
    if (invitedStudents.includes(student.id)) {
        return;
    }

    // In a real app, this would call an API to create a TopicInvitation
    setInvitedStudents([...invitedStudents, student.id]);
    
    // Simulate API call success
    console.log(`Invited student ${student.code} to topic ${topicId}`);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-lg overflow-hidden flex flex-col max-h-[90vh]">
        <div className="p-4 border-b flex justify-between items-center bg-gray-50">
          <div>
            <h3 className="text-lg font-bold text-gray-800">Mời sinh viên</h3>
            <p className="text-xs text-gray-500 truncate max-w-[300px]" title={topicTitle}>
              Đề tài: {topicTitle}
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition"
          >
            <X size={24} />
          </button>
        </div>

        <div className="p-4">
          <div className="flex gap-2 mb-4">
            <div className="relative flex-1">
              <input
                type="text"
                className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                placeholder="Nhập tên hoặc mã sinh viên..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              />
              <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
            </div>
            <button
              onClick={handleSearch}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
            >
              Tìm
            </button>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-50 text-red-600 text-sm rounded-lg flex items-center gap-2">
              <AlertCircle size={16} />
              {error}
            </div>
          )}

          <div className="overflow-y-auto max-h-[300px] space-y-2">
            {searchResults.map((student) => {
               const isInvited = invitedStudents.includes(student.id);
               // Check status again for UI rendering
                const hasTopic = mockRegistrations.some(
                    (reg) =>
                        reg.studentId === student.id &&
                        ["registered", "in_progress", "submission", "defense", "completed"].includes(reg.status)
                );

              return (
                <div
                  key={student.id}
                  className="flex justify-between items-center p-3 border rounded-lg hover:bg-gray-50 bg-white"
                >
                  <div>
                    <p className="font-bold text-gray-800">{student.name}</p>
                    <p className="text-sm text-gray-500">
                      {student.code} - {student.class}
                    </p>
                    {hasTopic && (
                         <span className="text-[10px] text-red-500 font-medium bg-red-50 px-1 rounded">Đã có đề tài</span>
                    )}
                  </div>
                  <button
                    onClick={() => handleInvite(student)}
                    disabled={isInvited || hasTopic}
                    className={`p-2 rounded-lg transition-colors flex items-center gap-1 text-sm font-medium
                      ${
                        isInvited
                          ? "bg-green-100 text-green-700 cursor-default"
                          : hasTopic 
                          ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                          : "bg-blue-50 text-blue-600 hover:bg-blue-100"
                      }`}
                  >
                    {isInvited ? (
                      <>
                        <Check size={16} /> Đã mời
                      </>
                    ) : (
                      <>
                        <UserPlus size={16} /> Mời
                      </>
                    )}
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
