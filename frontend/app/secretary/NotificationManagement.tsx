"use client";

import React, { useState, useEffect } from "react";
// import { mockNotifications, Notification } from "../../data/mockData"; // Removed mock data
import { Plus, Search, Edit, Trash2, X, Bell, Globe, Lock } from "lucide-react";
import { useQuery, useMutation } from "@apollo/client/react";
import { gql } from "@apollo/client";

// --- GraphQL Operations ---
const GET_NOTIFICATIONS = gql`
  query GetNotifications {
    notifications {
      id
      title
      content
      date
      type
      isRead
    }
  }
`;

const CREATE_NOTIFICATION = gql`
  mutation CreateNotification(
    $title: String!
    $content: String
    $date: String
    $type: String
  ) {
    createNotification(
      title: $title
      content: $content
      date: $date
      type: $type
    ) {
      id
      title
      content
      date
      type
    }
  }
`;

const UPDATE_NOTIFICATION = gql`
  mutation UpdateNotification(
    $id: ID!
    $title: String
    $content: String
    $type: String
  ) {
    updateNotification(id: $id, title: $title, content: $content, type: $type) {
      id
      title
      content
      type
    }
  }
`;

const DELETE_NOTIFICATION = gql`
  mutation DeleteNotification($id: ID!) {
    deleteNotification(id: $id)
  }
`;

// --- Types ---
interface Notification {
  id: string;
  title: string;
  content: string;
  date: string;
  type: "public" | "internal";
  isRead: boolean;
}

/**
 * Management Component for Secretaries to Create/Edit/Delete Notifications
 */
