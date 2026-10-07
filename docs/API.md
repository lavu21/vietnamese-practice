# Đặc tả API phía máy chủ

Các API cần có để giao diện người dùng xử lý xác thực, gửi bài viết và chấm bài, cũng như xem lịch sử. Đặc tả này không phụ thuộc ngôn ngữ lập trình.

## 1. Quy ước

- **Đường dẫn gốc:** `/api/v1`. Dữ liệu trao đổi ở định dạng JSON, mã hóa UTF-8; dấu thời gian theo ISO 8601 UTC.
- **Xác thực:** gửi `Authorization: Bearer <accessToken>` trong mọi yêu cầu, ngoại trừ đăng nhập và làm mới phiên. Có thể thay bằng cookie HttpOnly; nếu dùng cookie, giao diện người dùng phải gửi kèm thông tin xác thực trong mọi yêu cầu.
- **Định dạng lỗi** (mọi phản hồi không thuộc nhóm 2xx):
  ```json
  { "error": { "code": "VALIDATION_FAILED", "message": "Thông báo bằng tiếng Việt", "details": [{ "field": "text", "message": "..." }] } }
  ```
- **Mã trạng thái:**

  | Mã | Ý nghĩa |
  |---|---|
  | 400 | Yêu cầu sai định dạng |
  | 401 | Thiếu hoặc mã xác thực không hợp lệ |
  | 403 | Tài nguyên thuộc về người dùng khác |
  | 404 | Không tìm thấy |
  | 409 | Xung đột |
  | 422 | Dữ liệu không hợp lệ |
  | 429 | Vượt quá giới hạn yêu cầu |
  | 500, 502, 503, 504 | Lỗi máy chủ hoặc dịch vụ trung gian |

- **Quyền sở hữu:** mọi tài nguyên lịch sử và phân tích đều gắn với người dùng đã xác thực. Có thể trả về 404 thay vì 403 cho tài nguyên của người khác để tránh tiết lộ sự tồn tại của tài nguyên đó.
- **Các giá trị được phép** (phải khớp với giao diện người dùng):
  - `tone`: `professional` | `casual`
  - `audience`: `adult` | `child` | `colleague` | `close-friend`
  - `category`: `grammar` | `vocab` | `coherence`
  - `status` (trạng thái xử lý lỗi): `pending` | `accepted` | `rejected`

## 2. Xác thực

### POST `/auth/login`
Thay thế hàm mô phỏng `login()`.
- **Yêu cầu:** `{ "username": string, "password": string }`
- **Kiểm tra dữ liệu:** bắt buộc có cả hai trường. Loại bỏ khoảng trắng đầu và cuối của tên người dùng. Không loại bỏ khoảng trắng trong mật khẩu và không ghi mật khẩu vào nhật ký.
- **Thành công 200:**
  ```json
  { "accessToken": "...", "refreshToken": "...", "expiresIn": 900, "user": { "id": "...", "username": "người_dùng_mẫu" } }
  ```
- **Thất bại:**
  - 401 `INVALID_CREDENTIALS` với cùng một thông báo chung cho cả trường hợp sai tên người dùng lẫn sai mật khẩu.
  - 429 `TOO_MANY_ATTEMPTS` khi có quá nhiều lần đăng nhập thất bại theo tên người dùng và địa chỉ IP (ví dụ: 5 lần trong 15 phút); kèm tiêu đề `Retry-After`.
- **Bảo mật:** lưu mật khẩu dưới dạng giá trị băm có muối, sử dụng thuật toán chậm (argon2, bcrypt hoặc scrypt); so sánh trong thời gian cố định và bắt buộc dùng HTTPS.

### POST `/auth/refresh`
- **Yêu cầu:** `{ "refreshToken": string }`
- **Thành công 200:** trả về mã truy cập mới; nên trả thêm mã làm mới mới nếu hệ thống luân chuyển mã.
- **Thất bại:** trả về 401 nếu mã đã hết hạn, bị thu hồi hoặc bị sử dụng lại. Nếu mã đã luân chuyển bị sử dụng lại, cần thu hồi toàn bộ nhóm mã liên quan.

### POST `/auth/logout`
- Bắt buộc xác thực. Thu hồi mã làm mới hoặc phiên hiện tại. Trả về 204; gọi lặp lại vẫn cho kết quả như nhau.

### GET `/auth/me`
- **Thành công 200:** `{ "id", "username" }`
- Giao diện người dùng gọi API này khi tải trang để khôi phục phiên, thay cho việc kiểm tra `localStorage`. Nếu nhận 401, chuyển người dùng đến `/login`.

Hiện giao diện chưa có chức năng đăng ký và đặt lại mật khẩu. Chỉ bổ sung nếu cần.

## 3. Gửi bài viết và phân tích

Quy trình: gửi văn bản cùng giọng điệu và đối tượng đọc, hiển thị trạng thái đang xử lý rồi hiển thị các lỗi. Mỗi lỗi có một nhóm, vị trí ký tự, nội dung gốc, gợi ý sửa và lời giải thích. Người dùng có thể chấp nhận hoặc từ chối từng gợi ý. Hiện giao diện mô phỏng độ trễ 1–2 giây và tỷ lệ lỗi khoảng 12%, vì vậy API cần xử lý rõ ràng các trường hợp phân tích chậm hoặc thất bại.

