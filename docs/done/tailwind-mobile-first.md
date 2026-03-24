# Hướng dẫn Reponsive (Mobile-First) với Tailwind CSS

Đây là bí kíp cốt lõi để tùy chỉnh giao diện thích nghi trên mọi thiết bị (Responsive) dành riêng cho dự án dùng Tailwind CSS. Được đúc kết sau khi xây dựng UX cho MA6_Debt.

## 1. Nguyên lý Cốt lõi: Mobile-First (Trọng tâm Điện thoại)
Quy tắc sống còn: **Code cho Điện thoại trước, sau đó dùng Breakpoint mở rộng cho Máy tính**.

- Các class Tailwind mặc định (VD: `w-full`, `hidden`, `flex`) **luôn được áp dụng cho màn hình nhỏ nhất (Mobile)**.
- Khi cần thay đổi giao diện trên màn hình Máy tính/iPad, hãy dùng tiền tố `md:` (VD: `md:flex`, `md:w-1/2`). Ký hiệu `md:` sẽ tự động ghi đè (override) code của Mobile khi kích thước màn hình vượt ngưỡng 768px.

## 2. Công thức thực chiến (Áp dụng xử lý Layout)

### Bước 1: Ẩn/Hiện thẻ thông minh (VD: Tắt Sidebar cho Mobile)
Làm sao để Sidebar tự biến mất ở Mobile, nhưng hiện lại ở PC?
* **Code:** `className="hidden md:flex"`
* **Giải nghĩa:** `hidden` (Trên Mobile mặc định giấu đi) ➡️ `md:flex` (Khi màn hình to lên kích cỡ PC, báo hiệu hãy bật lại thành layout flex).

### Bước 2: Tạo Bottom Navigation (Chỉ hiện cho Mobile)
Làm sao để ghim Menu trượt dưới đáy trên điện thoại mà máy tính không thấy?
* **Code:** `className="fixed bottom-0 w-full z-50 flex md:hidden"`
* **Giải nghĩa:** 
  - `fixed bottom-0 z-50` (Ghim nổi lên dưới đáy).
  - `flex` (Trên Mobile hiển thị ra).
  - `md:hidden` (Lên PC thiết bị đã có Sidebar, do đó thanh đáy được giấu đi).

### Bước 3: Đánh tráo Component (Nút điều hướng)
Ở header trên cùng, trên Mobile ta hiện Logo (vì không có Sidebar), còn trên PC thì hiện Nút thu gọn Sidebar.
* **Component Logo (Chỉ Mobile):** `<div className="flex md:hidden">`
* **Nút thu gọn Sidebar (Chỉ PC):** `<button className="hidden md:block">`

### Bước 4: Trừ hao không gian cuộn trang (Safe Area Padding)
Khi thanh Bottom Nav ghim cứng đè lên đáy màn hình, danh sách dữ liệu có thể bị che khuất rớt chữ. Ta phải đôn đáy lên.
* **Code:** `<main className="pb-28 md:pb-6">`
* **Giải nghĩa:** Ở Mobile đôn đáy trang lên đoạn dài `pb-28` (khoảng 112px). Ở PC (không có thanh đáy) thì trả khoảng cách lề về bình thường `md:pb-6` (24px).

## 3. Tổng kết vòng lặp thần chú
1. Khung cảnh trên **Mobile** cần gì? ➡️ Thêm thẳng class bình thường.
2. Khung cảnh trên **PC** thay đổi ra sao? ➡️ Thêm `md:[tên class thay đổi]`.

*Ví dụ chốt hạ:* Cần một thẻ màu Đỏ ở điện thoại, màu Xanh chia 3 cột ở máy tính 
➡️ `className="bg-red-500 grid-cols-1 md:bg-blue-500 md:grid-cols-3"`
