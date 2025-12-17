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
  references: string[];
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
  memberId: string;
  reviewerId: string;
  periodId: string;
}

export interface DefenseSession {
  id: string;
  councilId: string;
  registrationId: string;
  date: string;
  time: string;
  room: string;
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

// --- NEW INTERFACES ---

export interface FormTemplate {
  id: string;
  name: string;
  description: string;
  fileUrl: string;
  uploadDate: string;
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

// 10 Students, 5 Teachers, 1 Head, 1 Secretary

export const mockUsers: User[] = [
  // Students
  { id: "u1", username: "SV001", password: "123", role: "student", profileId: "st1" },
  { id: "u2", username: "SV002", password: "123", role: "student", profileId: "st2" },
  { id: "u3", username: "SV003", password: "123", role: "student", profileId: "st3" },
  { id: "u4", username: "SV004", password: "123", role: "student", profileId: "st4" },
  { id: "u5", username: "SV005", password: "123", role: "student", profileId: "st5" },
  { id: "u6", username: "SV006", password: "123", role: "student", profileId: "st6" },
  { id: "u7", username: "SV007", password: "123", role: "student", profileId: "st7" },
  { id: "u8", username: "SV008", password: "123", role: "student", profileId: "st8" },
  { id: "u9", username: "SV009", password: "123", role: "student", profileId: "st9" },
  { id: "u10", username: "SV010", password: "123", role: "student", profileId: "st10" },
  // Teachers
  { id: "u11", username: "GV001", password: "123", role: "teacher", profileId: "t1" },
  { id: "u12", username: "GV002", password: "123", role: "teacher", profileId: "t2" },
  { id: "u13", username: "GV003", password: "123", role: "teacher", profileId: "t3" },
  { id: "u14", username: "GV004", password: "123", role: "teacher", profileId: "t4" },
  { id: "u15", username: "GV005", password: "123", role: "teacher", profileId: "t5" },
  // Head & Secretary
  { id: "u16", username: "HD001", password: "123", role: "head", profileId: "h1" },
  { id: "u17", username: "SC001", password: "123", role: "secretary", profileId: "s1" },
];

export const mockThesisPeriods: ThesisPeriod[] = [
  {
    id: "per1",
    name: "Kỳ 1 - Năm học 2025-2026",
    academicYear: "2025-2026",
    startDate: "2025-08-01",
    endDate: "2026-01-15",
    status: "active",
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
        endDate: "2025-09-15",
        type: "submission",
        description: "Nộp file đề cương để duyệt",
      },
      {
        id: "m03",
        name: "Báo cáo tiến độ Lần 1",
        startDate: "2025-10-15",
        endDate: "2025-10-20",
        type: "reporting",
        description: "Báo cáo tiến độ thực hiện 50%",
      },
      {
        id: "m04",
        name: "Nộp toàn văn khóa luận",
        startDate: "2025-12-01",
        endDate: "2025-12-15",
        type: "submission",
        description: "Hạn chót nộp báo cáo và source code",
      },
      {
        id: "m05",
        name: "Bảo vệ trước hội đồng",
        startDate: "2025-12-20",
        endDate: "2025-12-25",
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
        }
    ],
  },
];

