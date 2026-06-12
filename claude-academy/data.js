// Claude Academy VN — Nội dung khoá học (tiếng Việt)
// Dựa trên chương trình Anthropic Academy (anthropic.skilljar.com)

const COURSES = [
// ════════════════════════════════ 1. CLAUDE 101 ════════════════════════════════
{
  id: "claude-101",
  emoji: "🍎",
  color: "#CC785C",
  title: "Claude 101",
  subtitle: "Làm chủ Claude cho công việc hằng ngày: Chat, Projects, Artifacts, Skills và Research.",
  level: "Cơ bản",
  duration: "≈ 45 phút",
  lessons: [
    {
      id: "c101-1", title: "Claude là gì?", time: "8 phút", art: "models",
      sections: [
        { h: "Gặp gỡ Claude", p: [
          "Claude là trợ lý AI do Anthropic phát triển — một công ty nghiên cứu AI đặt sự an toàn làm trọng tâm. Claude có thể trò chuyện, viết lách, phân tích tài liệu, lập trình, xử lý hình ảnh và giúp bạn suy nghĩ rõ ràng hơn về mọi vấn đề.",
          "Điểm khác biệt của Claude là khả năng hiểu ngữ cảnh dài (context window rất lớn — hàng trăm trang tài liệu trong một cuộc trò chuyện), văn phong tự nhiên, và được huấn luyện theo phương pháp Constitutional AI để trả lời hữu ích, trung thực và vô hại."
        ]},
        { h: "Các dòng mô hình", p: [
          "Claude có nhiều dòng mô hình để bạn chọn theo nhu cầu:"
        ], list: [
          "Haiku — nhanh và nhẹ nhất, phù hợp tác vụ đơn giản, phản hồi tức thì.",
          "Sonnet — cân bằng giữa tốc độ và trí tuệ, lựa chọn mặc định cho đa số công việc.",
          "Opus — mạnh nhất cho suy luận phức tạp, viết chuyên sâu, lập trình khó."
        ]},
        { h: "Bạn có thể dùng Claude ở đâu?", list: [
          "Web: claude.ai trên mọi trình duyệt.",
          "Ứng dụng di động: Android và iOS (có trò chuyện bằng giọng nói).",
          "Ứng dụng desktop: Mac và Windows.",
          "Claude Code: agent lập trình trong terminal dành cho lập trình viên.",
          "API: tích hợp Claude vào sản phẩm của riêng bạn."
        ]}
      ],
      takeaways: [
        "Claude là trợ lý AI của Anthropic, mạnh về ngữ cảnh dài và văn phong tự nhiên.",
        "Ba dòng mô hình: Haiku (nhanh) → Sonnet (cân bằng) → Opus (mạnh nhất).",
        "Dùng được trên web, mobile, desktop, terminal (Claude Code) và API."
      ]
    },
    {
      id: "c101-2", title: "Làm chủ giao diện Chat", time: "9 phút", art: "chat",
      sections: [
        { h: "Bắt đầu cuộc trò chuyện", p: [
          "Mỗi cuộc trò chuyện (chat) là một phiên làm việc độc lập. Claude nhớ mọi thứ trong cùng một cuộc trò chuyện, nhưng không tự nhớ giữa các cuộc trò chuyện khác nhau (trừ khi bạn bật tính năng memory hoặc dùng Projects).",
          "Bạn có thể đính kèm tệp (PDF, Word, Excel, CSV, ảnh, code...) ngay vào ô chat — Claude sẽ đọc, tóm tắt, phân tích hoặc trả lời câu hỏi về nội dung tệp."
        ]},
        { h: "Các tính năng đáng dùng ngay", list: [
          "Chọn mô hình: đổi giữa Haiku / Sonnet / Opus tuỳ độ khó của việc.",
          "Styles: chỉnh giọng văn trả lời (ngắn gọn, trang trọng, giải thích kỹ...).",
          "Chỉnh sửa câu hỏi: sửa lại tin nhắn đã gửi để nhận câu trả lời tốt hơn.",
          "Tìm kiếm lịch sử: tìm lại các cuộc trò chuyện cũ theo từ khoá.",
          "Voice: nói chuyện trực tiếp với Claude trên app di động."
        ]},
        { h: "Nguyên tắc vàng khi hỏi", p: [
          "Hãy coi Claude như một đồng nghiệp rất giỏi nhưng mới vào công ty: thông minh, nhưng chưa biết gì về hoàn cảnh của bạn. Câu hỏi tốt gồm 3 phần: bối cảnh (bạn là ai, đang làm gì), yêu cầu cụ thể (muốn gì, định dạng nào), và tiêu chí (độ dài, giọng văn, đối tượng đọc)."
        ]}
      ],
      takeaways: [
        "Mỗi chat là một phiên độc lập — cung cấp đủ ngữ cảnh ngay từ đầu.",
        "Đính kèm tệp và ảnh trực tiếp để Claude phân tích.",
        "Câu hỏi tốt = bối cảnh + yêu cầu cụ thể + tiêu chí đầu ra."
      ]
    },
    {
      id: "c101-3", title: "Projects và Artifacts", time: "9 phút", art: "projects",
      sections: [
        { h: "Projects — không gian làm việc theo chủ đề", p: [
          "Projects cho phép bạn gom các cuộc trò chuyện liên quan vào một nơi, kèm theo: kho kiến thức (knowledge base) — tải tài liệu lên một lần, mọi chat trong project đều đọc được; và hướng dẫn tuỳ chỉnh (custom instructions) — quy định cách Claude trả lời trong project đó.",
          "Ví dụ: tạo project «Kế hoạch kinh doanh 2026», tải lên báo cáo tài chính và kế hoạch cũ, đặt hướng dẫn «luôn trả lời bằng tiếng Việt, văn phong báo cáo». Từ đó mọi chat đều có sẵn ngữ cảnh."
        ]},
        { h: "Artifacts — sản phẩm hiển thị riêng", p: [
          "Khi bạn nhờ Claude tạo nội dung dài hoặc có cấu trúc — tài liệu, bảng tính, đoạn code, trang web, sơ đồ, thậm chí mini app — Claude sẽ tạo Artifact: một khung riêng bên cạnh chat, có thể xem trước, chỉnh sửa từng phần, tải về và chia sẻ bằng link.",
          "Artifacts đặc biệt mạnh khi bạn muốn vừa trò chuyện vừa tinh chỉnh sản phẩm: «đổi màu nút sang xanh», «thêm phần kết luận» — Claude cập nhật trực tiếp vào Artifact."
        ]},
        { h: "Khi nào dùng gì?", list: [
          "Việc một lần, nhanh → chat thường.",
          "Chủ đề lặp lại nhiều tuần (dự án, môn học, khách hàng) → Projects.",
          "Cần sản phẩm hoàn chỉnh (văn bản, code, web) → yêu cầu tạo Artifact."
        ]}
      ],
      takeaways: [
        "Projects = chat + kho tài liệu + hướng dẫn riêng cho từng chủ đề.",
        "Artifacts = sản phẩm (tài liệu/code/web app) hiển thị và chỉnh sửa trực tiếp.",
        "Dùng Projects cho việc lặp lại để khỏi phải lặp lại ngữ cảnh."
      ]
    },
    {
      id: "c101-4", title: "Skills, Connectors và Research", time: "9 phút", art: "tools",
      sections: [
        { h: "Skills — kỹ năng đóng gói sẵn", p: [
          "Skills là các bộ hướng dẫn chuyên biệt mà Claude tự động áp dụng đúng lúc: tạo file Excel có công thức, làm slide PowerPoint, xuất PDF, tuân thủ brand guideline của công ty... Bạn cũng có thể tự tạo skill riêng (học sâu hơn ở khoá Agent Skills)."
        ]},
        { h: "Connectors — kết nối dữ liệu của bạn", p: [
          "Connectors (xây trên chuẩn MCP) cho phép Claude truy cập trực tiếp Gmail, Google Calendar, Google Drive, Notion, Slack... Sau khi kết nối, bạn có thể nói: «tóm tắt email tuần này», «tìm file kế hoạch Q3 trong Drive và làm bảng so sánh»."
        ]},
        { h: "Research — nghiên cứu sâu", p: [
          "Chế độ Research cho phép Claude tự tìm kiếm web nhiều vòng, đối chiếu nhiều nguồn và trả về một báo cáo có trích dẫn. Hãy dùng khi bạn cần câu trả lời được kiểm chứng thay vì chỉ là kiến thức sẵn có của mô hình.",
          "Với tài khoản doanh nghiệp, Enterprise Search còn giúp Claude tìm trong toàn bộ tài liệu nội bộ của công ty."
        ]}
      ],
      takeaways: [
        "Skills giúp Claude làm việc chuyên nghiệp theo quy trình đóng gói sẵn.",
        "Connectors nối Claude với Gmail, Drive, Calendar... qua chuẩn MCP.",
        "Research mode = tìm kiếm web sâu nhiều vòng, có trích dẫn nguồn."
      ]
    },
    {
      id: "c101-5", title: "5 thói quen dùng Claude hiệu quả", time: "8 phút", art: "daily",
      sections: [
        { h: "Những việc Claude làm rất tốt mỗi ngày", list: [
          "Viết và sửa: email, báo cáo, bài thuyết trình, bài đăng mạng xã hội.",
          "Tóm tắt: tài liệu dài, biên bản họp, hợp đồng — kèm điểm chính.",
          "Phân tích: dữ liệu Excel/CSV, biểu đồ, so sánh phương án.",
          "Học tập: giải thích khái niệm khó theo nhiều cấp độ, luyện phỏng vấn.",
          "Dịch thuật và biên tập song ngữ Việt – Anh tự nhiên."
        ]},
        { h: "5 thói quen của người dùng giỏi", list: [
          "1. Cho ngữ cảnh đầy đủ: đính kèm tài liệu thật thay vì mô tả suông.",
          "2. Cho ví dụ mẫu: «viết giống email này» hiệu quả hơn mọi lời mô tả.",
          "3. Lặp và tinh chỉnh: câu trả lời đầu là bản nháp — hãy yêu cầu sửa tiếp.",
          "4. Dùng Projects cho việc lặp lại để tiết kiệm thời gian thiết lập.",
          "5. Luôn kiểm chứng thông tin quan trọng — bạn là người chịu trách nhiệm cuối."
        ]}
      ],
      takeaways: [
        "Claude mạnh nhất ở: viết, tóm tắt, phân tích, học tập, dịch thuật.",
        "Ví dụ mẫu + tài liệu thật > mô tả suông.",
        "Câu trả lời đầu tiên là bản nháp; lặp lại để có kết quả tốt nhất."
      ]
    }
  ],
  quiz: [
    { q: "Dòng mô hình nào của Claude mạnh nhất cho suy luận phức tạp?", options: ["Haiku", "Sonnet", "Opus", "Mini"], a: 2, expl: "Opus là dòng mạnh nhất; Sonnet cân bằng; Haiku nhanh nhất." },
    { q: "Projects khác chat thường ở điểm nào?", options: ["Trả lời nhanh hơn", "Có kho tài liệu và hướng dẫn riêng dùng chung cho mọi chat trong project", "Miễn phí hoàn toàn", "Chỉ dành cho lập trình viên"], a: 1, expl: "Projects gom chat theo chủ đề kèm knowledge base và custom instructions." },
    { q: "Artifact là gì?", options: ["Một loại tệp đính kèm", "Sản phẩm (tài liệu/code/web) hiển thị ở khung riêng, chỉnh sửa được", "Tên một mô hình Claude", "Plugin trình duyệt"], a: 1, expl: "Artifacts là sản phẩm hoàn chỉnh hiển thị cạnh chat, có thể chỉnh sửa và chia sẻ." },
    { q: "Connectors được xây dựng trên chuẩn nào?", options: ["HTTP", "MCP (Model Context Protocol)", "FTP", "GraphQL"], a: 1, expl: "Connectors dùng chuẩn mở MCP để nối Claude với Gmail, Drive, Notion..." },
    { q: "Khi nào nên dùng chế độ Research?", options: ["Khi muốn trả lời nhanh", "Khi cần thông tin được tìm kiếm và kiểm chứng từ nhiều nguồn có trích dẫn", "Khi viết code", "Khi dịch văn bản"], a: 1, expl: "Research mode tìm kiếm web nhiều vòng và trả về báo cáo có trích dẫn." },
    { q: "Cách hiệu quả nhất để Claude viết đúng giọng văn bạn muốn?", options: ["Viết hoa toàn bộ yêu cầu", "Cung cấp ví dụ mẫu để Claude bắt chước", "Hỏi nhiều lần cùng một câu", "Dùng tiếng Anh"], a: 1, expl: "Ví dụ mẫu (few-shot) là cách truyền đạt phong cách hiệu quả nhất." }
  ],
  cards: [
    { front: "Ba dòng mô hình Claude?", back: "Haiku (nhanh nhất) — Sonnet (cân bằng) — Opus (mạnh nhất)." },
    { front: "Projects dùng để làm gì?", back: "Gom chat theo chủ đề + kho tài liệu chung + hướng dẫn tuỳ chỉnh." },
    { front: "Artifacts là gì?", back: "Sản phẩm hoàn chỉnh (tài liệu, code, web app) hiển thị ở khung riêng, chỉnh sửa và chia sẻ được." },
    { front: "Connectors làm gì?", back: "Kết nối Claude với Gmail, Drive, Calendar, Notion... qua chuẩn MCP." },
    { front: "Research mode?", back: "Claude tự tìm kiếm web nhiều vòng, đối chiếu nguồn, trả về báo cáo có trích dẫn." },
    { front: "Công thức câu hỏi tốt?", back: "Bối cảnh + Yêu cầu cụ thể + Tiêu chí đầu ra (độ dài, giọng văn, định dạng)." },
    { front: "Constitutional AI?", back: "Phương pháp huấn luyện của Anthropic giúp Claude hữu ích, trung thực, vô hại." }
  ]
},

// ════════════════════════════════ 2. AI FLUENCY ════════════════════════════════
{
  id: "ai-fluency",
  emoji: "🧭",
  color: "#6A9B7E",
  title: "AI Fluency: Khung 4D",
  subtitle: "Tư duy cộng tác với AI một cách hiệu quả, an toàn và có trách nhiệm.",
  level: "Cơ bản",
  duration: "≈ 35 phút",
  lessons: [
    {
      id: "af-1", title: "Khung 4D là gì?", time: "8 phút", art: "fourd",
      sections: [
        { h: "Vì sao cần AI Fluency?", p: [
          "Biết dùng AI không chỉ là biết gõ câu hỏi. AI Fluency (thông thạo AI) là năng lực cộng tác với AI để tạo ra kết quả tốt hơn, nhanh hơn — mà vẫn giữ được tư duy phản biện và trách nhiệm của con người.",
          "Anthropic đúc kết năng lực này thành khung 4D gồm bốn kỹ năng: Delegation (giao việc), Description (mô tả), Discernment (thẩm định), Diligence (tận tâm trách nhiệm)."
        ]},
        { h: "Bốn chữ D", list: [
          "Delegation — quyết định việc gì nên giao cho AI, việc gì con người tự làm.",
          "Description — truyền đạt rõ ràng điều bạn muốn để AI hiểu đúng.",
          "Discernment — đánh giá có phê phán kết quả AI tạo ra.",
          "Diligence — sử dụng AI một cách có trách nhiệm, minh bạch, đạo đức."
        ]},
        { h: "Hai cách cộng tác với AI", p: [
          "Automation (tự động hoá): AI làm thay một việc cụ thể theo chỉ dẫn — như dịch một văn bản. Augmentation (tăng cường): AI và bạn cùng tư duy — brainstorm, phản biện, tinh chỉnh ý tưởng. Người thông thạo AI biết chuyển linh hoạt giữa hai chế độ này."
        ]}
      ],
      takeaways: [
        "AI Fluency = cộng tác hiệu quả + tư duy phản biện + trách nhiệm.",
        "Khung 4D: Delegation, Description, Discernment, Diligence.",
        "Hai chế độ: Automation (làm thay) và Augmentation (cùng tư duy)."
      ]
    },
    {
      id: "af-2", title: "Delegation — Giao đúng việc", time: "8 phút", art: "delegate",
      sections: [
        { h: "Ba bước trước khi giao việc", list: [
          "Hiểu vấn đề (Problem awareness): bạn thực sự cần đạt điều gì? Thành công trông như thế nào?",
          "Hiểu công cụ (Platform awareness): AI đang dùng mạnh gì, yếu gì? Có truy cập được dữ liệu cần thiết không?",
          "Phân công (Task delegation): chia việc thành phần cho người và phần cho AI."
        ]},
        { h: "Việc gì nên giao cho AI?", p: [
          "AI làm tốt: bản nháp đầu tiên, tóm tắt, biến đổi định dạng, brainstorm số lượng lớn, việc lặp lại có khuôn mẫu, giải thích kiến thức phổ biến.",
          "Con người nên giữ: quyết định cuối cùng, phán đoán đạo đức, thông tin cần độ chính xác tuyệt đối, bí mật riêng tư nhạy cảm, và những việc mà chính quá trình làm tạo ra giá trị học tập cho bạn."
        ]},
        { h: "Mẹo thực hành", p: [
          "Trước mỗi việc lớn, tự hỏi: «Nếu giao việc này cho một cộng sự giỏi, tôi sẽ giao phần nào và tự làm phần nào?» — rồi giao phần đó cho Claude và giữ vai trò người duyệt."
        ]}
      ],
      takeaways: [
        "Trước khi giao việc: hiểu vấn đề → hiểu công cụ → phân công.",
        "AI giỏi bản nháp, tóm tắt, biến đổi, brainstorm; người giữ quyết định cuối.",
        "Bạn luôn là người duyệt và chịu trách nhiệm về kết quả."
      ]
    },
    {
      id: "af-3", title: "Description và Discernment", time: "9 phút", art: "discern",
      sections: [
        { h: "Description — mô tả điều bạn muốn", p: [
          "Mô tả tốt gồm ba khía cạnh: sản phẩm (đầu ra trông như thế nào: định dạng, độ dài, đối tượng đọc), quy trình (AI nên suy nghĩ ra sao: từng bước, cân nhắc phương án), và cách tương tác (giọng điệu, vai trò AI nên đóng)."
        ]},
        { h: "Discernment — thẩm định kết quả", p: [
          "Đừng chỉ đọc lướt rồi chấp nhận. Hãy thẩm định ở ba mức:"
        ], list: [
          "Sản phẩm: thông tin có đúng không? Lập luận có logic? Có thiếu gì quan trọng?",
          "Quy trình: AI có hiểu sai đề bài ở bước nào không? Có bịa nguồn không?",
          "Hiệu suất: cách cộng tác này có hiệu quả không, hay nên đổi cách hỏi?"
        ]},
        { h: "Vòng lặp mô tả – thẩm định", p: [
          "Description và Discernment tạo thành vòng lặp: mô tả → nhận kết quả → thẩm định → mô tả lại chính xác hơn. Người giỏi không viết một câu lệnh hoàn hảo ngay từ đầu — họ hội thoại để tiến dần đến kết quả tốt."
        ]}
      ],
      takeaways: [
        "Mô tả tốt: sản phẩm + quy trình + cách tương tác.",
        "Thẩm định ở 3 mức: sản phẩm, quy trình, hiệu suất cộng tác.",
        "Cộng tác với AI là vòng lặp hội thoại, không phải một câu lệnh duy nhất."
      ]
    },
    {
      id: "af-4", title: "Diligence — Trách nhiệm khi dùng AI", time: "8 phút", art: "diligence",
      sections: [
        { h: "Ba mặt của sự tận tâm", list: [
          "Tạo lập có trách nhiệm: cân nhắc dữ liệu nào được phép đưa vào AI (bảo mật, riêng tư, bản quyền).",
          "Minh bạch: cho người liên quan biết khi AI tham gia tạo ra sản phẩm, khi điều đó quan trọng với họ.",
          "Trách nhiệm sau cùng: bạn ký tên vào kết quả — lỗi của AI là lỗi của bạn nếu bạn không kiểm tra."
        ]},
        { h: "Các rủi ro cần biết", list: [
          "Hallucination: AI có thể tạo thông tin nghe rất thuyết phục nhưng sai — luôn kiểm chứng số liệu, trích dẫn, tên riêng.",
          "Thiên kiến: dữ liệu huấn luyện có thể chứa định kiến — cảnh giác với các nhận định về nhóm người.",
          "Lộ thông tin: không dán dữ liệu mật, thông tin cá nhân của người khác vào AI khi chưa được phép."
        ]},
        { h: "Quy tắc đơn giản", p: [
          "Hãy dùng AI như cách bạn muốn đồng nghiệp dùng AI khi làm việc cho bạn: kiểm tra kỹ, nói rõ khi cần, và không bao giờ đưa thông tin của bạn đi nơi không an toàn."
        ]}
      ],
      takeaways: [
        "Diligence = cẩn trọng dữ liệu đầu vào + minh bạch + chịu trách nhiệm đầu ra.",
        "Luôn kiểm chứng số liệu, trích dẫn, tên riêng do AI tạo ra.",
        "Không đưa dữ liệu mật/riêng tư vào AI khi chưa được phép."
      ]
    }
  ],
  quiz: [
    { q: "Khung 4D gồm những kỹ năng nào?", options: ["Design, Develop, Deploy, Debug", "Delegation, Description, Discernment, Diligence", "Data, Decision, Detail, Delivery", "Define, Draft, Deliver, Done"], a: 1, expl: "4D = Giao việc, Mô tả, Thẩm định, Tận tâm trách nhiệm." },
    { q: "Automation khác Augmentation ở điểm nào?", options: ["Automation là AI làm thay một việc; Augmentation là AI cùng tư duy với bạn", "Automation nhanh hơn", "Augmentation chỉ dành cho lập trình", "Không khác gì nhau"], a: 0, expl: "Làm thay (dịch, tóm tắt) vs cùng tư duy (brainstorm, phản biện)." },
    { q: "Việc nào KHÔNG nên giao hoàn toàn cho AI?", options: ["Viết bản nháp email", "Tóm tắt tài liệu", "Quyết định cuối cùng có tính đạo đức", "Brainstorm ý tưởng"], a: 2, expl: "Phán đoán đạo đức và quyết định cuối cùng thuộc về con người." },
    { q: "Mô tả (Description) tốt gồm ba khía cạnh nào?", options: ["Nhanh, rẻ, tốt", "Sản phẩm, quy trình, cách tương tác", "Đầu vào, đầu ra, lỗi", "Ai, cái gì, khi nào"], a: 1, expl: "Mô tả đầu ra mong muốn, cách AI nên suy nghĩ, và cách tương tác." },
    { q: "Hallucination là gì?", options: ["AI từ chối trả lời", "AI tạo thông tin nghe thuyết phục nhưng sai sự thật", "AI trả lời chậm", "AI lặp lại câu hỏi"], a: 1, expl: "Luôn kiểm chứng số liệu, trích dẫn và tên riêng do AI tạo." },
    { q: "Theo Diligence, ai chịu trách nhiệm cuối cùng về sản phẩm có AI tham gia?", options: ["Công ty AI", "Người sử dụng AI", "Không ai cả", "Mô hình AI"], a: 1, expl: "Bạn ký tên vào kết quả — bạn chịu trách nhiệm kiểm tra." }
  ],
  cards: [
    { front: "4D là gì?", back: "Delegation (giao việc), Description (mô tả), Discernment (thẩm định), Diligence (trách nhiệm)." },
    { front: "Automation vs Augmentation?", back: "Làm thay một việc cụ thể vs cùng tư duy (brainstorm, phản biện, tinh chỉnh)." },
    { front: "3 bước trước khi giao việc cho AI?", back: "Hiểu vấn đề → hiểu công cụ → phân công người/AI." },
    { front: "Thẩm định kết quả AI ở 3 mức?", back: "Sản phẩm (đúng?) — Quy trình (hiểu đúng đề?) — Hiệu suất (cách hỏi hiệu quả?)." },
    { front: "Hallucination?", back: "AI tạo thông tin thuyết phục nhưng sai — phải kiểm chứng số liệu, trích dẫn, tên riêng." },
    { front: "3 mặt của Diligence?", back: "Cẩn trọng dữ liệu đầu vào — minh bạch — chịu trách nhiệm đầu ra." }
  ]
},

// ════════════════════════════════ 3. PROMPT ENGINEERING ════════════════════════════════
{
  id: "prompt-eng",
  emoji: "✍️",
  color: "#8B6FAE",
  title: "Prompt Engineering",
  subtitle: "Nghệ thuật viết câu lệnh để Claude cho kết quả chính xác, đúng định dạng, đúng ý.",
  level: "Trung cấp",
  duration: "≈ 50 phút",
  lessons: [
    {
      id: "pe-1", title: "Tư duy nền tảng: rõ ràng và trực tiếp", time: "9 phút", art: "prompt",
      sections: [
        { h: "Quy tắc số 1", p: [
          "Hãy coi Claude như một nhân viên mới cực kỳ thông minh nhưng bị mất trí nhớ về công ty bạn: không biết bối cảnh, không biết quy ước nội bộ, không biết «như mọi khi» nghĩa là gì. Mọi thứ Claude cần biết phải nằm trong prompt.",
          "Bài kiểm tra vàng: đưa prompt của bạn cho một đồng nghiệp không biết gì về nhiệm vụ — nếu họ bối rối, Claude cũng sẽ bối rối."
        ]},
        { h: "Cụ thể hoá mọi yêu cầu", p: [
          "So sánh: «Viết email cho khách hàng» — mơ hồ. «Viết email 150 từ cho khách hàng doanh nghiệp vừa khiếu nại giao hàng trễ; giọng xin lỗi chân thành nhưng chuyên nghiệp; kết thúc bằng đề xuất giảm 10% đơn sau» — Claude sẽ làm đúng ngay lần đầu.",
          "Hãy nói rõ: làm gì, cho ai, dài bao nhiêu, giọng văn nào, định dạng gì, và điều gì KHÔNG được làm."
        ]},
        { h: "Giao vai trò (role prompting)", p: [
          "Mở đầu bằng vai trò giúp Claude chọn đúng kiến thức và giọng điệu: «Bạn là luật sư hợp đồng 20 năm kinh nghiệm», «Bạn là biên tập viên báo kinh tế». Trong API, vai trò đặt ở system prompt."
        ]}
      ],
      takeaways: [
        "Mọi ngữ cảnh Claude cần phải nằm trong prompt — đừng giả định nó biết.",
        "Cụ thể: làm gì, cho ai, độ dài, giọng văn, định dạng, điều cấm.",
        "Giao vai trò để Claude chọn đúng kiến thức và giọng điệu."
      ]
    },
    {
      id: "pe-2", title: "Cấu trúc prompt với XML tags", time: "9 phút", art: "structure",
      sections: [
        { h: "Vì sao cần cấu trúc?", p: [
          "Khi prompt có nhiều thành phần (hướng dẫn, dữ liệu, ví dụ, tiêu chí), việc trộn lẫn khiến Claude nhầm phần nào là gì. Claude được huấn luyện đặc biệt để nhận diện thẻ XML — dùng chúng để phân vùng prompt."
        ]},
        { h: "Mẫu cấu trúc kinh điển", p: [
          "Một prompt phức tạp nên có thứ tự: (1) vai trò và nhiệm vụ, (2) dữ liệu trong thẻ như <document>...</document>, (3) hướng dẫn chi tiết từng bước trong <instructions>, (4) ví dụ trong <example>, (5) yêu cầu định dạng đầu ra. Đặt dữ liệu dài lên TRƯỚC câu hỏi — Claude xử lý tốt hơn khi câu hỏi nằm cuối."
        ]},
        { h: "Chia nhỏ thành các bước", p: [
          "Với nhiệm vụ phức tạp, liệt kê các bước đánh số: «1. Đọc hợp đồng. 2. Liệt kê các điều khoản rủi ro. 3. Với mỗi điều khoản, đề xuất sửa đổi. 4. Tổng hợp thành bảng.» Claude tuân thủ danh sách bước tốt hơn nhiều so với một đoạn văn dài."
        ]}
      ],
      takeaways: [
        "Dùng thẻ XML (<document>, <instructions>, <example>) để phân vùng prompt.",
        "Dữ liệu dài đặt trước, câu hỏi đặt cuối prompt.",
        "Nhiệm vụ phức tạp → liệt kê các bước đánh số."
      ]
    },
    {
      id: "pe-3", title: "Few-shot và Chain of Thought", time: "10 phút", art: "fewshot",
      sections: [
        { h: "Few-shot: dạy bằng ví dụ", p: [
          "Cho Claude 2–5 ví dụ mẫu (đầu vào → đầu ra mong muốn) là kỹ thuật mạnh nhất để kiểm soát định dạng và phong cách. Ví dụ truyền đạt được những sắc thái mà lời mô tả không thể.",
          "Chọn ví dụ đa dạng và bao phủ cả trường hợp khó (edge case). Bọc trong thẻ <examples> để Claude không nhầm ví dụ với dữ liệu thật."
        ]},
        { h: "Chain of Thought: cho Claude suy nghĩ", p: [
          "Với bài toán cần suy luận (toán, logic, phân tích nhiều bước), hãy yêu cầu Claude suy nghĩ trước khi trả lời: «Hãy suy nghĩ từng bước trong thẻ <thinking>, sau đó đưa đáp án trong thẻ <answer>».",
          "Suy nghĩ thành lời giúp Claude chính xác hơn đáng kể — nhưng đánh đổi là phản hồi dài và chậm hơn, nên chỉ dùng khi nhiệm vụ thực sự cần suy luận."
        ]},
        { h: "Extended thinking", p: [
          "Các mô hình Claude mới có chế độ extended thinking (suy nghĩ mở rộng) bật được qua API hoặc giao diện — mô hình tự suy luận nội bộ trước khi trả lời, rất hợp với toán, code và phân tích phức tạp."
        ]}
      ],
      takeaways: [
        "2–5 ví dụ mẫu là cách mạnh nhất kiểm soát định dạng và phong cách.",
        "Bài cần suy luận → yêu cầu suy nghĩ từng bước trước khi trả lời.",
        "Extended thinking hợp với toán, code, phân tích phức tạp."
      ]
    },
    {
      id: "pe-4", title: "Kiểm soát đầu ra: format và prefill", time: "9 phút", art: "format",
      sections: [
        { h: "Chỉ định định dạng rõ ràng", p: [
          "Muốn JSON? Hãy mô tả schema cụ thể kèm ví dụ. Muốn bảng? Nói rõ các cột. Muốn danh sách? Nói số mục tối đa. Claude tuân thủ định dạng rất tốt khi định dạng được mô tả chính xác."
        ]},
        { h: "Prefill: mớm lời mở đầu", p: [
          "Trong API, bạn có thể điền sẵn phần đầu câu trả lời của assistant. Ví dụ prefill bằng dấu « { » buộc Claude trả về JSON ngay lập tức, bỏ qua mọi lời dẫn «Đây là kết quả của bạn...». Prefill cũng dùng để ép Claude tiếp tục đúng một định dạng đã định."
        ]},
        { h: "Chống dài dòng và chống bịa", list: [
          "«Trả lời ngắn gọn, không lời dẫn, không giải thích thêm» — cắt phần thừa.",
          "«Nếu không chắc chắn hoặc thiếu thông tin, hãy nói: Tôi không tìm thấy thông tin này» — giảm hallucination rõ rệt.",
          "«Chỉ dùng thông tin trong <document>, trích nguyên văn câu liên quan trước khi kết luận» — ép bám sát tài liệu."
        ]}
      ],
      takeaways: [
        "Mô tả schema/định dạng cụ thể kèm ví dụ để nhận đúng đầu ra.",
        "Prefill phần đầu câu trả lời để ép định dạng (vd: « { » cho JSON).",
        "Cho phép Claude nói «không biết» để giảm bịa thông tin."
      ]
    },
    {
      id: "pe-5", title: "Quy trình lặp và đánh giá", time: "9 phút", art: "iterate",
      sections: [
        { h: "Prompt là sản phẩm cần kiểm thử", p: [
          "Đừng coi prompt là viết một lần. Quy trình chuyên nghiệp: viết phiên bản đầu → chạy thử với 5–10 trường hợp thực tế đa dạng → ghi lại các lỗi → sửa prompt nhắm vào từng lỗi → chạy lại. Lặp đến khi ổn định."
        ]},
        { h: "Thứ tự kỹ thuật nên thử", p: [
          "Khi kết quả chưa tốt, áp dụng theo thứ tự hiệu quả/chi phí: (1) làm yêu cầu rõ và cụ thể hơn, (2) thêm ví dụ mẫu, (3) yêu cầu suy nghĩ từng bước, (4) chia nhiệm vụ lớn thành chuỗi prompt nhỏ (prompt chaining), (5) đổi sang mô hình mạnh hơn."
        ]},
        { h: "Mẹo cuối: nhờ chính Claude", p: [
          "Claude rất giỏi cải thiện prompt. Dán prompt của bạn kèm kết quả chưa ưng ý và hỏi: «Vì sao kết quả chưa đạt và nên sửa prompt thế nào?» Anthropic Console còn có công cụ prompt improver tự động."
        ]}
      ],
      takeaways: [
        "Kiểm thử prompt với 5–10 trường hợp thực tế, sửa nhắm vào từng lỗi.",
        "Thứ tự: rõ hơn → thêm ví dụ → suy nghĩ từng bước → chia nhỏ → đổi model.",
        "Nhờ chính Claude chẩn đoán và cải thiện prompt của bạn."
      ]
    }
  ],
  quiz: [
    { q: "«Bài kiểm tra vàng» cho một prompt tốt là gì?", options: ["Prompt càng dài càng tốt", "Đồng nghiệp không biết gì về nhiệm vụ đọc vẫn hiểu và làm được", "Có nhiều từ khoá tiếng Anh", "Viết hoa các yêu cầu quan trọng"], a: 1, expl: "Nếu người ngoài đọc prompt mà bối rối thì Claude cũng bối rối." },
    { q: "Thẻ XML trong prompt dùng để làm gì?", options: ["Trang trí", "Phân vùng rõ các thành phần: dữ liệu, hướng dẫn, ví dụ", "Tăng tốc độ phản hồi", "Bắt buộc phải có trong mọi prompt"], a: 1, expl: "Claude được huấn luyện nhận diện thẻ XML để tách bạch các phần của prompt." },
    { q: "Dữ liệu dài (tài liệu) nên đặt ở đâu trong prompt?", options: ["Sau câu hỏi", "Trước câu hỏi, câu hỏi đặt cuối", "Ở giữa các ví dụ", "Không quan trọng"], a: 1, expl: "Claude xử lý tốt hơn khi tài liệu dài ở trước và câu hỏi nằm cuối." },
    { q: "Kỹ thuật mạnh nhất để kiểm soát định dạng và phong cách đầu ra?", options: ["Viết hoa yêu cầu", "Lặp lại yêu cầu 3 lần", "Cho 2–5 ví dụ mẫu (few-shot)", "Dùng từ «please»"], a: 2, expl: "Ví dụ truyền đạt sắc thái mà lời mô tả không thể." },
    { q: "Prefill « { » ở đầu câu trả lời assistant có tác dụng gì?", options: ["Tăng độ sáng tạo", "Ép Claude trả về JSON ngay, bỏ lời dẫn thừa", "Giảm chi phí", "Bật chế độ suy nghĩ"], a: 1, expl: "Prefill mớm sẵn đầu ra để ép định dạng mong muốn." },
    { q: "Cách hiệu quả để giảm hallucination?", options: ["Yêu cầu trả lời dài hơn", "Cho phép Claude nói «tôi không biết» và yêu cầu trích dẫn từ tài liệu", "Dùng nhiều emoji", "Hỏi bằng tiếng Anh"], a: 1, expl: "Cho đường lui «không biết» + ép bám sát tài liệu giảm bịa rõ rệt." },
    { q: "Khi nào nên dùng Chain of Thought?", options: ["Mọi prompt", "Nhiệm vụ cần suy luận nhiều bước (toán, logic, phân tích)", "Chỉ khi dịch thuật", "Khi muốn câu trả lời ngắn"], a: 1, expl: "Suy nghĩ từng bước tăng độ chính xác nhưng chậm hơn — dùng đúng chỗ." }
  ],
  cards: [
    { front: "Quy tắc số 1 của prompt?", back: "Coi Claude như nhân viên mới thông minh: mọi ngữ cảnh cần biết phải nằm trong prompt." },
    { front: "Thẻ XML dùng làm gì?", back: "Phân vùng prompt: <document> dữ liệu, <instructions> hướng dẫn, <example> ví dụ." },
    { front: "Few-shot prompting?", back: "Cho 2–5 ví dụ đầu vào → đầu ra mẫu để kiểm soát định dạng và phong cách." },
    { front: "Chain of Thought?", back: "Yêu cầu suy nghĩ từng bước trong <thinking> trước khi trả lời — tăng chính xác cho bài suy luận." },
    { front: "Prefill?", back: "Điền sẵn phần đầu câu trả lời (vd « { ») để ép định dạng, bỏ lời dẫn." },
    { front: "Vị trí tài liệu dài trong prompt?", back: "Đặt TRƯỚC, câu hỏi đặt CUỐI prompt." },
    { front: "Thứ tự cải thiện prompt?", back: "Rõ hơn → thêm ví dụ → CoT → chia nhỏ (chaining) → model mạnh hơn." },
    { front: "Chống hallucination?", back: "Cho phép nói «không biết» + yêu cầu trích nguyên văn từ tài liệu trước khi kết luận." }
  ]
},

// ════════════════════════════════ 4. CLAUDE CODE 101 ════════════════════════════════
{
  id: "claude-code",
  emoji: "⌨️",
  color: "#4A7A9B",
  title: "Claude Code 101",
  subtitle: "Agent lập trình trong terminal: từ cài đặt đến workflow chuyên nghiệp.",
  level: "Trung cấp",
  duration: "≈ 50 phút",
  lessons: [
    {
      id: "cc-1", title: "Claude Code là gì và cài đặt", time: "9 phút", art: "terminal",
      sections: [
        { h: "Một agent, không phải autocomplete", p: [
          "Claude Code là công cụ dòng lệnh (CLI) biến Claude thành một agent lập trình: nó tự đọc codebase của bạn, lập kế hoạch, sửa nhiều file, chạy lệnh, chạy test, và commit — tất cả trong terminal, dưới sự giám sát của bạn.",
          "Khác với autocomplete trong editor, Claude Code làm việc theo NHIỆM VỤ: «sửa bug đăng nhập», «thêm tính năng xuất CSV», «viết test cho module thanh toán»."
        ]},
        { h: "Cài đặt trong 2 phút", list: [
          "Cài qua npm: npm install -g @anthropic-ai/claude-code",
          "Mở terminal tại thư mục dự án, gõ: claude",
          "Đăng nhập bằng tài khoản Claude (Pro/Max) hoặc API key.",
          "Ngoài terminal, Claude Code còn có trên web (claude.ai/code), desktop app và extension VS Code/JetBrains."
        ]},
        { h: "Phiên làm việc đầu tiên", p: [
          "Hãy bắt đầu bằng việc hỏi về codebase: «dự án này có cấu trúc thế nào?», «luồng đăng nhập nằm ở đâu?». Claude Code tự tìm file liên quan bằng các công cụ tìm kiếm — bạn không cần chỉ đường. Đây là cách an toàn để làm quen trước khi cho nó sửa code."
        ]}
      ],
      takeaways: [
        "Claude Code = agent lập trình trong terminal, làm việc theo nhiệm vụ.",
        "Cài: npm install -g @anthropic-ai/claude-code, rồi gõ claude trong thư mục dự án.",
        "Bắt đầu bằng cách hỏi về codebase trước khi nhờ sửa code."
      ]
    },
    {
      id: "cc-2", title: "Workflow hiệu quả: Khám phá → Kế hoạch → Code → Commit", time: "10 phút", art: "workflow",
      sections: [
        { h: "Quy trình 4 bước cho nhiệm vụ lớn", list: [
          "Khám phá: yêu cầu Claude đọc các file liên quan TRƯỚC, chưa viết code.",
          "Kế hoạch: bật Plan Mode (Shift+Tab) để Claude đề xuất kế hoạch — bạn duyệt trước khi nó động vào code.",
          "Code: Claude thực hiện theo kế hoạch, tự chạy test để kiểm chứng.",
          "Commit: yêu cầu Claude commit với message rõ ràng, tạo PR nếu cần."
        ]},
        { h: "Các chế độ quyền (permission modes)", p: [
          "Mặc định Claude Code hỏi trước khi sửa file hay chạy lệnh. Bạn có thể duyệt từng lần, cho phép luôn một loại lệnh, hoặc bật auto-accept khi đã tin tưởng. Nguyên tắc: nới quyền dần theo độ tin cậy, giữ kiểm soát với các lệnh nguy hiểm."
        ]},
        { h: "Mẹo tăng chất lượng", list: [
          "Yêu cầu cụ thể như giao việc cho người: tiêu chí hoàn thành, file liên quan, ràng buộc.",
          "Nhiệm vụ lớn → chia nhỏ thành nhiều phiên tập trung.",
          "Cho Claude cách tự kiểm chứng (test, lint, chạy app) — chất lượng tăng vọt.",
          "Dùng Esc để ngắt và chỉnh hướng ngay khi thấy đi sai đường."
        ]}
      ],
      takeaways: [
        "Quy trình: Khám phá → Kế hoạch (Plan Mode) → Code → Commit.",
        "Nới quyền dần theo độ tin cậy; duyệt kế hoạch trước khi sửa code.",
        "Cho Claude cách tự kiểm chứng (test/lint) để tăng chất lượng."
      ]
    },
    {
      id: "cc-3", title: "CLAUDE.md và quản lý ngữ cảnh", time: "9 phút", art: "claudemd",
      sections: [
        { h: "CLAUDE.md — bộ nhớ của dự án", p: [
          "CLAUDE.md là file đặc biệt được tự động nạp vào đầu mỗi phiên. Đặt vào đó: lệnh build/test thường dùng, quy ước code, cấu trúc dự án, những điều cần tránh. Chạy lệnh /init để Claude tự khảo sát dự án và tạo bản đầu tiên.",
          "Trong khi làm việc, gõ # trước một ghi chú để Claude lưu nó vào CLAUDE.md — ví dụ: «# luôn dùng pnpm thay vì npm»."
        ]},
        { h: "Context window là tài nguyên quý", p: [
          "Mỗi phiên có giới hạn ngữ cảnh. Khi cuộc trò chuyện quá dài, chất lượng giảm. Các lệnh quan trọng: /clear — xoá sạch bắt đầu nhiệm vụ mới (dùng thường xuyên!); /compact — nén lịch sử giữ ý chính; /resume — mở lại phiên cũ."
        ]},
        { h: "Cấp bậc của CLAUDE.md", list: [
          "~/.claude/CLAUDE.md — quy ước cá nhân, áp dụng mọi dự án.",
          "<dự án>/CLAUDE.md — quy ước của dự án, commit chung cho cả team.",
          "Thư mục con/CLAUDE.md — quy ước riêng cho từng phần lớn của repo."
        ]}
      ],
      takeaways: [
        "CLAUDE.md tự nạp mỗi phiên: lệnh thường dùng, quy ước, điều cần tránh.",
        "/init tạo CLAUDE.md; gõ # để thêm ghi nhớ nhanh.",
        "/clear giữa các nhiệm vụ khác nhau để giữ ngữ cảnh sạch."
      ]
    },
    {
      id: "cc-4", title: "Tuỳ biến: slash commands, hooks, subagents", time: "10 phút", art: "custom",
      sections: [
        { h: "Slash commands — lệnh tắt của riêng bạn", p: [
          "Tạo file markdown trong .claude/commands/ — mỗi file thành một lệnh /tên-lệnh. Ví dụ file review.md chứa quy trình review code của team → gõ /review là Claude làm đúng quy trình đó. Dùng $ARGUMENTS để nhận tham số."
        ]},
        { h: "Hooks — tự động hoá đảm bảo", p: [
          "Hooks là script chạy tự động tại các sự kiện (trước/sau khi dùng tool, khi kết thúc phiên...). Ví dụ: hook tự chạy formatter sau mỗi lần Claude sửa file — đảm bảo 100% thay vì nhờ Claude «nhớ» format. Quy tắc: việc BẮT BUỘC phải xảy ra → dùng hook, đừng dựa vào lời nhắc."
        ]},
        { h: "Subagents và skills", p: [
          "Subagents là các agent con chuyên biệt (trong .claude/agents/) với prompt và quyền riêng — ví dụ agent chuyên review bảo mật. Claude tự giao việc phù hợp cho chúng và giữ ngữ cảnh chính sạch sẽ.",
          "Skills (trong .claude/skills/) là kiến thức chuyên môn đóng gói để Claude tự nạp khi gặp việc liên quan — học sâu ở khoá Agent Skills."
        ]}
      ],
      takeaways: [
        "Slash command = file markdown trong .claude/commands/ thành lệnh /tên.",
        "Việc bắt buộc phải xảy ra → dùng hooks, không dựa vào lời nhắc.",
        "Subagents tách việc chuyên biệt, giữ ngữ cảnh chính sạch."
      ]
    },
    {
      id: "cc-5", title: "MCP, GitHub và chế độ headless", time: "9 phút", art: "github",
      sections: [
        { h: "Mở rộng bằng MCP servers", p: [
          "Lệnh claude mcp add kết nối Claude Code với các MCP server: database (đọc schema, chạy query), trình duyệt (test UI), Figma, Slack, hệ thống issue... Claude khi đó dùng được các công cụ này như công cụ có sẵn."
        ]},
        { h: "Làm việc với GitHub", list: [
          "Claude Code dùng gh CLI: tạo PR, đọc issue, trả lời review comment.",
          "Cài GitHub Actions của Claude: tag @claude trong issue/PR để Claude tự sửa.",
          "Quy trình mạnh: «đọc issue #123, sửa, chạy test, tạo PR» — một câu lệnh."
        ]},
        { h: "Headless mode — tự động hoá", p: [
          "Chạy claude -p \"câu lệnh\" để dùng Claude Code không tương tác trong script/CI: tự phân loại issue, lint theo quy ước riêng, sinh changelog... Đây là nền tảng để đưa Claude Code vào pipeline tự động của team."
        ]}
      ],
      takeaways: [
        "claude mcp add nối Claude Code với database, browser, Figma...",
        "Tích hợp GitHub: tạo PR, sửa issue, phản hồi review tự động.",
        "claude -p chạy headless trong script và CI."
      ]
    }
  ],
  quiz: [
    { q: "Claude Code khác autocomplete trong editor thế nào?", options: ["Chỉ gợi ý từng dòng code", "Là agent làm việc theo nhiệm vụ: đọc codebase, sửa nhiều file, chạy test, commit", "Chỉ dùng được online", "Chỉ hỗ trợ Python"], a: 1, expl: "Claude Code là agent hoàn thành nhiệm vụ trọn vẹn dưới sự giám sát của bạn." },
    { q: "Plan Mode dùng để làm gì?", options: ["Tăng tốc độ code", "Claude đề xuất kế hoạch để bạn duyệt trước khi sửa code", "Tự động commit", "Xoá lịch sử chat"], a: 1, expl: "Bật Plan Mode (Shift+Tab) cho nhiệm vụ lớn để duyệt kế hoạch trước." },
    { q: "File CLAUDE.md có vai trò gì?", options: ["Chứa API key", "Tự động nạp đầu mỗi phiên: lệnh thường dùng, quy ước, cấu trúc dự án", "Là file log", "Chứa code mẫu"], a: 1, expl: "CLAUDE.md là bộ nhớ dự án; tạo bằng /init, thêm nhanh bằng #." },
    { q: "Khi chuyển sang nhiệm vụ hoàn toàn mới, nên dùng lệnh nào?", options: ["/help", "/clear", "/exit", "/model"], a: 1, expl: "/clear xoá ngữ cảnh cũ, giữ phiên sạch và chất lượng cao." },
    { q: "Khi một việc BẮT BUỘC phải xảy ra (vd: format code sau mỗi lần sửa), nên dùng gì?", options: ["Nhắc Claude trong prompt", "Hooks — script chạy tự động tại sự kiện", "Viết vào README", "Hỏi lại mỗi lần"], a: 1, expl: "Hooks đảm bảo 100%; lời nhắc trong prompt có thể bị bỏ sót." },
    { q: "Lệnh nào chạy Claude Code không tương tác trong script/CI?", options: ["claude --fast", "claude -p \"câu lệnh\"", "claude run", "claude auto"], a: 1, expl: "Headless mode: claude -p dùng cho tự động hoá pipeline." },
    { q: "Slash command tuỳ chỉnh được tạo bằng cách nào?", options: ["Viết plugin C++", "Tạo file markdown trong .claude/commands/", "Đăng ký trên website", "Sửa source code Claude"], a: 1, expl: "Mỗi file .md trong .claude/commands/ trở thành một lệnh /tên-file." }
  ],
  cards: [
    { front: "Cài Claude Code?", back: "npm install -g @anthropic-ai/claude-code → gõ claude trong thư mục dự án." },
    { front: "Quy trình 4 bước cho nhiệm vụ lớn?", back: "Khám phá → Kế hoạch (Plan Mode) → Code → Commit." },
    { front: "CLAUDE.md?", back: "File tự nạp mỗi phiên: lệnh build/test, quy ước code, điều cần tránh. Tạo bằng /init." },
    { front: "/clear vs /compact?", back: "/clear xoá sạch ngữ cảnh (nhiệm vụ mới); /compact nén lịch sử giữ ý chính." },
    { front: "Hooks dùng khi nào?", back: "Khi một việc BẮT BUỘC xảy ra tại sự kiện (vd format sau khi sửa file) — đảm bảo 100%." },
    { front: "Subagents?", back: "Agent con chuyên biệt trong .claude/agents/ với prompt và quyền riêng, giữ ngữ cảnh chính sạch." },
    { front: "Headless mode?", back: "claude -p \"lệnh\" — chạy không tương tác trong script/CI." },
    { front: "Kết nối tool ngoài cho Claude Code?", back: "claude mcp add — nối database, browser, Figma, Slack qua MCP." }
  ]
},

// ════════════════════════════════ 5. CLAUDE PLATFORM 101 (API) ════════════════════════════════
{
  id: "claude-api",
  emoji: "🔌",
  color: "#B8860B",
  title: "Claude Platform 101",
  subtitle: "Xây dựng ứng dụng trên Claude API: từ request đầu tiên đến tool use và tối ưu chi phí.",
  level: "Trung cấp",
  duration: "≈ 50 phút",
  lessons: [
    {
      id: "api-1", title: "Request đầu tiên tới Claude API", time: "9 phút", art: "api",
      sections: [
        { h: "Ba thành phần bắt buộc", p: [
          "Mọi request tới endpoint /v1/messages cần: model (vd claude-sonnet-4-6), max_tokens (giới hạn độ dài trả lời), và messages (danh sách tin nhắn). Kèm theo là API key lấy từ Anthropic Console (console.anthropic.com)."
        ]},
        { h: "Ví dụ với Python SDK", p: [
          "import anthropic — client = anthropic.Anthropic() — rồi gọi client.messages.create(model=\"claude-sonnet-4-6\", max_tokens=1024, messages=[{\"role\": \"user\", \"content\": \"Xin chào Claude!\"}]). Kết quả nằm trong response.content[0].text.",
          "SDK chính thức có cho Python và TypeScript; các ngôn ngữ khác gọi REST API trực tiếp với header x-api-key và anthropic-version."
        ]},
        { h: "Bảo mật API key", list: [
          "Không bao giờ hardcode key trong code hoặc commit lên git.",
          "Dùng biến môi trường ANTHROPIC_API_KEY.",
          "Gọi API từ backend, không bao giờ từ frontend/app người dùng."
        ]}
      ],
      takeaways: [
        "Request cần: model + max_tokens + messages, kèm API key.",
        "SDK Python/TypeScript chính thức; kết quả ở response.content[0].text.",
        "API key để trong biến môi trường, chỉ gọi từ backend."
      ]
    },
    {
      id: "api-2", title: "Messages và context window", time: "10 phút", art: "context",
      sections: [
        { h: "API là stateless — không nhớ gì", p: [
          "Khác với app claude.ai, API không lưu lịch sử. Mỗi request phải gửi TOÀN BỘ cuộc hội thoại: mảng messages xen kẽ role user và assistant. Muốn chat nhiều lượt, ứng dụng của bạn tự nối các tin nhắn cũ vào mỗi request mới."
        ]},
        { h: "Context window — giới hạn tầm nhìn", p: [
          "Context window là tổng lượng token (đơn vị ~3/4 từ tiếng Anh) mà mô hình nhìn thấy trong một request: gồm system prompt + toàn bộ messages + câu trả lời đang sinh ra. Claude có context window tới 200K token (một số mô hình tới 1 triệu) — tương đương hàng trăm trang.",
          "Hội thoại càng dài, chi phí mỗi request càng tăng vì gửi lại toàn bộ lịch sử. Chiến lược: tóm tắt bớt các lượt cũ, hoặc chỉ giữ các lượt liên quan."
        ]},
        { h: "Token và chi phí", p: [
          "Bạn trả tiền theo token đầu vào (input) và token đầu ra (output) — giá output cao hơn. Endpoint count_tokens giúp đếm trước. Chọn model nhỏ (Haiku) cho việc đơn giản là cách tiết kiệm lớn nhất."
        ]}
      ],
      takeaways: [
        "API stateless: mỗi request gửi lại toàn bộ hội thoại.",
        "Context window = system + messages + output, tính bằng token.",
        "Trả tiền theo token in/out; chọn đúng cỡ model để tiết kiệm."
      ]
    },
    {
      id: "api-3", title: "System prompt và các tham số", time: "9 phút", art: "params",
      sections: [
        { h: "System prompt — nhân cách của ứng dụng", p: [
          "Tham số system (tách riêng khỏi messages) định nghĩa vai trò, giọng điệu, quy tắc và ranh giới cho mọi lượt trả lời: «Bạn là trợ lý chăm sóc khách hàng của FPT Shop, chỉ trả lời về sản phẩm, luôn dùng tiếng Việt lịch sự». Đây là nơi đặt phần lớn prompt engineering của ứng dụng."
        ]},
        { h: "Tham số đáng biết", list: [
          "temperature (0–1): thấp → ổn định nhất quán (phân loại, trích xuất); cao → đa dạng sáng tạo (viết lách).",
          "stop_sequences: chuỗi khiến mô hình dừng sinh ngay khi gặp.",
          "max_tokens: trần độ dài trả lời — cũng là van an toàn chi phí."
        ]},
        { h: "Vision — gửi ảnh cho Claude", p: [
          "Trong content của message, bạn có thể gửi khối image (base64 hoặc URL) kèm text. Claude đọc được biểu đồ, hoá đơn, ảnh chụp màn hình, bản vẽ — mở ra các ứng dụng trích xuất dữ liệu từ ảnh."
        ]}
      ],
      takeaways: [
        "System prompt định nghĩa vai trò và quy tắc cho toàn ứng dụng.",
        "temperature thấp cho việc cần nhất quán, cao cho sáng tạo.",
        "Claude đọc được ảnh (biểu đồ, hoá đơn, screenshot) qua khối image."
      ]
    },
    {
      id: "api-4", title: "Tool use — cho Claude dùng công cụ", time: "10 phút", art: "tooluse",
      sections: [
        { h: "Nguyên lý", p: [
          "Tool use cho phép Claude gọi các hàm CỦA BẠN: tra database, gọi API thời tiết, gửi email... Bạn khai báo danh sách tools (tên, mô tả, tham số theo JSON Schema) trong request. Claude không tự chạy hàm — nó trả về yêu cầu gọi hàm, code của bạn chạy rồi gửi kết quả lại."
        ]},
        { h: "Vòng lặp tool use", list: [
          "1. Gửi request kèm danh sách tools.",
          "2. Claude trả về stop_reason: tool_use kèm tên tool và tham số.",
          "3. Code của bạn thực thi hàm tương ứng.",
          "4. Gửi kết quả lại trong khối tool_result.",
          "5. Claude dùng kết quả để trả lời, hoặc gọi tool tiếp — lặp đến khi xong."
        ]},
        { h: "Đây chính là nền tảng của agent", p: [
          "Một agent = mô hình + bộ tools + vòng lặp trên. Chất lượng mô tả tool (description) quyết định Claude chọn tool đúng hay sai — hãy viết mô tả tool kỹ như viết tài liệu cho đồng nghiệp."
        ]}
      ],
      takeaways: [
        "Tool use: Claude yêu cầu gọi hàm, code của bạn thực thi và trả kết quả.",
        "Vòng lặp: tools → tool_use → thực thi → tool_result → trả lời.",
        "Agent = mô hình + tools + vòng lặp; mô tả tool tốt là chìa khoá."
      ]
    },
    {
      id: "api-5", title: "Streaming, caching và tối ưu chi phí", time: "9 phút", art: "optimize",
      sections: [
        { h: "Streaming — phản hồi tức thì", p: [
          "Bật stream=true để nhận câu trả lời từng mảnh ngay khi được sinh ra, thay vì đợi trọn vẹn. Bắt buộc cho trải nghiệm chat tốt: người dùng thấy chữ chạy sau vài trăm mili giây."
        ]},
        { h: "Prompt caching — giảm tới 90% chi phí", p: [
          "Nếu request lặp lại phần đầu giống nhau (system prompt dài, tài liệu lớn, danh sách tools), đánh dấu cache_control để Anthropic cache phần đó. Các request sau đọc từ cache: rẻ hơn tới 90% và nhanh hơn rõ rệt. Đây là tối ưu quan trọng nhất cho ứng dụng có ngữ cảnh lớn."
        ]},
        { h: "Batch API và chọn model", list: [
          "Message Batches: gửi hàng loạt request xử lý trong 24h, giảm 50% chi phí — hợp với việc nền (phân loại, tóm tắt hàng loạt).",
          "Quy tắc chọn model: thử Haiku trước cho việc đơn giản, nâng lên Sonnet/Opus khi chất lượng chưa đủ.",
          "Đo lường thực tế: log token usage từng request để biết tiền đi đâu."
        ]}
      ],
      takeaways: [
        "Streaming bắt buộc cho trải nghiệm chat thời gian thực.",
        "Prompt caching giảm tới 90% chi phí phần ngữ cảnh lặp lại.",
        "Batch API giảm 50% cho việc nền; chọn model nhỏ nhất đủ tốt."
      ]
    }
  ],
  quiz: [
    { q: "Ba tham số bắt buộc của request /v1/messages?", options: ["model, max_tokens, messages", "key, prompt, output", "system, user, assistant", "model, temperature, top_p"], a: 0, expl: "model + max_tokens + messages là bộ tối thiểu." },
    { q: "API «stateless» nghĩa là gì?", options: ["API không cần key", "Mỗi request phải gửi lại toàn bộ lịch sử hội thoại", "API không trả lời", "Chỉ chat được một lượt"], a: 1, expl: "API không lưu lịch sử — ứng dụng của bạn tự nối các lượt cũ vào." },
    { q: "Context window bao gồm những gì?", options: ["Chỉ câu hỏi cuối", "System prompt + toàn bộ messages + câu trả lời đang sinh", "Chỉ system prompt", "Chỉ output"], a: 1, expl: "Tất cả những gì mô hình «nhìn thấy» trong một request đều tính token." },
    { q: "Trong tool use, ai là người thực thi hàm?", options: ["Claude tự chạy", "Anthropic chạy trên server", "Code của bạn chạy rồi gửi kết quả lại", "Không ai cả"], a: 2, expl: "Claude chỉ yêu cầu gọi hàm kèm tham số; bạn thực thi và trả tool_result." },
    { q: "Prompt caching có lợi gì?", options: ["Tăng độ sáng tạo", "Giảm tới 90% chi phí phần ngữ cảnh lặp lại và nhanh hơn", "Tăng context window", "Miễn phí hoàn toàn"], a: 1, expl: "Cache phần đầu giống nhau (system, tài liệu, tools) giữa các request." },
    { q: "temperature thấp phù hợp với việc gì?", options: ["Viết truyện sáng tạo", "Phân loại, trích xuất dữ liệu cần nhất quán", "Brainstorm", "Làm thơ"], a: 1, expl: "Temperature thấp → đầu ra ổn định, nhất quán." },
    { q: "Batch API phù hợp khi nào?", options: ["Chat thời gian thực", "Xử lý hàng loạt việc nền không gấp, tiết kiệm 50%", "Gọi tool", "Gửi ảnh"], a: 1, expl: "Batch xử lý trong 24h, giảm 50% chi phí — hợp việc nền số lượng lớn." }
  ],
  cards: [
    { front: "3 tham số bắt buộc của /v1/messages?", back: "model, max_tokens, messages (+ API key trong header)." },
    { front: "API stateless nghĩa là?", back: "Không lưu lịch sử — mỗi request gửi lại toàn bộ hội thoại." },
    { front: "Context window?", back: "Tổng token mô hình thấy: system + messages + output. Claude: 200K+ token." },
    { front: "Vòng lặp tool use?", back: "Khai báo tools → Claude trả tool_use → bạn thực thi → gửi tool_result → Claude trả lời/gọi tiếp." },
    { front: "Prompt caching?", back: "Cache phần đầu lặp lại (system, tài liệu, tools) — rẻ hơn tới 90%, nhanh hơn." },
    { front: "Batch API?", back: "Xử lý hàng loạt trong 24h, giảm 50% chi phí — cho việc nền." },
    { front: "temperature?", back: "0 → nhất quán (phân loại, trích xuất); 1 → đa dạng (sáng tạo)." },
    { front: "Agent là gì (theo API)?", back: "Mô hình + bộ tools + vòng lặp tool use đến khi hoàn thành nhiệm vụ." }
  ]
},

// ════════════════════════════════ 6. MCP ════════════════════════════════
{
  id: "mcp",
  emoji: "🔗",
  color: "#5B7FA6",
  title: "Model Context Protocol (MCP)",
  subtitle: "Chuẩn mở kết nối AI với dữ liệu và công cụ — «cổng USB-C» của thế giới AI.",
  level: "Trung cấp",
  duration: "≈ 40 phút",
  lessons: [
    {
      id: "mcp-1", title: "MCP là gì và vì sao cần nó?", time: "9 phút", art: "mcp",
      sections: [
        { h: "Bài toán M×N", p: [
          "Trước MCP: mỗi ứng dụng AI (Claude, IDE, chatbot...) muốn kết nối mỗi nguồn dữ liệu (database, Slack, Drive...) phải viết tích hợp riêng — M ứng dụng × N nguồn = M×N tích hợp trùng lặp.",
          "MCP (Model Context Protocol) — chuẩn mở do Anthropic khởi xướng — giải quyết bằng một giao thức chung: viết MỘT MCP server cho nguồn dữ liệu, MỌI ứng dụng AI hỗ trợ MCP đều dùng được. Như cổng USB-C: một chuẩn cắm cho tất cả."
        ]},
        { h: "Kiến trúc ba thành phần", list: [
          "Host: ứng dụng AI người dùng tương tác (Claude Desktop, Claude Code, IDE...).",
          "Client: thành phần trong host, giữ kết nối 1-1 với từng server.",
          "Server: chương trình cung cấp khả năng (đọc database, gọi API, đọc file...) theo chuẩn MCP."
        ]},
        { h: "Cách giao tiếp", p: [
          "Client và server nói chuyện bằng JSON-RPC qua hai kênh chính: stdio (server chạy cùng máy, giao tiếp qua luồng vào/ra chuẩn) hoặc HTTP (server từ xa). Người dùng cuối không cần biết chi tiết này — chỉ cần «cắm» server vào host."
        ]}
      ],
      takeaways: [
        "MCP = chuẩn mở kết nối AI với dữ liệu/công cụ, giải bài toán M×N.",
        "Ba thành phần: Host (app AI) — Client (kết nối) — Server (khả năng).",
        "Giao tiếp JSON-RPC qua stdio (cùng máy) hoặc HTTP (từ xa)."
      ]
    },
    {
      id: "mcp-2", title: "Ba primitive: Tools, Resources, Prompts", time: "9 phút", art: "primitives",
      sections: [
        { h: "Tools — hành động", p: [
          "Tools là các hàm mà MÔ HÌNH chủ động quyết định gọi để thực hiện hành động: tìm kiếm, tạo bản ghi, gửi tin nhắn. Mỗi tool có tên, mô tả và schema tham số. Đây là primitive được dùng nhiều nhất."
        ]},
        { h: "Resources — dữ liệu", p: [
          "Resources là dữ liệu chỉ-đọc mà ỨNG DỤNG quyết định đưa vào ngữ cảnh: nội dung file, bản ghi database, tài liệu. Mỗi resource có URI riêng (vd file:///bao-cao.pdf). Resources không gây tác dụng phụ — chỉ cung cấp thông tin."
        ]},
        { h: "Prompts — mẫu tương tác", p: [
          "Prompts là các mẫu câu lệnh viết sẵn mà NGƯỜI DÙNG chủ động chọn (như slash command): «/tóm-tắt-cuộc-họp», «/review-code». Server đóng gói sẵn best practice để người dùng gọi một chạm.",
          "Ghi nhớ ai điều khiển: Tools — mô hình quyết; Resources — ứng dụng quyết; Prompts — người dùng quyết."
        ]}
      ],
      takeaways: [
        "Tools: hành động, do mô hình chủ động gọi.",
        "Resources: dữ liệu chỉ-đọc, do ứng dụng đưa vào ngữ cảnh.",
        "Prompts: mẫu lệnh sẵn, do người dùng chọn."
      ]
    },
    {
      id: "mcp-3", title: "Xây MCP server đầu tiên", time: "10 phút", art: "server",
      sections: [
        { h: "SDK chính thức", p: [
          "Anthropic cung cấp SDK Python, TypeScript và nhiều ngôn ngữ khác. Với Python, FastMCP giúp tạo server chỉ vài dòng: from mcp.server.fastmcp import FastMCP — mcp = FastMCP(\"weather\") — rồi dùng decorator @mcp.tool() trên một hàm Python bình thường: docstring thành mô tả, type hints thành schema tham số."
        ]},
        { h: "Ví dụ tool dự báo thời tiết", p: [
          "@mcp.tool() def get_weather(city: str) -> str: \"Lấy thời tiết hiện tại của một thành phố\" — bên trong gọi API thời tiết và trả chuỗi kết quả. Chạy mcp.run() là xong một server stdio hoàn chỉnh.",
          "Mô tả tool là phần QUAN TRỌNG NHẤT: mô hình chỉ đọc tên + mô tả + schema để quyết định khi nào gọi. Viết rõ tool làm gì, khi nào dùng, tham số nghĩa là gì."
        ]},
        { h: "Kiểm thử bằng MCP Inspector", p: [
          "Chạy npx @modelcontextprotocol/inspector để mở giao diện web kiểm thử server: xem danh sách tools, gọi thử với tham số, đọc kết quả — debug trước khi cắm vào Claude."
        ]}
      ],
      takeaways: [
        "FastMCP (Python): decorator @mcp.tool() biến hàm thường thành tool.",
        "Mô tả tool là phần quan trọng nhất — mô hình dựa vào nó để chọn tool.",
        "Kiểm thử bằng MCP Inspector trước khi cắm vào Claude."
      ]
    },
    {
      id: "mcp-4", title: "Kết nối và hệ sinh thái", time: "9 phút", art: "connect",
      sections: [
        { h: "Cắm server vào Claude", list: [
          "Claude Desktop: thêm server vào file claude_desktop_config.json hoặc qua mục Connectors trong Settings.",
          "Claude Code: lệnh claude mcp add <tên> <lệnh chạy server>.",
          "Claude.ai web/mobile: bật Connectors có sẵn (Drive, Gmail, Notion...) — chính là các MCP server do các công ty cung cấp."
        ]},
        { h: "Hệ sinh thái bùng nổ", p: [
          "Hàng nghìn MCP server cộng đồng đã có sẵn: GitHub, Slack, PostgreSQL, Puppeteer (điều khiển trình duyệt), Filesystem, Google Maps... MCP cũng được các hãng lớn ngoài Anthropic áp dụng, trở thành chuẩn de facto kết nối AI với công cụ."
        ]},
        { h: "Lưu ý bảo mật", list: [
          "Chỉ cài server từ nguồn tin cậy — server có quyền làm những gì nó khai báo.",
          "Nguyên tắc quyền tối thiểu: cấp token chỉ-đọc nếu chỉ cần đọc.",
          "Cẩn trọng prompt injection: dữ liệu độc hại từ bên ngoài có thể chứa lệnh đánh lừa mô hình — duyệt kỹ các hành động ghi/xoá."
        ]}
      ],
      takeaways: [
        "Cắm server: config JSON (Desktop), claude mcp add (Code), Connectors (web).",
        "Hệ sinh thái hàng nghìn server sẵn có: GitHub, Slack, database, browser...",
        "Chỉ cài server tin cậy, cấp quyền tối thiểu, cảnh giác prompt injection."
      ]
    }
  ],
  quiz: [
    { q: "MCP giải quyết bài toán gì?", options: ["Tăng tốc độ mô hình", "M ứng dụng × N nguồn dữ liệu = M×N tích hợp trùng lặp", "Giảm giá API", "Thay thế HTTP"], a: 1, expl: "Một chuẩn chung: viết một server, mọi app AI hỗ trợ MCP dùng được." },
    { q: "Ba thành phần kiến trúc MCP?", options: ["Model, Chat, Prompt", "Host, Client, Server", "Input, Process, Output", "API, SDK, CLI"], a: 1, expl: "Host (app AI) chứa Client giữ kết nối 1-1 với từng Server." },
    { q: "Primitive nào do MÔ HÌNH chủ động quyết định gọi?", options: ["Resources", "Prompts", "Tools", "Schemas"], a: 2, expl: "Tools — mô hình quyết; Resources — ứng dụng; Prompts — người dùng." },
    { q: "Trong FastMCP (Python), cách tạo một tool?", options: ["Viết file XML", "Decorator @mcp.tool() trên hàm Python có docstring và type hints", "Đăng ký trên website Anthropic", "Viết bằng C"], a: 1, expl: "Docstring thành mô tả, type hints thành schema tham số." },
    { q: "Phần quan trọng nhất của một tool là gì?", options: ["Tên ngắn", "Mô tả rõ ràng (mô hình dựa vào đó để quyết định gọi)", "Code tối ưu", "Logo đẹp"], a: 1, expl: "Mô hình chỉ thấy tên + mô tả + schema khi quyết định dùng tool." },
    { q: "Công cụ nào để kiểm thử MCP server?", options: ["MCP Inspector", "Postman", "Chrome DevTools", "JUnit"], a: 0, expl: "npx @modelcontextprotocol/inspector mở giao diện web test tools." }
  ],
  cards: [
    { front: "MCP là gì?", back: "Chuẩn mở kết nối AI với dữ liệu/công cụ — như «USB-C cho AI», giải bài toán M×N." },
    { front: "Kiến trúc MCP?", back: "Host (app AI) → Client (kết nối 1-1) → Server (cung cấp khả năng). JSON-RPC qua stdio/HTTP." },
    { front: "3 primitives và ai điều khiển?", back: "Tools — mô hình quyết; Resources — ứng dụng quyết; Prompts — người dùng quyết." },
    { front: "Tạo tool với FastMCP?", back: "@mcp.tool() trên hàm Python; docstring = mô tả, type hints = schema." },
    { front: "Cắm MCP server vào Claude Code?", back: "claude mcp add <tên> <lệnh chạy server>." },
    { front: "MCP Inspector?", back: "npx @modelcontextprotocol/inspector — giao diện web test tools của server." },
    { front: "Bảo mật MCP?", back: "Server tin cậy, quyền tối thiểu, cảnh giác prompt injection từ dữ liệu ngoài." }
  ]
},

// ════════════════════════════════ 7. AGENT SKILLS ════════════════════════════════
{
  id: "agent-skills",
  emoji: "🎒",
  color: "#A0566B",
  title: "Agent Skills",
  subtitle: "Đóng gói chuyên môn thành kỹ năng để Claude tự áp dụng đúng việc, đúng lúc.",
  level: "Nâng cao",
  duration: "≈ 40 phút",
  lessons: [
    {
      id: "as-1", title: "Skill là gì?", time: "9 phút", art: "skillfolder",
      sections: [
        { h: "Chuyên môn đóng gói", p: [
          "Skill là một thư mục chứa file SKILL.md (hướng dẫn) và tuỳ chọn thêm script, template, tài liệu tham khảo. Khi Claude gặp nhiệm vụ liên quan, nó TỰ ĐỘNG nạp skill và làm theo — bạn không cần nhắc lại quy trình mỗi lần.",
          "Ví dụ: skill «báo cáo tài chính» chứa quy trình phân tích, mẫu báo cáo chuẩn của công ty và script tính toán — từ đó mọi yêu cầu về báo cáo tài chính đều được làm đúng chuẩn."
        ]},
        { h: "Progressive disclosure — bí quyết hiệu quả", p: [
          "Claude không nạp toàn bộ skill vào ngữ cảnh. Bình thường nó chỉ thấy tên + mô tả (vài chục token). Khi nhiệm vụ khớp, nó mới đọc thân SKILL.md. Các file tham khảo sâu hơn chỉ đọc khi cần đến. Nhờ vậy bạn có thể cài hàng chục skill mà không tốn ngữ cảnh."
        ]},
        { h: "Skill vs Prompt vs MCP", list: [
          "Prompt: hướng dẫn một lần cho một cuộc trò chuyện.",
          "Skill: kiến thức quy trình tái sử dụng, tự kích hoạt theo nhiệm vụ.",
          "MCP: kết nối tới hệ thống ngoài (dữ liệu, hành động). Skill dạy CÁCH làm; MCP cho KHẢ NĂNG truy cập."
        ]}
      ],
      takeaways: [
        "Skill = thư mục SKILL.md + script/template, Claude tự nạp đúng lúc.",
        "Progressive disclosure: chỉ tên+mô tả thường trực, thân skill nạp khi cần.",
        "Skill dạy cách làm; MCP cho khả năng truy cập hệ thống ngoài."
      ]
    },
    {
      id: "as-2", title: "Cấu trúc SKILL.md", time: "9 phút", art: "skillmd",
      sections: [
        { h: "Frontmatter — phần bắt buộc", p: [
          "Đầu file SKILL.md là khối YAML frontmatter với hai trường chính: name (tên skill) và description (mô tả). Description là phần QUAN TRỌNG NHẤT: Claude dựa vào nó để quyết định khi nào kích hoạt skill — phải nói rõ skill làm gì VÀ khi nào dùng."
        ]},
        { h: "Thân skill — hướng dẫn", p: [
          "Phần markdown sau frontmatter là hướng dẫn chi tiết: quy trình từng bước, quy tắc, ví dụ, lỗi thường gặp. Viết như viết cẩm nang cho nhân viên mới: ngắn gọn, cụ thể, có ví dụ tốt/xấu."
        ]},
        { h: "Tài nguyên đi kèm", list: [
          "Script (Python/Bash...): việc tính toán chính xác nên giao cho code thay vì để mô hình tự tính — Claude chạy script trong skill.",
          "Template: file mẫu (Excel, slide, hợp đồng) để bảo đảm đầu ra đúng chuẩn.",
          "Tài liệu tham khảo: file .md phụ cho chi tiết sâu, chỉ nạp khi cần (đúng tinh thần progressive disclosure)."
        ]}
      ],
      takeaways: [
        "Frontmatter: name + description (quyết định khi nào skill kích hoạt).",
        "Thân skill: quy trình từng bước như cẩm nang cho nhân viên mới.",
        "Việc cần chính xác → kèm script; đầu ra chuẩn → kèm template."
      ]
    },
    {
      id: "as-3", title: "Viết skill chất lượng cao", time: "9 phút", art: "quality",
      sections: [
        { h: "Description quyết định tất cả", p: [
          "Description tốt: «Tạo file Excel có công thức, định dạng và biểu đồ. Dùng khi người dùng cần bảng tính, báo cáo dữ liệu dạng .xlsx». Description tồi: «Skill làm Excel». Hãy nêu cả từ khoá mà người dùng thường nói để Claude khớp đúng."
        ]},
        { h: "Nguyên tắc viết thân skill", list: [
          "Ngắn gọn — mỗi token trong skill chiếm chỗ của ngữ cảnh nhiệm vụ.",
          "Cụ thể hành động: «chạy script X trước, kiểm tra Y, rồi mới Z».",
          "Cho ví dụ tốt và xấu khi quy tắc khó diễn đạt.",
          "Một skill một việc — đừng nhồi nhiều chuyên môn vào một skill."
        ]},
        { h: "Kiểm thử và lặp", p: [
          "Test skill bằng các yêu cầu thực tế đa dạng: skill có được kích hoạt đúng lúc không? Claude có làm theo đúng các bước không? Quan sát điểm Claude làm sai → bổ sung hướng dẫn đúng chỗ đó. Bạn cũng có thể nhờ chính Claude review và cải thiện skill (skill-creator)."
        ]}
      ],
      takeaways: [
        "Description nêu rõ: làm gì + khi nào dùng + từ khoá người dùng hay nói.",
        "Thân skill ngắn gọn, hành động cụ thể, một skill một việc.",
        "Test bằng yêu cầu thực tế, sửa nhắm vào chỗ Claude làm sai."
      ]
    },
    {
      id: "as-4", title: "Triển khai và chia sẻ skill", time: "9 phút", art: "share",
      sections: [
        { h: "Skill sống ở đâu?", list: [
          "Cá nhân: ~/.claude/skills/ — áp dụng mọi dự án của riêng bạn.",
          "Dự án: <repo>/.claude/skills/ — commit vào git, cả team dùng chung.",
          "Claude.ai: tải skill lên phần Capabilities trong Settings.",
          "API: dùng skill trong ứng dụng qua container/code execution."
        ]},
        { h: "Plugin và marketplace", p: [
          "Skill có thể đóng gói trong plugin Claude Code (kèm slash commands, agents, MCP) và phân phối qua marketplace — cách chuẩn để chia sẻ chuyên môn trong tổ chức hoặc với cộng đồng. Anthropic cũng phát hành sẵn nhiều skill chính thức: tạo Excel, PowerPoint, PDF, Word..."
        ]},
        { h: "Chiến lược cho tổ chức", p: [
          "Hãy nghĩ về skill như tài sản tri thức: quy trình onboarding, chuẩn thương hiệu, quy tắc review code, mẫu hợp đồng... được đóng gói một lần và mọi nhân viên (qua Claude) dùng nhất quán. Bắt đầu từ một quy trình bạn lặp lại hằng tuần — đó là ứng viên skill đầu tiên."
        ]}
      ],
      takeaways: [
        "Cá nhân ~/.claude/skills; dự án .claude/skills (commit cho team).",
        "Plugin + marketplace để phân phối skill trong tổ chức/cộng đồng.",
        "Skill = tài sản tri thức: bắt đầu từ quy trình bạn lặp lại hằng tuần."
      ]
    }
  ],
  quiz: [
    { q: "Một skill tối thiểu gồm gì?", options: ["File JSON", "Thư mục chứa file SKILL.md", "Database", "Plugin trình duyệt"], a: 1, expl: "Thư mục + SKILL.md (frontmatter name/description + hướng dẫn)." },
    { q: "Progressive disclosure nghĩa là gì?", options: ["Skill tự xoá sau khi dùng", "Bình thường chỉ nạp tên+mô tả; thân skill và tài liệu chỉ nạp khi cần", "Skill công khai dần", "Nạp toàn bộ skill mọi lúc"], a: 1, expl: "Nhờ vậy cài nhiều skill mà không tốn context window." },
    { q: "Trường nào quyết định KHI NÀO skill được kích hoạt?", options: ["name", "description trong frontmatter", "version", "author"], a: 1, expl: "Claude đọc description để khớp nhiệm vụ — phải nêu làm gì + khi nào dùng." },
    { q: "Skill khác MCP thế nào?", options: ["Giống hệt nhau", "Skill dạy CÁCH làm việc; MCP cho KHẢ NĂNG truy cập hệ thống ngoài", "Skill nhanh hơn", "MCP thay thế skill"], a: 1, expl: "Skill = quy trình/chuyên môn; MCP = kết nối dữ liệu/hành động." },
    { q: "Khi skill cần tính toán chính xác, nên làm gì?", options: ["Để mô hình tự tính", "Kèm script để Claude chạy thay vì tự tính", "Bỏ qua phần tính toán", "Tăng max_tokens"], a: 1, expl: "Code cho kết quả tất định; mô hình tự tính dễ sai." },
    { q: "Skill dùng chung cho cả team đặt ở đâu?", options: ["~/.claude/skills/", "<repo>/.claude/skills/ và commit vào git", "Desktop", "Email cho từng người"], a: 1, expl: "Skill trong repo được cả team dùng nhất quán qua git." }
  ],
  cards: [
    { front: "Skill là gì?", back: "Thư mục SKILL.md + script/template — chuyên môn đóng gói, Claude tự nạp đúng nhiệm vụ." },
    { front: "Progressive disclosure?", back: "Thường trực chỉ tên+mô tả; thân skill nạp khi khớp việc; tài liệu sâu nạp khi cần." },
    { front: "Phần quan trọng nhất của SKILL.md?", back: "description trong frontmatter — nêu rõ làm gì + khi nào dùng + từ khoá." },
    { front: "Skill vs MCP?", back: "Skill dạy CÁCH làm; MCP cho KHẢ NĂNG truy cập hệ thống ngoài." },
    { front: "Vị trí đặt skill?", back: "Cá nhân: ~/.claude/skills — Team: <repo>/.claude/skills — Claude.ai: Settings → Capabilities." },
    { front: "Nguyên tắc viết skill?", back: "Ngắn gọn, hành động cụ thể, ví dụ tốt/xấu, một skill một việc, kèm script cho việc cần chính xác." }
  ]
}
];

