# Business Rules (BR)

**AI Chatbot với Google Gemini API**

```text
Version : 1.1
Status  : FROZEN
Date    : 31/01/2026
Owner   : BrSE Dang
Input   : System Requirements v1.1, Use Case Spec v1.0
```

## 1. Mục tiêu

Tài liệu Business Rules định nghĩa các quy tắc nghiệp vụ (ràng buộc, điều kiện, giới hạn, hành vi hệ thống) để thống nhất cách hiểu giữa BrSE/Dev/QA và làm chuẩn cho thiết kế – triển khai – kiểm thử.

## 2. Phạm vi áp dụng
Các rule trong tài liệu này áp dụng cho các use case:
- UC-01 Mở/Đóng chatbot
- UC-02 Tin nhắn chào mừng
- UC-03 Gửi câu hỏi văn bản
- UC-04 Gửi câu hỏi kèm ảnh (Vision)
- UC-05 Emoji picker
- UC-06 Thinking indicator
- UC-07 Lưu/khôi phục lịch sử chat
- UC-08 Xử lý lỗi
- UC-09 Giới hạn upload ảnh
- UC-10 Auto-detect ngôn ngữ

## 3. Định nghĩa / Thuật ngữ
- **Message**: một phần tử hội thoại hiển thị trong chat body (user-message hoặc bot-message).
- **Chat history**: danh sách message dùng để hiển thị UI và (tuỳ triển khai) gửi làm ngữ cảnh cho AI.
- **Thinking indicator**: bubble bot hiển thị trạng thái đang xử lý (3 chấm).
- **Attachment**: ảnh người dùng đính kèm trong tin nhắn.
- **Proxy API**: server/proxy giữ API key khi triển khai production.

## 4. Business Rules

Bảng tổng hợp Business Rules:

| No. | BR-ID | Đối tượng | Mô tả ngắn | Áp dụng cho Use Case | Trace đến System Req |
|-----|--------|-----------|------------|----------------------|----------------------|
| 1   | BR-UI-01 | UI/Trạng thái | Trạng thái chatbot (Open / Close) | UC-01 | SR-01, SR-02 |
| 2   | BR-UI-02 | UI/Trạng thái | Auto-scroll | UC-03, UC-04, UC-06, UC-08 | SR-02 |
| 3   | BR-UI-03 | UI/Trạng thái | One request → one bot response bubble | UC-03, UC-04, UC-06, UC-08 | SR-04, SR-10, SR-11 |
| 4   | BR-IN-01 | Input/Gửi tin nhắn | Điều kiện được phép gửi (Send condition) | UC-03, UC-04 | SR-04, SR-07, SR-08 |
| 5   | BR-IN-02 | Input/Gửi tin nhắn | Hành vi Enter / Shift+Enter | UC-03 | SR-04 |
| 6   | BR-IN-03 | Input/Gửi tin nhắn | Reset input sau khi submit | UC-03, UC-04 | SR-04, SR-05 |
| 7   | BR-FILE-01 | Attachment | Định dạng ảnh hợp lệ | UC-09 | SR-13 |
| 8   | BR-FILE-02 | Attachment | Giới hạn dung lượng ảnh | UC-09 | SR-13 |
| 9   | BR-FILE-03 | Attachment | Preview ảnh | UC-04 | SR-07 |
| 10  | BR-FILE-04 | Attachment | Cancel ảnh | UC-04 | SR-07 |
| 11  | BR-FILE-05 | Attachment | Encode ảnh | UC-04 | SR-08 |
| 12  | BR-FILE-06 | Attachment | Reset ảnh sau khi submit | UC-04 | SR-07, SR-08 |
| 13  | BR-AI-01 | AI Request/Response | Nội dung gửi AI (parts) | UC-03, UC-04 | SR-05, SR-08 |
| 14  | BR-AI-02 | AI Request/Response | Chat history làm ngữ cảnh (FROZEN) | UC-03, UC-04, UC-07 | SR-05, SR-12 |
| 15  | BR-AI-03 | AI Request/Response | Auto-detect ngôn ngữ | UC-10 | SR-14 |
| 16  | BR-AI-04 | AI Request/Response | Làm sạch format hiển thị | UC-03, UC-04 | SR-06 |
| 17  | BR-TH-01 | Thinking Indicator | Hiển thị thinking | UC-06 | SR-10 |
| 18  | BR-TH-02 | Thinking Indicator | Thinking phải kết thúc | UC-06, UC-08 | SR-10, SR-11 |
| 19  | BR-TH-03 | Thinking Indicator | Timeout (FROZEN) | UC-06, UC-08 | SR-10, SR-11 |
| 20  | BR-LS-01 | Lưu lịch sử (localStorage) | Key và format | UC-07 | SR-12 |
| 21  | BR-LS-02 | Lưu lịch sử (localStorage) | Thời điểm lưu | UC-07 | SR-12 |
| 22  | BR-LS-03 | Lưu lịch sử (localStorage) | Khôi phục lịch sử | UC-07 | SR-12 |
| 23  | BR-LS-04 | Lưu lịch sử (localStorage) | Giới hạn dung lượng lưu trữ | UC-07 | SR-12 |
| 24  | BR-LS-05 | Lưu lịch sử (localStorage) | Không lưu base64 | UC-07 | SR-12 |
| 25  | BR-ERR-01 | Xử lý lỗi | Hiển thị lỗi rõ ràng | UC-08 | SR-11 |
| 26  | BR-ERR-02 | Xử lý lỗi | Thinking kết thúc khi lỗi | UC-08 | SR-10, SR-11 |
| 27  | BR-ERR-03 | Xử lý lỗi | Timeout xử lý lỗi | UC-08 | SR-10, SR-11 |

