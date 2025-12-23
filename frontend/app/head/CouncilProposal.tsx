"use client";
import React, { useState, useEffect } from "react";
import {
  DefenseCouncil,
  mockCouncils,
  mockTeachers,
  mockTopics,
  mockThesisPeriods,
  mockStudents,
} from "../../data/mockData";
import { useQuery, useMutation } from "@apollo/client/react";
import { gql } from "@apollo/client";
import {
  Plus,
  Search,
  Filter,
  Edit,
  Trash2,
  X,
  Users,
  Calendar,
  MapPin,
  Briefcase,
  AlertTriangle,
} from "lucide-react";

// --- GraphQL Queries & Mutations ---
const GET_DATA = gql`
  query GetData {
    councils {
      id
      name
      presidentId
      secretaryId
      reviewerId
      memberIds
      topicIds
      status
      description
      date
      time
      room
    }
    teachers {
      id
      name
      code
    }
    topics {
      id
      title
      status
    }
  }
`;

const CREATE_COUNCIL = gql`
  mutation CreateCouncil($input: CreateCouncilInput!) {
    createCouncil(createCouncilInput: $input) {
      id
    }
  }
`;

const UPDATE_COUNCIL = gql`
  mutation UpdateCouncil($input: UpdateCouncilInput!) {
    updateCouncil(updateCouncilInput: $input) {
      id
    }
  }
`;

const DELETE_COUNCIL = gql`
  mutation DeleteCouncil($id: ID!) {
    deleteCouncil(id: $id) {
      id
    }
  }
`;

