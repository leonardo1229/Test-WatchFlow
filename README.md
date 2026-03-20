# Test-Watchflow — Risk Assessment & Reviewer Recommendation Test Guide

This repository is used to validate the **Watchflow** `/risk` and `/reviewers` slash commands against the configured rules.

---

## Active Rules (`.watchflow/rules.yaml`)

| # | Rule | Severity |
|---|------|----------|
| 1 | PRs must reference a linked issue (e.g. `Fixes #123`) | 🟠 High |
| 2 | When a PR modifies CODEOWNERS paths, those owners must be added as reviewers | 🟠 High |
| 3 | All review comment threads must be resolved before merge | 🟠 High |
| 4 | PR total lines changed must not exceed 500 lines | 🟡 Medium |
| 5 | PR titles must follow a pattern (`feat:`, `fix:`, `docs:`, etc.) and description must be ≥ 50 chars | 🟡 Medium |
| 6 | Source code changes must include a CHANGELOG or `.changeset` update | 🟡 Medium |
| 7 | PR description must accurately reflect the actual code changes in the diff | 🟡 Medium |

> All 7 rules are **behavioural** (no file-path patterns). Risk scoring for `/risk` uses PR size and contributor signals (see table below).

---

## Risk Score Reference

| Signal | Points | Trigger condition |
|--------|--------|-------------------|
| Watchflow rule match | severity pts (capped at 10) | Rules with file-path patterns match changed files |
| Large changeset | +3 | > 50 files changed |
| Moderate changeset | +1 | 21–50 files changed |
| Many lines changed | +2 | > 2 000 lines added/removed |
| Significant lines changed | +1 | 501–2 000 lines added/removed |
| No test coverage | +2 | Source files (`.py`, `.js`, `.ts`, `.go`, etc.) changed without any test file |
| First-time contributor | +2 | PR author association is `NONE`, `FIRST_TIME_CONTRIBUTOR`, or `FIRST_TIMER` |
| Revert PR | +2 | PR title starts with `Revert` |

**Risk thresholds:** 🟢 Low ≤ 3 | 🟡 Medium 4–6 | 🟠 High 7–10 | 🔴 Critical > 10

---

## One-time Setup

1. **Install Watchflow GitHub App** on this repo.
2. **Set CODEOWNERS**: open `.github/CODEOWNERS` and replace placeholder usernames with your actual GitHub accounts. Add a second collaborator for load-balancing tests.
3. **Watchflow must be running** (or deployed) and connected to this repo via webhook.
4. All slash commands (`/risk`, `/reviewers`) are posted as PR comments.

---

## Test Cases

---

### Phase 1 — Risk Assessment (`/risk`)

---

#### TC-01 · Low Risk PR

**Goal:** Verify `/risk` reports `Low` (score ≤ 3).

**PR to create:**
- Branch from `main`, edit only `README.md` (1–5 lines)
- Title: `docs: update README`
- Description (≥ 50 chars + `Fixes #1`): `Update README to add setup instructions. Fixes #1`
- Include `CHANGELOG.md` update

**Comment on PR:**
```
/risk
```

**Expected response:**
- Risk: **Low** (score 0)
- No rule signals (no path-based rules in this repo)
- No size signals (tiny PR, 2 files)
- Label `watchflow:risk-low` applied

---

#### TC-02 · Medium Risk PR (file count + LOC signal)

**Goal:** Verify `/risk` reports `Medium` (score 4–6) from size signals.

**PR to create:**
- Branch from `main`, create **21–50 new JS files** under `src/utils/` (e.g. `util_01.js` … `util_30.js`, each ~25 lines = ~750 LOC total)
- Title: `feat: add utility modules`
- Description (≥ 50 chars + `Fixes #2`): `Adds a set of utility modules used across the application. Fixes #2`
- Include `CHANGELOG.md` update

**Comment on PR:**
```
/risk
```

**Expected response:**
- Risk: **Medium** (score 4 = +1 moderate changeset + +1 significant LOC + +2 no test coverage)
- Signals: `Moderate changeset` (+1), `Significant lines changed` (+1), `No test coverage` (+2)
- Label `watchflow:risk-medium` applied

