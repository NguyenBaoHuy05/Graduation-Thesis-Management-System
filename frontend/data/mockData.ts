export interface Teacher {
  id: string;
  code: string;
  name: string;
  dateOfBirth: string;
  gender: "Nam" | "Nữ";
  title: string;
  titleCoefficient: number;
  maxTheses: number;
  currentTheses: number;
  specialization: string;
  email: string;
  phone: string;
}

export interface Topic {
  id: string;
  code: string;
  title: string;
  description: string;
  requirements: string;
  references: string[];
  teacherId: string;
  specialization: string;
  status: "pending" | "approved" | "rejected";
  maxStudents: number;
  currentStudents: number;
  createdAt: string;
}

export interface Secretary {
  id: string;
  code: string;
  name: string;
  dateOfBirth: string;
  gender: "Nam" | "Nữ";
  email: string;
  phone: string;
}

export interface Head {
  id: string;
  code: string;
  name: string;
  dateOfBirth: string;
  gender: "Nam" | "Nữ";
  email: string;
  phone: string;
}

export interface Student {
  id: string;
  code: string;
  name: string;
  email: string;
  phone: string;
  class: string;
  major: string;
}

export interface ThesisRegistration {
  id: string;
  studentId: string;
  topicId: string;
  teacherId: string;
  status:
    | "registered"
    | "outline_pending"
    | "outline_rejected"
    | "outline_approved"
    | "in_progress"
    | "submitted"
    | "graded";
  registeredAt: string;
  outlineSubmittedAt?: string;
  outlineFeedback?: string;
  thesisSubmittedAt?: string;
  thesisNumber?: string;
  codeLink?: string;
  score?: number;
}

export interface Timeline {
  id: string;
  registrationId: string;
  milestone: string;
  description: string;
  dueDate: string;
  status: "pending" | "completed" | "overdue";
  completedAt?: string;
  feedback?: string;
}

export interface DefenseCouncil {
  id: string;
  name: string;
  date: string;
  time: string;
  room: string;
  members: string[];
  thesisIds: string[];
}

export interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: "info" | "warning" | "success" | "error";
  isRead: boolean;
  createdAt: string;
}

export interface Complaint {
  id: string;
  studentId: string;
  registrationId: string;
  title: string;
  description: string;
  status: "pending" | "reviewing" | "resolved" | "rejected";
  response?: string;
  createdAt: string;
  resolvedAt?: string;
}

export interface User {
  id: string;
  username: string;
  password: string;
  role: "student" | "teacher" | "secretary" | "head";
  profileId: string;
}

export const mockUsers: User[] = [
  {
    id: "u1",
    username: "SV001",
    password: "123456",
    role: "student",
    profileId: "st1",
  },
  {
    id: "u2",
    username: "SV002",
    password: "123456",
    role: "student",
    profileId: "st2",
  },
  {
    id: "u3",
    username: "SV003",
    password: "123456",
    role: "student",
    profileId: "st3",
  },
  {
    id: "u4",
    username: "SV004",
    password: "123456",
    role: "student",
    profileId: "st4",
  },
  {
    id: "u5",
    username: "GV001",
    password: "123456",
    role: "teacher",
    profileId: "t1",
  },
  {
    id: "u6",
    username: "GV002",
    password: "123456",
    role: "teacher",
    profileId: "t2",
  },
  {
    id: "u7",
    username: "GV003",
    password: "123456",
    role: "teacher",
    profileId: "t3",
  },
  {
    id: "u8",
    username: "HD001",
    password: "123456",
    role: "head",
    profileId: "h1",
  },
  {
    id: "u9",
    username: "SC001",
    password: "123456",
    role: "secretary",
    profileId: "s1",
  },
];

export const mockSecretaries: Secretary[] = [
  {
    id: "s1",
    code: "SV001",
    name: "Nguyễn Thị Hương",
    dateOfBirth: "1988-03-22",
    gender: "Nữ",
    email: "huong.nt@university.edu.vn",
    phone: "0987654321",
  },
];

