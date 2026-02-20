# Competiscore Events - User Guide

## What is Competiscore?

Competiscore is a competition tracking platform for friend groups, offices, clubs, and communities. It lets you track game results, calculate rankings, run tournaments, and build friendly rivalries. Whether you're playing Ping Pong, Mario Kart, Poker, or any other competition, Competiscore keeps score so you don't have to remember who won last time.

The app has two main ways to organize competitions:

- **Leagues** are long-running communities where members play ongoing games, track ELO ratings, and compete on permanent leaderboards.
- **Events** are time-bounded, multi-game competitions — think "Office Olympics" or "Game Night Tournament" — where teams compete across several activities for a unified point-based standing.

This guide focuses on **Events**.

---

## What is an Event?

An Event is a standalone competition where participants are divided into teams and compete across multiple game types for points. Events are separate from leagues — they have their own participants, game types, teams, and scoring system.

Key characteristics of events:

- **Team-based scoring.** Points are earned by teams, not individuals. Every match, high score session, tournament, and bonus award contributes to a team's total.
- **Point-based, not ELO.** Unlike leagues, events don't use ELO ratings. Teams accumulate points, and the team with the most points wins.
- **Flexible point values.** Points are set at the time of recording, not as fixed rules. The same event can award different point values for different matches or activities.
- **Time-bounded.** Events go through a lifecycle: Draft, Active, and Completed.

---

## Event Lifecycle

Every event goes through three phases:

### 1. Draft

The setup phase. During draft, organizers:

- Create game types (Head-to-Head, Free-for-All, Best Score)
- Create teams and assign participants to them
- Invite participants (via username search or shareable invite links)
- Create placeholder participants for people who haven't signed up yet

No matches, scores, or tournaments can be recorded during draft.

### 2. Active

The competition is live. During active:

- Matches can be recorded (Head-to-Head and Free-for-All)
- Best score sessions can be opened and scores submitted
- Tournaments can be created and played
- Discretionary points can be awarded
- New game types can still be added
- New participants can still join and be assigned to teams

### 3. Completed

The event is finished. The leaderboard is frozen and all data is preserved for reference. No new activity can be recorded. Organizers can reopen a completed event (return it to Active) if more activity needs to happen.

---

## Roles

Events have two roles:

### Organizer

Organizers have full control over the event. They can:

- Manage event settings (name, description, logo)
- Create and archive game types
- Create and manage teams
- Invite participants and create placeholder participants
- Record matches for anyone
- Open and close best score sessions
- Submit scores on behalf of any participant
- Create and manage tournaments
- Award discretionary bonus/penalty points
- Delete matches, scores, and awards
- Advance the event through its lifecycle (Draft → Active → Completed)
- Promote participants to organizer
- Archive or delete the event

The person who creates the event is automatically an organizer.

### Participant

Participants can:

- View all event data (standings, matches, scores, tournaments, awards)
- Record matches they are personally involved in
- Submit their own scores to open best score sessions
- Record tournament match results for matches they're in
- Undo tournament results for matches they're in
- Delete their own matches and score entries
- Leave the event

Participants **cannot** manage game types, teams, other participants, or event settings.

---

## Navigating an Event

When you open an event, you'll see a tab bar at the top with the following sections:

### Home

The event dashboard. Shows:

- Event name, description, status badge (Draft / Active / Completed), and your role
- **Standings bar chart** — teams ranked by total points
- **Points over time** — line chart showing how team scores evolved throughout the event. Click any data point to see details about that scoring entry.
- **Team share pie chart** — visual breakdown of each team's share of total points
- **Top contributors / category breakdown** — shows either individual top scorers (when that data is available) or a breakdown of points by category (H2H, FFA, Best Score, Tournament, Discretionary)
- **Scoring history log** — reverse-chronological list of every scoring event, with links to the relevant match, tournament, or award

If no points have been recorded yet, you'll see a prompt to start recording matches.

### Activity

Contains four sub-tabs:

- **Matches** — all H2H and FFA match results, with filtering by game type
- **Best Scores** — open and closed best score sessions
- **Tournaments** — all tournaments (draft, in progress, and completed)
- **Discretionary** — bonus and penalty point awards from organizers

### People

Contains two sub-tabs:

- **Participants** — everyone in the event, their role, and their team
- **Teams** — all teams with member lists

### Manage (Organizers only)

Contains two sub-tabs:

- **Game Types** — create, view, and archive game types
- **Settings** — edit event details, advance lifecycle, leave/archive/delete the event

