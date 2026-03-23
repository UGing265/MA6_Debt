# Hướng dẫn Build và Khởi chạy MA6_Debt với Docker

Toàn bộ hệ thống MA6_Debt đã được cấu hình Docker tự động build theo chuẩn 3-Tier Architecture (Frontend, Backend, Database).

## 1. Cấu trúc các Container tham gia
File `docker-compose.yml` định nghĩa mạng lưới `ma6_network` với 4 thành viên:
- **`ma6_postgres` (Port 5432):** Database PostgreSQL lõi. Bền vững dữ liệu qua docker volume `ma6_pgdata`.
- **`ma6_pgadmin` (Port 5050):** Giao diện quản lý Database nền Web để tiện theo dõi. Thông tin đăng nhập mặc định: `admin@ma6.com / admin`.
- **`ma6_backend` (Port 8080):** API .NET 9.0 siêu nhẹ. Tự động liên kết tới vùng Database bên trên bằng `Host=db` trong ConnectionString.
- **`ma6_frontend` (Port 3000):** Website Next.js (bật chế độ Output Standalone siêu tốc). Sẽ gửi Request vào link `http://localhost:8080`.

## 2. Làm sao để chạy thử Local trong tíc tắc?
Chỉ cần bạn đang đứng ở thư mục gốc (nơi chứa file `docker-compose.yml`), hãy gõ lệnh thần thánh sau:
```bash
docker-compose up -d --build
```
Và bùm 💥 Hệ thống của bạn đã lên mạng:
- App: `http://localhost:3000`
- PGAdmin: `http://localhost:5050`

## 3. Hướng dẫn Đẩy (Push) lên Docker Hub cho Production
Nếu server Production của bạn là con VPS chạy Linux, bạn có thể build Image và ném lên Docker Hub. Ví dụ tài khoản Docker Hub của bạn là `ughing265`.

### Bước 1: Build Backend
```bash
docker build -t ughing265/ma6-backend:latest -f backend/Dockerfile .
docker push ughing265/ma6-backend:latest
```

### Bước 2: Build Frontend
```bash
docker build -t ughing265/ma6-frontend:latest -f frontend/Dockerfile .
docker push ughing265/ma6-frontend:latest
```

### Bước 3: Triển khai ở Server thực
- Chỉ cần copy đúng 1 file `docker-compose.yml` ném lên Server.
- Sửa lại nội dung bên trong block `build: context: ./...` bằng thẻ `image: ughing265/ma6-backend:latest`.
- Gõ lại lệnh `docker-compose up -d`. Server tự động lôi Image từ Docker Hub về khởi chạy!
