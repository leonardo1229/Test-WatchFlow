# Test-WatchFlow — Reviewer Recommendation Feature Test Guide

This repository is used to validate the **Watchflow Reviewer Recommendation** feature against the CTO ticket requirements.

---

## Repository Structure (for testing)

```
test-watchflow/
├── .github/
│   └── CODEOWNERS              ← maps paths to GitHub owners
├── .watchflow/
│   └── rules.yaml              ← 10 rules (2 critical, 4 high, 4 medium)
├── config/
│   └── prod.yaml               ← HIGH path (triggers config rule)
├── src/
│   ├── billing/
│   │   ├── payment.js          ← CRITICAL path
│   │   └── invoice.js          ← CRITICAL path
│   ├── auth/
│   │   ├── middleware.js        ← CRITICAL path
│   │   └── jwt.js              ← CRITICAL path
│   ├── config/
│   │   └── database.js         ← HIGH path
│   └── index.js                ← base API
├── tests/
│   ├── billing.test.js         ← test coverage signal
│   └── auth.test.js            ← test coverage signal
└── CHANGELOG.md
```

### Risk Score Reference

| Rule Severity | Points | Rule in this repo |
|--------------|--------|-------------------|
| critical     | 5 pts  | src/billing/**, src/auth/** |
| high         | 3 pts  | linked issue, CODEOWNERS, config/**, unresolved comments |
| medium       | 2 pts  | LOC limit, title pattern, changelog, diff alignment |
| > 50 files   | 3 pts  | (size signal) |
| > 20 files   | 1 pt   | (size signal) |
| > 2000 LOC   | 2 pts  | (size signal) |
| > 500 LOC    | 1 pt   | (size signal) |
| No tests     | 2 pts  | (coverage signal) |
| First-time   | 2 pts  | (contributor signal) |
| Revert PR    | 2 pts  | (revert signal) |

**Risk thresholds:** Low ≤ 3 | Medium 4–6 | High 7–10 | Critical 10+

---

## One-time Setup

1. **Install Watchflow GitHub App** on this repo.
2. **Set CODEOWNERS**: open `.github/CODEOWNERS` and replace `@leonardo1229` with your actual GitHub username(s). Add a second collaborator account for load-balancing tests.
3. **Watchflow must be running** (or deployed) and connected to this repo via webhook.
4. All slash commands (`/risk`, `/reviewers`) are posted as PR comments.

---

## All Test Cases

---

### Phase 1 — Risk Assessment (`/risk`)

---

#### TC-01 · Low Risk PR

**Goal:** Verify `/risk` reports `Low` with score ≤ 3.

**PR to create:**
- Branch from `main`, change only `README.md` (tiny edit, 1–5 lines)
- Title: `docs: update README`
- Description (≥ 50 chars + include `Fixes #1` or similar): `Update README to add setup instructions. Fixes #1`
- Include CHANGELOG.md update

**Comment on PR:**
```
/risk
```

**Expected response:**
- Risk: **Low** (score ≤ 3)
- No critical/high rule signals
- Label `watchflow:risk-low` applied to PR

---

#### TC-02 · Medium Risk PR (LOC signal)

**Goal:** Verify medium risk from PR size exceeding 500 LOC.

**PR to create:**
- Branch from `main`, add a large new JS file (paste 600+ lines of boilerplate)
- Title: `feat: add large utility module`
- Description (≥ 50 chars, Fixes #2): `Add a large utility module for testing purposes. Fixes #2`
- Include CHANGELOG.md update

**Comment on PR:**
```
/risk
```

**Expected response:**
- Risk: **Medium** (score 4–6)
- Signal: `PR size limit exceeded` (medium rule: max_pr_loc 500)
- Label `watchflow:risk-medium` applied

---

#### TC-03 · High Risk PR (rule violations)

**Goal:** Verify high risk from multiple high-severity rule violations.

**PR to create:**
- Branch from `main`, change `src/index.js` (small edit)
- Title: `update index` ← intentionally wrong format (no conventional commits prefix)
- Description: `short` ← intentionally < 50 chars, no issue link
- Do NOT include CHANGELOG update

**Comment on PR:**
```
/risk
```

**Expected response:**
- Risk: **High** (score 7–10)
- Signals: `require_linked_issue` (high), `title_pattern` violation (medium), `changelog missing` (medium)
- Label `watchflow:risk-high` applied

---

#### TC-04 · Critical Risk PR (critical path)

**Goal:** Verify critical risk when billing or auth paths are changed.

**PR to create:**
- Branch from `main`, edit `src/billing/payment.js` (any small change)
- Title: `update index` ← wrong format intentionally
- Description: `short` ← no issue link, < 50 chars

**Comment on PR:**
```
/risk
```

**Expected response:**
- Risk: **Critical** (score ≥ 10)
- Signals must include: `Changes to billing module... (critical, 5 pts)`
- Label `watchflow:risk-critical` applied

---

#### TC-05 · Large Changeset Signal (> 50 files)

**Goal:** Verify `Large changeset (+3 pts)` signal fires when > 50 files changed.

**PR to create:**
- Branch from `main`, create 51+ tiny new files (e.g. `src/utils/util_01.js` … `src/utils/util_51.js`, each 1 line)
- Title: `docs: update README` + description `Adds many utility files for testing. Fixes #5`
- Include CHANGELOG update

**Comment on PR:**
```
/risk
```

**Expected response:**
- Signal: `Large changeset` (+3 pts, description: "N files changed")
- Risk elevated to at least Medium

---

#### TC-06 · Large LOC Signal (> 2000 lines)

**Goal:** Verify `Many lines changed (+2 pts)` signal.

**PR to create:**
- Branch from `main`, add a single file with 2001+ lines (paste a large JSON or generated content)
- Title: `feat: add data file` + description `Adds a large static data file for testing. Fixes #6`
- Include CHANGELOG update

**Comment on PR:**
```
/risk
```

**Expected response:**
- Signal: `Many lines changed` (+2 pts, "N lines changed")

---

#### TC-07 · No Test Coverage Signal

**Goal:** Verify `No test coverage (+2 pts)` signal when code files added without test files.

**PR to create:**
- Branch from `main`, add `src/payments/refund.js` (new code file)
- Do NOT add any file under `tests/`
- Title: `feat: add refund module` + description `Adds refund functionality to the payments module. Fixes #7`
- Include CHANGELOG update

**Comment on PR:**
```
/risk
```

**Expected response:**
- Signal: `No test coverage` (+2 pts)

---

#### TC-08 · First-Time Contributor Signal

**Goal:** Verify `First-time contributor (+2 pts)` signal.

**Setup:** Use a **brand new GitHub account** that has never contributed to this repo to open the PR.

**PR:** Any small change (e.g. edit README), conventional title, proper description with issue link.

**Comment on PR:**
```
/risk
```

**Expected response:**
- Signal: `First-time contributor` (+2 pts)

---

#### TC-09 · Revert PR Signal

**Goal:** Verify `Revert PR detected (+2 pts)` signal.

**PR to create:**
- Branch from `main`, revert any recent change
- Title: **must start with** `Revert:` (e.g. `Revert: feat: add refund module`)
- Description with issue link (≥ 50 chars)
- Include CHANGELOG update

**Comment on PR:**
```
/risk
```

**Expected response:**
- Signal: `Revert PR detected` (+2 pts)

---

#### TC-10 · Fallback Pattern Matching (no Watchflow rules)

**Goal:** Verify fallback sensitive-path detection when `.watchflow/rules.yaml` is absent or all rules disabled.

**Setup:** Temporarily disable all rules (set `enabled: false` on all rules in `.watchflow/rules.yaml`), commit, push, open a PR touching `src/auth/jwt.js`.

**Comment on PR:**
```
/risk
```

**Expected response:**
- Risk scored via **fallback** (no rule signals)
- Still shows size/contributor signals if applicable
- Risk is lower than TC-04 since no rule-based scoring

**Cleanup:** Re-enable all rules after this test.

---

### Phase 2 — Reviewer Recommendation (`/reviewers`)

---

#### TC-11 · CODEOWNERS-Based Recommendation

**Goal:** Verify CODEOWNERS owners are recommended first.

**Setup:** Ensure `.github/CODEOWNERS` has `src/billing/ @leonardo1229` (already set up).

**PR to create:** Edit `src/billing/payment.js` (any change). Proper title + description.

**Comment on PR:**
```
/reviewers
```

**Expected response:**
- `@leonardo1229` appears as recommended reviewer
- Reason mentions: `CODEOWNERS` or `billing` ownership
- Label `watchflow:reviewer-recommendation` applied
- `@leonardo1229` actually assigned to the PR

---

#### TC-12 · No CODEOWNERS Fallback (commit history expertise)

**Goal:** Verify commit history is used when no CODEOWNERS exists.

**Setup:** Temporarily remove `.github/CODEOWNERS` (rename or delete), commit, push. Ensure the repo has multiple prior commits by different contributors.

**PR to create:** Edit `src/index.js`.

**Comment on PR:**
```
/reviewers
```

**Expected response:**
- Reviewer recommended based on commit history
- Reason mentions: `recent committer` or `commit history`
- Top committer for `src/index.js` is recommended

**Cleanup:** Restore CODEOWNERS.

---

#### TC-13 · Team in CODEOWNERS

**Goal:** Verify team slugs are routed via `team_reviewers` API (not `reviewers`).

**Setup:**
1. Open `.github/CODEOWNERS`
2. Uncomment the team line: `src/billing/ @your-org/billing-team`
3. Replace with a real GitHub org/team you belong to
4. Commit and push

**PR to create:** Edit `src/billing/payment.js`.

**Comment on PR:**
```
/reviewers
```

**Expected:**
- Team `billing-team` is requested as reviewer via GitHub's **Teams** reviewer API
- PR shows team review request (not individual)
- Label `watchflow:reviewer-recommendation` applied

**Cleanup:** Revert CODEOWNERS to individual owners.

---

#### TC-14 · Commit History Expertise Boost

**Goal:** Verify recent committers to changed files get higher scores.

**Setup:** Have two different GitHub accounts make several commits to `src/billing/payment.js`. The one with more recent commits should score higher.

**PR to create:** Edit `src/billing/payment.js`.

**Comment on PR:**
```
/reviewers
```

**Expected:**
- Candidate with most recent commits to `src/billing/payment.js` ranked first
- Reason: `recent committer` to that file

---

#### TC-15 · Critical Risk → 2–3 Reviewers Assigned

**Goal:** Verify that a critical-risk PR gets 2–3 reviewers assigned.

**Setup:** Ensure CODEOWNERS has at least 2 individual users mapped to `src/billing/` and `src/auth/`.

**PR to create:** Edit both `src/billing/payment.js` and `src/auth/jwt.js` in same PR. Wrong title format, no issue link.

**Comment on PR:**
```
/reviewers
```

**Expected:**
- Risk: Critical
- **2–3 reviewers** assigned to the PR
- Response shows ranked list with 2–3 entries

---

#### TC-16 · Low Risk → 1 Reviewer Assigned

**Goal:** Verify that a low-risk PR gets exactly 1 reviewer.

**PR to create:** (same as TC-01 setup — tiny README change, correct title, issue link, CHANGELOG updated)

**Comment on PR:**
```
/reviewers
```

**Expected:**
- Risk: Low
- **Exactly 1 reviewer** assigned
- Response shows 1 ranked entry

---

#### TC-17 · Rule Severity Boost for Experienced Reviewer

**Goal:** Verify that when critical/high rules match AND a reviewer scores ≥ 5, they get +2 "Experienced reviewer" boost.

**PR to create:** Edit `src/billing/payment.js` (critical rule matches). CODEOWNERS owner must have prior commits (score ≥ 5).

**Comment on PR:**
```
/reviewers
```

**Expected:**
- CODEOWNERS owner reason includes: `Experienced reviewer (critical/high-severity rules matched)`

---

#### TC-18 · PR Author Excluded from Recommendations

**Goal:** Verify the PR author never appears in the recommended reviewer list.

**Setup:** The PR author must have prior commits in the changed files (would normally be a candidate).

**PR to create:** Any PR. Author has commit history on changed files.

**Comment on PR:**
```
/reviewers
```

**Expected:**
- PR author login does **NOT** appear in the recommended or assigned list

---

#### TC-19 · Rule-Inferred Ownership (no CODEOWNERS)

**Goal:** When no CODEOWNERS exists but critical rules match, use commit history on rule-pattern paths as inferred owners.

**Setup:** Remove `.github/CODEOWNERS`. Ensure `src/billing/**` critical rule is enabled and someone has commits in `src/billing/`.

**PR to create:** Edit `src/billing/payment.js`.

**Comment on PR:**
```
/reviewers
```

**Expected:**
- Reason includes: `Inferred owner for Changes to billing module... (critical)`
- Score boosted: +4 pts for top expert, +3 for second, +2 for third

**Cleanup:** Restore CODEOWNERS.

---

### Phase 3 — Load Balancing & Acceptance Rate

---

#### TC-20 · Overloaded Reviewer Penalized

**Goal:** Verify a reviewer with many recent review activities is ranked lower.

**Setup:**
1. Have a contributor review (or approve/request changes) on 5+ recent PRs in this repo
2. Have another contributor with fewer reviews
3. Both are CODEOWNERS or top committers

**PR to create:** Edit `src/billing/payment.js` or any file both own.

**Comment on PR:**
```
/reviewers
```

**Expected:**
- Overloaded reviewer's reason includes: `Load penalty: N recent reviews (heavy queue)`
- Lower-loaded reviewer ranked higher (or equal and ranked above)

---

#### TC-21 · High Acceptance Rate Boost

**Goal:** Verify a reviewer with ≥ 80% approval rate gets +2 pts boost.

**Setup:**
1. Have a contributor approve several PRs in this repo (builds approval rate)
2. Have another contributor who mostly leaves "Request changes" reviews

**PR to create:** Any file both are candidates for.

**Comment on PR:**
```
/reviewers
```

**Expected:**
- High-approval reviewer's reason includes: `High review acceptance rate (N%)`
- Boosted score (+2) reflected in ranking

---

### Phase 4 — Slash Command Behavior

---

#### TC-22 · Cooldown Enforcement (30 seconds)

**Goal:** Verify the second `/reviewers` within 30 seconds is silently ignored.

**Steps:**
1. Comment `/reviewers` on any open PR → wait for Watchflow response
2. Immediately comment `/reviewers` again (within 30 seconds)

**Expected:**
- First command: full response posted
- Second command: **no response** (silently ignored by cooldown)

---

#### TC-23 · `--force` Bypasses Cooldown

**Goal:** Verify `/reviewers --force` re-runs even within the 30-second window.

**Steps:**
1. Comment `/reviewers` on any open PR → wait for response
2. Immediately comment `/reviewers --force`

**Expected:**
- First command: full response
- Second command with `--force`: **another full response posted** (cooldown bypassed)

---

#### TC-24 · `/risk` Cooldown

**Goal:** Verify `/risk` also has a 30-second cooldown (separate from `/reviewers`).

**Steps:**
1. Comment `/risk` → wait for response
2. Immediately comment `/risk` again (within 30 seconds)

**Expected:**
- First `/risk`: response posted
- Second `/risk`: silently ignored

---

### Phase 5 — Labels & GitHub Integration

---

#### TC-25 · Risk Label Applied by `/risk`

**Goal:** Verify correct risk label is applied to the PR.

**Steps:** Run `/risk` on PRs of different risk levels (TC-01 through TC-04).

**Expected labels:**
- Low risk → `watchflow:risk-low`
- Medium risk → `watchflow:risk-medium`
- High risk → `watchflow:risk-high`
- Critical risk → `watchflow:risk-critical`

Check the PR's label section on GitHub after each command.

---

#### TC-26 · Reviewer Recommendation Label

**Goal:** Verify `watchflow:reviewer-recommendation` label is applied.

**Steps:** Run `/reviewers` on any PR.

**Expected:**
- PR has both `watchflow:risk-{level}` AND `watchflow:reviewer-recommendation` labels

---

#### TC-27 · Reviewer Auto-Assignment

**Goal:** Verify that GitHub actually assigns the recommended reviewers to the PR.

**Steps:** Run `/reviewers` on a PR where you are not already a reviewer.

**Expected:**
- PR's **Reviewers** section (right sidebar on GitHub) shows the recommended user(s) added
- Reviewer gets a GitHub notification

---

### Phase 6 — Persistence & Data

---

#### TC-28 · Expertise JSON Created

**Goal:** Verify `.watchflow/expertise.json` is committed to the repo after a `/reviewers` run.

**Steps:**
1. Delete `.watchflow/expertise.json` if it exists
2. Run `/reviewers` on any PR

**Expected:**
- A new commit appears on the base branch adding `.watchflow/expertise.json`
- File contains `contributors` map with file paths and commit counts

**Check:**
```
# On your local machine after the PR comment:
git fetch origin main
git show origin/main:.watchflow/expertise.json
```

---

#### TC-29 · Recommendations JSON Updated

**Goal:** Verify `.watchflow/recommendations.json` is updated with the recommendation record.

**Steps:** Run `/reviewers` on a PR.

**Expected:**
- `.watchflow/recommendations.json` on base branch contains a new record:
  ```json
  {
    "pr_number": <N>,
    "recommended_at": "<ISO8601>",
    "risk_level": "<level>",
    "recommended_reviewers": ["username"]
  }
  ```

---

#### TC-30 · Historical Expertise Used in Subsequent Runs

**Goal:** Verify that after `expertise.json` exists, subsequent `/reviewers` calls use historical expertise as a scoring signal.

**Steps:**
1. Run `/reviewers` on a PR (creates `expertise.json`)
2. Open a new PR touching the same files
3. Run `/reviewers` on the new PR

**Expected:**
- Reviewer reason includes: `Historical expertise in N changed file(s)`
- This signal appears in addition to commit history

---

### Phase 7 — Response Format

---

#### TC-31 · `/risk` Response Format

**Goal:** Verify the `/risk` response is correctly formatted.

**Run `/risk` on any PR and check the comment contains:**
- Heading: `Watchflow: Risk Assessment` (or similar)
- Risk level emoji (🟢 Low / 🟡 Medium / 🟠 High / 🔴 Critical)
- Risk score number
- Table or list of risk signals with labels, descriptions, and point values

---

#### TC-32 · `/reviewers` Response Format

**Goal:** Verify the `/reviewers` response matches the spec from the CTO ticket.

**Run `/reviewers` on any PR and check the comment contains:**
```
## Watchflow: Reviewer Recommendation

**Risk:** <emoji> <Level> (<N> files changed)

**Recommended:**
1. @username — one-sentence reason
2. @username — one-sentence reason

**Summary:** one-line LLM-generated summary

<details>
<summary>Risk signals considered</summary>
- **Signal label**: description
</details>
```

---

#### TC-33 · LLM Reasoning Present

**Goal:** Verify each recommended reviewer has a natural-language reason from the LLM ranker.

**Run `/reviewers` on a critical-path PR.**

**Expected:**
- Each reviewer in the numbered list has a **one-sentence reason** (not just a score)
- The reason is contextual (mentions billing expertise, CODEOWNERS, commit history, etc.)
- A `**Summary:**` line appears with an overall one-line recommendation

---

## Quick Reference: Which PR for Which Test Case

| Test Cases | PR touches | Risk level |
|-----------|-----------|------------|
| TC-01, TC-16 | README only | Low |
| TC-02 | Any file, 600+ LOC | Medium |
| TC-03 | src/index.js, bad title | High |
| TC-04, TC-11, TC-14, TC-15, TC-17, TC-18 | src/billing/payment.js | Critical |
| TC-05 | 51+ new files | Medium+ |
| TC-06 | 1 file, 2001+ lines | Medium+ |
| TC-07 | src/payments/refund.js (no test file) | Medium+ |
| TC-08 | Any (new GitHub account) | Any |
| TC-09 | Any, title starts "Revert:" | Any+ |
| TC-13 | src/billing/* (team in CODEOWNERS) | Critical |
| TC-19 | src/billing/* (no CODEOWNERS) | Critical |
| TC-20, TC-21 | Any (load/acceptance setup required) | Any |
| TC-22, TC-23, TC-24 | Any open PR | Any |
