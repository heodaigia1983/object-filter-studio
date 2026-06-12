# 🎓 Claude Academy VN

Ứng dụng web (PWA) học nhanh các khoá Claude của **Anthropic Academy** bằng tiếng Việt — dùng được trên điện thoại Android, máy tính bảng và máy tính.

## Nội dung

7 khoá học · 32 bài học · 45 câu quiz · 50 flashcard, biên soạn theo chương trình chính thức tại [anthropic.skilljar.com](https://anthropic.skilljar.com/):

1. **Claude 101** — Chat, Projects, Artifacts, Skills, Connectors, Research
2. **AI Fluency: Khung 4D** — Delegation, Description, Discernment, Diligence
3. **Prompt Engineering** — XML tags, few-shot, chain of thought, prefill
4. **Claude Code 101** — cài đặt, workflow, CLAUDE.md, hooks, subagents, MCP
5. **Claude Platform 101** — API, context window, tool use, caching, batch
6. **Model Context Protocol (MCP)** — kiến trúc, primitives, xây server
7. **Agent Skills** — SKILL.md, progressive disclosure, chia sẻ skill

## Tính năng

- 🔊 **Nghe bài giảng** bằng giọng đọc tiếng Việt (Text-to-Speech), chỉnh tốc độ 0.85×–1.5×
- 🖼️ **Hình minh hoạ** SVG cho từng bài học
- 📝 **Quiz** có giải thích đáp án + hiệu ứng âm thanh đúng/sai
- 🃏 **Flashcard** lật thẻ, xáo trộn, đọc to được
- 📈 **Theo dõi tiến độ** từng khoá, chuỗi ngày học liên tiếp (streak) — lưu ngay trên máy
- 🌓 Giao diện sáng/tối, tối ưu cho màn hình điện thoại và tablet
- 📲 **Cài như app thật** (PWA) và **học offline** sau lần mở đầu tiên

## Cách dùng trên Android

1. Đưa thư mục này lên một hosting tĩnh bất kỳ (GitHub Pages, Netlify, Vercel...).
   - Với GitHub Pages: bật **Settings → Pages → Source: GitHub Actions** (đã có sẵn workflow trong repo), app sẽ ở địa chỉ `https://<user>.github.io/<repo>/claude-academy/`.
2. Mở địa chỉ đó bằng **Chrome** trên điện thoại/máy tính bảng.
3. Bấm menu **⋮ → Thêm vào màn hình chính (Add to Home screen)** — app sẽ có icon riêng, chạy toàn màn hình như app cài từ Play Store.
4. Để nghe bài giảng tốt nhất, cài **Google Text-to-Speech** và bật giọng tiếng Việt (đa số máy Android có sẵn).

> Lưu ý: app này giúp học nhanh nội dung; để nhận **chứng chỉ chính thức** của Anthropic, hãy hoàn thành khoá tương ứng tại anthropic.skilljar.com.

## Bản quyền

**© 2026 Lê Văn Thảo. Bảo lưu mọi quyền.** — Liên hệ: heodaigia1983@gmail.com

Xem chi tiết tại file [LICENSE](../LICENSE). Nội dung học tập được biên soạn lại bằng tiếng Việt theo đề cương các khoá học công khai của Anthropic Academy. Claude và Anthropic là thương hiệu của Anthropic PBC.

## Kỹ thuật

HTML/CSS/JS thuần, không cần build, không backend. Tiến độ lưu bằng `localStorage`. Âm thanh: Web Speech API (TTS) + WebAudio (hiệu ứng). Offline: service worker cache-first.
