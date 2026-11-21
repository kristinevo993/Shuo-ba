# Nói đại đi – Shuō Ba (说吧)

App học tiếng Trung giao tiếp (Phổ thông Đại Lục, zh-CN) cho người Việt sống ở Hong Kong. Trọng tâm là nghe – nói phản xạ và ghép cụm, không học viết. Chủ app tự học vibe code và không có nền tảng lập trình.

## Cách làm việc với mình
- Luôn trả lời bằng tiếng Việt. Giải thích đơn giản; nếu phải dùng thuật ngữ thì kèm một câu giải thích ngắn.
- Làm từng bước nhỏ, bước nào cũng có kết quả nhìn thấy được. Trước mỗi bước, tóm tắt 3–5 dòng sẽ làm gì rồi làm luôn, trừ khi có lựa chọn quan trọng cần mình quyết.
- Chọn cách đơn giản nhất chạy được. Không thêm framework (React, build tool…) nếu không thật sự cần: app hiện là HTML + JS thuần và cứ giữ như vậy.
- Khi có lỗi: nói nguyên nhân bằng lời thường, rồi sửa.
- Mình dùng MacBook (đã có Python 3.9.6, Git 2.39.5, tài khoản GitHub) và điện thoại Hong Kong.
- Cuối mỗi buổi: tóm tắt đã làm gì, file nằm ở đâu, việc tiếp theo, câu hỏi còn mở, và cập nhật mục "Nhật ký" ở cuối file này.

## Các file trong thư mục
- `index.html`: app bản mẫu đã chạy tốt (làm trong claude.ai). Toàn bộ dữ liệu bài học đang nằm luôn trong file này (biến `DATA`).
- `lessons.json`: dữ liệu bài học riêng (Chủ đề 0–2, 24 tình huống, 72 câu).
- Tài liệu thiết kế gốc và file nội dung bài học (file .md của mình): đọc khi cần chi tiết.

## App hiện có gì
- 3 tab dưới cùng: 📚 Học | 🎧 Nghe | 📊 Tiến độ.
- Học: danh sách chủ đề, chuyển Tách câu (mảnh 1A, 1B) / Ghép câu (mức 2), vòng học 4 bước (① Nghe 1.0x/0.75x + ẩn/hiện Pinyin, Hán tự → ② Nhại: giữ mic ghi âm rồi phát giọng mẫu → giọng mình → ③ Ghép mảnh Pinyin → ④ Nhớ: đếm 3 giây rồi tự chấm), Ôn tập, Level 3 Mix tổng hợp (20 câu ngẫu nhiên, mở ở bước ④, có màn tổng kết), khung nhắc nhở trên trang chủ.
- Nghe (nghe thụ động khi đi tàu, đi bus): tiếng Việt → khoảng lặng 3/5/7 giây có tiếng tích → tiếng Trung lần 1 (1.0x) → nghỉ 1,5 giây → lần 2 (1.0x hoặc 0.75x). Nguồn câu: tất cả / Smart Mix / từng chủ đề. Hẹn giờ tắt 15/30 phút. Có Media Session (điều khiển bằng tai nghe).
- Tiến độ: vòng mục tiêu hôm nay, biểu đồ cột 14 ngày (học #5B8FC9, nghe #E39B6A), chuỗi 🔥, mục tiêu 10/20/30/45 phút, 9 huy hiệu.
- Giao diện: nền #FAF9F6, thẻ #FFFFFF viền #EBEAE4, chữ #2D3136, 6 màu pastel cho cụm [1]–[6]: #FDF2D0, #E3F1E5, #E3EEF8, #FBE8DF, #EFE8F8, #F9E4EA. Không dùng màu neon.

## Quyết định đã chốt (không đổi nếu chưa hỏi mình)
- Dữ liệu: topics[] → situations[] (id "t{chủ đề}s{tình huống}") → các mức "1A", "1B", "2" → các dòng vi / py / zh. Mỗi dòng là danh sách mảnh {n: số cụm hoặc null, t: chữ}.
- Mã câu: "{id tình huống}_{mức}", ví dụ t1s1_1A. Đây cũng là tên file mp3.
- Tiến độ lưu trong localStorage với các khoá: "srs" (ôn tập), "stats" (phút học/nghe theo ngày), "commute" (cài đặt tab Nghe), "prefs". Phải giữ nguyên các khoá này để không mất tiến độ.
- Ôn tập: Quên sạch = 5 phút, Hơi vấp = 1 ngày, Nói mượt = 4 ngày. Smart Mix = các câu chấm Quên sạch hoặc Hơi vấp.
- Phút học chỉ tính khi đang thao tác (trong 90 giây gần nhất) ở màn Học hoặc Ôn tập; phút nghe tính khi tab Nghe đang phát. Một ngày tính vào chuỗi khi tổng từ 5 phút trở lên.
- Bản ghi âm nhại giọng chỉ giữ trong bộ nhớ tạm, không lưu file. Không chấm phát âm bằng AI.

## Việc cần làm (Giai đoạn 2: bản thật), làm lần lượt
1. **Lưu bản đầu tiên lên GitHub**: `git init`, tạo repo `shuo-ba` trên GitHub, đẩy code lên. Hướng dẫn mình từng thao tác nếu cần đăng nhập.
2. **Tách dữ liệu**: app đọc `lessons.json` thay vì dữ liệu nằm trong `index.html`.
3. **Script tạo âm thanh** `tools/make_audio.py` dùng `edge-tts`:
   - Tiếng Trung: giọng `zh-CN-XiaoxiaoNeural`, lưu `audio/zh/{mã câu}.mp3`.
   - Tiếng Việt: giọng `vi-VN-HoaiMyNeural`, lưu `audio/vi/{mã câu}.mp3`.
   - Bỏ qua file đã có, để chạy lại chỉ tạo câu mới. Dùng Python 3.9 có sẵn (cài edge-tts bằng `pip3 install --user edge-tts`).
4. **Đổi giọng đọc sang mp3**: thay `speechSynthesis` bằng file mp3, tốc độ chậm dùng `audio.playbackRate = 0.75`. Riêng tab Nghe phát bằng một thẻ audio để tiếp tục phát khi khoá màn hình và bấm được Play/Next trên tai nghe.
5. **Biến thành PWA** (web app cài lên màn hình chính): `manifest.json`, icon, service worker lưu sẵn mọi file (kể cả mp3) để chạy 100% offline.
6. **Đưa lên GitHub Pages**, rồi hướng dẫn mình cài lên điện thoại (Safari → Chia sẻ → Thêm vào MH chính) và kiểm tra: mic ghi âm, nghe khi khoá màn hình, chạy khi tắt mạng.
7. Sau đó: ảnh minh hoạ .webp cho từng tình huống, nội dung chủ đề 3–50, thông báo nhắc học (bàn cách làm trước khi code).

## Nhật ký
- 21/11/2026: Xong bản mẫu một file HTML trên claude.ai (đủ tính năng trong tài liệu thiết kế). Chuẩn bị chuyển sang Claude Code.
- 21/11/2026: Xong bước 1. Repo công khai https://github.com/kristinevo993/shuo-ba (nhánh `main`). Git tác giả `kristinevo993 <kristinevo993@users.noreply.github.com>`. Đẩy code bằng Personal Access Token lưu trong Keychain của Mac, **hết hạn ~21/11/2027** (khi đó tạo token mới ở github.com/settings/tokens).
