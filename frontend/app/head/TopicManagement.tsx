"use client";
import React, { useState } from "react";
import {
  Plus,
  Search,
  CheckCircle,
  XCircle,
  Edit,
  Trash2,
  X,
  FileText,
  AlertCircle,
} from "lucide-react";
import { gql } from "@apollo/client";
import { useQuery, useMutation } from "@apollo/client/react";

import { Topic, Teacher, ThesisPeriod } from "../../data/mockData";

// --- GraphQL Queries & Mutations ---

const GET_TOPICS = gql`
  query GetTopics {
    topics {
      id
      code
      title
      description
      requirements
      studyReferences
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

const GET_TEACHERS = gql`
  query GetTeachers {
    teachers {
      id
      code
      name
    }
  }
`;

const GET_ACTIVE_PERIOD = gql`
  query GetActiveThesisPeriod {
    thesisPeriods {
      id
      status
      maxGroupSize
    }
  }
`;

const CREATE_TOPIC = gql`
  mutation CreateTopic($createTopicInput: CreateTopicInput!) {
    createTopic(createTopicInput: $createTopicInput) {
      id
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
      specialization
      maxStudents
      status
      teacherId
    }
  }
`;

const DELETE_TOPIC = gql`
  mutation DeleteTopic($id: String!) {
    deleteTopic(id: $id)
  }