---

## Game Types

Game types define what competitions you can run in your event. There are three categories:

### Head-to-Head (H2H)

Two sides face off. One wins, one loses (or a draw if allowed). Can be between individual participants or teams.

- **Win/Loss only** or **Score-based** (e.g., 21-18)
- Supports draws (configurable)
- Supports team vs team with configurable team sizes

**Examples:** Ping Pong, Pool, Foosball, Chess, Beer Pong

### Free-for-All (FFA)

Three or more competitors in a single match, ranked by finish position or score.

- **Ranked finish only** or **Score-based ranking**
- Score order: highest wins or lowest wins
- Configurable min/max number of participants

**Examples:** Mario Kart, Poker, Bowling, Board games

### Best Score

Participants submit individual scores to an eternal leaderboard. No head-to-head competition — players compete against the scoreboard.

- Score order: highest wins or lowest wins
- Supports decimal and negative scores
- Supports group entries (pairs or small teams submitting together)
- Individual or team submissions

**Examples:** Arcade games, fastest mile run, most push-ups in a minute

Game types can only be created by organizers. Once created, they can be archived (hidden from new activity) but not deleted.

---

## Matches

### Recording a Match

Navigate to **Activity > Matches** and click **Record Match**. You'll need:

1. **Game type** — select an H2H or FFA game type
2. **Participants** — choose the individuals or teams involved. Only participants assigned to teams can be selected.
3. **Scores / Results** — enter scores, select winner, or rank finish positions depending on the game type
4. **Points** (optional) — set how many points winning/losing/placing earns for teams
5. **Date** — defaults to now, but can be backdated

**Who can record:** Participants can record matches they're involved in. Organizers can record matches for anyone.

### Viewing Matches

The Matches tab shows all recorded matches in reverse-chronological order. Each match card shows the game type, participants, scores, and result. You can filter by game type if multiple exist.

### Deleting Matches

Participants can delete matches they're involved in. Organizers can delete any match. When a match is deleted, its associated point entries are removed from the leaderboard.

---

## Best Score Sessions

Best scores work through a session-based flow, managed by organizers.

### How It Works

1. **Organizer opens a session** for a Best Score game type, optionally configuring placement points (e.g., 1st place = 10 pts, 2nd = 7 pts, 3rd = 5 pts)
2. **Participants submit scores** — anyone can submit their own score to an open session. Organizers can submit on behalf of others. Scores appear on the session card as they're submitted.
3. **Organizer closes the session** — scores are ranked and placement points (if configured) are awarded to the submitters' teams

### Group Entries

Some Best Score game types support group entries (e.g., relay race teams of 2). When submitting a group entry, all members must be on the same team. Groups appear as "Name1 & Name2" on the leaderboard.

### Session Management (Organizers)

- **Edit** an open session's name and description
- **Close** a session to finalize scores and award points
- **Reopen** a closed session to accept more scores (reverts any awarded points)
- **Delete** a session entirely

### Leaderboards

Each Best Score game type has its own leaderboard accessible via the "View Leaderboard" button on any session card. The leaderboard shows all score submissions ranked by score value.

### Deleting Entries

Participants can delete their own score entries. Organizers can delete any entry.

---

## Tournaments

Events support bracket-style tournaments where individual participants compete representing their teams.

### Tournament Types

- **Single Elimination** — standard bracket where losers are eliminated. Handles byes automatically for non-power-of-2 participant counts.
- **Swiss** — non-elimination format where everyone plays a set number of rounds against opponents with similar records. Standings use Swiss points with Buchholz tiebreaking.

### Creating a Tournament (Organizers)

1. Navigate to **Activity > Tournaments** and click **Create Tournament**
2. Choose a Head-to-Head game type
3. Configure tournament settings:
   - Name
   - Tournament type (Single Elimination or Swiss)
   - Seeding method (Random or Manual)
   - Default best-of setting (Bo1, Bo3, Bo5, etc.) with optional per-round overrides
   - Optional placement point configuration (points for 1st, 2nd, 3rd, etc.)
4. Add participants
5. Start the tournament when ready

### Best-of Series

Each round can have its own best-of setting. For example, early rounds might be best-of-1 while the finals are best-of-5. In a series, individual games are recorded one at a time, and the winner is determined automatically when one side clinches (e.g., 2 wins in a Bo3).

### Recording Tournament Matches

Both participants and organizers can record tournament match results. Participants can only record results for matches they're in. In a best-of series, each game is recorded individually.

