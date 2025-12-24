"use client";
import React, { useState } from "react";
import { useQuery, useMutation } from "@apollo/client/react";
import { gql } from "@apollo/client";
import {
  Plus,
  Edit,
  Trash2,
  X,
  Users,
  Calendar,
  Briefcase,
  AlertTriangle,
  CheckCircle,
  HelpCircle,
} from "lucide-react";

// --- GraphQL ---
const GET_INITIAL_DATA = gql`
  query GetCouncilManagementData {
    councils {
      id
      name
      presidentId
      secretaryId
      reviewerId
      commissionerId
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
    thesisPeriods {
      id
      status
    }
    getAllRegistrations {
      id
      status
      topic {
        id
      }
    }
  }
`;
// Note: Assuming 'thesisPeriods', 'teachers', 'topics', 'councils' are all available root queries.
// If not, we might need separate queries. Based on standard resolvers, they should be there.

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
  const { data, loading, error, refetch } = useQuery<any>(GET_INITIAL_DATA);

  const [createCouncil] = useMutation(CREATE_COUNCIL, {
    onCompleted: () => {
      alert("Tạo hội đồng thành công!");
      refetch();
      closeModal();
    },
    onError: (err) => {
      alert("Lỗi: " + err.message);
      console.error(err);
    },
  });

  const [updateCouncil] = useMutation(UPDATE_COUNCIL, {
    onCompleted: () => {
      alert("Cập nhật hội đồng thành công!");
      refetch();
      closeModal();
    },
    onError: (err) => alert("Lỗi: " + err.message),
  });

  const [deleteCouncil] = useMutation(DELETE_COUNCIL, {
    onCompleted: () => {
      alert("Đã xóa hội đồng!");
      refetch();
    },
    onError: (err) => alert("Lỗi: " + err.message),
  });

  // Derived Data
  const councils = data?.councils || [];
  const teachers = data?.teachers || [];
  const allTopics = data?.topics || [];
  const allRegistrations = data?.getAllRegistrations || [];
  const activePeriod = data?.thesisPeriods?.find(
    (p: any) => p.status === "active"
  );

  // Filter topics based on REGISTRATION status
  // We prioritize 'defense_ready' and 'defense_registered'
  const defenseReadyTopicIds = allRegistrations
    .filter((r: any) =>
      ["defense_ready", "defense_registered", "thesis_approved"].includes(
        r.status
      )
    )
    .map((r: any) => r.topic?.id);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCouncil, setSelectedCouncil] = useState<any | null>(null);

  const initialFormState = {
    name: "",
    presidentId: "",
    secretaryId: "",
    memberIds: [] as string[],
    reviewerId: "",
    commissionerId: "", // Added
    topicIds: [] as string[],
    status: "draft",
    description: "",
    date: "",
    time: "",
    room: "",
  };
  const [formData, setFormData] = useState(initialFormState);

  const availableTopics = allTopics.filter(
    (t: any) =>
      defenseReadyTopicIds.includes(t.id) ||
      formData.topicIds.includes(t.id) ||
      ["defense_ready", "defense_registered"].includes(t.status)
  );

  const openModal = (council?: any) => {
    if (council) {
      setSelectedCouncil(council);
      setFormData({
        name: council.name,
        presidentId: council.presidentId,
        secretaryId: council.secretaryId,
        memberIds: council.memberIds || [],
        reviewerId: council.reviewerId,
        commissionerId: council.commissionerId || "",
        topicIds: council.topicIds || [],
        status: council.status,
        description: council.description || "",
        date: council.date || "",
        time: council.time || "",
        room: council.room || "",
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

    if (!activePeriod && !selectedCouncil) {
      alert("Không có kỳ khóa luận đang hoạt động để tạo hội đồng!");
      return;
    }

    // Member Validation
    const allMembers = [
      formData.presidentId,
      formData.secretaryId,
      formData.reviewerId,
      formData.commissionerId,
      ...(formData.memberIds || []),
    ].filter(Boolean) as string[];

    if (new Set(allMembers).size !== allMembers.length) {
      alert(
        "Một giảng viên không thể đảm nhiệm nhiều vai trò trong cùng hội đồng!"
      );
      return;
    }

    const inputData = {
      ...formData,
      periodId: activePeriod?.id || councils[0]?.periodId, // Fallback for update
    };

    if (selectedCouncil) {
      updateCouncil({
        variables: {
          input: {
            id: selectedCouncil.id,
            ...inputData,
          },
        },
      });
    } else {
      createCouncil({
        variables: {
          input: inputData,
        },
      });
    }
  };

  const handleDelete = (id: string) => {
    if (confirm("Bạn có chắc chắn muốn xóa hội đồng này không?")) {
      deleteCouncil({ variables: { id } });
    }
  };

  const getTeacherName = (id?: string) => {
    if (!id) return "-";
    return teachers.find((t: any) => t.id === id)?.name || "Unknown";
  };

  const getTopicTitle = (id: string) => {
    return allTopics.find((t: any) => t.id === id)?.title || id;
  };

  if (loading)
    return (
      <div className="p-8 text-center text-gray-500">Đang tải dữ liệu...</div>
    );
  if (error)
    return (
      <div className="p-8 text-center text-red-500">
        Lỗi kết nối: {error.message}
      </div>
    );

  return (
    <div className="text-black space-y-6 animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
            <Users className="text-blue-600" />
            Quản lý Hội đồng Bảo vệ
          </h2>
          <p className="text-sm text-gray-500">
            Tổ chức và phân công hội đồng chấm khóa luận
          </p>
        </div>
        <button
          onClick={() => openModal()}
          disabled={!activePeriod}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition shadow-sm disabled:opacity-50"
        >
          <Plus size={20} />
          <span>Thêm hội đồng</span>
        </button>
      </div>

      {!activePeriod && (
        <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-lg flex items-center gap-2 text-yellow-800">
          <AlertTriangle size={20} />
          <span>
            Chưa có Kỳ khóa luận nào đang hoạt động (Active). Vui lòng kích hoạt
            kỳ khóa luận trước.
          </span>
        </div>
      )}

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
                    {council.status === "published" ? "Đã công bố" : "Bản nháp"}
                  </span>
                </div>
                {council.description && (
                  <p className="text-sm text-gray-500 mt-1">
                    {council.description}
                  </p>
                )}
                <div className="flex items-center gap-4 mt-2 text-sm text-gray-600">
                  {council.date ? (
                    <span className="text-green-600 flex items-center gap-1 font-bold">
                      <Calendar size={14} />{" "}
                      {new Date(council.date).toLocaleDateString("vi-VN")}{" "}
                      {council.time} - Phòng {council.room}
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
                  <li className="flex justify-between border-b border-gray-200 pb-1">
                    <span className="text-gray-500">Chủ tịch:</span>
                    <span className="font-bold text-gray-800">
                      {getTeacherName(council.presidentId)}
                    </span>
                  </li>
                  <li className="flex justify-between border-b border-gray-200 pb-1">
                    <span className="text-gray-500">Thư ký:</span>
                    <span className="font-medium">
                      {getTeacherName(council.secretaryId)}
                    </span>
                  </li>
                  <li className="flex justify-between border-b border-gray-200 pb-1">
                    <span className="text-gray-500">Phản biện:</span>
                    <span className="font-medium">
                      {getTeacherName(council.reviewerId)}
                    </span>
                  </li>
                  {council.commissionerId && (
                    <li className="flex justify-between border-b border-gray-200 pb-1">
                      <span className="text-gray-500">Ủy viên:</span>
                      <span className="font-medium">
                        {getTeacherName(council.commissionerId)}
                      </span>
                    </li>
                  )}
                  {council.memberIds?.map((mid: any, idx: number) => (
                    <li
                      key={mid}
                      className="flex justify-between border-b border-gray-200 pb-1"
                    >
                      <span className="text-gray-500">
                        Thành viên {idx + 1}:
                      </span>
                      <span className="font-medium">{getTeacherName(mid)}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Assignments */}
              <div>
                <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  <Briefcase size={16} className="text-gray-500" /> Đề tài được
                  phân công ({council.topicIds?.length || 0})
                </h4>
                {council.topicIds?.length > 0 ? (
                  <ul className="space-y-2 text-sm list-decimal list-inside text-gray-700 max-h-40 overflow-y-auto pr-2">
                    {council.topicIds.map((tid: any) => (
                      <li
                        key={tid}
                        className="truncate"
                        title={getTopicTitle(tid)}
                      >
                        {getTopicTitle(tid)}
                      </li>
                    ))}
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
            Chưa có hội đồng nào. Nhấn "Thêm hội đồng" để bắt đầu.
          </div>
        )}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto flex flex-col">
            <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center sticky top-0 bg-white z-10">
              <h3 className="text-lg font-bold text-gray-900">
                {selectedCouncil ? "Cập nhật Hội đồng" : "Tạo Hội đồng Mới"}
              </h3>
              <button
                onClick={closeModal}
                className="text-gray-400 hover:text-gray-600"
              >
                <X size={24} />
              </button>
            </div>

            <form
              onSubmit={handleSave}
              className="p-6 space-y-6 overflow-y-auto flex-1 text-black"
            >
              {/* Basic Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <label className="block text-sm font-bold text-gray-700 mb-1">
                    Tên hội đồng
                  </label>
                  <input
                    required
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    placeholder="VD: Hội đồng Bảo vệ K20 - CNPM 01"
                  />
                </div>

                <div className="md:col-span-2 grid grid-cols-3 gap-4 bg-gray-50 p-4 rounded-lg">
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1">
                      Ngày bảo vệ
                    </label>
                    <input
                      type="date"
                      className="w-full px-3 py-2 border rounded-lg"
                      value={formData.date}
                      onChange={(e) =>
                        setFormData({ ...formData, date: e.target.value })
                      }
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1">
                      Giờ
                    </label>
                    <input
                      type="time"
                      className="w-full px-3 py-2 border rounded-lg"
                      value={formData.time}
                      onChange={(e) =>
                        setFormData({ ...formData, time: e.target.value })
                      }
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1">
                      Phòng
                    </label>
                    <input
                      type="text"
                      className="w-full px-3 py-2 border rounded-lg"
                      placeholder="VD: C301"
                      value={formData.room}
                      onChange={(e) =>
                        setFormData({ ...formData, room: e.target.value })
                      }
                    />
                  </div>
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Ghi chú
                  </label>
                  <textarea
                    className="w-full px-3 py-2 border rounded-lg"
                    rows={2}
                    value={formData.description}
                    onChange={(e) =>
                      setFormData({ ...formData, description: e.target.value })
                    }
                    placeholder="Thông tin thêm..."
                  />
                </div>
              </div>

              {/* Members Section */}
              <div className="space-y-3 pt-4 border-t border-gray-100">
                <h4 className="font-bold text-gray-900 flex items-center gap-2">
                  <Users size={18} /> Thành phần hội đồng
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Chủ tịch <span className="text-red-500">*</span>
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
                      Thư ký <span className="text-red-500">*</span>
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
                      Phản biện <span className="text-red-500">*</span>
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
                      Ủy viên (Optional)
                    </label>
                    <select
                      className="w-full px-3 py-2 border rounded-lg"
                      value={formData.commissionerId}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          commissionerId: e.target.value,
                        })
                      }
                    >
                      <option value="">-- Chọn Ủy viên --</option>
                      {teachers.map((t: any) => (
                        <option key={t.id} value={t.id}>
                          {t.name} ({t.code})
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              {/* Topics Selection */}
              <div className="pt-4 border-t border-gray-100">
                <h4 className="font-bold text-gray-900 mb-2 flex items-center gap-2">
                  <Briefcase size={18} /> Phân công Đề tài
                </h4>
                <p className="text-xs text-gray-500 mb-2">
                  Chọn các đề tài sẽ được bảo vệ tại hội đồng này.
                </p>
                <div className="max-h-60 overflow-y-auto border rounded-lg p-2 space-y-1 bg-gray-50">
                  {availableTopics.length > 0 ? (
                    availableTopics.map((topic: any) => (
                      <label
                        key={topic.id}
                        className="flex items-center gap-3 p-2 hover:bg-white rounded cursor-pointer transition"
                      >
                        <input
                          type="checkbox"
                          className="w-4 h-4 text-blue-600 rounded"
                          checked={formData.topicIds.includes(topic.id)}
                          onChange={(e) => {
                            const isChecked = e.target.checked;
                            setFormData((prev) => {
                              const current = prev.topicIds;
                              if (isChecked)
                                return {
                                  ...prev,
                                  topicIds: [...current, topic.id],
                                };
                              else
                                return {
                                  ...prev,
                                  topicIds: current.filter(
                                    (id) => id !== topic.id
                                  ),
                                };
                            });
                          }}
                        />
                        <div className="flex-1">
                          <div className="font-medium text-sm text-gray-900">
                            {topic.title}
                          </div>
                          <div className="text-xs text-gray-500">
                            Trạng thái: {topic.status}
                          </div>
                        </div>
                      </label>
                    ))
                  ) : (
                    <p className="text-center text-gray-400 py-4 italic">
                      Không có đề tài khả dụng (Đã duyệt/Sẵn sàng bảo vệ)
                    </p>
                  )}
                </div>
              </div>

              {/* Status */}
              <div className="flex gap-4 items-center pt-4 border-t border-gray-100">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="status"
                    value="draft"
                    checked={formData.status === "draft"}
                    onChange={() =>
                      setFormData({ ...formData, status: "draft" })
                    }
                  />
                  <span className="text-sm font-medium">Lưu nháp</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="status"
                    value="published"
                    checked={formData.status === "published"}
                    onChange={() =>
                      setFormData({ ...formData, status: "published" })
                    }
                  />
                  <span className="text-sm font-medium text-green-700 font-bold">
                    Công bố (Sinh viên thấy được)
                  </span>
                </label>
              </div>

              <div className="pt-4 flex justify-end gap-3 border-t border-gray-100 mt-6 sticky bottom-0 bg-white z-10 pb-2">
                <button
                  type="button"
                  onClick={closeModal}
                  className="px-5 py-2 text-gray-700 hover:bg-gray-100 rounded-lg font-medium"
                >
                  Hủy bỏ
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-bold shadow-lg shadow-blue-200"
                >
                  {selectedCouncil ? "Lưu Thay Đổi" : "Tạo Hội Đồng"}
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
