# Dashboard Formulas — Mentor Command Center

Tài liệu này mô tả các công thức tính toán cho **Component 1: Cohort Overview Stats** và **Component 2: Learner Progress Board** trên trang Mentor Command Center.

---

## 1. Completion Rate (Tỷ lệ hoàn thành)

**Định nghĩa:** Phần trăm học viên đã hoàn thành toàn bộ chương trình (hoặc module hiện tại) trong cohort.

### Công thức (theo module)

```
Completion Rate (%) = (Σ moduleProgress_i / N) × 100

Trong đó:
  moduleProgress_i = (số module đã hoàn thành của học viên i) / (tổng số module trong cohort)
  N = tổng số học viên trong cohort
```

### Công thức (theo trạng thái — dùng trong mock)

```
Completion Rate (%) = (số học viên có status = COMPLETED / tổng học viên) × 100
```

### Ví dụ với mock_data

| Học viên       | Status         | moduleProgress |
|----------------|----------------|----------------|
| Sarah Jenkins  | PENDING_MENTOR | 3/6 = 50%      |
| Marcus Chen    | ON_TRACK       | 5/6 ≈ 83.3%    |

```
Completion Rate = ((50 + 83.3) / 2) = 66.65% ≈ 66.7%
```

> **Lưu ý:** `mock_data.json` cung cấp giá trị cố định `84.2%` cho demo. Ứng dụng tính động khi có đủ dữ liệu `moduleProgress`; nếu không, fallback về giá trị cohort.

---

## 2. Average Score (Điểm trung bình)

**Định nghĩa:** Điểm AI trung bình của tất cả bài nộp đã chấm trong cohort.

### Công thức

```
Avg Score = Σ aiScore_j / M

Trong đó:
  aiScore_j = điểm AI của bài nộp j (thang 0–100)
  M = tổng số bài nộp đã có điểm (status = GRADED hoặc COMPLETED)
```

### Ví dụ với mock_data

Chỉ có 1 bài nộp đã chấm (Sarah — Module 4):

```
Avg Score = 45 / 1 = 45
```

> **Lưu ý:** `mock_data.json` cung cấp `92` cho demo cohort. Ứng dụng tính từ submissions khi có; fallback về `cohort.avgScore`.

---

## 3. At Risk Count (Số học viên có nguy cơ)

**Định nghĩa:** Số học viên cần can thiệp sớm do trạng thái rủi ro hoặc cảnh báo AI.

### Công thức

```
At Risk Count = COUNT(learners WHERE status IN ('AT_RISK', 'STUCK'))
              + COUNT(DISTINCT learnerId FROM activityLogs
                       WHERE type = 'AI_ALERT' AND message CONTAINS 'drop-off risk: High'
                       AND learner.status NOT IN ('ON_TRACK', 'COMPLETED'))
```

### Quy tắc đơn giản hóa (dùng trong frontend)

```
At Risk Count = số học viên có status ∈ { AT_RISK, STUCK }
```

Cảnh báo AI mức High được hiển thị riêng trên timeline, không tự động tăng counter trừ khi status đã là AT_RISK.

### Ví dụ với mock_data

Không có học viên status AT_RISK/STUCK → `At Risk Count = 0` (mock cung cấp `3` cho demo).

---

## 4. Learner Progress Board — Phân loại cột

Bảng Kanban chia học viên thành 3 cột:

| Cột            | Điều kiện status                          |
|----------------|-------------------------------------------|
| **On Track**   | `ON_TRACK`, `COMPLETED`                   |
| **Needs Review** | `PENDING_MENTOR`                        |
| **Stuck**      | `STUCK`, `AT_RISK`                        |

### Công thức phân loại

```typescript
function categorizeLearner(status: LearnerStatus): BoardColumn {
  if (status === 'PENDING_MENTOR') return 'needs_review'
  if (status === 'STUCK' || status === 'AT_RISK') return 'stuck'
  return 'on_track'  // ON_TRACK, COMPLETED, và các status khác
}
```

---

## 5. Status Tag — Màu và nhãn hiển thị

| Status           | Nhãn UI              | Màu      |
|------------------|----------------------|----------|
| `ON_TRACK`       | On Track             | Xanh lá  |
| `PENDING_MENTOR` | Pending Mentor       | Vàng     |
| `AT_RISK`        | At Risk              | Cam      |
| `STUCK`          | Stuck                | Đỏ       |
| `COMPLETED`      | Completed            | Xanh dương |

---

## 6. Pending Review Count

```
Pending Review = COUNT(learners WHERE status = 'PENDING_MENTOR')
```

---

## 7. Engagement Score (per learner)

Điểm engagement (0–100) được AI tính dựa trên tần suất login, submission, và thời gian trên platform.

```
Engagement Score = (loginFrequency × 0.3) + (submissionRate × 0.4) + (timeOnPlatform × 0.3)
```

> Trong mock, giá trị được cung cấp sẵn cho mỗi learner (`engagementScore`).

---

## 8. Drop-off Risk Classification

| Risk Level | Điều kiện |
|------------|-----------|
| None       | status = COMPLETED |
| Low        | engagementScore ≥ 80 AND lastActive < 2 days |
| Medium     | engagementScore 50–79 |
| High       | engagementScore < 50 OR lastActive > 3 days |
| Critical   | status = STUCK OR failed ≥ 2 consecutive modules |

---

## 9. Weekly Engagement Chart

```
logins[day] = số lần login trong ngày
submissions[day] = số bài nộp trong ngày
```

Dữ liệu lấy từ `dashboardAnalytics.weeklyEngagement`.

---

## 10. Score Distribution

```
count[range] = số submissions có aiScore nằm trong range
Ranges: 0-49, 50-69, 70-84, 85-100
```

---

## 11. Module Completion

```
completion[module] = COUNT(learners WHERE moduleProgress >= moduleIndex) / totalLearners
```

---

## 12. Skill Breakdown (Learner Profile)

**Định nghĩa:** Thanh tiến độ kỹ năng dựa trên điểm module theo chủ đề.

### Công thức

```
skillProgress(skill) = AVG(scores của các module thuộc skill đó) 

Hiển thị: skillProgress(skill) %  (thang 0–100)
```

### Skills mặc định (khi chưa có dữ liệu chi tiết)

| Skill            | Nguồn tính (demo)                    |
|------------------|--------------------------------------|
| Data Wrangling   | Điểm AI Module 4 (nếu có) hoặc 45%  |
| Machine Learning | Trung bình các module ML             |
| SQL              | Trung bình các module SQL            |
| Python Basics    | Trung bình các module Python         |

---

## 7. Tóm tắt luồng cập nhật sau hành động

| Hành động                         | Cập nhật Dashboard                          |
|-----------------------------------|---------------------------------------------|
| Learner Accept Feedback           | status → `COMPLETED`, Completion Rate ↑     |
| Learner Request Mentor Review     | status → `PENDING_MENTOR`, Needs Review ↑     |
| Mentor Mark as Resolved           | status → `ON_TRACK`, Needs Review ↓           |
| AI phát hiện drop-off High        | Log AI_ALERT; có thể set status → `AT_RISK` |

---

*File tham chiếu implementation: `src/utils/dashboard.ts`*
