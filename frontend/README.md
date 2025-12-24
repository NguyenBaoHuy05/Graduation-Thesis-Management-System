This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

3: Thực hiện & Báo cáo tiến độ (Thesis Implementation & Progress Tracking).

Sau khi đề cương đã được duyệt, sinh viên sẽ bắt tay vào làm việc và cần phải báo cáo lại cho giảng viên định kỳ để đảm bảo không bị "lạc trôi" hoặc trễ hạn.

Dưới đây là các kịch bản (phi mã) cho giai đoạn này:

Giai đoạn 3: Báo cáo tiến độ & Giám sát
Mục tiêu: Đảm bảo sinh viên thực hiện đồ án đúng kế hoạch, giảng viên nắm bắt được khó khăn của sinh viên để hỗ trợ kịp thời.

Kịch bản 1: Sinh viên nộp báo cáo định kỳ (Weekly/Monthly Report)
Actor: Sinh viên.
Điều kiện: Đề tài đang ở trạng thái "Đang thực hiện" (In Progress).
Luồng sự kiện:
Sinh viên vào menu "Tiến độ" (Thesis Progress).
Nhấn "Tạo báo cáo mới".
Nhập các thông tin:
Công việc đã hoàn thành trong giai đoạn vừa qua.
Kết quả đạt được (có thể đính kèm file demo/ảnh/draft doc).
Khó khăn/Vướng mắc đang gặp phải.
Kế hoạch cho giai đoạn tiếp theo.
Nhấn "Gửi báo cáo".
Kết quả: Báo cáo được lưu vào lại lịch sử với trạng thái "Chờ phản hồi".
Kịch bản 2: Giảng viên phản hồi & Đánh giá mức độ hoàn thành
Actor: Giảng viên hướng dẫn.
Điều kiện: Có báo cáo mới từ sinh viên.
Luồng sự kiện:
Giảng viên nhận được thông báo (hoặc thấy dấu đỏ trong menu Quản lý sinh viên).
Xem chi tiết báo cáo của sinh viên.
Giảng viên nhập phản hồi (VD: "Hướng đi đúng, cần khắc phục lỗi X", "Tiến độ quá chậm, cần tăng tốc").
(Tùy chọn) Đánh giá % hoàn thành hoặc Trạng thái (Tốt/Bình thường/Cảnh báo).
Kết quả: Sinh viên nhận được feedback để điều chỉnh công việc.
Kịch bản 3: Upload tài liệu nháp (Draft Submission) & Kiểm tra đạo văn sớm
Actor: Sinh viên.
Mục đích: Để giảng viên xem trước các chương đã viết xong trước khi đóng gói thành khóa luận hoàn chỉnh.
Luồng sự kiện:
Sinh viên upload file word (Chương 1, 2...).
Hệ thống (hoặc giảng viên) chạy kiểm tra sơ bộ (nếu có tích hợp tool).
Giảng viên comment trực tiếp vào file hoặc ghi chú trên hệ thống.
Kịch bản 4: Chốt điều kiện bảo vệ (Final Review)
Actor: Giảng viên hướng dẫn.
Thời điểm: Cuối kỳ, trước khi thành lập hội đồng.
Luồng sự kiện:
Giảng viên xem lại toàn bộ lịch sử báo cáo và sản phẩm cuối cùng.
Quyết định: "Được phép bảo vệ" hoặc "Không đủ điều kiện".
Nhập điểm quá trình (nếu quy chế có tính điểm hướng dẫn).
