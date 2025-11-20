"use client";
import { useState } from "react";
import {
  Plus,
  Trash2,
  Users,
  Calendar,
  MapPin,
  CheckCircle,
  AlertCircle,
  Edit2,
} from "lucide-react";
import { v4 as uuidv4 } from "uuid";

interface CommitteeProposal {
  id: string;
  name: string;
  description: string;
  proposed_date: string;
  defense_date: string;
  location: string;
  status: "draft" | "proposed" | "approved" | "rejected";
  members: string[];
  theses_count: number;
}

interface Teacher {
  id: string;
  name: string;
  specialization: string;
}

const mockTeachers: Teacher[] = [
  { id: "t1", name: "TS. Nguyễn Văn An", specialization: "Trí tuệ nhân tạo" },
  {
    id: "t2",
    name: "PGS.TS. Trần Thị Bình",
    specialization: "Phát triển phần mềm",
  },
  { id: "t3", name: "ThS. Lê Minh Cường", specialization: "An ninh mạng" },
  { id: "t4", name: "TS. Phạm Minh Đức", specialization: "Cơ sở dữ liệu" },
];

const mockProposals: CommitteeProposal[] = [
  {
    id: "1",
    name: "Hội đồng bảo vệ KLTN - Đợt 1/2025",
    description: "Đợt bảo vệ khóa luận cuối cùng năm học 2024-2025",
    proposed_date: "2024-10-20",
    defense_date: "2024-12-15",
    location: "Phòng E101, Tòa nhà A",
    status: "approved",
    members: [
      "TS. Nguyễn Văn An",
      "PGS.TS. Trần Thị Bình",
      "ThS. Lê Minh Cường",
    ],
    theses_count: 15,
  },
  {
    id: "2",
    name: "Hội đồng bảo vệ KLTN - Đợt 2/2025",
    description: "Đợt bảo vệ khóa luận bổ sung",
    proposed_date: "2024-10-25",
    defense_date: "2025-01-20",
    location: "Phòng E102, Tòa nhà A",
    status: "proposed",
    members: ["TS. Nguyễn Văn An", "ThS. Lê Minh Cường", "TS. Phạm Minh Đức"],
    theses_count: 8,
  },
  {
    id: "3",
    name: "Hội đồng bảo vệ KLTN - Đợt 3/2025",
    description: "Đợt bảo vệ khóa luận tự do",
    proposed_date: "2024-10-28",
    defense_date: "2025-02-10",
    location: "Phòng E103, Tòa nhà A",
    status: "draft",
    members: ["PGS.TS. Trần Thị Bình"],
    theses_count: 0,
  },
];