### Phương án A (đơn giản): phân tích đồng bộ

**POST `/writings`** tạo bài viết, phân tích bài viết rồi trả về kết quả.
- **Yêu cầu:**
  ```json
  { "text": "Nội dung bài viết", "tone": "casual", "audience": "child" }
  ```
- **Kiểm tra dữ liệu:**
  - `text` là bắt buộc và không được để trống hoặc chỉ chứa khoảng trắng. Không yêu cầu số từ tối thiểu.
  - Giới hạn độ dài tối đa, chẳng hạn 10.000 ký tự; trả về 422 nếu vượt quá giới hạn.
  - `tone` và `audience` là bắt buộc, đồng thời phải thuộc các giá trị được phép.
- **Thành công 201:** tài nguyên bài viết (mục 3.1) với `status: "completed"`.
- **Thất bại:**
  - 422 nếu dữ liệu không hợp lệ.
  - 502/504 `ANALYSIS_FAILED` nếu dịch vụ phân tích gặp lỗi hoặc hết thời gian chờ. Có thể không lưu bài viết vào lịch sử, hoặc lưu với `status: "failed"` để người dùng thử lại.
- **Thời gian chờ:** đặt thời gian chờ của máy chủ từ 30 giây trở lên.

### Phương án B (khuyến nghị nếu phân tích chậm): phân tích không đồng bộ

1. **POST `/writings`** trả về 202 cùng `{ "id", "status": "processing" }`.
2. **GET `/writings/{id}`** được giao diện gọi lặp lại mỗi 1–2 giây cho đến khi `status` là `completed` hoặc `failed`. Có thể bổ sung SSE hoặc WebSocket sau.

Chọn phương án B nếu quá trình phân tích có thể mất hơn khoảng 10 giây.

### 3.1 Tài nguyên bài viết

```json
{
  "id": "uuid",
  "text": "Nội dung gốc (không thay đổi)",
  "tone": "casual",
  "audience": "child",
  "wordCount": 42,
  "status": "processing | completed | failed",
  "failureReason": null,
  "errors": [
    {
      "id": "uuid",
      "category": "grammar",
      "status": "pending",
      "startIndex": 24,
      "endIndex": 32,
      "original": "thứt dậy",
      "suggestion": "thức dậy",
      "explanation": "Đây là lỗi chính tả."
    }
  ],
  "summary": { "total": 3, "pending": 3, "accepted": 0, "rejected": 0, "byCategory": { "grammar": 1, "vocab": 1, "coherence": 1 } },
  "createdAt": "ISO",
  "updatedAt": "ISO"
}
```

Các quy tắc đối với kết quả phân tích và máy chủ:
- `startIndex` và `endIndex` là vị trí ký tự trong chính xác giá trị `text` đã lưu; không bao gồm ký tự tại `endIndex`. Dùng đơn vị mã UTF-16 để phù hợp với JavaScript. Tiếng Việt có thể dùng dấu thanh dựng sẵn hoặc dấu thanh tổ hợp; vì vậy các dạng chuẩn hóa Unicode khác nhau sẽ cho vị trí khác nhau. Hãy lưu văn bản ở dạng NFC và tính vị trí dựa trên chính văn bản đó.
- Các lỗi không được chồng lấn và phải được sắp xếp theo `startIndex`.
- `original` phải bằng `text.slice(startIndex, endIndex)` (trong bản mô phỏng hiện tại có cắt khoảng trắng; hãy chọn một quy tắc và ghi rõ).
- `explanation` phải viết bằng tiếng Việt.
- Có thể không có lỗi; khi đó trả về `errors: []`.
- Lưu các lỗi để khi mở lại bài viết từ lịch sử, hệ thống không phân tích lại.

### POST `/writings/{id}/retry`
- Phân tích lại bài viết có trạng thái `failed` (giao diện có nút thử lại).
- Trả về 202 hoặc 200 với cấu trúc tài nguyên như cũ. Trả về 409 nếu bài viết không có trạng thái `failed`.

### PATCH `/writings/{id}/errors/{errorId}`
- Lưu quyết định của người dùng khi họ chấp nhận hoặc từ chối gợi ý.
- **Yêu cầu:** `{ "status": "accepted" | "rejected" | "pending" }`. Giá trị `pending` cho phép hoàn tác.
- **Thành công 200:** lỗi đã cập nhật cùng `summary` mới.
- **Thất bại:** trả về 404 nếu lỗi không thuộc bài viết; trả về 422 nếu giá trị trạng thái không hợp lệ.
- Gọi lặp lại vẫn cho kết quả như nhau. Giao diện có thể cập nhật trước rồi hoàn tác nếu yêu cầu thất bại.
- Không bắt buộc: `PATCH /writings/{id}/errors` nhận danh sách cập nhật hàng loạt dạng `[{ id, status }]`.

## 4. Lịch sử

