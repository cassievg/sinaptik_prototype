# Kế hoạch thay đổi giao diện cho Mobile App

Tài liệu này mô tả **phần giao diện nào sẽ thay đổi** khi chuyển từ prototype web mentor portal sang mobile app.

## 1) Khung điều hướng tổng thể

### Hiện tại (web)
- Có sidebar bên trái (Dashboard, Tasks, Learners, Notifications, Course Catalog).
- Header có chat, notifications, profile, language switcher.

### Mobile app (đề xuất)
- Bỏ sidebar cố định.
- Dùng **bottom tab bar** cho các mục chính:
  - Home
  - Tasks
  - Learners
  - Inbox
  - Programs
- Các trang chi tiết (Marking, Review, Learner Profile, Chat thread) dùng stack navigation và có nút back trên cùng.

## 2) Dashboard

### Hiện tại (web)
- Layout nhiều cột, card KPI + board phân nhóm learner.

### Mobile app (đề xuất)
- Chuyển thành layout cuộn dọc 1 cột.
- KPI card hiển thị dạng swipe ngang hoặc 2 card đầu tiên luôn hiển thị.
- Board learner đổi thành:
  - segmented control (On Track / Needs Review / Stuck), hoặc
  - 3 section collapse theo thứ tự ưu tiên.
- Mỗi learner card gọn hơn: avatar nhỏ, tên, status, action nhanh.

## 3) Tasks

### Hiện tại (web)
- Có calendar lớn + danh sách task theo ngày + nhóm theo course/module.

### Mobile app (đề xuất)
- Calendar rút gọn thành:
  - thanh chọn ngày theo tuần (week strip), hoặc
  - nút mở date picker.
- Danh sách task hiển thị dạng card dọc, ưu tiên trạng thái và deadline.
- Bộ lọc theo course/module chuyển thành chips cuộn ngang.
- Hành động chính (Open Marking / Open Review) nổi bật bằng nút lớn trong từng card.

## 4) Learners list

### Hiện tại (web)
- Bảng nhiều cột (name, module, status, score, risk, last active...).

### Mobile app (đề xuất)
- Chuyển bảng thành danh sách card.
- Mỗi card gồm:
  - tên + avatar
  - module hiện tại
  - status badge
  - risk/score dạng thông tin phụ
- Search luôn nằm trên đầu; filter status dùng chip.
- Sort nâng cao đưa vào modal/bottom sheet.

## 5) Learner Profile

### Hiện tại (web)
- Trang profile rộng với nhiều chart và timeline.

### Mobile app (đề xuất)
- Chia thành các section dọc:
  - Header profile
  - KPI mini (progress, score, engagement)
  - Skill snapshot
  - Activity timeline
- Chart rút gọn kích thước, ưu tiên readability trên màn hình nhỏ.
- Các action (Message, Review Submission) đặt thành nút sticky hoặc action bar ngay dưới header.

## 6) Notifications / Inbox

### Hiện tại (web)
- Danh sách thông báo + tab filter.

### Mobile app (đề xuất)
- Giữ tab filter nhưng tối ưu dạng segmented control.
- Mỗi notification card có:
  - loại thông báo
  - learner liên quan
  - CTA (Open / Mark read)
- Hỗ trợ swipe action (đánh dấu đã đọc) nếu dùng native pattern.

## 7) Chat

### Hiện tại (web)
- Trang chat với danh sách hội thoại và khung chat cạnh nhau.

### Mobile app (đề xuất)
- Tách thành 2 màn:
  1. Conversation list
  2. Chat thread
- Thread có input cố định ở dưới, auto nâng theo keyboard.
- Learner profile rút gọn thành bottom sheet hoặc icon info ở header.

## 8) Marking

### Hiện tại (web)
- Nội dung bài nộp + comment + quiz + AI suggestion hiển thị đồng thời trên màn hình rộng.

### Mobile app (đề xuất)
- Chia theo bước hoặc tab:
  - Submission
  - Comments
  - Quiz / Structure scoring
  - AI Suggestion
- Nút chính rõ ràng:
  - Accept AI suggestion
  - Save grading
  - Mark resolved
- Tránh hiển thị quá nhiều panel cùng lúc; ưu tiên tiến trình chấm bài tuần tự.

## 9) Requested Review

### Hiện tại (web)
- Có đủ ngữ cảnh + phản hồi trên cùng một trang.

### Mobile app (đề xuất)
- Dùng layout theo section với các block:
  - Learner request
  - Prior mentor feedback
  - Response editor
- CTA cuối trang dạng sticky footer:
  - Send response
  - Resolve request

## 10) Course Switcher + Language Switcher

### Hiện tại (web)
- Course switcher nằm dưới logo; language switcher ở header.

### Mobile app (đề xuất)
- Course switcher đặt ở header của Home/Tasks/Learners dưới dạng dropdown.
- Language switcher chuyển vào Settings/Profile menu để giảm tải header.

## 11) Design system cần điều chỉnh cho mobile

- Tăng kích thước vùng chạm (tap target) tối thiểu 44px.
- Giảm mật độ thông tin trên mỗi màn.
- Font scale và spacing theo mobile token.
- Chuẩn hóa component:
  - Card
  - Badge
  - Chip filter
  - Bottom sheet
  - Sticky CTA bar

## 12) Phần giữ nguyên logic (ưu tiên tái sử dụng)

- Business flow tổng thể:
  - Dashboard triage
  - Tasks xử lý hằng ngày
  - Marking và review escalation
  - Inbox + Chat follow-up
- Status model:
  - ON_TRACK, PENDING_MENTOR, AT_RISK, STUCK, COMPLETED
- Dữ liệu và rule tính KPI hiện tại có thể tái sử dụng.

## 13) Ưu tiên triển khai UI mobile (đề xuất)

1. Navigation shell + tab bar
2. Tasks + Marking flow (luồng chính)
3. Learners list + Learner profile
4. Inbox + Chat
5. Dashboard polish + Programs

---

Nếu cần, bước tiếp theo mình có thể tạo thêm tài liệu:
- wireframe text cho từng màn mobile,
- mapping chi tiết `web component -> mobile component`,
- checklist acceptance criteria cho QA.