// ════════════════ BỔ SUNG: hình minh hoạ thứ 2, câu hỏi luyện thi, link thi chứng chỉ ════════════════
const COURSE_EXTRAS = {
  "claude-101": {
    examUrl: "https://anthropic.skilljar.com/claude-101",
    art2: { "c101-1": "voice", "c101-2": "checklist", "c101-3": "artifact", "c101-4": "research", "c101-5": "iterate" },
    quiz: [
      { q: "Claude có thể nhớ thông tin giữa các cuộc trò chuyện khác nhau khi nào?", options: ["Luôn luôn tự nhớ", "Khi dùng Projects hoặc bật tính năng memory", "Không bao giờ", "Chỉ khi trả phí"], a: 1, expl: "Mặc định mỗi chat độc lập; Projects và memory giúp giữ ngữ cảnh lâu dài." },
      { q: "Để Claude phân tích một file Excel, cách đúng là gì?", options: ["Mô tả nội dung file bằng lời", "Đính kèm file trực tiếp vào ô chat", "Chụp ảnh từng ô", "Không thể làm được"], a: 1, expl: "Claude đọc trực tiếp PDF, Word, Excel, CSV, ảnh... khi được đính kèm." },
      { q: "Custom instructions trong một Project có tác dụng gì?", options: ["Đổi màu giao diện", "Quy định cách Claude trả lời trong MỌI chat của project đó", "Tăng tốc độ", "Chặn người khác xem"], a: 1, expl: "Đặt một lần, áp dụng cho mọi cuộc trò chuyện trong project." },
      { q: "Phát biểu nào đúng về voice mode?", options: ["Chỉ có trên máy tính", "Trò chuyện bằng giọng nói với Claude trên app di động", "Phải trả thêm phí riêng", "Chỉ hỗ trợ tiếng Anh viết"], a: 1, expl: "App Android/iOS hỗ trợ trò chuyện bằng giọng nói." }
    ]
  },
  "ai-fluency": {
    examUrl: "https://anthropic.skilljar.com/",
    art2: { "af-1": "loop-human", "af-2": "checklist", "af-3": "iterate", "af-4": "risk" },
    quiz: [
      { q: "Brainstorm ý tưởng cùng AI thuộc chế độ cộng tác nào?", options: ["Automation", "Augmentation", "Delegation", "Isolation"], a: 1, expl: "Augmentation = AI và bạn cùng tư duy; Automation = AI làm thay một việc cụ thể." },
      { q: "«Platform awareness» trong Delegation nghĩa là gì?", options: ["Biết giá các gói cước", "Hiểu công cụ AI đang dùng mạnh gì, yếu gì, truy cập được dữ liệu nào", "Biết dùng nhiều nền tảng mạng xã hội", "Thuộc tên các mô hình"], a: 1, expl: "Hiểu năng lực và giới hạn của công cụ trước khi giao việc." },
      { q: "Thẩm định «quy trình» (process discernment) là kiểm tra điều gì?", options: ["Kết quả cuối có đẹp không", "AI có hiểu sai đề/bịa nguồn ở bước nào trong cách nó suy luận không", "Tốc độ phản hồi", "Chi phí"], a: 1, expl: "Không chỉ soi sản phẩm mà soi cả cách AI đi đến kết quả." },
      { q: "Khi nào cần minh bạch việc dùng AI?", options: ["Không bao giờ", "Khi điều đó quan trọng với người nhận sản phẩm", "Chỉ khi bị hỏi", "Luôn phải ghi vào mọi tin nhắn"], a: 1, expl: "Diligence: cho người liên quan biết khi AI tham gia, khi điều đó quan trọng với họ." }
    ]
  },
  "prompt-eng": {
    examUrl: "https://anthropic.skilljar.com/",
    art2: { "pe-1": "chat", "pe-2": "chain", "pe-3": "cot", "pe-4": "structure", "pe-5": "inspector" },
    quiz: [
      { q: "Prompt chaining là gì?", options: ["Lặp lại một prompt nhiều lần", "Chia nhiệm vụ lớn thành chuỗi prompt nhỏ, đầu ra bước trước làm đầu vào bước sau", "Nối nhiều mô hình", "Viết prompt dài nhất có thể"], a: 1, expl: "Mỗi bước tập trung một việc → chất lượng cao hơn một prompt khổng lồ." },
      { q: "Ví dụ trong prompt nên được bọc trong thẻ nào?", options: ["<data>", "<examples>", "<test>", "<sample-output>"], a: 1, expl: "Bọc trong <examples> (hoặc <example>) để Claude không nhầm ví dụ với dữ liệu thật." },
      { q: "Vì sao nên cho Claude «đường lui» kiểu «nếu không chắc, hãy nói không biết»?", options: ["Cho lịch sự", "Giảm rõ rệt việc bịa thông tin (hallucination)", "Tăng độ dài câu trả lời", "Bắt buộc của API"], a: 1, expl: "Không có đường lui, mô hình có xu hướng đoán; có đường lui, nó thừa nhận giới hạn." },
      { q: "Công cụ nào của Anthropic giúp tự động cải thiện prompt?", options: ["Prompt improver trong Console", "Photoshop", "Google Translate", "Task Manager"], a: 0, expl: "Anthropic Console có prompt improver và generator." }
    ]
  },
  "claude-code": {
    examUrl: "https://anthropic.skilljar.com/claude-code-101",
    art2: { "cc-1": "plan-mode", "cc-2": "iterate", "cc-3": "compact", "cc-4": "share", "cc-5": "connect" },
    quiz: [
      { q: "Lệnh /init trong Claude Code làm gì?", options: ["Xoá dự án", "Khảo sát dự án và tạo file CLAUDE.md đầu tiên", "Cài đặt lại app", "Tạo git repo"], a: 1, expl: "/init giúp Claude tự khám phá codebase và sinh CLAUDE.md." },
      { q: "Phím Esc trong Claude Code dùng để làm gì?", options: ["Thoát hẳn chương trình", "Ngắt Claude đang làm để chỉnh hướng ngay", "Xoá CLAUDE.md", "Đổi mô hình"], a: 1, expl: "Esc dừng hành động hiện tại để bạn điều chỉnh — đừng đợi nó làm sai xong mới sửa." },
      { q: "Gõ «#» trước một ghi chú trong phiên làm việc có tác dụng gì?", options: ["Tạo hashtag", "Lưu ghi chú đó vào CLAUDE.md làm ghi nhớ lâu dài", "Comment code", "Tìm kiếm"], a: 1, expl: "# là cách thêm ghi nhớ nhanh vào bộ nhớ dự án." },
      { q: "Tag @claude trong issue/PR trên GitHub có tác dụng gì (khi đã cài GitHub Actions của Claude)?", options: ["Không gì cả", "Claude tự đọc issue/PR và thực hiện việc được yêu cầu", "Gửi email cho Anthropic", "Khoá issue"], a: 1, expl: "GitHub Actions của Claude cho phép giao việc ngay trong issue/PR." }
    ]
  },
  "claude-api": {
    examUrl: "https://anthropic.skilljar.com/claude-platform-101",
    art2: { "api-1": "terminal", "api-2": "tokens", "api-3": "chat", "api-4": "workflow", "api-5": "tokens" },
    quiz: [
      { q: "Header bắt buộc để xác thực với Claude API là gì?", options: ["Authorization: Bearer", "x-api-key", "api-token", "claude-key"], a: 1, expl: "REST API dùng header x-api-key (kèm anthropic-version)." },
      { q: "stop_reason «tool_use» trong response nghĩa là gì?", options: ["Có lỗi xảy ra", "Claude muốn gọi một tool và đang chờ kết quả từ code của bạn", "Hết token", "Hoàn thành câu trả lời"], a: 1, expl: "Bạn cần thực thi hàm tương ứng rồi gửi tool_result lại." },
      { q: "Vì sao KHÔNG được gọi Claude API trực tiếp từ frontend?", options: ["Vì chậm", "Vì API key sẽ bị lộ cho mọi người dùng", "Vì không hỗ trợ JavaScript", "Vì tốn pin"], a: 1, expl: "Key trong frontend = ai cũng lấy được. Luôn gọi qua backend của bạn." },
      { q: "Phần nào của request NÊN đặt cache_control để hưởng prompt caching?", options: ["Câu hỏi mới nhất của user", "Phần đầu lặp lại: system prompt dài, tài liệu lớn, danh sách tools", "max_tokens", "Câu trả lời"], a: 1, expl: "Cache phần ổn định ở đầu; phần thay đổi (câu hỏi mới) đặt sau." }
    ]
  },
  "mcp": {
    examUrl: "https://anthropic.skilljar.com/",
    art2: { "mcp-1": "connect", "mcp-2": "tooluse", "mcp-3": "inspector", "mcp-4": "risk" },
    quiz: [
      { q: "Giao thức truyền tải nào dùng khi MCP server chạy CÙNG MÁY với host?", options: ["HTTP", "stdio (luồng vào/ra chuẩn)", "FTP", "Bluetooth"], a: 1, expl: "stdio cho server cục bộ; HTTP cho server từ xa." },
      { q: "Resource trong MCP có đặc điểm gì?", options: ["Gây tác dụng phụ lên hệ thống", "Dữ liệu chỉ-đọc có URI riêng, không gây tác dụng phụ", "Chỉ chứa code", "Do mô hình tự tạo ra"], a: 1, expl: "Resources chỉ cung cấp thông tin (file, bản ghi...) — không thực hiện hành động." },
      { q: "Trong FastMCP, docstring của hàm Python trở thành gì?", options: ["Tên server", "Mô tả của tool (phần mô hình đọc để quyết định gọi)", "API key", "Log"], a: 1, expl: "Docstring → description; type hints → schema tham số." },
      { q: "Prompt injection trong bối cảnh MCP là rủi ro gì?", options: ["Server chạy chậm", "Dữ liệu độc hại từ bên ngoài chứa lệnh đánh lừa mô hình thực hiện hành động xấu", "Mất kết nối mạng", "Token hết hạn"], a: 1, expl: "Vì vậy cần duyệt kỹ các hành động ghi/xoá và chỉ cài server tin cậy." }
    ]
  },
  "agent-skills": {
    examUrl: "https://anthropic.skilljar.com/",
    art2: { "as-1": "tools", "as-2": "claudemd", "as-3": "iterate", "as-4": "cert" },
    quiz: [
      { q: "Vì sao thân skill nên NGẮN GỌN?", options: ["Để đẹp", "Mỗi token trong skill chiếm chỗ của ngữ cảnh dành cho nhiệm vụ", "Vì giới hạn 100 từ", "Để dịch dễ hơn"], a: 1, expl: "Context window có hạn — skill dài chèn ép ngữ cảnh làm việc." },
      { q: "Khi quy tắc khó diễn đạt bằng lời, kỹ thuật tốt nhất trong skill là gì?", options: ["Viết dài hơn", "Cho ví dụ TỐT và ví dụ XẤU đối chiếu", "Bỏ qua quy tắc đó", "Viết bằng tiếng Anh"], a: 1, expl: "Cặp ví dụ tốt/xấu truyền đạt sắc thái hiệu quả nhất." },
      { q: "Anthropic phát hành sẵn các skill chính thức nào?", options: ["Chơi game", "Tạo Excel, PowerPoint, PDF, Word", "Chỉnh sửa video", "Đặt vé máy bay"], a: 1, expl: "Bộ skill tài liệu văn phòng chính thức dùng được ngay." },
      { q: "Ứng viên tốt nhất cho skill ĐẦU TIÊN của bạn là gì?", options: ["Việc làm một lần duy nhất", "Một quy trình bạn lặp lại hằng tuần", "Việc chưa bao giờ làm", "Việc tuyệt mật"], a: 1, expl: "Quy trình lặp lại = đóng gói một lần, hưởng lợi mãi." }
    ]
  }
};
for (const c of COURSES) {
  const e = COURSE_EXTRAS[c.id];
  if (!e) continue;
  c.examUrl = e.examUrl;
  c.quiz.push(...e.quiz);
  c.lessons.forEach(l => { if (e.art2[l.id]) l.art2 = e.art2[l.id]; });
}
