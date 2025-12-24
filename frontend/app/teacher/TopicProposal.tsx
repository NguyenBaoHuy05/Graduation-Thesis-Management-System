"use client";
import React, { useState, useEffect } from "react";
// Removed mockTopics, mockThesisPeriods imports
import { Topic } from "../../data/mockData"; // Keep interface/type imports if compatible, or redefine. Topic type is compatible.
import { useAuth } from "../../contexts/AuthContext";
import {
  Lightbulb,
  Plus,
  Edit,
  Trash2,
  CheckCircle,
  Clock,
  XCircle,
  UserPlus,
} from "lucide-react";
import InviteStudentModal from "./InviteStudentModal";
import WarningModal from "../../components/WarningModal"; // Import here
import { gql } from "@apollo/client";
import { useQuery, useMutation } from "@apollo/client/react";

const GET_TEACHER_TOPICS = gql`
  query GetTeacherTopics($teacherId: String!) {
    teacherTopics(teacherId: $teacherId) {
      id
      code
      title
      description
      requirements
      specialization
      status
      maxStudents
      currentStudents
      createdAt
      teacherId
      periodId
    }
  }
`;

const GET_ACTIVE_PERIOD = gql`
  query GetActiveThesisPeriod {
    thesisPeriods {
      id
      maxGroupSize
      status
    }
  }
`;

const CREATE_TOPIC = gql`
  mutation CreateTopic($createTopicInput: CreateTopicInput!) {
    createTopic(createTopicInput: $createTopicInput) {
      id
      code
      title
      status
    }
  }
`;

const UPDATE_TOPIC = gql`
  mutation UpdateTopic($id: String!, $updateTopicInput: UpdateTopicInput!) {
    updateTopic(id: $id, updateTopicInput: $updateTopicInput) {
      id
      title
      description
      requirements
      studyReferences
      specialization
      maxStudents
      status
    }
  }
`;

const DELETE_TOPIC = gql`
  mutation DeleteTopic($id: String!) {
    deleteTopic(id: $id)
  }
`;

