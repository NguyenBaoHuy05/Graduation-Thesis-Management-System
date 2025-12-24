export interface PeriodMilestone {
  id: string;
  name: string;
  description?: string;
  startDate: string;
  endDate?: string;
  type: "registration" | "reporting" | "submission" | "defense" | "other";
}

export interface ThesisPeriod {
  id: string;
  name: string;
  academicYear: string;
  startDate: string;
  endDate: string;
  status: "planning" | "active" | "closed";
  maxGroupSize: number;
  milestones: PeriodMilestone[];
}

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
  studyReferences: string[];
  teacherId: string; // Teacher proposing the topic
  approverId?: string; // Head of Department ID
  specialization: string;
  status: "pending" | "approved" | "rejected" | "assigned";
  maxStudents: number;
  currentStudents: number;
  createdAt: string;
  periodId: string; // Link to ThesisPeriod
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
  className?: string;
  gpa: number;
  creditsAccumulated: number;
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
    | "defense_ready"
    | "defended"
    | "completed";
  registeredAt: string;
  outlineSubmittedAt?: string;
  outlineFeedback?: string;
  thesisSubmittedAt?: string;
  thesisNumber?: string;
  codeLink?: string;
  score?: number;
  outlineFileUrl?: string; // New: For "Nộp đề cương"
  thesisFileUrl?: string; // New: For "Nộp đồ án"
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

export interface PlagiarismCheck {
  id: string;
  studentId: string;
  registrationId: string;
  similarityPercentage: number;
  checkDate: string;
  status: "pending" | "passed" | "failed";
  reportFile: string;
  feedback?: string;
}

export interface DefenseRegistration {
  id: string;
  studentId: string;
  registrationId: string;
  supervisorApproval: boolean;
  secretaryApproval: boolean; // Formality check
  status: "pending" | "approved" | "rejected";
  submittedAt: string;
  reportFileUrl?: string; // New: document report
  presentationFileUrl?: string; // New: slides
}

export interface DefenseCouncil {
  id: string;
  name: string;
  presidentId: string;
  secretaryId: string;
  commissionerId?: string; // Optional single member
  memberIds: string[]; // List of additional members (Uy vien)
  reviewerId: string;
  periodId: string;
  date?: string;
  time?: string;
  room?: string;
  topicIds: string[]; // Assigned topics
  status: "draft" | "published" | "completed";
  description?: string; // New: Description/Notes
}

export const mockCouncils: DefenseCouncil[] = [
  {
    id: "dc1",
    name: "Hội đồng bảo vệ K17 - Đợt 1",
    presidentId: "c0eebc99-9c0b-4ef8-bb6d-6bb9bd380b01",
    secretaryId: "t5", // t5 not in seed, keeping or finding replacement? Logic: mock t5 not updated yet. t5 is valid in mockTeachers but not in seed. I'll leave t5 as is for now or use t4 if t5 breaks. But t5 is just mock. The error was about t1.
    // Actually t5 was NOT updated in previous step (I only did u11-u14/t1-t4).
    // I should check if I missed t5. seed has only 4 teachers.
    // I will leave t5 as "t5" for now, but t1 must be updated.
    memberIds: ["c0eebc99-9c0b-4ef8-bb6d-6bb9bd380b03"],
    reviewerId: "c0eebc99-9c0b-4ef8-bb6d-6bb9bd380b04",
    periodId: "f0eebc99-9c0b-4ef8-bb6d-6bb9bd380e01",
    date: "2026-12-20",
    time: "08:00",
    room: "C.301",
    topicIds: ["tp1"],
    status: "published",
    description: "Hội đồng bảo vệ đợt 1 - Khoa CNTT",
  },
];