### Undoing Tournament Results

Results can be undone (reverted). For best-of series, undoing removes the most recent game. If the series-deciding game is undone, the bracket progression is reverted. Undo is blocked if a subsequent match further down the bracket has already been played.

For Swiss tournaments, undo is only available on the current (latest) round.

### Swiss Tournament Management (Organizers)

- **Edit Pairings** — before any matches are played in a round, swap participants between matchups (e.g., to avoid same-team matchups)
- **Delete Round** — remove the current round if no matches have been recorded, returning to the previous round
- **Generate Next Round** — manually trigger next round generation when needed

### Tournament Points

If placement points were configured, they're automatically awarded to teams when the tournament completes. Points are based on final placement (1st, 2nd, 3rd, etc.).

### Reverting to Draft

Organizers can revert an in-progress tournament back to draft status, allowing changes to participants and seeding. This is only available if no matches have been played yet.

---

## Discretionary Awards

Organizers can award ad-hoc bonus or penalty points to teams outside of normal match and tournament flows. This is useful for:

- Recognizing sportsmanship
- Penalizing rule violations
- Awarding participation bonuses
- Any other scenario the organizer sees fit

### Creating an Award (Organizers)

Navigate to **Activity > Discretionary** and click **Create Award**. You'll specify:

- **Name** — a short title for the award
- **Description** — explanation of why the points are being awarded
- **Points** — positive for bonuses, negative for penalties (decimals supported)
- **Recipients** — one or more teams to receive the points

### Managing Awards

Awards can be edited (change points, recipients, or description) or deleted by organizers. Deleting an award removes its point entries from the leaderboard. All participants can view discretionary awards.

---

## Teams

Teams are the core unit of competition in events. All points flow to teams.

### How Teams Work

- Organizers create teams with a name and optional logo/color
- Participants are assigned to exactly one team per event
- Only participants on a team can take part in matches, score submissions, and tournaments
- Team color badges appear throughout the UI to help identify teams at a glance

### Team Management (Organizers)

- Create new teams
- Edit team name, logo, and color
- Add or remove members (both real users and placeholder participants)
- Delete teams

### Viewing Teams

The **People > Teams** tab shows all teams with their member count. Click on a team to see its full member list.

---

## Participants

### Joining an Event

There are two ways to join:

1. **Direct invite** — an organizer searches for your username and sends you an invitation
2. **Invite link** — an organizer generates a shareable link that you can click to join

When you join via an invite link, you may be automatically assigned to a team if the organizer linked the invite to a placeholder participant who was already on a team.

### Placeholder Participants

Placeholder participants represent real people who haven't signed up yet. Organizers can create them with a display name and assign them to teams. When the real person joins, they can be linked to their placeholder and inherit their team assignment.

### Viewing Participants

The **People > Participants** tab shows everyone in the event, their role, and their team assignment.

---

## Event Settings (Organizers)

The **Manage > Settings** page lets organizers:

### Edit Event Details

- Change the event name and description

### Lifecycle Actions

- **Start Event** — move from Draft to Active (begins the competition)
- **Complete Event** — move from Active to Completed (freezes the leaderboard)
- **Reopen Event** — move from Completed back to Active (to record more activity)

### Danger Zone

- **Leave Event** — leave the event (blocked if you're the only organizer)
- **Archive Event** — hide the event from listings (data preserved, can be unarchived)
- **Delete Event** — permanently remove the event and all its data

---

## Tips for Organizers

1. **Set up game types during draft.** Plan your competition categories before starting the event.
2. **Create teams and invite everyone first.** Participants need to be on teams before they can play.
3. **Use placeholder participants** for people who haven't signed up yet — they can claim their spot later.
4. **Set point values thoughtfully.** Since points are set at recording time, you have full flexibility, but consistency helps participants understand the standings.
5. **Use discretionary awards** for things that don't fit neatly into matches — sportsmanship bonuses, creative challenges, or penalty deductions.
6. **Check the dashboard regularly.** The Home page charts give you a quick visual overview of how the competition is progressing.

## Tips for Participants

1. **Check your team assignment** under People > Teams after joining.
2. **Record your own matches** — you don't need to wait for an organizer.
3. **Submit scores promptly** when a best score session is open — you can only submit while it's open.
4. **Check the Home page** for live standings, scoring history, and team breakdowns.
5. **You can delete your own mistakes** — if you recorded a match incorrectly, you can delete it and re-record.