const TopicProposal: React.FC = () => {
  const { user } = useAuth();
  const [showModal, setShowModal] = useState(false);
  // Invite Modal State
  const [inviteModalOpen, setInviteModalOpen] = useState(false);
  const [selectedTopicForInvite, setSelectedTopicForInvite] = useState<{
    id: string;
    title: string;
  } | null>(null);

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

  const {
    data: topicsData,
    loading: topicsLoading,
    refetch: refetchTopics,
  } = useQuery<any>(GET_TEACHER_TOPICS, {
    variables: { teacherId: user?.profileId },
    skip: !user?.profileId,
  });

  const { data: periodsData } = useQuery<any>(GET_ACTIVE_PERIOD);
  const activePeriod = periodsData?.thesisPeriods?.find(
    (p: any) => p.status === "active"
  );

  const [editingTopicId, setEditingTopicId] = useState<string | null>(null);

  const [createTopic] = useMutation(CREATE_TOPIC, {
    onCompleted: () => {
      setWarningState({
        isOpen: true,
        type: "success",
        message: "Đề xuất đề tài thành công!",
      });
      resetForm();
      refetchTopics();
    },
    onError: (error) => {
      setWarningState({
        isOpen: true,
        type: "error",
        message: `Lỗi: ${error.message}`,
      });
    },
  });

  const [updateTopic] = useMutation(UPDATE_TOPIC, {
    onCompleted: () => {
      setWarningState({
        isOpen: true,
        type: "success",
        message: "Cập nhật đề tài thành công!",
      });
      resetForm();
      refetchTopics();
    },
    onError: (error) => {
      // Special handling for the "backend blocked" update
      if (error.message.includes("approved")) {
        setWarningState({
          isOpen: true,
          type: "error",
          message: "Không thể chỉnh sửa đề tài đã được duyệt!",
        });
      } else {
        setWarningState({
          isOpen: true,
          type: "error",
          message: `Lỗi: ${error.message}`,
        });
      }
    },
  });

  const [deleteTopic] = useMutation(DELETE_TOPIC, {
    onCompleted: () => {
      setWarningState({
        isOpen: true,
        type: "success",
        message: "Xóa đề tài thành công!",
      });
      refetchTopics();
    },
    onError: (error) => {
      if (error.message.includes("approved")) {
        setWarningState({
          isOpen: true,
          type: "error",
          message: "Không thể xóa đề tài đã được duyệt!",
        });
      } else {
        setWarningState({
          isOpen: true,
          type: "error",
          message: `Lỗi: ${error.message}`,
        });
      }
    },
  });

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    requirements: "",
    references: "",
    specialization: "",
    maxStudents: 2,
  });

  const resetForm = () => {
    setShowModal(false);
    setEditingTopicId(null);
    setFormData({
      title: "",
      description: "",
      requirements: "",
      references: "",
      specialization: "",
      maxStudents: 2,
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!activePeriod) {
      setWarningState({
        isOpen: true,
        type: "warning",
        message: "Hiện không có kỳ khóa luận nào đang mở.",
      });
      return;
    }

    // Validation: Max Students must not exceed Period Max Group Size
    if (
      activePeriod.maxGroupSize &&
      formData.maxStudents > activePeriod.maxGroupSize
    ) {
      setWarningState({
        isOpen: true,
        type: "warning",
        message: `Số lượng sinh viên tối đa không được vượt quá quy định của kỳ (${activePeriod.maxGroupSize} sinh viên/nhóm).`,
      });
      return;
    }

    const input = {
      title: formData.title,
      description: formData.description,
      requirements: formData.requirements,
      studyReferences: formData.references
        .split("\n")
        .filter((line) => line.trim() !== ""),
      teacherId: user?.profileId || "",
      specialization: formData.specialization,
      maxStudents: formData.maxStudents,
      periodId: activePeriod.id,
    };

    if (editingTopicId) {
      updateTopic({
        variables: {
          id: editingTopicId,
          updateTopicInput: input,
        },
      });
    } else {
      createTopic({
        variables: {
          createTopicInput: input,
        },
      });
    }
  };

  const handleEdit = (topic: any) => {
    setEditingTopicId(topic.id);
    setFormData({
      title: topic.title,
      description: topic.description,
      requirements: topic.requirements,
      references: topic.studyReferences ? topic.studyReferences.join("\n") : "",
      specialization: topic.specialization,
      maxStudents: topic.maxStudents,
    });
    setShowModal(true);
  };

  const handleDelete = (id: string) => {
    if (confirm("Bạn có chắc chắn muốn xóa đề tài này?")) {
      deleteTopic({ variables: { id } });
    }
  };

  const openInviteModal = (topic: any) => {
    setSelectedTopicForInvite({ id: topic.id, title: topic.title });
    setInviteModalOpen(true);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "approved":
        return (
          <span className="flex items-center space-x-1 px-3 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium">
            <CheckCircle size={14} />
            <span>Đã duyệt</span>
          </span>
        );
      case "pending":
        return (
          <span className="flex items-center space-x-1 px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs font-medium">
            <Clock size={14} />
            <span>Chờ duyệt</span>
          </span>
        );
      case "rejected":
        return (
          <span className="flex items-center space-x-1 px-3 py-1 bg-red-100 text-red-800 rounded-full text-xs font-medium">
            <XCircle size={14} />
            <span>Từ chối</span>
          </span>
        );
      case "assigned":
        return (
          <span className="flex items-center space-x-1 px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">
            <CheckCircle size={14} />
            <span>Đã giao</span>
          </span>
        );
      default:
        return null;
    }
  };

  const myTopics = topicsData?.teacherTopics || [];

  return (
    <>
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <div className="bg-green-100 p-2 rounded-lg">
              <Lightbulb size={24} className="text-green-600" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">
                Đề xuất đề tài
              </h2>
              <p className="text-sm text-gray-500">
                Quản lý các đề tài đã đề xuất
              </p>
            </div>
          </div>

          <button
            onClick={() => {
              resetForm();
              setShowModal(true);
            }}
            className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            <Plus size={20} />
            <span className="font-medium">Đề xuất mới</span>
          </button>
        </div>

        <div className="space-y-4">
          {topicsLoading ? (
            <div className="text-center py-12">Đang tải dữ liệu...</div>
          ) : myTopics.length === 0 ? (
            <div className="text-center py-12 bg-gray-50 rounded-xl">
              <Lightbulb size={48} className="mx-auto text-gray-300 mb-3" />
              <p className="text-gray-500">Chưa có đề tài nào</p>
              <button
                onClick={() => {
                  resetForm();
                  setShowModal(true);
                }}
                className="mt-4 text-green-600 hover:text-green-700 font-medium"
              >
                Đề xuất đề tài đầu tiên
              </button>
            </div>
          ) : (
            myTopics.map((topic: any) => (
              <div
                key={topic.id}
                className="border border-gray-200 rounded-xl p-5 hover:shadow-md transition-all"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <span className="px-2 py-1 bg-green-100 text-green-700 rounded text-xs font-semibold">
                        {topic.code || "CHƯA CÓ MÃ"}
                      </span>
                      {getStatusBadge(topic.status)}
                      <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs">
                        {topic.specialization}
                      </span>
                    </div>

                    <h3 className="text-lg font-bold text-gray-900 mb-2">
                      {topic.title}
                    </h3>
                    <p className="text-sm text-gray-600 mb-3 leading-relaxed">
                      {topic.description}
                    </p>

                    <div className="bg-gray-50 rounded-lg p-3 mb-3">
                      <p className="text-xs font-semibold text-gray-700 mb-1">
                        Yêu cầu:
                      </p>
                      <p className="text-sm text-gray-600">
                        {topic.requirements}
                      </p>
                    </div>

                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">
                        Sinh viên đăng ký:{" "}
                        <strong className="text-gray-900">
                          {topic.currentStudents || 0}/{topic.maxStudents}
                        </strong>
                      </span>
                      <span className="text-xs text-gray-500">
                        Ngày tạo:{" "}
                        {new Date(parseInt(topic.createdAt)).toLocaleDateString(
                          "vi-VN"
                        )}
                      </span>
                    </div>
                  </div>

                  <div className="ml-4 flex flex-col space-y-2">
                    {/* Invite Button */}
                    {topic.status === "approved" &&
                      (topic.currentStudents || 0) < topic.maxStudents && (
                        <button
                          onClick={() => openInviteModal(topic)}
                          title="Mời sinh viên"
                          className="p-2 text-purple-600 hover:bg-purple-50 rounded-lg transition-colors flex items-center justify-center border border-purple-200"
                        >
                          <UserPlus size={18} />
                        </button>
                      )}
                    <button
                      onClick={() => handleEdit(topic)}
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors flex items-center justify-center border border-blue-200"
                    >
                      <Edit size={18} />
                    </button>
                    <button
                      onClick={() => handleDelete(topic.id)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors flex items-center justify-center border border-red-200"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-xl font-bold text-gray-900">
                {editingTopicId ? "Cập nhật đề tài" : "Đề xuất đề tài mới"}
              </h3>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tên đề tài *
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) =>
                    setFormData({ ...formData, title: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="Nhập tên đề tài"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Chuyên ngành *
                </label>
                <select
                  value={formData.specialization}
                  onChange={(e) =>
                    setFormData({ ...formData, specialization: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  required
                >
                  <option value="">Chọn chuyên ngành</option>
                  <option value="Trí tuệ nhân tạo">Trí tuệ nhân tạo</option>
                  <option value="Phát triển phần mềm">
                    Phát triển phần mềm
                  </option>
                  <option value="An ninh mạng">An ninh mạng</option>
                  <option value="Khoa học dữ liệu">Khoa học dữ liệu</option>
                  <option value="Hệ thống thông tin">Hệ thống thông tin</option>
                  <option value="Công nghệ phần mềm">Công nghệ phần mềm</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Mô tả đề tài *
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  rows={4}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent resize-none"
                  placeholder="Mô tả chi tiết về đề tài, mục tiêu và phạm vi thực hiện..."
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Yêu cầu sinh viên *
                </label>
                <textarea
                  value={formData.requirements}
                  onChange={(e) =>
                    setFormData({ ...formData, requirements: e.target.value })
                  }
                  rows={3}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent resize-none"
                  placeholder="Kiến thức và kỹ năng cần thiết..."
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tài liệu tham khảo
                </label>
                <textarea
                  value={formData.references}
                  onChange={(e) =>
                    setFormData({ ...formData, references: e.target.value })
                  }
                  rows={3}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent resize-none"
                  placeholder="Danh sách tài liệu tham khảo (mỗi tài liệu một dòng)..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Số lượng sinh viên tối đa (Tối đa:{" "}
                  {activePeriod ? activePeriod.maxGroupSize : "..."})
                </label>
                <input
                  type="number"
                  min="1"
                  max={activePeriod ? activePeriod.maxGroupSize : 5}
                  value={formData.maxStudents}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      maxStudents: parseInt(e.target.value),
                    })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>

              <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
                <button
                  type="button"
                  onClick={resetForm}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  disabled={!activePeriod}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:bg-gray-400"
                >
                  {editingTopicId ? "Cập nhật" : "Đề xuất đề tài"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Invite Student Modal */}
      {selectedTopicForInvite && (
        <InviteStudentModal
          key={selectedTopicForInvite.id} // Force reset state when topic changes
          topicId={selectedTopicForInvite.id}
          topicTitle={selectedTopicForInvite.title}
          isOpen={inviteModalOpen}
          onClose={() => {
            setInviteModalOpen(false);
            setSelectedTopicForInvite(null);
          }}
        />
      )}

      {/* Reusable Warning Modal */}
      <WarningModal
        isOpen={warningState.isOpen}
        onClose={() => setWarningState({ ...warningState, isOpen: false })}
        type={warningState.type}
        message={warningState.message}
      />
    </>
  );
};

export default TopicProposal;
