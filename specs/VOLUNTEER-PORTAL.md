# Volunteer Portal — Version One

Status: Draft specification; confirmed requirements are recorded below. Open decisions at the end must be resolved before implementation.

Extends [Side Quests #2: Volunteer Portal](SIDEQUESTS-2026.md#2-volunteer-portal). This document defines the detailed version-one scope. It does not authorize application implementation.

## Purpose and scope

Provide festival-specific self-service volunteer signup and cancellation, and admin tools to manage roles, slots, and coverage. Reuse the existing Firebase configuration and authenticated accounts. Admin screens require the Firebase `admin` intent type described below.

Version one supports exactly one volunteer per slot. Multiple-capacity slots are deferred. Where additional coverage is needed, admins may create separately named roles such as “Table Monitor 1” and “Table Monitor 2.” Room Proctor uses the special structure described below.

### Visibility and authorization

- A Firebase `volunteer` intent type may access only that authenticated volunteer's own information and commitments for the selected festival. It must never access another volunteer's identity, contact information, assignments, or schedule.
- Volunteer signup may show slots available to book, but it must not reveal who holds an unavailable slot or expose a consolidated coverage schedule.
- A Firebase `admin` intent type may access all volunteers in the selected festival, including their names, contact information, assignments, and consolidated schedule. This applies to every Festival administrative role, including Admin, Division Chair, Concert Chair, and equivalent admin roles.

### Festival scope

All volunteer activity is scoped to exactly one festival. A volunteer signs up for duties and maintains a schedule within the selected festival. If the organization runs multiple festivals, the volunteer must sign up separately for each one; enrollment, contact information, commitments, roles, slots, and assignments do not carry over between festivals. Booking-conflict validation applies within a festival only.

## Signup screen

The signup flow operates in a selected festival context and has four steps:

1. **Authenticate:** Sign in using Firebase SSO or an email link, reusing the existing Firebase configuration.
2. **Choose a role:** Display role descriptions and any optional HTTP link to additional details. Explain that volunteers choose one role per signup pass and can return to choose another role afterward.
3. **Choose slots:** Allow multiple slots for the selected role. Display weekday, date in `MM/DD` format (for example, `03/31`), and AM or PM. Display optional informational time text when present. Room Proctor slots also display Division and Adjudicator.
4. **Enter contact information and submit:** Name, email, and phone are required. Only email is prefilled; it is fixed to the authenticated account’s email and cannot be replaced with another contact email. Name and phone must be entered again on subsequent signup passes.

Volunteers may complete one role’s bookings, return to the volunteer screen, and select slots for another role.

### Booking rules

- Each slot has a maximum of one active volunteer assignment.
- Across all roles in the selected festival, a volunteer may hold at most one AM assignment and one PM assignment on a given festival-local date.
- AM and PM determine conflicts. Informational time text does not affect availability or conflict validation.
- Submitting several slots is all-or-nothing. If any selection is unavailable or conflicts at submission time, no selected slots are booked. Explain the affected selections and require the volunteer to revise before resubmitting.
- Enforce capacity and volunteer conflicts atomically, including simultaneous submissions.
- Successful bookings appear on the volunteer review screen regardless of Mailchimp availability.

## Roles and slots

### Roles

Admins create roles within a festival before creating their slots. Each role has:

- A slug.
- A required display name entered by an admin. Role names may differ by festival.
- A description.
- An optional HTTP link to additional details.

New festivals include two default roles, with initial display names **Room Proctor** and **General**. Admins may change those display names or add roles for festival-specific needs. A role's type, rather than its display name, determines its structure: only the Room Proctor type has the special structure described below; General and other roles use the standard structure.

### Slots

Each slot belongs to a role in one festival and has:

- A required date.
- A required AM or PM designation.
- Optional free-text informational time, such as `9am - 4:30pm`. No time parsing or time-range validation is required.
- Division and Adjudicator only when the role is Room Proctor.

### Special Room Proctor role

Use one special **Room Proctor** role. Every slot for this role requires both Division and Adjudicator, entered as free text. Other roles do not have these fields.

Multiple Room Proctor slots may share a date and AM/PM designation when they represent different adjudicators. For example, Room Proctor slots for Dr Brown and Mr Yellow on `03/31` AM require two different volunteers. They remain slots under the same role, rather than separately named roles per adjudicator.

## Review screens

Both screens use the selected festival’s local timezone, default to a week view, and offer a day-view toggle. Dates use `MM/DD` and include weekday information. Visibility of slots and assignment details differs by intent type as specified below.

### Volunteer review

- Requires authentication.
- Shows only the authenticated volunteer's own commitments in the selected festival.
- Allows volunteers to cancel only their own assignments.
- Shows only the authenticated volunteer's own contact information; email and phone for all other volunteers are inaccessible.

### Admin review

- Requires the Firebase `admin` intent type, regardless of the holder's Festival administrative role.
- Shows consolidated coverage and gaps, with assigned volunteer names.
- Does not provide general volunteer-duty role filtering. An optional filter may distinguish Room Proctor assignments from non-Room-Proctor assignments.
- Allows admins to cancel any assignment.
- Allows admins to see all volunteer contact information and schedules for the selected festival.

### Cancellation

Volunteers and admins may cancel assignments at any time; there is no cancellation cutoff. Cancellation immediately reopens the slot for signup. Ordinary assignment cancellation emits a Mailchimp cancellation event for that slot.

## Admin build screen

- Requires the Firebase `admin` intent type, regardless of the holder's Festival administrative role.
- Create roles, then create slots for each role.
- Edit and delete roles and slots regardless of signup status.
- Version one does not require impact checks or a cancellation prerequisite before edits or deletion.
- Deleting a role does not trigger Mailchimp events in version one.

The treatment of existing assignments after schedule edits, and events on direct slot deletion, remain open below.

## Mailchimp integration

- Mailchimp sends the volunteer emails.
- Every signup registers the authenticated email with the volunteer audience segment.
- Each booked slot emits a signup/welcome event intended to produce one email per slot. A submission booking three slots produces three slot-specific events/emails.
- Each ordinary assignment cancellation emits a slot-specific cancellation event, including cancellations initiated by admins.
- Role deletion is explicitly exempt from event generation in version one.
- Mailchimp failure does not prevent a booking or cancellation from succeeding. Volunteers can verify their assignments on their review page.

The Mailchimp audience/segment identifiers, event contract, failure retry policy, and reminder ownership/timing are not yet specified. Sidequest #2 calls for automated pre-event reminders; this requirement remains unresolved rather than implicitly removed.

## Conceptual records

Retain the sidequest’s conceptual records: `volunteer`, `volunteer_role`, `volunteer_shift`, and `volunteer_assignment`. Exact storage design is outside this specification draft.

- A volunteer enrollment links an existing authenticated account to one festival and has required name, account email, and phone. The same authenticated account may have separate volunteer enrollments in multiple festivals.
- A role belongs to one festival and defines its slug, description, optional details link, and whether it is the special Room Proctor role.
- A shift belongs to one festival role and represents a dated AM/PM slot, optional time text, and Room Proctor details where applicable.
- An assignment connects a festival-scoped volunteer enrollment to a slot in that same festival.

## Acceptance criteria

1. The four-step signup supports selecting multiple slots for one role and returning to book another role.
2. Email is prefilled from authentication and cannot be edited; name and phone are required and are not prefilled, including for returning volunteers.
3. A slot cannot acquire more than one active assignment, even under simultaneous submissions.
4. A volunteer cannot book two slots in the same date/AM-PM period across any roles in the same festival.
5. A conflicting multi-slot submission creates no bookings and requires revised selections.
6. All slots require date and AM/PM; optional time text is displayed without time validation or conflict calculations.
7. Room Proctor slots require both free-text Division and Adjudicator; other roles do not expose those fields.
8. Two Room Proctor slots for different adjudicators can be filled independently in the same date/AM-PM period by different volunteers.
9. A Firebase `volunteer` intent type can view only its own commitments and contact information in the selected festival; it cannot access another volunteer's identity, contact information, assignments, schedule, or a consolidated coverage view.
10. A Firebase `admin` intent type, including every Festival administrative role, can view all volunteer names, contact information, assignments, and consolidated coverage for the selected festival in week and day views, with week as the default.
11. Volunteers can cancel their own assignments at any time; admins can cancel any assignment. The slot reopens immediately.
12. Admins can create, edit, and delete roles and slots without signup-status impact checks. Non-admins cannot perform these actions.
13. Each booked slot produces its own signup/welcome event and ordinary cancellation produces its own cancellation event; role deletion produces no events.
14. Mailchimp failure leaves successful bookings and cancellations intact and reflected on the review page.
15. Schedule dates display weekday and `MM/DD` in the festival’s local timezone.
16. Volunteer enrollment, contact information, roles, slots, assignments, schedules, and conflict validation are scoped to a festival. The same authenticated account must sign up separately for each festival.
17. The admin consolidated schedule has no general volunteer-duty role filter; it may optionally distinguish Room Proctor assignments from non-Room-Proctor assignments.
18. Each role has an admin-entered display name. New festivals include Room Proctor and General roles by default, and only Room Proctor uses the special Division and Adjudicator slot structure.

Implementation must include tests for changed behavior, particularly Firebase intent-type authorization, volunteer privacy, festival isolation, concurrent booking, all-or-nothing submission, cancellation, and Mailchimp failure isolation.

## Deferred scope

- Configurable slot capacity greater than one.
- Signup-impact checks before admin edits or deletion.
- Mailchimp events on role deletion.
- Time-based conflict validation or cancellation deadlines.

The optional check-in tracking mentioned in sidequest #2 has not been requested for this version.

## Open decisions

1. **Direct slot deletion:** Does deleting a filled slot suppress cancellation events, as role deletion does? Should deleting a role also remove its slots and assignments from the active schedule?
2. **Edits to filled slots:** Should existing volunteers remain assigned when admins change a slot’s date or AM/PM, even if that creates a conflict with another assignment? No impact checks are requested, so this must be reconciled with the one-place-at-a-time rule.
3. **Mailchimp failures and reminders:** Should failed events retry automatically, or is best-effort delivery sufficient? Are reminders configured entirely in Mailchimp, and are they required for version one?
