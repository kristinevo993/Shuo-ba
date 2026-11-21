#!/usr/bin/env python3
"""Tạo file mp3 cho mọi câu trong lessons.json bằng edge-tts.

Cách chạy (cần có mạng), từ thư mục shuo-ba:
    python3 tools/make_audio.py

- Tiếng Trung: giọng zh-CN-XiaoxiaoNeural  -> audio/zh/{mã câu}.mp3
- Tiếng Việt:  giọng vi-VN-HoaiMyNeural    -> audio/vi/{mã câu}.mp3
- Mã câu = "{id tình huống}_{mức}", ví dụ t1s1_1A.
- File đã có thì bỏ qua, nên thêm bài mới chỉ cần chạy lại.
  Muốn tạo lại một câu (vd. sửa chữ), xoá file mp3 của câu đó rồi chạy lại.
"""
import asyncio
import json
import os
import sys

import edge_tts

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
LESSONS = os.path.join(ROOT, "lessons.json")
LEVELS = ["1A", "1B", "2"]
LANGS = {
    # ngôn ngữ: (dòng trong dữ liệu, giọng đọc, cách nối các mảnh)
    "zh": ("zh", "zh-CN-XiaoxiaoNeural", ""),
    "vi": ("vi", "vi-VN-HoaiMyNeural", " "),
}
SONG_SONG = 4   # số file tạo cùng lúc
THU_LAI = 3     # số lần thử lại nếu mạng lỗi


def danh_sach_viec():
    """Trả về danh sách (đường dẫn mp3, chữ cần đọc, giọng)."""
    with open(LESSONS, encoding="utf-8") as f:
        data = json.load(f)
    viec = []
    for topic in data["topics"]:
        for sit in topic["situations"]:
            for lv in LEVELS:
                if lv not in sit:
                    continue
                ma = f'{sit["id"]}_{lv}'
                for lang, (dong, giong, noi) in LANGS.items():
                    chu = noi.join(m["t"] for m in sit[lv][dong]).strip()
                    duong_dan = os.path.join(ROOT, "audio", lang, ma + ".mp3")
                    viec.append((duong_dan, chu, giong))
    return viec


async def tao_mot_file(duong_dan, chu, giong, khoa):
    async with khoa:
        tam = duong_dan + ".tmp"
        for lan in range(1, THU_LAI + 1):
            try:
                await edge_tts.Communicate(chu, giong).save(tam)
                os.replace(tam, duong_dan)   # chỉ đổi tên khi đã tải xong, tránh file hỏng
                print("  ✓", os.path.relpath(duong_dan, ROOT), "·", chu)
                return True
            except Exception as e:
                print(f"  ! lỗi lần {lan}: {os.path.relpath(duong_dan, ROOT)} ({e})")
                await asyncio.sleep(2 * lan)
        if os.path.exists(tam):
            os.remove(tam)
        return False


async def main():
    viec = danh_sach_viec()
    for lang in LANGS:
        os.makedirs(os.path.join(ROOT, "audio", lang), exist_ok=True)
    can_tao = [v for v in viec if not os.path.exists(v[0])]
    print(f"Tổng {len(viec)} file · đã có {len(viec) - len(can_tao)} · cần tạo {len(can_tao)}")
    khoa = asyncio.Semaphore(SONG_SONG)
    ket_qua = await asyncio.gather(*(tao_mot_file(*v, khoa) for v in can_tao))
    loi = ket_qua.count(False)
    print(f"Xong: tạo mới {ket_qua.count(True)} file, lỗi {loi} file.")
    if loi:
        print("Chạy lại script để thử tạo các file bị lỗi.")
        sys.exit(1)


if __name__ == "__main__":
    asyncio.run(main())
