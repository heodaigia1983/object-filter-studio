// Claude Academy VN — Giáo trình THỰC CHIẾN (Power User)
// Nhánh song song với giáo trình Anthropic Academy chính thức.
// Nội dung biên soạn tiếng Việt theo loạt hướng dẫn thực hành phổ biến về Claude
// (chủ đề từ ruben.substack.com) — hướng đến mẹo dùng thật trong công việc hằng ngày.

const COURSES_THUCCHIEN = [
// ════════════════════════ 1. KHỞI ĐỘNG NHANH ════════════════════════
{
  id: "tc-quickstart", track: "power", emoji: "🚀", color: "#E8833A",
  title: "Khởi động nhanh với Claude",
  subtitle: "Từ con số 0 đến dùng Claude trôi chảy mỗi ngày — và không lo hết lượt.",
  level: "Nhập môn", duration: "≈ 35 phút",
  lessons: [
    {
      id: "tcq-1", title: "5 phút đầu tiên với Claude", time: "8 phút", art: "rocket", art2: "chat",
      sections: [
        { h: "Mở Claude và nói chuyện như với người", p: [
          "Vào claude.ai (hoặc tải app Android/iOS/desktop), đăng nhập miễn phí và gõ câu hỏi đầu tiên. Không cần học cú pháp gì cả — bạn viết như đang nhắn cho một đồng nghiệp giỏi.",
          "Mẹo của người dùng thành thạo: đừng hỏi cụt lủn. Thay vì «viết email», hãy nói «viết email xin nghỉ phép 2 ngày gửi sếp tên Hùng, giọng lịch sự, ngắn gọn». Càng nhiều bối cảnh, kết quả càng đúng ngay lần đầu."
        ]},
        { h: "Ba việc nên thử ngay hôm nay", list: [
          "Dán một đoạn văn dài và nhờ «tóm tắt thành 5 gạch đầu dòng».",
          "Chụp/đính kèm một tài liệu PDF và hỏi «hợp đồng này có điều khoản nào bất lợi cho tôi?».",
          "Nhờ Claude «đóng vai gia sư, giải thích [khái niệm khó] cho người mới bằng ví dụ đời thường»."
        ]},
        { h: "Free, Pro hay Max?", p: [
          "Gói Free đủ để làm quen và dùng nhẹ nhàng. Khi bắt đầu phụ thuộc vào Claude cho công việc (dùng nhiều lần/ngày, cần model mạnh nhất, cần Cowork/Projects nâng cao), gói Pro là bước nâng cấp đáng tiền nhất."
        ]}
      ],
      takeaways: [
        "Viết cho Claude như nhắn đồng nghiệp giỏi — kèm đủ bối cảnh.",
        "Thử ngay: tóm tắt, đọc tài liệu PDF, học khái niệm khó.",
        "Free để làm quen; Pro khi đã dùng cho công việc hằng ngày."
      ]
    },
    {
      id: "tcq-2", title: "Thói quen biến Claude thành trợ lý hằng ngày", time: "9 phút", art: "daily", art2: "checklist",
      sections: [
        { h: "Đặt Claude vào quy trình thật của bạn", p: [
          "Người dùng giỏi không coi Claude là «đồ chơi hỏi đáp» mà là một bước trong công việc: soạn email khó, chuẩn bị dàn ý họp, dịch tài liệu, kiểm tra lại lập luận trước khi gửi đi.",
          "Mẹo: tạo sẵn vài câu lệnh mẫu bạn hay dùng (template) và lưu trong ghi chú điện thoại — dán ra dùng lại, chỉ thay phần nội dung."
        ]},
        { h: "Quy tắc «đồng nghiệp mới»", p: [
          "Claude rất giỏi nhưng không biết bối cảnh riêng của bạn. Mỗi lần giao việc quan trọng, hãy nói rõ: bạn là ai, đang làm cho ai, kết quả mong muốn trông thế nào, và điều gì TUYỆT ĐỐI tránh."
        ]},
        { h: "Luôn là người kiểm tra cuối", list: [
          "Số liệu, ngày tháng, tên riêng: tự kiểm chứng, đừng tin tuyệt đối.",
          "Việc nhạy cảm (pháp lý, y tế, tài chính): coi câu trả lời là gợi ý, không phải phán quyết.",
          "Bạn ký tên vào kết quả — nên bạn chịu trách nhiệm rà soát."
        ]}
      ],
      takeaways: [
        "Đưa Claude vào đúng quy trình công việc thật, không chỉ hỏi vặt.",
        "Lưu sẵn câu lệnh mẫu để tái sử dụng nhanh.",
        "Luôn tự kiểm chứng số liệu và việc nhạy cảm trước khi dùng."
      ]
    },
    {
      id: "tcq-3", title: "Không lo hết lượt dùng Claude", time: "9 phút", art: "optimize", art2: "gauge",
      sections: [
        { h: "Vì sao bị giới hạn?", p: [
          "Giới hạn lượt dùng tính theo lượng xử lý trong một khoảng thời gian, và phụ thuộc model: model mạnh nhất (Opus) «ăn» hạn mức nhanh hơn nhiều so với model nhanh (Haiku/Sonnet). Cuộc trò chuyện càng dài, mỗi lần trả lời càng tốn vì Claude phải đọc lại toàn bộ lịch sử."
        ]},
        { h: "Mẹo kéo dài hạn mức", list: [
          "Chọn đúng model: việc đơn giản dùng model nhanh, để dành model mạnh cho việc khó.",
          "Bắt đầu cuộc trò chuyện MỚI khi đổi chủ đề — đừng kéo dài một chat khổng lồ.",
          "Đưa tài liệu dài vào Projects một lần thay vì dán lại mỗi lần hỏi.",
          "Hỏi gọn, đúng trọng tâm; gộp nhiều câu hỏi nhỏ thành một yêu cầu có cấu trúc."
        ]},
        { h: "Khi sắp hết lượt", p: [
          "Claude thường báo trước. Lúc đó: chuyển sang model nhẹ hơn để tiếp tục việc đơn giản, hoặc nghỉ và quay lại sau khi hạn mức làm mới. Nếu thường xuyên chạm trần, đó là dấu hiệu nên cân nhắc nâng gói."
        ]}
      ],
      takeaways: [
        "Hạn mức phụ thuộc model và độ dài cuộc trò chuyện.",
        "Mở chat mới khi đổi chủ đề; dùng Projects cho tài liệu lặp lại.",
        "Để dành model mạnh cho việc khó; việc nhẹ dùng model nhanh."
      ]
    }
  ],
  quiz: [
    { q: "Cách viết yêu cầu cho kết quả tốt ngay lần đầu?", options: ["Viết càng ngắn càng tốt", "Kèm đủ bối cảnh: bạn là ai, mục tiêu, định dạng, điều cần tránh", "Viết hoa toàn bộ", "Hỏi bằng tiếng Anh"], a: 1, expl: "Bối cảnh đầy đủ giúp Claude trả lời đúng ý ngay." },
    { q: "Điều gì làm bạn nhanh hết lượt dùng nhất?", options: ["Mở app buổi tối", "Dùng model mạnh nhất cho mọi việc + chat quá dài", "Đính kèm ảnh", "Dùng tiếng Việt"], a: 1, expl: "Model mạnh tốn hạn mức nhanh; chat dài phải đọc lại toàn bộ lịch sử mỗi lần." },
    { q: "Khi đổi sang chủ đề hoàn toàn mới, nên làm gì?", options: ["Tiếp tục trong cùng cuộc trò chuyện", "Mở cuộc trò chuyện mới", "Đổi tài khoản", "Xoá app"], a: 1, expl: "Chat mới giữ ngữ cảnh sạch và tiết kiệm hạn mức." },
    { q: "Với tài liệu dài cần hỏi nhiều lần, cách tiết kiệm là?", options: ["Dán lại tài liệu mỗi lần hỏi", "Đưa vào Projects một lần rồi hỏi", "Chia nhỏ thành ảnh", "Không hỏi nữa"], a: 1, expl: "Projects giữ tài liệu dùng chung, khỏi dán lại tốn hạn mức." },
    { q: "Ai chịu trách nhiệm cuối về kết quả Claude tạo ra?", options: ["Anthropic", "Bạn — người dùng phải kiểm chứng", "Không ai", "Model"], a: 1, expl: "Luôn tự kiểm tra số liệu, tên riêng, việc nhạy cảm." }
  ],
  cards: [
    { front: "Công thức yêu cầu tốt?", back: "Bối cảnh (bạn là ai, làm cho ai) + mục tiêu + định dạng + điều cần tránh." },
    { front: "Vì sao mau hết lượt?", back: "Dùng model mạnh cho mọi việc + cuộc trò chuyện quá dài (phải đọc lại toàn bộ)." },
    { front: "3 mẹo kéo dài hạn mức?", back: "Chọn đúng model, mở chat mới khi đổi chủ đề, dùng Projects cho tài liệu lặp lại." },
    { front: "Quy tắc «đồng nghiệp mới»?", back: "Claude giỏi nhưng không biết bối cảnh của bạn — phải nói rõ mọi thứ cần thiết." },
    { front: "Free vs Pro?", back: "Free để làm quen; Pro khi đã dùng cho công việc hằng ngày, cần model mạnh và tính năng nâng cao." }
  ]
},

// ════════════════════════ 2. VIẾT & PROMPT NHƯ PRO ════════════════════════
{
  id: "tc-writing", track: "power", emoji: "✍️", color: "#DB2777",
  title: "Viết & Prompt như Pro",
  subtitle: "Prompt kiểu mới, ép Claude viết đúng giọng của bạn và bớt hẳn «mùi AI».",
  level: "Trung cấp", duration: "≈ 45 phút",
  lessons: [
    {
      id: "tcw-1", title: "Prompt kiểu mới: nói mục tiêu, đừng ra lệnh từng bước", time: "9 phút", art: "bullseye", art2: "prompt",
      sections: [
        { h: "Đừng micro-manage Claude", p: [
          "Cách prompt cũ: liệt kê thật chi tiết từng bước phải làm. Với model hiện đại, cách hiệu quả hơn là nói rõ MỤC TIÊU và TIÊU CHÍ THÀNH CÔNG, rồi để Claude tự tìm đường — giống giao việc cho một chuyên gia thay vì đọc cho nhân viên chép.",
          "Ví dụ: thay vì «bước 1 làm X, bước 2 làm Y...», hãy nói «mình cần một bản kế hoạch marketing đạt được 3 mục tiêu sau..., đối tượng là..., thành công nghĩa là... Bạn đề xuất cách làm rồi thực hiện»."
        ]},
        { h: "Cho Claude quyền hỏi lại", p: [
          "Một câu thần kỳ: «Trước khi làm, nếu thiếu thông tin gì hãy hỏi mình 3 câu quan trọng nhất». Claude sẽ moi ra đúng những gì nó cần — kết quả chính xác hơn hẳn so với việc đoán mò."
        ]},
        { h: "Giao tiêu chí đánh giá", p: [
          "Nói cho Claude biết bài tốt trông thế nào: «bài đạt yêu cầu nếu: dưới 300 từ, không thuật ngữ, có một ví dụ cụ thể, kết bằng lời kêu gọi hành động». Có thước đo, Claude tự rà soát và sửa trước khi đưa cho bạn."
        ]}
      ],
      takeaways: [
        "Nói MỤC TIÊU + tiêu chí thành công, đừng ra lệnh từng bước vụn vặt.",
        "Cho phép Claude hỏi lại 3 câu trước khi làm để gom đủ thông tin.",
        "Giao tiêu chí đánh giá rõ ràng để Claude tự rà soát kết quả."
      ]
    },
    {
      id: "tcw-2", title: "Để Claude viết đúng giọng của bạn", time: "10 phút", art: "penstyle", art2: "fewshot",
      sections: [
        { h: "Bí quyết: bạn chỉ là một «text file»", p: [
          "Phong cách viết của bạn có thể được mô tả thành văn bản và đưa cho Claude. Cách mạnh nhất là dạy bằng VÍ DỤ THẬT: dán 2–3 bài bạn đã viết và nói «hãy viết theo đúng giọng văn, nhịp câu và cách dùng từ trong các mẫu này»."
        ]},
        { h: "Tạo «hồ sơ giọng văn» của riêng bạn", p: [
          "Nhờ Claude phân tích các mẫu của bạn: «đọc 3 bài này và mô tả phong cách viết của tôi thành một bộ quy tắc». Lưu bộ quy tắc đó lại (trong Project hoặc một ghi chú). Lần sau chỉ cần dán bộ quy tắc + yêu cầu, Claude viết đúng chất bạn ngay."
        ]},
        { h: "Tinh chỉnh thay vì viết lại", list: [
          "«Câu này nghe chưa giống mình, viết lại tự nhiên hơn».",
          "«Bớt trang trọng, thêm chút hài hước nhẹ như mẫu số 2».",
          "«Giữ ý nhưng rút còn một nửa độ dài»."
        ]}
      ],
      takeaways: [
        "Dạy giọng văn bằng 2–3 bài mẫu thật của bạn (few-shot).",
        "Nhờ Claude rút ra «bộ quy tắc phong cách» rồi lưu lại tái dùng.",
        "Tinh chỉnh từng câu thay vì bắt viết lại từ đầu."
      ]
    },
    {
      id: "tcw-3", title: "Xoá «mùi AI» khỏi bài viết", time: "9 phút", art: "cleanwrite", art2: "format",
      sections: [
        { h: "Những dấu hiệu lộ bài do AI viết", list: [
          "Mẫu câu «Không phải X, mà là Y» lặp đi lặp lại — dấu hiệu rõ nhất.",
          "Từ sáo rỗng: «trong thế giới ngày nay», «khai phá», «bức tranh toàn cảnh», «hành trình».",
          "Mọi đoạn đều dài bằng nhau, câu nào cũng tròn trịa, đối xứng đến mức máy móc.",
          "Lạm dụng gạch ngang dài (—) và danh sách ba ý đều tăm tắp."
        ]},
        { h: "Cách chữa", p: [
          "Ra lệnh trực tiếp: «viết tự nhiên như người thật: câu dài ngắn xen kẽ, tránh mẫu Không-phải-X-mà-là-Y, bỏ các từ sáo rỗng, không dùng gạch ngang dài, đừng ý nào cũng gom thành bộ ba».",
          "Thêm: «cho phép câu hơi lệch chuẩn, dùng từ đời thường, thỉnh thoảng một câu cụt cho có nhịp»."
        ]},
        { h: "Đọc to để kiểm tra", p: [
          "Mẹo cuối: đọc thành tiếng (hoặc bật giọng đọc của app). Chỗ nào nghe «trơn tru một cách giả tạo» thì sửa. Văn người thật luôn có nhịp không đều."
        ]}
      ],
      takeaways: [
        "Tránh mẫu «Không phải X mà là Y» và từ sáo rỗng — dấu hiệu AI rõ nhất.",
        "Yêu cầu câu dài ngắn xen kẽ, từ đời thường, bỏ gạch ngang dài.",
        "Đọc to để bắt chỗ nghe giả tạo rồi sửa."
      ]
    },
    {
      id: "tcw-4", title: "Bộ prompt mẫu dùng được ngay", time: "8 phút", art: "structure", art2: "chain",
      sections: [
        { h: "Mẫu cho việc viết", p: [
          "«Bạn là [vai trò]. Viết [loại nội dung] cho [đối tượng] nhằm [mục tiêu]. Giọng: [mô tả]. Độ dài: [...]. Tránh: [...]. Trước khi viết, hỏi mình nếu thiếu thông tin.»"
        ]},
        { h: "Mẫu cho việc phân tích", p: [
          "«Đây là [tài liệu/dữ liệu]. Hãy: 1) tóm tắt 3 ý chính, 2) chỉ ra rủi ro/điểm yếu, 3) đề xuất 2 hành động. Trích dẫn nguyên văn phần bạn dựa vào.»"
        ]},
        { h: "Mẫu cho việc học", p: [
          "«Giải thích [chủ đề] theo 3 cấp độ: như cho trẻ 10 tuổi, như cho sinh viên, như cho chuyên gia. Mỗi cấp một ví dụ đời thường. Cuối cùng cho mình 3 câu hỏi tự kiểm tra.»",
          "Lưu các mẫu này lại — chỉnh phần trong [...] là tái dùng mãi."
        ]}
      ],
      takeaways: [
        "Mẫu viết: vai trò + loại nội dung + đối tượng + mục tiêu + giọng + giới hạn.",
        "Mẫu phân tích: tóm tắt → rủi ro → hành động, kèm trích dẫn.",
        "Mẫu học: giải thích 3 cấp độ + câu hỏi tự kiểm tra."
      ]
    }
  ],
  quiz: [
    { q: "Cách prompt hiệu quả với model hiện đại?", options: ["Ra lệnh chi tiết từng bước nhỏ", "Nói rõ mục tiêu + tiêu chí thành công, để Claude tự tìm đường", "Viết thật dài dòng", "Lặp lại yêu cầu nhiều lần"], a: 1, expl: "Giao mục tiêu như giao cho chuyên gia, không micro-manage." },
    { q: "Câu nào giúp Claude gom đủ thông tin trước khi làm?", options: ["«Làm nhanh lên»", "«Nếu thiếu thông tin, hãy hỏi mình 3 câu quan trọng nhất trước khi làm»", "«Cố lên»", "«Dùng tiếng Anh»"], a: 1, expl: "Cho phép Claude hỏi lại giúp kết quả chính xác hơn nhiều." },
    { q: "Cách mạnh nhất để Claude viết đúng giọng của bạn?", options: ["Mô tả chung chung", "Dán 2–3 bài mẫu thật của bạn để Claude bắt chước", "Yêu cầu trang trọng", "Viết hoa"], a: 1, expl: "Ví dụ thật truyền đạt phong cách tốt hơn mọi lời mô tả." },
    { q: "Dấu hiệu rõ nhất của bài do AI viết là gì?", options: ["Có dấu phẩy", "Mẫu câu «Không phải X, mà là Y» lặp lại + từ sáo rỗng", "Viết ngắn", "Có ví dụ"], a: 1, expl: "Đây là «mùi AI» dễ nhận nhất, nên yêu cầu tránh." },
    { q: "Mẹo kiểm tra bài có tự nhiên không?", options: ["Đếm số từ", "Đọc to lên — chỗ nào nghe giả tạo thì sửa", "Dịch sang tiếng Anh", "Đổi font"], a: 1, expl: "Văn người thật có nhịp không đều; đọc to giúp bắt chỗ máy móc." }
  ],
  cards: [
    { front: "Prompt kiểu mới?", back: "Nói mục tiêu + tiêu chí thành công, để Claude tự tìm cách — đừng ra lệnh từng bước." },
    { front: "Câu giúp gom đủ thông tin?", back: "«Nếu thiếu thông tin, hãy hỏi mình 3 câu quan trọng nhất trước khi làm.»" },
    { front: "Dạy giọng văn cho Claude?", back: "Dán 2–3 bài mẫu thật; nhờ rút ra «bộ quy tắc phong cách» rồi lưu tái dùng." },
    { front: "Dấu hiệu «mùi AI»?", back: "Mẫu «Không phải X mà là Y», từ sáo rỗng, câu đều tăm tắp, lạm dụng gạch ngang dài." },
    { front: "Chữa mùi AI?", back: "Câu dài ngắn xen kẽ, từ đời thường, bỏ gạch ngang dài; đọc to để bắt chỗ giả tạo." }
  ]
},

// ════════════════════════ 3. VĂN PHÒNG AI ════════════════════════
{
  id: "tc-office", track: "power", emoji: "📊", color: "#0D9488",
  title: "Văn phòng AI: Excel, Slide & Thiết kế",
  subtitle: "Dùng Claude làm bảng tính, bài thuyết trình và sản phẩm thiết kế chuẩn chỉnh.",
  level: "Trung cấp", duration: "≈ 40 phút",
  lessons: [
    {
      id: "tco-1", title: "Bảng tính Excel chuyên nghiệp", time: "9 phút", art: "spreadsheet", art2: "format",
      sections: [
        { h: "Claude làm được gì với Excel", p: [
          "Claude tạo được file Excel (.xlsx) thật có công thức, định dạng, nhiều sheet và biểu đồ — không chỉ bảng văn bản. Bạn mô tả nhu cầu, Claude dựng file để tải về."
        ]},
        { h: "Cách yêu cầu cho ra file chuẩn", list: [
          "Nói rõ các cột và kiểu dữ liệu: «cột A ngày, B sản phẩm, C số lượng, D đơn giá, E thành tiền = C×D».",
          "Yêu cầu công thức thật (SUM, IF, VLOOKUP...) thay vì điền số cứng.",
          "Mô tả định dạng: «hàng tiêu đề in đậm nền xanh, cột tiền định dạng tiền tệ, có dòng tổng cuối bảng».",
          "Cần biểu đồ thì nói loại: «thêm biểu đồ cột doanh thu theo tháng»."
        ]},
        { h: "Kiểm tra trước khi dùng", p: [
          "Mở file, bấm vào ô có công thức để chắc chắn nó tính đúng. Với dữ liệu thật quan trọng, kiểm chứng vài dòng đầu rồi mới tin cả bảng."
        ]}
      ],
      takeaways: [
        "Claude tạo file .xlsx thật có công thức, định dạng và biểu đồ.",
        "Mô tả rõ cột, kiểu dữ liệu và công thức mong muốn.",
        "Luôn mở file kiểm tra công thức trước khi dùng cho việc thật."
      ]
    },
    {
      id: "tco-2", title: "Slide thuyết trình bằng AI", time: "9 phút", art: "slidedeck", art2: "artifact",
      sections: [
        { h: "Từ ý tưởng đến bộ slide", p: [
          "Claude giúp cả hai khâu: lên DÀN Ý (cấu trúc câu chuyện, số slide, ý mỗi slide) và TẠO NỘI DUNG từng slide. Với kỹ năng tạo PowerPoint, Claude xuất được file .pptx để mở trong PowerPoint/Google Slides."
        ]},
        { h: "Quy trình làm slide tốt", list: [
          "Bước 1: «mình thuyết trình về [chủ đề] cho [đối tượng] trong [thời lượng]. Đề xuất dàn ý bộ slide».",
          "Bước 2: duyệt và chỉnh dàn ý cho đúng ý mình.",
          "Bước 3: «viết nội dung từng slide: tiêu đề ngắn, 3–4 gạch đầu dòng, gợi ý hình minh hoạ».",
          "Bước 4: yêu cầu xuất file hoặc dựng thành slide để tải về."
        ]},
        { h: "Nguyên tắc slide đẹp", p: [
          "Nhắc Claude: mỗi slide một ý chính, chữ to ít chữ, ưu tiên con số và hình ảnh, tránh đoạn văn dài. Slide là để nói theo, không phải để đọc nguyên văn."
        ]}
      ],
      takeaways: [
        "Làm slide theo 2 khâu: dàn ý trước, nội dung từng slide sau.",
        "Claude xuất được file .pptx để mở trong PowerPoint/Slides.",
        "Mỗi slide một ý, ít chữ, ưu tiên số liệu và hình ảnh."
      ]
    },
    {
      id: "tco-3", title: "Claude cho dân thiết kế", time: "9 phút", art: "palette", art2: "quality",
      sections: [
        { h: "Trợ thủ ý tưởng và nội dung thiết kế", p: [
          "Claude không thay phần mềm thiết kế, nhưng cực mạnh ở khâu tư duy: brainstorm concept, viết nội dung (copy) cho banner/poster, gợi ý bảng màu, phân tích bố cục, viết brief cho designer hay cho công cụ tạo ảnh."
        ]},
        { h: "Ứng dụng cụ thể", list: [
          "«Đề xuất 5 concept cho bộ nhận diện quán cà phê phong cách tối giản».",
          "«Viết 3 phương án tiêu đề + mô tả cho poster sự kiện này».",
          "«Gợi ý bảng màu (mã hex) hợp với thương hiệu trẻ trung, năng động».",
          "«Viết brief chi tiết để mình đưa cho công cụ tạo ảnh AI»."
        ]},
        { h: "Kết hợp với artifact", p: [
          "Claude có thể dựng mẫu giao diện web, thiệp, infographic dạng HTML/SVG ngay trong artifact để bạn xem trước và chỉnh sửa bằng lời — «đổi màu nền sang pastel», «tăng cỡ tiêu đề»."
        ]}
      ],
      takeaways: [
        "Claude mạnh ở ý tưởng, nội dung và brief thiết kế — không thay phần mềm.",
        "Dùng cho concept, copy, bảng màu, brief tạo ảnh.",
        "Dựng mẫu HTML/SVG trong artifact rồi chỉnh bằng lời."
      ]
    }
  ],
  quiz: [
    { q: "Claude tạo file Excel như thế nào?", options: ["Chỉ bảng văn bản", "File .xlsx thật có công thức, định dạng, biểu đồ", "Chỉ ảnh chụp bảng", "Không làm được Excel"], a: 1, expl: "Claude xuất .xlsx thật với công thức SUM/IF/VLOOKUP, định dạng và biểu đồ." },
    { q: "Để bảng tính tính toán đúng, nên yêu cầu gì?", options: ["Điền số cứng", "Dùng công thức thật (SUM, IF...) thay vì số cố định", "Không cần công thức", "Chỉ cần đẹp"], a: 1, expl: "Công thức thật giúp bảng tự cập nhật khi đổi dữ liệu." },
    { q: "Quy trình làm slide tốt với Claude?", options: ["Viết hết một lần", "Lên dàn ý trước, duyệt, rồi viết nội dung từng slide", "Chỉ làm slide cuối", "Copy từ web"], a: 1, expl: "Dàn ý trước giúp câu chuyện mạch lạc rồi mới đắp nội dung." },
    { q: "Nguyên tắc slide đẹp?", options: ["Càng nhiều chữ càng tốt", "Mỗi slide một ý, ít chữ, ưu tiên số liệu và hình", "Đoạn văn dài", "Nhiều màu sắc"], a: 1, expl: "Slide để nói theo, không để đọc nguyên văn." },
    { q: "Với dân thiết kế, Claude mạnh nhất ở khâu nào?", options: ["Thay thế Photoshop", "Ý tưởng, nội dung (copy), bảng màu, brief", "Vẽ tay", "In ấn"], a: 1, expl: "Claude là trợ thủ tư duy và nội dung, không thay phần mềm thiết kế." }
  ],
  cards: [
    { front: "Claude làm Excel được gì?", back: "File .xlsx thật: công thức (SUM/IF/VLOOKUP), định dạng, nhiều sheet, biểu đồ." },
    { front: "Yêu cầu bảng tính chuẩn?", back: "Nói rõ cột + kiểu dữ liệu + công thức + định dạng; rồi mở file kiểm tra." },
    { front: "Quy trình làm slide?", back: "Dàn ý → duyệt → nội dung từng slide → xuất .pptx. Mỗi slide một ý, ít chữ." },
    { front: "Claude cho designer?", back: "Concept, copy, bảng màu (hex), brief tạo ảnh; dựng mẫu HTML/SVG trong artifact." }
  ]
},

// ════════════════════════ 4. CLAUDE COWORK & TRỢ LÝ MÁY TÍNH ════════════════════════
{
  id: "tc-cowork", track: "power", emoji: "🤝", color: "#2563EB",
  title: "Claude Cowork & Trợ lý máy tính",
  subtitle: "Để Claude tự thao tác trên file và máy tính của bạn — như một đồng nghiệp số.",
  level: "Nâng cao", duration: "≈ 40 phút",
  lessons: [
    {
      id: "tcc-1", title: "Claude Cowork là gì?", time: "9 phút", art: "desktopagent", art2: "workflow",
      sections: [
        { h: "Đồng nghiệp số sống trên máy của bạn", p: [
          "Claude Cowork là tính năng trong ứng dụng desktop (macOS và Windows) cho phép Claude truy cập có kiểm soát vào các thư mục trên máy bạn: đọc, sửa, tạo và sắp xếp file trực tiếp. Nó hoạt động như một agent — tự lập kế hoạch và làm nhiều bước trong khi bạn làm việc khác.",
          "Mọi thứ chạy cục bộ trên máy bạn, bạn cấp quyền từng thư mục, và Anthropic không dùng file của bạn để huấn luyện."
        ]},
        { h: "Cowork hợp với việc gì?", list: [
          "Sắp xếp lại một thư mục lộn xộn theo quy tắc bạn đặt.",
          "Đọc nhiều file trong dự án rồi tổng hợp thành một báo cáo.",
          "Đổi tên/định dạng hàng loạt tài liệu theo chuẩn.",
          "Soạn thảo dựa trên các tài liệu sẵn có trong máy."
        ]},
        { h: "Yêu cầu & an toàn", p: [
          "Cần gói trả phí (Pro trở lên). Nguyên tắc: chỉ cấp quyền thư mục thật sự cần, theo dõi bảng tiến trình (Progress) để tạm dừng hoặc chỉnh giữa chừng, và rà soát kết quả trước khi coi là xong."
        ]}
      ],
      takeaways: [
        "Cowork để Claude tự đọc/sửa/tạo/sắp xếp file trên máy bạn (Mac/Windows).",
        "Chạy cục bộ, cấp quyền từng thư mục, không bị dùng để huấn luyện.",
        "Cần gói trả phí; theo dõi bảng tiến trình và rà soát kết quả."
      ]
    },
    {
      id: "tcc-2", title: "Cowork kết hợp Projects & Plugins", time: "10 phút", art: "projects", art2: "share",
      sections: [
        { h: "Sức mạnh nhân đôi", p: [
          "Cowork mạnh hơn nhiều khi kết hợp: Projects cho ngữ cảnh và quy tắc lâu dài; Plugins/Connectors để với tới Gmail, Google Drive, Notion, Slack; Skills để Cowork làm đúng quy trình của bạn mỗi lần."
        ]},
        { h: "Ví dụ quy trình kết hợp", list: [
          "Project «Báo cáo tuần» chứa mẫu báo cáo + quy tắc trình bày.",
          "Connector Gmail/Drive để Cowork lấy số liệu mới nhất.",
          "Skill «brand voice» để văn phong đúng chuẩn công ty.",
          "Một câu lệnh: «tổng hợp số liệu tuần này thành báo cáo theo mẫu trong project»."
        ]},
        { h: "Skill = trí nhớ quy trình", p: [
          "Tạo file SKILL.md trong thư mục công việc, ghi rõ giọng văn và quy trình chuẩn của bạn — Cowork sẽ nhớ và áp dụng mỗi lần, khỏi nhắc lại."
        ]}
      ],
      takeaways: [
        "Cowork + Projects + Connectors + Skills = quy trình tự động mạnh.",
        "Projects giữ mẫu và quy tắc; Connectors lấy dữ liệu thật.",
        "SKILL.md trong thư mục giúp Cowork nhớ quy trình của bạn."
      ]
    },
    {
      id: "tcc-3", title: "Claude làm trợ lý máy tính cá nhân", time: "9 phút", art: "tooluse", art2: "checklist",
      sections: [
        { h: "Từ trả lời câu hỏi đến LÀM VIỆC", p: [
          "Bước tiến lớn: Claude không chỉ nói cho bạn cách làm, mà tự làm trên máy. Đây là dạng «computer use / desktop agent» — Claude thao tác file, chạy các bước, và báo lại kết quả."
        ]},
        { h: "Giao việc cho trợ lý hiệu quả", list: [
          "Mô tả kết quả cuối mong muốn, không cần chỉ từng cú nhấp.",
          "Chia việc lớn thành mốc rõ ràng để dễ kiểm soát.",
          "Bắt đầu bằng việc ít rủi ro (sắp xếp, tổng hợp) trước khi giao việc ghi/xoá quan trọng.",
          "Luôn sao lưu dữ liệu quan trọng trước khi cho agent thao tác hàng loạt."
        ]},
        { h: "Ranh giới an toàn", p: [
          "Đây là công cụ mạnh nên cần kỷ luật: cấp quyền tối thiểu, xem kỹ những hành động không thể hoàn tác (xoá, ghi đè, gửi đi), và giữ thói quen rà soát. Bạn là người chỉ huy, Claude là người thực thi."
        ]}
      ],
      takeaways: [
        "Claude desktop agent tự thao tác trên máy chứ không chỉ hướng dẫn.",
        "Giao kết quả cuối + chia mốc; bắt đầu từ việc ít rủi ro.",
        "Sao lưu trước, cấp quyền tối thiểu, rà soát hành động không hoàn tác được."
      ]
    }
  ],
  quiz: [
    { q: "Claude Cowork cho phép làm gì?", options: ["Chỉ trò chuyện", "Truy cập có kiểm soát để đọc/sửa/tạo/sắp xếp file trên máy bạn", "Chỉ đọc web", "Gọi điện"], a: 1, expl: "Cowork là agent thao tác file cục bộ trên Mac/Windows." },
    { q: "Dữ liệu của bạn trong Cowork được xử lý thế nào?", options: ["Tải hết lên mạng", "Chạy cục bộ, cấp quyền từng thư mục, không dùng để huấn luyện", "Công khai", "Bị xoá"], a: 1, expl: "Chạy trên máy bạn, bạn kiểm soát quyền truy cập." },
    { q: "Cách giúp Cowork nhớ quy trình của bạn mỗi lần?", options: ["Nhắc lại mỗi lần", "Tạo file SKILL.md trong thư mục công việc", "Gửi email", "Không làm được"], a: 1, expl: "SKILL.md ghi giọng văn/quy trình để Cowork tự áp dụng." },
    { q: "Nguyên tắc an toàn khi dùng desktop agent?", options: ["Cấp toàn quyền", "Sao lưu trước, cấp quyền tối thiểu, rà soát hành động không hoàn tác được", "Để máy tự chạy", "Tắt thông báo"], a: 1, expl: "Công cụ mạnh cần kỷ luật: bạn chỉ huy, Claude thực thi." },
    { q: "Cowork mạnh nhất khi kết hợp với gì?", options: ["Chỉ một mình", "Projects + Connectors + Skills", "Trình duyệt khác", "Máy in"], a: 1, expl: "Projects giữ quy tắc, Connectors lấy dữ liệu, Skills giữ quy trình." }
  ],
  cards: [
    { front: "Claude Cowork là gì?", back: "Agent trong app desktop (Mac/Windows) tự đọc/sửa/tạo/sắp xếp file trên máy bạn, chạy cục bộ." },
    { front: "Cowork hợp việc gì?", back: "Sắp xếp thư mục, tổng hợp nhiều file thành báo cáo, đổi tên hàng loạt, soạn thảo từ tài liệu sẵn có." },
    { front: "Cho Cowork nhớ quy trình?", back: "Tạo SKILL.md trong thư mục ghi giọng văn + quy trình chuẩn của bạn." },
    { front: "Kết hợp sức mạnh?", back: "Cowork + Projects (quy tắc) + Connectors (dữ liệu Gmail/Drive) + Skills (quy trình)." },
    { front: "An toàn với desktop agent?", back: "Sao lưu trước, quyền tối thiểu, rà soát hành động xoá/ghi đè/gửi đi." }
  ]
},

// ════════════════════════ 5. SKILLS & CONNECTORS THỰC CHIẾN ════════════════════════
{
  id: "tc-extend", track: "power", emoji: "🔌", color: "#7C3AED",
  title: "Skills & Connectors thực chiến",
  subtitle: "Đóng gói quy trình riêng và nối Claude với Gmail, Drive, Notion, Slack.",
  level: "Nâng cao", duration: "≈ 35 phút",
  lessons: [
    {
      id: "tce-1", title: "Skills: dạy Claude làm theo cách của bạn", time: "10 phút", art: "skillfolder", art2: "quality",
      sections: [
        { h: "Skill giải quyết việc lặp lại", p: [
          "Nếu mỗi tuần bạn đều nhắc Claude cùng một quy trình (cách trình bày báo cáo, giọng văn thương hiệu, các bước kiểm tra), hãy đóng gói nó thành một Skill. Từ đó Claude tự áp dụng đúng lúc mà bạn không phải nhắc lại."
        ]},
        { h: "Một Skill gồm gì", list: [
          "File SKILL.md: tên + mô tả (khi nào dùng) + hướng dẫn từng bước.",
          "Tuỳ chọn: mẫu file (template), script, tài liệu tham khảo.",
          "Mô tả là phần quan trọng nhất — Claude đọc nó để biết khi nào kích hoạt skill."
        ]},
        { h: "Bắt đầu từ đâu", p: [
          "Chọn MỘT quy trình bạn lặp lại hằng tuần làm skill đầu tiên. Nhờ chính Claude giúp viết SKILL.md: «mình hay làm [quy trình này], giúp mình viết thành một skill chuẩn». Test với vài tình huống thật rồi tinh chỉnh."
        ]}
      ],
      takeaways: [
        "Skill đóng gói quy trình lặp lại để Claude tự áp dụng đúng lúc.",
        "Gồm SKILL.md (mô tả + hướng dẫn) + tuỳ chọn template/script.",
        "Bắt đầu từ một quy trình bạn làm hằng tuần; nhờ Claude viết giúp."
      ]
    },
    {
      id: "tce-2", title: "Connectors: nối Claude với dữ liệu của bạn", time: "9 phút", art: "connect", art2: "inbox",
      sections: [
        { h: "Claude với tới công cụ bạn đang dùng", p: [
          "Connectors cho phép Claude truy cập trực tiếp Gmail, Google Calendar, Google Drive, Notion, Slack... Sau khi kết nối, bạn nói bằng lời thường: «tóm tắt email chưa đọc tuần này», «tìm file kế hoạch Q3 trong Drive», «lịch ngày mai có gì gấp?»."
        ]},
        { h: "Kết nối và dùng", list: [
          "Bật connector trong phần Settings/Connectors của Claude.",
          "Cấp quyền cho đúng tài khoản và phạm vi cần thiết.",
          "Giao việc kết hợp nhiều nguồn: «đọc email khách A rồi soạn nháp trả lời theo giọng công ty»."
        ]},
        { h: "Riêng tư & quyền", p: [
          "Chỉ kết nối dịch vụ bạn tin tưởng và cấp phạm vi tối thiểu. Connectors xây trên chuẩn mở MCP — cùng nền tảng giúp hệ sinh thái công cụ cho Claude ngày càng phong phú."
        ]}
      ],
      takeaways: [
        "Connectors nối Claude với Gmail, Drive, Calendar, Notion, Slack.",
        "Bật trong Settings, cấp quyền tối thiểu, rồi giao việc bằng lời thường.",
        "Xây trên chuẩn mở MCP; chỉ kết nối dịch vụ bạn tin tưởng."
      ]
    },
    {
      id: "tce-3", title: "Ghép Skills + Connectors thành quy trình tự động", time: "8 phút", art: "share", art2: "workflow",
      sections: [
        { h: "Khi hai thứ gặp nhau", p: [
          "Connectors cho Claude KHẢ NĂNG chạm tới dữ liệu; Skills dạy Claude CÁCH xử lý dữ liệu đó. Ghép lại bạn có quy trình tự động gần như một nhân viên thật."
        ]},
        { h: "Ví dụ thực tế", list: [
          "Connector Gmail + Skill «phân loại & soạn nháp» → mỗi sáng tóm tắt hộp thư và gợi ý trả lời.",
          "Connector Drive + Skill «báo cáo chuẩn» → tự dựng báo cáo từ số liệu mới.",
          "Connector Calendar + Skill «chuẩn bị họp» → tóm tắt tài liệu trước mỗi cuộc họp."
        ]},
        { h: "Chia sẻ cho cả nhóm", p: [
          "Skill có thể commit vào kho chung hoặc đóng gói thành plugin để cả nhóm dùng nhất quán — biến bí quyết cá nhân thành tài sản chung của đội."
        ]}
      ],
      takeaways: [
        "Connectors = khả năng chạm dữ liệu; Skills = cách xử lý dữ liệu.",
        "Ghép lại tạo quy trình tự động: tóm tắt email, dựng báo cáo, chuẩn bị họp.",
        "Chia sẻ skill cho cả nhóm để làm việc nhất quán."
      ]
    }
  ],
  quiz: [
    { q: "Khi nào nên đóng gói một việc thành Skill?", options: ["Việc làm một lần", "Quy trình bạn lặp lại thường xuyên và phải nhắc Claude mỗi lần", "Việc đơn giản", "Không bao giờ"], a: 1, expl: "Skill xoá bỏ việc nhắc lại quy trình mỗi lần." },
    { q: "Phần quan trọng nhất của SKILL.md là gì?", options: ["Tên ngắn", "Mô tả: nêu rõ skill làm gì và KHI NÀO dùng", "Màu sắc", "Độ dài"], a: 1, expl: "Claude đọc mô tả để quyết định khi nào kích hoạt skill." },
    { q: "Connectors cho phép Claude làm gì?", options: ["Chỉ đọc web", "Truy cập Gmail, Drive, Calendar, Notion, Slack của bạn", "Gọi điện", "In ấn"], a: 1, expl: "Sau khi kết nối, bạn giao việc trên dữ liệu thật bằng lời thường." },
    { q: "Connectors được xây trên chuẩn nào?", options: ["FTP", "MCP (chuẩn mở)", "HTTP thuần", "Bluetooth"], a: 1, expl: "MCP là nền tảng mở giúp hệ sinh thái công cụ phong phú." },
    { q: "Ghép Skills + Connectors tạo ra điều gì?", options: ["Không gì đặc biệt", "Quy trình tự động: Connectors lấy dữ liệu, Skills xử lý theo cách của bạn", "Chỉ chậm hơn", "Lỗi"], a: 1, expl: "Khả năng chạm dữ liệu + cách xử lý = quy trình gần như nhân viên thật." }
  ],
  cards: [
    { front: "Skill để làm gì?", back: "Đóng gói quy trình lặp lại để Claude tự áp dụng, khỏi nhắc mỗi lần." },
    { front: "SKILL.md gồm gì?", back: "Tên + mô tả (khi nào dùng) + hướng dẫn từng bước; tuỳ chọn template/script." },
    { front: "Connectors nối gì?", back: "Gmail, Google Drive/Calendar, Notion, Slack... qua chuẩn mở MCP." },
    { front: "Skills vs Connectors?", back: "Connectors = khả năng chạm dữ liệu; Skills = cách xử lý dữ liệu đó." },
    { front: "Ví dụ ghép?", back: "Gmail + skill phân loại → tóm tắt & gợi ý trả lời thư mỗi sáng." }
  ]
},

// ════════════════════════ 6. CLAUDE CHO NHÓM & SỰ NGHIỆP ════════════════════════
{
  id: "tc-career", track: "power", emoji: "🏢", color: "#B45309",
  title: "Claude cho Nhóm & Sự nghiệp",
  subtitle: "Triển khai Claude cho cả đội và lấy chứng chỉ để ghi điểm sự nghiệp.",
  level: "Nâng cao", duration: "≈ 30 phút",
  lessons: [
    {
      id: "tcr-1", title: "Claude cho team & doanh nghiệp", time: "9 phút", art: "team", art2: "delegate",
      sections: [
        { h: "Vì sao team nên dùng chung", p: [
          "Khi cả đội dùng Claude, giá trị lớn nhất không phải mỗi người tự hỏi, mà là CHIA SẺ tài sản: Projects chung cho dự án, Skills chuẩn hoá quy trình, và kho prompt mẫu của team. Một người tìm ra cách hay, cả đội hưởng lợi."
        ]},
        { h: "Gói cho tổ chức", list: [
          "Team/Enterprise có quản trị người dùng, bảo mật và quyền riêng tư cấp doanh nghiệp.",
          "Enterprise Search giúp Claude tìm trong kho tài liệu nội bộ công ty.",
          "Dữ liệu doanh nghiệp không bị dùng để huấn luyện."
        ]},
        { h: "Bắt đầu triển khai", p: [
          "Khởi đầu nhỏ: chọn một quy trình tốn thời gian (vd báo cáo, trả lời khách), chuẩn hoá thành Project + Skill, đo kết quả, rồi nhân rộng. Đào tạo đội theo khung tư duy: giao đúng việc, mô tả rõ, kiểm chứng kết quả."
        ]}
      ],
      takeaways: [
        "Giá trị team = chia sẻ Projects, Skills và prompt mẫu chung.",
        "Gói tổ chức có quản trị, bảo mật, Enterprise Search; không bị huấn luyện trên dữ liệu.",
        "Triển khai từ một quy trình nhỏ, đo kết quả rồi nhân rộng."
      ]
    },
    {
      id: "tcr-2", title: "Lấy chứng chỉ Claude — ghi điểm sự nghiệp", time: "9 phút", art: "cert", art2: "checklist",
      sections: [
        { h: "Vì sao nên có chứng chỉ", p: [
          "Anthropic Academy cấp chứng chỉ miễn phí khi bạn hoàn thành khoá và vượt bài kiểm tra. Đây là bằng chứng kỹ năng AI để ghi vào CV, hồ sơ LinkedIn — ngày càng được nhà tuyển dụng coi trọng."
        ]},
        { h: "Lộ trình đậu chắc", list: [
          "Học hết bài của khoá tương ứng trong app này (cả hai giáo trình).",
          "Làm quiz đến khi đạt trên 80%; dùng «Ôn tập thông minh» để xoá điểm yếu.",
          "Vào anthropic.skilljar.com, hoàn thành khoá và làm bài kiểm tra cuối.",
          "Đăng ký thi ngay khi kiến thức còn nóng — đừng để nguội."
        ]},
        { h: "Sau khi có chứng chỉ", p: [
          "Đừng dừng ở tấm bằng. Áp dụng ngay vào công việc thật, xây vài Skill/Project cho riêng mình — đó mới là thứ chứng minh năng lực bền vững."
        ]}
      ],
      takeaways: [
        "Chứng chỉ Anthropic miễn phí, ghi được vào CV/LinkedIn.",
        "Lộ trình: học hết bài → quiz ≥80% → ôn điểm yếu → thi khi còn nóng.",
        "Sau chứng chỉ, áp dụng thật và xây Skill/Project của riêng bạn."
      ]
    }
  ],
  quiz: [
    { q: "Giá trị lớn nhất khi cả team dùng Claude?", options: ["Mỗi người tự hỏi riêng", "Chia sẻ Projects, Skills, prompt mẫu — một người giỏi cả đội hưởng lợi", "Dùng ít hơn", "Cạnh tranh nhau"], a: 1, expl: "Tài sản dùng chung giúp cả đội làm việc nhất quán và nhanh hơn." },
    { q: "Tính năng nào giúp Claude tìm trong tài liệu nội bộ công ty?", options: ["Web Search", "Enterprise Search", "Google", "Artifacts"], a: 1, expl: "Enterprise Search dành cho kho tài liệu nội bộ doanh nghiệp." },
    { q: "Chứng chỉ Anthropic Academy có đặc điểm gì?", options: ["Trả phí cao", "Miễn phí, ghi được vào CV/LinkedIn", "Chỉ cho lập trình viên", "Hết hạn nhanh"], a: 1, expl: "Hoàn thành khoá + vượt bài kiểm tra là nhận chứng chỉ miễn phí." },
    { q: "Lộ trình đậu chứng chỉ chắc nhất?", options: ["Thi luôn không học", "Học hết bài → quiz ≥80% → ôn điểm yếu → thi khi còn nóng", "Học một bài rồi thi", "Nhờ người khác"], a: 1, expl: "Chuẩn bị kỹ và thi khi kiến thức còn mới giúp đậu chắc." },
    { q: "Nên triển khai Claude cho tổ chức thế nào?", options: ["Bắt cả công ty dùng ngay", "Bắt đầu từ một quy trình nhỏ, đo kết quả rồi nhân rộng", "Không cần kế hoạch", "Chỉ sếp dùng"], a: 1, expl: "Khởi đầu nhỏ, chuẩn hoá thành Project+Skill, đo lường rồi mở rộng." }
  ],
  cards: [
    { front: "Giá trị Claude cho team?", back: "Chia sẻ Projects, Skills, prompt mẫu chung — một người giỏi cả đội hưởng lợi." },
    { front: "Enterprise Search?", back: "Cho Claude tìm trong kho tài liệu nội bộ của doanh nghiệp." },
    { front: "Chứng chỉ Anthropic?", back: "Miễn phí khi hoàn thành khoá + vượt bài kiểm tra; ghi được vào CV/LinkedIn." },
    { front: "Lộ trình đậu chứng chỉ?", back: "Học hết bài → quiz ≥80% → ôn điểm yếu → thi khi kiến thức còn nóng." },
    { front: "Triển khai cho tổ chức?", back: "Bắt đầu từ một quy trình nhỏ, chuẩn hoá Project+Skill, đo kết quả rồi nhân rộng." }
  ]
},

// ════════════════════════ 7. LÀM CHỦ CLAUDE CODE (PRO) ════════════════════════
{
  id: "tc-ccpro", track: "power", emoji: "🛠️", color: "#475569",
  title: "Làm chủ Claude Code (Pro)",
  subtitle: "10 năng lực nâng cao: slash command, memory, skills, subagents, MCP, hooks, plugins, checkpoints.",
  level: "Chuyên sâu", duration: "≈ 55 phút",
  lessons: [
    {
      id: "tccp-1", title: "Slash commands & Memory (CLAUDE.md)", time: "11 phút", art: "custom", art2: "claudemd",
      sections: [
        { h: "Slash command — lệnh tắt của riêng bạn", p: [
          "Tạo file markdown trong thư mục .claude/commands/ — mỗi file thành một lệnh /tên-file. Trong file là quy trình bạn muốn Claude làm; dùng $ARGUMENTS để nhận tham số.",
          "Ví dụ file optimize.md mô tả các bước tối ưu code → gõ /optimize là Claude chạy đúng quy trình đó. Hợp với mọi việc bạn lặp lại: /pr (tạo pull request), /generate-api-docs (sinh tài liệu API)."
        ]},
        { h: "Memory — CLAUDE.md tự nạp mỗi phiên", p: [
          "CLAUDE.md là bộ nhớ dự án: lệnh build/test, quy ước code, cấu trúc thư mục, điều cần tránh. Tự nạp đầu mỗi phiên nên Claude luôn «nhớ» bối cảnh.",
          "Có ba cấp: cá nhân (~/.claude/CLAUDE.md, áp dụng mọi dự án), dự án (commit chung cho team), và thư mục con (quy ước riêng cho từng phần repo). Gõ /init để tạo bản đầu; gõ # trước ghi chú để thêm nhanh."
        ]},
        { h: "Vì sao đây là nền tảng", p: [
          "Slash command + Memory là hai thứ đầu tiên nên thiết lập: chúng biến Claude Code từ công cụ chung thành công cụ hiểu đúng dự án và quy trình của bạn — mọi tính năng nâng cao sau đều dựa trên nền này."
        ]}
      ],
      takeaways: [
        "Slash command = file .md trong .claude/commands/ thành lệnh /tên, dùng $ARGUMENTS.",
        "CLAUDE.md tự nạp mỗi phiên: lệnh, quy ước, điều cần tránh; 3 cấp cá nhân/dự án/thư mục.",
        "/init tạo CLAUDE.md, gõ # để thêm ghi nhớ nhanh."
      ]
    },
    {
      id: "tccp-2", title: "Skills & Subagents", time: "11 phút", art: "skillfolder", art2: "delegate",
      sections: [
        { h: "Skills — năng lực tự kích hoạt", p: [
          "Skill là thư mục chứa SKILL.md (mô tả + hướng dẫn) kèm script/template. Claude tự nạp khi gặp việc khớp mô tả — ví dụ code-review-specialist, brand-voice, doc-generator. Nhờ progressive disclosure, bạn cài nhiều skill mà không tốn ngữ cảnh."
        ]},
        { h: "Subagents — trợ lý chuyên biệt", p: [
          "Subagent là agent con (trong .claude/agents/) với prompt và quyền riêng, chạy trong ngữ cảnh tách biệt. Ví dụ: code-reviewer, test-engineer, documentation-writer, secure-reviewer. Claude chính giao việc phù hợp cho chúng và giữ ngữ cảnh chính sạch sẽ."
        ]},
        { h: "Skill khác Subagent thế nào?", list: [
          "Skill = KIẾN THỨC/quy trình đóng gói, tự nạp vào phiên hiện tại.",
          "Subagent = NGƯỜI THỰC THI riêng, có ngữ cảnh và công cụ độc lập.",
          "Phối hợp: subagent «secure-reviewer» có thể dùng skill kiểm tra bảo mật để soi code."
        ]}
      ],
      takeaways: [
        "Skill: thư mục SKILL.md tự kích hoạt theo mô tả; cài nhiều không tốn ngữ cảnh.",
        "Subagent: agent con chuyên biệt, ngữ cảnh riêng, giữ ngữ cảnh chính sạch.",
        "Skill là quy trình đóng gói; subagent là người thực thi độc lập."
      ]
    },
    {
      id: "tccp-3", title: "MCP & Hooks", time: "12 phút", art: "mcp", art2: "gearbolt",
      sections: [
        { h: "MCP — nối Claude Code với hệ thống ngoài", p: [
          "Lệnh claude mcp add kết nối Claude Code với MCP server: GitHub, database, filesystem, trình duyệt... Claude khi đó dùng được các công cụ này như công cụ có sẵn — đọc schema, chạy query, thao tác repo."
        ]},
        { h: "Hooks — tự động hoá đảm bảo 100%", p: [
          "Hooks là script chạy tự động tại các sự kiện trong vòng đời phiên (hệ thống có khoảng 30 sự kiện). Quan trọng nhất: PreToolUse (trước khi dùng tool — chặn/sửa được), PostToolUse (sau khi dùng — thêm phản hồi), UserPromptSubmit, Stop, SessionStart/End.",
          "Có 5 loại hook: command (chạy lệnh shell), HTTP (gọi webhook), prompt (để mô hình tự đánh giá), MCP tool (gọi tool MCP), và agent (sinh subagent đánh giá nhiều bước)."
        ]},
        { h: "Ví dụ: quét bảo mật tự động", p: [
          "Một hook PostToolUse khớp Write|Edit sẽ chạy mỗi khi Claude ghi/sửa file: dò chuỗi giống API key bị hardcode rồi cảnh báo ngay. Quy tắc vàng: việc BẮT BUỘC phải xảy ra (format, quét bảo mật, chạy test) → dùng hook, đừng dựa vào việc nhắc Claude «nhớ»."
        ]}
      ],
      takeaways: [
        "claude mcp add nối Claude Code với GitHub, database, filesystem, browser.",
        "Hooks chạy tự động tại ~30 sự kiện; 5 loại: command, HTTP, prompt, MCP tool, agent.",
        "Việc bắt buộc phải xảy ra → dùng hook (PreToolUse/PostToolUse), không dựa vào lời nhắc."
      ]
    },
    {
      id: "tccp-4", title: "Plugins & Checkpoints", time: "11 phút", art: "puzzle", art2: "rewind",
      sections: [
        { h: "Plugins — đóng gói trọn bộ quy trình", p: [
          "Plugin gói nhiều thành phần lại với nhau: slash commands + subagents + skills + hooks + cấu hình MCP — thành một giải pháp hoàn chỉnh cho một quy trình. Ví dụ: plugin pr-review, devops-automation, documentation. Cài một lần là cả nhóm có đủ công cụ chuẩn cho quy trình đó."
        ]},
        { h: "Checkpoints — ảnh chụp phiên & quay lui", p: [
          "Claude Code tự tạo checkpoint ở mỗi lượt prompt, lưu tới 30 ngày. Bấm Esc hai lần hoặc gõ /rewind để quay lui, với 5 lựa chọn: khôi phục cả code và hội thoại, chỉ hội thoại, chỉ code, tóm tắt từ điểm này, hoặc huỷ."
        ]},
        { h: "Dùng checkpoint để thử nghiệm an toàn", list: [
          "So sánh phương án: lưu mốc, thử cách A, quay lui, thử cách B.",
          "Refactor yên tâm: lỗi test thì quay về trước khi refactor.",
          "Phục hồi nhanh khi có gì đó hỏng.",
          "Lưu ý: checkpoint KHÔNG bắt thao tác ngoài như rm, mv, cp — dùng git cho phiên bản vĩnh viễn."
        ]}
      ],
      takeaways: [
        "Plugin gói commands + subagents + skills + hooks + MCP thành giải pháp trọn bộ cho team.",
        "Checkpoints tự lưu mỗi lượt (30 ngày); /rewind có 5 lựa chọn khôi phục.",
        "Checkpoint không bắt rm/mv/cp — vẫn cần git cho phiên bản vĩnh viễn."
      ]
    },
    {
      id: "tccp-5", title: "Tính năng nâng cao, CLI & quy trình thực tế", time: "10 phút", art: "plan-mode", art2: "terminal",
      sections: [
        { h: "Các tính năng nâng cao", list: [
          "Planning mode: Claude lập kế hoạch để bạn duyệt trước khi động vào code.",
          "Extended thinking: cho mô hình suy luận sâu hơn với việc khó.",
          "Background tasks: chạy việc dài ở nền.",
          "Headless mode: claude -p \"lệnh\" để chạy không tương tác trong script/CI."
        ]},
        { h: "CLI — đưa Claude Code vào pipeline", p: [
          "Giao diện dòng lệnh cho phép tự động hoá: phân loại issue, lint theo quy ước riêng, sinh changelog, chạy trong GitHub Actions. Đây là nền để biến Claude Code thành một mắt xích trong quy trình tự động của đội."
        ]},
        { h: "Ghép tất cả: quy trình thực tế", p: [
          "Sức mạnh thật đến từ phối hợp. Ví dụ «review code tự động» = slash command khởi động + subagent chuyên review + memory (quy ước team) + MCP (đọc GitHub). «Triển khai DevOps» = plugin + MCP + hooks. Bắt đầu từ một quy trình bạn lặp lại, chuẩn hoá dần bằng các năng lực trên."
        ]}
      ],
      takeaways: [
        "Nâng cao: planning mode, extended thinking, background tasks, headless (claude -p).",
        "CLI đưa Claude Code vào script/CI: phân loại issue, lint, changelog, GitHub Actions.",
        "Quy trình mạnh = ghép nhiều năng lực: command + subagent + memory + MCP + hooks."
      ]
    }
  ],
  quiz: [
    { q: "Slash command tuỳ chỉnh được tạo bằng cách nào?", options: ["Sửa mã nguồn Claude", "Tạo file markdown trong .claude/commands/", "Đăng ký online", "Viết plugin C++"], a: 1, expl: "Mỗi file .md trong .claude/commands/ thành một lệnh /tên-file; dùng $ARGUMENTS để nhận tham số." },
    { q: "CLAUDE.md có vai trò gì?", options: ["Chứa API key", "Bộ nhớ dự án tự nạp mỗi phiên: lệnh, quy ước, cấu trúc", "File log", "Mã nguồn"], a: 1, expl: "Tạo bằng /init, thêm nhanh bằng #; có 3 cấp cá nhân/dự án/thư mục." },
    { q: "Skill khác Subagent thế nào?", options: ["Giống nhau", "Skill = quy trình đóng gói tự nạp; Subagent = người thực thi có ngữ cảnh riêng", "Skill chậm hơn", "Subagent chỉ đọc code"], a: 1, expl: "Skill là kiến thức/quy trình; subagent là agent con độc lập." },
    { q: "Khi một việc BẮT BUỘC phải xảy ra (vd quét bảo mật sau mỗi lần sửa file)?", options: ["Nhắc Claude trong prompt", "Dùng hook (PostToolUse) để chạy tự động", "Ghi vào README", "Hỏi lại mỗi lần"], a: 1, expl: "Hook đảm bảo 100%; lời nhắc có thể bị bỏ sót." },
    { q: "Có mấy loại hook trong Claude Code?", options: ["1", "3", "5 (command, HTTP, prompt, MCP tool, agent)", "10"], a: 2, expl: "5 loại hook, chạy tại khoảng 30 sự kiện trong vòng đời phiên." },
    { q: "Checkpoints và /rewind dùng để làm gì?", options: ["Xoá dự án", "Quay lui về trạng thái trước: code/hội thoại — thử nghiệm an toàn", "Tăng tốc", "Đổi model"], a: 1, expl: "Tự lưu mỗi lượt (30 ngày), 5 lựa chọn khôi phục; không bắt rm/mv/cp nên vẫn cần git." },
    { q: "Lệnh nào chạy Claude Code không tương tác trong CI?", options: ["claude --fast", "claude -p \"lệnh\" (headless)", "claude run", "claude auto"], a: 1, expl: "Headless mode đưa Claude Code vào script và pipeline tự động." },
    { q: "Plugin là gì?", options: ["Một loại model", "Gói trọn bộ commands + subagents + skills + hooks + MCP cho một quy trình", "File ảnh", "Trình duyệt"], a: 1, expl: "Cài một lần là cả nhóm có đủ công cụ chuẩn cho quy trình đó." }
  ],
  cards: [
    { front: "Slash command tạo thế nào?", back: "File .md trong .claude/commands/ → lệnh /tên-file; dùng $ARGUMENTS nhận tham số." },
    { front: "CLAUDE.md?", back: "Bộ nhớ dự án tự nạp mỗi phiên (lệnh, quy ước, điều tránh). /init tạo, # thêm nhanh; 3 cấp." },
    { front: "Skill vs Subagent?", back: "Skill = quy trình đóng gói tự nạp; Subagent = agent con có ngữ cảnh & quyền riêng." },
    { front: "5 loại hook?", back: "command, HTTP, prompt, MCP tool, agent — chạy tại ~30 sự kiện (PreToolUse, PostToolUse, Stop...)." },
    { front: "Khi nào dùng hook?", back: "Việc BẮT BUỘC phải xảy ra (format, quét bảo mật, test) — đảm bảo 100%, không dựa vào lời nhắc." },
    { front: "Checkpoints / rewind?", back: "Tự lưu mỗi lượt (30 ngày); /rewind hoặc Esc×2; 5 lựa chọn khôi phục. Không bắt rm/mv/cp." },
    { front: "Plugin?", back: "Gói commands + subagents + skills + hooks + MCP thành giải pháp trọn bộ cho một quy trình." },
    { front: "Headless mode?", back: "claude -p \"lệnh\" — chạy không tương tác trong script/CI (lint, phân loại issue, changelog)." }
  ]
}
];

// Gắn examUrl + videos cho giáo trình thực chiến, rồi nối vào danh sách khoá chung
const THUCCHIEN_EXAM = "https://anthropic.skilljar.com/";
const THUCCHIEN_VIDEOS = {
  "tc-cowork": [{ id: "uFO9EAPINWo", title: "Mastering Claude Code — Visual Breakdown", by: "Anthropic" }],
  "tc-writing": [{ id: "ysPbXH0LpIE", title: "Prompting 101", by: "Anthropic · Code w/ Claude" }],
  "tc-extend": [{ id: "CEvIs9y1uog", title: "Don't Build Agents, Build Skills Instead", by: "Anthropic" }],
  "tc-ccpro": [{ id: "gv0WHhKelSE", title: "Claude Code best practices", by: "Anthropic · Code w/ Claude" }]
};
for (const c of COURSES_THUCCHIEN) {
  c.examUrl = c.examUrl || THUCCHIEN_EXAM;
  c.videos = THUCCHIEN_VIDEOS[c.id] || [];
  COURSES.push(c);
}
