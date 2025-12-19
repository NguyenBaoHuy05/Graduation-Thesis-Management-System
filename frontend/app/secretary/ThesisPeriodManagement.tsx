"use client";

import { useState, useEffect } from "react";
import {
  Plus,
  Edit,
  Trash2,
  Calendar,
  Save,
  X,
  ChevronDown,
  ChevronUp,
  Check,
} from "lucide-react";
import { mockThesisPeriods, ThesisPeriod, PeriodMilestone } from "../../data/mockData";

export default function ThesisPeriodManagement() {
  const [periods, setPeriods] = useState<ThesisPeriod[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPeriod, setEditingPeriod] = useState<ThesisPeriod | null>(null);

  // Form states
  const [formData, setFormData] = useState<Partial<ThesisPeriod>>({
    name: "",
    academicYear: "",
    startDate: "",
    endDate: "",
    status: "planning",
    milestones: [],
  });

  useEffect(() => {
    // Load initial data
    setPeriods(mockThesisPeriods);
  }, []);

  const handleOpenModal = (period?: ThesisPeriod) => {
    if (period) {
      setEditingPeriod(period);
      setFormData(JSON.parse(JSON.stringify(period))); // Deep copy for milestones
    } else {
      setEditingPeriod(null);
      setFormData({
        name: "",
        academicYear: "",
        startDate: "",
        endDate: "",
        status: "planning",
        milestones: [],
      });
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingPeriod(null);
  };

  const handleSave = () => {
    if (!formData.name || !formData.startDate || !formData.endDate) {
      alert("Vui lòng điền đầy đủ các trường bắt buộc!");
      return;
    }

    if (editingPeriod) {
      // Update
      setPeriods((prev) =>
        prev.map((p) =>
          p.id === editingPeriod.id ? ({ ...formData, id: p.id } as ThesisPeriod) : p
        )
      );
    } else {
      // Create
      const newPeriod: ThesisPeriod = {
        ...(formData as ThesisPeriod),
        id: `per${Date.now()}`,
        milestones: formData.milestones || [],
      };
      setPeriods((prev) => [newPeriod, ...prev]);
    }
    handleCloseModal();
  };

  const handleDelete = (id: string) => {
    if (confirm("Bạn có chắc chắn muốn xóa kỳ này không?")) {
      setPeriods((prev) => prev.filter((p) => p.id !== id));
    }
  };

  // Milestone Helpers
  const addMilestone = () => {
    const newMilestone: PeriodMilestone = {
      id: `m${Date.now()}`,
      name: "",
      startDate: "",
      type: "other",
    };
    setFormData({
      ...formData,
      milestones: [...(formData.milestones || []), newMilestone],
    });
  };

  const updateMilestone = (index: number, field: keyof PeriodMilestone, value: any) => {
    const updatedMilestones = [...(formData.milestones || [])];
    updatedMilestones[index] = { ...updatedMilestones[index], [field]: value };
    setFormData({ ...formData, milestones: updatedMilestones });
  };

  const removeMilestone = (index: number) => {
    const updatedMilestones = [...(formData.milestones || [])];
    updatedMilestones.splice(index, 1);
    setFormData({ ...formData, milestones: updatedMilestones });
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Quản lý Kỳ Khóa luận</h2>
          <p className="text-gray-500 text-sm">Thiết lập thời gian và các mốc quan trọng</p>
        </div>
        <button
          onClick={() => handleOpenModal()}
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition shadow-sm"
        >
          <Plus size={20} />
          <span>Thêm kỳ mới</span>
        </button>
      </div>

      <div className="grid gap-6">
        {periods.map((period) => (
          <div
            key={period.id}
            className="bg-white border rounded-xl shadow-sm hover:shadow-md transition overflow-hidden"
          >
            <div className="p-5 border-b bg-gray-50 flex flex-col md:flex-row justify-between md:items-center gap-4">
              <div>
                <div className="flex items-center gap-3 mb-1">
                  <h3 className="text-lg font-bold text-blue-900">{period.name}</h3>
                  <span
                    className={`text-xs px-2 py-1 rounded-full border ${
                      period.status === "active"
                        ? "bg-green-100 text-green-700 border-green-200"
                        : period.status === "planning"
                        ? "bg-yellow-100 text-yellow-700 border-yellow-200"
                        : "bg-gray-100 text-gray-600 border-gray-200"
                    }`}
                  >
                    {period.status === "active"
                      ? "Đang diễn ra"
                      : period.status === "planning"
                      ? "Đang lên kế hoạch"
                      : "Đã đóng"}
                  </span>
                </div>
                <div className="flex items-center gap-4 text-sm text-gray-600">
                  <div className="flex items-center gap-1">
                    <Calendar size={14} />
                    <span>
                      {period.startDate} - {period.endDate}
                    </span>
                  </div>
                  <div>Năm học: {period.academicYear}</div>
                </div>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => handleOpenModal(period)}
                  className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition"
                  title="Chỉnh sửa"
                >
                  <Edit size={18} />
                </button>
                <button
                  onClick={() => handleDelete(period.id)}
                  className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition"
                  title="Xóa"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </div>

            {/* Milestones Preview */}
            <div className="p-5 bg-white">
              <h4 className="text-sm font-semibold text-gray-700 mb-3 uppercase tracking-wider">
                Các mốc thời gian ({period.milestones.length})
              </h4>
              <div className="space-y-3">
                {period.milestones.map((milestone) => (
                  <div
                    key={milestone.id}
                    className="flex justify-between items-center text-sm border-b border-gray-100 last:border-0 pb-2 last:pb-0"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 rounded-full bg-blue-400"></div>
                      <span className="font-medium text-gray-800">{milestone.name}</span>
                      <span className="text-xs text-gray-400 italic">({milestone.type})</span>
                    </div>
                    <div className="text-gray-600">
                      {milestone.startDate} {milestone.endDate ? `- ${milestone.endDate}` : ""}
                    </div>
                  </div>
                ))}
                {period.milestones.length === 0 && (
                  <p className="text-sm text-gray-400 italic">Chưa có mốc thời gian nào.</p>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
            <div className="p-5 border-b flex justify-between items-center bg-gray-50">
              <h3 className="text-xl font-bold text-gray-800">
                {editingPeriod ? "Cập nhật Kỳ Khóa luận" : "Tạo Kỳ Khóa luận mới"}
              </h3>
              <button
                onClick={handleCloseModal}
                className="text-gray-400 hover:text-gray-600 transition"
              >
                <X size={24} />
              </button>
            </div>

            <div className="p-6 overflow-y-auto flex-1">
              {/* General Info */}
              <div className="mb-8">
                <h4 className="text-sm font-bold text-gray-900 mb-4 border-l-4 border-blue-500 pl-3 uppercase">
                  Thông tin chung
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Tên kỳ khóa luận <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition"
                      placeholder="VD: Kỳ 1 - Năm học 2025-2026"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Năm học <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition"
                      placeholder="VD: 2025-2026"
                      value={formData.academicYear}
                      onChange={(e) => setFormData({ ...formData, academicYear: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Trạng thái
                    </label>
                    <select
                      className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition"
                      value={formData.status}
                      onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                    >
                      <option value="planning">Lên kế hoạch</option>
                      <option value="active">Đang diễn ra</option>
                      <option value="closed">Đã đóng</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Ngày bắt đầu <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="date"
                      className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition"
                      value={formData.startDate}
                      onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Ngày kết thúc <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="date"
                      className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition"
                      value={formData.endDate}
                      onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                    />
                  </div>
                </div>
              </div>

              {/* Milestones */}
              <div>
                <div className="flex justify-between items-center mb-4">
                  <h4 className="text-sm font-bold text-gray-900 border-l-4 border-purple-500 pl-3 uppercase">
                    Các mốc thời gian
                  </h4>
                  <button
                    onClick={addMilestone}
                    className="text-sm text-blue-600 hover:bg-blue-50 px-3 py-1 rounded-lg transition font-medium"
                  >
                    + Thêm mốc
                  </button>
                </div>

                <div className="space-y-4">
                  {formData.milestones?.map((milestone, index) => (
                    <div
                      key={index}
                      className="bg-gray-50 p-4 rounded-xl border border-gray-200 relative group"
                    >
                      <button
                        onClick={() => removeMilestone(index)}
                        className="absolute top-2 right-2 text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition"
                      >
                        <X size={16} />
                      </button>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
                        <div className="md:col-span-2">
                          <input
                            type="text"
                            className="w-full bg-transparent border-b border-gray-300 focus:border-blue-500 outline-none py-1 font-medium placeholder-gray-400"
                            placeholder="Tên mốc (VD: Đăng ký đề tài)"
                            value={milestone.name}
                            onChange={(e) =>
                              updateMilestone(index, "name", e.target.value)
                            }
                          />
                        </div>
                        <div>
                          <label className="block text-xs text-gray-500 mb-1">Loại</label>
                          <select
                            className="w-full px-2 py-1.5 text-sm border rounded bg-white"
                            value={milestone.type}
                            onChange={(e) =>
                              updateMilestone(index, "type", e.target.value)
                            }
                          >
                            <option value="registration">Đăng ký</option>
                            <option value="submission">Nộp bài</option>
                            <option value="reporting">Báo cáo</option>
                            <option value="defense">Bảo vệ</option>
                            <option value="other">Khác</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-xs text-gray-500 mb-1">Mô tả</label>
                          <input
                            type="text"
                            className="w-full px-2 py-1.5 text-sm border rounded bg-white"
                            placeholder="Mô tả ngắn..."
                            value={milestone.description || ""}
                            onChange={(e) =>
                              updateMilestone(index, "description", e.target.value)
                            }
                          />
                        </div>
                        <div>
                          <label className="block text-xs text-gray-500 mb-1">Bắt đầu</label>
                          <input
                            type="date"
                            className="w-full px-2 py-1.5 text-sm border rounded bg-white"
                            value={milestone.startDate}
                            onChange={(e) =>
                              updateMilestone(index, "startDate", e.target.value)
                            }
                          />
                        </div>
                        <div>
                          <label className="block text-xs text-gray-500 mb-1">Kết thúc</label>
                          <input
                            type="date"
                            className="w-full px-2 py-1.5 text-sm border rounded bg-white"
                            value={milestone.endDate || ""}
                            onChange={(e) =>
                              updateMilestone(index, "endDate", e.target.value)
                            }
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                  {formData.milestones?.length === 0 && (
                    <div className="text-center py-6 border-2 border-dashed border-gray-200 rounded-xl text-gray-400">
                      Chưa có mốc thời gian nào
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="p-5 border-t bg-gray-50 flex justify-end gap-3 rounded-b-2xl">
              <button
                onClick={handleCloseModal}
                className="px-5 py-2 text-gray-600 font-medium hover:bg-gray-200 rounded-lg transition"
              >
                Hủy
              </button>
              <button
                onClick={handleSave}
                className="px-5 py-2 bg-blue-600 text-white font-medium hover:bg-blue-700 rounded-lg shadow-md transition flex items-center gap-2"
              >
                <Save size={18} />
                Lưu lại
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