### 4.1 Rules về UI / Trạng thái Chatbot

#### BR-UI-01: Trạng thái chatbot (Open / Close)
- Chatbot có hai trạng thái: CLOSED và OPEN
- Click chatbot toggler sẽ toggle trạng thái CLOSED ↔ OPEN
- Click nút close trong header chỉ thực hiện OPEN → CLOSED
- Đóng chatbot không được xoá lịch sử chat trên UI

**Applies to**: UC-01
**Trace**: SR-01, SR-02

#### BR-UI-02: Auto-scroll

- Sau khi thêm message mới (user hoặc bot), chat body phải auto-scroll xuống cuối

- v1: luôn auto-scroll, không hỗ trợ giữ vị trí scroll

**Applies to**: UC-03, UC-04, UC-06, UC-08
**Trace**: SR-02

#### BR-UI-03: One request → one bot response bubble

-  Mỗi lần user submit tạo đúng:
  - 01 user-message
  - 01 bot-message
- Bot-message ban đầu là thinking indicator, sau đó phải được replace bằng response hoặc error

**Applies to**: UC-03, UC-04, UC-06, UC-08
**Trace**: SR-04, SR-10, SR-11

### 4.2 Rules về Input / Gửi tin nhắn

#### BR-IN-01: Điều kiện được phép gửi (Send condition)

- Không gửi request nếu:

  - Text rỗng và không có attachment

- Được phép gửi nếu:

  - Có text (không rỗng), hoặc
  - Có attachment (image-only), hoặc
  - Có cả text + attachment

**Applies to**: UC-03, UC-04
**Trace**: SR-04, SR-07, SR-08

#### BR-IN-02: Hành vi Enter / Shift+Enter

- Desktop:
  - `Enter` → gửi message (khi thoả BR-IN-01)
  - `Shift+Enter `→ xuống dòng, không gửi
- Mobile:
  - Không bắt buộc Enter để gửi
  - Ưu tiên gửi bằng nút Send

**Applies to**: UC-03
**Trace**: SR-04

#### BR-IN-03: Reset input sau khi submit

- Sau khi submit thành công:
  - Clear nội dung textarea
  - Reset chiều cao textarea về mặc định
- Attachment xử lý theo BR-FILE-06

