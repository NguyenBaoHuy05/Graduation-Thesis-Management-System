import React from "react";
import { AlertCircle, X, CheckCircle } from "lucide-react";

interface WarningModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  message: string;
  type?: "error" | "success" | "warning";
}

const WarningModal: React.FC<WarningModalProps> = ({
  isOpen,
  onClose,
  title,
  message,
  type = "error",
}) => {
  if (!isOpen) return null;

  const getIcon = () => {
    switch (type) {
      case "success":
        return <CheckCircle className="text-green-500" size={48} />;
      case "warning":
        return <AlertCircle className="text-yellow-500" size={48} />;
      case "error":
      default:
        return <AlertCircle className="text-red-500" size={48} />;
    }
  };

  const getTitle = () => {
    if (title) return title;
    switch (type) {
      case "success":
        return "Thành công";
      case "warning":
        return "Cảnh báo";
      case "error":
      default:
        return "Đã xảy ra lỗi";
    }
  };

  const getButtonColor = () => {
    switch (type) {
      case "success":
        return "bg-green-600 hover:bg-green-700 focus:ring-green-500";
      case "warning":
        return "bg-yellow-600 hover:bg-yellow-700 focus:ring-yellow-500";
      case "error":
      default:
        return "bg-red-600 hover:bg-red-700 focus:ring-red-500";
    }
  };

  return (
    <div className="fixed inset-0 z-[999] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
      <div
        className="bg-white rounded-2xl shadow-xl w-full max-w-sm overflow-hidden transform transition-all animate-in zoom-in-95 duration-200"
        role="dialog"
        aria-modal="true"
      >
        <div className="absolute top-4 right-4">
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <div className="p-6 text-center">
          <div className="flex justify-center mb-4 bg-gray-50 rounded-full w-20 h-20 items-center mx-auto">
            {getIcon()}
          </div>

          <h3 className="text-xl font-bold text-gray-900 mb-2">{getTitle()}</h3>

          <p className="text-gray-600 text-sm leading-relaxed mb-6">
            {message}
          </p>

          <button
            onClick={onClose}
            className={`w-full py-2.5 px-4 rounded-xl text-white font-bold shadow-md transition-all transform hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-offset-2 ${getButtonColor()}`}
          >
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
};

export default WarningModal;
