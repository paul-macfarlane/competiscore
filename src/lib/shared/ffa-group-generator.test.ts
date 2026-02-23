import { describe, expect, it } from "vitest";

import {
  FFARoundConfig,
  distributeIntoGroups,
  generateRoundGroups,
  validateFFARoundConfig,
} from "./ffa-group-generator";

describe("validateFFARoundConfig", () => {
  const MIN = 2;
  const MAX = 20;

  it("returns null for a valid single-round config", () => {
    const config: FFARoundConfig = {
      "1": { groupSize: 4, advanceCount: 0 },
    };
    expect(validateFFARoundConfig(8, config, MIN, MAX)).toBeNull();
  });

  it("returns null for a valid multi-round config", () => {
    const config: FFARoundConfig = {
      "1": { groupSize: 4, advanceCount: 1 },
      "2": { groupSize: 4, advanceCount: 0 },
    };
    expect(validateFFARoundConfig(16, config, MIN, MAX)).toBeNull();
  });

  it("returns error for empty config", () => {
    expect(validateFFARoundConfig(8, {}, MIN, MAX)).toBe(
      "At least one round is required",
    );
  });

  it("returns error for non-sequential rounds", () => {
    const config: FFARoundConfig = {
      "1": { groupSize: 4, advanceCount: 1 },
      "3": { groupSize: 4, advanceCount: 0 },
    };
    expect(validateFFARoundConfig(16, config, MIN, MAX)).toBe(
      "Round numbers must be sequential starting from 1",
    );
  });

  it("returns error when group size is below minimum", () => {
    const config: FFARoundConfig = {
      "1": { groupSize: 1, advanceCount: 0 },
    };
    expect(validateFFARoundConfig(4, config, MIN, MAX)).toBe(
      "Round 1: group size must be at least 2",
    );
  });

  it("returns error when group size exceeds maximum", () => {
    const config: FFARoundConfig = {
      "1": { groupSize: 25, advanceCount: 0 },
    };
    expect(validateFFARoundConfig(50, config, MIN, MAX)).toBe(
      "Round 1: group size must be at most 20",
    );
  });

  it("returns error when participants cant be evenly divided", () => {
    const config: FFARoundConfig = {
      "1": { groupSize: 4, advanceCount: 0 },
    };
    expect(validateFFARoundConfig(7, config, MIN, MAX)).toBe(
      "Round 1: 7 participants cannot be evenly divided into groups of 4",
    );
  });

  it("returns error when final round has non-zero advance count", () => {
    const config: FFARoundConfig = {
      "1": { groupSize: 4, advanceCount: 2 },
    };
    expect(validateFFARoundConfig(8, config, MIN, MAX)).toBe(
      "Final round (Round 1) must have advance count of 0",
    );
  });

  it("returns error when advance count >= group size", () => {
    const config: FFARoundConfig = {
      "1": { groupSize: 4, advanceCount: 4 },
      "2": { groupSize: 4, advanceCount: 0 },
    };
    expect(validateFFARoundConfig(16, config, MIN, MAX)).toBe(
      "Round 1: advance count must be less than group size",
    );
  });

  it("returns error when not enough participants for next round", () => {
    const config: FFARoundConfig = {
      "1": { groupSize: 4, advanceCount: 1 },
      "2": { groupSize: 8, advanceCount: 0 },
    };
    expect(validateFFARoundConfig(16, config, MIN, MAX)).toBe(
      "Round 2: not enough participants (4) for group size 8",
    );
  });

  it("validates a 3-round config (16 → 8 → 4 → final)", () => {
    const config: FFARoundConfig = {
      "1": { groupSize: 4, advanceCount: 2 },
      "2": { groupSize: 4, advanceCount: 1 },
      "3": { groupSize: 2, advanceCount: 0 },
    };
    expect(validateFFARoundConfig(16, config, MIN, MAX)).toBeNull();
  });
});

describe("distributeIntoGroups", () => {
  it("distributes 8 indices into 2 groups using snake draft", () => {
    const result = distributeIntoGroups([0, 1, 2, 3, 4, 5, 6, 7], 2);
    expect(result).toHaveLength(2);
    expect(result[0]).toEqual([0, 3, 4, 7]);
    expect(result[1]).toEqual([1, 2, 5, 6]);
  });

  it("distributes 4 indices into 4 groups", () => {
    const result = distributeIntoGroups([0, 1, 2, 3], 4);
    expect(result).toHaveLength(4);
    expect(result[0]).toEqual([0]);
    expect(result[1]).toEqual([1]);
    expect(result[2]).toEqual([2]);
    expect(result[3]).toEqual([3]);
  });

  it("distributes 12 indices into 3 groups", () => {
    const result = distributeIntoGroups(
      [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11],
      3,
    );
    expect(result).toHaveLength(3);
    // Round 0: 0→G0, 1→G1, 2→G2
    // Round 1: 3→G2, 4→G1, 5→G0
    // Round 2: 6→G0, 7→G1, 8→G2
    // Round 3: 9→G2, 10→G1, 11→G0
    expect(result[0]).toEqual([0, 5, 6, 11]);
    expect(result[1]).toEqual([1, 4, 7, 10]);
    expect(result[2]).toEqual([2, 3, 8, 9]);
  });

  it("distributes single participant into single group", () => {
    const result = distributeIntoGroups([0], 1);
    expect(result).toEqual([[0]]);
  });
});

describe("generateRoundGroups", () => {
  it("generates correct groups for 8 participants in groups of 4", () => {
    const { groupCount, assignments } = generateRoundGroups(8, 4);
    expect(groupCount).toBe(2);
    expect(assignments).toHaveLength(8);

    const group0 = assignments
      .filter((a) => a.groupIndex === 0)
      .map((a) => a.participantIndex);
    const group1 = assignments
      .filter((a) => a.groupIndex === 1)
      .map((a) => a.participantIndex);

    expect(group0).toHaveLength(4);
    expect(group1).toHaveLength(4);
    // All participants should be assigned
    const allIndices = assignments.map((a) => a.participantIndex).sort();
    expect(allIndices).toEqual([0, 1, 2, 3, 4, 5, 6, 7]);
  });

  it("generates single group for exact group size", () => {
    const { groupCount, assignments } = generateRoundGroups(4, 4);
    expect(groupCount).toBe(1);
    expect(assignments).toHaveLength(4);
    expect(assignments.every((a) => a.groupIndex === 0)).toBe(true);
  });
});
