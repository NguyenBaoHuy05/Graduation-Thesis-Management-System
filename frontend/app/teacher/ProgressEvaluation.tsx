"use client";
import React, { useState } from "react";
import { gql } from "@apollo/client";
import { useQuery, useMutation } from "@apollo/client/react";
import { useAuth } from "../../contexts/AuthContext";
import {
  TrendingUp,
  History,
  Calendar,
  Plus,
  Trash2,
  Edit,
  X,
  User,
  Link as LinkIcon,
  CheckCircle,
} from "lucide-react";

// --- GraphQL ---
const GET_TEACHER_REGISTRATIONS = gql`
  query TeacherRegistrations($teacherId: String!) {
    teacherRegistrations(teacherId: $teacherId) {
      id
      studentId
      status
      student {
        id
        code
        name
      }
      topic {
        id
        title
      }
    }
  }
`;

const GET_PROGRESS_REPORTS = gql`
  query GetProgressReports($registrationId: String!) {
    myProgressReports(registrationId: $registrationId) {
      id
      registrationId
      title
      content
      planNext
      submittedAt
      status
      feedback
      fileUrl
    }
  }
`;

const UPDATE_PROGRESS_REPORT_STATUS = gql`
  mutation UpdateProgressReportStatus(
    $input: UpdateProgressReportStatusInput!
  ) {
    updateProgressReportStatus(input: $input) {
      id
      status
      feedback
    }
  }
`;

const GET_TIMELINES = gql`
  query GetTimelines($registrationId: String!) {
    timelines(registrationId: $registrationId) {
      id
      registrationId
      milestone
      description
      dueDate
      status
      completedAt
    }
  }
`;

const CREATE_TIMELINE = gql`
  mutation CreateTimeline($input: CreateTimelineInput!) {
    createTimeline(input: $input) {
      id
      milestone
      dueDate
      status
    }
  }
`;

const UPDATE_TIMELINE_STATUS = gql`
  mutation UpdateTimelineStatus($input: UpdateTimelineStatusInput!) {
    updateTimelineStatus(input: $input) {
      id
      status
      completedAt
    }
  }
`;

const DELETE_TIMELINE = gql`
  mutation DeleteTimeline($id: String!) {
    deleteTimeline(id: $id)
  }
`;