---

#### TC-03 · High Risk PR (large changeset)

**Goal:** Verify `/risk` reports `High` (score 7–10) from extreme size signals.

**PR to create:**
- Branch from `main`, create **51+ new JS files** under `src/generated/` (e.g. `gen_01.js` … `gen_55.js`, each ~45 lines = ~2 475 LOC total)
- Do **NOT** add any test file
- Title: `feat: add generated modules`
- Description (≥ 50 chars + `Fixes #3`): `Adds generated modules for the application layer. Fixes #3`
- Include `CHANGELOG.md` update

**Comment on PR:**
```
/risk
```

**Expected response:**
- Risk: **High** (score 7 = +3 large changeset + +2 many lines + +2 no test coverage)
- Signals: `Large changeset` (+3), `Many lines changed` (+2), `No test coverage` (+2)
- Label `watchflow:risk-high` applied

---

#### TC-04 · No Test Coverage Signal

**Goal:** Verify `No test coverage (+2 pts)` fires when source code is added without test files.

**PR to create:**
- Branch from `main`, add `src/payments/refund.js` (new JS file, any content)
- Do **NOT** add any file matching `test` or `spec` pattern
- Title: `feat: add refund module`
- Description (≥ 50 chars + `Fixes #4`): `Adds refund functionality to the payments module. Fixes #4`
- Include `CHANGELOG.md` update

**Comment on PR:**
```
/risk
```

**Expected response:**
- Signal: `No test coverage` (+2 pts)
- Overall risk depends on PR size (likely Low to Medium)

---

#### TC-05 · Large Changeset Signal (> 50 files)

**Goal:** Verify `Large changeset (+3 pts)` fires when > 50 files are changed.

**PR to create:**
- Branch from `main`, create **51+ tiny files** (e.g. `src/stubs/stub_01.js` … `stub_51.js`, each 1 line)
- Title: `chore: add stubs`
- Description (≥ 50 chars + `Fixes #5`): `Adds stub files for upcoming module development. Fixes #5`
- Include `CHANGELOG.md` update

**Comment on PR:**
```
/risk
```

**Expected response:**
- Signal: `Large changeset` (+3 pts, "N files changed")
- Risk at least Medium

---

#### TC-06 · Many Lines Changed Signal (> 2 000 LOC)

**Goal:** Verify `Many lines changed (+2 pts)` fires when > 2 000 lines are added/removed.

**PR to create:**
- Branch from `main`, add a single large file (e.g. `src/data/large_dataset.json`) with 2 001+ lines
- Title: `feat: add data file`
- Description (≥ 50 chars + `Fixes #6`): `Adds a large static data file used by the analytics module. Fixes #6`
- Include `CHANGELOG.md` update

**Comment on PR:**
```
/risk
```

**Expected response:**
- Signal: `Many lines changed` (+2 pts)

---

#### TC-07 · First-Time Contributor Signal

**Goal:** Verify `First-time contributor (+2 pts)` fires when the PR author is new to the repo.

**Setup:** Use a **brand-new GitHub account** that has never contributed to this repo.

**PR:** Any small change (e.g. edit `README.md`), conventional title, proper description with issue link, include `CHANGELOG.md`.

**Comment on PR:**
```
/risk
```

**Expected response:**
- Signal: `First-time contributor` (+2 pts, "@username is a new contributor")

---

#### TC-08 · Revert PR Signal

**Goal:** Verify `Revert PR (+2 pts)` fires when the PR title starts with `Revert`.

**PR to create:**
- Branch from `main`, revert any recent commit
- Title: **must start with** `Revert` (e.g. `Revert: feat: add utility modules`)
- Description (≥ 50 chars + issue link): `Reverts the utility modules added in the previous PR. Fixes #8`
- Include `CHANGELOG.md` update

**Comment on PR:**
```
/risk
```

**Expected response:**
- Signal: `Revert PR` (+2 pts, "This PR reverts previous changes")

---

### Phase 2 — Reviewer Recommendation (`/reviewers`)

---

#### TC-09 · CODEOWNERS-Based Recommendation

**Goal:** Verify CODEOWNERS owners are recommended first.