export const mockHeads: Head[] = [
  {
    id: "h1",
    code: "HD001",
    name: "Trần Văn Quang",
    dateOfBirth: "1970-11-05",
    gender: "Nam",
    email: "quang.tv@university.edu.vn",
    phone: "0976543210",
  },
];

export const mockTeachers: Teacher[] = [
  {
    id: "t1",
    code: "GV001",
    name: "TS. Nguyễn Văn An",
    dateOfBirth: "1980-05-15",
    gender: "Nam",
    title: "Tiến sĩ",
    titleCoefficient: 1.5,
    maxTheses: 9,
    currentTheses: 2,
    specialization: "Trí tuệ nhân tạo",
    email: "nva@university.edu.vn",
    phone: "0901234567",
  },
  {
    id: "t2",
    code: "GV002",
    name: "PGS.TS. Trần Thị Bình",
    dateOfBirth: "1975-08-20",
    gender: "Nữ",
    title: "Phó giáo sư",
    titleCoefficient: 2.0,
    maxTheses: 12,
    currentTheses: 1,
    specialization: "Phát triển phần mềm",
    email: "ttb@university.edu.vn",
    phone: "0912345678",
  },
  {
    id: "t3",
    code: "GV003",
    name: "ThS. Lê Minh Cường",
    dateOfBirth: "1985-12-10",
    gender: "Nam",
    title: "Thạc sĩ",
    titleCoefficient: 1.0,
    maxTheses: 6,
    currentTheses: 1,
    specialization: "An ninh mạng",
    email: "lmc@university.edu.vn",
    phone: "0923456789",
  },
];

export const mockStudents: Student[] = [
  {
    id: "st1",
    code: "SV001",
    name: "Nguyễn Minh Đức",
    email: "duc.nm@student.edu.vn",
    phone: "0934567890",
    class: "CNTT-K17",
    major: "Công nghệ thông tin",
  },
  {
    id: "st2",
    code: "SV002",
    name: "Phạm Thu Hà",
    email: "ha.pt@student.edu.vn",
    phone: "0945678901",
    class: "CNTT-K17",
    major: "Công nghệ thông tin",
  },
  {
    id: "st3",
    code: "SV003",
    name: "Trần Văn Nam",
    email: "nam.tv@student.edu.vn",
    phone: "0956789012",
    class: "CNTT-K17",
    major: "Công nghệ thông tin",
  },
  {
    id: "st4",
    code: "SV004",
    name: "Lê Thị Mai",
    email: "mai.lt@student.edu.vn",
    phone: "0967890123",
    class: "CNTT-K17",
    major: "Công nghệ thông tin",
  },
];

