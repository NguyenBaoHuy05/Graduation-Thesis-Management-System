"use client";
import React, { useState } from "react";
import { mockNotifications } from "../../data/mockData";
import { useAuth } from "../../contexts/AuthContext";
import { Bell, Info, AlertTriangle, CheckCircle, XCircle } from "lucide-react";

const NotificationList: React.FC = () => {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState(
    mockNotifications.filter((n) => n.userId === user?.profileId)
  );

  const markAsRead = (id: string) => {
    setNotifications(
      notifications.map((n) => (n.id === id ? { ...n, isRead: true } : n))
    );
  };

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  const getIcon = (type: string) => {
    switch (type) {
      case "success":
        return <CheckCircle size={20} className="text-green-600" />;
      case "warning":
        return <AlertTriangle size={20} className="text-yellow-600" />;
      case "error":
        return <XCircle size={20} className="text-red-600" />;
      default:
        return <Info size={20} className="text-blue-600" />;
    }
  };

  const getBgColor = (type: string) => {
    switch (type) {
      case "success":
        return "bg-green-50 border-green-200";
      case "warning":
        return "bg-yellow-50 border-yellow-200";
      case "error":
        return "bg-red-50 border-red-200";
      default:
        return "bg-blue-50 border-blue-200";
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="bg-blue-100 p-2 rounded-lg relative">
            <Bell size={24} className="text-blue-600" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                {unreadCount}
              </span>
            )}
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Thông báo</h2>
            <p className="text-sm text-gray-500">
              {unreadCount > 0
                ? `${unreadCount} thông báo chưa đọc`
                : "Tất cả đã đọc"}
            </p>
          </div>
        </div>
      </div>

      {notifications.length === 0 ? (
        <div className="text-center py-12">
          <div className="bg-gray-100 p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
            <Bell size={32} className="text-gray-400" />
          </div>
          <p className="text-gray-500">Không có thông báo nào</p>
        </div>
      ) : (
        <div className="space-y-3">
          {notifications
            .sort(
              (a, b) =>
                new Date(b.createdAt).getTime() -
                new Date(a.createdAt).getTime()
            )
            .map((notification) => (
              <div
                key={notification.id}
                onClick={() => markAsRead(notification.id)}
                className={`border rounded-lg p-4 transition-all cursor-pointer ${
                  notification.isRead
                    ? "bg-white border-gray-200"
                    : `${getBgColor(notification.type)} border-2`
                } hover:shadow-md`}
              >
                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0 mt-0.5">
                    {getIcon(notification.type)}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between mb-1">
                      <h4
                        className={`font-semibold ${
                          notification.isRead
                            ? "text-gray-700"
                            : "text-gray-900"
                        }`}
                      >
                        {notification.title}
                      </h4>
                      {!notification.isRead && (
                        <span className="ml-2 w-2 h-2 bg-blue-600 rounded-full flex-shrink-0" />
                      )}
                    </div>

                    <p
                      className={`text-sm mb-2 ${
                        notification.isRead ? "text-gray-500" : "text-gray-700"
                      }`}
                    >
                      {notification.message}
                    </p>

                    <p className="text-xs text-gray-400">
                      {new Date(notification.createdAt).toLocaleString(
                        "vi-VN",
                        {
                          year: "numeric",
                          month: "2-digit",
                          day: "2-digit",
                          hour: "2-digit",
                          minute: "2-digit",
                        }
                      )}
                    </p>
                  </div>
                </div>
              </div>
            ))}
        </div>
      )}
    </div>
  );
};

export default NotificationList;