`;

const TopicManagement: React.FC = () => {
  // --- State ---
  const [filterStatus, setFilterStatus] = useState<
    "all" | "pending" | "approved" | "rejected"
  >("all");
  const [searchTerm, setSearchTerm] = useState("");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTopic, setSelectedTopic] = useState<any | null>(null);

  // Confirmation Modal State
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [confirmAction, setConfirmAction] = useState<
    "approve" | "reject" | null
  >(null);
  const [topicToConfirm, setTopicToConfirm] = useState<string | null>(null);

  const initialFormState = {
    title: "",
    description: "",
    requirements: "",
    specialization: "",
    maxStudents: 2,
    teacherId: "",
  };
  const [formData, setFormData] = useState(initialFormState);

  // --- GraphQL Hooks ---
  const {
    data: topicsData,
    loading: topicsLoading,
    refetch: refetchTopics,
  } = useQuery<{ topics: Topic[] }>(GET_TOPICS);

  const { data: teachersData } = useQuery<{ teachers: Teacher[] }>(
    GET_TEACHERS
  );
  const { data: periodsData } = useQuery<{ thesisPeriods: ThesisPeriod[] }>(
    GET_ACTIVE_PERIOD
  );

  const [createTopic] = useMutation(CREATE_TOPIC, {
    onCompleted: () => {
      alert("Thêm đề tài thành công!");
      refetchTopics();
      closeModal();
    },
    onError: (err) => alert(`Lỗi: ${err.message}`),
  });

  const [updateTopic] = useMutation(UPDATE_TOPIC, {
    onCompleted: () => {
      alert("Cập nhật thành công!");
      refetchTopics();
      closeModal();
      closeConfirmModal();
    },
    onError: (err) => alert(`Lỗi: ${err.message}`),
  });

  const [deleteTopic] = useMutation(DELETE_TOPIC, {
    onCompleted: () => {
      alert("Đã xóa đề tài!");
      refetchTopics();
    },
    onError: (err) => alert(`Lỗi: ${err.message}`),
  });

  const topics = topicsData?.topics || [];
  const teachers = teachersData?.teachers || [];
  const activePeriod = periodsData?.thesisPeriods?.find(
    (p: any) => p.status === "active"
  );

  // Stats
  const totalTopics = topics.length;
  const pendingTopics = topics.filter(
    (t: any) => t.status === "pending"
  ).length;
  const approvedTopics = topics.filter(
    (t: any) => t.status === "approved"
  ).length;

  // Handlers
  const openApproveModal = (id: string) => {
    setTopicToConfirm(id);
    setConfirmAction("approve");
    setIsConfirmModalOpen(true);
  };

  const openRejectModal = (id: string) => {
    setTopicToConfirm(id);
    setConfirmAction("reject");
    setIsConfirmModalOpen(true);
  };

  const handleConfirmAction = () => {
    if (!topicToConfirm || !confirmAction) return;

    updateTopic({
      variables: {
        id: topicToConfirm,
        updateTopicInput: {
          status: confirmAction === "approve" ? "approved" : "rejected",
        },
      },
    });
  };

  const closeConfirmModal = () => {
    setIsConfirmModalOpen(false);
    setTopicToConfirm(null);
    setConfirmAction(null);
  };

  const handleDelete = (id: string) => {
    if (confirm("Bạn có chắc chắn muốn xóa đề tài này?")) {
      deleteTopic({ variables: { id } });
    }
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();

    if (!activePeriod && !selectedTopic) {
      alert("Không có kỳ luân văn đang hoạt động để tạo đề tài mới.");
      return;
    }

    const input = {
      title: formData.title,
      description: formData.description,
      requirements: formData.requirements,
      specialization: formData.specialization,
      maxStudents: formData.maxStudents,
      teacherId: formData.teacherId,
    };

    if (selectedTopic) {
      updateTopic({
        variables: {
          id: selectedTopic.id,
          updateTopicInput: input,
        },
      });
    } else {
      if (!activePeriod) {
        alert("Không xác định được kỳ khóa luận đang hoạt động.");
        return;
      }
      createTopic({
        variables: {
          createTopicInput: {
            ...input,
            studyReferences: [], // Assuming optional or empty for now
            periodId: activePeriod.id,
          },
        },
      });
    }
  };

  const openModal = (topic?: any) => {
    if (topic) {
      setSelectedTopic(topic);
      setFormData({
        title: topic.title,
        description: topic.description || "",
        requirements: topic.requirements || "",
        specialization: topic.specialization || "",
        maxStudents: topic.maxStudents,
        teacherId: topic.teacherId,
      });
    } else {
      setSelectedTopic(null);
      setFormData(initialFormState);
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedTopic(null);
  };

  // Filter
  const filteredTopics = topics.filter((t: any) => {
    const matchesStatus = filterStatus === "all" || t.status === filterStatus;
    const matchesSearch =
      t.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (t.code && t.code.toLowerCase().includes(searchTerm.toLowerCase()));
    return matchesStatus && matchesSearch;
  });

  return (
    <div className="space-y-6">
      {/* Header & Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200 flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-500">Tổng đề tài</p>
            <h3 className="text-2xl font-bold text-gray-900">{totalTopics}</h3>
          </div>
          <div className="p-3 bg-blue-50 text-blue-600 rounded-lg">
            <FileText size={24} />
          </div>
        </div>
        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200 flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-500">Chờ duyệt</p>
            <h3 className="text-2xl font-bold text-yellow-600">
              {pendingTopics}
            </h3>
          </div>
          <div className="p-3 bg-yellow-50 text-yellow-600 rounded-lg">
            <AlertCircle size={24} />
          </div>
        </div>
        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200 flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-500">Đã duyệt</p>
            <h3 className="text-2xl font-bold text-green-600">
              {approvedTopics}
            </h3>
          </div>
          <div className="p-3 bg-green-50 text-green-600 rounded-lg">
            <CheckCircle size={24} />
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="flex flex-col sm:flex-row justify-between gap-4">
        <div className="flex gap-2">
          <div className="relative">
            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              size={20}
            />
            <input
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none w-full sm:w-64"
              placeholder="Tìm kiếm mã, tên đề tài..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <select
            className="px-4 py-2 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value as any)}
          >
            <option value="all">Tất cả trạng thái</option>
            <option value="pending">Chờ duyệt</option>
            <option value="approved">Đã duyệt</option>
            <option value="rejected">Từ chối</option>
          </select>
        </div>
        <button
          onClick={() => openModal()}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition shadow-sm"
        >
          <Plus size={20} />
          <span>Thêm đề tài</span>
        </button>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase">
                  Mã
                </th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase w-1/3">
                  Tên đề tài
                </th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase">
                  GVHD
                </th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase">
                  SL SV
                </th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase">
                  Trạng thái
                </th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase text-right">
                  Thao tác
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {topicsLoading ? (
                <tr>
                  <td
                    colSpan={6}
                    className="px-6 py-8 text-center text-gray-500"
                  >
                    Đang tải dữ liệu...
                  </td>
                </tr>
              ) : filteredTopics.length > 0 ? (
                filteredTopics.map((topic: any) => {
                  const teacher = teachers.find(
                    (t: any) => t.id === topic.teacherId
                  );
                  const teacherName = teacher ? teacher.name : "Unknown";

                  return (
                    <tr key={topic.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 font-mono text-sm text-gray-600">
                        {topic.code || "---"}
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-sm font-medium text-gray-900 line-clamp-2">
                          {topic.title}
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                          {topic.specialization}
                        </p>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-700 w-44">
                        <div className="truncate" title={teacherName}>
                          {teacherName}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-700">
                        {topic.currentStudents || 0}/{topic.maxStudents}
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex items-center px-3.5 py-1 rounded-full text-xs font-medium capitalize 
                                        ${
                                          topic.status === "approved"
                                            ? "bg-green-100 text-green-800"
                                            : topic.status === "pending"
                                            ? "bg-yellow-100 text-yellow-800"
                                            : "bg-red-100 text-red-800"
                                        }`}
                        >
                          {topic.status === "approved"
                            ? "Đã duyệt"
                            : topic.status === "pending"
                            ? "Chờ duyệt"
                            : "Từ chối"}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          {topic.status === "pending" && (
                            <>
                              <button
                                onClick={() => openApproveModal(topic.id)}
                                className="p-1.5 text-green-600 hover:bg-green-50 rounded"
                                title="Duyệt"
                              >
                                <CheckCircle size={18} />
                              </button>
                              <button
                                onClick={() => openRejectModal(topic.id)}
                                className="p-1.5 text-red-600 hover:bg-red-50 rounded"
                                title="Từ chối"
                              >
                                <XCircle size={18} />
                              </button>
                            </>
                          )}
                          <button
                            onClick={() => openModal(topic)}
                            className="p-1.5 text-blue-600 hover:bg-blue-50 rounded"
                            title="Sửa"
                          >
                            <Edit size={18} />
                          </button>
                          <button
                            onClick={() => handleDelete(topic.id)}
                            className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded"
                            title="Xóa"
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td
                    colSpan={6}
                    className="px-6 py-8 text-center text-gray-500 italic"
                  >
                    Không tìm thấy đề tài nào.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center sticky top-0 bg-white">
              <h3 className="text-lg font-bold text-gray-900">
                {selectedTopic ? "Chỉnh sửa đề tài" : "Thêm đề tài mới"}
              </h3>
              <button
                onClick={closeModal}
                className="text-gray-400 hover:text-gray-600"
              >
                <X size={24} />
              </button>
            </div>
            <form onSubmit={handleSave} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Tên đề tài
                </label>
                <input
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg outline-none focus:border-blue-500"
                  value={formData.title}
                  onChange={(e) =>
                    setFormData({ ...formData, title: e.target.value })
                  }
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Chuyên ngành
                  </label>
                  <input
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg outline-none focus:border-blue-500"
                    value={formData.specialization}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        specialization: e.target.value,
                      })
                    }
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Số lượng SV tối đa
                  </label>
                  <input
                    type="number"
                    min={1}
                    max={activePeriod ? activePeriod.maxGroupSize || 3 : 3}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg outline-none focus:border-blue-500"
                    value={formData.maxStudents}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        maxStudents: parseInt(e.target.value),
                      })
                    }
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Giảng viên hướng dẫn
                </label>
                <select
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg outline-none focus:border-blue-500"
                  value={formData.teacherId}
                  onChange={(e) =>
                    setFormData({ ...formData, teacherId: e.target.value })
                  }
                >
                  <option value="">-- Chọn giảng viên --</option>
                  {teachers.map((t: any) => (
                    <option key={t.id} value={t.id}>
                      {t.name} ({t.code})
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Mô tả
                </label>
                <textarea
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg outline-none focus:border-blue-500"
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Yêu cầu
                </label>
                <textarea
                  rows={2}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg outline-none focus:border-blue-500"
                  value={formData.requirements}
                  onChange={(e) =>
                    setFormData({ ...formData, requirements: e.target.value })
                  }
                />
              </div>
              <div className="pt-4 flex justify-end gap-3 border-t border-gray-100 mt-6">
                <button
                  type="button"
                  onClick={closeModal}
                  className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg"
                >
                  Hủy bỏ
                </button>
                <button
                  type="submit"
                  disabled={!activePeriod}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400"
                >
                  {selectedTopic ? "Cập nhật" : "Lưu đề tài"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Confirmation Modal */}
      {isConfirmModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-sm w-full p-6 text-center">
            <div
              className={`mx-auto flex items-center justify-center h-12 w-12 rounded-full mb-4 ${
                confirmAction === "approve" ? "bg-green-100" : "bg-red-100"
              }`}
            >
              {confirmAction === "approve" ? (
                <CheckCircle className="h-6 w-6 text-green-600" />
              ) : (
                <XCircle className="h-6 w-6 text-red-600" />
              )}
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">
              {confirmAction === "approve"
                ? "Xác nhận duyệt"
                : "Xác nhận từ chối"}
            </h3>
            <p className="text-gray-600 mb-6">
              {confirmAction === "approve"
                ? "Bạn có chắc chắn muốn duyệt đề tài này không?"
                : "Bạn có chắc chắn muốn từ chối đề tài này không?"}
            </p>
            <div className="flex justify-center gap-3">
              <button
                onClick={closeConfirmModal}
                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition"
              >
                Hủy bỏ
              </button>
              <button
                onClick={handleConfirmAction}
                className={`px-4 py-2 text-white rounded-lg transition ${
                  confirmAction === "approve"
                    ? "bg-green-600 hover:bg-green-700"
                    : "bg-red-600 hover:bg-red-700"
                }`}
              >
                Xác nhận
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TopicManagement;
