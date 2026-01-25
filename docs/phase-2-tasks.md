# Phase 2: Core Gameplay - Task List

This document tracks all tasks for Phase 2 of Competiscore development, focusing on Game Types, Teams, Match Recording, and ELO Systems.

## Progress Summary

| Category                    | Status         | Progress |
| --------------------------- | -------------- | -------- |
| 1. Game Types               | ✅ Complete    | 100%     |
| 2. Team Management          | ⏳ Not Started | 0%       |
| 3. Match Recording          | ⏳ Not Started | 0%       |
| 4. ELO & Rankings           | ⏳ Not Started | 0%       |
| 5. Standings & Leaderboards | ⏳ Not Started | 0%       |
| 6. Integration & Polish     | ⏳ Not Started | 0%       |

---

## 1. Game Types

**Status: ✅ Complete**

### Database Schema

- [x] Game type table (id, leagueId, name, description, logo, category, config, createdAt)
- [x] Game category enum (head_to_head, free_for_all, high_score)
- [x] Game config JSON schema (scoring type, win condition, rules as markdown, etc.)

### Game Type CRUD

- [x] Create game type form
- [x] Validations (name uniqueness within league, limit check)
- [x] Game type settings page
- [x] Archive/Delete game type
- [x] Usage limit tracking (max 20 game types per league)
- [x] RBAC: Only managers and executives can create/edit game types

### Templates

- [x] Define static templates (Ping Pong, Pool, Mario Kart, etc.)
- [x] Template selection UI during creation
- [x] Pre-fill configuration from template

### UI/UX

- [x] Game types list view
- [x] Game type detail page
- [x] Empty state messaging
- [x] Game type icons (20 colorful SVG icons)

---

## 2. Team Management

**Status: ⏳ Not Started**

### Database Schema

- [ ] Team table (id, leagueId, name, logo, createdAt)
- [ ] Team member table (teamId, userId/placeholderId, joinedAt)

### Team Operations

- [ ] Create team form
- [ ] Add/Remove members (real users or placeholders)
- [ ] Edit team settings
- [ ] Delete team
- [ ] View team profile

### UI/UX

- [ ] Teams list view
- [ ] Team detail page
- [ ] Team member management UI

---

## 3. Match Recording

**Status: ⏳ Not Started**

### Database Schema

- [ ] Match table (id, leagueId, gameTypeId, date, status, recorderId)
- [ ] Match participant table (matchId, teamId/userId, score, rank, result)
- [ ] Match status enum (pending, completed, disputed)

### Match Operations

- [ ] Record match form (dynamic based on game type config)
- [ ] Support for H2H (1v1, Team vs Team)
- [ ] Support for FFA (Multiple players/teams)
- [ ] Support for High Score submissions
- [ ] Validation (valid scores, participants)

### Challenge System

- [ ] Create challenge (pending match)
- [ ] Accept/Reject challenge
- [ ] Record result for pending challenge

### UI/UX

- [ ] "Record Match" button (prominent)
- [ ] Match history list
- [ ] Match detail view

---

## 4. ELO & Rankings

**Status: ⏳ Not Started**

### Database Schema

- [ ] Rating table (entityId, entityType, gameTypeId, rating, matchCount, winCount, lossCount, drawCount)
- [ ] Rating history table (ratingId, matchId, oldRating, newRating, change)

### Logic

- [ ] ELO calculation service (H2H)
- [ ] ELO calculation service (FFA/Multiplayer)
- [ ] Rating update trigger (on match completion)
- [ ] Team rating persistence (independent of roster)

### Integration

- [ ] Update ratings after match recording
- [ ] Handle rating decay (optional/deferred)
- [ ] Provisional rating logic (K-factor adjustment)

---

## 5. Standings & Leaderboards

**Status: ⏳ Not Started**

### UI/UX

- [ ] Leaderboard component (sortable columns)
- [ ] Game type dashboard (Standings + Recent Matches)
- [ ] Filtering (Time period, active/inactive)
- [ ] Personal stats page (Performance across game types)
- [ ] League dashboard activity feed

---

## 6. Integration & Polish

**Status: ⏳ Not Started**

### Placeholder Integration

- [ ] Link placeholder to real user on join (migrate match history)

### Discovery

- [ ] Update public league search to support filtering by game type

### Usage Limits

- [ ] Enforce game type limits (20 max)

### Polish

- [ ] Loading states for new pages
- [ ] SEO metadata for new pages
- [ ] Error handling for match recording
