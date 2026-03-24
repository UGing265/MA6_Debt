# Release Notes v1.0.0
**Released**: March 24, 2026

Chào mừng đến với phiên bản chính thức đầu tiên của MA6 Debt! 🎉 Phiên bản này đánh dấu một cột mốc quan trọng khi toàn bộ ứng dụng đã được tối ưu hóa giao diện di động (Mobile-Responsive) và sẵn sàng để triển khai (Deploy) diện rộng thông qua nền tảng Docker kết hợp Cloudflare Tunnels.

---

## 🎉 Thay đổi Nổi Bật (What's New)

### Giao Diện Thân Thiện Với Thiết Bị Di Động (Mobile-First)
Toàn bộ giao diện người dùng (UI), đặc biệt là các phần Dashboard, Lịch sử Giao dịch và Form điều chỉnh ví đều đã được thiết kế lại để hiển thị cực kỳ mượt mà trên màn hình điện thoại. Bây giờ bạn có thể quản lý nợ ứng dụng ngay trên SmartPhone dễ dàng hơn bao giờ hết.

### Triển Khai Dễ Dàng Với Docker & Cloudflare Tunnel
Cung cấp một giải pháp hạ tầng "bấm là chạy":
- Đóng gói toàn bộ Frontend, Backend, và Database (PostgreSQL/pgAdmin) vào hệ sinh thái **Docker Container**.
- Tích hợp sẵn **Cloudflare Tunnel**, cho phép phơi bày (expose) ứng dụng ra ngoài Internet một cách an toàn mà không cần mở Port trên Router hay VPS.
- Quản lý các biến môi trường nhạy cảm an toàn hơn qua `.env` bảo mật.

### Hệ Thống Hướng Dẫn Kèm Theo (User Guide & Docs)
Không chỉ ra mắt tính năng, chúng tôi thêm luôn trang **Sổ tay Hướng dẫn (User Guide)** đi kèm Navigation Link rõ ràng trên Menu để người dùng mới dễ dàng tiếp cận sản phẩm.

---

## ✨ Cải Tiến Trải Nghiệm & Giao Diện (Improvements)

- **Trang Dashboard Đồng Nhất**: Áp dụng chuẩn `PageHeader` mới và tinh chỉnh mọi khoảng cách hiển thị để layout luôn gọn gàng.
- **Accordion và Component Shadcn UI**: Giúp trải nghiệm xem chi tiết nợ, ví và lịch sử được trơn tru hơn (giảm không gian thừa).
- **Wallet & Hybrid Tabs**: Sửa đổi cơ chế điều hướng khi chuyển tab nhập số dư ví lai (Hybrid Balance) linh hoạt và chặt chẽ hơn.

---

## 📝 Nhật Ký Chi Tiết (Full Changelog)

Để xem toàn bộ quá trình cập nhật kỹ thuật cho developer và các phiên bản Alpha/Beta cũ (từ `v0.1.0` đến `v0.9.0`), vui lòng kiểm tra trực tiếp tại [CHANGELOG.md](CHANGELOG.md).

---

**Hướng Dẫn Cài Đặt (Deployment Guide)**: Tham khảo tệp [docs/done/deploy-docker.md](docs/done/deploy-docker.md) để bắt đầu.
