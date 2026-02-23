export type FFARoundConfig = Record<
  string,
  { groupSize: number; advanceCount: number }
>;

export type GroupAssignment = {
  groupIndex: number;
  participantIndex: number;
};

/**
 * Validates that an FFA round config is consistent with participant count.
 * Returns an error message if invalid, or null if valid.
 */
export function validateFFARoundConfig(
  participantCount: number,
  roundConfig: FFARoundConfig,
  minGroupSize: number,
  maxGroupSize: number,
): string | null {
  const roundNumbers = Object.keys(roundConfig)
    .map(Number)
    .sort((a, b) => a - b);

  if (roundNumbers.length === 0) {
    return "At least one round is required";
  }

  for (let i = 0; i < roundNumbers.length; i++) {
    if (roundNumbers[i] !== i + 1) {
      return "Round numbers must be sequential starting from 1";
    }
  }

  let currentParticipants = participantCount;

  for (let i = 0; i < roundNumbers.length; i++) {
    const round = roundNumbers[i];
    const config = roundConfig[String(round)];
    const isFinalRound = i === roundNumbers.length - 1;

    if (config.groupSize < minGroupSize) {
      return `Round ${round}: group size must be at least ${minGroupSize}`;
    }
    if (config.groupSize > maxGroupSize) {
      return `Round ${round}: group size must be at most ${maxGroupSize}`;
    }

    if (currentParticipants < config.groupSize) {
      return `Round ${round}: not enough participants (${currentParticipants}) for group size ${config.groupSize}`;
    }

    const numGroups = Math.floor(currentParticipants / config.groupSize);
    const remainder = currentParticipants % config.groupSize;

    if (remainder !== 0) {
      return `Round ${round}: ${currentParticipants} participants cannot be evenly divided into groups of ${config.groupSize}`;
    }

    if (isFinalRound) {
      if (config.advanceCount !== 0) {
        return `Final round (Round ${round}) must have advance count of 0`;
      }
    } else {
      if (config.advanceCount < 1) {
        return `Round ${round}: advance count must be at least 1`;
      }
      if (config.advanceCount >= config.groupSize) {
        return `Round ${round}: advance count must be less than group size`;
      }
      currentParticipants = numGroups * config.advanceCount;
    }
  }

  return null;
}

/**
 * Distributes participant indices into groups using snake-draft ordering.
 * Seeds: [0, 1, 2, 3, 4, 5, 6, 7] into 2 groups of 4:
 * Group 0: [0, 3, 4, 7]
 * Group 1: [1, 2, 5, 6]
 */
export function distributeIntoGroups(
  participantIndices: number[],
  groupCount: number,
): number[][] {
  const groups: number[][] = Array.from({ length: groupCount }, () => []);

  for (let i = 0; i < participantIndices.length; i++) {
    const round = Math.floor(i / groupCount);
    const posInRound = i % groupCount;
    const groupIdx = round % 2 === 0 ? posInRound : groupCount - 1 - posInRound;
    groups[groupIdx].push(participantIndices[i]);
  }

  return groups;
}

/**
 * Generate group assignments for a round given participant count and group size.
 * Returns { groupCount, assignments }.
 */
export function generateRoundGroups(
  participantCount: number,
  groupSize: number,
): { groupCount: number; assignments: GroupAssignment[] } {
  const groupCount = Math.floor(participantCount / groupSize);
  const indices = Array.from({ length: participantCount }, (_, i) => i);
  const groups = distributeIntoGroups(indices, groupCount);

  const assignments: GroupAssignment[] = [];
  for (let g = 0; g < groups.length; g++) {
    for (const pIdx of groups[g]) {
      assignments.push({ groupIndex: g, participantIndex: pIdx });
    }
  }

  return { groupCount, assignments };
}
