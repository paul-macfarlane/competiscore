import { describe, expect, it } from "vitest";

import { computePointsByParticipant } from "./points";

// Helper to create a point entry with participant links
function makePointEntry(
  id: string,
  points: number,
  teamId: string | null,
  entryParticipants: {
    userId: string | null;
    eventPlaceholderParticipantId: string | null;
  }[],
) {
  return {
    id,
    eventId: "event-1",
    category: "ffa_match" as const,
    outcome: "placement" as const,
    eventTeamId: teamId,
    eventMatchId: "match-1",
    eventHighScoreSessionId: null,
    eventTournamentId: null,
    eventDiscretionaryAwardId: null,
    points,
    createdAt: new Date(),
    entryParticipants: entryParticipants.map((ep) => ({
      eventPointEntryId: id,
      ...ep,
    })),
  };
}

describe("computePointsByParticipant", () => {
  it("returns empty map when no point entries", () => {
    const result = computePointsByParticipant(
      [],
      [
        {
          id: "p1",
          userId: "user-1",
          eventPlaceholderParticipantId: null,
          eventTeamId: "team-1",
        },
      ],
    );
    expect(result.size).toBe(0);
  });

  it("matches individual FFA participants by userId", () => {
    const pointEntries = [
      makePointEntry("pe1", 2, "team-blue", [
        { userId: "user-a", eventPlaceholderParticipantId: null },
      ]),
      makePointEntry("pe2", 1, "team-blue", [
        { userId: "user-b", eventPlaceholderParticipantId: null },
      ]),
      makePointEntry("pe3", 0, "team-red", [
        { userId: "user-c", eventPlaceholderParticipantId: null },
      ]),
    ];

    const participants = [
      {
        id: "p1",
        userId: "user-a",
        eventPlaceholderParticipantId: null,
        eventTeamId: "team-blue",
      },
      {
        id: "p2",
        userId: "user-b",
        eventPlaceholderParticipantId: null,
        eventTeamId: "team-blue",
      },
      {
        id: "p3",
        userId: "user-c",
        eventPlaceholderParticipantId: null,
        eventTeamId: "team-red",
      },
    ];

    const result = computePointsByParticipant(pointEntries, participants);

    expect(result.get("p1")).toBe(2);
    expect(result.get("p2")).toBe(1);
    expect(result.get("p3")).toBe(0);
  });

  it("does not aggregate same-team individual participants together", () => {
    const pointEntries = [
      makePointEntry("pe1", 2, "team-blue", [
        { userId: "user-a", eventPlaceholderParticipantId: null },
      ]),
      makePointEntry("pe2", 1, "team-blue", [
        { userId: "user-b", eventPlaceholderParticipantId: null },
      ]),
    ];

    const participants = [
      {
        id: "p1",
        userId: "user-a",
        eventPlaceholderParticipantId: null,
        eventTeamId: "team-blue",
      },
      {
        id: "p2",
        userId: "user-b",
        eventPlaceholderParticipantId: null,
        eventTeamId: "team-blue",
      },
    ];

    const result = computePointsByParticipant(pointEntries, participants);

    // Each participant should get their own points, NOT the team total (3)
    expect(result.get("p1")).toBe(2);
    expect(result.get("p2")).toBe(1);
  });

  it("matches individual FFA participants by placeholderParticipantId", () => {
    const pointEntries = [
      makePointEntry("pe1", 3, "team-red", [
        { userId: null, eventPlaceholderParticipantId: "placeholder-x" },
      ]),
    ];

    const participants = [
      {
        id: "p1",
        userId: null,
        eventPlaceholderParticipantId: "placeholder-x",
        eventTeamId: "team-red",
      },
    ];

    const result = computePointsByParticipant(pointEntries, participants);
    expect(result.get("p1")).toBe(3);
  });

  it("matches grouped FFA participants by member userId", () => {
    const pointEntries = [
      makePointEntry("pe1", 1, "team-blue", [
        { userId: "user-a", eventPlaceholderParticipantId: null },
        { userId: "user-b", eventPlaceholderParticipantId: null },
      ]),
      makePointEntry("pe2", 0, "team-blue", [
        { userId: "user-c", eventPlaceholderParticipantId: null },
        { userId: "user-d", eventPlaceholderParticipantId: null },
      ]),
    ];

    const participants = [
      {
        id: "group1",
        userId: null,
        eventPlaceholderParticipantId: null,
        eventTeamId: "team-blue",
        members: [
          { user: { id: "user-a" }, placeholderParticipant: null },
          { user: { id: "user-b" }, placeholderParticipant: null },
        ],
      },
      {
        id: "group2",
        userId: null,
        eventPlaceholderParticipantId: null,
        eventTeamId: "team-blue",
        members: [
          { user: { id: "user-c" }, placeholderParticipant: null },
          { user: { id: "user-d" }, placeholderParticipant: null },
        ],
      },
    ];

    const result = computePointsByParticipant(pointEntries, participants);

    expect(result.get("group1")).toBe(1);
    expect(result.get("group2")).toBe(0);
  });

  it("matches grouped FFA participants by member placeholderParticipantId", () => {
    const pointEntries = [
      makePointEntry("pe1", 5, "team-red", [
        { userId: null, eventPlaceholderParticipantId: "ph-1" },
        { userId: null, eventPlaceholderParticipantId: "ph-2" },
      ]),
    ];

    const participants = [
      {
        id: "group1",
        userId: null,
        eventPlaceholderParticipantId: null,
        eventTeamId: "team-red",
        members: [
          { user: null, placeholderParticipant: { id: "ph-1" } },
          { user: null, placeholderParticipant: { id: "ph-2" } },
        ],
      },
    ];

    const result = computePointsByParticipant(pointEntries, participants);
    expect(result.get("group1")).toBe(5);
  });

  it("falls back to team aggregation when no entry participants exist", () => {
    const pointEntries = [
      makePointEntry("pe1", 3, "team-alpha", []),
      makePointEntry("pe2", 1, "team-beta", []),
    ];

    const participants = [
      {
        id: "p1",
        userId: null,
        eventPlaceholderParticipantId: null,
        eventTeamId: "team-alpha",
      },
      {
        id: "p2",
        userId: null,
        eventPlaceholderParticipantId: null,
        eventTeamId: "team-beta",
      },
    ];

    const result = computePointsByParticipant(pointEntries, participants);

    expect(result.get("p1")).toBe(3);
    expect(result.get("p2")).toBe(1);
  });

  it("does not assign points for unmatched participants", () => {
    const pointEntries = [
      makePointEntry("pe1", 2, "team-blue", [
        { userId: "user-a", eventPlaceholderParticipantId: null },
      ]),
    ];

    const participants = [
      {
        id: "p1",
        userId: "user-a",
        eventPlaceholderParticipantId: null,
        eventTeamId: "team-blue",
      },
      {
        id: "p2",
        userId: "user-z",
        eventPlaceholderParticipantId: null,
        eventTeamId: "team-red",
      },
    ];

    const result = computePointsByParticipant(pointEntries, participants);

    expect(result.get("p1")).toBe(2);
    expect(result.has("p2")).toBe(false);
  });

  it("handles mixed individual and grouped participants in same match", () => {
    const pointEntries = [
      makePointEntry("pe1", 2, "team-blue", [
        { userId: "user-a", eventPlaceholderParticipantId: null },
      ]),
      makePointEntry("pe2", 1, "team-red", [
        { userId: "user-b", eventPlaceholderParticipantId: null },
        { userId: "user-c", eventPlaceholderParticipantId: null },
      ]),
    ];

    const participants = [
      {
        id: "p1",
        userId: "user-a",
        eventPlaceholderParticipantId: null,
        eventTeamId: "team-blue",
      },
      {
        id: "group1",
        userId: null,
        eventPlaceholderParticipantId: null,
        eventTeamId: "team-red",
        members: [
          { user: { id: "user-b" }, placeholderParticipant: null },
          { user: { id: "user-c" }, placeholderParticipant: null },
        ],
      },
    ];

    const result = computePointsByParticipant(pointEntries, participants);

    expect(result.get("p1")).toBe(2);
    expect(result.get("group1")).toBe(1);
  });
});
