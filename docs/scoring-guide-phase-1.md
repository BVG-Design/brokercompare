# Phase 1 Scoring Guide

## Review verification & moderation logic

- Reviews start in a **pending** moderation state.
- Moderators approve or reject reviews before they appear in public ratings.
- Only **approved** reviews count toward displayed averages and review counts.
- A review can be marked as **verified** when the reviewer confirms their BrokerCompare account
  (e.g., via login-backed verification). Verified reviews surface a badge in admin tooling.

### Status fields

- `moderationStatus` (preferred) and `status` (legacy): `pending | approved | rejected`
- `isVerified`: boolean flag that marks a review as verified.
- `verificationMethod`: optional string describing how verification occurred.