const CouncilProposal: React.FC = () => {
  // --- State & Hooks ---
  const { data, loading, error, refetch } = useQuery<any>(GET_DATA, {
    fetchPolicy: "network-only",
  });

  const [createCouncil] = useMutation(CREATE_COUNCIL, {
    onCompleted: () => {
      alert("Tạo đề xuất hội đồng thành công!");
      refetch();
      closeModal();
    },
    onError: (err) => alert("Lỗi khi tạo hội đồng: " + err.message),
  });

  const [updateCouncil] = useMutation(UPDATE_COUNCIL, {
    onCompleted: () => {
      alert("Cập nhật đề xuất hội đồng thành công!");
      refetch();
      closeModal();
    },
    onError: (err) => alert("Lỗi khi cập nhật hội đồng: " + err.message),
  });

  const [deleteCouncil] = useMutation(DELETE_COUNCIL, {
    onCompleted: () => {
      alert("Đã xóa đề xuất hội đồng thành công!");
      refetch();
    },
    onError: (err) => alert("Lỗi khi xóa: " + err.message),
  });

  const councils = data?.councils || [];
  const teachers = data?.teachers || [];
  const topics = data?.topics || [];

  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCouncil, setSelectedCouncil] = useState<any | null>(null);

  const initialFormState = {
    name: "",
    presidentId: "",
    secretaryId: "",
    memberIds: [] as string[],
    reviewerId: "",
    topicIds: [] as string[],
    status: "draft",
    description: "",
  };
  const [formData, setFormData] = useState(initialFormState);

  const openModal = (council?: any) => {
    if (council) {
      setSelectedCouncil(council);
      setFormData({
        name: council.name,
        presidentId: council.presidentId,
        secretaryId: council.secretaryId,
        memberIds: council.memberIds || [],
        reviewerId: council.reviewerId,
        topicIds: council.topicIds || [],
        status: council.status,
        description: council.description || "",
      });
    } else {
      setSelectedCouncil(null);
      setFormData(initialFormState);
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedCouncil(null);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();

    // Member Validation
    const allMembers = [
      formData.presidentId,
      formData.secretaryId,
      formData.reviewerId,
      ...(formData.memberIds || []),
    ].filter(Boolean) as string[];

    // Check duplicates in same council
    if (new Set(allMembers).size !== allMembers.length) {
      alert(
        "Một giảng viên không thể đảm nhiệm nhiều vai trò trong cùng hội đồng!"
      );
      return;
    }

    if (selectedCouncil) {
      // Update
      updateCouncil({
        variables: {
          input: {
            id: selectedCouncil.id,
            ...formData,
          },
        },
      });
    } else {
      // Create
      createCouncil({
        variables: {
          input: {
            ...formData,
            periodId: "tp001", // TODO: Get active period dynamically or from selection
            status: "draft",
          },
        },
      });
    }
  };

  const handleDelete = (id: string) => {
    if (confirm("Bạn có chắc chắn muốn xóa đề xuất này không?")) {
      deleteCouncil({ variables: { id } });
    }
  };

  // Helper to get teacher name
  const getTeacherName = (id?: string) => {
    if (!id) return "-";
    return teachers.find((t: any) => t.id === id)?.name || "Unknown";
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
        <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
          <Users className="text-blue-600" />
          Đề xuất Hội đồng Bảo vệ
        </h2>
        <button
          onClick={() => openModal()}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition shadow-sm"
        >
          <Plus size={20} />
          <span>Thêm đề xuất</span>
        </button>
      </div>

      {/* List */}
      <div className="grid grid-cols-1 gap-6">
        {councils.map((council: any) => (
          <div
            key={council.id}
            className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition"
          >
            <div className="p-6 border-b border-gray-100 flex justify-between items-start">
              <div>
                <div className="flex items-center gap-3">
                  <h3 className="text-xl font-bold text-blue-800">
                    {council.name}
                  </h3>
                  <span
                    className={`px-2 py-0.5 rounded text-xs font-medium uppercase ${
                      council.status === "published"
                        ? "bg-green-100 text-green-700"
                        : "bg-gray-100 text-gray-700"
                    }`}
                  >
                    {council.status === "published"
                      ? "Đã công bố"
                      : "Nháp / Đề xuất"}
                  </span>
                </div>
                {council.description && (
                  <p className="text-sm text-gray-500 mt-1">
                    {council.description}
                  </p>
                )}
                <div className="flex items-center gap-4 mt-2 text-sm text-gray-600">
                  {/* Status Info */}
                  {council.date ? (
                    <span className="text-green-600 flex items-center gap-1">
                      <Calendar size={14} /> {council.date} - {council.time} (
                      {council.room})
                    </span>
                  ) : (
                    <span className="text-orange-500 italic flex items-center gap-1">
                      <Calendar size={14} /> Chưa xếp lịch
                    </span>
                  )}
                </div>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => openModal(council)}
                  className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"
                  title="Chỉnh sửa"
                >
                  <Edit size={18} />
                </button>
                <button
                  onClick={() => handleDelete(council.id)}
                  className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                  title="Xóa"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </div>

            <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6 bg-gray-50/50">
              {/* Members */}
              <div>
                <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  <Users size={16} className="text-gray-500" /> Thành viên hội
                  đồng
                </h4>
                <ul className="space-y-2 text-sm">
                  <li className="flex justify-between">
                    <span className="text-gray-500">Chủ tịch:</span>
                    <span className="font-medium">
                      {getTeacherName(council.presidentId)}
                    </span>
                  </li>
                  <li className="flex justify-between">
                    <span className="text-gray-500">Thư ký:</span>
                    <span className="font-medium">
                      {getTeacherName(council.secretaryId)}
                    </span>
                  </li>
                  <li className="flex justify-between">
                    <span className="text-gray-500">Phản biện:</span>
                    <span className="font-medium">
                      {getTeacherName(council.reviewerId)}
                    </span>
                  </li>
                  {council.memberIds.map((mid: any, idx: number) => (
                    <li key={mid} className="flex justify-between">
                      <span className="text-gray-500">Ủy viên {idx + 1}:</span>
                      <span className="font-medium">{getTeacherName(mid)}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Assignments */}
              <div>
                <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  <Briefcase size={16} className="text-gray-500" /> Ds Sinh viên
                  / Đề tài
                </h4>
                {council.topicIds.length > 0 ? (
                  <ul className="space-y-2 text-sm list-disc list-inside text-gray-700">
                    {council.topicIds.map((tid: any) => {
                      const topic = mockTopics.find((t) => t.id === tid);
                      return (
                        <li
                          key={tid}
                          className="line-clamp-1"
                          title={topic?.title}
                        >
                          {topic?.title || tid}
                        </li>
                      );
                    })}
                  </ul>
                ) : (
                  <p className="text-sm text-gray-400 italic">
                    Chưa phân công đề tài nào.
                  </p>
                )}
              </div>
            </div>
          </div>
        ))}
        {councils.length === 0 && (
          <div className="text-center py-12 text-gray-500 italic bg-white rounded-xl border border-gray-200">
            Chưa có hội đồng nào được tạo.
          </div>
        )}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center sticky top-0 bg-white z-10">
              <h3 className="text-lg font-bold text-gray-900">
                {selectedCouncil ? "Cập nhật Đề xuất" : "Tạo Đề xuất Hội đồng"}
              </h3>
              <button
                onClick={closeModal}
                className="text-gray-400 hover:text-gray-600"
              >
                <X size={24} />
              </button>
            </div>
            <form onSubmit={handleSave} className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Tên hội đồng
                  </label>
                  <input
                    required
                    className="w-full px-3 py-2 border rounded-lg"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    placeholder="VD: Hội đồng CNTT 1"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Mô tả / Ghi chú
                  </label>
                  <textarea
                    className="w-full px-3 py-2 border rounded-lg"
                    rows={2}
                    value={formData.description || ""}
                    onChange={(e) =>
                      setFormData({ ...formData, description: e.target.value })
                    }
                    placeholder="Nhập mô tả chi tiết cho hội đồng..."
                  />
                </div>
              </div>

              <div className="space-y-3 pt-4 border-t">
                <h4 className="font-semibold text-gray-900">
                  Thành phần hội đồng
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Chủ tịch
                    </label>
                    <select
                      required
                      className="w-full px-3 py-2 border rounded-lg"
                      value={formData.presidentId}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          presidentId: e.target.value,
                        })
                      }
                    >
                      <option value="">-- Chọn Chủ tịch --</option>
                      {teachers.map((t: any) => (
                        <option key={t.id} value={t.id}>
                          {t.name} ({t.code})
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Thư ký
                    </label>
                    <select
                      required
                      className="w-full px-3 py-2 border rounded-lg"
                      value={formData.secretaryId}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          secretaryId: e.target.value,
                        })
                      }
                    >
                      <option value="">-- Chọn Thư ký --</option>
                      {teachers.map((t: any) => (
                        <option key={t.id} value={t.id}>
                          {t.name} ({t.code})
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Phản biện
                    </label>
                    <select
                      required
                      className="w-full px-3 py-2 border rounded-lg"
                      value={formData.reviewerId}
                      onChange={(e) =>
                        setFormData({ ...formData, reviewerId: e.target.value })
                      }
                    >
                      <option value="">-- Chọn Phản biện --</option>
                      {teachers.map((t: any) => (
                        <option key={t.id} value={t.id}>
                          {t.name} ({t.code})
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Ủy viên (Chọn 1 hoặc nhiều)
                    </label>
                    <select
                      multiple
                      className="w-full px-3 py-2 border rounded-lg h-24"
                      value={formData.memberIds}
                      onChange={(e) => {
                        const selected = Array.from(
                          e.target.selectedOptions,
                          (option) => option.value
                        );
                        setFormData({ ...formData, memberIds: selected });
                      }}
                    >
                      {teachers.map((t: any) => (
                        <option key={t.id} value={t.id}>
                          {t.name} ({t.code})
                        </option>
                      ))}
                    </select>
                    <p className="text-xs text-gray-500 mt-1">
                      Giữ Ctrl để chọn nhiều
                    </p>
                  </div>
                </div>
              </div>

              <div className="text-black space-y-3 pt-4 border-t">
                <h4 className="font-semibold text-gray-900">
                  Phân công đề tài
                </h4>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Chọn đề tài bảo vệ (Các đề tài đã được duyệt)
                </label>
                <div className="max-h-48 overflow-y-auto border rounded-lg p-2 space-y-2">
                  {topics
                    .filter((t: any) => t.status === "approved")
                    .map((topic: any) => (
                      <label
                        key={topic.id}
                        className="flex items-start gap-2 p-2 hover:bg-gray-50 rounded cursor-pointer"
                      >
                        <input
                          type="checkbox"
                          className="mt-1"
                          checked={formData.topicIds?.includes(topic.id)}
                          onChange={(e) => {
                            const current = formData.topicIds || [];
                            if (e.target.checked)
                              setFormData({
                                ...formData,
                                topicIds: [...current, topic.id],
                              });
                            else
                              setFormData({
                                ...formData,
                                topicIds: current.filter(
                                  (id) => id !== topic.id
                                ),
                              });
                          }}
                        />
                        <div>
                          <div className="font-medium text-sm">
                            {topic.title}
                          </div>
                          <div className="text-xs text-gray-500">
                            {mockStudents.length} SV tham gia
                          </div>
                        </div>
                      </label>
                    ))}
                </div>
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
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium"
                >
                  {selectedCouncil ? "Lưu thay đổi" : "Tạo đề xuất"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default CouncilProposal;
