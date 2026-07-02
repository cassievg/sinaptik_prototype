# UI Components & Page Structure

## Page 1: Mentor Command Center (Dashboard)

**Goal:** Provide a single view for cohort tracking to eliminate fragmented tracking.

- **Component 1: Cohort Overview Stats:** Displays Completion Rate (%), Avg Score, and Total 'At Risk' learners.
- **Component 2: Learner Progress Board:** A categorised layout (On Track, Needs Review, Stuck).
- **Component 3: Learner Card:** Must display:
  - Learner Name & Avatar.
  - Current Module.
  - **Status Tag:** (e.g., Pending Mentor).
  - **Assignee Avatar:** Shows which mentor owns this learner to establish a clear ownership trail.

## Page 2: Learner Profile & Timeline

**Goal:** Show learner context and system events without mixing them with chat messages.

- **Component 1: Skill Breakdown:** Visual bars showing progress in specific skills (e.g., Data Wrangling, Machine Learning).
- **Component 2: Separated Activity Log:** A vertical timeline component. Must visually differentiate system alerts (e.g., AI drop-off risk) from user actions (e.g., submitted module). Contains a "Review" button on actionable items.

## Page 3: In-Context Feedback View

**Goal:** Keep feedback attached to the work, not in separate emails or WhatsApp.

- **Component 1: Submission Content Area:** Displays the learner's actual work (text/code). Must support text selection/highlighting.
- **Component 2: AI Insights Sidebar:** Displays the AI's initial score and reasoning so the mentor has context.
- **Component 3: In-Context Comment Box:**
  - Triggered when text is highlighted.
  - Attached physically next to the highlighted text.
  - Includes a textarea that supports `@mentions`.
- **Component 4: Resolution Action:** A primary button "Mark as Resolved" at the top level.

## Page 0: Learner Submission & AI Evaluation View

**Goal:** Deliver real-time, asynchronous AI feedback while maintaining a human-in-the-loop safety net.

- **Component 1: Workspace Area:** Displays the assignment prompt and the learner's submitted work (e.g., code editor or text block).
- **Component 2: AI Feedback Panel (Appears after submission):**
  - **Header:** Shows the AI generated score (e.g., 45/100).
  - **Body:** Detailed explanation of what was good and what went wrong (Explainable AI).
- **Component 3: Decision Action Bar:**
  - Button Primary (Green/Blue): "Accept Feedback & Complete".
  - Button Secondary (Outline/Ghost): "Request Mentor Review".
- **Component 4: Escalation Modal (Appears if Secondary Button is clicked):**
  - Text input field: "Please tell your mentor what you need help with..."
  - Submit Button: "Send to Mentor".
- **Component 5: Status Banner:** Appears at the top after requesting review, stating: "Your request has been sent to Mentor [Avatar/Name]. Please wait for their feedback."