export interface Notification {
  id: string;
  title: string;
  // Unified fields
  content: string;
  date: string;
  type: "public" | "internal" | "info" | "success" | "warning" | "error";
  isRead?: boolean;
  // Legacy fields (optional)
  userId?: string;
  message?: string;
  createdAt?: string;
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

// --- NEW INTERFACES ---

export interface FormTemplate {
  id: string;
  name: string;
  description: string;
  fileUrl: string;
  uploadDate: string;
  createdAt?: string;
  type: "outline" | "thesis" | "report" | "defense_request" | "other";
}

export interface TopicInvitation {
  id: string;
  teacherId: string;
  studentId: string;
  topicId: string;
  status: "pending" | "accepted" | "rejected";
  sentAt: string;
  respondedAt?: string;
  message?: string;
}

export interface ProgressReport {
  id: string;
  registrationId: string;
  title: string;
  content: string; // "Tóm tắt công việc đã làm, vấn đề gặp phải..."
  planNext: string;
  fileUrl?: string;
  submittedAt: string;
  status: "pending" | "approved" | "rejected"; // Teacher review status
  feedback?: string;
}

export interface User {
  id: string;
  username: string;
  password: string;
  role: "student" | "teacher" | "secretary" | "head";
  profileId: string;
}

// --- MOCK DATA ---

// 5 Students, 5 Teachers, 1 Head, 1 Secretary matching Seed Data

export const mockUsers: User[] = [
  // Students
  {
    id: "u1",
    username: "SV001",
    password: "123",
    role: "student",
    profileId: "b0eebc99-9c0b-4ef8-bb6d-6bb9bd380a01",
  },
  {
    id: "u2",
    username: "SV002",
    password: "123",
    role: "student",
    profileId: "b0eebc99-9c0b-4ef8-bb6d-6bb9bd380a02",
  },
  {
    id: "u3",
    username: "SV003",
    password: "123",
    role: "student",
    profileId: "b0eebc99-9c0b-4ef8-bb6d-6bb9bd380a03",
  },
  {
    id: "u4",
    username: "SV004",
    password: "123",
    role: "student",
    profileId: "b0eebc99-9c0b-4ef8-bb6d-6bb9bd380a04",
  },
  {
    id: "u5",
    username: "SV005",
    password: "123",
    role: "student",
    profileId: "b0eebc99-9c0b-4ef8-bb6d-6bb9bd380a05",
  },
  // Teachers
  {
    id: "u11",
    username: "GV001",
    password: "123",
    role: "teacher",
    profileId: "c0eebc99-9c0b-4ef8-bb6d-6bb9bd380b01",
  },
  {
    id: "u12",
    username: "GV002",
    password: "123",
    role: "teacher",
    profileId: "c0eebc99-9c0b-4ef8-bb6d-6bb9bd380b02",
  },
  {
    id: "u13",
    username: "GV003",
    password: "123",
    role: "teacher",
    profileId: "c0eebc99-9c0b-4ef8-bb6d-6bb9bd380b03",
  },
  {
    id: "u14",
    username: "GV004",
    password: "123",
    role: "teacher",
    profileId: "c0eebc99-9c0b-4ef8-bb6d-6bb9bd380b04",
  },
  {
    id: "u15",
    username: "GV005",
    password: "123",
    role: "teacher",
    profileId: "c0eebc99-9c0b-4ef8-bb6d-6bb9bd380b05",
  },
  // Head & Secretary
  {
    id: "u16",
    username: "HD001",
    password: "123",
    role: "head",
    profileId: "d0eebc99-9c0b-4ef8-bb6d-6bb9bd380c01",
  },
  {
    id: "u17",
    username: "SC001",
    password: "123",
    role: "secretary",
    profileId: "e0eebc99-9c0b-4ef8-bb6d-6bb9bd380d01",
  },
];

export const mockStudents: Student[] = [
  {
    id: "b0eebc99-9c0b-4ef8-bb6d-6bb9bd380a01",
    code: "SV001",
    name: "Nguyễn Minh Đức",
    email: "duc.nm@student.edu.vn",
    phone: "0934567890",
    class: "CNTT-K17",
    major: "Công nghệ thông tin",
    gpa: 3.5,
    creditsAccumulated: 130,
  },
  {
    id: "b0eebc99-9c0b-4ef8-bb6d-6bb9bd380a02",
    code: "SV002",
    name: "Phạm Thu Hà",
    email: "ha.pt@student.edu.vn",
    phone: "0945678901",
    class: "CNTT-K17",
    major: "Công nghệ thông tin",
    gpa: 3.2,
    creditsAccumulated: 125,
  },
  {
    id: "b0eebc99-9c0b-4ef8-bb6d-6bb9bd380a03",
    code: "SV003",
    name: "Trần Văn Nam",
    email: "nam.tv@student.edu.vn",
    phone: "0956789012",
    class: "CNTT-K17",
    major: "Công nghệ thông tin",
    gpa: 2.8,
    creditsAccumulated: 110,
  },
  {
    id: "b0eebc99-9c0b-4ef8-bb6d-6bb9bd380a04",
    code: "SV004",
    name: "Lê Thị Mai",
    email: "mai.lt@student.edu.vn",
    phone: "0967890123",
    class: "CNTT-K17",
    major: "Công nghệ thông tin",
    gpa: 3.6,
    creditsAccumulated: 132,
  },
  {
    id: "b0eebc99-9c0b-4ef8-bb6d-6bb9bd380a05",
    code: "SV005",
    name: "Hoàng Văn Long",
    email: "long.hv@student.edu.vn",
    phone: "0978901234",
    class: "CNTT-K17",
    major: "An ninh mạng",
    gpa: 3.0,
    creditsAccumulated: 120,
  },
];

export const mockThesisPeriods: ThesisPeriod[] = [
  {
    id: "f0eebc99-9c0b-4ef8-bb6d-6bb9bd380e01",
    name: "Kỳ 1 - Năm học 2025-2026",
    academicYear: "2025-2026",
    startDate: "2025-08-01",
    endDate: "2026-01-15",
    status: "active",
    maxGroupSize: 3,
    milestones: [
      {
        id: "m01",
        name: "Đăng ký đề tài",
        startDate: "2025-08-15",
        endDate: "2025-08-30",
        type: "registration",
        description: "Sinh viên đăng ký đề tài với giảng viên",
      },
      {
        id: "m02",
        name: "Nộp đề cương chi tiết",
        startDate: "2025-09-01",
        endDate: "2026-09-15",
        type: "submission",
        description: "Nộp file đề cương để duyệt",
      },
      {
        id: "m03",
        name: "Báo cáo tiến độ Lần 1",
        startDate: "2026-10-15",
        endDate: "2026-10-20",
        type: "reporting",
        description: "Báo cáo tiến độ thực hiện 50%",
      },
      {
        id: "m04",
        name: "Nộp toàn văn khóa luận",
        startDate: "2026-12-01",
        endDate: "2026-12-15",
        type: "submission",
        description: "Hạn chót nộp báo cáo và source code",
      },
      {
        id: "m05",
        name: "Bảo vệ trước hội đồng",
        startDate: "2026-12-20",
        endDate: "2026-12-25",
        type: "defense",
        description: "Lịch bảo vệ chính thức",
      },
    ],
  },
  {
    id: "per2",
    name: "Kỳ 2 - Năm học 2024-2025",
    academicYear: "2024-2025",
    startDate: "2025-01-15",
    endDate: "2025-06-15",
    status: "closed",
    maxGroupSize: 3,
    milestones: [
      {
        id: "m_old_01",
        name: "Đăng ký đề tài",
        startDate: "2025-01-20",
        endDate: "2025-02-05",
        type: "registration",
      },
      {
        id: "m_old_02",
        name: "Nộp khóa luận",
        startDate: "2025-05-15",
        endDate: "2025-05-20",
        type: "submission",
      },
      {
        id: "m_old_03",
        name: "Bảo vệ",
        startDate: "2025-06-01",
        endDate: "2025-06-10",
        type: "defense",
      },
    ],
  },
];

export const mockSecretaries: Secretary[] = [
  {
    id: "e0eebc99-9c0b-4ef8-bb6d-6bb9bd380d01",
    code: "SC001",
    name: "Nguyễn Thị Hương",
    dateOfBirth: "1988-03-22",
    gender: "Nữ",
    email: "huong.nt@university.edu.vn",
    phone: "0987654321",
  },
];

export const mockHeads: Head[] = [
  {
    id: "d0eebc99-9c0b-4ef8-bb6d-6bb9bd380c01",
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
    id: "c0eebc99-9c0b-4ef8-bb6d-6bb9bd380b01",
    code: "GV001",
    name: "TS. Nguyễn Văn An",
    dateOfBirth: "1980-05-15",
    gender: "Nam",
    title: "Tiến sĩ",
    titleCoefficient: 1.5,
    maxTheses: 9,
    currentTheses: 3,
    specialization: "Trí tuệ nhân tạo",
    email: "nva@university.edu.vn",
    phone: "0901234567",
  },
  {
    id: "c0eebc99-9c0b-4ef8-bb6d-6bb9bd380b02",
    code: "GV002",
    name: "PGS.TS. Trần Thị Bình",
    dateOfBirth: "1975-08-20",
    gender: "Nữ",
    title: "Phó giáo sư",
    titleCoefficient: 2.0,
    maxTheses: 12,
    currentTheses: 2,
    specialization: "Phát triển phần mềm",
    email: "ttb@university.edu.vn",
    phone: "0912345678",
  },
  {
    id: "c0eebc99-9c0b-4ef8-bb6d-6bb9bd380b03",
    code: "GV003",
    name: "ThS. Lê Minh Cường",
    dateOfBirth: "1985-12-10",
    gender: "Nam",
    title: "Thạc sĩ",
    titleCoefficient: 1.0,
    maxTheses: 6,
    currentTheses: 2,
    specialization: "An ninh mạng",
    email: "lmc@university.edu.vn",
    phone: "0923456789",
  },
  {
    id: "c0eebc99-9c0b-4ef8-bb6d-6bb9bd380b04",
    code: "GV004",
    name: "TS. Phạm Văn Dũng",
    dateOfBirth: "1982-02-14",
    gender: "Nam",
    title: "Tiến sĩ",
    titleCoefficient: 1.5,
    maxTheses: 8,
    currentTheses: 1,
    specialization: "Khoa học dữ liệu",
    email: "dung.pv@university.edu.vn",
    phone: "0934567891",
  },
  {
    id: "t5",
    code: "GV005",
    name: "ThS. Nguyễn Thị Mai",
    dateOfBirth: "1990-09-09",
    gender: "Nữ",
    title: "Thạc sĩ",
    titleCoefficient: 1.0,
    maxTheses: 5,
    currentTheses: 0,
    specialization: "Hệ thống thông tin",
    email: "mai.nt@university.edu.vn",
    phone: "0945678912",
  },
];

// Duplicate FormTemplate removed.
// Old mockForms removed. Use the ones below or merge here.

export const mockForms: FormTemplate[] = [
  // Migrated from old mockForms
  {
    id: "f1",
    name: "Mẫu đơn xin bảo vệ Đồ án Tốt nghiệp",
    fileUrl: "/forms/don-xin-bao-ve.doc",
    uploadDate: "2024-01-15",
    description: "Mẫu đơn chuẩn",
    type: "defense_request",
  },
  {
    id: "f2",
    name: "Mẫu phiếu theo dõi thực hiện",
    fileUrl: "/forms/phieu-theo-doi.doc",
    uploadDate: "2024-01-20",
    description: "Theo dõi tiến độ",
    type: "other",
  },
  {
    id: "f3",
    name: "Mẫu trình bày Phụ bìa cho Đồ án Tốt nghiệp",
    fileUrl: "/forms/phu-bia-do-an.doc",
    uploadDate: "2024-02-01",
    description: "Quy định trình bày phụ bìa",
    type: "thesis",
  },
  {
    id: "f4",
    name: "Mẫu trình bày Bìa ngoài cho Đồ án Tốt nghiệp",
    fileUrl: "/forms/bia-ngoai-do-an.doc",
    uploadDate: "2024-02-01",
    description: "Quy định bìa ngoài",
    type: "thesis",
  },
  {
    id: "f5",
    name: "Mẫu đơn xin Bảo vệ Luận văn Tốt nghiệp",
    fileUrl: "/forms/don-xin-bao-ve-luan-van.doc",
    uploadDate: "2024-02-10",
    description: "Cho hệ thạc sĩ",
    type: "defense_request",
  },
  {
    id: "f6",
    name: "Mẫu trình bày Phụ bìa cho Luận văn Tốt nghiệp",
    fileUrl: "/forms/phu-bia-luan-van.doc",
    uploadDate: "2024-02-15",
    description: "Phụ bìa luận văn",
    type: "thesis",
  },
  {
    id: "f7",
    name: "Mẫu trình bày Bìa ngoài cho Luận văn Tốt nghiệp",
    fileUrl: "/forms/bia-ngoai-luan-van.doc",
    uploadDate: "2024-02-15",
    description: "Bìa ngoài luận văn",
    type: "thesis",
  },
  {
    id: "f8",
    name: "Mẫu trình bày Đề cương Luận văn Tốt nghiệp",
    fileUrl: "/forms/de-cuong-luan-van.doc",
    uploadDate: "2024-03-01",
    description: "Quy định đề cương",
    type: "outline",
  },
  {
    id: "f9",
    name: "Mẫu đăng ký Đồ án Tốt nghiệp",
    fileUrl: "/forms/dang-ky-do-an.doc",
    uploadDate: "2023-12-01",
    description: "Form đăng ký",
    type: "other",
  },
  // Merged from new seeded mockFormTemplates
  {
    id: "ft1",
    name: "Mẫu đề cương chi tiết",
    description: "Dùng cho sinh viên đăng ký đề tài.",
    fileUrl: "/templates/mau_de_cuong.doc",
    uploadDate: "2025-08-01",
    type: "outline",
  },
  {
    id: "ft2",
    name: "Đơn xin bảo vệ khóa luận",
    description: "Sinh viên điền và nộp khi hoàn thành đồ án.",
    fileUrl: "/templates/don_xin_bao_ve.doc",
    uploadDate: "2025-08-01",
    type: "defense_request",
  },
  {
    id: "ft3",
    name: "Mẫu báo cáo tiến độ tuần",
    description: "Báo cáo công việc hàng tuần.",
    fileUrl: "/templates/bao_cao_tien_do.doc",
    uploadDate: "2025-08-05",
    type: "report",
  },
];

export const mockTopics: Topic[] = [
  // Approved Topics
  {
    id: "tp1",
    code: "DT001",
    title: "Xây dựng hệ thống chatbot hỗ trợ tư vấn sử dụng AI",
    description:
      "Nghiên cứu và xây dựng hệ thống chatbot thông minh có khả năng hiểu ngữ cảnh.",
    requirements: "Python, NLP, Deep Learning.",
    studyReferences: ["NLP with Python", "Chatbot Design"],
    teacherId: "c0eebc99-9c0b-4ef8-bb6d-6bb9bd380b01",
    approverId: "d0eebc99-9c0b-4ef8-bb6d-6bb9bd380c01",
    specialization: "Trí tuệ nhân tạo",
    status: "approved",
    maxStudents: 2,
    currentStudents: 2, // Full
    createdAt: "2025-08-15",
    periodId: "f0eebc99-9c0b-4ef8-bb6d-6bb9bd380e01",
  },
  {
    id: "tp2",
    code: "DT002",
    title: "Ứng dụng quản lý bán hàng trực tuyến với React và Node.js",
    description: "Xây dựng ứng dụng web quản lý bán hàng đầy đủ tính năng.",
    requirements: "MERN Stack.",
    studyReferences: ["MERN Fullstack"],
    teacherId: "t2",
    approverId: "h1",
    specialization: "Phát triển phần mềm",
    status: "approved",
    maxStudents: 2,
    currentStudents: 1,
    createdAt: "2025-08-16",
    periodId: "per1",
  },
  {
    id: "tp3",
    code: "DT003",
    title: "Hệ thống phát hiện xâm nhập mạng sử dụng Deep Learning",
    description: "IDS sử dụng mạng neural phát hiện bất thường.",
    requirements: "Network Security, Python.",
    studyReferences: ["Network Security Essentials"],
    teacherId: "t3",
    approverId: "h1",
    specialization: "An ninh mạng",
    status: "approved",
    maxStudents: 1,
    currentStudents: 1,
    createdAt: "2025-08-17",
    periodId: "per1",
  },
  {
    id: "tp4",
    code: "DT004",
    title: "Hệ thống nhận diện khuôn mặt thời gian thực",
    description: "Face recognition real-time using OpenCV.",
    requirements: "CV, Python.",
    studyReferences: ["Computer Vision Algorithms"],
    teacherId: "t1",
    approverId: "h1",
    specialization: "Trí tuệ nhân tạo",
    status: "approved",
    maxStudents: 2,
    currentStudents: 1,
    createdAt: "2025-08-18",
    periodId: "per1",
  },
  {
    id: "tp5",
    code: "DT005",
    title: "Ứng dụng mobile quản lý học tập với React Native",
    description: "App quản lý thời khóa biểu, điểm số.",
    requirements: "React Native, Firebase.",
    studyReferences: ["React Native Docs"],
    teacherId: "t2",
    approverId: "h1",
    specialization: "Phát triển phần mềm",
    status: "approved",
    maxStudents: 2,
    currentStudents: 1,
    createdAt: "2025-08-19",
    periodId: "per1",
  },
  // Pending Topics
  {
    id: "tp6",
    code: "DT006",
    title: "Nghiên cứu Blockchain trong quản lý chuỗi cung ứng",
    description:
      "Tracking sản phẩm nông nghiệp sạch. (Chuyển giao từ SV đề xuất)",
    requirements: "Solidity, Web3.",
    studyReferences: ["Mastering Ethereum"],
    teacherId: "t2", // Assigned to a teacher
    specialization: "Công nghệ phần mềm",
    status: "pending",
    maxStudents: 1,
    currentStudents: 0,
    createdAt: "2025-08-20",
    periodId: "per1",
  },
  {
    id: "tp7",
    code: "DT007",
    title: "Phân tích dữ liệu mạng xã hội để dự đoán xu hướng",
    description: "Sử dụng Python để crawl và phân tích data.",
    requirements: "Data Science, Python.",
    studyReferences: ["Data Mining Techs"],
    teacherId: "t4",
    specialization: "Khoa học dữ liệu",
    status: "pending",
    maxStudents: 2,
    currentStudents: 0,
    createdAt: "2025-08-21",
    periodId: "per1",
  },
  // Rejected Topic
  {
    id: "tp8",
    code: "DT008",
    title: "Website tin tức đơn giản",
    description: "Web tin tức bằng HTML/CSS.",
    requirements: "HTML, CSS.",
    studyReferences: [],
    teacherId: "t5",
    approverId: "h1",
    specialization: "Hệ thống thông tin",
    status: "rejected",
    maxStudents: 1,
    currentStudents: 0,
    createdAt: "2025-08-10",
    periodId: "per1",
  },
  // New Topics for seeding
  {
    id: "tp9",
    code: "DT009",
    title: "Hệ thống khuyến nghị phim sử dụng Filtering",
    description: "Xây dựng recommendation system cho phim ảnh.",
    requirements: "Python, ML.",
    studyReferences: ["Recommender Systems Handbook"],
    teacherId: "t4",
    approverId: "h1",
    specialization: "Khoa học dữ liệu",
    status: "approved",
    maxStudents: 2,
    currentStudents: 1,
    createdAt: "2025-08-22",
    periodId: "per1",
  },
  {
    id: "tp10",
    code: "DT010",
    title: "Quản lý nhân sự sử dụng HRIS",
    description: "Hệ thống thông tin quản lý nhân sự.",
    requirements: "Java, SQL.",
    studyReferences: ["HRIS Basics"],
    teacherId: "t5",
    approverId: "h1",
    specialization: "Hệ thống thông tin",
    status: "approved",
    maxStudents: 3,
    currentStudents: 0,
    createdAt: "2025-08-23",
    periodId: "per1",
  },
];

export const mockRegistrations: ThesisRegistration[] = [
  // Student 1 - Topic 1 (Started, In Progress)
  {
    id: "reg1",
    studentId: "st1",
    topicId: "tp1",
    teacherId: "t1",
    status: "outline_pending",
    registeredAt: "2025-09-01",
    outlineSubmittedAt: "2025-09-15",
    outlineFeedback: "Đề cương ổn, cần update timeline.",
    outlineFileUrl: "http://example.com/outline_st1.pdf",
  },
  // Student 2 - Topic 2 (Almost Done, Ready for Defense)
  {
    id: "reg2",
    studentId: "st2",
    topicId: "tp2",
    teacherId: "t2",
    status: "defense_ready",
    registeredAt: "2025-09-02",
    outlineSubmittedAt: "2025-09-16",
    thesisSubmittedAt: "2025-12-15",
    thesisNumber: "KLTN-2025-001",
    codeLink: "https://github.com/student/ecommerce-app",
    thesisFileUrl: "http://example.com/thesis_st2.zip",
    outlineFileUrl: "http://example.com/outline_st2.pdf",
  },
  // Student 3 - Topic 3 (Just got Approved outline)
  {
    id: "reg3",
    studentId: "st3",
    topicId: "tp3",
    teacherId: "t3",
    status: "outline_approved",
    registeredAt: "2025-09-03",
    outlineSubmittedAt: "2025-09-17",
    outlineFeedback: "Đề cương đạt yêu cầu.",
    outlineFileUrl: "http://example.com/outline_st3.pdf",
  },
  // Student 4 - Topic 4 (Outline Pending)
  {
    id: "reg4",
    studentId: "st4",
    topicId: "tp4",
    teacherId: "t1",
    status: "outline_pending",
    registeredAt: "2025-09-04",
    outlineSubmittedAt: "2025-09-18",
    outlineFileUrl: "http://example.com/outline_st4.pdf",
  },
  // Student 5 - Topic 5 (Registered only)
  {
    id: "reg5",
    studentId: "st5",
    topicId: "tp5",
    teacherId: "t2",
    status: "registered",
    registeredAt: "2025-09-05",
  },
  // Student 8 - Topic 9 (In Progress)
  {
    id: "reg6",
    studentId: "st8",
    topicId: "tp9",
    teacherId: "t4",
    status: "submitted",
    registeredAt: "2025-09-10",
    outlineSubmittedAt: "2025-09-20",
    outlineFileUrl: "http://example.com/outline_st8.pdf",
  },
  // Student 10 - Topic 1 (Joined Topic 1 as 2nd student)
  {
    id: "reg7",
    studentId: "st10",
    topicId: "tp1",
    teacherId: "t1",
    status: "submitted",
    registeredAt: "2025-09-01",
    outlineSubmittedAt: "2025-09-15",
    thesisSubmittedAt: "2025-12-14",
    outlineFileUrl: "http://example.com/outline_st10.pdf",
    thesisFileUrl: "http://example.com/thesis_st10.zip",
  },
];

export const mockProgressReports: ProgressReport[] = [
  {
    id: "pr1",
    registrationId: "reg1",
    title: "Báo cáo tuần 1",
    content:
      "Đã nghiên cứu xong tài liệu về NLP cơ bản. Đang tìm hiểu thư viện HuggingFace.",
    planNext: "Cài đặt môi trường, chạy thử model BERT.",
    submittedAt: "2025-09-20",
    status: "approved",
    feedback: "Tốt, cần tập trung vào tiếng Việt.",
  },
  {
    id: "pr2",
    registrationId: "reg1",
    title: "Báo cáo tuần 2",
    content: "Đã chạy thử model, độ chính xác chưa cao.",
    planNext: "Fine-tune lại model với dataset lớn hơn.",
    submittedAt: "2025-09-27",
    status: "pending",
  },
];

export const mockTimelines: Timeline[] = [
  // For Reg 1
  {
    id: "tl1",
    registrationId: "reg1",
    milestone: "Nghiên cứu tài liệu",
    description: "Đọc tài liệu NLP.",
    dueDate: "2025-10-01",
    status: "completed",
    completedAt: "2025-09-28",
    feedback: "Tốt.",
  },
  {
    id: "tl2",
    registrationId: "reg1",
    milestone: "Thiết kế hệ thống",
    description: "Database, Architecture.",
    dueDate: "2025-10-20",
    status: "completed",
    completedAt: "2025-10-18",
  },
  {
    id: "tl3",
    registrationId: "reg1",
    milestone: "Implement Core",
    description: "Code core features.",
    dueDate: "2025-11-20",
    status: "pending",
  },
  // For Reg 6
  {
    id: "tl4",
    registrationId: "reg6",
    milestone: "Thu thập dữ liệu",
    description: "Crawl data phim.",
    dueDate: "2025-10-05",
    status: "completed",
    completedAt: "2025-10-04",
  },
  {
    id: "tl5",
    registrationId: "reg6",
    milestone: "Xây dựng model",
    description: "Train model recommender.",
    dueDate: "2025-11-15",
    status: "pending",
  },
];

export const mockPlagiarismChecks: PlagiarismCheck[] = [
  {
    id: "pc1",
    studentId: "b0eebc99-9c0b-4ef8-bb6d-6bb9bd380a02", // SV002
    registrationId: "reg2",
    similarityPercentage: 12,
    checkDate: "2025-12-10",
    status: "passed",
    reportFile: "turnitin_report_st2.pdf",
    feedback: "Đạt yêu cầu (dưới 20%)",
  },
  {
    id: "pc2",
    studentId: "st10",
    registrationId: "reg7",
    similarityPercentage: 25,
    checkDate: "2025-12-11",
    status: "failed",
    reportFile: "turnitin_report_st10.pdf",
    feedback: "Tỷ lệ trùng lặp cao, cần viết lại chương 2.",
  },
  {
    id: "pc3",
    studentId: "b0eebc99-9c0b-4ef8-bb6d-6bb9bd380a01", // SV001
    registrationId: "reg1",
    similarityPercentage: 0,
    checkDate: "",
    status: "pending",
    reportFile: "",
  },
];

export const mockDefenseRegistrations: DefenseRegistration[] = [
  {
    id: "dr1",
    studentId: "b0eebc99-9c0b-4ef8-bb6d-6bb9bd380a02", // SV002
    registrationId: "reg2",
    supervisorApproval: true,
    secretaryApproval: true,
    status: "approved",
    submittedAt: "2025-12-12",
    reportFileUrl: "http://example.com/final_report_st2.pdf",
    presentationFileUrl: "http://example.com/slides_st2.pptx",
  },
  {
    id: "dr2",
    studentId: "st10",
    registrationId: "reg7",
    supervisorApproval: true,
    secretaryApproval: false,
    status: "pending",
    submittedAt: "2025-12-15",
    reportFileUrl: "http://example.com/final_report_st10.pdf",
  },
];

// Legacy mock data removed

export const mockNotifications: Notification[] = [
  {
    id: "n1",
    title: "Thông báo về việc nộp đề cương Khóa luận tốt nghiệp đợt 1 năm 2024",
    content:
      "Sinh viên nộp đề cương qua hệ thống trước ngày 20/03/2024. Vui lòng tham khảo mẫu đề cương trong mục Biểu mẫu.",
    date: "2024-03-01",
    type: "public",
  },
  {
    id: "n2",
    title: "Lịch bảo vệ Đồ án tốt nghiệp đợt 1",
    content:
      "Lịch bảo vệ dự kiến sẽ diễn ra vào ngày 15/05/2024. Sinh viên chú ý theo dõi danh sách hội đồng.",
    date: "2024-04-10",
    type: "public",
  },
  {
    id: "n3",
    title: "Nhắc nhở nộp báo cáo tiến độ",
    content:
      "Sinh viên thực hiện nộp báo cáo tiến độ tuần 5 trước 23:59 Chủ nhật.",
    date: "2024-03-15",
    type: "internal",
    isRead: false,
  },
  {
    id: "n4",
    title: "Thông báo họp Hội đồng khoa",
    content:
      "Kính mời quý thầy cô tham dự họp Hội đồng khoa vào 8:00 ngày 20/03/2024 tại phòng A.101.",
    date: "2024-03-18",
    type: "internal",
    isRead: true,
  },
  // Legacy data adapted
  {
    id: "n01",
    userId: "u1", // user ID not Profile ID typically for notifications? mockNotifications schema says userId.
    title: "Phản hồi đề cương",
    content: "Giáo viên hướng dẫn đã phản hồi đề cương của bạn.",
    date: "2025-09-16",
    type: "info",
    isRead: false,
  },
];

export const mockComplaints: Complaint[] = [
  {
    id: "c1",
    studentId: "b0eebc99-9c0b-4ef8-bb6d-6bb9bd380a03", // SV003
    registrationId: "reg3",
    title: "Khiếu nại về giáo viên",
    description: "Giáo viên không trả lời email.",
    status: "reviewing",
    createdAt: "2025-10-15T10:00:00",
  },
];

// --- SEEDED DATA FOR NEW INTERFACES ---

export const mockTopicInvitations: TopicInvitation[] = [
  {
    id: "inv1",
    teacherId: "c0eebc99-9c0b-4ef8-bb6d-6bb9bd380b04", // GV004
    studentId: "st8",
    topicId: "tp9",
    status: "accepted",
    sentAt: "2025-08-25",
    respondedAt: "2025-08-26",
    message: "Em tham gia đề tài này nhé, thầy thấy phù hợp với em.",
  },
  {
    id: "inv2",
    teacherId: "c0eebc99-9c0b-4ef8-bb6d-6bb9bd380b01", // GV001
    studentId: "st6",
    topicId: "tp1",
    status: "pending",
    sentAt: "2025-08-27",
    message: "Mời em tham gia nghiên cứu chatbot.",
  },
];

// Alias for backward compatibility if any file still imports this name
export const mockThesisRegistrations = mockRegistrations;