export const mockTopics: Topic[] = [
  {
    id: "tp1",
    code: "DT001",
    title: "Xây dựng hệ thống chatbot hỗ trợ tư vấn sử dụng AI",
    description:
      "Nghiên cứu và xây dựng hệ thống chatbot thông minh có khả năng hiểu ngữ cảnh và trả lời câu hỏi của người dùng",
    requirements:
      "Sinh viên cần có kiến thức về NLP, Machine Learning, và framework chatbot. Kỹ năng lập trình Python và làm việc với API.",
    references: [
      "Natural Language Processing with Python - Bird, Klein, Loper",
      "Building Chatbots with Python - Sumit Raj",
      "https://huggingface.co/docs",
    ],
    teacherId: "t1",
    specialization: "Trí tuệ nhân tạo",
    status: "approved",
    maxStudents: 2,
    currentStudents: 1,
    createdAt: "2025-08-15",
  },
  {
    id: "tp2",
    code: "DT002",
    title: "Ứng dụng quản lý bán hàng trực tuyến với React và Node.js",
    description:
      "Xây dựng ứng dụng web quản lý bán hàng đầy đủ tính năng: quản lý sản phẩm, đơn hàng, khách hàng, báo cáo thống kê",
    requirements:
      "Sinh viên cần thành thạo ReactJS, Node.js, Express, MongoDB. Hiểu biết về RESTful API và thiết kế UI/UX.",
    references: [
      "Node.js Design Patterns - Mario Casciaro",
      "React - The Complete Guide - Maximilian Schwarzmüller",
      "https://nodejs.org/docs",
    ],
    teacherId: "t2",
    specialization: "Phát triển phần mềm",
    status: "approved",
    maxStudents: 1,
    currentStudents: 1,
    createdAt: "2025-08-16",
  },
  {
    id: "tp3",
    code: "DT003",
    title: "Hệ thống phát hiện xâm nhập mạng sử dụng Deep Learning",
    description:
      "Nghiên cứu và triển khai hệ thống IDS sử dụng mạng neural để phát hiện các hành vi bất thường trong mạng",
    requirements:
      "Kiến thức về an ninh mạng, Deep Learning, Python. Hiểu về các giao thức mạng và phương pháp tấn công phổ biến.",
    references: [
      "Network Security Essentials - William Stallings",
      "Deep Learning for Network Security - Various Authors",
      "https://www.snort.org/",
    ],
    teacherId: "t3",
    specialization: "An ninh mạng",
    status: "approved",
    maxStudents: 1,
    currentStudents: 1,
    createdAt: "2025-08-17",
  },
  {
    id: "tp4",
    code: "DT004",
    title: "Hệ thống nhận diện khuôn mặt thời gian thực",
    description:
      "Xây dựng ứng dụng nhận diện khuôn mặt real-time sử dụng OpenCV và Deep Learning",
    requirements:
      "Kiến thức Computer Vision, Python, OpenCV, TensorFlow hoặc PyTorch. Hiểu về CNN và face recognition.",
    references: [
      "Computer Vision: Algorithms and Applications - Richard Szeliski",
      "Deep Learning for Computer Vision - Rajalingappaa Shanmugamani",
    ],
    teacherId: "t1",
    specialization: "Trí tuệ nhân tạo",
    status: "approved",
    maxStudents: 2,
    currentStudents: 1,
    createdAt: "2025-08-18",
  },
  {
    id: "tp5",
    code: "DT005",
    title: "Ứng dụng mobile quản lý học tập với React Native",
    description:
      "Phát triển ứng dụng di động giúp sinh viên quản lý thời khóa biểu, bài tập, điểm số",
    requirements:
      "React Native, JavaScript/TypeScript, Firebase hoặc backend API. Kinh nghiệm phát triển mobile app.",
    references: [
      "React Native in Action - Nader Dabit",
      "https://reactnative.dev/docs",
    ],
    teacherId: "t2",
    specialization: "Phát triển phần mềm",
    status: "approved",
    maxStudents: 1,
    currentStudents: 0,
    createdAt: "2025-08-19",
  },
];

export const mockRegistrations: ThesisRegistration[] = [
  {
    id: "reg1",
    studentId: "st1",
    topicId: "tp1",
    teacherId: "t1",
    status: "in_progress",
    registeredAt: "2025-09-01",
    outlineSubmittedAt: "2025-09-15",
    outlineFeedback:
      "Đề cương tốt, cần bổ sung thêm phần tài liệu tham khảo và chi tiết hóa timeline.",
  },
  {
    id: "reg2",
    studentId: "st2",
    topicId: "tp2",
    teacherId: "t2",
    status: "submitted",
    registeredAt: "2025-09-02",
    outlineSubmittedAt: "2025-09-16",
    thesisSubmittedAt: "2025-12-15",
    thesisNumber: "KLTN-2025-001",
    codeLink: "https://github.com/student/ecommerce-app",
  },
  {
    id: "reg3",
    studentId: "st3",
    topicId: "tp3",
    teacherId: "t3",
    status: "outline_approved",
    registeredAt: "2025-09-03",
    outlineSubmittedAt: "2025-09-17",
    outlineFeedback: "Đề cương đạt yêu cầu, có thể bắt đầu thực hiện.",
  },
  {
    id: "reg4",
    studentId: "st4",
    topicId: "tp4",
    teacherId: "t1",
    status: "outline_pending",
    registeredAt: "2025-09-04",
    outlineSubmittedAt: "2025-09-18",
  },
];

