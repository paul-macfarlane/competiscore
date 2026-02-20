import * as dbEventInvitations from "@/db/event-invitations";
import * as dbEvents from "@/db/events";
import { EventParticipantRole } from "@/lib/shared/constants";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { MAX_EVENT_PLACEHOLDER_PARTICIPANTS } from "./constants";
import {
  createEventPlaceholder,
  linkEventPlaceholderToUser,
} from "./event-placeholder-participants";
import { TEST_IDS } from "./test-helpers";

vi.mock("@/db/events", () => ({
  countEventPlaceholders: vi.fn(),
  createEventPlaceholder: vi.fn(),
  getEventParticipant: vi.fn(),
  getEventPlaceholderById: vi.fn(),
  getEventPlaceholders: vi.fn(),
  getRetiredEventPlaceholders: vi.fn(),
  hasEventPlaceholderActivity: vi.fn(),
  restoreEventPlaceholder: vi.fn(),
  retireEventPlaceholder: vi.fn(),
  updateEventPlaceholder: vi.fn(),
  deleteEventPlaceholder: vi.fn(),
  linkEventPlaceholder: vi.fn(),
  getTeamForUser: vi.fn(),
  getTeamForPlaceholder: vi.fn(),
  reassignEventPlaceholderRecordsToTeam: vi.fn(),
  deleteEventTeamMembershipsForPlaceholder: vi.fn(),
  migrateEventMatchParticipantsToUser: vi.fn(),
  migrateEventMatchParticipantMembersToUser: vi.fn(),
  migrateEventHighScoreEntriesToUser: vi.fn(),
  migrateEventHighScoreEntryMembersToUser: vi.fn(),
  migrateEventTeamMembersToUser: vi.fn(),
  migrateEventTournamentParticipantsToUser: vi.fn(),
  migrateEventTournamentParticipantMembersToUser: vi.fn(),
  migrateEventPointEntryParticipantsToUser: vi.fn(),
}));

vi.mock("@/db/event-invitations", () => ({
  cancelPendingEventInvitationsForPlaceholder: vi.fn(),
}));

vi.mock("@/db/index", () => ({
  withTransaction: vi.fn((cb) => cb({})),
}));

const mockOrganizerMember = {
  id: TEST_IDS.EVENT_MEMBER_ID,
  eventId: TEST_IDS.EVENT_ID,
  userId: TEST_IDS.USER_ID,
  role: EventParticipantRole.ORGANIZER,
  joinedAt: new Date(),
};

const mockParticipantMember = {
  ...mockOrganizerMember,
  role: EventParticipantRole.PARTICIPANT,
};

const mockPlaceholder = {
  id: TEST_IDS.EVENT_PLACEHOLDER_ID,
  eventId: TEST_IDS.EVENT_ID,
  displayName: "Guest Player",
  linkedUserId: null,
  retiredAt: null,
  createdAt: new Date(),
  updatedAt: new Date(),
};

describe("createEventPlaceholder", () => {
  beforeEach(() => vi.clearAllMocks());

  it("returns error when not organizer", async () => {
    vi.mocked(dbEvents.getEventParticipant).mockResolvedValue(
      mockParticipantMember as never,
    );

    const result = await createEventPlaceholder(TEST_IDS.USER_ID, {
      eventId: TEST_IDS.EVENT_ID,
      displayName: "Guest",
    });

    expect(result.error).toBe(
      "You don't have permission to manage placeholders",
    );
  });

  it("returns error when at placeholder limit", async () => {
    vi.mocked(dbEvents.getEventParticipant).mockResolvedValue(
      mockOrganizerMember as never,
    );
    vi.mocked(dbEvents.countEventPlaceholders).mockResolvedValue(
      MAX_EVENT_PLACEHOLDER_PARTICIPANTS,
    );

    const result = await createEventPlaceholder(TEST_IDS.USER_ID, {
      eventId: TEST_IDS.EVENT_ID,
      displayName: "Guest",
    });

    expect(result.error).toBe(
      "Event can have at most " +
        MAX_EVENT_PLACEHOLDER_PARTICIPANTS +
        " placeholder participants",
    );
  });

  it("returns success when creating a placeholder", async () => {
    vi.mocked(dbEvents.getEventParticipant).mockResolvedValue(
      mockOrganizerMember as never,
    );
    vi.mocked(dbEvents.countEventPlaceholders).mockResolvedValue(0);
    vi.mocked(dbEvents.createEventPlaceholder).mockResolvedValue(
      mockPlaceholder as never,
    );

    const result = await createEventPlaceholder(TEST_IDS.USER_ID, {
      eventId: TEST_IDS.EVENT_ID,
      displayName: "Guest Player",
    });

    expect(result.data?.displayName).toBe("Guest Player");
  });
});

