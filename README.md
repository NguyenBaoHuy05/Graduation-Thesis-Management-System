# Graduation Thesis Management System (Hệ thống Quản lý Khóa luận Tốt nghiệp)

Một hệ thống quản trị quy trình thực hiện khóa luận tốt nghiệp, hỗ trợ tương tác giữa Sinh viên, Giảng viên hướng dẫn, Trợ lý khoa và Trưởng khoa.

## 🚀 Tính năng chính

### 👨‍🎓 Dành cho Sinh viên
- **Đăng ký đề tài**: Xem danh sách đề tài và đăng ký thực hiện.
- **Nộp đề cương**: Tải lên đề cương nghiên cứu (định dạng PDF) với tính năng kiểm tra ghi đè.
- **Báo cáo tiến độ**: Nộp báo cáo định kỳ (hàng tuần/tháng), theo dõi lịch sử và phản hồi từ giảng viên.
- **Nộp khóa luận**: Tải lên bản thảo và bản chính thức của khóa luận.

### 👨‍🏫 Dành cho Giảng viên hướng dẫn
- **Quản lý hướng dẫn**: Theo dõi danh sách sinh viên đang hướng dẫn.
- **Phản hồi tiến độ**: Đánh giá báo cáo tiến độ và mức độ hoàn thành của sinh viên.
- **Chốt điều kiện bảo vệ**: Xác nhận sinh viên đủ điều kiện bảo vệ khóa luận.

### 👩‍💼 Dành cho Trợ lý Khoa
- **Quản lý người dùng**: CRUD dữ liệu Sinh viên và Giảng viên.
- **Quản lý biểu mẫu**: Đăng tải và cập nhật các mẫu văn bản, tài liệu hướng dẫn.
- **Quản lý thông báo**: Đăng thông báo công khai (trên trang chủ) và thông báo nội bộ.

### 👨‍💼 Dành cho Trưởng Khoa
- **Phê duyệt đề tài**: Xem xét và phê duyệt/từ chối các đề tài đăng ký mới.
- **Quản lý danh sách đề tài**: Tổng hợp và quản lý toàn bộ các đề tài trong khoa.

## 🛠 Công nghệ sử dụng

- **Frontend**: [Next.js 15+](https://nextjs.org/), [React](https://reactjs.org/), [Tailwind CSS](https://tailwindcss.com/)
- **Backend**: [NestJS](https://nestjs.com/) (Node.js framework)
- **Database**: [PostgreSQL](https://www.postgresql.org/) với [Prisma ORM](https://www.prisma.io/)
- **Ngôn ngữ**: TypeScript

## 📂 Cấu trúc dự án

```text
Graduation-Thesis-Management-System/
├── backend/            # NestJS API source code
├── frontend/           # Next.js web application
├── Flow.md             # Tài liệu hướng dẫn sử dụng & Test cases
└── README.md           # Hướng dẫn chung
```

## ⚙️ Cài đặt & Khởi chạy

### 1. Yêu cầu hệ thống
- Node.js (v18 trở lên)
- PostgreSQL

### 2. Cài đặt Backend
```bash
cd backend
npm install
# Tạo file .env và cấu hình DATABASE_URL
npx prisma generate
npx prisma db push
npm run start:dev
```

### 3. Cài đặt Frontend
```bash
cd frontend
npm install
# Tạo file .env và cấu hình NEXT_PUBLIC_API_URL
npm run dev
```

## 📝 Tài khoản thử nghiệm (Mock Data)

| Vai trò | Tài khoản | Mật khẩu |
| :--- | :--- | :--- |
| Sinh viên | `SV005` | `123` |
| Trợ lý Khoa | `SC001` | `123` |
| Trưởng Khoa | `HD001` | `123` |

Chi tiết các kịch bản kiểm thử có thể xem tại [Flow.md](./Flow.md).

## 📄 Giấy phép

Dự án này được phát hành dưới giấy phép [MIT](LICENSE).