"use client";
import { useState } from "react";
import { Check, AlertCircle, User, BookOpen, Users } from "lucide-react";

interface TopicAssignment {
  id: string;
  topic_title: string;
  student_name: string;
  student_id: string;
  status: "unassigned" | "assigned";
  assigned_advisor?: string;
}

interface Teacher {
  id: string;
  name: string;
  max_students: number;
  current_students: number;
  specialization: string;
}

const mockTeachers: Teacher[] = [
  {
    id: "t1",
    name: "ThS. Nguyễn Văn A",
    max_students: 5,
    current_students: 2,
    specialization: "AI & Machine Learning",
  },
  {
    id: "t2",
    name: "ThS. Trần Thị B",
    max_students: 4,
    current_students: 4,
    specialization: "Web Development",
  },
  {
    id: "t3",
    name: "TS. Lê Văn C",
    max_students: 6,
    current_students: 3,
    specialization: "Big Data & Analytics",
  },
  {
    id: "t4",
    name: "ThS. Phạm Minh D",
    max_students: 5,
    current_students: 1,
    specialization: "Mobile App Development",
  },
];

const mockTopics: TopicAssignment[] = [
  {
    id: "1",
    topic_title: "Ứng dụng ML trong dự báo thời tiết",
    student_name: "Nguyễn Thị Mai",
    student_id: "SV001",
    status: "unassigned",
  },
  {
    id: "2",
    topic_title: "Hệ thống quản lý bán hàng online",
    student_name: "Trần Minh Tuấn",
    student_id: "SV002",
    status: "unassigned",
  },
  {
    id: "3",
    topic_title: "Phân tích dữ liệu big data",
    student_name: "Phạm Quang Huy",
    student_id: "SV003",
    status: "assigned",
    assigned_advisor: "TS. Lê Văn C",
  },
  {
    id: "4",
    topic_title: "Ứng dụng mobile banking",
    student_name: "Lê Thúy Liên",
    student_id: "SV004",
    status: "unassigned",
  },
];

export default function AdvisorAssignment() {
  const [topics, setTopics] = useState<TopicAssignment[]>(mockTopics);
  const [teachers, setTeachers] = useState<Teacher[]>(mockTeachers);
  const [selectedTopic, setSelectedTopic] = useState<string | null>(null);
  const [selectedTeacher, setSelectedTeacher] = useState<string>("");

  const handleAssign = (topicId: string, teacherId: string) => {
    const teacher = teachers.find((t) => t.id === teacherId);
    if (!teacher || teacher.current_students >= teacher.max_students) {
      alert("Giảng viên này đã đạt số lượng sinh viên tối đa!");
      return;
    }

    setTopics(
      topics.map((t) =>
        t.id === topicId
          ? { ...t, status: "assigned", assigned_advisor: teacher.name }
          : t
      )
    );

    setTeachers(
      teachers.map((t) =>
        t.id === teacherId
          ? { ...t, current_students: t.current_students + 1 }
          : t
      )
    );

    setSelectedTopic(null);
    setSelectedTeacher("");
  };

  const unassignedTopics = topics.filter((t) => t.status === "unassigned");

  return (
    <div className="p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Phân công giảng viên hướng dẫn
        </h2>
        <p className="text-gray-600">
          Phân công {unassignedTopics.length} đề tài chưa có giảng viên
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-center gap-3 mb-2">
            <BookOpen className="w-5 h-5 text-blue-600" />
            <span className="text-sm font-medium text-blue-600">
              Tổng đề tài
            </span>
          </div>
          <p className="text-3xl font-bold text-blue-600">{topics.length}</p>
        </div>

        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <div className="flex items-center gap-3 mb-2">
            <AlertCircle className="w-5 h-5 text-yellow-600" />
            <span className="text-sm font-medium text-yellow-600">
              Chưa phân công
            </span>
          </div>
          <p className="text-3xl font-bold text-yellow-600">
            {unassignedTopics.length}
          </p>
        </div>

        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <div className="flex items-center gap-3 mb-2">
            <Check className="w-5 h-5 text-green-600" />
            <span className="text-sm font-medium text-green-600">
              Đã phân công
            </span>
          </div>
          <p className="text-3xl font-bold text-green-600">
            {topics.filter((t) => t.status === "assigned").length}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Danh sách đề tài cần phân công
          </h3>
          {unassignedTopics.length === 0 ? (
            <div className="bg-green-50 border border-green-200 rounded-lg p-8 text-center">
              <Check className="w-12 h-12 text-green-600 mx-auto mb-3" />
              <p className="text-green-800 font-medium">
                Tất cả đề tài đã được phân công
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {unassignedTopics.map((topic) => (
                <div
                  key={topic.id}
                  className={`border rounded-lg p-4 cursor-pointer transition ${
                    selectedTopic === topic.id
                      ? "border-blue-500 bg-blue-50"
                      : "border-gray-200 hover:shadow-md"
                  }`}
                  onClick={() => setSelectedTopic(topic.id)}
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <BookOpen className="w-4 h-4 text-blue-600" />
                        <h4 className="font-semibold text-gray-900">
                          {topic.topic_title}
                        </h4>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <User className="w-4 h-4" />
                        <span>
                          {topic.student_name} ({topic.student_id})
                        </span>
                      </div>
                    </div>
                    <span className="px-2 py-1 text-xs bg-yellow-100 text-yellow-800 rounded font-medium">
                      Chờ phân công
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {selectedTopic && (
          <div className="lg:col-span-1">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Chọn giảng viên
            </h3>
            <div className="space-y-2">
              {teachers.map((teacher) => {
                const available =
                  teacher.current_students < teacher.max_students;
                return (
                  <button
                    key={teacher.id}
                    onClick={() => {
                      setSelectedTeacher(teacher.id);
                      handleAssign(selectedTopic, teacher.id);
                    }}
                    disabled={!available}
                    className={`w-full text-left p-3 rounded-lg border transition ${
                      available
                        ? "border-gray-200 hover:bg-blue-50 cursor-pointer"
                        : "border-gray-200 bg-gray-50 cursor-not-allowed opacity-60"
                    }`}
                  >
                    <div className="flex items-start justify-between mb-1">
                      <span className="font-medium text-gray-900">
                        {teacher.name}
                      </span>
                      <span
                        className={`text-xs font-semibold ${
                          available ? "text-green-600" : "text-red-600"
                        }`}
                      >
                        {teacher.current_students}/{teacher.max_students}
                      </span>
                    </div>
                    <p className="text-xs text-gray-600 mb-1">
                      {teacher.specialization}
                    </p>
                    <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className={`h-full transition-all ${
                          available ? "bg-green-500" : "bg-red-500"
                        }`}
                        style={{
                          width: `${
                            (teacher.current_students / teacher.max_students) *
                            100
                          }%`,
                        }}
                      ></div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {topics.some((t) => t.status === "assigned") && (
        <div className="mt-8 pt-8 border-t border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Đã phân công
          </h3>
          <div className="space-y-2">
            {topics
              .filter((t) => t.status === "assigned")
              .map((topic) => (
                <div
                  key={topic.id}
                  className="flex items-center justify-between p-3 bg-green-50 rounded-lg border border-green-200"
                >
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">
                      {topic.topic_title}
                    </p>
                    <p className="text-sm text-gray-600">
                      {topic.student_name}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4 text-green-600" />
                    <span className="text-sm font-medium text-green-700">
                      {topic.assigned_advisor}
                    </span>
                  </div>
                </div>
              ))}
          </div>
        </div>
      )}
    </div>
  );
}
