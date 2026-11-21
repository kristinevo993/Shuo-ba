# DỰ ÁN: APP HỌC TIẾNG TRUNG GIAO TIẾP THỰC CHIẾN (OFFLINE-FIRST)

> Tài liệu đặc tả sản phẩm (Product Spec & UI/UX Blueprint) dùng để bàn giao cho Claude thiết kế và lập trình ứng dụng.

---

## 1. Mục tiêu & Chân dung Người dùng
* **Trình độ hiện tại:** Đã học sơ cấp 1 và Duolingo Level 12, nhớ câu cơ bản nhưng phản xạ nói thực tế còn chậm.
* **Bối cảnh sử dụng:** Sống tại Hồng Kông, thường xuyên đi Trung Quốc Đại Lục để du lịch, kết bạn và đi đánh hàng (chuyên sâu về **đá tự nhiên, đá phong thủy và vật phẩm phong thủy**).
* **Phương ngữ duy nhất:** Tiếng Phổ thông Trung Quốc Đại Lục (`zh-CN`). Không cần chia giọng Đài Loan/Hồng Kông.
* **Trọng tâm kỹ năng:** 100% **Nghe – Nói phản xạ & Ghép cụm từ**. Không học viết, không nặng ngữ pháp. Chữ Hán chỉ hiển thị phụ (cỡ nhỏ, màu nhạt) để mắt chụp ảnh thụ động.
* **Cách tiếp thu nhanh nhất:** Nghe âm thanh gắn với hình ảnh ngữ cảnh -> Tách câu ngắn -> Ghép thành câu dài -> Lặp lại thụ động khi di chuyển.

---

## 2. Cấu trúc Học 3 Level (Phương pháp Xếp khối Lego)
Mỗi tình huống trong bài học được thiết kế gồm 2 mảnh câu ngắn (Level 1) và 1 câu ghép hoàn chỉnh (Level 2). Trong App có nút chuyển nhanh giữa các chế độ:

* **Level 1 — Chế độ Tách câu (Short & Survival):** Học các mảnh câu ngắn gọn (3–7 chữ), lược bỏ chủ ngữ rườm rà đúng kiểu người bản xứ nói ngoài đời (Mảnh `1A` và `1B`).
* **Level 2 — Chế độ Ghép câu (Full & Natural):** Nối các mảnh của Level 1 thành câu dài hoàn chỉnh, thêm ngữ cảnh và sắc thái lịch sự.
* **Level 3 — Chế độ Mix tổng hợp (Real-life Shuffle):** Trộn ngẫu nhiên các câu từ tất cả các chủ đề đã học để ép não chuyển đổi ngữ cảnh liên tục.

---

## 3. Tính năng Cốt lõi (Core Features)

### A. Vòng lặp Học chủ động 4 bước (Cho mỗi câu)
1. **Bước 1: Nghe & Bóc tách cụm (Visual & Audio Anchor)**
   * Hiển thị **Hình ảnh minh họa ngữ cảnh** + **Câu tiếng Việt**.
   * Nghe âm thanh tốc độ chuẩn (`1.0x`) và chậm (`0.75x`, xử lý bằng `audio.playbackRate = 0.75` để không tốn thêm dung lượng file).
   * Nút Toggle ẩn/hiện nhanh: `[Chỉ nghe]` | `[Hiện Pinyin]` | `[Hiện cả Hán tự]`.
2. **Bước 2: Nhại bóng & So sánh giọng (Shadowing)**
   * Nút **Ghi âm (Mic)** để người dùng nhại lại câu mẫu.
   * Sau khi thả tay, app tự phát nối tiếp: `[Giọng bản xứ] -> [Giọng người dùng]` để tai tự đối chiếu ngữ điệu.
   * **Lưu ý kỹ thuật:** Lưu bản ghi âm tạm thời trên **RAM (In-memory)**, tự động xóa khi chuyển câu/đóng app -> **0 MB dung lượng lưu trữ**. Không dùng AI chấm điểm phát âm.
3. **Bước 3: Ghép cụm phản xạ (Chunk Builder)**
   * Xáo trộn các mảnh ghép Pinyin (đã được đánh dấu sẵn `[1]`, `[2]`...) để người dùng chạm sắp xếp lại đúng thứ tự câu.
4. **Bước 4: Khoảng lặng gợi nhớ & Lặp lại ngắt quãng (SRS)**
   * Chế độ Ôn tập: Chỉ hiện **Ảnh + Tiếng Việt**, chờ 3 giây im lặng cho người dùng tự nói ra miệng rồi mới bấm kiểm tra.
   * 3 nút tự đánh giá: **Quên sạch** (lặp lại sau 5 phút) | **Hơi vấp** (nhắc lại ngày mai) | **Nói mượt** (4 ngày sau ôn lại).