**Setup:** Ensure `.github/CODEOWNERS` has at least one path mapped to a real GitHub user.

**PR to create:** Change a file covered by CODEOWNERS. Proper title + description + issue link + CHANGELOG.

**Comment on PR:**
```
/reviewers
```

**Expected response:**
- CODEOWNERS owner appears as recommended reviewer
- Reason mentions: CODEOWNERS or code ownership
- Label `watchflow:reviewer-recommendation` applied
- Reviewer actually assigned to the PR

---

#### TC-10 · No CODEOWNERS Fallback (commit history expertise)

**Goal:** Verify commit history is used when no CODEOWNERS exists.

**Setup:** Temporarily remove or empty `.github/CODEOWNERS`. Ensure the repo has prior commits by different contributors.

**PR to create:** Edit any source file (e.g. `src/index.js`).

**Comment on PR:**
```
/reviewers
```

**Expected response:**
- Reviewer recommended based on commit history
- Reason mentions recent commits to the changed file
- Top committer for that file is recommended

**Cleanup:** Restore CODEOWNERS.

---

#### TC-11 · PR Author Excluded from Recommendations

**Goal:** Verify the PR author never appears in the recommended reviewer list.

**Setup:** The PR author must have prior commits in the changed files (would normally score as a candidate).

**PR to create:** Any PR where the author has commit history on changed files.

**Comment on PR:**
```
/reviewers
```

**Expected response:**
- PR author login does **NOT** appear in the recommended or assigned list

---

#### TC-12 · Low Risk → 1 Reviewer Assigned

**Goal:** Verify that a low-risk PR gets exactly 1 reviewer.

**PR to create:** Same setup as TC-01 (tiny README change, correct title, issue link, CHANGELOG updated).

**Comment on PR:**
```
/reviewers
```

**Expected response:**
- Risk: Low
- **Exactly 1 reviewer** assigned
- Response shows 1 ranked entry

---

#### TC-13 · High Risk → 2–3 Reviewers Assigned

**Goal:** Verify that a high-risk PR gets 2–3 reviewers.

**Setup:** Ensure CODEOWNERS has at least 2 individual users mapped to paths being changed.

**PR to create:** Same setup as TC-03 (51+ files, 2 000+ LOC, no tests).

**Comment on PR:**
```
/reviewers
```

**Expected response:**
- Risk: High
- **2–3 reviewers** assigned

---

### Phase 3 — Load Balancing & Acceptance Rate

---

#### TC-14 · Overloaded Reviewer Penalized

**Goal:** Verify a reviewer with many recent reviews is ranked lower.

**Setup:**
1. Have contributor A review 5+ recent PRs in this repo
2. Have contributor B with fewer reviews
3. Both are CODEOWNERS or top committers for the changed files

**PR to create:** Edit any file both contributors own.

**Comment on PR:**
```
/reviewers
```

**Expected response:**
- Overloaded reviewer's reason includes: `Load penalty: N recent reviews (heavy queue)`
- Lower-loaded reviewer ranked higher

---

#### TC-15 · High Acceptance Rate Boost

**Goal:** Verify a reviewer with ≥ 80% approval rate gets +2 pts boost.

**Setup:**
1. Contributor A approves several PRs (builds high approval rate)
2. Contributor B leaves mostly "Request changes" reviews

**PR to create:** Any file both contributors are candidates for.

**Comment on PR:**
```
/reviewers
```

**Expected response:**
- Contributor A's reason includes: `High review acceptance rate (N%)`

---

### Phase 4 — Slash Command Behaviour

---

#### TC-16 · Cooldown Enforcement (30 seconds)

**Goal:** Verify the second `/reviewers` within 30 seconds is silently ignored.

**Steps:**
1. Comment `/reviewers` on any open PR → wait for Watchflow response
2. Immediately comment `/reviewers` again (within 30 seconds)

**Expected:**
- First command: full response posted
- Second command: **no response** (silently ignored)

---

#### TC-17 · `--force` Bypasses Cooldown

**Goal:** Verify `/reviewers --force` re-runs even within the 30-second window.

**Steps:**
1. Comment `/reviewers` → wait for response
2. Immediately comment `/reviewers --force`

