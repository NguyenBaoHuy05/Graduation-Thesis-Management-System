"use client";

import React, { useState } from "react";
// import { mockStudents, Student } from "../../data/mockData";
import { Student } from "../../data/mockData";
import {
  Plus,
  Search,
  Edit,
  Trash2,
  X,
  User,
  Mail,
  Phone,
  AlertCircle,
  GraduationCap,
  BookOpen,
} from "lucide-react";
import { useQuery, useMutation } from "@apollo/client/react";
import { gql } from "@apollo/client";

// --- GraphQL Operations ---
const GET_STUDENTS = gql`
  query GetStudents {
    students {
      id
      code
      name
      email
      phone
      className
      major
      gpa
      creditsAccumulated
    }
  }
`;

const CREATE_STUDENT = gql`
  mutation CreateStudent(
    $code: String!
    $name: String!
    $email: String!
    $phone: String
    $className: String
    $major: String
    $gpa: Float
    $creditsAccumulated: Float
  ) {
    createStudent(
      code: $code
      name: $name
      email: $email
      phone: $phone
      className: $className
      major: $major
      gpa: $gpa
      creditsAccumulated: $creditsAccumulated
    ) {
      id
      code
      name
      email
    }
  }
`;

const UPDATE_STUDENT = gql`
  mutation UpdateStudent(
    $id: String!
    $code: String
    $name: String
    $email: String
    $phone: String
    $className: String
    $major: String
    $gpa: Float
    $creditsAccumulated: Float
  ) {
    updateStudent(
      id: $id
      code: $code
      name: $name
      email: $email
      phone: $phone
      className: $className
      major: $major
      gpa: $gpa
      creditsAccumulated: $creditsAccumulated
    ) {
      id
      code
      name
      email
    }
  }
`;

const DELETE_STUDENT = gql`
  mutation DeleteStudent($id: String!) {
    deleteStudent(id: $id)
  }
`;