### B. Chế độ Đi tàu / Nghe thụ động (Hands-Free Commute Mode)
Tối ưu cho 30 phút đi tàu điện/đi bộ mỗi ngày (bỏ điện thoại vào túi, đeo tai nghe):
* **Chu trình phát tự động (Audio Loop) cho từng câu:**
  1. Phát câu **Tiếng Việt**.
  2. **Khoảng lặng gợi nhớ** (tùy chỉnh `3s` / `5s` / `7s`, kèm tiếng *tích* nhẹ) để người dùng tự nhẩm trong đầu.
  3. Phát **Tiếng Trung lần 1** (tốc độ chuẩn `1.0x`).
  4. Nghỉ `1.5s` để nhại lại.
  5. Phát **Tiếng Trung lần 2** (`1.0x` hoặc `0.75x`) rồi tự chuyển câu.
* **Playlist:** Nghe theo chủ đề đã chọn | Nghe toàn bộ (Shuffle) | Smart Mix (chỉ phát các câu đánh dấu "Quên sạch" / "Hơi vấp").
* **Điều khiển nâng cao:** Hẹn giờ tắt (`15 phút` / `30 phút`). Tích hợp **Media Session API** để phát nền khi khóa màn hình và điều khiển Play/Pause/Next bằng tai nghe Bluetooth.

---

## 4. Yêu cầu Thiết kế UI/UX & Bảng màu Pastel (Bắt buộc)
* **Phong cách:** Tối giản (Minimalist, giống Notion), dịu mắt, tối ưu thao tác 1 tay trên điện thoại (Mobile-first).
* **Màu nền tổng thể:** Trắng kem ấm (`#FAF9F6`), thẻ học màu trắng (`#FFFFFF`) có viền mảnh (`#EBEAE4`).
* **Màu chữ chính:** Xám than đậm (`#2D3136`) — **tuyệt đối KHÔNG dùng chữ màu neon hay màu sặc sỡ**.
* **Cơ chế tô màu theo ý nghĩa (Color-Coded Chunks):**
  * Không tô màu trực tiếp lên chữ mà dùng **nền highlight màu Pastel bo tròn** (border-radius `6px`, padding nhẹ) cho các cụm từ mang cùng mã số `[1]..[6]` ở cả 3 dòng: Tiếng Việt – Pinyin – Chữ Hán.
  * Phần Pinyin giữ nguyên dấu thanh điệu chuẩn (`ā, á, ǎ, à`), không cần tô màu thanh điệu để tránh rối mắt.
  * **Bảng 6 màu Pastel chuẩn (xoay vòng theo số `[1]` đến `[6]`):**
    1. `[1]` Vàng bơ nhạt (Butter): `#FDF2D0`
    2. `[2]` Xanh lá xô thơm (Sage): `#E3F1E5`
    3. `[3]` Xanh dương khói (Dusty Blue): `#E3EEF8`
    4. `[4]` Cam đào nhạt (Soft Peach): `#FBE8DF`
    5. `[5]` Tím oải hương (Lavender): `#EFE8F8`
    6. `[6]` Hồng phấn nhạt (Muted Rose): `#F9E4EA`
  * **Tương tác chạm:** Khi chạm vào 1 cụm bất kỳ, cả 3 cụm cùng mã số (Việt – Pinyin – Hán) cùng sáng nhẹ viền để đối chiếu nghĩa tức thì.

---

## 5. Kiến trúc Kỹ thuật & Ước tính Dung lượng Offline
* **Nền tảng:** **PWA (Progressive Web App)** viết bằng React + Tailwind CSS (hoặc HTML/JS thuần), cài trực tiếp lên màn hình chính iPhone/Android (Add to Home Screen), chạy **100% Offline** nhờ `Service Worker`.
* **Lưu tiến độ:** Sử dụng `localStorage` của trình duyệt (không cần Backend/Database).
* **Quy trình tạo Âm thanh (Audio Pipeline):**
  * Dùng script Python đọc file `lessons.json` để xuất hàng loạt file `.mp3` (64kbps Mono).
  * Giọng Tiếng Trung: Dùng **Edge-TTS** miễn phí (giọng nữ `zh-CN-XiaoxiaoNeural` hoặc giọng nam `zh-CN-YunxiNeural`).
  * Giọng Tiếng Việt (cho Chế độ Đi tàu): Dùng **Vbee API** sẵn có của người dùng (hoặc Edge-TTS `vi-VN-HoaiMyNeural`).