**Expected:**
- First command: full response
- Second command with `--force`: **another full response posted**

---

#### TC-18 · `/risk` Cooldown

**Goal:** Verify `/risk` has a separate 30-second cooldown.

**Steps:**
1. Comment `/risk` → wait for response
2. Immediately comment `/risk` again

**Expected:**
- First `/risk`: response posted
- Second `/risk` (within 30 s): silently ignored

---

### Phase 5 — Labels & GitHub Integration

---

#### TC-19 · Risk Label Applied by `/risk`

**Goal:** Verify the correct risk label is applied based on score.

**Steps:** Run `/risk` on PRs of different sizes (TC-01, TC-02, TC-03).

**Expected labels:**
- Low risk → `watchflow:risk-low`
- Medium risk → `watchflow:risk-medium`
- High risk → `watchflow:risk-high`

---

#### TC-20 · Reviewer Recommendation Label

**Goal:** Verify `watchflow:reviewer-recommendation` label is applied.

**Steps:** Run `/reviewers` on any open PR.

**Expected:** PR has both `watchflow:risk-{level}` AND `watchflow:reviewer-recommendation` labels.

---

#### TC-21 · Reviewer Auto-Assignment

**Goal:** Verify recommended reviewers are actually assigned to the PR.

**Steps:** Run `/reviewers` on a PR where the reviewer is not yet assigned.

**Expected:**
- PR's Reviewers sidebar shows the recommended user(s)
- Reviewer receives a GitHub notification

---

### Phase 6 — Persistence & Data

---

#### TC-22 · Expertise JSON Created

**Goal:** Verify `.watchflow/expertise.json` is committed to the repo after a `/reviewers` run.

**Steps:**
1. Delete `.watchflow/expertise.json` if it exists
2. Run `/reviewers` on any PR

**Expected:**
- A new commit appears on the base branch adding `.watchflow/expertise.json`
- File contains `contributors` map with file paths and commit counts

---

#### TC-23 · Historical Expertise Used in Subsequent Runs

**Goal:** Verify `/reviewers` uses historical expertise from `expertise.json` on subsequent runs.

**Steps:**
1. Run `/reviewers` on a PR (creates `expertise.json`)
2. Open a new PR touching the same files
3. Run `/reviewers` on the new PR

**Expected:**
- Reviewer reason includes: `Historical expertise in N changed file(s)`

---

### Phase 7 — Response Format

---

#### TC-24 · `/risk` Response Format

**Run `/risk` on any PR and verify the comment contains:**
- Heading: `🛡️ Watchflow: Risk Assessment`
- Risk level emoji (🟢 Low / 🟡 Medium / 🟠 High / 🔴 Critical) + score number
- List of risk signals with label, description, and points

---

#### TC-25 · `/reviewers` Response Format

**Run `/reviewers` on any PR and verify the comment contains:**
```
👥 Watchflow: Reviewer Recommendation

**Risk:** <emoji> <Level> (<N> files changed)

**Recommended:**
1. @username — one-sentence reason

**Summary:** one-line LLM-generated summary

<details>
<summary>Risk signals considered</summary>
- **Signal label**: description
</details>
```

---

## Quick Reference: Which PR for Which Test Case

| Test Case | What to change | Expected risk |
|-----------|---------------|---------------|
| TC-01, TC-12 | README.md + CHANGELOG.md only | 🟢 Low |
| TC-02 | 21–50 JS files, ~750 LOC, no tests | 🟡 Medium |
| TC-03, TC-13 | 51+ files, 2 000+ LOC, no tests | 🟠 High |
| TC-04 | 1 source file, no test file | Low+ (no test signal) |
| TC-05 | 51+ tiny files | Medium+ (file count signal) |
| TC-06 | 1 file, 2 001+ lines | Medium+ (LOC signal) |
| TC-07 | Any (brand-new account) | Low+ (contributor signal) |
| TC-08 | Any, title starts `Revert` | Low+ (revert signal) |
| TC-09 | File covered by CODEOWNERS | Any |
| TC-14, TC-15 | Any (load/acceptance setup required) | Any |