export const mockTimelines: Timeline[] = [
  {
    id: "tl1",
    registrationId: "reg1",
    milestone: "Nghiên cứu tài liệu",
    description:
      "Hoàn thành việc nghiên cứu các tài liệu liên quan đến NLP và chatbot",
    dueDate: "2025-10-01",
    status: "completed",
    completedAt: "2025-09-28",
    feedback: "Tốt, đã nắm vững lý thuyết cơ bản",
  },
  {
    id: "tl2",
    registrationId: "reg1",
    milestone: "Thiết kế hệ thống",
    description: "Hoàn thành thiết kế kiến trúc hệ thống và database",
    dueDate: "2025-10-20",
    status: "completed",
    completedAt: "2025-10-18",
  },
  {
    id: "tl3",
    registrationId: "reg1",
    milestone: "Cài đặt module NLP",
    description: "Hoàn thành module xử lý ngôn ngữ tự nhiên",
    dueDate: "2025-11-10",
    status: "pending",
  },
  {
    id: "tl4",
    registrationId: "reg1",
    milestone: "Tích hợp và test",
    description: "Tích hợp các module và test hệ thống",
    dueDate: "2025-12-01",
    status: "pending",
  },
];

export const mockDefenseCouncils: DefenseCouncil[] = [
  {
    id: "dc1",
    name: "Hội đồng bảo vệ KLTN - Đợt 1/2025",
    date: "2025-12-20",
    time: "08:00",
    room: "Phòng E101",
    members: ["t1", "t2", "t3"],
    thesisIds: ["reg2"],
  },
];

export const mockNotifications: Notification[] = [
  {
    id: "n1",
    userId: "st1",
    title: "Phản hồi đề cương",
    message:
      "Giáo viên hướng dẫn đã phản hồi đề cương của bạn. Vui lòng kiểm tra và chỉnh sửa.",
    type: "info",
    isRead: false,
    createdAt: "2025-09-16T10:30:00",
  },
  {
    id: "n2",
    userId: "st1",
    title: "Cập nhật tiến độ",
    message:
      'Đến hạn cập nhật tiến độ "Cài đặt module NLP" vào ngày 10/11/2025',
    type: "warning",
    isRead: false,
    createdAt: "2025-10-25T09:00:00",
  },
  {
    id: "n3",
    userId: "st2",
    title: "Lịch bảo vệ khóa luận",
    message: "Lịch bảo vệ: 20/12/2025, 08:00 tại phòng E101",
    type: "success",
    isRead: true,
    createdAt: "2025-12-10T14:00:00",
  },
  {
    id: "n4",
    userId: "t1",
    title: "Sinh viên nộp đề cương",
    message:
      "Sinh viên Lê Thị Mai đã nộp đề cương. Vui lòng kiểm tra và phản hồi.",
    type: "info",
    isRead: false,
    createdAt: "2025-09-18T16:45:00",
  },
];

export const mockComplaints: Complaint[] = [
  {
    id: "c1",
    studentId: "st3",
    registrationId: "reg3",
    title: "Khiếu nại về thời gian phản hồi",
    description:
      "Giáo viên hướng dẫn không phản hồi email và tin nhắn trong 2 tuần qua. Em cần hướng dẫn để tiếp tục thực hiện đề tài.",
    status: "reviewing",
    createdAt: "2025-10-15T10:00:00",
  },
];
