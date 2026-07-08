# Dashboard Formulas — Mentor Command Center

This document describes the calculation formulas for **Component 1: Cohort Overview Stats** and **Component 2: Learner Progress Board** on the Mentor Command Center page.

---

## 1. Completion Rate

**Definition:** Percentage of learners who have completed the full program (or current module track) in the cohort.

### Formula (by module)

```
Completion Rate (%) = (Σ moduleProgress_i / N) × 100

Where:
  moduleProgress_i = (modules completed by learner i) / (total modules in cohort)
  N = total learners in cohort
```

### Formula (by status — used in mock)

```
Completion Rate (%) = (learners with status = COMPLETED / total learners) × 100
```

### Example with mock_data

| Learner       | Status         | moduleProgress |
|---------------|----------------|----------------|
| Sarah Jenkins | PENDING_MENTOR | 3/6 = 50%      |
| Marcus Chen   | ON_TRACK       | 5/6 ≈ 83.3%    |

```
Completion Rate = ((50 + 83.3) / 2) = 66.65% ≈ 66.7%
```

> **Note:** `src/data/mock_data.json` provides a fixed `84.2%` for demo. The app computes dynamically when `moduleProgress` data is available; otherwise it falls back to the cohort value.

---

## 2. Average Score

**Definition:** Average AI score across all graded submissions in the cohort.

### Formula

```
Avg Score = Σ aiScore_j / M

Where:
  aiScore_j = AI score of submission j (scale 0–100)
  M = total submissions with a score (status = GRADED or COMPLETED)
```

### Example with mock_data

Only one graded submission (Sarah — Module 4):

```
Avg Score = 45 / 1 = 45
```

> **Note:** `src/data/mock_data.json` provides `92` for the demo cohort. The app computes from submissions when available; otherwise it falls back to `cohort.avgScore`.

---

## 3. At Risk Count

**Definition:** Number of learners who need early intervention due to risk status or AI alerts.

### Formula

```
At Risk Count = COUNT(learners WHERE status IN ('AT_RISK', 'STUCK'))
              + COUNT(DISTINCT learnerId FROM activityLogs
                       WHERE type = 'AI_ALERT' AND message CONTAINS 'drop-off risk: High'
                       AND learner.status NOT IN ('ON_TRACK', 'COMPLETED'))
```

### Simplified rule (used in frontend)

```
At Risk Count = count of learners with status ∈ { AT_RISK, STUCK }
```

High-level AI alerts are shown separately on the timeline; they do not automatically increment the counter unless status is already AT_RISK.

### Example with mock_data

No learners with AT_RISK/STUCK status → `At Risk Count = 0` (mock provides `3` for demo).

---

## 4. Learner Progress Board — Column classification

The Kanban board splits learners into 3 columns:

| Column           | Status condition              |
|------------------|-------------------------------|
| **On Track**     | `ON_TRACK`, `COMPLETED`       |
| **Needs Review** | `PENDING_MENTOR`              |
| **Stuck**        | `STUCK`, `AT_RISK`            |

### Classification formula

```typescript
function categorizeLearner(status: LearnerStatus): BoardColumn {
  if (status === 'PENDING_MENTOR') return 'needs_review'
  if (status === 'STUCK' || status === 'AT_RISK') return 'stuck'
  return 'on_track'  // ON_TRACK, COMPLETED, and other statuses
}
```

---

## 5. Status Tag — Display color and label

| Status           | UI label       | Color   |
|------------------|----------------|---------|
| `ON_TRACK`       | On Track       | Green   |
| `PENDING_MENTOR` | Pending Mentor | Yellow  |
| `AT_RISK`        | At Risk        | Orange  |
| `STUCK`          | Stuck          | Red     |
| `COMPLETED`      | Completed      | Blue    |

---

## 6. Pending Review Count

```
Pending Review = COUNT(learners WHERE status = 'PENDING_MENTOR')
```

---

## 7. Engagement Score (per learner)

Engagement score (0–100) is computed by AI based on login frequency, submission rate, and time on platform.

```
Engagement Score = (loginFrequency × 0.3) + (submissionRate × 0.4) + (timeOnPlatform × 0.3)
```

> In the mock, values are pre-provided per learner (`engagementScore`).

---

## 8. Drop-off Risk Classification

| Risk Level | Condition |
|------------|-----------|
| None       | status = COMPLETED |
| Low        | engagementScore ≥ 80 AND lastActive < 2 days |
| Medium     | engagementScore 50–79 |
| High       | engagementScore < 50 OR lastActive > 3 days |
| Critical   | status = STUCK OR failed ≥ 2 consecutive modules |

---

## 9. Weekly Engagement Chart

```
logins[day] = number of logins on that day
submissions[day] = number of submissions on that day
```

Data comes from `dashboardAnalytics.weeklyEngagement`.

---

## 10. Score Distribution

```
count[range] = number of submissions whose aiScore falls in range
Ranges: 0-49, 50-69, 70-84, 85-100
```

---

## 11. Module Completion

```
completion[module] = COUNT(learners WHERE moduleProgress >= moduleIndex) / totalLearners
```

---

## 12. Skill Breakdown (Learner Profile)

**Definition:** Skill progress bars based on module scores by topic.

### Formula

```
skillProgress(skill) = AVG(scores of modules belonging to that skill)

Display: skillProgress(skill) %  (scale 0–100)
```

### Default skills (when detailed data is unavailable)

| Skill            | Source (demo)                         |
|------------------|---------------------------------------|
| Data Wrangling   | AI score Module 4 (if any) or 45%    |
| Machine Learning | Average of ML modules                 |
| SQL              | Average of SQL modules                |
| Python Basics    | Average of Python modules             |

---

## 13. Dashboard update flow after actions

| Action                         | Dashboard update                          |
|--------------------------------|-------------------------------------------|
| Learner Accept Feedback        | status → `COMPLETED`, Completion Rate ↑   |
| Learner Request Mentor Review  | status → `PENDING_MENTOR`, Needs Review ↑ |
| Mentor Mark as Resolved        | status → `ON_TRACK`, Needs Review ↓     |
| AI detects drop-off High       | Log AI_ALERT; may set status → `AT_RISK`  |

---

*Implementation reference: `src/utils/dashboard.ts`*