const ProgressEvaluation: React.FC = () => {
  const { user } = useAuth();
  const [selectedStudentId, setSelectedStudentId] = useState<string | null>(
    null
  );
  const [activeTab, setActiveTab] = useState<"barchart" | "tasks" | "reports">(
    "reports"
  );

  // -- Fetch Students --
  const {
    data: studentsData,
    loading: studentsLoading,
    error: studentsError,
  } = useQuery<{ teacherRegistrations: any[] }>(GET_TEACHER_REGISTRATIONS, {
    variables: { teacherId: user?.profileId },
    skip: !user?.profileId,
    fetchPolicy: "network-only",
  });

  const myStudents = studentsData?.teacherRegistrations || [];
  const selectedReg = myStudents.find(
    (s: any) => s.studentId === selectedStudentId
  );

  // -- Fetch Reports --
  const { data: reportsData, refetch: refetchReports } = useQuery(
    GET_PROGRESS_REPORTS,
    {
      variables: { registrationId: selectedReg?.id },
      skip: !selectedReg?.id,
    }
  );
  const reports = reportsData?.myProgressReports || [];

  // -- Fetch Timelines --
  const { data: timelineData, refetch: refetchTimelines } = useQuery(
    GET_TIMELINES,
    {
      variables: { registrationId: selectedReg?.id },
      skip: !selectedReg?.id,
    }
  );
  const timelines = timelineData?.timelines || [];

  // -- Mutations --
  const [updateReportStatus] = useMutation(UPDATE_PROGRESS_REPORT_STATUS);
  const [createTimeline] = useMutation(CREATE_TIMELINE);
  const [updateTimelineStatus] = useMutation(UPDATE_TIMELINE_STATUS);
  const [deleteTimeline] = useMutation(DELETE_TIMELINE);

  // -- Local State --
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<any | null>(null);
  const [taskForm, setTaskForm] = useState({
    milestone: "",
    description: "",
    dueDate: "",
  });

  const [selectedReportId, setSelectedReportId] = useState<string | null>(null);
  const [feedback, setFeedback] = useState("");

  // --- Handlers ---
  const handleOpenTaskModal = (task?: any) => {
    if (task) {
      setEditingTask(task);
      setTaskForm({
        milestone: task.milestone,
        description: task.description || "",
        dueDate: task.dueDate || "",
      });
    } else {
      setEditingTask(null);
      setTaskForm({ milestone: "", description: "", dueDate: "" });
    }
    setIsTaskModalOpen(true);
  };

  const handleSaveTask = async () => {
    if (!selectedReg || !taskForm.milestone || !taskForm.dueDate) {
      alert("Vui lòng nhập tên nhiệm vụ và hạn chót.");
      return;
    }

    try {
      if (editingTask) {
        // For now, ask user to recreate as Update is not fully wired in UI form yet (DTO exists but form needs ID mapping)
        // Actually I can just support Create for now or minimal update.
        // Let's defer full update to next iteration and suggest recreation.
        alert(
          "Chức năng chỉnh sửa đang hoàn thiện. Vui lòng xóa và tạo mới nếu cần thay đổi lớn."
        );
        setIsTaskModalOpen(false);
      } else {
        await createTimeline({
          variables: {
            input: {
              registrationId: selectedReg.id,
              milestone: taskForm.milestone,
              description: taskForm.description,
              dueDate: taskForm.dueDate,
            },
          },
        });
        alert("Giao nhiệm vụ thành công!");
        setIsTaskModalOpen(false);
        refetchTimelines();
      }
    } catch (err: any) {
      alert("Lỗi: " + err.message);
    }
  };

  const handleDeleteTask = async (id: string) => {
    if (confirm("Bạn có chắc chắn muốn xóa nhiệm vụ này?")) {
      try {
        await deleteTimeline({ variables: { id } });
        refetchTimelines();
      } catch (err: any) {
        alert("Lỗi xóa: " + err.message);
      }
    }
  };

  const handleToggleTaskStatus = async (task: any) => {
    try {
      const newStatus = task.status === "completed" ? "pending" : "completed";
      await updateTimelineStatus({
        variables: {
          input: {
            id: task.id,
            status: newStatus,
          },
        },
      });
      refetchTimelines();
    } catch (err: any) {
      alert("Lỗi cập nhật: " + err.message);
    }
  };

  const submitReportReview = async (status: "approved" | "rejected") => {
    if (!selectedReportId || (!feedback && status === "rejected")) {
      // logic check
    }

    try {
      await updateReportStatus({
        variables: {
          input: {
            id: selectedReportId,
            status: status,
            feedback: feedback,
          },
        },
      });
      alert(`Đã ${status === "approved" ? "duyệt" : "từ chối"} báo cáo.`);
      setFeedback("");
      setSelectedReportId(null);
      refetchReports();
    } catch (err: any) {
      alert("Lỗi: " + err.message);
    }
  };

  return (
    <div className="flex flex-col lg:flex-row h-[calc(100vh-100px)] gap-6 animate-in fade-in duration-500">
      {/* Sidebar */}
      <div className="lg:w-1/3 bg-white rounded-xl shadow-sm border border-gray-200 flex flex-col overflow-hidden">
        <div className="p-4 border-b border-gray-100 bg-gray-50">
          <h3 className="font-bold text-gray-800 flex items-center gap-2">
            <User size={18} className="text-blue-600" /> Sinh viên hướng dẫn
          </h3>
        </div>
        <div className="flex-1 overflow-y-auto p-2 space-y-2">
          {studentsLoading && (
            <div className="p-4 text-center text-gray-500">Đang tải...</div>
          )}
          {studentsError && (
            <div className="p-4 text-center text-red-500 text-xs">
              Lỗi: {studentsError.message}
            </div>
          )}

          {!studentsLoading && !studentsError && myStudents.length === 0 ? (
            <div className="text-center p-8 text-gray-500 text-sm">
              Chưa có sinh viên nào.
            </div>
          ) : (
            myStudents.map((reg: any) => (
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
                <p className="text-xs text-gray-600 mt-2 truncate max-w-xs">
                  {reg.topic?.title}
                </p>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 bg-white rounded-xl shadow-sm border border-gray-200 flex flex-col overflow-hidden">
        {selectedStudentId && selectedReg ? (
          <>
            <div className="p-6 border-b border-gray-100">
              <h2 className="text-2xl font-bold text-gray-900">
                {selectedReg.student?.name}
              </h2>
              <p className="text-gray-500">{selectedReg.topic?.title}</p>
              <div className="flex gap-4 mt-6 border-b border-gray-200">
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
                <button
                  onClick={() => setActiveTab("tasks")}
                  className={`pb-2 text-sm font-medium transition ${
                    activeTab === "tasks"
                      ? "text-blue-600 border-b-2 border-blue-600"
                      : "text-gray-500 hover:text-gray-700"
                  }`}
                >
                  Nhiệm vụ
                </button>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-6 bg-gray-50/50">
              {activeTab === "reports" && (
                <div className="space-y-4">
                  <h3 className="font-bold text-gray-800 mb-4">
                    Lịch sử báo cáo
                  </h3>
                  {reports.length === 0 ? (
                    <div className="text-center py-12 border-2 border-dashed border-gray-200 rounded-xl">
                      <History
                        className="mx-auto text-gray-300 mb-2"
                        size={32}
                      />
                      <p className="text-gray-500">
                        Sinh viên chưa gửi báo cáo nào.
                      </p>
                    </div>
                  ) : (
                    reports.map((report: any) => (
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
                              {new Date(report.submittedAt).toLocaleDateString(
                                "vi-VN"
                              )}
                            </p>
                          </div>
                          <span
                            className={`text-xs px-2 py-1 rounded font-medium ${
                              report.status === "approved"
                                ? "bg-green-100 text-green-700"
                                : report.status === "rejected"
                                ? "bg-red-100 text-red-700"
                                : "bg-amber-100 text-amber-700"
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
                          {report.fileUrl && (
                            <a
                              href={report.fileUrl}
                              target="_blank"
                              rel="noreferrer"
                              className="flex items-center gap-1 text-blue-600 hover:underline mt-2"
                            >
                              <LinkIcon size={14} /> Xem tài liệu
                            </a>
                          )}
                        </div>
                        {report.feedback && (
                          <div className="mt-3 text-sm bg-blue-50 p-3 rounded-lg text-blue-800 border border-blue-100">
                            <span className="font-bold text-blue-900 block mb-1">
                              Nhận xét:
                            </span>
                            {report.feedback}
                          </div>
                        )}
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
                    {timelines.length === 0 ? (
                      <div className="text-center py-12 border-2 border-dashed border-gray-200 rounded-xl">
                        <p className="text-gray-500">
                          Chưa có nhiệm vụ nào được giao.
                        </p>
                      </div>
                    ) : (
                      timelines.map((task: any) => (
                        <div
                          key={task.id}
                          className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm flex items-start justify-between group"
                        >
                          <div className="flex items-start gap-3">
                            <button
                              onClick={() => handleToggleTaskStatus(task)}
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
                                <span>
                                  Hạn:{" "}
                                  {new Date(task.dueDate).toLocaleDateString(
                                    "vi-VN"
                                  )}
                                </span>
                                {task.completedAt && (
                                  <span className="text-green-600 font-medium ml-2">
                                    Hoàn thành:{" "}
                                    {new Date(
                                      task.completedAt
                                    ).toLocaleDateString("vi-VN")}
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                          <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition">
                            {/* Edit button disabled for now per simple implementation, or can map to modal open */}
                            {/* <button onClick={() => handleOpenTaskModal(task)} className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg"><Edit size={16} /></button> */}
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
            </div>
          </>
        ) : (
          <div className="h-full flex flex-col items-center justify-center text-gray-400">
            <TrendingUp size={48} className="mb-4 opacity-50" />
            <p>Chọn sinh viên để xem chi tiết</p>
          </div>
        )}
      </div>

      {/* Review Modal */}
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
                  placeholder="Nhập nhận xét..."
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
    </div>
  );
};

export default ProgressEvaluation;
