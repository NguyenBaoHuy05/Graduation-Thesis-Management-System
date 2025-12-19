"use client";

import { CheckCircle2, Circle, Clock, AlertCircle } from "lucide-react";
import { ThesisPeriod, PeriodMilestone } from "../data/mockData";

interface TimelineSectionProps {
  period: ThesisPeriod;
  simpleMode?: boolean;
}

export default function TimelineSection({ period, simpleMode = false }: TimelineSectionProps) {
  // Sort milestones by date
  const sortedMilestones = [...period.milestones].sort(
    (a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime()
  );

  const getStatus = (milestone: PeriodMilestone) => {
    const now = new Date();
    const start = new Date(milestone.startDate);
    const end = milestone.endDate ? new Date(milestone.endDate) : null;

    if (end && now > end) return "completed";
    if (now >= start && (!end || now <= end)) return "active";
    return "upcoming";
  };

  return (
    <div className={`${simpleMode ? "py-6 px-4" : "py-16"} bg-gray-50`}>
      <div className={`${simpleMode ? "" : "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"}`}>
        {!simpleMode && (
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Lộ trình Khóa luận - {period.academicYear}
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            {period.name}. Theo dõi các mốc thời gian quan trọng để đảm bảo tiến độ
            của bạn.
          </p>
        </div>
        )}

        <div className="relative">
          {/* Connecting Line (Desktop) */}
          <div className="hidden md:block absolute top-1/2 left-0 w-full h-1 bg-gray-200 -translate-y-1/2 z-0"></div>

          <div className={`grid grid-cols-1 ${simpleMode ? "md:grid-cols-5 gap-4" : "md:grid-cols-5 gap-8"} relative z-10`}>
            {sortedMilestones.map((milestone, index) => {
              const status = getStatus(milestone);
              return (
                <div key={milestone.id} className="relative group">
                  {/* Icon Wrapper */}
                  <div className="flex flex-col items-center">
                    <div
                      className={`w-10 h-10 rounded-full border-4 flex items-center justify-center bg-white transition-all duration-300 z-10 mb-2
                        ${
                          status === "completed"
                            ? "border-green-500 text-green-500 shadow-green-100"
                            : status === "active"
                            ? "border-blue-500 text-blue-500 shadow-lg shadow-blue-200 scale-110"
                            : "border-gray-300 text-gray-300"
                        }`}
                    >
                      {status === "completed" ? (
                        <CheckCircle2 size={18} />
                      ) : status === "active" ? (
                        <Clock size={18} className="animate-pulse" />
                      ) : (
                        <Circle size={18} />
                      )}
                    </div>

                    {/* Content Card */}
                    <div className={`${simpleMode ? "p-3 text-xs" : "p-6"} bg-white rounded-xl shadow-sm border border-gray-100 w-full hover:shadow-md transition-shadow`}>
                     {!simpleMode && (
                      <div className="flex items-center gap-2 mb-2">
                        <span
                          className={`text-xs font-bold px-2 py-1 rounded uppercase tracking-wider
                          ${
                            status === "completed"
                              ? "bg-green-100 text-green-700"
                              : status === "active"
                              ? "bg-blue-100 text-blue-700"
                              : "bg-gray-100 text-gray-500"
                          }`}
                        >
                          {status === "completed"
                            ? "Đã qua"
                            : status === "active"
                            ? "Đang diễn ra"
                            : "Sắp tới"}
                        </span>
                      </div>
                      )}
                      <h3 className={`font-bold text-gray-900 ${simpleMode ? "mb-1 text-center" : "mb-2 min-h-[3rem]"}`}>
                        {milestone.name}
                      </h3>
                      <div className={`${simpleMode ? "text-center text-[10px]" : "text-sm"} text-gray-500 space-y-1`}>
                        <p>{milestone.startDate}</p>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
