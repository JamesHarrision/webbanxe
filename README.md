# 🚗 Dự Án Web Bán Xe (Car Dealership Platform)

Một hệ thống nền tảng web full-stack dành cho cửa hàng bán xe ô tô/xe máy, cung cấp giải pháp toàn diện để giới thiệu sản phẩm (xe, phụ kiện, bảo hiểm), cập nhật tin tức và quản lý khách hàng tiềm năng (leads). Dự án bao gồm giao diện người dùng (Public) và trang quản trị (Admin Dashboard).

## ✨ Chức năng nổi bật

### Giao diện Khách hàng (Client/Public)
- **Khám phá sản phẩm**: Xem danh sách các dòng xe, phụ kiện và gói bảo hiểm với thông tin chi tiết.
- **Tin tức & Khuyến mãi**: Cập nhật các bài viết tin tức, đánh giá xe.
- **Tương tác khách hàng**: Gửi yêu cầu tư vấn (Lead), tính toán trả góp, và các nút liên hệ nổi (Floating Contact Buttons).
- **Trải nghiệm người dùng**: Tối ưu chuẩn SEO (với SSR/SSG từ Next.js), giao diện phản hồi (Responsive) mượt mà.

### Giao diện Quản trị (Admin Dashboard)
- **Quản lý danh mục**: Thêm/Sửa/Xóa (CRUD) xe, phụ kiện, gói bảo hiểm, slider trang chủ (Hero Slides), bài viết (Posts), và đánh giá từ khách hàng (Testimonials).
- **Quản lý Khách hàng**: Theo dõi và xử lý các yêu cầu tư vấn (Leads) từ người dùng.
- **Cài đặt hệ thống**: Thay đổi cấu hình website, logo, thông tin liên hệ một cách dễ dàng.
- **Tích hợp Cloud**: Quản lý ảnh sản phẩm/bài viết trực tiếp thông qua Cloudinary.

## 🛠 Công nghệ sử dụng

### Frontend (`/client`)
- **Framework**: Next.js (App Router)
- **Ngôn ngữ**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: Ant Design (Antd)
- **Quản lý State & Data Fetching**: React Query, Context API / Zustand
- **Form & Validation**: Tuỳ chỉnh kết hợp với các thư viện hỗ trợ.

### Backend (`/server`)
- **Môi trường**: Node.js & Express.js
- **Ngôn ngữ**: TypeScript
- **Cơ sở dữ liệu & ORM**: Prisma ORM (tương thích MySQL / PostgreSQL)
- **Lưu trữ Media**: Cloudinary
- **Email/Thông báo**: Nodemailer
- **Authentication**: JWT (JSON Web Tokens)

### DevOps & Triển khai
- Docker & Docker Compose

## 📂 Cấu trúc thư mục

```text
webbanxe/
├── client/                 # Mã nguồn Frontend (Next.js)
│   ├── app/                # Next.js App Router (Public & Admin pages)
│   ├── components/         # Các UI component dùng chung
│   ├── services/           # Gọi API thông qua Axios
│   ├── store/              # Quản lý global state
│   ├── theme/              # Cấu hình giao diện (Tailwind, Antd)
│   └── ...
├── server/                 # Mã nguồn Backend (Node.js)
│   ├── prisma/             # Cấu hình CSDL và Schema
│   ├── src/
│   │   ├── controllers/    # Xử lý logic API
│   │   ├── middlewares/    # Middleware xác thực, upload, validate
│   │   ├── routes/         # Định nghĩa endpoints
│   │   ├── services/       # Xử lý business logic thao tác DB
│   │   └── utils/          # Các hàm hỗ trợ (Cloudinary, Mailer)
│   ├── Dockerfile          # Cấu hình Docker cho backend
│   └── ...
└── docker-compose.yml      # Cấu hình triển khai toàn bộ hệ thống bằng Docker