export default function CommitteeProposal() {
  const [proposals, setProposals] =
    useState<CommitteeProposal[]>(mockProposals);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [selectedMembers, setSelectedMembers] = useState<string[]>([]);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    proposed_date: "",
    defense_date: "",
    location: "",
  });

  const handleAddProposal = () => {
    if (
      !formData.name ||
      !formData.defense_date ||
      selectedMembers.length === 0
    ) {
      alert("Vui lòng điền đầy đủ thông tin và chọn ít nhất 1 thành viên");
      return;
    }

    const newProposal: CommitteeProposal = {
      id: uuidv4(),
      ...formData,
      status: "draft",
      members: selectedMembers.map(
        (id) => mockTeachers.find((t) => t.id === id)?.name || ""
      ),
      theses_count: 0,
      proposed_date: new Date().toISOString().split("T")[0],
    };

    setProposals([...proposals, newProposal]);
    resetForm();
  };

  const handleDeleteProposal = (id: string) => {
    setProposals(proposals.filter((p) => p.id !== id));
  };

  const handleSubmitProposal = (id: string) => {
    setProposals(
      proposals.map((p) => (p.id === id ? { ...p, status: "proposed" } : p))
    );
  };

  const resetForm = () => {
    setShowForm(false);
    setFormData({
      name: "",
      description: "",
      proposed_date: "",
      defense_date: "",
      location: "",
    });
    setSelectedMembers([]);
    setEditingId(null);
  };

  const toggleMember = (teacherId: string) => {
    setSelectedMembers((prev) =>
      prev.includes(teacherId)
        ? prev.filter((id) => id !== teacherId)
        : [...prev, teacherId]
    );
  };

  const getStatusBadge = (status: string) => {
    const badges: Record<
      string,
      { bg: string; text: string; icon: typeof CheckCircle }
    > = {
      draft: { bg: "bg-gray-100", text: "text-gray-800", icon: AlertCircle },
      proposed: { bg: "bg-blue-100", text: "text-blue-800", icon: AlertCircle },
      approved: {
        bg: "bg-green-100",
        text: "text-green-800",
        icon: CheckCircle,
      },
      rejected: { bg: "bg-red-100", text: "text-red-800", icon: AlertCircle },
    };
    return badges[status] || badges.draft;
  };

  const statusLabels: Record<string, string> = {
    draft: "Nháp",
    proposed: "Đã đề xuất",
    approved: "Phê duyệt",
    rejected: "Từ chối",
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">
            Đề xuất hội đồng bảo vệ
          </h2>
          <p className="text-gray-600">
            Quản lý danh sách hội đồng bảo vệ khóa luận
          </p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg font-medium transition"
        >
          <Plus className="w-4 h-4" />
          Thêm hội đồng
        </button>
      </div>

      {showForm && (
        <div className="bg-purple-50 border border-purple-200 rounded-lg p-6 mb-6">
          <h3 className="font-semibold text-gray-900 mb-4">
            Tạo đề xuất hội đồng mới
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <input
              type="text"
              placeholder="Tên hội đồng"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
            <input
              type="date"
              placeholder="Ngày bảo vệ"
              value={formData.defense_date}
              onChange={(e) =>
                setFormData({ ...formData, defense_date: e.target.value })
              }
              className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
            <input
              type="text"
              placeholder="Địa điểm"
              value={formData.location}
              onChange={(e) =>
                setFormData({ ...formData, location: e.target.value })
              }
              className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>
          <textarea
            placeholder="Mô tả"
            value={formData.description}
            onChange={(e) =>
              setFormData({ ...formData, description: e.target.value })
            }
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 mb-4"
            rows={2}
          />

          <div className="mb-4">
            <p className="text-sm font-medium text-gray-700 mb-3">
              Chọn thành viên hội đồng
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {mockTeachers.map((teacher) => (
                <label
                  key={teacher.id}
                  className="flex items-center gap-2 p-2 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer"
                >
                  <input
                    type="checkbox"
                    checked={selectedMembers.includes(teacher.id)}
                    onChange={() => toggleMember(teacher.id)}
                    className="w-4 h-4"
                  />
                  <span className="text-sm text-gray-700">{teacher.name}</span>
                  <span className="text-xs text-gray-500">
                    ({teacher.specialization})
                  </span>
                </label>
              ))}
            </div>
          </div>

          <div className="flex gap-3">
            <button
              onClick={handleAddProposal}
              className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 font-medium transition"
            >
              Tạo
            </button>
            <button
              onClick={resetForm}
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 font-medium transition"
            >
              Hủy
            </button>
          </div>
        </div>
      )}

      <div className="space-y-4">
        {proposals.map((proposal) => {
          const badge = getStatusBadge(proposal.status);
          const Icon = badge.icon;
          return (
            <div
              key={proposal.id}
              className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <Users className="w-5 h-5 text-purple-600" />
                    <h3 className="font-semibold text-gray-900">
                      {proposal.name}
                    </h3>
                  </div>
                  <p className="text-sm text-gray-600 mb-2">
                    {proposal.description}
                  </p>
                </div>
                <span
                  className={`px-3 py-1 text-xs font-medium rounded-full flex items-center gap-1 ${badge.bg} ${badge.text}`}
                >
                  <Icon className="w-3 h-3" />
                  {statusLabels[proposal.status]}
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-2 p-3 bg-gray-50 rounded mb-3">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-gray-600" />
                  <span className="text-xs text-gray-600">
                    {new Date(proposal.defense_date).toLocaleDateString(
                      "vi-VN"
                    )}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-gray-600" />
                  <span className="text-xs text-gray-600">
                    {proposal.location}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4 text-gray-600" />
                  <span className="text-xs text-gray-600">
                    {proposal.members.length} thành viên
                  </span>
                </div>
              </div>

              <div className="mb-3">
                <p className="text-xs font-medium text-gray-700 mb-2">
                  Thành viên:
                </p>
                <div className="flex flex-wrap gap-1">
                  {proposal.members.map((member, idx) => (
                    <span
                      key={idx}
                      className="px-2 py-1 text-xs bg-purple-100 text-purple-800 rounded"
                    >
                      {member}
                    </span>
                  ))}
                </div>
              </div>

              <div className="flex gap-2">
                {proposal.status === "draft" && (
                  <>
                    <button
                      onClick={() => handleSubmitProposal(proposal.id)}
                      className="flex-1 flex items-center justify-center gap-1 px-3 py-2 text-sm bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition"
                    >
                      <CheckCircle className="w-4 h-4" />
                      Đề xuất
                    </button>
                    <button className="flex items-center gap-1 px-3 py-2 text-sm bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition">
                      <Edit2 className="w-4 h-4" />
                      Sửa
                    </button>
                  </>
                )}
                <button
                  onClick={() => handleDeleteProposal(proposal.id)}
                  className="flex items-center gap-1 px-3 py-2 text-sm bg-red-100 hover:bg-red-200 text-red-700 rounded-lg transition"
                >
                  <Trash2 className="w-4 h-4" />
                  Xóa
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
