"use client";
import React, { useState, useEffect } from "react";
import {
  DefenseCouncil,
  mockCouncils,
  mockTeachers,
  mockTopics,
  mockThesisPeriods,
} from "../../data/mockData";
import {
  Search,
  Calendar,
  MapPin,
  Clock,
  X,
  Users,
  Briefcase,
  CheckCircle,
  AlertTriangle,
} from "lucide-react";

const DefenseScheduling: React.FC = () => {
  const [councils, setCouncils] = useState<DefenseCouncil[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCouncil, setSelectedCouncil] = useState<DefenseCouncil | null>(
    null
  );

  const [scheduleData, setScheduleData] = useState({
    date: "",
    time: "",
    room: "",
  });

  // Load data
  useEffect(() => {
    setCouncils([...mockCouncils]);
  }, []);

  const openScheduleModal = (council: DefenseCouncil) => {
    setSelectedCouncil(council);
    setScheduleData({
      date: council.date || "",
      time: council.time || "",
      room: council.room || "",
    });
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedCouncil(null);
  };

  const checkConflict = (
    teacherIds: string[],
    date: string,
    time: string,
    currentCouncilId: string
  ) => {
    // Check teacher conflicts
    for (const council of councils) {
      if (
        council.id !== currentCouncilId &&
        council.date === date &&
        council.time === time
      ) {
        // Check if any member overlaps
        const members = [
          council.presidentId,
          council.secretaryId,
          council.reviewerId,
          ...(council.memberIds || []),
        ];
        const overlap = members.some((m) => teacherIds.includes(m));
        if (overlap)
          return `Trùng lịch với thành viên trong hội đồng "${council.name}"`;
      }
    }
    return null;
  };

  const handleSaveSchedule = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCouncil) return;

    const memberIds = [
      selectedCouncil.presidentId,
      selectedCouncil.secretaryId,
      selectedCouncil.reviewerId,
      ...(selectedCouncil.memberIds || []),
    ];

    const conflict = checkConflict(
      memberIds,
      scheduleData.date,
      scheduleData.time,
      selectedCouncil.id
    );

    if (conflict) {
      if (!confirm(`${conflict}. Bạn có muốn tiếp tục lưu không?`)) {
        return;
      }
    }

    const updated = councils.map((c) =>
      c.id === selectedCouncil.id
        ? {
            ...c,
            date: scheduleData.date,
            time: scheduleData.time,
            room: scheduleData.room,
          }
        : c
    );
    setCouncils(updated);
    alert("Cập nhật lịch bảo vệ thành công!");
    closeModal();
  };

  const handlePublish = (id: string) => {
    const council = councils.find((c) => c.id === id);
    if (!council?.date || !council?.time || !council?.room) {
      alert("Vui lòng xếp lịch (Ngày, Giờ, Phòng) trước khi công bố!");
      return;
    }

    if (
      confirm(
        "Bạn có chắc chắn muốn công bố lịch bảo vệ này? Giảng viên và sinh viên sẽ nhận được thông báo."
      )
    ) {
      setCouncils(
        councils.map((c) => (c.id === id ? { ...c, status: "published" } : c))
      );
      alert("Đã công bố lịch bảo vệ!");
    }
  };

  const handleUnpublish = (id: string) => {
    if (confirm("Bạn muốn gỡ bỏ lịch bảo vệ này về trạng thái Nháp?")) {
      setCouncils(
        councils.map((c) => (c.id === id ? { ...c, status: "draft" } : c))
      );
    }
  };

  const getTeacherName = (id?: string) => {
    if (!id) return "-";
    return mockTeachers.find((t) => t.id === id)?.name || "Unknown";
  };

  return (
    <div className="space-y-6 p-6 animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
        <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
          {/* <Calendar className="text-blue-600" /> */}
          Xếp lịch Bảo vệ Khóa luận
        </h2>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {councils.map((council) => (
          <div
            key={council.id}
            className={`bg-white rounded-xl shadow-sm border overflow-hidden hover:shadow-md transition ${
              council.status === "published"
                ? "border-green-200"
                : "border-gray-200"
            }`}
          >
            <div className="p-6 border-b border-gray-100 flex justify-between items-start">
              <div>
                <h3 className="text-xl font-bold text-blue-800">
                  {council.name}
                </h3>
                {council.description && (
                  <p className="text-sm text-gray-500 mt-1">
                    {council.description}
                  </p>
                )}

                <div className="mt-3 flex items-center gap-6">
                  {/* Schedule Info */}
                  {council.date ? (
                    <div className="flex items-center gap-2 text-sm font-medium text-green-700 bg-green-50 px-3 py-1 rounded-full border border-green-100">
                      <Calendar size={16} /> {council.date}
                      <span className="mx-1">•</span>
                      <Clock size={16} /> {council.time}
                      <span className="mx-1">•</span>
                      <MapPin size={16} /> {council.room}
                    </div>
                  ) : (
                    <div className="flex items-center gap-2 text-sm font-medium text-orange-600 bg-orange-50 px-3 py-1 rounded-full border border-orange-100">
                      <AlertTriangle size={16} /> Chưa xếp lịch
                    </div>
                  )}

                  <span
                    className={`px-2 py-0.5 rounded text-xs font-medium uppercase ${
                      council.status === "published"
                        ? "bg-blue-100 text-blue-700"
                        : "bg-gray-100 text-gray-700"
                    }`}
                  >
                    {council.status === "published"
                      ? "Đã công bố"
                      : "Chưa công bố"}
                  </span>
                </div>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => openScheduleModal(council)}
                  className="px-3 py-1.5 bg-blue-50 text-blue-600 border border-blue-200 rounded-lg hover:bg-blue-100 text-sm font-medium transition"
                >
                  {council.date ? "Đổi lịch" : "Xếp lịch"}
                </button>

                {council.status === "draft" ? (
                  <button
                    onClick={() => handlePublish(council.id)}
                    className="px-3 py-1.5 bg-green-600 text-white rounded-lg hover:bg-green-700 text-sm font-medium transition"
                  >
                    Công bố
                  </button>
                ) : (
                  <button
                    onClick={() => handleUnpublish(council.id)}
                    className="px-3 py-1.5 bg-gray-500 text-white rounded-lg hover:bg-gray-600 text-sm font-medium transition"
                  >
                    Gỡ bỏ
                  </button>
                )}
              </div>
            </div>

            <div className="text-black p-6 bg-gray-50/50">
              <h4 className="font-semibold text-gray-900 mb-3 text-sm uppercase tracking-wide">
                Thành viên hội đồng
              </h4>
              <div className=" grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                <div>
                  <span className="text-gray-500 block text-xs">Chủ tịch</span>
                  <span className="font-medium">
                    {getTeacherName(council.presidentId)}
                  </span>
                </div>
                <div>
                  <span className="text-gray-500 block text-xs">Thư ký</span>
                  <span className="font-medium">
                    {getTeacherName(council.secretaryId)}
                  </span>
                </div>
                <div>
                  <span className="text-gray-500 block text-xs">Phản biện</span>
                  <span className="font-medium">
                    {getTeacherName(council.reviewerId)}
                  </span>
                </div>
              </div>
              {council.memberIds.length > 0 && (
                <div className="mt-3 text-sm">
                  <span className="text-gray-500 block text-xs">Ủy viên</span>
                  <span className="font-medium">
                    {council.memberIds.map((m) => getTeacherName(m)).join(", ")}
                  </span>
                </div>
              )}
            </div>
          </div>
        ))}
        {councils.length === 0 && (
          <div className="text-center py-12 text-gray-500">
            Chưa có đề xuất hội đồng nào.
          </div>
        )}
      </div>

      {/* Schedule Modal */}
      {isModalOpen && selectedCouncil && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full">
            <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
              <h3 className="text-lg font-bold text-gray-900">
                Xếp lịch cho "{selectedCouncil.name}"
              </h3>
              <button
                onClick={closeModal}
                className="text-gray-400 hover:text-gray-600"
              >
                <X size={24} />
              </button>
            </div>
            <form onSubmit={handleSaveSchedule} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Ngày bảo vệ
                </label>
                <input
                  required
                  type="date"
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  value={scheduleData.date}
                  onChange={(e) =>
                    setScheduleData({ ...scheduleData, date: e.target.value })
                  }
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Giờ bắt đầu
                </label>
                <input
                  required
                  type="time"
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  value={scheduleData.time}
                  onChange={(e) =>
                    setScheduleData({ ...scheduleData, time: e.target.value })
                  }
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Phòng bảo vệ
                </label>
                <input
                  required
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  placeholder="VD: C.301"
                  value={scheduleData.room}
                  onChange={(e) =>
                    setScheduleData({ ...scheduleData, room: e.target.value })
                  }
                />
              </div>

              <div className="pt-4 flex justify-end gap-3 border-t border-gray-100 mt-2">
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
                  Lưu lịch
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default DefenseScheduling;
