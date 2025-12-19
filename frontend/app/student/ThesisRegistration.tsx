"use client";
import React, { useState, useEffect } from "react";
import {
  mockTopics,
  mockRegistrations,
  mockTeachers,
  Topic,
  ThesisRegistration as Registration,
} from "../../data/mockData";
import { useAuth } from "../../contexts/AuthContext";
import {
  BookOpen,
  User,
  Users,
  CheckCircle,
  Info,
  Search,
  Filter,
  Eye,
} from "lucide-react";

const ThesisRegistration: React.FC = () => {
  const { user } = useAuth();
  
  // State for search and filter
  const [searchTerm, setSearchTerm] = useState("");
  const [specializationFilter, setSpecializationFilter] = useState("");
  
  // State for modals
  const [selectedTopic, setSelectedTopic] = useState<Topic | null>(null); // For Confirmation
  const [viewingTopic, setViewingTopic] = useState<Topic | null>(null); // For Details
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);

  // Local state for registration to simulate immediate update
  const [myRegistration, setMyRegistration] = useState<Registration | undefined>(undefined);

  useEffect(() => {
    // Initialize registration from mock data
    const reg = mockRegistrations.find((r) => r.studentId === user?.profileId);
    setMyRegistration(reg);
  }, [user]);

  const approvedTopics = mockTopics.filter((t) => t.status === "approved");

  // Filtering Logic
  const filteredTopics = approvedTopics.filter((topic) => {
    const teacher = mockTeachers.find((t) => t.id === topic.teacherId);
    const matchesSearch =
      topic.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      topic.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (teacher && teacher.name.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesSpecialization = specializationFilter
      ? topic.specialization === specializationFilter
      : true;

    return matchesSearch && matchesSpecialization;
  });

  const uniqueSpecializations = Array.from(
    new Set(approvedTopics.map((t) => t.specialization))
  );

  const getTeacher = (teacherId: string) => {
    return mockTeachers.find((t) => t.id === teacherId);
  };

  const handleRegisterClick = (topic: Topic) => {
    setSelectedTopic(topic);
    setShowConfirmModal(true);
  };

  const handleViewDetails = (topic: Topic) => {
    setViewingTopic(topic);
    setShowDetailModal(true);
  };

  const confirmRegister = () => {
    if (!selectedTopic || !user) return;
    
    
    // Check has been removed.
    // Logic moved to Topic Proposal Validation (Max Group Size)

    // Simulate API call and state update
    const newRegistration: Registration = {
        id: `reg${Date.now()}`,
        studentId: user.profileId,
        topicId: selectedTopic.id,
        teacherId: selectedTopic.teacherId,
        status: "registered",
        registeredAt: new Date().toISOString()
    };

    setMyRegistration(newRegistration);
    alert("Đăng ký thành công!");
    setShowConfirmModal(false);
    setSelectedTopic(null);
  };

  // Render "Registered View" if student has a registration
  if (myRegistration) {
    const myTopic = mockTopics.find((t) => t.id === myRegistration.topicId);
    const myTeacher = getTeacher(myRegistration.teacherId);

    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center space-x-3 mb-6">
          <div className="bg-green-100 p-2 rounded-lg">
            <CheckCircle size={24} className="text-green-600" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900">
              Đề tài đã đăng ký
            </h2>
            <p className="text-sm text-gray-500">Thông tin khóa luận của bạn</p>
          </div>
        </div>

        <div className="bg-gradient-to-br from-blue-50 to-blue-100 border-2 border-blue-200 rounded-xl p-6 space-y-4">
          <div>
            <p className="text-xs font-medium text-blue-600 mb-1">MÃ ĐỀ TÀI</p>
            <p className="text-lg font-bold text-gray-900">{myTopic?.code}</p>
          </div>

          <div>
            <p className="text-xs font-medium text-blue-600 mb-1">TÊN ĐỀ TÀI</p>
            <p className="text-xl font-bold text-gray-900">{myTopic?.title}</p>
          </div>

          <div className="grid md:grid-cols-2 gap-4 pt-4 border-t border-blue-200">
            <div>
              <p className="text-xs font-medium text-blue-600 mb-1">
                GIÁO VIÊN HƯỚNG DẪN
              </p>
              <p className="text-base font-semibold text-gray-900">
                {myTeacher?.name}
              </p>
              <p className="text-sm text-gray-600">{myTeacher?.email}</p>
            </div>
            <div>
              <p className="text-xs font-medium text-blue-600 mb-1">
                CHUYÊN NGÀNH
              </p>
              <p className="text-base font-semibold text-gray-900">
                {myTopic?.specialization}
              </p>
            </div>
          </div>

          <div className="pt-4 border-t border-blue-200">
            <p className="text-xs font-medium text-blue-600 mb-1">TRẠNG THÁI</p>
            <div className="flex items-center space-x-2">
              {myRegistration.status === "registered" && (
                <span className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-sm font-medium">
                  Đã đăng ký
                </span>
              )}
              {myRegistration.status === "outline_pending" && (
                <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                  Chờ duyệt đề cương
                </span>
              )}
              {myRegistration.status === "outline_approved" && (
                <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
                  Đề cương đã duyệt
                </span>
              )}
              {myRegistration.status === "in_progress" && (
                <span className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm font-medium">
                  Đang thực hiện
                </span>
              )}
              {myRegistration.status === "submitted" && (
                <span className="px-3 py-1 bg-teal-100 text-teal-800 rounded-full text-sm font-medium">
                  Đã nộp khóa luận
                </span>
              )}
            </div>
          </div>

          <div className="pt-4 border-t border-blue-200">
            <p className="text-xs font-medium text-blue-600 mb-2">
              MÔ TẢ ĐỀ TÀI
            </p>
            <p className="text-sm text-gray-700 leading-relaxed">
              {myTopic?.description}
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Render List View
  return (
    <>
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 min-h-[calc(100vh-10rem)]">
        <div className="flex items-center space-x-3 mb-6">
          <div className="bg-blue-100 p-2 rounded-lg">
            <BookOpen size={24} className="text-blue-600" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Đăng ký đề tài</h2>
            <p className="text-sm text-gray-500">
              Tra cứu và đăng ký đề tài khóa luận
            </p>
          </div>
        </div>

        {/* Search & Filter Bar */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="flex-1 relative">
                <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
                <input 
                    type="text" 
                    placeholder="Tìm theo tên đề tài, mã số hoặc GVHD..."
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>
            <div className="w-full md:w-1/4 relative">
                 <Filter className="absolute left-3 top-2.5 text-gray-400" size={18} />
                 <select
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none appearance-none bg-white"
                    value={specializationFilter}
                    onChange={(e) => setSpecializationFilter(e.target.value)}
                 >
                    <option value="">Tất cả chuyên ngành</option>
                    {uniqueSpecializations.map(spec => (
                        <option key={spec} value={spec}>{spec}</option>
                    ))}
                 </select>
            </div>
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6 flex items-start space-x-3">
          <Info size={20} className="text-blue-600 flex-shrink-0 mt-0.5" />
          <div className="text-sm text-blue-800">
            <p className="font-medium mb-1">Lưu ý khi đăng ký:</p>
            <ul className="list-disc list-inside space-y-1 text-blue-700">
              <li>Mỗi sinh viên chỉ được đăng ký 1 đề tài</li>
              <li>Kiểm tra số lượng còn nhận trước khi đăng ký</li>
              <li>Sử dụng chức năng tìm kiếm để lọc đề tài phù hợp</li>
            </ul>
          </div>
        </div>

        <div className="space-y-4">
          {filteredTopics.length === 0 ? (
             <div className="text-center py-12 text-gray-500">
                 Không tìm thấy đề tài nào phù hợp.
             </div>
          ) : (
          filteredTopics.map((topic) => {
            const teacher = topic.teacherId ? getTeacher(topic.teacherId) : undefined;
            const isFull = topic.currentStudents >= topic.maxStudents;
            const isTeacherFull =
              teacher && teacher.currentTheses >= teacher.maxTheses;

            return (
              <div
                key={topic.id}
                className={`border rounded-xl p-5 transition-all ${
                  isFull || isTeacherFull
                    ? "border-gray-200 bg-gray-50"
                    : "border-gray-200 hover:border-blue-300 hover:shadow-md"
                }`}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs font-semibold">
                        {topic.code}
                      </span>
                      <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs">
                        {topic.specialization}
                      </span>
                    </div>
                    <h3 className="text-lg font-bold text-gray-900 mb-2">
                      {topic.title}
                    </h3>
                    <p className="text-sm text-gray-600 leading-relaxed mb-3 line-clamp-2">
                      {topic.description}
                    </p>

                    <div className="flex items-center space-x-4 text-sm mb-3">
                      <div className="flex items-center space-x-2">
                        <User size={16} className="text-gray-400" />
                        <span className="text-gray-700 font-medium">{teacher?.name}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Users size={16} className="text-gray-400" />
                        <span
                          className={`font-medium ${
                            isFull ? "text-red-600" : "text-green-600"
                          }`}
                        >
                          {topic.currentStudents}/{topic.maxStudents}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="ml-4 flex flex-col space-y-2">
                    <button
                        onClick={() => handleViewDetails(topic)}
                        className="px-4 py-2 border border-gray-300 text-gray-700 hover:bg-gray-50 rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-2"
                    >
                        <Eye size={16} /> Chi tiết
                    </button>
                    {isFull || isTeacherFull ? (
                      <button
                        disabled
                        className="px-4 py-2 bg-gray-200 text-gray-500 rounded-lg text-sm font-medium cursor-not-allowed"
                      >
                        Đã đầy
                      </button>
                    ) : (
                      <button
                        onClick={() => handleRegisterClick(topic)}
                        className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-colors"
                      >
                        Đăng ký
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })
          )}
        </div>
      </div>

      {/* Confirmation Modal */}
      {showConfirmModal && selectedTopic && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-2xl max-w-lg w-full">
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-xl font-bold text-gray-900">
                Xác nhận đăng ký
              </h3>
            </div>

            <div className="p-6 space-y-4">
              <div>
                <p className="text-sm font-medium text-gray-500 mb-1">Đề tài</p>
                <p className="text-lg font-bold text-gray-900">
                  {selectedTopic.title}
                </p>
              </div>

              <div>
                <p className="text-sm font-medium text-gray-500 mb-1">
                  Giáo viên hướng dẫn
                </p>
                <p className="text-base font-semibold text-gray-900">
                  {selectedTopic.teacherId
                    ? getTeacher(selectedTopic.teacherId)?.name
                    : "N/A"}
                </p>
              </div>

              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <p className="text-sm text-yellow-800">
                  <strong>Lưu ý:</strong> Sau khi đăng ký, bạn sẽ không thể thay
                  đổi đề tài. Vui lòng xem xét kỹ trước khi xác nhận.
                </p>
              </div>
            </div>

            <div className="p-6 border-t border-gray-200 flex justify-end space-x-3">
              <button
                onClick={() => {
                  setShowConfirmModal(false);
                  setSelectedTopic(null);
                }}
                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Hủy
              </button>
              <button
                onClick={confirmRegister}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Xác nhận đăng ký
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Detail Modal */}
      {showDetailModal && viewingTopic && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
             <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                <div className="p-6 border-b border-gray-200 flex justify-between items-center">
                    <h3 className="text-xl font-bold text-gray-900">Chi tiết đề tài</h3>
                    <button onClick={() => setShowDetailModal(false)} className="text-gray-500 hover:text-gray-700">
                        <span className="text-2xl">&times;</span>
                    </button>
                </div>
                <div className="p-6 space-y-6">
                    <div>
                        <h4 className="text-lg font-bold text-blue-900 mb-2">{viewingTopic.title}</h4>
                        <div className="flex gap-2">
                             <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs font-semibold">
                                {viewingTopic.code}
                            </span>
                            <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs">
                                {viewingTopic.specialization}
                            </span>
                        </div>
                    </div>

                    <div>
                        <h5 className="font-bold text-gray-900 mb-1">Mô tả</h5>
                        <p className="text-gray-700 text-sm leading-relaxed">{viewingTopic.description}</p>
                    </div>

                    <div>
                        <h5 className="font-bold text-gray-900 mb-1">Yêu cầu sinh viên</h5>
                        <p className="text-gray-700 text-sm leading-relaxed whitespace-pre-line">{viewingTopic.requirements}</p>
                    </div>

                    {viewingTopic.references && viewingTopic.references.length > 0 && (
                        <div>
                             <h5 className="font-bold text-gray-900 mb-1">Tài liệu tham khảo</h5>
                             <ul className="list-disc list-inside text-sm text-gray-700">
                                {viewingTopic.references.map((ref, idx) => (
                                    <li key={idx}>{ref}</li>
                                ))}
                             </ul>
                        </div>
                    )}
                    
                    <div className="flex gap-4 pt-4 border-t">
                        <div className="flex-1">
                             <p className="text-xs text-gray-500">Giảng viên hướng dẫn</p>
                             <p className="font-medium text-gray-900">{getTeacher(viewingTopic.teacherId)?.name}</p>
                        </div>
                         <div className="flex-1">
                             <p className="text-xs text-gray-500">Số lượng</p>
                             <p className="font-medium text-gray-900">{viewingTopic.currentStudents}/{viewingTopic.maxStudents}</p>
                        </div>
                    </div>
                </div>
                <div className="p-6 border-t border-gray-200 flex justify-end">
                     <button
                        onClick={() => setShowDetailModal(false)}
                        className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                      >
                        Đóng
                      </button>
                </div>
             </div>
        </div>
      )}
    </>
  );
};

export default ThesisRegistration;