describe("linkEventPlaceholderToUser", () => {
  beforeEach(() => vi.clearAllMocks());

  const validInput = {
    placeholderId: TEST_IDS.EVENT_PLACEHOLDER_ID,
    eventId: TEST_IDS.EVENT_ID,
    targetUserId: TEST_IDS.USER_ID_2,
  };

  const mockTargetParticipation = {
    id: "target-member-id",
    eventId: TEST_IDS.EVENT_ID,
    userId: TEST_IDS.USER_ID_2,
    role: EventParticipantRole.PARTICIPANT,
    joinedAt: new Date(),
  };

  const mockTeamA = {
    id: TEST_IDS.EVENT_TEAM_ID,
    eventId: TEST_IDS.EVENT_ID,
    name: "Team A",
    logo: null,
    color: null,
    createdAt: new Date(),
  };

  const mockTeamB = {
    id: TEST_IDS.EVENT_TEAM_ID_2,
    eventId: TEST_IDS.EVENT_ID,
    name: "Team B",
    logo: null,
    color: null,
    createdAt: new Date(),
  };

  function setupSuccessMocks() {
    vi.mocked(dbEvents.getEventParticipant)
      .mockResolvedValueOnce(mockOrganizerMember as never)
      .mockResolvedValueOnce(mockTargetParticipation as never);
    vi.mocked(dbEvents.getEventPlaceholderById).mockResolvedValue(
      mockPlaceholder as never,
    );
    vi.mocked(dbEvents.getEventPlaceholders).mockResolvedValue([
      mockPlaceholder,
    ] as never);
    vi.mocked(dbEvents.migrateEventMatchParticipantsToUser).mockResolvedValue(
      undefined,
    );
    vi.mocked(dbEvents.migrateEventHighScoreEntriesToUser).mockResolvedValue(
      undefined,
    );
    vi.mocked(
      dbEvents.migrateEventHighScoreEntryMembersToUser,
    ).mockResolvedValue(undefined);
    vi.mocked(dbEvents.migrateEventTeamMembersToUser).mockResolvedValue(
      undefined,
    );
    vi.mocked(
      dbEvents.migrateEventTournamentParticipantsToUser,
    ).mockResolvedValue(undefined);
    vi.mocked(
      dbEvents.migrateEventTournamentParticipantMembersToUser,
    ).mockResolvedValue(undefined);
    vi.mocked(
      dbEvents.migrateEventPointEntryParticipantsToUser,
    ).mockResolvedValue(undefined);
    vi.mocked(dbEvents.linkEventPlaceholder).mockResolvedValue(
      mockPlaceholder as never,
    );
    vi.mocked(
      dbEventInvitations.cancelPendingEventInvitationsForPlaceholder,
    ).mockResolvedValue(0);
    vi.mocked(dbEvents.retireEventPlaceholder).mockResolvedValue(
      mockPlaceholder as never,
    );
    vi.mocked(dbEvents.reassignEventPlaceholderRecordsToTeam).mockResolvedValue(
      undefined,
    );
    vi.mocked(
      dbEvents.deleteEventTeamMembershipsForPlaceholder,
    ).mockResolvedValue(undefined);
  }

  it("returns validation error for invalid input", async () => {
    const result = await linkEventPlaceholderToUser(TEST_IDS.USER_ID, {
      placeholderId: "not-a-uuid",
    });
    expect(result.error).toBe("Validation failed");
    expect(result.fieldErrors).toBeDefined();
  });

  it("returns error when calling user not in event", async () => {
    vi.mocked(dbEvents.getEventParticipant).mockResolvedValue(undefined);

    const result = await linkEventPlaceholderToUser(
      TEST_IDS.USER_ID,
      validInput,
    );
    expect(result.error).toBe("You are not a participant in this event");
  });

  it("returns error when calling user lacks permission", async () => {
    vi.mocked(dbEvents.getEventParticipant).mockResolvedValue(
      mockParticipantMember as never,
    );

    const result = await linkEventPlaceholderToUser(
      TEST_IDS.USER_ID,
      validInput,
    );
    expect(result.error).toBe(
      "You don't have permission to link placeholder participants",
    );
  });

  it("returns error when placeholder not found", async () => {
    vi.mocked(dbEvents.getEventParticipant).mockResolvedValue(
      mockOrganizerMember as never,
    );
    vi.mocked(dbEvents.getEventPlaceholderById).mockResolvedValue(undefined);

    const result = await linkEventPlaceholderToUser(
      TEST_IDS.USER_ID,
      validInput,
    );
    expect(result.error).toBe("Placeholder participant not found");
  });

  it("returns error when placeholder belongs to wrong event", async () => {
    vi.mocked(dbEvents.getEventParticipant).mockResolvedValue(
      mockOrganizerMember as never,
    );
    vi.mocked(dbEvents.getEventPlaceholderById).mockResolvedValue({
      ...mockPlaceholder,
      eventId: TEST_IDS.EVENT_ID_2,
    } as never);

    const result = await linkEventPlaceholderToUser(
      TEST_IDS.USER_ID,
      validInput,
    );
    expect(result.error).toBe("Placeholder does not belong to this event");
  });

  it("returns error when placeholder already linked", async () => {
    vi.mocked(dbEvents.getEventParticipant).mockResolvedValue(
      mockOrganizerMember as never,
    );
    vi.mocked(dbEvents.getEventPlaceholderById).mockResolvedValue({
      ...mockPlaceholder,
      linkedUserId: TEST_IDS.USER_ID_3,
    } as never);

    const result = await linkEventPlaceholderToUser(
      TEST_IDS.USER_ID,
      validInput,
    );
    expect(result.error).toBe("Placeholder is already linked to a user");
  });

  it("returns error when placeholder is retired", async () => {
    vi.mocked(dbEvents.getEventParticipant).mockResolvedValue(
      mockOrganizerMember as never,
    );
    vi.mocked(dbEvents.getEventPlaceholderById).mockResolvedValue({
      ...mockPlaceholder,
      retiredAt: new Date(),
    } as never);

    const result = await linkEventPlaceholderToUser(
      TEST_IDS.USER_ID,
      validInput,
    );
    expect(result.error).toBe("Cannot link a retired placeholder");
  });

  it("returns error when target user not a participant", async () => {
    vi.mocked(dbEvents.getEventParticipant)
      .mockResolvedValueOnce(mockOrganizerMember as never)
      .mockResolvedValueOnce(undefined);
    vi.mocked(dbEvents.getEventPlaceholderById).mockResolvedValue(
      mockPlaceholder as never,
    );

    const result = await linkEventPlaceholderToUser(
      TEST_IDS.USER_ID,
      validInput,
    );
    expect(result.error).toBe("Target user is not a participant in this event");
  });

  it("returns error when target user already linked to another placeholder", async () => {
    vi.mocked(dbEvents.getEventParticipant)
      .mockResolvedValueOnce(mockOrganizerMember as never)
      .mockResolvedValueOnce(mockTargetParticipation as never);
    vi.mocked(dbEvents.getEventPlaceholderById).mockResolvedValue(
      mockPlaceholder as never,
    );
    vi.mocked(dbEvents.getEventPlaceholders).mockResolvedValue([
      {
        ...mockPlaceholder,
        id: "other-placeholder",
        linkedUserId: TEST_IDS.USER_ID_2,
        retiredAt: new Date(),
      },
    ] as never);

    const result = await linkEventPlaceholderToUser(
      TEST_IDS.USER_ID,
      validInput,
    );
    expect(result.error).toBe(
      "Target user is already linked to another placeholder",
    );
  });

  it("returns success when neither has a team", async () => {
    setupSuccessMocks();
    vi.mocked(dbEvents.getTeamForUser).mockResolvedValue(undefined);
    vi.mocked(dbEvents.getTeamForPlaceholder).mockResolvedValue(undefined);

    const result = await linkEventPlaceholderToUser(
      TEST_IDS.USER_ID,
      validInput,
    );
    expect(result.data).toEqual({
      linked: true,
      eventId: TEST_IDS.EVENT_ID,
    });
  });

  it("returns success and inherits team when placeholder has team but user does not", async () => {
    setupSuccessMocks();
    vi.mocked(dbEvents.getTeamForUser).mockResolvedValue(undefined);
    vi.mocked(dbEvents.getTeamForPlaceholder).mockResolvedValue(
      mockTeamA as never,
    );

    const result = await linkEventPlaceholderToUser(
      TEST_IDS.USER_ID,
      validInput,
    );
    expect(result.data).toEqual({
      linked: true,
      eventId: TEST_IDS.EVENT_ID,
    });
  });

  it("returns success and reassigns records when user has team but placeholder does not", async () => {
    setupSuccessMocks();
    vi.mocked(dbEvents.getTeamForUser).mockResolvedValue(mockTeamB as never);
    vi.mocked(dbEvents.getTeamForPlaceholder).mockResolvedValue(undefined);

    const result = await linkEventPlaceholderToUser(
      TEST_IDS.USER_ID,
      validInput,
    );
    expect(result.data).toEqual({
      linked: true,
      eventId: TEST_IDS.EVENT_ID,
    });
  });

  it("returns success and reassigns records when user on different team than placeholder", async () => {
    setupSuccessMocks();
    vi.mocked(dbEvents.getTeamForUser).mockResolvedValue(mockTeamB as never);
    vi.mocked(dbEvents.getTeamForPlaceholder).mockResolvedValue(
      mockTeamA as never,
    );

    const result = await linkEventPlaceholderToUser(
      TEST_IDS.USER_ID,
      validInput,
    );
    expect(result.data).toEqual({
      linked: true,
      eventId: TEST_IDS.EVENT_ID,
    });
  });
});
