"use client";
import React, { useState, useEffect } from "react";
import {
  mockTopics,
  mockTeachers,
  Topic,
  mockThesisPeriods,
} from "../../data/mockData";
import {
  Plus,
  Search,
  Filter,
  CheckCircle,
  XCircle,
  Edit,
  Trash2,
  X,
  FileText,
  AlertCircle,
} from "lucide-react";

/**
 * Topic Management for Department Head
 * - View list of topics
 * - Approve/Reject pending topics
 * - Create/Edit/Delete topics
 */
const TopicManagement: React.FC = () => {
  // --- State ---
  const [topics, setTopics] = useState<Topic[]>([]);
  const [filterStatus, setFilterStatus] = useState<
    "all" | "pending" | "approved" | "rejected"
  >("all");
  const [searchTerm, setSearchTerm] = useState("");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTopic, setSelectedTopic] = useState<Topic | null>(null);

  // Confirmation Modal State
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [confirmAction, setConfirmAction] = useState<
    "approve" | "reject" | null
  >(null);
  const [topicToConfirm, setTopicToConfirm] = useState<string | null>(null);

  const initialFormState: Partial<Topic> = {
    title: "",
    description: "",
    requirements: "",
    specialization: "",
    maxStudents: 2,
    teacherId: "",
  };
  const [formData, setFormData] = useState(initialFormState);

  // Load data
  useEffect(() => {
    setTopics([...mockTopics]);
  }, []);

  // Stats
  const totalTopics = topics.length;
  const pendingTopics = topics.filter((t) => t.status === "pending").length;
  const approvedTopics = topics.filter((t) => t.status === "approved").length;

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

    if (confirmAction === "approve") {
      const updated = topics.map((t) =>
        t.id === topicToConfirm
          ? { ...t, status: "approved" as const, approverId: "hd1" }
          : t
      );
      setTopics(updated);
      alert("Đã duyệt đề tài!");
    } else if (confirmAction === "reject") {
      const updated = topics.map((t) =>
        t.id === topicToConfirm
          ? { ...t, status: "rejected" as const, approverId: "hd1" }
          : t
      );
      setTopics(updated);
      alert("Đã từ chối đề tài!");
    }

    setIsConfirmModalOpen(false);
    setTopicToConfirm(null);
    setConfirmAction(null);
  };

  const closeConfirmModal = () => {
    setIsConfirmModalOpen(false);
    setTopicToConfirm(null);
    setConfirmAction(null);
  };

  const handleDelete = (id: string) => {
    if (confirm("Bạn có chắc chắn muốn xóa đề tài này?")) {
      setTopics(topics.filter((t) => t.id !== id));
    }
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedTopic) {
      // Edit
      const updated = topics.map((t) =>
        t.id === selectedTopic.id
          ? ({
              ...t,
              ...formData,
              // If edited, maybe reset to approved or keep current?
              // Usually head edits = approved.
            } as Topic)
          : t
      );
      setTopics(updated);
      alert("Cập nhật đề tài thành công!");
    } else {
      // Create - Head creates topics usually for generic or themselves, or assigns to others.
      // Assuming Head creates = Approved immediately? Or Pending?
      // Let's assume Approved.
      const newTopic: Topic = {
        id: `tp${Date.now()}`,
        code: `DT${Math.floor(Math.random() * 1000)}`,
        title: formData.title || "",
        description: formData.description || "",
        requirements: formData.requirements || "",
        references: [],
        teacherId: formData.teacherId || mockTeachers[0].id,
        specialization: formData.specialization || "CNTT",
        status: "approved",
        maxStudents: formData.maxStudents || 2,
        currentStudents: 0,
        createdAt: new Date().toISOString().split("T")[0],
        periodId: mockThesisPeriods[0].id, // Default to first active
        approverId: "hd1",
      };
      setTopics([newTopic, ...topics]);
      alert("Thêm đề tài thành công!");
    }
    closeModal();
  };

  const openModal = (topic?: Topic) => {
    if (topic) {
      setSelectedTopic(topic);
      setFormData({
        title: topic.title,
        description: topic.description,
        requirements: topic.requirements,
        specialization: topic.specialization,
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
  const filteredTopics = topics.filter((t) => {
    const matchesStatus = filterStatus === "all" || t.status === filterStatus;
    const matchesSearch =
      t.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.code.toLowerCase().includes(searchTerm.toLowerCase());
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
              {filteredTopics.length > 0 ? (
                filteredTopics.map((topic) => {
                  const teacherName =
                    mockTeachers.find((t) => t.id === topic.teacherId)?.name ||
                    "Unknown";
                  return (
                    <tr key={topic.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 font-mono text-sm text-gray-600">
                        {topic.code}
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-sm font-medium text-gray-900 line-clamp-2">
                          {topic.title}
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                          {topic.specialization}
                        </p>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-700">
                        {teacherName}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-700">
                        {topic.currentStudents}/{topic.maxStudents}
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex items-center px-3.5 py-1 rounded-sm text-xs font-medium capitalize 
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
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
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
                    max={3}
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
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg outline-none focus:border-blue-500"
                  value={formData.teacherId}
                  onChange={(e) =>
                    setFormData({ ...formData, teacherId: e.target.value })
                  }
                >
                  <option value="">-- Chọn giảng viên --</option>
                  {mockTeachers.map((t) => (
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
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
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
        <div className="fixed inset-0 bg-black bg-opacity-50 z-[60] flex items-center justify-center p-4">
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
