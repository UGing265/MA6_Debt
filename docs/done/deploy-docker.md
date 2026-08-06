# Hướng dẫn Build và Khởi chạy MA6_Debt với Docker

Toàn bộ hệ thống MA6_Debt đã được cấu hình Docker tự động build theo chuẩn 3-Tier Architecture (Frontend, Backend, Database). Hệ thống đã được nâng cấp với các tính năng **Hardening** và **Flexibility** để vận hành ổn định trên mọi môi trường.

---

## 🟢 1. Cấu trúc các Container tham gia
File `docker-compose.yml` định nghĩa mạng lưới `ma6_network` với các thành phần chính:
- **`ma6_db` (Postgres 16):** Database lõi. Dữ liệu được bảo vệ qua docker volume `ma6_pgdata`.
- **`ma6_pgadmin`:** Giao diện quản lý Database nền Web.
- **`ma6_backend` (.NET 9.0):** API siêu nhẹ, kết nối tới DB qua hostname nội bộ `db`.
- **`ma6_frontend` (Next.js):** Website bật chế độ Standalone để tối ưu dung lượng và tốc độ.
- **`ma6_tunnel` (Cloudflare):** Cổng kết nối an toàn cho Raspberry Pi / Self-host.

---

## 🟢 2. Lý thuyết vận hành & Cải tiến mới (NEW)
Hệ thống hiện tại được xây dựng dựa trên các tiêu chí DevOps chuyên nghiệp:

### A. Port Mapping: IN vs OUT
- **Port IN (Container side)**: Cố định là `8080` (Backend) và `3000` (Frontend) theo chuẩn Kestrel & Node.js.
- **Port OUT (Host side)**: Linh động thông qua biến `${BACKEND_PORT}` và `${FRONTEND_PORT}`.
- **Lợi ích**: Bạn có thể đổi port truy cập từ bên ngoài mà không bao giờ làm "bể" kết nối nội bộ của ứng dụng.

### B. Healthchecks (Tính bền bỉ)
Hệ thống sử dụng cơ chế kiểm tra trạng thái dịch vụ. `backend` sẽ chỉ khởi động khi `db` đã ở trạng thái `healthy` (đã sẵn sàng nhận kết nối). Điều này loại bỏ lỗi crash lặt vặt khi khởi động toàn bộ stack cùng lúc.

### C. Resource & Security Hardening
- **Giới hạn tài nguyên**: Mỗi dịch vụ được giới hạn RAM (qua biến `MEM_LIMIT_...`) để tránh treo máy chủ.
- **Log Rotation**: Giới hạn file log tối đa 10MB và chỉ giữ 3 bản gần nhất để bảo vệ dung lượng ổ cứng.
- **Localhost Binding**: Cổng DB và PGAdmin đã được "khóa" lại (`127.0.0.1`), chỉ có thể truy cập từ server hoặc qua Proxy/Tunnel để đảm bảo an toàn.

---

## 🟢 3. Làm sao để chạy thử Local trong tíc tắc?
Chỉ cần bạn đang đứng ở thư mục gốc (nơi chứa file `docker-compose.yml`), hãy gõ:
```bash
docker compose up -d --build
```
Và bùm 💥 Hệ thống của bạn đã lên mạng:
- App: `http://localhost:${FRONTEND_PORT}`
- API: `http://localhost:${BACKEND_PORT}`

---

## 🟢 4. Cấu hình linh hoạt qua `.env` (Variable Sync)
File `.env` hiện tại hỗ trợ tính năng **Tự động đồng bộ**:
```bash
BACKEND_PORT=7297
# Biến dưới sẽ tự lấy giá trị từ BACKEND_PORT:
NEXT_PUBLIC_API_URL=http://localhost:${BACKEND_PORT}
```
> [!IMPORTANT]
> **Lưu ý quan trọng**: Biến `NEXT_PUBLIC_` được "nướng" vào code lúc Build. Nếu bạn đổi URL trong `.env`, bạn **BẮT BUỘC** phải chạy `docker compose build frontend` để cập nhật code client-side.

---

## 🟢 5. Hướng dẫn Đẩy (Push) lên Docker Hub cho Production
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
- Chỉ cần copy file `docker-compose.yml` và `.env` lên Server.
- Sửa lại `build: context: ./...` bằng `image: ughing265/ma6-backend:latest`.
- Gõ lệnh `docker compose up -d`.

---

## 🟢 6. Tích hợp Cloudflare Tunnel (Cho Raspberry Pi / Self-Host)
1. Lên trang [Cloudflare Zero Trust](https://one.dash.cloudflare.com/) tạo một Tunnel mới.
2. Trỏ Public Hostname về container nội bộ Docker là `http://ma6_frontend:3000`.
3. Gán Token vào file `.env`:
```env
CLOUDFLARE_TUNNEL_TOKEN=ey...chuoi_token_cua_ban...
```
4. Chạy `docker compose up -d`. Xong!