const NotificationManagement: React.FC = () => {
  // --- State ---
  const { data, loading, error, refetch } = useQuery<{
    notifications: Notification[];
  }>(GET_NOTIFICATIONS, {
    // Avoid caching issues during dev
    fetchPolicy: "network-only",
  });

  const [createNotification] = useMutation(CREATE_NOTIFICATION, {
    onCompleted: () => {
      refetch();
      alert("Tạo thông báo thành công!");
    },
    onError: (err) => {
      console.error(err);
      alert("Lỗi khi tạo thông báo: " + err.message);
    },
  });

  const [updateNotification] = useMutation(UPDATE_NOTIFICATION, {
    onCompleted: () => {
      refetch();
      alert("Cập nhật thông báo thành công!");
    },
    onError: (err) => {
      console.error(err);
      alert("Lỗi khi cập nhật thông báo: " + err.message);
    },
  });

  const [deleteNotification] = useMutation(DELETE_NOTIFICATION, {
    onCompleted: () => {
      refetch();
      alert("Xóa thông báo thành công!");
    },
    onError: (err) => {
      console.error(err);
      alert("Lỗi khi xóa thông báo: " + err.message);
    },
  });

  const [searchTerm, setSearchTerm] = useState("");

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const [selectedNotif, setSelectedNotif] = useState<Notification | null>(null);

  const initialFormState: {
    title: string;
    content: string;
    type: Notification["type"];
  } = {
    title: "",
    content: "",
    type: "public",
  };
  const [formData, setFormData] = useState(initialFormState);

  // --- Handlers ---
  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const resetForm = () => {
    setFormData(initialFormState);
    setSelectedNotif(null);
  };

  // Create
  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    createNotification({
      variables: {
        title: formData.title,
        content: formData.content,
        // Send current date as YYYY-MM-DD
        date: new Date().toISOString().split("T")[0],
        type: formData.type,
      },
    });
    setIsAddModalOpen(false);
    resetForm();
  };

  // Update
  const openEditModal = (notif: Notification) => {
    setSelectedNotif(notif);
    setFormData({
      title: notif.title,
      content: notif.content,
      type: notif.type,
    });
    setIsEditModalOpen(true);
  };

  const handleUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedNotif) return;

    updateNotification({
      variables: {
        id: selectedNotif.id,
        title: formData.title,
        content: formData.content,
        type: formData.type,
      },
    });
    setIsEditModalOpen(false);
    resetForm();
  };

  // Delete
  const openDeleteModal = (notif: Notification) => {
    setSelectedNotif(notif);
    setIsDeleteModalOpen(true);
  };

  const handleDelete = () => {
    if (!selectedNotif) return;
    deleteNotification({
      variables: { id: selectedNotif.id },
    });
    setIsDeleteModalOpen(false);
    setSelectedNotif(null);
  };

  // Filter
  const notifications = data?.notifications || [];
  const filteredNotifs = notifications.filter((n: Notification) =>
    n.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) return <div className="p-6">Đang tải dữ liệu...</div>;
  if (error)
    return <div className="p-6 text-red-500">Lỗi: {error.message}</div>;

  return (
    <div className="space-y-6 p-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">
            Quản lý thông báo
          </h2>
          <p className="text-sm text-gray-500">
            Tạo và quản lý các thông báo chung và nội bộ
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
          <span>Tạo thông báo</span>
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
            placeholder="Tìm kiếm thông báo..."
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
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider w-12">
                  Icon
                </th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Tiêu đề / Nội dung
                </th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider w-32">
                  Loại
                </th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider w-32">
                  Ngày tạo
                </th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider text-right w-32">
                  Thao tác
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredNotifs.length > 0 ? (
                filteredNotifs.map((notif: Notification) => (
                  <tr key={notif.id} className="hover:bg-gray-50 transition">
                    <td className="px-6 py-4 text-gray-400">
                      {notif.type === "public" ? (
                        <Globe size={20} className="text-blue-500" />
                      ) : (
                        <Lock size={20} className="text-orange-500" />
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-medium text-gray-900 mb-1">
                        {notif.title}
                      </div>
                      <div className="text-sm text-gray-500 line-clamp-2">
                        {notif.content}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ${
                          notif.type === "public"
                            ? "bg-blue-100 text-blue-800"
                            : "bg-orange-100 text-orange-800"
                        }`}
                      >
                        {notif.type === "public" ? "Công khai" : "Nội bộ"}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {notif.date ? notif.date.split("T")[0] : ""}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end space-x-2">
                        <button
                          onClick={() => openEditModal(notif)}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition"
                          title="Sửa"
                        >
                          <Edit size={18} />
                        </button>
                        <button
                          onClick={() => openDeleteModal(notif)}
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
                    Không có thông báo nào.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add/Edit Modal */}
      {(isAddModalOpen || isEditModalOpen) && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-xl shadow-lg w-full max-w-lg p-6">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-gray-900">
                {isAddModalOpen ? "Tạo thông báo mới" : "Chỉnh sửa thông báo"}
              </h3>
              <button
                onClick={() => {
                  setIsAddModalOpen(false);
                  setIsEditModalOpen(false);
                }}
              >
                <X size={24} className="text-gray-400 hover:text-gray-500" />
              </button>
            </div>
            <form
              onSubmit={isAddModalOpen ? handleCreate : handleUpdate}
              className="space-y-4"
            >
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Tiêu đề <span className="text-red-500">*</span>
                </label>
                <input
                  required
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg outline-none focus:border-blue-500"
                  placeholder="Nhập tiêu đề thông báo"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Loại thông báo
                </label>
                <select
                  name="type"
                  value={formData.type}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg outline-none focus:border-blue-500"
                >
                  <option value="public">Công khai (Trang chủ)</option>
                  <option value="internal">Nội bộ (Đăng nhập)</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nội dung <span className="text-red-500">*</span>
                </label>
                <textarea
                  required
                  name="content"
                  rows={4}
                  value={formData.content}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg outline-none focus:border-blue-500 resize-none"
                  placeholder="Nhập nội dung chi tiết..."
                />
              </div>
              <div className="flex justify-end pt-4 gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setIsAddModalOpen(false);
                    setIsEditModalOpen(false);
                  }}
                  className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  {isAddModalOpen ? "Lưu thông báo" : "Cập nhật"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Modal */}
      {isDeleteModalOpen && selectedNotif && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-lg max-w-sm w-full p-6 text-center">
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              Xác nhận xóa?
            </h3>
            <p className="text-gray-600 mb-6">
              Bạn có chắc muốn xóa thông báo này không?
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

export default NotificationManagement;
