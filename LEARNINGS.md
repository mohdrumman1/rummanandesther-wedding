## 2026-06-26 — Read-only RSVP admin summary counters all zero

**Tags:** rsvp, admin, read-only, dashboard, counters
**Status:** Fixed

**Issue:** The read-only admin user ("suja") saw Complete=0, Pending=145, Sangeet Yes=0, Ceremony Yes=0 while the full admin saw correct numbers (Complete=16, Pending=129, Sangeet Yes=23, Ceremony Yes=25). All four counters were wrong.

**Investigation:**
1. Read `worker/migrations/0001_initial.sql` to confirm field names (`sangeet_attending`, `ceremony_attending`, `rsvp_notes.submitted_at`).
2. Read `worker/src/index.js` — found `readOnlyGroup()` (line 570) strips guest attendance data (`sangeetAttending: null`, `ceremonyAttending: null`, `childrenCount: 0`) but was NOT including a pre-computed summary, so the frontend had no real data to count from.
3. Read `src/lib/rsvpUtils.js` — `rsvpCounts()` derives counts from per-guest fields; `groupStatus()` derived status from per-guest fields. Both relied on guest-level data that was zeroed out in read-only responses.
4. Read `src/pages/RsvpAdminPage.jsx` — confirmed counter rendering uses `rsvpCounts(groups)` and per-row sangeet/ceremony counts also derived from `guest.sangeetAttending`.

**Root cause:**
`readOnlyGroup()` in `worker/src/index.js` (line 572-583 pre-fix) hardcoded `sangeetAttending: null` and `ceremonyAttending: null` on every guest to prevent data leakage. However, it did not include a server-side pre-computed summary, so the frontend's `rsvpCounts()` (`src/lib/rsvpUtils.js:30`) had no real attendance data to aggregate — all counts came out zero. The "Complete" count was also broken because `groupStatus()` re-derived status from the zeroed guest fields instead of using a server-supplied status.

**Fix:**
Three-part fix in commit `cbbebd5`:

1. **`worker/src/index.js`** — Added `groupSummary()` function (new lines 156-175) that computes status, sangeetYes, ceremonyYes, sangeetNo, ceremonyNo, children from real guest data. Added `summary: groupSummary(group)` to `readOnlyGroup()` return value so the API includes accurate aggregate counts without exposing per-guest sensitive fields. Also added `NO_STORE_HEADERS` to both admin groups responses.

   Key diff in `readOnlyGroup()`:
   ```js
   // Before: no summary field
   function readOnlyGroup(group) {
     return {
       id: group.accessCode,
       householdName: group.householdName,
       accessCode: group.accessCode,
       guests: group.guests.filter(...).map(guest => ({
         name: guest.name,
         sangeetAttending: null,   // zeroed — broke counters
         ceremonyAttending: null,  // zeroed — broke counters
         childrenCount: 0,
       })),
     };
   }

   // After: summary computed from real data before guests are stripped
   function readOnlyGroup(group) {
     return {
       id: group.accessCode,
       householdName: group.householdName,
       accessCode: group.accessCode,
       summary: groupSummary(group),  // <-- added
       guests: group.guests.filter(...).map(guest => ({
         name: guest.name,
         sangeetAttending: null,
         ceremonyAttending: null,
         childrenCount: 0,
       })),
     };
   }
   ```

2. **`src/lib/rsvpUtils.js`** — `groupStatus()`: added early return `if (group.summary?.status) return group.summary.status` so read-only groups use the server-supplied status instead of re-deriving from zeroed guest fields. `rsvpCounts()`: added a `if (group.summary)` branch that reads sangeetYes/ceremonyYes/etc. from the summary instead of per-guest fields.

3. **`src/pages/RsvpAdminPage.jsx`** — Per-row sangeet/ceremony counts changed from `group.guests.filter(...)` to `group.summary?.sangeetYes ?? group.guests.filter(...)` so the table columns also show correct values for read-only.

**Verify:**
- `npm run lint` — passes clean (no output, exit 0).
- Logic trace: read-only login → `handleAdminGroupsGet` → `readOnlyGroup()` → `groupSummary(group)` called on full group data from DB → `summary.sangeetYes = 23`, `summary.ceremonyYes = 25`, `summary.status = 'complete'/'pending'` per group → frontend `rsvpCounts()` reads `group.summary` branch → correct totals displayed.

**If it recurs:** Check `readOnlyGroup()` in `worker/src/index.js` — confirm `summary: groupSummary(group)` is present. Check `groupSummary()` is called BEFORE guests are stripped. Check `rsvpUtils.js:rsvpCounts()` has the `if (group.summary)` branch. Verify with a `console.log` of the `/api/admin/groups` response as the read-only user and confirm `summary.sangeetYes` is non-zero.

---

## 2026-06-26 — Frontend dist stale after fix commit (cbbebd5)

**Tags:** build, deploy, netlify, stale-dist
**Status:** Fixed

**Issue:** After commit `cbbebd5` ("Fix read-only RSVP dashboard counts") was created at 17:04:40, the `dist/` folder still contained a build from 17:03:49 (55 seconds earlier). The fix in `src/lib/rsvpUtils.js` and `src/pages/RsvpAdminPage.jsx` was NOT included in the deployed Netlify site.

**Root cause:** The build was run before the fix commit was finalised. `npm run build` must be re-run after any source change.

**Fix:** Ran `npm run build` — new bundle (`dist/assets/index-DF78Na-u.js`, timestamp 19:24:18) confirmed to contain `summary.status`, `sangeetYes`, `ceremonyYes` from the fix. Netlify deploy must also be triggered with the new dist.

**Verify:** Check `dist/assets/index-*.js` timestamp is newer than the last fix commit. Grep for `summary.status` in the bundle to confirm the frontend fix is included.

**If it recurs:** Always run `npm run build` after any source edit and before deploying to Netlify. Also deploy the worker via `npm run worker:deploy` after any `worker/src/index.js` changes.
## 2026-07-02 — Read-only access must exclude bearer invite links

**Learning:** A view-only user should receive only the information needed to inspect the invite list. Do not send RSVP access codes or invite URLs to read-only clients, and do not render Copy Invite or Copy Link controls. Hiding the buttons alone is insufficient because a URL present in the API response or page can still be copied or shared accidentally.

**Rule:** Treat bearer RSVP links as a send-invitation permission. Keep them server-side unavailable to read-only roles, and verify every admin surface before granting or changing user access.