**Applies to**: UC-03, UC-04
**Trace**: SR-04, SR-05

### 4.3 Rules về Attachment (Upload ảnh)

#### BR-FILE-01: Định dạng ảnh hợp lệ

Chỉ chấp nhận:

- `image/png`
- `image/jpeg` (jpg / jpeg)
- `image/webp`

**Applies to**: UC-09
**Trace**: SR-13

#### BR-FILE-02: Giới hạn dung lượng ảnh

- Dung lượng ảnh phải ≤ 5MB
- Nếu vượt quá:
  - Reject tại client
  - Không gọi AI API

**Applies to**: UC-09
**Trace**: SR-13

#### BR-FILE-03: Preview ảnh

- Khi chọn ảnh hợp lệ:
  - Hiển thị preview thumbnail
  - Trạng thái file-uploaded = true
- Preview không đồng nghĩa với gửi

**Applies to**: UC-04
**Trace**: SR-07

#### BR-FILE-04: Cancel ảnh

- Khi user bấm cancel:
  - Xoá preview
  - Xoá dữ liệu base64 và mimeType trong bộ nhớ
  - Trạng thái file-uploaded = false

**Applies to**: UC-04  
**Trace**: SR-07

#### BR-FILE-05: Encode ảnh

- Ảnh phải được encode base64 (không kèm prefix `data:...;base64,` trong payload gửi AI).
- Payload gửi AI phải gồm `data` (base64 string) và `mimeType`.

**Applies to**: UC-04
**Trace**: SR-08

#### BR-FILE-06: Reset ảnh sau khi submit

- Sau khi user submit:
  - Attachment phải reset (để tránh gửi nhầm lần sau).
  - UI xoá preview và trạng thái file-uploaded.

**Applies to**: UC-04  
**Trace**: SR-07, SR-08

### 4.4 Rules về AI Request / Response

#### BR-AI-01: Nội dung gửi AI (parts)

- Gửi text bằng `{ text: <string> }`
- Nếu có ảnh, thêm `{ inlineData: { data: <base64>, mimeType: <mime> } }`
- Thứ tự parts: text trước, ảnh sau (ưu tiên readability).

**Applies to**: UC-03, UC-04  
**Trace**: SR-05, SR-08

#### BR-AI-02: Chat history làm ngữ cảnh (FROZEN)

- v1: Toàn bộ chatHistory phải được gửi làm context cho AI

- Chat history gồm:
  - role: user / model
  - text content
  - attachment (nếu có)
- Thinking indicator không được gửi làm context

**Applies to**: UC-03, UC-04, UC-07
**Trace**: SR-05, SR-12

#### BR-AI-03: Auto-detect ngôn ngữ

- Bot mặc định tiếng Anh.
- Khi user gửi message bằng ngôn ngữ khác (VI/JP…):
  - AI được kỳ vọng phản hồi cùng ngôn ngữ.
- (Optional) Có thể bổ sung system instruction trong prompt để “reply in user's language”.

**Applies to**: UC-10  
**Trace**: SR-14

#### BR-AI-04: Làm sạch format hiển thị

- Response có thể chứa markdown.
- v1 chỉ cần xử lý cơ bản:
  - Bỏ `**bold**` → `bold`
  - Giữ xuống dòng

**Applies to**: UC-03, UC-04  
**Trace**: SR-06

### 4.5 Rules về Thinking Indicator

#### BR-TH-01: Hiển thị thinking

- Sau khi submit và trước khi có response, phải hiển thị thinking indicator

**Applies to**: UC-06  
**Trace**: SR-10

#### BR-TH-02: Thinking phải kết thúc

Thinking bubble phải bị xoá/replace trong mọi trường hợp:
- AI trả lời thành công → replace bằng text response
- AI trả lỗi / network lỗi → replace bằng error message

**Applies to**: UC-06, UC-08  
**Trace**: SR-10, SR-11

#### BR-TH-03: Timeout (FROZEN)