const StudentManagement: React.FC = () => {
  // --- State ---
  const [searchTerm, setSearchTerm] = useState("");

  // Modals state
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  // Selected student for Edit/Delete
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);

  // Form State
  const initialFormState: Partial<Student> = {
    code: "",
    name: "",
    class: "", // Maps to className
    major: "",
    email: "",
    phone: "",
    gpa: 0,
    creditsAccumulated: 0,
  };
  const [formData, setFormData] = useState<Partial<Student>>(initialFormState);

  // --- Apollo Hooks ---
  const { data, loading, error, refetch } = useQuery<{ students: Student[] }>(
    GET_STUDENTS
  );
  console.log(data);
  const [createStudent] = useMutation(CREATE_STUDENT, {
    onCompleted: () => {
      refetch();
      setIsAddModalOpen(false);
      resetForm();
      alert("Thêm sinh viên thành công!");
    },
    onError: (err) => alert("Lỗi khi thêm: " + err.message),
  });

  const [updateStudent] = useMutation(UPDATE_STUDENT, {
    onCompleted: () => {
      refetch();
      setIsEditModalOpen(false);
      resetForm();
      alert("Cập nhật thông tin sinh viên thành công!");
    },
    onError: (err) => alert("Lỗi khi cập nhật: " + err.message),
  });

  const [deleteStudent] = useMutation(DELETE_STUDENT, {
    onCompleted: () => {
      refetch();
      setIsDeleteModalOpen(false);
      setSelectedStudent(null);
      alert("Xóa sinh viên thành công!");
    },
    onError: (err) => alert("Lỗi khi xóa: " + err.message),
  });

  const students =
    data?.students.map((s: Student) => ({
      ...s,
      class: s.className || "", // Map className to class for frontend compatibility if needed, or update frontend to use className
    })) || [];

  // --- Handlers ---

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]:
        name === "gpa" || name === "creditsAccumulated" ? Number(value) : value,
    }));
  };

  const resetForm = () => {
    setFormData(initialFormState);
    setSelectedStudent(null);
  };

  // Create
  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    createStudent({
      variables: {
        code: formData.code,
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        className: formData.class, // Map 'class' from form to 'className' in GraphQL
        major: formData.major,
        gpa: formData.gpa,
        creditsAccumulated: formData.creditsAccumulated,
      },
    });
  };

  // Update
  const openEditModal = (student: Student) => {
    setSelectedStudent(student);
    setFormData({
      ...student,
      class: student.className || student.class, // Handle both potential field names
    });
    setIsEditModalOpen(true);
  };

  const handleUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedStudent) return;

    updateStudent({
      variables: {
        id: selectedStudent.id,
        code: formData.code,
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        className: formData.class,
        major: formData.major,
        gpa: formData.gpa,
        creditsAccumulated: formData.creditsAccumulated,
      },
    });
  };

  // Delete
  const openDeleteModal = (student: Student) => {
    setSelectedStudent(student);
    setIsDeleteModalOpen(true);
  };

  const handleDelete = () => {
    if (!selectedStudent) return;
    deleteStudent({
      variables: { id: selectedStudent.id },
    });
  };

  // Filter
  const filteredStudents = students.filter(
    (s) =>
      s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (s.class || s.className || "")
        .toLowerCase()
        .includes(searchTerm.toLowerCase())
  );

  if (loading) return <div className="p-6">Đang tải danh sách...</div>;
  if (error)
    return <div className="p-6 text-red-500">Lỗi: {error.message}</div>;

  return (
    <div className="space-y-6 p-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">
            Quản lý sinh viên
          </h2>
          <p className="text-sm text-gray-500">
            Danh sách sinh viên và quản lý thông tin
          </p>
        </div>
        <button
          onClick={() => {
            resetForm();
            setIsAddModalOpen(true);
          }}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
        >
          <Plus size={20} />
          <span>Thêm sinh viên</span>
        </button>
      </div>

      {/* Search & Filter */}
      <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200">
        <div className="relative">
          <Search
            size={20}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
          />
          <input
            type="text"
            placeholder="Tìm kiếm theo tên, mã sinh viên hoặc lớp..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
          />
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Sinh viên
                </th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Lớp / Ngành
                </th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Liên hệ
                </th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Kết quả học tập
                </th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider text-right">
                  Thao tác
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredStudents.length > 0 ? (
                filteredStudents.map((student) => (
                  <tr key={student.id} className="hover:bg-gray-50 transition">
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-600">
                          <span className="font-bold text-sm">
                            {student.name.split(" ").pop()?.charAt(0)}
                          </span>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {student.name}
                          </div>
                          <div className="text-sm text-gray-500">
                            {student.code}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm font-medium text-gray-900">
                        {student.class || student.className}
                      </div>
                      <div className="text-xs text-gray-500">
                        {student.major}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col space-y-1">
                        <div className="flex items-center text-sm text-gray-600">
                          <Mail size={14} className="mr-1.5" />
                          {student.email}
                        </div>
                        <div className="flex items-center text-sm text-gray-600">
                          <Phone size={14} className="mr-1.5" />
                          {student.phone}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col space-y-1">
                        <div
                          className="flex items-center text-sm text-gray-600"
                          title="Điểm trung bình tích lũy"
                        >
                          <GraduationCap
                            size={14}
                            className="mr-1.5 text-blue-500"
                          />
                          GPA:{" "}
                          <span className="font-medium ml-1">
                            {student.gpa}
                          </span>
                        </div>
                        <div
                          className="flex items-center text-sm text-gray-600"
                          title="Số tín chỉ tích lũy"
                        >
                          <BookOpen
                            size={14}
                            className="mr-1.5 text-green-500"
                          />
                          TC:{" "}
                          <span className="font-medium ml-1">
                            {student.creditsAccumulated}
                          </span>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end space-x-2">
                        <button
                          onClick={() => openEditModal(student)}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition"
                          title="Sửa"
                        >
                          <Edit size={18} />
                        </button>
                        <button
                          onClick={() => openDeleteModal(student)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition"
                          title="Xóa"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={5}
                    className="px-6 py-12 text-center text-gray-500"
                  >
                    <div className="flex flex-col items-center justify-center">
                      <User size={48} className="text-gray-300 mb-3" />
                      <p>Không tìm thấy sinh viên nào phù hợp</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* --- Modals --- */}

      {/* Add Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-xl shadow-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto animate-in fade-in zoom-in duration-200">
            <div className="flex justify-between items-center p-6 border-b border-gray-100">
              <h3 className="text-xl font-bold text-gray-900">
                Thêm sinh viên mới
              </h3>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="text-gray-400 hover:text-gray-500 transition"
              >
                <X size={24} />
              </button>
            </div>

            <form onSubmit={handleCreate} className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">
                    Mã sinh viên <span className="text-red-500">*</span>
                  </label>
                  <input
                    required
                    name="code"
                    value={formData.code}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg outline-none focus:border-blue-500"
                    placeholder="VD: SV001"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">
                    Họ và tên <span className="text-red-500">*</span>
                  </label>
                  <input
                    required
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg outline-none focus:border-blue-500"
                    placeholder="Nhập họ tên đầy đủ"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">
                    Lớp
                  </label>
                  <input
                    name="class"
                    value={formData.class}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg outline-none focus:border-blue-500"
                    placeholder="VD: CNTT-K17"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">
                    Ngành học
                  </label>
                  <input
                    name="major"
                    value={formData.major}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg outline-none focus:border-blue-500"
                    placeholder="VD: Công nghệ thông tin"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">
                    Email <span className="text-red-500">*</span>
                  </label>
                  <input
                    required
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg outline-none focus:border-blue-500"
                    placeholder="email@student.edu.vn"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">
                    Số điện thoại
                  </label>
                  <input
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg outline-none focus:border-blue-500"
                    placeholder="09xxxxxxx"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">
                    GPA (Thang 4)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    max="4"
                    min="0"
                    name="gpa"
                    value={formData.gpa}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg outline-none focus:border-blue-500"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">
                    Tín chỉ tích lũy
                  </label>
                  <input
                    type="number"
                    name="creditsAccumulated"
                    value={formData.creditsAccumulated}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end space-x-3 pt-4 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium"
                >
                  Lưu sinh viên
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {isEditModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-xl shadow-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto animate-in fade-in zoom-in duration-200">
            <div className="flex justify-between items-center p-6 border-b border-gray-100">
              <h3 className="text-xl font-bold text-gray-900">
                Cập nhật thông tin sinh viên
              </h3>
              <button
                onClick={() => setIsEditModalOpen(false)}
                className="text-gray-400 hover:text-gray-500 transition"
              >
                <X size={24} />
              </button>
            </div>

            <form onSubmit={handleUpdate} className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">
                    Mã sinh viên <span className="text-red-500">*</span>
                  </label>
                  <input
                    required
                    name="code"
                    value={formData.code}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg outline-none focus:border-blue-500 bg-gray-50"
                    readOnly
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">
                    Họ và tên <span className="text-red-500">*</span>
                  </label>
                  <input
                    required
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg outline-none focus:border-blue-500"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">
                    Lớp
                  </label>
                  <input
                    name="class"
                    value={formData.class}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg outline-none focus:border-blue-500"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">
                    Ngành học
                  </label>
                  <input
                    name="major"
                    value={formData.major}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg outline-none focus:border-blue-500"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">
                    Email <span className="text-red-500">*</span>
                  </label>
                  <input
                    required
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg outline-none focus:border-blue-500"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">
                    Số điện thoại
                  </label>
                  <input
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg outline-none focus:border-blue-500"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">
                    GPA (Thang 4)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    max="4"
                    min="0"
                    name="gpa"
                    value={formData.gpa}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg outline-none focus:border-blue-500"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">
                    Tín chỉ tích lũy
                  </label>
                  <input
                    type="number"
                    name="creditsAccumulated"
                    value={formData.creditsAccumulated}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end space-x-3 pt-4 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
                  className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium"
                >
                  Cập nhật
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {isDeleteModalOpen && selectedStudent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-xl shadow-lg max-w-sm w-full p-6 text-center animate-in fade-in zoom-in duration-200">
            <div className="mx-auto bg-red-100 w-16 h-16 rounded-full flex items-center justify-center mb-4">
              <AlertCircle size={32} className="text-red-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              Xác nhận xóa?
            </h3>
            <p className="text-gray-600 mb-6">
              Bạn có chắc chắn muốn xóa sinh viên{" "}
              <span className="font-semibold text-gray-900">
                {selectedStudent.name}
              </span>
              ? Hành động này không thể hoàn tác.
            </p>
            <div className="flex space-x-3 justify-center">
              <button
                onClick={() => setIsDeleteModalOpen(false)}
                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 font-medium transition-colors"
              >
                Hủy bỏ
              </button>
              <button
                onClick={handleDelete}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 font-medium transition-colors"
              >
                Xóa sinh viên
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StudentManagement;
