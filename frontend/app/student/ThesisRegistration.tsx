"use client";
import React, { useState } from "react";
import { useAuth } from "../../contexts/AuthContext";
import {
  BookOpen,
  User,
  CheckCircle,
  Info,
  Search,
  Filter,
  List,
  Eye,
  ChevronRight,
  AlertCircle,
  X,
} from "lucide-react";
import WarningModal from "../../components/WarningModal"; // Import here
import { gql } from "@apollo/client";
import { useQuery, useMutation } from "@apollo/client/react";

const GET_TOPICS = gql`
  query GetTopics {
    topics {
      id
      code
      title
      description
      requirements
      studyReferences
      teacherId
      specialization
      status
      maxStudents
      currentStudents
      periodId
      createdAt
    }
  }
`;

const GET_TEACHERS = gql`
  query GetTeachers {
    teachers {
      id
      name
      email
      currentTheses
      maxTheses
    }
  }
`;

const MY_REGISTRATIONS = gql`
  query MyRegistrations($studentId: String!) {
    myRegistrations(studentId: $studentId) {
      id
      studentId
      topicId
      teacherId
      status
      registeredAt
    }
  }
`;

const REGISTER_TOPIC = gql`
  mutation RegisterTopic($input: CreateRegistrationInput!) {
    registerTopic(createRegistrationInput: $input) {
      id
      status
    }
  }
`;

