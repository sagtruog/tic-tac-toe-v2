# 🎮 Tic Tac Toe — Cờ Ca-Rô Hiện Đại

Game Tic Tac Toe (Cờ Ca-Rô) với giao diện hiện đại, hỗ trợ chơi 2 người hoặc đấu với AI.

---

## ✨ Tính năng

- **2 chế độ chơi:**
  - 👥 **2 Người Chơi** — chơi cùng bạn bè trên cùng một thiết bị
  - 🤖 **VS Máy** — đấu với AI (thuật toán Minimax không thể thua)
- **Bảng điểm** — lưu điểm số xuyên suốt các ván đấu
- **Hiệu ứng thắng** — hiển thị đường kẻ qua ô thắng cuộc
- **Modal kết quả** — thông báo kết quả sau mỗi ván
- **Thiết kế đẹp** — giao diện tối (dark mode), font Outfit, hiệu ứng gradient và animation mượt mà

---

## 🗂️ Cấu trúc project

```
tic-tac-toe/
├── index.html   # Giao diện HTML chính
├── style.css    # Toàn bộ CSS (dark theme, animations, responsive)
├── game.js      # Logic game (lượt chơi, kiểm tra thắng, AI Minimax)
└── README.md    # Tài liệu này
```

---

## 🚀 Cách chạy

Project này là **static web** (HTML + CSS + JS thuần), không cần build hay cài thư viện. Chọn một trong các cách sau:

---

### ▶️ Cách 1 — Mở trực tiếp (đơn giản nhất)

Nhấp đúp vào file `index.html` — trình duyệt sẽ tự mở.

> ⚠️ Một số trình duyệt chặn font Google Fonts khi dùng `file://`. Hãy dùng local server bên dưới nếu font không hiển thị đúng.

---

### ▶️ Cách 2 — VS Code Live Server

1. Cài extension **Live Server** trong VS Code
2. Chuột phải vào `index.html` → **"Open with Live Server"**
3. Truy cập: `http://127.0.0.1:5500`

---

### ▶️ Cách 3 — Python HTTP Server

```bash
# Python 3
python -m http.server 8080

# Python 2 (nếu dùng phiên bản cũ)
python -m SimpleHTTPServer 8080
```
Truy cập: `http://localhost:8080`

---

### ▶️ Cách 4 — Node.js (npx serve)

```bash
# Không cần cài trước, npx tự tải về
npx serve .

# Hoặc chỉ định cổng cụ thể
npx serve . -p 3000
```
Truy cập: `http://localhost:3000`

---

### ▶️ Cách 5 — Node.js (http-server)

```bash
# Cài một lần
npm install -g http-server

# Chạy trong thư mục project
http-server . -p 8080 -o
```
Cờ `-o` tự động mở trình duyệt sau khi khởi động.

---

### ▶️ Cách 6 — PowerShell (Windows)

```powershell
# Di chuyển vào thư mục project
cd "C:\Users\Admin\.gemini\antigravity\scratch\tic-tac-toe"

# Mở bằng trình duyệt mặc định
Start-Process index.html

# Hoặc mở bằng Chrome cụ thể
Start-Process "chrome" "index.html"
```

---

## 🎯 Cách chơi

1. Chọn chế độ: **2 Người Chơi** hoặc **VS Máy**
2. Người chơi **X** đi trước
3. Click vào ô trống để đặt ký hiệu
4. Người nào có **3 ký hiệu thẳng hàng** (ngang, dọc, chéo) trước sẽ thắng
5. Nhấn **Chơi Lại** để bắt đầu ván mới, **Reset Điểm** để xóa bảng điểm

---

## 🤖 Về AI

AI sử dụng thuật toán **Minimax** — một thuật toán tìm kiếm toàn bộ cây trạng thái trò chơi để đưa ra nước đi tối ưu nhất. AI ở chế độ này **không thể bị đánh bại**, người chơi giỏi nhất chỉ có thể hòa.

---

## 🛠️ Công nghệ sử dụng

| Công nghệ | Mục đích |
|---|---|
| HTML5 | Cấu trúc giao diện |
| CSS3 | Thiết kế, animation, responsive |
| Vanilla JavaScript | Logic game, AI |
| Google Fonts (Outfit) | Typography |

---

## 📸 Giao diện

- **Dark theme** với nền gradient tím-xanh
- **Glassmorphism** cho các card và bảng điểm
- **Animated orbs** làm nền động
- **SVG win line** vẽ đường thắng trực tiếp trên bàn cờ

---
