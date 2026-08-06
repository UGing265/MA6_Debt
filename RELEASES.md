# Release Notes v1.1.0
**Released**: August 7, 2026

Phiên bản này tập trung vào trải nghiệm dùng hằng ngày: dashboard rõ hơn, mobile dễ bấm hơn, form đẹp hơn, hỗ trợ VI/EN, và bảo mật đăng nhập ổn hơn.

---

## What's New

### Hỗ trợ tiếng Việt và tiếng Anh
Ứng dụng đã có luồng giao diện song ngữ cho các màn hình chính như đăng nhập, đăng ký, landing page, dashboard, ví, đối tác nợ, chuyển tiền, ghi nhận giao dịch và lịch sử giao dịch. Dự án giờ dùng được cho cả người Việt và người nước ngoài tốt hơn.

### Che số tiền khi cần riêng tư
Bạn có thể bật chế độ che số tiền trong cài đặt. Dashboard cũng có nút giữ để tạm hiện số tiền, giúp xem nhanh khi cần mà vẫn tránh lộ thông tin tài chính khi dùng nơi công cộng.

### Dashboard phân tích chi tiêu theo ngày
Dashboard được bổ sung phần phân tích chi tiêu hằng ngày, có biểu đồ để xem mức đã dùng trong ngày và theo dõi xu hướng rõ hơn. Mục tiêu chi tiêu trong ngày cũng được hỗ trợ để người dùng biết còn nên tiêu bao nhiêu.

### Mobile navigation mới
Bottom navigation trên mobile được sửa lại để đưa nhiều chức năng quan trọng ra gần tay hơn: dashboard, ví, quick deduct, đối tác, lịch sử, chuyển tiền, trợ giúp và profile.

### Show/hide password ở form đăng nhập
Form đăng nhập có nút hiện/ẩn mật khẩu, giúp kiểm tra lại mật khẩu trước khi đăng nhập mà không phải nhập lại từ đầu.

### Logo và avatar ứng dụng mới
Logo MA6 và icon trình duyệt được cập nhật để nhận diện ứng dụng rõ hơn.

---

## Improvements

- Trang trí lại nhiều form trong auth, ví, đối tác nợ, trả nợ, quick deduct, chuyển tiền và lịch sử để giao diện đồng bộ hơn.
- Cải thiện bộ chọn ví và đối tác trong Quick Deduct với tìm kiếm, trạng thái chọn rõ hơn và nhập số tiền dễ nhìn hơn.
- Cải thiện lịch sử giao dịch: filter, danh sách, dòng giao dịch và dialog chi tiết dễ scan hơn trên desktop lẫn mobile.
- Xóa các giả định set cứng trong luồng partner để form và giao dịch dùng đúng lựa chọn/default hiện tại.
- Cập nhật tài liệu design system frontend/backend để các lần code tiếp theo giữ cùng chuẩn giao diện và kiến trúc.

---

## Security

- Chuyển luồng xác thực sang cookie-based session thay vì lưu auth state trong browser storage.
- Thêm cơ chế refresh session để request API tự gia hạn access token khi refresh session còn hợp lệ.
- Cấu hình refresh session hết hạn sau 7 ngày.
- Khi dashboard phát hiện session hết hạn thật, người dùng được tự động đưa về trang login thay vì phải bấm nút hoặc gọi API mới bị đá ra.

---

## Full Changelog

Xem chi tiết kỹ thuật tại [CHANGELOG.md](CHANGELOG.md).

---

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
