"use client";

import { useState } from "react";
import { Search, X, UserPlus, Check, AlertCircle } from "lucide-react";
import { gql } from "@apollo/client";
import { useQuery, useMutation } from "@apollo/client/react";
import WarningModal from "../../components/WarningModal";

const GET_STUDENTS_WITHOUT_TOPIC = gql`
  query GetStudentsWithoutTopic($search: String) {
    studentsWithoutTopic(search: $search) {
      id
      code
      name
      email
      class
    }
  }
`;

const INVITE_STUDENT = gql`
  mutation InviteStudent($topicId: String!, $studentId: String!) {
    inviteStudent(topicId: $topicId, studentId: $studentId) {
      id
      status
    }
  }
`;

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
  const [invitedStudents, setInvitedStudents] = useState<string[]>([]);

  // Warning Modal State
  const [warningState, setWarningState] = useState<{
    isOpen: boolean;
    type: "success" | "warning" | "error";
    message: string;
  }>({
    isOpen: false,
    type: "success",
    message: "",
  });

  const { data, loading, refetch } = useQuery<any>(GET_STUDENTS_WITHOUT_TOPIC, {
    variables: { search: searchQuery },
    skip: !isOpen, // Only fetch when modal is open
    fetchPolicy: "network-only",
  });

  const [inviteStudent] = useMutation(INVITE_STUDENT, {
    onCompleted: (data) => {
      // Optimistically update UI
      setWarningState({
        isOpen: true,
        type: "success",
        message: "Đã gửi lời mời thành công!",
      });
    },
    onError: (err) => {
      setWarningState({
        isOpen: true,
        type: "error",
        message: `Lỗi: ${err.message}`,
      });
      // Revert optimistic update if needed, but here we just show error
      // Remove from invited list if failed?
      // For simplicity, we just alert error.
    },
  });

  if (!isOpen) return null;

  const handleSearch = () => {
    refetch({ search: searchQuery });
  };

  const handleInvite = (student: any) => {
    if (invitedStudents.includes(student.id)) return;

    setInvitedStudents((prev) => [...prev, student.id]);

    inviteStudent({
      variables: {
        topicId: topicId,
        studentId: student.id,
      },
    }).catch(() => {
      // If mutation fails, remove from invited list (revert)
      setInvitedStudents((prev) => prev.filter((id) => id !== student.id));
    });
  };

  const students = data?.studentsWithoutTopic || [];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-lg overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-5 border-b border-gray-100 flex justify-between items-start bg-gray-50/50">
          <div>
            <h3 className="text-lg font-bold text-gray-900">
              Mời sinh viên tham gia
            </h3>
            <p
              className="text-xs text-gray-500 mt-1 line-clamp-1"
              title={topicTitle}
            >
              Đề tài:{" "}
              <span className="font-semibold text-gray-700">{topicTitle}</span>
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition p-1 hover:bg-gray-100 rounded-lg"
          >
            <X size={20} />
          </button>
        </div>

        <div className="p-5">
          {/* Search Bar */}
          <div className="flex gap-2 mb-4">
            <div className="relative flex-1">
              <input
                type="text"
                className="w-full pl-10 pr-4 py-2 bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none text-sm transition-all"
                placeholder="Tìm theo tên hoặc mã sinh viên..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              />
              <Search
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                size={16}
              />
            </div>
            <button
              onClick={handleSearch}
              className="px-4 py-2 bg-blue-600 text-white text-sm font-semibold rounded-lg hover:bg-blue-700 transition shadow-sm"
            >
              Tìm kiếm
            </button>
          </div>

          {/* Results List */}
          <div className="overflow-y-auto max-h-[350px] min-h-[200px] -mx-2 px-2">
            {loading ? (
              <div className="flex flex-col items-center justify-center h-40 text-gray-400 text-xs">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500 mb-2"></div>
                Đang tìm kiếm...
              </div>
            ) : students.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-40 text-gray-400 text-sm">
                <Search size={32} className="mb-2 opacity-20" />
                Không tìm thấy sinh viên nào phù hợp (hoặc tất cả đã có đề tài).
              </div>
            ) : (
              <div className="space-y-2">
                {students.map((student: any) => {
                  const isInvited = invitedStudents.includes(student.id);
                  return (
                    <div
                      key={student.id}
                      className="flex justify-between items-center p-3 border border-gray-100 rounded-lg hover:bg-gray-50 transition-colors bg-white group"
                    >
                      <div>
                        <p className="font-bold text-gray-800 text-sm">
                          {student.name}
                        </p>
                        <p className="text-xs text-gray-500 mt-0.5">
                          {student.code} <span className="mx-1">•</span>{" "}
                          {student.class}
                        </p>
                      </div>
                      <button
                        onClick={() => handleInvite(student)}
                        disabled={isInvited}
                        className={`px-3 py-1.5 rounded-md transition-all flex items-center gap-1.5 text-xs font-bold
                                ${
                                  isInvited
                                    ? "bg-green-50 text-green-600 cursor-default border border-green-100"
                                    : "bg-blue-50 text-blue-600 hover:bg-blue-600 hover:text-white border border-blue-100 hover:border-blue-600"
                                }`}
                      >
                        {isInvited ? (
                          <>
                            <Check size={14} /> Đã mời
                          </>
                        ) : (
                          <>
                            <UserPlus size={14} /> Mời tham gia
                          </>
                        )}
                      </button>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
      <WarningModal
        isOpen={warningState.isOpen}
        onClose={() => setWarningState({ ...warningState, isOpen: false })}
        type={warningState.type}
        message={warningState.message}
      />
    </div>
  );
}