const ThesisRegistration: React.FC = () => {
  const { user } = useAuth();

  // State
  const [searchTerm, setSearchTerm] = useState("");
  const [specializationFilter, setSpecializationFilter] = useState("");

  const [selectedTopic, setSelectedTopic] = useState<any | null>(null);
  const [viewingTopic, setViewingTopic] = useState<any | null>(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);

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

  // Queries
  const { data: topicsData, loading: topicsLoading } =
    useQuery<any>(GET_TOPICS);
  const { data: teachersData } = useQuery<any>(GET_TEACHERS);

  const { data: regData, refetch: refetchReg } = useQuery<any>(
    MY_REGISTRATIONS,
    {
      variables: { studentId: user?.profileId },
      skip: !user?.profileId,
    }
  );

  const [registerTopic] = useMutation(REGISTER_TOPIC, {
    onCompleted: () => {
      setWarningState({
        isOpen: true,
        type: "success",
        message: "Đăng ký thành công!",
      });
      setShowConfirmModal(false);
      setSelectedTopic(null);
      refetchReg();
    },
    onError: (err: any) => {
      setWarningState({
        isOpen: true,
        type: "error",
        message: `Lỗi: ${err.message}`,
      });
    },
  });

  const myRegistration = regData?.myRegistrations?.[0];
  const topics = topicsData?.topics || [];
  const teachers = teachersData?.teachers || [];
  const approvedTopics = topics.filter((t: any) => t.status === "approved");

  // Filtering Logic
  const filteredTopics = approvedTopics.filter((topic: any) => {
    const teacher = teachers.find((t: any) => t.id === topic.teacherId);
    const matchesSearch =
      topic.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (topic.code &&
        topic.code.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (teacher &&
        teacher.name.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesSpecialization = specializationFilter
      ? topic.specialization === specializationFilter
      : true;

    return matchesSearch && matchesSpecialization;
  });

  const uniqueSpecializations = Array.from(
    new Set(approvedTopics.map((t: any) => t.specialization))
  ) as string[];

  const getTeacher = (teacherId: string) => {
    return teachers.find((t: any) => t.id === teacherId);
  };

  const handleRegisterClick = (topic: any) => {
    setSelectedTopic(topic);
    setShowConfirmModal(true);
  };

  const handleViewDetails = (topic: any) => {
    setViewingTopic(topic);
    setShowDetailModal(true);
  };

  const confirmRegister = () => {
    if (!selectedTopic || !user) return;
    registerTopic({
      variables: {
        input: {
          studentId: user.profileId,
          topicId: selectedTopic.id,
          teacherId: selectedTopic.teacherId,
        },
      },
    });
  };

  // --- RENDER: REGISTERED STUDENT VIEW ---
  if (myRegistration) {
    const myTopic = topics.find((t: any) => t.id === myRegistration?.topicId);
    const myTeacher = getTeacher(myRegistration.teacherId);

    return (
      <div className="max-w-5xl mx-auto px-4 py-8 animate-in fade-in duration-500">
        <div className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
          <div className="bg-green-50 border-b border-green-100 p-4 flex items-center gap-3">
            <CheckCircle className="text-green-600" size={20} />
            <h2 className="font-bold text-green-800">
              Đăng ký đề tài thành công
            </h2>
          </div>
          <div className="p-6 md:p-8">
            <div className="flex flex-col md:flex-row gap-8">
              <div className="flex-1">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wide">
                  Đề tài
                </label>
                <h3 className="text-xl font-bold text-gray-900 mt-1 mb-2">
                  <span className="font-mono text-base font-normal text-gray-500 mr-2">
                    [{myTopic?.code}]
                  </span>
                  {myTopic?.title || "Đang tải..."}
                </h3>
                <p className="text-gray-600 text-sm leading-relaxed mb-4">
                  {myTopic?.description}
                </p>

                <div className="flex flex-wrap gap-4 mt-4">
                  <div>
                    <label className="text-xs font-bold text-gray-500 uppercase">
                      GVHD
                    </label>
                    <div className="flex items-center gap-2 mt-1">
                      <User size={16} className="text-gray-400" />
                      <span className="font-medium text-gray-900">
                        {myTeacher?.name}
                      </span>
                    </div>
                  </div>
                  <div>
                    <label className="text-xs font-bold text-gray-500 uppercase">
                      Chuyên ngành
                    </label>
                    <p className="font-medium text-gray-900 mt-1">
                      {myTopic?.specialization}
                    </p>
                  </div>
                </div>
              </div>
              <div className="w-full md:w-64 bg-gray-50 rounded-lg p-4 border border-gray-100 h-fit">
                <h4 className="font-bold text-gray-700 text-sm mb-3">
                  Thông tin đăng ký
                </h4>
                <ul className="text-sm space-y-2">
                  <li className="flex justify-between">
                    <span className="text-gray-500">Trạng thái:</span>
                    <span className="font-bold text-green-600">
                      Đã xác nhận
                    </span>
                  </li>
                  <li className="flex justify-between">
                    <span className="text-gray-500">Ngày đăng ký:</span>
                    <span className="font-medium text-gray-900">
                      {new Date(myRegistration.registeredAt).toLocaleDateString(
                        "vi-VN"
                      )}
                    </span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // --- RENDER: TOPIC LIST VIEW (Unregistered) ---
  return (
    <div className="max-w-7xl mx-auto px-4 py-8 animate-in fade-in duration-500">
      {/* Page Header */}
      <div className="mb-8 border-b border-gray-200 pb-6">
        <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
          <BookOpen className="text-blue-600" size={24} />
          Đăng Ký Đề Tài Khóa Luận
        </h1>
        <p className="text-gray-500 mt-2 text-sm">
          Danh sách các đề tài khóa luận tốt nghiệp đang mở đăng ký. Vui lòng
          chọn đề tài phù hợp với chuyên ngành.
        </p>
      </div>

      {/* Search & Filter - Clean Bar */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            size={18}
          />
          <input
            type="text"
            placeholder="Tìm kiếm theo mã, tên đề tài, hoặc giảng viên..."
            className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm transition-all shadow-sm"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="relative md:w-64">
          <Filter
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            size={18}
          />
          <select
            className="w-full pl-10 pr-8 py-2.5 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm appearance-none shadow-sm cursor-pointer"
            value={specializationFilter}
            onChange={(e) => setSpecializationFilter(e.target.value)}
          >
            <option value="">Tất cả chuyên ngành</option>
            {uniqueSpecializations.map((spec) => (
              <option key={spec} value={spec}>
                {spec}
              </option>
            ))}
          </select>
          <div className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
            <svg className="w-4 h-4 fill-current" viewBox="0 0 20 20">
              <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
            </svg>
          </div>
        </div>
      </div>

      {/* Main List - Table Style */}
      <div className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
        {topicsLoading ? (
          <div className="p-10 text-center text-gray-500 text-sm">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
            Đang tải dữ liệu...
          </div>
        ) : filteredTopics.length === 0 ? (
          <div className="p-10 text-center text-gray-500 text-sm">
            <Info size={32} className="mx-auto text-gray-300 mb-2" />
            Không tìm thấy đề tài nào phù hợp.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 text-gray-500 text-xs uppercase font-semibold border-b border-gray-200">
                  <th className="px-6 py-4 w-24">Mã</th>
                  <th className="px-6 py-4">Đề tài</th>
                  <th className="px-6 py-4 w-48">Giảng viên</th>
                  <th className="px-6 py-4 w-32 text-center">Đã ĐK</th>
                  <th className="px-6 py-4 w-32 text-right">Tác vụ</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredTopics.map((topic: any) => {
                  const teacher = getTeacher(topic.teacherId);
                  const max = topic.maxStudents || 1;
                  const current = topic.currentStudents || 0;
                  const isFull = current >= max;
                  const isTeacherFull =
                    teacher &&
                    (teacher.currentTheses || 0) >= (teacher.maxTheses || 99);
                  const percent = Math.min(100, (current / max) * 100);

                  return (
                    <tr
                      key={topic.id}
                      className="hover:bg-gray-50/80 transition-colors group"
                    >
                      <td className="px-6 py-4 align-top">
                        <span className="font-mono text-xs font-bold text-gray-600 bg-gray-100 px-2 py-1 rounded">
                          {topic.code || "---"}
                        </span>
                      </td>
                      <td className="px-6 py-4 align-top">
                        <div
                          className="font-bold text-gray-900 group-hover:text-blue-700 cursor-pointer transition-colors mb-1"
                          onClick={() => handleViewDetails(topic)}
                        >
                          {topic.title}
                        </div>
                        <div className="text-gray-500 text-xs line-clamp-1 mb-1">
                          {topic.description}
                        </div>
                        {topic.specialization && (
                          <span className="inline-block px-1.5 py-0.5 rounded text-[10px] font-medium bg-blue-50 text-blue-600 uppercase border border-blue-100">
                            {topic.specialization}
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 align-top">
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center text-xs font-bold">
                            {teacher?.name?.charAt(0)}
                          </div>
                          <span className="text-sm text-gray-700 font-medium">
                            {teacher?.name}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 align-middle text-center">
                        <div className="flex flex-col items-center gap-1">
                          <span
                            className={`text-xs font-bold ${
                              isFull ? "text-red-500" : "text-gray-700"
                            }`}
                          >
                            {current}/{max}
                          </span>
                          <div className="w-16 bg-gray-200 rounded-full h-1 overflow-hidden">
                            <div
                              className={`h-full rounded-full ${
                                isFull ? "bg-red-500" : "bg-blue-500"
                              }`}
                              style={{ width: `${percent}%` }}
                            ></div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 align-middle text-right">
                        <div className="flex justify-end gap-2">
                          <button
                            onClick={() => handleViewDetails(topic)}
                            className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors"
                            title="Xem chi tiết"
                          >
                            <Eye size={18} />
                          </button>
                          {!isFull && !isTeacherFull ? (
                            <button
                              onClick={() => handleRegisterClick(topic)}
                              className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded shadow-sm transition-colors whitespace-nowrap"
                            >
                              Đăng ký
                            </button>
                          ) : (
                            <button
                              disabled
                              className="px-3 py-1.5 bg-gray-100 text-gray-400 text-xs font-bold rounded cursor-not-allowed whitespace-nowrap"
                            >
                              Đã đầy
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Footer Info */}
      <div className="mt-4 flex flex-wrap gap-4 text-xs text-gray-400 justify-between px-2">
        <div className="flex gap-4">
          <span className="flex items-center gap-1">
            <div className="w-2 h-2 bg-blue-500 rounded-full"></div> Còn chỗ
          </span>
          <span className="flex items-center gap-1">
            <div className="w-2 h-2 bg-red-500 rounded-full"></div> Đã đầy
          </span>
        </div>
        <div>Cập nhật: {new Date().toLocaleDateString("vi-VN")}</div>
      </div>

      {/* --- MODALS --- */}

      {/* Confirmation Modal - Clean Style */}
      {showConfirmModal && selectedTopic && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-[2px] flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md overflow-hidden">
            <div className="p-6 border-b border-gray-100">
              <h3 className="font-bold text-lg text-gray-900">
                Xác nhận đăng ký đề tài
              </h3>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="text-xs font-bold text-gray-500 uppercase">
                  Đề tài
                </label>
                <div className="font-semibold text-gray-900 mt-1 pb-2 border-b border-gray-100">
                  {selectedTopic.title}
                </div>
              </div>
              <div className="flex gap-4">
                <div className="flex-1">
                  <label className="text-xs font-bold text-gray-500 uppercase">
                    Giảng viên
                  </label>
                  <div className="text-sm text-gray-900 mt-1">
                    {getTeacher(selectedTopic.teacherId)?.name}
                  </div>
                </div>
                <div>
                  <label className="text-xs font-bold text-gray-500 uppercase">
                    Mã số
                  </label>
                  <div className="text-sm font-mono text-gray-900 mt-1">
                    {selectedTopic.code}
                  </div>
                </div>
              </div>
              <div className="flex gap-2 items-start bg-blue-50 text-blue-800 text-sm p-3 rounded border border-blue-100">
                <Info size={16} className="shrink-0 mt-0.5" />
                <p>
                  Hành động này sẽ ghi nhận bạn vào danh sách đăng ký. Vui lòng
                  kiểm tra kỹ trước khi xác nhận.
                </p>
              </div>
            </div>
            <div className="p-4 bg-gray-50 border-t border-gray-100 flex justify-end gap-3">
              <button
                onClick={() => setShowConfirmModal(false)}
                className="px-4 py-2 text-gray-600 hover:bg-gray-200 rounded font-medium text-sm transition-colors"
              >
                Hủy bỏ
              </button>
              <button
                onClick={confirmRegister}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded font-medium text-sm shadow-sm transition-colors"
              >
                Xác nhận đăng ký
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Details Modal - Clean Style */}
      {showDetailModal && viewingTopic && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-[2px] flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] flex flex-col">
            {/* Modal Header */}
            <div className="p-5 border-b border-gray-200 flex justify-between items-start">
              <div>
                <div className="flex gap-2 mb-2">
                  <span className="font-mono text-xs font-bold bg-gray-100 text-gray-600 px-2 py-0.5 rounded border border-gray-200">
                    {viewingTopic.code}
                  </span>
                  <span className="text-xs font-bold bg-blue-50 text-blue-600 px-2 py-0.5 rounded border border-blue-100 uppercase">
                    {viewingTopic.specialization}
                  </span>
                </div>
                <h3 className="font-bold text-xl text-gray-900 leading-tight pr-4">
                  {viewingTopic.title}
                </h3>
              </div>
              <button
                onClick={() => setShowDetailModal(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors p-1"
              >
                <X size={24} />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 overflow-y-auto space-y-6">
              <div className="grid grid-cols-2 gap-6 pb-6 border-b border-gray-100">
                <div>
                  <h4 className="text-xs font-bold text-gray-500 uppercase mb-2">
                    Giảng viên hướng dẫn
                  </h4>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-700 font-bold">
                      {getTeacher(viewingTopic.teacherId)?.name?.charAt(0)}
                    </div>
                    <div>
                      <div className="font-bold text-gray-900">
                        {getTeacher(viewingTopic.teacherId)?.name}
                      </div>
                      <div className="text-xs text-gray-500">
                        {getTeacher(viewingTopic.teacherId)?.email}
                      </div>
                    </div>
                  </div>
                </div>
                <div>
                  <h4 className="text-xs font-bold text-gray-500 uppercase mb-2">
                    Thông tin đăng ký
                  </h4>
                  <div className="w-full bg-gray-100 rounded-full h-2 mb-2">
                    <div
                      className="bg-blue-600 h-2 rounded-full"
                      style={{
                        width: `${Math.min(
                          100,
                          ((viewingTopic.currentStudents || 0) /
                            viewingTopic.maxStudents) *
                            100
                        )}%`,
                      }}
                    ></div>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>
                      Đã đăng ký:{" "}
                      <span className="font-mono font-bold">
                        {viewingTopic.currentStudents || 0}
                      </span>
                    </span>
                    <span>
                      Tối đa:{" "}
                      <span className="font-mono font-bold">
                        {viewingTopic.maxStudents}
                      </span>
                    </span>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <h4 className="flex items-center gap-2 font-bold text-gray-900 mb-2">
                    <Info size={16} className="text-blue-500" /> Mô tả đề tài
                  </h4>
                  <p className="text-sm text-gray-600 leading-relaxed bg-gray-50 p-4 rounded-lg border border-gray-100">
                    {viewingTopic.description}
                  </p>
                </div>

                <div>
                  <h4 className="flex items-center gap-2 font-bold text-gray-900 mb-2">
                    <CheckCircle size={16} className="text-green-500" /> Yêu cầu
                    sinh viên
                  </h4>
                  <p className="text-sm text-gray-600 leading-relaxed bg-gray-50 p-4 rounded-lg border border-gray-100 whitespace-pre-line">
                    {viewingTopic.requirements}
                  </p>
                </div>

                {viewingTopic.studyReferences &&
                  viewingTopic.studyReferences.length > 0 && (
                    <div>
                      <h4 className="flex items-center gap-2 font-bold text-gray-900 mb-2">
                        <BookOpen size={16} className="text-purple-500" /> Tài
                        liệu tham khảo
                      </h4>
                      <ul className="list-disc list-inside text-sm text-gray-600 bg-gray-50 p-4 rounded-lg border border-gray-100 space-y-1">
                        {viewingTopic.studyReferences.map(
                          (ref: string, idx: number) => (
                            <li key={idx}>{ref}</li>
                          )
                        )}
                      </ul>
                    </div>
                  )}
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-5 border-t border-gray-200 bg-gray-50 flex justify-end">
              <button
                onClick={() => setShowDetailModal(false)}
                className="px-4 py-2 bg-white border border-gray-300 text-gray-700 font-bold rounded shadow-sm hover:bg-gray-50 text-sm transition-colors"
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}
      {/* Reusable Warning Modal */}
      <WarningModal
        isOpen={warningState.isOpen}
        onClose={() => setWarningState({ ...warningState, isOpen: false })}
        type={warningState.type}
        message={warningState.message}
      />
    </div>
  );
};

export default ThesisRegistration;
