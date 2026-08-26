# 🎓 IPA Master - Bảng Phiên Âm Quốc Tế 44 Âm & Bài Tập Luyện Nghe Trắc Nghiệm

Ứng dụng web học tập phiên âm tiếng Anh chuẩn **IPA (International Phonetic Alphabet)** với giao diện hiện đại, tối ưu hiệu năng, hỗ trợ giao diện **Sáng/Tối (Light/Dark Mode)**, trình phát âm thanh dự phòng 2 lớp và hệ thống **phím tắt thông minh**.

---

## ✨ Tính Năng Nổi Bật

### 📋 1. Bảng Tra Cứu 44 Âm IPA (`index.html`)
* **2 Chế độ hiển thị:**
  * **Bảng 6 Cột Chi Tiết:** Hiển thị Ký hiệu IPA, Loại âm, Hướng dẫn khẩu hình chi tiết, Ví dụ từ & phiên âm, và Nút phát âm thanh.
  * **Thẻ Lưới (Grid View):** Giao diện dạng thẻ responsive phù hợp cho màn hình di động.
* **Tìm kiếm & Lọc tức thì:** Tìm kiếm theo ký hiệu âm (`/i:/`, `/p/`), hướng dẫn khẩu hình hoặc từ ví dụ.
* **Giọng đọc máy ví dụ (TTS):** Đọc các từ ví dụ bằng công nghệ Text-to-Speech của trình duyệt với khả năng **tùy chỉnh tốc độ (`0.5x` đến `1.5x`)** và **lựa chọn giọng đọc tiếng Anh** (Tự động lưu cài đặt giọng đọc & tốc độ vào `localStorage`).

### 🧠 2. Hệ Thống Bài Tập Quiz Luyện Tập (`exercise.html`)
* **2 Dạng bài tập chính:**
  1. 🔊 **Nghe Âm ➔ Đoán Ký Hiệu IPA:** Luyện khả năng phản xạ nghe và nhận biết ký hiệu phiên âm.
     * Chế độ **🎯 4 Đáp án** trắc nghiệm nhanh.
     * Chế độ **🧩 Bàn Phím IPA 44 Âm** toàn cảnh.
  2. 👁️ **Nhìn Âm ➔ Đoán Phân Loại:** Nhìn ký hiệu âm vị và đoán phân loại (Nguyên âm ngắn/dài/đôi, Phụ âm vô thanh/hữu thanh).
* **Bộ Lọc Đa Chọn (Điều kiện OR):** Tùy chỉnh danh sách âm cần luyện tập bằng cách tick chọn một hoặc nhiều nhóm âm cùng lúc.
* **Thống kê kết quả:** Theo dõi chuỗi trả lời đúng liên tục (Streak), tính điểm và phần trăm chính xác cuối mỗi lượt luyện tập.

### ⌨️ 3. Hệ Thống Phím Tắt Thông Minh (Keyboard Shortcuts)
* ⌨️ **Phím `1`, `2`, `3`, `4`, `5`:** Chọn nhanh đáp án tương ứng trên màn hình mà không cần rê chuột.
* ⏎ **Phím `Enter` / `➔` (ArrowRight) / `Space`:** Chuyển sang câu tiếp theo khi đã trả lời xong.
* 🔊 **Phím `Space`:** Phát lại âm thanh câu hỏi khi chưa trả lời.

### 🌙 4. Giao Diện Sáng / Tối / Tự Động (Dark & Light Mode)
* Chuyển đổi linh hoạt giữa 3 chế độ: ☀️ **Sáng (Light)**, 🌙 **Tối (Dark)**, và 💻 **Tự động theo hệ thống (System Auto)**.
* Đồng bộ trạng thái tự động qua `localStorage` (`ipa_theme`) giữa tất cả các trang.

---

## 🗂️ Kiến Trúc Dự Án (Modular Structure)

Dự án được tổ chức theo mô hình **Modular (Tách file độc lập)** giúp tối ưu bộ nhớ đệm (Cache) của trình duyệt và dễ dàng bảo trì:

```text
ipa/
├── index.html                 # Trang tra cứu bảng 44 âm IPA
├── exercise.html            # Trang bài tập luyện nghe & trắc nghiệm quiz
├── css/
│   └── style.css            # Stylesheet dùng chung (Animation shake, pulse, custom scrollbar)
├── js/
│   ├── ipa-data.js          # Tập dữ liệu 44 âm IPA (mô tả khẩu hình, từ ví dụ, link audio)
│   ├── theme.js             # Quản lý giao diện Sáng/Tối/Tự động dùng chung
│   ├── audio-player.js      # Trình phát âm thanh MP3 & bộ đọc máy Text-to-Speech dùng chung
│   ├── app-lookup.js        # Logic xử lý giao diện tra cứu (index.html)
│   └── app-exercise.js      # Logic xử lý bài tập & phím tắt (exercise.html)
└── audio/
    └── *.mp3                # Thư mục chứa 44 file âm thanh MP3 chuẩn phát âm
```

---

## 🚀 Hướng Dẫn Sử Dụng

1. **Chạy trực tiếp (Không cần Node.js hay Build Tool):**
   * Tải bộ mã nguồn về máy.
   * Mở trực tiếp file `index.html` hoặc `exercise.html` bằng bất kỳ trình duyệt web hiện đại nào (Google Chrome, Microsoft Edge, Apple Safari, Mozilla Firefox).

2. **Cách luyện tập hiệu quả:**
   * Mở `index.html` để học qua cách đọc khẩu hình và nghe mẫu 44 âm.
   * Chuyển sang `exercise.html`, bật chế độ **🎯 4 Đáp án** và dùng các phím số `1`, `2`, `3`, `4` kết hợp phím `Enter` để luyện nghe phản xạ tốc độ cao.

---

## 📌 Nguồn Dữ Liệu

* Dữ liệu phiên âm, cách đọc khẩu hình và ví dụ được tổng hợp dựa trên tài liệu chuẩn IPA từ [IELTS Fighter IPA Guide](https://ielts-fighter.com/tin-tuc/bang-phien-am-tieng-anh-ipa_mt1567386908.html).
