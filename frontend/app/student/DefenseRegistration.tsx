"use client";
import React, { useState } from "react";
import { useAuth } from "../../contexts/AuthContext";
import {
  CheckCircle,
  AlertCircle,
  Clock,
  ShieldCheck, // Icon for Defense
} from "lucide-react";
import { gql } from "@apollo/client";
import { useQuery, useMutation } from "@apollo/client/react";

const GET_MY_REGISTRATION_DEFENSE = gql`
  query GetMyRegistrationDefenseInfo($studentId: String!) {
    myRegistrations(studentId: $studentId) {
      id
      studentId
      status
      registeredAt
      topic {
        title
      }
    }
  }
`;

const REGISTER_FOR_DEFENSE = gql`
  mutation RegisterForDefense($registrationId: String!) {
    registerForDefense(registrationId: $registrationId) {
      id
      status
    }
  }
`;

const GET_ACTIVE_PERIOD_DEFENSE_PHASE = gql`
  query GetActivePeriodDefensePhase {
    thesisPeriods {
      id
      status
      milestones {
        name
        startDate
        endDate
      }
    }
  }
`;

const DefenseRegistration: React.FC = () => {
  const { user } = useAuth();
  const studentId = user?.profileId;

  // -- Data Fetching --
  const {
    data: regData,
    loading: regLoading,
    refetch: refetchReg,
  } = useQuery<{ myRegistrations: any[] }>(GET_MY_REGISTRATION_DEFENSE, {
    variables: { studentId },
    skip: !studentId,
  });

  const { data: periodData, loading: periodLoading } = useQuery<{
    thesisPeriods: any[];
  }>(GET_ACTIVE_PERIOD_DEFENSE_PHASE);

  const [registerDefense, { loading: submitting }] =
    useMutation(REGISTER_FOR_DEFENSE);
  const [message, setMessage] = useState<{
    type: "success" | "error";
    content: string;
  } | null>(null);

  // -- Derived State --
  const myReg = regData?.myRegistrations?.[0];

  // Check Eligibility
  const isEligible = myReg?.status === "defense_ready"; // Must have passed plagiarism check
  const isRegistered =
    myReg?.status === "defense_registered" ||
    myReg?.status === "defended" ||
    myReg?.status === "completed"; // Assuming new status or reusing existing?
  // Let's assume a new status "defense_registered" or just use "defense_ready" and move to "in_council"?
  // Or maybe "defense_ready" IS the state where they can register, and after registering it becomes "defense_pending" (waiting for council)?
  // User said "Đăng ký bảo vệ".
  // Let's try to add logic:
  // If status is 'defense_ready', show button "Register".
  // After click, status -> 'defense_pending' (waiting for council).

  // Need to update Backend Enum again? Or reuse 'defense_ready' as "Ready for Council"?
  // Let's assume we need a status 'defense_pending' or 'defense_registered'.
  // I will check database.types.ts again.
  // It has 'defense_ready'.
  // Maybe 'defense_ready' means "Ready for Student to Register"?
  // And after student registers, it becomes... what?
  // Maybe 'defense_requested'?
  // Or maybe this step is just a confirmation?
  // Let's assume status 'defense_registered' is needed.
  // Or I can use 'submitted' -> 'defense_ready' (after plagiarism) -> 'defense_registered' (after student confirms).

  // I will add 'defense_registered' to the enum in DB in next step if needed.
  // For now, let's implement the UI assuming a mutation that handles it.

  const handleRegister = async () => {
    if (!myReg) return;
    if (!confirm("Xác nhận đăng ký tham gia bảo vệ khóa luận?")) return;

    try {
      await registerDefense({
        variables: { registrationId: myReg.id },
      });

      setMessage({
        type: "success",
        content:
          "Đăng ký thành công! Hồ sơ của bạn đã được chuyển đến Hội đồng.",
      });
      refetchReg();
    } catch (err: any) {
      setMessage({ type: "error", content: err.message || "Có lỗi xảy ra" });
    }
  };

  if (regLoading || periodLoading)
    return <div className="p-8 text-center text-gray-500">Đang tải...</div>;

  if (!myReg)
    return (
      <div className="p-8 text-center">Chưa có dữ liệu đăng ký đề tài.</div>
    );

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 md:p-8">
      <div className="mb-8 border-b border-gray-100 pb-6">
        <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
          <ShieldCheck className="text-indigo-600" />
          Đăng ký Bảo vệ Khóa luận
        </h1>
        <p className="mt-2 text-gray-600">
          Giai đoạn 3: Xác nhận tham gia bảo vệ trước Hội đồng chấm khóa luận.
        </p>
      </div>

      <div className="flex flex-col gap-6">
        {/* Status Alert */}
        <div
          className={`p-4 rounded-xl border flex items-start gap-3 ${
            isRegistered
              ? "bg-green-50 border-green-200 text-green-800"
              : isEligible
              ? "bg-blue-50 border-blue-200 text-blue-800"
              : "bg-yellow-50 border-yellow-200 text-yellow-800"
          }`}
        >
          {isRegistered ? (
            <CheckCircle className="mt-1" />
          ) : isEligible ? (
            <AlertCircle className="mt-1" />
          ) : (
            <Clock className="mt-1" />
          )}
          <div>
            <h3 className="font-bold text-lg">
              {isRegistered
                ? "Đã đăng ký bảo vệ"
                : isEligible
                ? "Đủ điều kiện đăng ký"
                : "Chưa đủ điều kiện"}
            </h3>
            <p className="mt-1 opacity-90">
              {isRegistered
                ? "Bạn đã hoàn tất thủ tục đăng ký. Vui lòng theo dõi lịch bảo vệ."
                : isEligible
                ? "Chúc mừng! Bạn đã qua vòng rà soát đạo văn. Vui lòng nhấn đăng ký bên dưới."
                : "Bạn cần hoàn thành Nộp khóa luận và Rà soát đạo văn trước."}
            </p>
          </div>
        </div>

        {/* Action */}
        {(() => {
          const activePeriod = periodData?.thesisPeriods?.[0]; // Assuming query returns active ones? Or filter? Query name says GetActivePeriod
          // Query returns "thesisPeriods" - likely array.
          // Let's filter client side or assume only 1 active returned.
          // Actually, backend usually returns active if query named GetActive.
          // Let's assume list of all periods? No, "GetActivePeriodDefensePhase".
          // Let's find "active" one just in case.

          // Find milestone "Đăng ký bảo vệ"
          const defenseMilestone = periodData?.thesisPeriods
            ?.find((p: any) => p.status === "active")
            ?.milestones?.find((m: any) => m.name === "Đăng ký bảo vệ");

          const isTime = () => {
            if (!defenseMilestone) return true;
            const now = new Date();
            return (
              now >= new Date(defenseMilestone.startDate) &&
              now <= new Date(defenseMilestone.endDate)
            );
          };

          if (isEligible && !isRegistered) {
            if (!isTime()) {
              return (
                <div className="mt-4 flex flex-col items-center">
                  <div className="text-red-600 font-bold mb-2">
                    Chưa đến thời gian đăng ký bảo vệ hoặc đã quá hạn.
                  </div>
                  <div className="text-sm text-gray-500">
                    {defenseMilestone
                      ? `Thời gian: ${new Date(
                          defenseMilestone.startDate
                        ).toLocaleDateString()} - ${new Date(
                          defenseMilestone.endDate
                        ).toLocaleDateString()}`
                      : ""}
                  </div>
                </div>
              );
            }

            return (
              <div className="mt-4 flex justify-center">
                <button
                  onClick={handleRegister}
                  disabled={submitting}
                  className="bg-indigo-600 text-white px-8 py-4 rounded-xl font-bold shadow-xl hover:bg-indigo-700 hover:shadow-indigo-500/40 transition-all text-lg flex items-center gap-3 transform hover:-translate-y-1"
                >
                  {submitting
                    ? "Đang xử lý..."
                    : "Đăng Ký Tham Gia Bảo Vệ Ngay"}
                  {!submitting && <ShieldCheck size={24} />}
                </button>
              </div>
            );
          }
        })()}

        {message && (
          <div
            className={`p-4 rounded-lg flex items-center gap-2 ${
              message.type === "success"
                ? "bg-green-100 text-green-700"
                : "bg-red-100 text-red-700"
            }`}
          >
            {message.type === "success" ? (
              <CheckCircle size={20} />
            ) : (
              <AlertCircle size={20} />
            )}
            {message.content}
          </div>
        )}
      </div>
    </div>
  );
};

export default DefenseRegistration;