* **Hình ảnh minh họa:** Định dạng `.webp` nén nhẹ (~80 KB/ảnh). Không dùng file video `.mp4`.
* **Tổng dung lượng dự kiến (51 chủ đề ~ 450-500 tình huống):** ~**55 MB – 80 MB** (rất nhẹ, chạy mượt trên bộ nhớ đệm điện thoại).

---

## 6. Tổng quan Lộ trình Nội dung (51 Chủ đề)

### Phần 1: Sinh hoạt & Di chuyển tự tin (Chủ đề 0 – 12)
* **0. Sinh tồn & Hỏi lại khi không hiểu (Dùng Body language & App dịch)** *(Bổ sung ưu tiên)*
* 1. Thanh toán WeChat Pay / Alipay
* 2. Đi Taxi / Didi
* 3. Đi Tàu điện ngầm & Tàu cao tốc
* 4. Nhận & Trả phòng khách sạn
* 5. Gọi món ở quán ăn địa phương
* 6. Gọi trà sữa & Cà phê
* 7. Mua sắm hàng ngày & Siêu thị
* 8. Nhận hàng giao tận nơi (Meituan / Taobao)
* 9. Hỏi đường & Tìm địa điểm
* 10. Xử lý sự cố nhỏ (nhầm món, mượn sạc...)
* 11. Đi spa, massage & làm đẹp
* 12. Tại sân bay & Cửa khẩu

### Phần 2: Kết bạn & Trò chuyện tự nhiên (Chủ đề 13 – 25)
* 13. Mở lời & Xin WeChat
* 14. Giới thiệu bản thân & Công việc
* 15. Khen ngợi tinh tế
* 16. Hỏi về ẩm thực & Đặc sản vùng miền
* 17. Nói về sở thích cá nhân
* 18. Rủ đi ăn / đi cà phê
* 19. Trên bàn ăn (Mời trà/rượu, văn hóa tranh trả tiền)
* 20. Chia sẻ về chuyến đi
* 21. Nói về thời tiết & Nhịp sống
* 22. Hỏi thăm & Giữ liên lạc trên WeChat / Moments
* 23. Nhờ vả & Cảm ơn chân thành
* 24. Từ chối khéo léo
* 25. Chào tạm biệt & Hẹn gặp lại

### Phần 3: Đánh hàng, Thương lượng & Tiền bạc (Chủ đề 26 – 38)
* 26. Vào sạp & Hỏi giá sỉ (拿货价)
* 27. Hỏi số lượng tối thiểu (MOQ / 起批量) & Trộn mẫu
* 28. Kỹ thuật trả giá (砍价)
* 29. Kiểm tra hàng & Phát hiện lỗi
* 30. Hỏi về tồn kho & Thời gian ra hàng
* 31. Chụp ảnh & Quay video mẫu
* 32. Xin danh thiếp & Kết bạn WeChat chủ sạp
* 33. Chốt đơn & Đặt cọc (定金)
* 34. Thanh toán & Chuyển khoản
* 35. Đóng gói & Vận chuyển ra kho ký gửi (物流/快递)
* 36. Theo dõi đơn hàng & Giục hàng (快递单号)
* 37. Xử lý khiếu nại sau mua (售后)
* 38. Xây dựng quan hệ khách ruột (老客户)

### Phần 4: Chuyên sâu Đá tự nhiên & Vật phẩm Phong thủy (Chủ đề 39 – 50)
* 39. Tên các loại đá phổ biến (Thạch anh, Phỉ thúy, Mắt hổ, Mã não...)
* 40. Kiểm tra độ tự nhiên (Thiên nhiên 100% vs. Nhuộm màu / Bơm keo / Xử lý nhiệt)
* 41. Đánh giá chất lượng & Nước đá (Độ trong, bông tuyết, vết nứt ngầm, tạp chất)
* 42. Kích thước hạt (mm) & Kiểu cắt (hạt tròn, hạt giác, mặt dây chuyền)
* 43. Chọn dây sỉ (半成品 / 散珠) & Mua theo gram/ký
* 44. Phụ kiện mix vòng (Charm bạc 925, mạ vàng, dây cước, hộp đựng)
* 45. Giấy kiểm định (鉴定证书)
* 46. Vật phẩm phong thủy trưng bày (Tỳ Hưu, Hồ Ly, Quả cầu, Trụ đá...)
* 47. Trao đổi về Ngũ hành & Ý nghĩa màu sắc
* 48. Đặt gia công theo yêu cầu (定制)
* 49. Mua hàng qua Livestream / Video Call (Soi đèn pin 打灯)
* 50. Săn hàng độc & Hàng hiếm (孤品 / 精品)