import { ICON_PATHS } from "@/lib/shared/constants";
import {
  BIO_MAX_LENGTH,
  NAME_MAX_LENGTH,
  USERNAME_MAX_LENGTH,
  USERNAME_MIN_LENGTH,
} from "@/services/constants";
import { z } from "zod";

export const AVATARS = [
  { name: "8-ball", src: `${ICON_PATHS.AVATARS}/8-ball.svg` },
  { name: "Paddle", src: `${ICON_PATHS.AVATARS}/paddle.svg` },
  { name: "Controller", src: `${ICON_PATHS.AVATARS}/controller.svg` },
  { name: "Dice", src: `${ICON_PATHS.AVATARS}/dice.svg` },
  { name: "Cards", src: `${ICON_PATHS.AVATARS}/cards.svg` },
  { name: "Chess Knight", src: `${ICON_PATHS.AVATARS}/chess-knight.svg` },
  { name: "Target", src: `${ICON_PATHS.AVATARS}/target.svg` },
  { name: "Trophy", src: `${ICON_PATHS.AVATARS}/trophy.svg` },
  { name: "Joystick", src: `${ICON_PATHS.AVATARS}/joystick.svg` },
  { name: "Ghost", src: `${ICON_PATHS.AVATARS}/ghost.svg` },
  { name: "Pacman", src: `${ICON_PATHS.AVATARS}/pacman.svg` },
  { name: "Sword", src: `${ICON_PATHS.AVATARS}/sword.svg` },
  { name: "Shield", src: `${ICON_PATHS.AVATARS}/shield.svg` },
  { name: "Potion", src: `${ICON_PATHS.AVATARS}/potion.svg` },
  { name: "Crown", src: `${ICON_PATHS.AVATARS}/crown.svg` },
  { name: "Flag", src: `${ICON_PATHS.AVATARS}/flag.svg` },
  { name: "Rocket", src: `${ICON_PATHS.AVATARS}/rocket.svg` },
  { name: "Skull", src: `${ICON_PATHS.AVATARS}/skull.svg` },
  { name: "Gem", src: `${ICON_PATHS.AVATARS}/gem.svg` },
  { name: "Robot", src: `${ICON_PATHS.AVATARS}/robot.svg` },
] as const;

export type Avatar = (typeof AVATARS)[number];

const VALID_AVATAR_PATHS = AVATARS.map((a) => a.src) as string[];

export const usernameSchema = z
  .string()
  .min(
    USERNAME_MIN_LENGTH,
    `Username must be at least ${USERNAME_MIN_LENGTH} characters`,
  )
  .max(
    USERNAME_MAX_LENGTH,
    `Username must be at most ${USERNAME_MAX_LENGTH} characters`,
  )
  .regex(
    /^[a-zA-Z0-9_-]+$/,
    "Username can only contain letters, numbers, underscores, and hyphens (e.g., john_doe, player-123)",
  );

export const nameSchema = z
  .string()
  .min(1, "Name is required")
  .max(NAME_MAX_LENGTH, `Name must be at most ${NAME_MAX_LENGTH} characters`);

export const bioSchema = z
  .string()
  .max(BIO_MAX_LENGTH, `Bio must be at most ${BIO_MAX_LENGTH} characters`);

export const imageSchema = z
  .string()
  .refine((val) => val === "" || VALID_AVATAR_PATHS.includes(val), {
    message: "Invalid avatar selection",
  })
  .optional();

export const profileFormSchema = z.object({
  name: nameSchema,
  username: usernameSchema,
  bio: bioSchema,
  image: imageSchema,
});

export type ProfileFormValues = z.infer<typeof profileFormSchema>;
