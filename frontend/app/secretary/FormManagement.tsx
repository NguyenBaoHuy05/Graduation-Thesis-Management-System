"use client";

import React, { useState, useEffect } from "react";
import { mockForms, FormTemplate } from "../../data/mockData";
import {
  Plus,
  Search,
  Edit,
  Trash2,
  X,
  FileText,
  Download,
  Calendar,
  Link as LinkIcon,
} from "lucide-react";

const FormManagement: React.FC = () => {
  // --- State ---
  const [forms, setForms] = useState<FormTemplate[]>([]);
  const [searchTerm, setSearchTerm] = useState("");

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const [selectedForm, setSelectedForm] = useState<FormTemplate | null>(null);

  const initialFormState = {
    name: "",
    fileUrl: "",
    description: "",
    type: "other" as FormTemplate["type"],
  };
  const [formData, setFormData] = useState(initialFormState);

  useEffect(() => {
    setForms([...mockForms]);
  }, []);

  // --- Handlers ---
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const resetForm = () => {
    setFormData(initialFormState);
    setSelectedForm(null);
  };

  // Create
  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    const newId = `f${Date.now()}`;
    const newForm: FormTemplate = {
      id: newId,
      name: formData.name,

      fileUrl: formData.fileUrl,
      description: formData.description || "Mô tả biểu mẫu",
      uploadDate: new Date().toISOString().split("T")[0],
      type: "other",
    };

    setForms([...forms, newForm]);
    setIsAddModalOpen(false);
    resetForm();
    alert("Thêm biểu mẫu thành công!");
  };

  // Update
  const openEditModal = (form: FormTemplate) => {
    setSelectedForm(form);
    setFormData({
      name: form.name,
      fileUrl: form.fileUrl,
      description: form.description,
      type: form.type,
    });
    setIsEditModalOpen(true);
  };

  const handleUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedForm) return;

    const updatedForms = forms.map((f) =>
      f.id === selectedForm.id
        ? {
            ...f,
            ...formData,
            uploadDate: new Date().toISOString().split("T")[0],
          }
        : f
    );

    setForms(updatedForms);
    setIsEditModalOpen(false);
    resetForm();
    alert("Cập nhật biểu mẫu thành công!");
  };

  // Delete
  const openDeleteModal = (form: FormTemplate) => {
    setSelectedForm(form);
    setIsDeleteModalOpen(true);
  };

  const handleDelete = () => {
    if (!selectedForm) return;
    const filtered = forms.filter((f) => f.id !== selectedForm.id);
    setForms(filtered);
    setIsDeleteModalOpen(false);
    setSelectedForm(null);
    alert("Xóa biểu mẫu thành công!");
  };

  // Filter
  const filteredForms = forms.filter((f) =>
    f.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6 p-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Quản lý biểu mẫu</h2>
          <p className="text-sm text-gray-500">
            Danh sách biểu mẫu và tài liệu hướng dẫn
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
          <span>Thêm biểu mẫu</span>
        </button>
      </div>

      {/* Search */}
      <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200">
        <div className="relative">
          <Search
            size={20}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
          />
          <input
            type="text"
            placeholder="Tìm kiếm biểu mẫu..."
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
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider w-16">
                  TT
                </th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Tên biểu mẫu
                </th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Liên kết / File
                </th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Ngày cập nhật
                </th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider text-right">
                  Thao tác
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredForms.length > 0 ? (
                filteredForms.map((form, index) => (
                  <tr key={form.id} className="hover:bg-gray-50 transition">
                    <td className="px-6 py-4 text-sm text-gray-500 text-center">
                      {index + 1}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <FileText
                          size={20}
                          className="text-blue-500 shrink-0"
                        />
                        <span className="text-sm font-medium text-gray-900">
                          {form.name}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div
                        className="flex items-center text-sm text-blue-600 hover:underline max-w-[200px] truncate"
                        title={form.fileUrl}
                      >
                        <LinkIcon size={14} className="mr-1.5 shrink-0" />
                        <a
                          href={form.fileUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          {form.fileUrl}
                        </a>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center text-sm text-gray-500">
                        <Calendar size={14} className="mr-1.5" />
                        {form.uploadDate}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end space-x-2">
                        <a
                          href={form.fileUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition"
                          title="Tải xuống"
                        >
                          <Download size={18} />
                        </a>
                        <button
                          onClick={() => openEditModal(form)}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition"
                          title="Sửa"
                        >
                          <Edit size={18} />
                        </button>
                        <button
                          onClick={() => openDeleteModal(form)}
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
                    <p>Không có biểu mẫu nào.</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-xl shadow-lg w-full max-w-lg p-6">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-gray-900">Thêm biểu mẫu</h3>
              <button onClick={() => setIsAddModalOpen(false)}>
                <X size={24} className="text-gray-400 hover:text-gray-500" />
              </button>
            </div>
            <form onSubmit={handleCreate} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Tên biểu mẫu <span className="text-red-500">*</span>
                </label>
                <input
                  required
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg outline-none focus:border-blue-500"
                  placeholder="Nhập tên biểu mẫu"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Đường dẫn tải về (URL) <span className="text-red-500">*</span>
                </label>
                <input
                  required
                  value={formData.fileUrl}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg outline-none focus:border-blue-500"
                  placeholder="/forms/example.doc"
                />
              </div>
              <div className="flex justify-end pt-4 gap-3">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Lưu
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {isEditModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-lg w-full max-w-lg p-6">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-gray-900">Sửa biểu mẫu</h3>
              <button onClick={() => setIsEditModalOpen(false)}>
                <X size={24} className="text-gray-400 hover:text-gray-500" />
              </button>
            </div>
            <form onSubmit={handleUpdate} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Tên biểu mẫu <span className="text-red-500">*</span>
                </label>
                <input
                  required
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg outline-none focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Đường dẫn tải về (URL) <span className="text-red-500">*</span>
                </label>
                <input
                  required
                  name="fileUrl"
                  value={formData.fileUrl}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg outline-none focus:border-blue-500"
                />
              </div>
              <div className="flex justify-end pt-4 gap-3">
                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
                  className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Cập nhật
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Modal */}
      {isDeleteModalOpen && selectedForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-lg max-w-sm w-full p-6 text-center">
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              Xác nhận xóa?
            </h3>
            <p className="text-gray-600 mb-6">
              Bạn có chắc muốn xóa <b>{selectedForm.name}</b>?
            </p>
            <div className="flex justify-center gap-3">
              <button
                onClick={() => setIsDeleteModalOpen(false)}
                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
              >
                Hủy bỏ
              </button>
              <button
                onClick={handleDelete}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
              >
                Xóa
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FormManagement;
