// Hình minh hoạ SVG cho từng bài học — phong cách Anthropic (nền kem, nét đơn giản)

const ArtLib = (() => {
  const C = { ink: "#191919", terra: "#CC785C", green: "#6A9B7E", purple: "#8B6FAE", blue: "#4A7A9B", gold: "#B8860B", slate: "#5B7FA6", rose: "#A0566B", cream: "#F0EBE0", paper: "#FAF7F0" };

  const esc = s => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;");

  function box(x, y, w, h, label, fill, opts = {}) {
    const fs = opts.fs || 13, tc = opts.tc || "#fff";
    const lines = Array.isArray(label) ? label : [label];
    const lh = fs + 3, ty = y + h / 2 - (lines.length - 1) * lh / 2 + fs / 3;
    const texts = lines.map((l, i) =>
      `<text x="${x + w / 2}" y="${ty + i * lh}" text-anchor="middle" font-size="${fs}" font-weight="600" fill="${tc}" font-family="system-ui,sans-serif">${esc(l)}</text>`).join("");
    return `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="10" fill="${fill}" stroke="${C.ink}" stroke-width="1.5"/>${texts}`;
  }
  function arrow(x1, y1, x2, y2) {
    return `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="${C.ink}" stroke-width="2" marker-end="url(#ah)"/>`;
  }
  function txt(x, y, s, opts = {}) {
    return `<text x="${x}" y="${y}" text-anchor="${opts.anchor || "middle"}" font-size="${opts.fs || 11}" fill="${opts.c || C.ink}" font-weight="${opts.w || 500}" font-family="system-ui,sans-serif">${esc(s)}</text>`;
  }
  function wrap(inner) {
    return `<svg viewBox="0 0 320 180" xmlns="http://www.w3.org/2000/svg" role="img">
<defs><marker id="ah" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto"><path d="M0,0 L7,3 L0,6 Z" fill="${C.ink}"/></marker></defs>
<rect width="320" height="180" rx="14" fill="${C.cream}"/>${inner}</svg>`;
  }

  const A = {};

  A.models = wrap(
    box(20, 55, 80, 70, ["Haiku", "⚡ nhanh"], C.green) +
    box(120, 40, 80, 85, ["Sonnet", "⚖️ cân bằng"], C.terra) +
    box(220, 25, 80, 100, ["Opus", "🧠 mạnh nhất"], C.purple) +
    txt(160, 160, "Ba dòng mô hình Claude — chọn theo độ khó của việc", { fs: 11 })
  );

  A.chat = wrap(
    `<rect x="60" y="18" width="200" height="130" rx="12" fill="${C.paper}" stroke="${C.ink}" stroke-width="1.5"/>` +
    `<rect x="75" y="34" width="120" height="26" rx="12" fill="#E3DACC"/>` + txt(135, 51, "Câu hỏi + ngữ cảnh", { fs: 10 }) +
    `<rect x="100" y="70" width="145" height="26" rx="12" fill="${C.terra}"/>` + txt(172, 87, "Claude trả lời", { fs: 10, c: "#fff" }) +
    `<rect x="75" y="106" width="130" height="26" rx="12" fill="#E3DACC"/>` + txt(140, 123, "Tinh chỉnh tiếp…", { fs: 10 }) +
    txt(160, 166, "Hội thoại là vòng lặp: hỏi → nhận → tinh chỉnh", { fs: 11 })
  );

  A.projects = wrap(
    `<path d="M30 50 l18 0 8 -10 60 0 0 80 -86 0 z" fill="${C.gold}" stroke="${C.ink}" stroke-width="1.5"/>` +
    txt(73, 95, "Project", { fs: 12, c: "#fff", w: 700 }) +
    box(150, 30, 70, 32, "Chat 1", C.terra, { fs: 11 }) +
    box(150, 74, 70, 32, "Chat 2", C.terra, { fs: 11 }) +
    box(150, 118, 70, 32, "Chat 3", C.terra, { fs: 11 }) +
    box(240, 52, 66, 32, "📄 Tài liệu", C.paper, { fs: 10, tc: C.ink }) +
    box(240, 96, 66, 32, "📋 Quy tắc", C.paper, { fs: 10, tc: C.ink }) +
    arrow(120, 90, 145, 90) +
    txt(160, 168, "Một chủ đề — nhiều chat dùng chung tài liệu và quy tắc", { fs: 10.5 })
  );

  A.tools = wrap(
    box(120, 65, 80, 50, "Claude", C.terra) +
    box(15, 20, 80, 32, "🎒 Skills", C.purple, { fs: 11 }) +
    box(15, 75, 80, 32, "🔗 Connectors", C.slate, { fs: 10 }) +
    box(15, 130, 80, 32, "🔍 Research", C.green, { fs: 11 }) +
    arrow(98, 36, 130, 65) + arrow(98, 91, 117, 91) + arrow(98, 146, 130, 115) +
    box(230, 65, 75, 50, ["Kết quả", "chuyên sâu"], C.gold, { fs: 11 }) +
    arrow(203, 90, 227, 90)
  );

  A.daily = wrap(
    box(20, 28, 130, 28, "✉️ Viết email, báo cáo", C.paper, { fs: 10, tc: C.ink }) +
    box(20, 64, 130, 28, "📑 Tóm tắt tài liệu", C.paper, { fs: 10, tc: C.ink }) +
    box(20, 100, 130, 28, "📊 Phân tích dữ liệu", C.paper, { fs: 10, tc: C.ink }) +
    box(20, 136, 130, 28, "🎓 Học và dịch thuật", C.paper, { fs: 10, tc: C.ink }) +
    box(200, 64, 100, 52, ["Claude", "mỗi ngày"], C.terra) +
    arrow(153, 42, 200, 75) + arrow(153, 78, 197, 85) + arrow(153, 114, 197, 100) + arrow(153, 150, 200, 108)
  );

  A.fourd = wrap(
    box(35, 22, 115, 60, ["Delegation", "Giao việc"], C.green, { fs: 12 }) +
    box(170, 22, 115, 60, ["Description", "Mô tả"], C.terra, { fs: 12 }) +
    box(35, 98, 115, 60, ["Discernment", "Thẩm định"], C.purple, { fs: 12 }) +
    box(170, 98, 115, 60, ["Diligence", "Trách nhiệm"], C.slate, { fs: 12 })
  );

  A.delegate = wrap(
    box(15, 65, 70, 50, "🧑 Bạn", C.gold) +
    box(125, 20, 80, 40, ["Quyết định", "phán đoán"], C.paper, { fs: 10, tc: C.ink }) +
    box(125, 120, 80, 40, ["Nháp, tóm tắt", "lặp lại"], C.paper, { fs: 10, tc: C.ink }) +
    box(240, 120, 65, 40, "🤖 AI", C.terra) +
    arrow(88, 75, 121, 45) + arrow(88, 105, 121, 135) + arrow(208, 140, 236, 140) +
    txt(160, 95, "chia việc đúng chỗ", { fs: 10 })
  );

  A.discern = wrap(
    `<rect x="40" y="30" width="130" height="120" rx="8" fill="${C.paper}" stroke="${C.ink}" stroke-width="1.5"/>` +
    `<line x1="55" y1="55" x2="155" y2="55" stroke="#C9BFAE" stroke-width="6" stroke-linecap="round"/>` +
    `<line x1="55" y1="78" x2="140" y2="78" stroke="#C9BFAE" stroke-width="6" stroke-linecap="round"/>` +
    `<line x1="55" y1="101" x2="150" y2="101" stroke="#C9BFAE" stroke-width="6" stroke-linecap="round"/>` +
    `<line x1="55" y1="124" x2="120" y2="124" stroke="#C9BFAE" stroke-width="6" stroke-linecap="round"/>` +
    `<circle cx="210" cy="85" r="38" fill="none" stroke="${C.purple}" stroke-width="7"/>` +
    `<line x1="238" y1="113" x2="275" y2="150" stroke="${C.purple}" stroke-width="9" stroke-linecap="round"/>` +
    txt(210, 91, "✓?", { fs: 22, c: C.purple, w: 700 })
  );

  A.diligence = wrap(
    `<path d="M160 20 L225 45 L225 100 Q225 140 160 160 Q95 140 95 100 L95 45 Z" fill="${C.slate}" stroke="${C.ink}" stroke-width="1.5"/>` +
    `<path d="M135 88 l18 20 35 -38" fill="none" stroke="#fff" stroke-width="9" stroke-linecap="round" stroke-linejoin="round"/>` +
    txt(160, 175, "Kiểm chứng — minh bạch — chịu trách nhiệm", { fs: 10.5 })
  );

  A.prompt = wrap(
    box(40, 18, 240, 30, "🎭 Vai trò + nhiệm vụ", C.purple, { fs: 11 }) +
    box(40, 56, 240, 30, "📎 Bối cảnh + dữ liệu", C.terra, { fs: 11 }) +
    box(40, 94, 240, 30, "📐 Yêu cầu cụ thể + tiêu chí", C.green, { fs: 11 }) +
    box(40, 132, 240, 30, "🎯 Định dạng đầu ra", C.gold, { fs: 11 })
  );

  A.structure = wrap(
    `<rect x="35" y="18" width="250" height="144" rx="10" fill="#241F1A"/>` +
    txt(50, 45, "<document>…</document>", { anchor: "start", fs: 13, c: "#E8A87C", w: 600 }) +
    txt(50, 75, "<instructions>…</instructions>", { anchor: "start", fs: 13, c: "#9FD0A9", w: 600 }) +
    txt(50, 105, "<example>…</example>", { anchor: "start", fs: 13, c: "#B9A7E0", w: 600 }) +
    txt(50, 140, "Câu hỏi đặt ở cuối ↓", { anchor: "start", fs: 12, c: "#F0EBE0" })
  );

  A.fewshot = wrap(
    box(20, 25, 85, 34, "Ví dụ 1", C.paper, { fs: 11, tc: C.ink }) +
    box(20, 73, 85, 34, "Ví dụ 2", C.paper, { fs: 11, tc: C.ink }) +
    box(20, 121, 85, 34, "Ví dụ 3", C.paper, { fs: 11, tc: C.ink }) +
    box(135, 73, 75, 34, "Claude", C.terra, { fs: 12 }) +
    arrow(108, 42, 138, 73) + arrow(108, 90, 131, 90) + arrow(108, 138, 138, 107) +
    box(240, 65, 65, 50, ["Đúng mẫu", "✓"], C.green, { fs: 11 }) +
    arrow(213, 90, 236, 90)
  );

  A.format = wrap(
    `<text x="80" y="115" text-anchor="middle" font-size="84" font-weight="700" fill="${C.gold}" font-family="ui-monospace,monospace">{ }</text>` +
    box(170, 45, 130, 28, "JSON đúng schema", C.paper, { fs: 10.5, tc: C.ink }) +
    box(170, 81, 130, 28, "Bảng đúng cột", C.paper, { fs: 10.5, tc: C.ink }) +
    box(170, 117, 130, 28, "Prefill ép mở đầu", C.paper, { fs: 10.5, tc: C.ink })
  );

  A.iterate = wrap(
    `<circle cx="160" cy="88" r="55" fill="none" stroke="${C.purple}" stroke-width="3" stroke-dasharray="6 5"/>` +
    box(120, 14, 80, 26, "Viết prompt", C.purple, { fs: 10 }) +
    box(228, 73, 75, 26, "Chạy thử", C.terra, { fs: 10 }) +
    box(120, 138, 80, 26, "Soi lỗi", C.gold, { fs: 10 }) +
    box(18, 73, 75, 26, "Sửa prompt", C.green, { fs: 10 }) +
    txt(160, 92, "lặp", { fs: 13, w: 700 })
  );

  A.terminal = wrap(
    `<rect x="30" y="22" width="260" height="136" rx="10" fill="#241F1A"/>` +
    `<circle cx="50" cy="40" r="5" fill="#E66B5B"/><circle cx="68" cy="40" r="5" fill="#E8C547"/><circle cx="86" cy="40" r="5" fill="#6A9B7E"/>` +
    txt(45, 72, "$ claude", { anchor: "start", fs: 14, c: "#9FD0A9", w: 700 }) +
    txt(45, 98, "> sửa bug đăng nhập", { anchor: "start", fs: 12, c: "#F0EBE0" }) +
    txt(45, 122, "✓ Đọc code… ✓ Sửa… ✓ Test", { anchor: "start", fs: 12, c: "#E8A87C" }) +
    txt(45, 144, "✓ Hoàn thành", { anchor: "start", fs: 12, c: "#9FD0A9" })
  );

  A.workflow = wrap(
    box(14, 70, 66, 44, ["Khám", "phá"], C.green, { fs: 11 }) +
    box(94, 70, 66, 44, ["Kế", "hoạch"], C.purple, { fs: 11 }) +
    box(174, 70, 66, 44, "Code", C.terra, { fs: 12 }) +
    box(254, 70, 52, 44, "Commit", C.gold, { fs: 10 }) +
    arrow(82, 92, 91, 92) + arrow(162, 92, 171, 92) + arrow(242, 92, 251, 92) +
    txt(160, 40, "Quy trình 4 bước cho nhiệm vụ lớn", { fs: 12, w: 600 }) +
    txt(160, 150, "Duyệt kế hoạch trước khi cho sửa code", { fs: 10.5 })
  );

  A.claudemd = wrap(
    `<rect x="55" y="22" width="120" height="140" rx="8" fill="${C.paper}" stroke="${C.ink}" stroke-width="1.5"/>` +
    txt(115, 48, "CLAUDE.md", { fs: 13, w: 700, c: C.blue }) +
    txt(68, 74, "• lệnh build/test", { anchor: "start", fs: 10 }) +
    txt(68, 94, "• quy ước code", { anchor: "start", fs: 10 }) +
    txt(68, 114, "• cấu trúc dự án", { anchor: "start", fs: 10 }) +
    txt(68, 134, "• điều cần tránh", { anchor: "start", fs: 10 }) +
    box(210, 65, 85, 50, ["Tự nạp", "mỗi phiên"], C.blue, { fs: 11 }) +
    arrow(178, 90, 206, 90)
  );

  A.custom = wrap(
    box(20, 25, 130, 34, "/lệnh-riêng", C.purple, { fs: 12 }) +
    box(20, 73, 130, 34, "⚓ Hooks tự động", C.gold, { fs: 11 }) +
    box(20, 121, 130, 34, "🤖 Subagents", C.green, { fs: 11 }) +
    box(200, 65, 100, 50, ["Claude Code", "của riêng bạn"], C.blue, { fs: 11 }) +
    arrow(153, 42, 200, 75) + arrow(153, 90, 196, 90) + arrow(153, 138, 200, 105)
  );

  A.github = wrap(
    `<circle cx="60" cy="50" r="9" fill="${C.blue}" stroke="${C.ink}" stroke-width="1.5"/>` +
    `<circle cx="60" cy="130" r="9" fill="${C.blue}" stroke="${C.ink}" stroke-width="1.5"/>` +
    `<circle cx="120" cy="90" r="9" fill="${C.terra}" stroke="${C.ink}" stroke-width="1.5"/>` +
    `<path d="M60 59 L60 121 M60 70 Q60 90 111 90 M129 90 Q160 90 160 70 L160 50" fill="none" stroke="${C.ink}" stroke-width="2"/>` +
    `<circle cx="160" cy="50" r="9" fill="${C.green}" stroke="${C.ink}" stroke-width="1.5"/>` +
    box(200, 35, 105, 30, "Tạo PR", C.paper, { fs: 11, tc: C.ink }) +
    box(200, 75, 105, 30, "Sửa issue", C.paper, { fs: 11, tc: C.ink }) +
    box(200, 115, 105, 30, "CI headless", C.paper, { fs: 11, tc: C.ink })
  );

  A.api = wrap(
    box(20, 60, 90, 60, ["Ứng dụng", "của bạn"], C.gold, { fs: 11 }) +
    box(210, 60, 90, 60, ["Claude", "API"], C.terra, { fs: 12 }) +
    arrow(113, 75, 206, 75) + arrow(206, 105, 113, 105) +
    txt(160, 68, "request: model + messages", { fs: 9.5 }) +
    txt(160, 122, "response: content + usage", { fs: 9.5 }) +
    txt(160, 160, "POST /v1/messages — kèm x-api-key", { fs: 10.5 })
  );

  A.context = wrap(
    `<rect x="30" y="35" width="260" height="56" rx="10" fill="${C.paper}" stroke="${C.ink}" stroke-width="1.5"/>` +
    `<rect x="30" y="35" width="70" height="56" rx="10" fill="${C.purple}"/>` + txt(65, 67, "system", { fs: 10, c: "#fff" }) +
    `<rect x="100" y="35" width="130" height="56" fill="${C.terra}"/>` + txt(165, 67, "messages (lịch sử)", { fs: 10, c: "#fff" }) +
    `<rect x="230" y="35" width="60" height="56" fill="${C.green}"/>` + txt(260, 67, "output", { fs: 10, c: "#fff" }) +
    `<path d="M30 105 L30 115 L290 115 L290 105" fill="none" stroke="${C.ink}" stroke-width="1.5"/>` +
    txt(160, 133, "context window — tất cả tính bằng token", { fs: 11, w: 600 }) +
    txt(160, 158, "API stateless: gửi lại toàn bộ mỗi request", { fs: 10 })
  );

  A.params = wrap(
    txt(60, 40, "temperature", { anchor: "start", fs: 11, w: 600 }) +
    `<line x1="60" y1="55" x2="260" y2="55" stroke="#C9BFAE" stroke-width="6" stroke-linecap="round"/>` +
    `<circle cx="110" cy="55" r="10" fill="${C.terra}" stroke="${C.ink}" stroke-width="1.5"/>` +
    txt(60, 90, "max_tokens", { anchor: "start", fs: 11, w: 600 }) +
    `<line x1="60" y1="105" x2="260" y2="105" stroke="#C9BFAE" stroke-width="6" stroke-linecap="round"/>` +
    `<circle cx="200" cy="105" r="10" fill="${C.green}" stroke="${C.ink}" stroke-width="1.5"/>` +
    txt(60, 140, "system prompt", { anchor: "start", fs: 11, w: 600 }) +
    `<line x1="60" y1="155" x2="260" y2="155" stroke="#C9BFAE" stroke-width="6" stroke-linecap="round"/>` +
    `<circle cx="240" cy="155" r="10" fill="${C.purple}" stroke="${C.ink}" stroke-width="1.5"/>`
  );

  A.tooluse = wrap(
    box(20, 65, 80, 50, "Claude", C.terra) +
    box(220, 65, 85, 50, ["Hàm của", "bạn"], C.gold, { fs: 11 }) +
    arrow(103, 78, 216, 78) + arrow(216, 102, 103, 102) +
    txt(160, 70, "tool_use: tên + tham số", { fs: 9.5 }) +
    txt(160, 120, "tool_result: kết quả", { fs: 9.5 }) +
    txt(160, 155, "lặp đến khi nhiệm vụ hoàn thành = agent", { fs: 11, w: 600 })
  );

  A.optimize = wrap(
    box(20, 25, 130, 36, "⚡ Streaming", C.terra, { fs: 11 }) +
    box(20, 72, 130, 36, "🗄️ Caching −90%", C.green, { fs: 11 }) +
    box(20, 119, 130, 36, "📦 Batch −50%", C.purple, { fs: 11 }) +
    box(200, 65, 100, 50, ["Nhanh hơn", "rẻ hơn"], C.gold, { fs: 12 }) +
    arrow(153, 43, 200, 75) + arrow(153, 90, 196, 90) + arrow(153, 137, 200, 105)
  );

  A.mcp = wrap(
    box(115, 65, 90, 50, ["App AI", "(Host)"], C.terra, { fs: 11 }) +
    box(15, 18, 75, 32, "Database", C.slate, { fs: 10 }) +
    box(15, 130, 75, 32, "Slack", C.slate, { fs: 10 }) +
    box(230, 18, 75, 32, "GitHub", C.slate, { fs: 10 }) +
    box(230, 130, 75, 32, "Drive", C.slate, { fs: 10 }) +
    arrow(93, 40, 122, 65) + arrow(93, 140, 122, 115) + arrow(227, 40, 198, 65) + arrow(227, 140, 198, 115) +
    txt(160, 165, "Một chuẩn cắm chung — như USB-C cho AI", { fs: 10.5 })
  );

  A.primitives = wrap(
    box(20, 45, 88, 60, ["Tools", "hành động"], C.terra, { fs: 11 }) +
    box(116, 45, 88, 60, ["Resources", "dữ liệu"], C.green, { fs: 11 }) +
    box(212, 45, 88, 60, ["Prompts", "mẫu lệnh"], C.purple, { fs: 11 }) +
    txt(64, 130, "mô hình quyết", { fs: 10 }) + txt(160, 130, "ứng dụng quyết", { fs: 10 }) + txt(256, 130, "người dùng quyết", { fs: 10 })
  );

  A.server = wrap(
    `<rect x="100" y="20" width="120" height="34" rx="6" fill="${C.slate}" stroke="${C.ink}" stroke-width="1.5"/>` +
    `<rect x="100" y="60" width="120" height="34" rx="6" fill="${C.slate}" stroke="${C.ink}" stroke-width="1.5"/>` +
    `<rect x="100" y="100" width="120" height="34" rx="6" fill="${C.slate}" stroke="${C.ink}" stroke-width="1.5"/>` +
    `<circle cx="115" cy="37" r="4" fill="#9FD0A9"/><circle cx="115" cy="77" r="4" fill="#9FD0A9"/><circle cx="115" cy="117" r="4" fill="#9FD0A9"/>` +
    txt(168, 41, "@mcp.tool()", { fs: 10, c: "#fff" }) + txt(168, 81, "get_weather()", { fs: 10, c: "#fff" }) + txt(168, 121, "mcp.run()", { fs: 10, c: "#fff" }) +
    txt(160, 160, "FastMCP: vài dòng Python thành một server", { fs: 10.5 })
  );

  A.connect = wrap(
    `<rect x="30" y="70" width="100" height="40" rx="8" fill="${C.terra}" stroke="${C.ink}" stroke-width="1.5"/>` + txt(80, 95, "Claude", { fs: 12, c: "#fff", w: 600 }) +
    `<line x1="130" y1="90" x2="165" y2="90" stroke="${C.ink}" stroke-width="3"/>` +
    `<rect x="165" y="76" width="18" height="28" rx="3" fill="${C.ink}"/>` +
    `<rect x="190" y="76" width="18" height="28" rx="3" fill="${C.ink}"/>` +
    `<line x1="208" y1="90" x2="240" y2="90" stroke="${C.ink}" stroke-width="3"/>` +
    `<rect x="240" y="70" width="60" height="40" rx="8" fill="${C.slate}" stroke="${C.ink}" stroke-width="1.5"/>` + txt(270, 95, "Server", { fs: 11, c: "#fff", w: 600 }) +
    txt(160, 145, "claude mcp add — cắm là chạy", { fs: 11 })
  );

  A.skillfolder = wrap(
    `<path d="M55 45 l25 0 10 -12 70 0 0 100 -105 0 z" fill="${C.rose}" stroke="${C.ink}" stroke-width="1.5"/>` +
    txt(107, 80, "skill/", { fs: 13, c: "#fff", w: 700 }) +
    txt(107, 102, "SKILL.md", { fs: 10, c: "#fff" }) +
    txt(107, 120, "script.py", { fs: 10, c: "#fff" }) +
    box(200, 60, 100, 50, ["Tự kích hoạt", "đúng việc"], C.green, { fs: 11 }) +
    arrow(168, 85, 196, 85)
  );

  A.skillmd = wrap(
    `<rect x="60" y="18" width="200" height="144" rx="8" fill="${C.paper}" stroke="${C.ink}" stroke-width="1.5"/>` +
    `<rect x="60" y="18" width="200" height="52" rx="8" fill="#E3DACC"/>` +
    txt(75, 38, "name: bao-cao-tai-chinh", { anchor: "start", fs: 10, w: 600 }) +
    txt(75, 56, "description: làm gì + khi nào", { anchor: "start", fs: 10, w: 600, c: C.rose }) +
    txt(75, 92, "1. Chạy script phân tích", { anchor: "start", fs: 10 }) +
    txt(75, 112, "2. Dùng template chuẩn", { anchor: "start", fs: 10 }) +
    txt(75, 132, "3. Kiểm tra số liệu", { anchor: "start", fs: 10 }) +
    txt(160, 152, "frontmatter + hướng dẫn từng bước", { fs: 9.5 })
  );

  A.quality = wrap(
    `<path d="M160 25 L175 65 L218 67 L184 93 L196 135 L160 110 L124 135 L136 93 L102 67 L145 65 Z" fill="${C.gold}" stroke="${C.ink}" stroke-width="1.5"/>` +
    txt(160, 162, "description rõ + ngắn gọn + một skill một việc + test thật", { fs: 10 })
  );

  A.share = wrap(
    `<circle cx="80" cy="90" r="26" fill="${C.rose}" stroke="${C.ink}" stroke-width="1.5"/>` + txt(80, 95, "Skill", { fs: 11, c: "#fff", w: 600 }) +
    `<circle cx="220" cy="40" r="20" fill="${C.green}" stroke="${C.ink}" stroke-width="1.5"/>` + txt(220, 44, "Bạn", { fs: 9, c: "#fff" }) +
    `<circle cx="250" cy="95" r="20" fill="${C.terra}" stroke="${C.ink}" stroke-width="1.5"/>` + txt(250, 99, "Team", { fs: 9, c: "#fff" }) +
    `<circle cx="215" cy="148" r="20" fill="${C.purple}" stroke="${C.ink}" stroke-width="1.5"/>` + txt(215, 152, "Cộng", { fs: 8, c: "#fff" }) +
    arrow(105, 78, 197, 47) + arrow(108, 92, 226, 95) + arrow(103, 102, 193, 141) +
    txt(80, 140, "git / plugin / marketplace", { fs: 9.5 })
  );

  return A;
})();