- Timeout cho AI request: 5 giây
- Nếu vượt timeout:
  - Remove thinking indicator
  - Hiển thị lỗi “Request timeout”

**Applies to**: UC-06, UC-08  
**Trace**: SR-10, SR-11

### 4.6 Rules về Lưu lịch sử (localStorage)

#### BR-LS-01: Key và format

- localStorage key: `chatHistory`
- Value: JSON array gồm:
  - role: `user` | `model`
  - text: string
  - attachment (chỉ lưu text; không lưu base64)

**Applies to**: UC-07  
**Trace**: SR-12

#### BR-LS-02: Thời điểm lưu

- Lưu sau khi:
  - Append user-message
  - Append bot-message (response hoặc error) 

**Applies to**: UC-07  
**Trace**: SR-12

#### BR-LS-03: Khôi phục lịch sử

- Khi load trang:
  - Nếu localStorage có `chatHistory` hợp lệ → render lại toàn bộ chat body theo thứ tự.
  - Nếu parse lỗi → clear key và bắt đầu mới.

**Applies to**: UC-07  
**Trace**: SR-12

#### BR-LS-04: Giới hạn dung lượng (FROZEN)

v1:
- localStorage giới hạn khoảng 5MB.
- Chỉ lưu 50 message gần nhất
- Không lưu attachment base64 trong localStorage
- Khi vượt giới hạn:
 - Xoá message cũ nhất trước

**Applies to**: UC-07  
**Trace**: SR-12, NFR-04

#### BR-LS-05: Không lưu dữ liệu nhạy cảm

- Không lưu API key, token hay thông tin định danh nhạy cảm trong localStorage.
- Nếu người dùng nhập thông tin nhạy cảm, hệ thống không có trách nhiệm lọc (out of scope), nhưng không được tự động thu thập thêm.

**Applies to**: UC-07  
**Trace**: NFR-01

### 4.7 Rules về Error Handling

#### BR-ERR-01: Phân loại lỗi

- Các nhóm lỗi tối thiểu:
  - Network error
  - API error (4xx/5xx)
  - Quota exceeded
  - Invalid API key
  - Request timeout

**Applies to**: UC-08  
**Trace**: SR-11

#### BR-ERR-02: Error message thân thiện

- Error message phải dễ hiểu, ngắn gọn, không expose thông tin nội bộ.
- Dev log chi tiết ở console để debug.

**Applies to**: UC-08
**Trace**: SR-11

#### BR-ERR-03: Lỗi không được làm crash UI

- Khi lỗi xảy ra:
  - Thinking bubble phải kết thúc (BR-TH-02)
  - Chatbot vẫn cho phép gửi message tiếp theo

**Applies to**: UC-08  
**Trace**: SR-10, SR-11

## 5. Mapping BR ↔ UC ↔ SR

| BR-ID | Use Case | System Req |
|------|----------|------------|
| BR-UI-01 | UC-01 | SR-01, SR-02 |
| BR-UI-03 | UC-03/04/06/08 | SR-04, SR-10, SR-11 |
| BR-IN-01 | UC-03/04 | SR-04, SR-07, SR-08 |
| BR-FILE-01/02 | UC-09 | SR-13 |
| BR-FILE-05 | UC-04 | SR-08 |
| BR-AI-03 | UC-10 | SR-14 |
| BR-TH-02 | UC-06/08 | SR-10, SR-11 |
| BR-LS-01/03 | UC-07 | SR-12 |
| BR-ERR-03 | UC-08 | SR-10, SR-11 |

## 6. Open Points – Resolved

- OP-BR-01: Chat history context → Resolved (Send full chatHistory)
- OP-BR-02: localStorage strategy → Resolved (Store max 50 messages, no base64)
- OP-BR-03: AI timeout → Resolved (5 seconds)

## 7. Revision History

| Version	| Date |	Description	Author |
|---------|------------|---------------------------|---------|
| 1.0 |	2026-01-29	| Initial draft	| BrSE Dang | 
| 1.1 |	2026-01-31	| Open points resolved, rules frozen	| BrSE Dang |