export const mockSecretaries: Secretary[] = [
  {
    id: "s1",
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
    currentTheses: 3,
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
    currentTheses: 2,
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
    currentTheses: 2,
    specialization: "An ninh mạng",
    email: "lmc@university.edu.vn",
    phone: "0923456789",
  },
  {
    id: "t4",
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

export const mockStudents: Student[] = [
  { id: "st1", code: "SV001", name: "Nguyễn Minh Đức", email: "duc.nm@student.edu.vn", phone: "0934567890", class: "CNTT-K17", major: "Công nghệ thông tin", gpa: 3.5, creditsAccumulated: 130 },
  { id: "st2", code: "SV002", name: "Phạm Thu Hà", email: "ha.pt@student.edu.vn", phone: "0945678901", class: "CNTT-K17", major: "Công nghệ thông tin", gpa: 3.2, creditsAccumulated: 125 },
  { id: "st3", code: "SV003", name: "Trần Văn Nam", email: "nam.tv@student.edu.vn", phone: "0956789012", class: "CNTT-K17", major: "Công nghệ thông tin", gpa: 2.8, creditsAccumulated: 110 },
  { id: "st4", code: "SV004", name: "Lê Thị Mai", email: "mai.lt@student.edu.vn", phone: "0967890123", class: "CNTT-K17", major: "Công nghệ thông tin", gpa: 3.6, creditsAccumulated: 132 },
  { id: "st5", code: "SV005", name: "Hoàng Văn Long", email: "long.hv@student.edu.vn", phone: "0978901234", class: "CNTT-K17", major: "An ninh mạng", gpa: 3.0, creditsAccumulated: 120 },
  { id: "st6", code: "SV006", name: "Vũ Thị Anh", email: "anh.vt@student.edu.vn", phone: "0989012345", class: "CNTT-K17", major: "Hệ thống thông tin", gpa: 3.4, creditsAccumulated: 128 },
  { id: "st7", code: "SV007", name: "Đặng Văn Hùng", email: "hung.dv@student.edu.vn", phone: "0990123456", class: "CNTT-K17", major: "Công nghệ phần mềm", gpa: 2.5, creditsAccumulated: 100 },
  { id: "st8", code: "SV008", name: "Bùi Thị Lan", email: "lan.bt@student.edu.vn", phone: "0901234560", class: "CNTT-K17", major: "Khoa học dữ liệu", gpa: 3.8, creditsAccumulated: 135 },
  { id: "st9", code: "SV009", name: "Ngô Văn Tuấn", email: "tuan.nv@student.edu.vn", phone: "0912345601", class: "CNTT-K17", major: "Công nghệ thông tin", gpa: 3.1, creditsAccumulated: 122 },
  { id: "st10", code: "SV010", name: "Lý Thị Phương", email: "phuong.lt@student.edu.vn", phone: "0923456712", class: "CNTT-K17", major: "Trí tuệ nhân tạo", gpa: 3.3, creditsAccumulated: 126 },
];

export const mockTopics: Topic[] = [
  // Approved Topics
  {
    id: "tp1",
    code: "DT001",
    title: "Xây dựng hệ thống chatbot hỗ trợ tư vấn sử dụng AI",
    description: "Nghiên cứu và xây dựng hệ thống chatbot thông minh có khả năng hiểu ngữ cảnh.",
    requirements: "Python, NLP, Deep Learning.",
    references: ["NLP with Python", "Chatbot Design"],
    teacherId: "t1",
    approverId: "h1",
    specialization: "Trí tuệ nhân tạo",
    status: "approved",
    maxStudents: 2,
    currentStudents: 2, // Full
    createdAt: "2025-08-15",
    periodId: "per1",
  },
  {
    id: "tp2",
    code: "DT002",
    title: "Ứng dụng quản lý bán hàng trực tuyến với React và Node.js",
    description: "Xây dựng ứng dụng web quản lý bán hàng đầy đủ tính năng.",
    requirements: "MERN Stack.",
    references: ["MERN Fullstack"],
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
    references: ["Network Security Essentials"],
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
    references: ["Computer Vision Algorithms"],
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
    references: ["React Native Docs"],
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
    description: "Tracking sản phẩm nông nghiệp sạch. (Chuyển giao từ SV đề xuất)",
    requirements: "Solidity, Web3.",
    references: ["Mastering Ethereum"],
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
    references: ["Data Mining Techs"],
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
    references: [],
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
    references: ["Recommender Systems Handbook"],
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
    references: ["HRIS Basics"],
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
    status: "in_progress",
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
    status: "in_progress",
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
    studentId: "st2",
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
];

export const mockDefenseRegistrations: DefenseRegistration[] = [
  {
    id: "dr1",
    studentId: "st2",
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

export const mockDefenseCouncils: DefenseCouncil[] = [
  {
    id: "dc1",
    name: "Hội đồng CNTT 1",
    presidentId: "t1",
    secretaryId: "t2",
    memberId: "t3",
    reviewerId: "t4",
    periodId: "per1",
  },
  {
    id: "dc2",
    name: "Hội đồng KHMT 1",
    presidentId: "t5",
    secretaryId: "t4",
    memberId: "t2",
    reviewerId: "t1",
    periodId: "per1",
  },
];

export const mockDefenseSessions: DefenseSession[] = [
  {
    id: "ds1",
    councilId: "dc1",
    registrationId: "reg2",
    date: "2025-12-20",
    time: "08:00",
    room: "Phòng E101",
  },
];


export const mockNotifications: Notification[] = [
  {
    id: "n1",
    userId: "st1",
    title: "Phản hồi đề cương",
    message: "Giáo viên hướng dẫn đã phản hồi đề cương của bạn.",
    type: "info",
    isRead: false,
    createdAt: "2025-09-16T10:30:00",
  },
  {
    id: "n2",
    userId: "st2",
    title: "Lịch bảo vệ khóa luận",
    message: "Lịch bảo vệ: 20/12/2025, 08:00 tại phòng E101",
    type: "success",
    isRead: true,
    createdAt: "2025-12-10T14:00:00",
  },
  {
    id: "n3",
    userId: "t1",
    title: "Sinh viên nộp đề cương",
    message: "Sinh viên Lê Thị Mai đã nộp đề cương.",
    type: "info",
    isRead: false,
    createdAt: "2025-09-18T16:45:00",
  },
  {
    id: "n4",
    userId: "st8",
    title: "Mời tham gia đề tài",
    message: "Bạn nhận được lời mời tham gia đề tài từ GV TS. Phạm Văn Dũng.",
    type: "info",
    isRead: false,
    createdAt: "2025-08-25T09:00:00",
  },
];

export const mockComplaints: Complaint[] = [
  {
    id: "c1",
    studentId: "st3",
    registrationId: "reg3",
    title: "Khiếu nại về giáo viên",
    description: "Giáo viên không trả lời email.",
    status: "reviewing",
    createdAt: "2025-10-15T10:00:00",
  },
];

// --- SEEDED DATA FOR NEW INTERFACES ---

export const mockFormTemplates: FormTemplate[] = [
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

export const mockTopicInvitations: TopicInvitation[] = [
  {
    id: "inv1",
    teacherId: "t4",
    studentId: "st8",
    topicId: "tp9",
    status: "accepted",
    sentAt: "2025-08-25",
    respondedAt: "2025-08-26",
    message: "Em tham gia đề tài này nhé, thầy thấy phù hợp với em.",
  },
  {
    id: "inv2",
    teacherId: "t1",
    studentId: "st6",
    topicId: "tp1",
    status: "pending",
    sentAt: "2025-08-27",
    message: "Mời em tham gia nghiên cứu chatbot.",
  },
];

export const mockProgressReports: ProgressReport[] = [
  {
    id: "pr1",
    registrationId: "reg1",
    title: "Báo cáo tuần 1 tháng 10",
    content: "Đã đọc xong tài liệu về Transformer architecture.",
    planNext: "Bắt đầu code phần tiền xử lý dữ liệu.",
    submittedAt: "2025-10-07",
    status: "approved",
    feedback: "Ok, tiếp tục phát huy.",
  },
  {
    id: "pr2",
    registrationId: "reg6",
    title: "Báo cáo tiến độ Crawl Data",
    content: "Đã crawl được 10,000 records phim từ IMDB.",
    planNext: "Clean data và EDA.",
    submittedAt: "2025-10-08",
    status: "approved",
    fileUrl: "http://example.com/report_crawling.pdf",
  },
];
