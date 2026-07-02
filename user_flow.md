# User Flows for Sinaptik Case Study 3 (Fragmented Collaboration)

## 1. Learner & AI Auto-Grading Flow

This flow handles the initial submission and AI filtering to reduce mentor workload.

1. **Submit:** Learner submits their module assignment.
2. **AI Processing:** The AI engine instantly analyzes the submission, assigns a score, and generates detailed feedback.
3. **Learner Review:**
   - **Path A (Happy Path):** Learner clicks "Accept Feedback". The submission is marked as 'COMPLETED'.
   - **Path B (Escalation):** Learner clicks "Request Mentor Review". The system creates an activity log and updates the learner's status tag to 'PENDING_MENTOR'.

## 2. Mentor Resolution Flow (Core Focus)

This flow solves the fragmented tracking and disconnected feedback issues.

1. **Dashboard Triage:** Mentor opens the `Command Center`. They view the Cohort board and identify learners with a 'PENDING_MENTOR' or 'AT_RISK' or 'ON_TRACK' or 'STUCK' status tag.
2. **Context Gathering:** Mentor clicks on a specific learner (e.g., Sarah Jenkins) to open the `Learner Profile`. They review the `Separated Activity Log` to see the timeline of submissions, AI alerts, and requests.
3. **In-Context Grading:** Mentor clicks "Review Submission" from the timeline. The `Feedback View` opens.
4. **Commenting:** Mentor highlights a specific error in the submission text/code and adds an `In-context comment`. They use `@mentions` to tag the learner or another mentor directly in the platform.
5. **Resolution:** Mentor clicks "Mark as Resolved". The system updates the learner's status back to 'ON_TRACK' and sends a notification to the learner.

## 3. Learner Submission & AI Interaction Flow

This flow simulates the asynchronous AI assistant providing instant feedback.

1. **Initial State:** Learner is on the module page, viewing their completed code/text.
2. **Action - Submit:** Learner clicks the "Submit Assignment" button.
3. **State Change - AI Grading:** System shows a brief loading state, then immediately renders the `AI Feedback Panel` containing the score and explainable feedback.
4. **Action - Decision Making:**
   - **Path A:** Learner is satisfied. Clicks "Accept & Complete". The module is marked as 100% done.
   - **Path B:** Learner is confused or disagrees with the AI. Clicks "Request Mentor Review".
5. **State Change - Escalation:** A modal `Request Reason` pops up. Learner types "I don't understand why dropping nulls is bad here" and clicks "Send Request".
6. **Final State:** The UI updates to show a "Pending Mentor Review" banner, and the system internally sends this to the Mentor's Command Center.
