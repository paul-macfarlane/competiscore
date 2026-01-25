import {
  GAME_TYPE_ICONS,
  GameCategory,
  ICON_PATHS,
  ParticipantType,
  ScoreOrder,
  ScoringType,
} from "@/lib/shared/constants";
import {
  GAME_TYPE_DESCRIPTION_MAX_LENGTH,
  GAME_TYPE_NAME_MAX_LENGTH,
  RULES_MAX_LENGTH,
} from "@/services/constants";
import { z } from "zod";

export const gameTypeNameSchema = z
  .string()
  .min(1, "Game type name is required")
  .max(
    GAME_TYPE_NAME_MAX_LENGTH,
    `Game type name must be at most ${GAME_TYPE_NAME_MAX_LENGTH} characters`,
  );

export const gameTypeDescriptionSchema = z
  .string()
  .max(
    GAME_TYPE_DESCRIPTION_MAX_LENGTH,
    `Description must be at most ${GAME_TYPE_DESCRIPTION_MAX_LENGTH} characters`,
  )
  .optional();

const VALID_ICON_PATHS = GAME_TYPE_ICONS.map(
  (icon) => `${ICON_PATHS.GAME_TYPE_ICONS}/${icon}.svg`,
);

export const gameTypeLogoSchema = z
  .string()
  .refine((val) => val === "" || VALID_ICON_PATHS.includes(val), {
    message: "Invalid icon selection",
  })
  .optional();

export const gameTypeCategorySchema = z.enum([
  GameCategory.HEAD_TO_HEAD,
  GameCategory.FREE_FOR_ALL,
  GameCategory.HIGH_SCORE,
]);

const rulesSchema = z
  .string()
  .max(RULES_MAX_LENGTH, `Rules must be at most ${RULES_MAX_LENGTH} characters`)
  .optional()
  .or(z.literal(""));

export const h2hConfigSchema = z.object({
  scoringType: z.enum([ScoringType.WIN_LOSS, ScoringType.SCORE_BASED]),
  scoreDescription: z.string().max(50).optional(),
  drawsAllowed: z.boolean(),
  minPlayersPerSide: z.number().int().min(1).max(10),
  maxPlayersPerSide: z.number().int().min(1).max(10),
  rules: rulesSchema,
});

export const ffaConfigSchema = z.object({
  scoringType: z.enum([ScoringType.RANKED_FINISH, ScoringType.SCORE_BASED]),
  scoreOrder: z.enum([ScoreOrder.HIGHEST_WINS, ScoreOrder.LOWEST_WINS]),
  minPlayers: z.number().int().min(2).max(50),
  maxPlayers: z.number().int().min(2).max(50),
  rules: rulesSchema,
});

export const highScoreConfigSchema = z.object({
  scoreOrder: z.enum([ScoreOrder.HIGHEST_WINS, ScoreOrder.LOWEST_WINS]),
  scoreDescription: z.string().min(1).max(50),
  participantType: z.enum([ParticipantType.INDIVIDUAL, ParticipantType.TEAM]),
  rules: rulesSchema,
});

export const createGameTypeFormSchema = z.discriminatedUnion("category", [
  z.object({
    name: gameTypeNameSchema,
    description: gameTypeDescriptionSchema,
    logo: gameTypeLogoSchema,
    category: z.literal(GameCategory.HEAD_TO_HEAD),
    config: h2hConfigSchema,
  }),
  z.object({
    name: gameTypeNameSchema,
    description: gameTypeDescriptionSchema,
    logo: gameTypeLogoSchema,
    category: z.literal(GameCategory.FREE_FOR_ALL),
    config: ffaConfigSchema,
  }),
  z.object({
    name: gameTypeNameSchema,
    description: gameTypeDescriptionSchema,
    logo: gameTypeLogoSchema,
    category: z.literal(GameCategory.HIGH_SCORE),
    config: highScoreConfigSchema,
  }),
]);

export type CreateGameTypeFormValues = z.infer<typeof createGameTypeFormSchema>;

export const updateGameTypeFormSchema = z.object({
  name: gameTypeNameSchema.optional(),
  description: gameTypeDescriptionSchema,
  logo: gameTypeLogoSchema,
});

export type UpdateGameTypeFormValues = z.infer<typeof updateGameTypeFormSchema>;