### GET `/writings`
Liệt kê bài viết của người dùng hiện tại, bài mới nhất đứng trước.
- **Tham số truy vấn:** `limit` (mặc định 20, tối đa 100), `cursor` (hoặc `page`/`pageSize`), có thể có `q` (tìm trong văn bản), `tone`, `audience`, ngày `from`/`to`, `sort=createdAt:desc` (mặc định).
- **Thành công 200:**
  ```json
  {
    "items": [{ "id", "textPreview": "Khoảng 200 ký tự đầu", "wordCount", "tone", "audience", "status", "errorSummary": { "total", "pending" }, "createdAt" }],
    "nextCursor": "giá trị không công khai | null",
    "total": 57
  }
  ```
- Mỗi mục trong danh sách không chứa toàn bộ văn bản và danh sách lỗi để giảm dung lượng phản hồi. Trang lịch sử hiển thị bản xem trước 3 dòng, ngày tạo, số từ, giọng điệu và đối tượng đọc; API cần cung cấp các dữ liệu này.
- Hiện giao diện tải tất cả dữ liệu cùng lúc; khi tích hợp, hãy bổ sung phân trang hoặc tải thêm khi cuộn.

### GET `/writings/{id}`
- Trả về toàn bộ tài nguyên theo mục 3.1, bao gồm các lỗi đã lưu và trạng thái chấp nhận hoặc từ chối của từng lỗi.
- Dùng để mở lại bài viết từ lịch sử. Hiện việc mở lại chạy phân tích mô phỏng lần nữa khiến các quyết định trước đó bị mất; API này giúp giữ lại các quyết định đó.
- **Thất bại:** trả về 404 nếu không tìm thấy bài viết hoặc bài viết thuộc về người dùng khác.

### DELETE `/writings/{id}`
- Xóa một bài viết và các lỗi liên quan. Trả về 204; gọi lặp lại có thể trả về 404 hoặc 204, hãy chọn một cách thống nhất.

### DELETE `/writings`
- Xóa toàn bộ bài viết của người dùng (nút "Xóa tất cả").
- Yêu cầu tín hiệu xác nhận, chẳng hạn `?confirm=true`, để tránh thao tác nhầm. Trả về 204.

## 5. Yêu cầu phi chức năng

- **Giới hạn tần suất:** giới hạn số lần tạo bài viết theo người dùng (ví dụ: 20 lần/giờ) và số lần đăng nhập theo địa chỉ IP cùng tên người dùng. Trả về 429 kèm `Retry-After`.
- **Tính duy nhất của yêu cầu:** chấp nhận tiêu đề `Idempotency-Key` không bắt buộc trong `POST /writings` để tránh tạo bản sao hoặc phân tích lặp lại khi người dùng nhấn nhiều lần hay gửi lại yêu cầu.
- **CORS:** chỉ cho phép nguồn giao diện người dùng; cho phép gửi thông tin xác thực nếu dùng cookie.
- **An toàn dữ liệu đầu vào:** coi `text` là dữ liệu không đáng tin cậy. Mã hóa dữ liệu khi hiển thị và chỉ xử lý nó như dữ liệu trong quá trình phân tích. Phòng chống việc chèn chỉ thị vào câu lệnh bằng cách tách biệt rõ chỉ thị với văn bản người dùng, đồng thời kiểm tra kết quả phân tích theo cấu trúc đã nêu ở trên.
- **Kiểm tra kết quả phân tích:** sau khi phân tích xong, loại bỏ hoặc sửa mọi lỗi có vị trí ngoài phạm vi, chồng lấn lỗi khác hoặc có `original` không khớp với văn bản.
- **Quyền riêng tư và lưu trữ:** bài viết là dữ liệu cá nhân. Cần xác định thời hạn lưu trữ và bảo đảm việc xóa có hiệu lực thực tế (xóa vĩnh viễn hoặc xóa theo lịch).
- **Khả năng theo dõi:** thêm tiêu đề mã yêu cầu vào mọi phản hồi; ghi nhật ký có cấu trúc nhưng không chứa mật khẩu hoặc toàn văn bài viết; theo dõi thời gian phân tích và tỷ lệ thất bại.
- **Kiểm tra tình trạng:** cung cấp `GET /health` (không cần xác thực) để kiểm tra máy chủ và mức độ sẵn sàng.

## 6. Các thay đổi cần thực hiện ở giao diện khi tích hợp

- Thay `login` mô phỏng trong `lib/auth-context.tsx` bằng lời gọi `POST /auth/login`; thay việc kiểm tra `localStorage` bằng lời gọi `GET /auth/me`.
- Thay `analyzeText` trong `lib/analysis.ts` bằng lời gọi `POST /writings` (và thăm dò trạng thái nếu chọn phương án B).
- Thay `lib/history.ts` (dùng `localStorage`) bằng các lời gọi `GET`/`DELETE /writings`.
- Lưu thao tác chấp nhận hoặc từ chối thông qua điểm cuối PATCH.
- Xử lý tập trung mã 401 bằng cách xóa phiên và chuyển người dùng đến `/login`.
