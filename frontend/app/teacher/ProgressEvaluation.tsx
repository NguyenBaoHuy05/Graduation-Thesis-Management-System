"use client";
import React, { useState } from "react";
import {
  mockRegistrations,
  mockStudents,
  mockTopics,
  mockTimelines,
  mockProgressReports,
  ProgressReport,
  Timeline,
} from "../../data/mockData";
import { useAuth } from "../../contexts/AuthContext";
import {
  TrendingUp,
  CheckCircle,
  MessageSquare,
  History,
  AlertCircle,
  Calendar,
  Plus,
  Trash2,
  Edit,
  X,
  FileText,
  User,
  Search,
} from "lucide-react";

/**
 * Progress & Task Management Component
 * Allows teachers to manage student progress, assign tasks, and review reports.
 */
const ProgressEvaluation: React.FC = () => {
  const { user } = useAuth();

  // --- Data Preparation ---
  // Get my students
  const myStudents = mockRegistrations
    .filter((r) => r.teacherId === user?.profileId)
    .map((reg) => {
      const student = mockStudents.find((s) => s.id === reg.studentId);
      const topic = mockTopics.find((t) => t.id === reg.topicId);
      return { ...reg, student, topic };
    });

  // --- State ---
  const [selectedStudentId, setSelectedStudentId] = useState<string | null>(
    null
  );
  const [activeTab, setActiveTab] = useState<"barchart" | "tasks" | "reports">(
    "tasks"
  );

  // Data States (Mocking DB)
  const [timelines, setTimelines] = useState<Timeline[]>(mockTimelines);
  const [reports, setReports] = useState<ProgressReport[]>(mockProgressReports);

  // Task Modal State
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Timeline | null>(null);
  const [taskForm, setTaskForm] = useState({
    milestone: "",
    description: "",
    dueDate: "",
  });

  // Report Review State
  const [selectedReportId, setSelectedReportId] = useState<string | null>(null);
  const [feedback, setFeedback] = useState("");

  // --- Helpers ---
  const selectedReg = myStudents.find((s) => s.studentId === selectedStudentId);

  // --- Handlers: Tasks ---
  const handleOpenTaskModal = (task?: Timeline) => {
    if (task) {
      setEditingTask(task);
      setTaskForm({
        milestone: task.milestone,
        description: task.description,
        dueDate: task.dueDate,
      });
    } else {
      setEditingTask(null);
      setTaskForm({ milestone: "", description: "", dueDate: "" });
    }
    setIsTaskModalOpen(true);
  };

  const handleSaveTask = () => {
    if (!selectedReg || !taskForm.milestone || !taskForm.dueDate) {
      alert("Vui lòng nhập tên nhiệm vụ và hạn chót.");
      return;
    }

    if (editingTask) {
      // Update
      setTimelines((prev) =>
        prev.map((t) =>
          t.id === editingTask.id
            ? {
                ...t,
                milestone: taskForm.milestone,
                description: taskForm.description,
                dueDate: taskForm.dueDate,
              }
            : t
        )
      );
    } else {
      // Create
      const newTask: Timeline = {
        id: `tl${Date.now()}`,
        registrationId: selectedReg.id,
        milestone: taskForm.milestone,
        description: taskForm.description,
        dueDate: taskForm.dueDate,
        status: "pending",
      };
      setTimelines([...timelines, newTask]);
    }
    setIsTaskModalOpen(false);
  };

  const handleDeleteTask = (id: string) => {
    if (confirm("Bạn có chắc chắn muốn xóa nhiệm vụ này?")) {
      setTimelines((prev) => prev.filter((t) => t.id !== id));
    }
  };

  const handleToggleTaskStatus = (id: string) => {
    setTimelines((prev) =>
      prev.map((t) => {
        if (t.id === id) {
          return {
            ...t,
            status: t.status === "completed" ? "pending" : "completed",
            completedAt:
              t.status === "completed"
                ? undefined
                : new Date().toISOString().split("T")[0],
          };
        }
        return t;
      })
    );
  };

  // --- Handlers: Reports ---
  const submitReportReview = (status: "approved" | "rejected") => {
    if (!selectedReportId || !feedback) {
      alert("Vui lòng nhập nhận xét.");
      return;
    }

    setReports((prev) =>
      prev.map((r) => {
        if (r.id === selectedReportId) {
          return { ...r, status, feedback };
        }
        return r;
      })
    );

    setFeedback("");
    setSelectedReportId(null);
    alert(`Đã ${status === "approved" ? "duyệt" : "từ chối"} báo cáo.`);
  };

  return (
    <div className="flex flex-col lg:flex-row h-[calc(100vh-100px)] gap-6 animate-in fade-in duration-500">
      {/* Left Sidebar: Student List */}
      <div className="lg:w-1/3 bg-white rounded-xl shadow-sm border border-gray-200 flex flex-col overflow-hidden">
        <div className="p-4 border-b border-gray-100 bg-gray-50">
          <h3 className="font-bold text-gray-800 flex items-center gap-2">
            <User size={18} className="text-blue-600" /> Sinh viên hướng dẫn
          </h3>
        </div>

        <div className="flex-1 overflow-y-auto p-2 space-y-2">
          {myStudents.length === 0 ? (
            <div className="text-center p-8 text-gray-500 text-sm">
              Chưa có sinh viên nào.
            </div>
          ) : (
            myStudents.map((reg) => (
              <div
                key={reg.id}
                onClick={() => setSelectedStudentId(reg.studentId)}
                className={`p-3 rounded-lg border cursor-pointer transition ${
                  selectedStudentId === reg.studentId
                    ? "bg-blue-50 border-blue-500 ring-1 ring-blue-500"
                    : "border-gray-100 hover:bg-gray-50"
                }`}
              >
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-semibold text-gray-900">
                      {reg.student?.name}
                    </p>
                    <p className="text-xs text-gray-500">{reg.student?.code}</p>
                  </div>
                  <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">
                    {reg.status}
                  </span>
                </div>
                <p
                  className="text-xs text-gray-600 mt-2 truncate max-w-xs"
                  title={reg.topic?.title}
                >
                  {reg.topic?.title}
                </p>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 bg-white rounded-xl shadow-sm border border-gray-200 flex flex-col overflow-hidden">
        {selectedStudentId && selectedReg ? (
          <>
            {/* Header */}
            <div className="p-6 border-b border-gray-100">
              <h2 className="text-2xl font-bold text-gray-900">
                {selectedReg.student?.name}
              </h2>
              <p className="text-gray-500">{selectedReg.topic?.title}</p>

              {/* Tabs */}
              <div className="flex gap-4 mt-6 border-b border-gray-200">
                <button
                  onClick={() => setActiveTab("tasks")}
                  className={`pb-2 text-sm font-medium transition ${
                    activeTab === "tasks"
                      ? "text-blue-600 border-b-2 border-blue-600"
                      : "text-gray-500 hover:text-gray-700"
                  }`}
                >
                  Kế hoạch & Nhiệm vụ
                </button>
                <button
                  onClick={() => setActiveTab("reports")}
                  className={`pb-2 text-sm font-medium transition ${
                    activeTab === "reports"
                      ? "text-blue-600 border-b-2 border-blue-600"
                      : "text-gray-500 hover:text-gray-700"
                  }`}
                >
                  Báo cáo định kỳ
                </button>
              </div>
            </div>

            {/* Tab Content */}
            <div className="flex-1 overflow-y-auto p-6 bg-gray-50/50">
              {/* --- TASKS TAB --- */}
              {activeTab === "tasks" && (
                <div className="space-y-4">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="font-bold text-gray-800">
                      Tiến độ thực hiện
                    </h3>
                    <button
                      onClick={() => handleOpenTaskModal()}
                      className="flex items-center gap-2 bg-blue-600 text-white px-3 py-2 rounded-lg text-sm hover:bg-blue-700 transition"
                    >
                      <Plus size={16} /> Giao nhiệm vụ
                    </button>
                  </div>

                  <div className="space-y-3">
                    {timelines.filter(
                      (t) => t.registrationId === selectedReg.id
                    ).length === 0 ? (
                      <div className="text-center py-12 border-2 border-dashed border-gray-200 rounded-xl">
                        <p className="text-gray-500">
                          Chưa có nhiệm vụ nào được giao.
                        </p>
                      </div>
                    ) : (
                      timelines
                        .filter((t) => t.registrationId === selectedReg.id)
                        .sort(
                          (a, b) =>
                            new Date(a.dueDate).getTime() -
                            new Date(b.dueDate).getTime()
                        )
                        .map((task) => (
                          <div
                            key={task.id}
                            className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm flex items-start justify-between group"
                          >
                            <div className="flex items-start gap-3">
                              <button
                                onClick={() => handleToggleTaskStatus(task.id)}
                                className={`mt-1 flex-shrink-0 w-5 h-5 rounded border flex items-center justify-center transition ${
                                  task.status === "completed"
                                    ? "bg-green-500 border-green-500 text-white"
                                    : "border-gray-300 hover:border-blue-500"
                                }`}
                              >
                                {task.status === "completed" && (
                                  <CheckCircle size={14} />
                                )}
                              </button>
                              <div>
                                <h4
                                  className={`font-semibold text-gray-900 ${
                                    task.status === "completed"
                                      ? "line-through text-gray-400"
                                      : ""
                                  }`}
                                >
                                  {task.milestone}
                                </h4>
                                <p className="text-sm text-gray-600 mt-1">
                                  {task.description}
                                </p>
                                <div className="flex items-center gap-2 mt-2 text-xs text-gray-500">
                                  <Calendar size={12} />
                                  <span>Hạn: {task.dueDate}</span>
                                  {task.completedAt && (
                                    <span className="text-green-600 font-medium ml-2">
                                      Hoàn thành: {task.completedAt}
                                    </span>
                                  )}
                                </div>
                              </div>
                            </div>
                            <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition">
                              <button
                                onClick={() => handleOpenTaskModal(task)}
                                className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg"
                              >
                                <Edit size={16} />
                              </button>
                              <button
                                onClick={() => handleDeleteTask(task.id)}
                                className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg"
                              >
                                <Trash2 size={16} />
                              </button>
                            </div>
                          </div>
                        ))
                    )}
                  </div>
                </div>
              )}

              {/* --- REPORTS TAB --- */}
              {activeTab === "reports" && (
                <div className="space-y-4">
                  <h3 className="font-bold text-gray-800 mb-4">
                    Lịch sử báo cáo
                  </h3>
                  {reports.filter((r) => r.registrationId === selectedReg.id)
                    .length === 0 ? (
                    <div className="text-center py-12 border-2 border-dashed border-gray-200 rounded-xl">
                      <p className="text-gray-500">
                        Sinh viên chưa gửi báo cáo nào.
                      </p>
                    </div>
                  ) : (
                    reports
                      .filter((r) => r.registrationId === selectedReg.id)
                      .map((report) => (
                        <div
                          key={report.id}
                          className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm"
                        >
                          <div className="flex justify-between items-start mb-3">
                            <div>
                              <h4 className="font-bold text-gray-900">
                                {report.title}
                              </h4>
                              <p className="text-xs text-gray-500">
                                {report.submittedAt}
                              </p>
                            </div>
                            <span
                              className={`text-xs px-2 py-1 rounded font-medium ${
                                report.status === "approved"
                                  ? "bg-green-100 text-green-700"
                                  : report.status === "rejected"
                                  ? "bg-red-100 text-red-700"
                                  : "bg-yellow-100 text-yellow-700"
                              }`}
                            >
                              {report.status === "approved"
                                ? "Đã duyệt"
                                : report.status === "rejected"
                                ? "Từ chối"
                                : "Đang chờ"}
                            </span>
                          </div>

                          <div className="space-y-2 text-sm text-gray-700 bg-gray-50 p-3 rounded-lg border border-gray-100">
                            <p>
                              <span className="font-semibold">Đã làm:</span>{" "}
                              {report.content}
                            </p>
                            <p>
                              <span className="font-semibold">Kế hoạch:</span>{" "}
                              {report.planNext}
                            </p>
                          </div>

                          {report.feedback && (
                            <div className="mt-3 text-sm bg-blue-50 p-3 rounded-lg text-blue-800 border border-blue-100">
                              <span className="font-bold text-blue-900 block mb-1">
                                Nhận xét:
                              </span>
                              {report.feedback}
                            </div>
                          )}

                          {/* Action Button for Pending Reports */}
                          {report.status === "pending" && (
                            <button
                              onClick={() => {
                                setSelectedReportId(report.id);
                                setFeedback("");
                              }}
                              className="mt-3 w-full py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm font-medium"
                            >
                              Đánh giá & Phản hồi
                            </button>
                          )}
                        </div>
                      ))
                  )}
                </div>
              )}
            </div>
          </>
        ) : (
          <div className="h-full flex flex-col items-center justify-center text-gray-400">
            <TrendingUp size={48} className="mb-4 opacity-50" />
            <p>Chọn một sinh viên từ danh sách bên trái để quản lý tiến độ</p>
          </div>
        )}
      </div>

      {/* Task Modal */}
      {isTaskModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-gray-900">
                {editingTask ? "Cập nhật nhiệm vụ" : "Giao nhiệm vụ mới"}
              </h3>
              <button
                onClick={() => setIsTaskModalOpen(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X size={20} />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Tên nhiệm vụ / Giai đoạn
                </label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="VD: Viết chương 1, Vẽ sơ đồ..."
                  value={taskForm.milestone}
                  onChange={(e) =>
                    setTaskForm({ ...taskForm, milestone: e.target.value })
                  }
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Mô tả chi tiết
                </label>
                <textarea
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows={3}
                  placeholder="Mô tả công việc cần làm..."
                  value={taskForm.description}
                  onChange={(e) =>
                    setTaskForm({ ...taskForm, description: e.target.value })
                  }
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Hạn hoàn thành
                </label>
                <input
                  type="date"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={taskForm.dueDate}
                  onChange={(e) =>
                    setTaskForm({ ...taskForm, dueDate: e.target.value })
                  }
                />
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  onClick={() => setIsTaskModalOpen(false)}
                  className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg"
                >
                  Hủy
                </button>
                <button
                  onClick={handleSaveTask}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium"
                >
                  Lưu nhiệm vụ
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Report Feedback Modal */}
      {selectedReportId && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-2xl max-w-lg w-full p-6 animate-in fade-in zoom-in-95 duration-200">
            <h3 className="text-xl font-bold text-gray-900 mb-4">
              Phản hồi báo cáo
            </h3>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nhận xét của giảng viên
                </label>
                <textarea
                  value={feedback}
                  onChange={(e) => setFeedback(e.target.value)}
                  rows={4}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none resize-none"
                  placeholder="Nhập nhận xét chi tiết..."
                  autoFocus
                />
              </div>

              <div className="flex justify-end space-x-3 pt-2">
                <button
                  onClick={() => setSelectedReportId(null)}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                >
                  Hủy
                </button>
                <button
                  onClick={() => submitReportReview("rejected")}
                  className="px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 font-medium"
                >
                  Từ chối
                </button>
                <button
                  onClick={() => submitReportReview("approved")}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 font-medium"
                >
                  Duyệt báo cáo
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProgressEvaluation;
