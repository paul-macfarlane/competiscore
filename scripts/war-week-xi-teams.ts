import "dotenv/config";
import { eq } from "drizzle-orm";
import { drizzle } from "drizzle-orm/node-postgres";

import * as schema from "../src/db/schema";

// Quick script for setting up war week XI Teams
// NOTE - this is not upserting, this is creating new placeholder members each team
// RUN: npx tsx scripts/war-week-xi-teams.ts

const { event, eventTeam, eventPlaceholderParticipant, eventTeamMember } =
  schema;

const db = drizzle(process.env.DATABASE_URL!, { schema });

const RED_PILL_MEMBERS = [
  // Ship Captains
  "Ashley Schuliger",
  "MAP",
  "Sam Schantz",
  "Ryan Shendler",
  // Crew Members
  "Adam Wilson-Hwang",
  "Albert Hernandez",
  "Alex Kelly",
  "Alex Nikolis",
  "Andrew Bushey",
  "Anthony Conway",
  "Austin Gage",
  "Awad Khawaja",
  "Ben Sadick",
  "Brian France",
  "Bryan Sambrook",
  "Chara Meidani",
  "Charles Clarke",
  "Chelsea Merrill",
  "Colin Walsh",
  "Dan Byrnes",
  "Dave Stevens",
  "Dillon Power",
  "Emily Smith",
  "Frank Nardone",
  "Fred the New Guy",
  "Jakub Synowiec",
  "James Murphy",
  "James Novak",
  "Jessie Zweigenthal",
  "Joe the Alien",
  "Joshua Burt",
  "Joshua Jameson",
  "Laura Jahnel",
  "Linda Martin",
  "Luke Prescott",
  "Matt Bessler",
  "Millie Elliott",
  "Paige Snyder",
  "Paul Carnivale",
  "Paul Macfarlane",
  "Rebecca Congi",
  "Sam Colebourn",
  "Scott Shipley",
  "Sean Warner",
  "Steven Vickers",
  "Steven Zgaljic",
  "Sydney Murauskas",
  "Thomas O'Neill",
  "Tommy Kneeland",
  "Tony Mercadante",
  "Zach Hartman",
];

const BLUE_PILL_MEMBERS = [
  // Ship Captains
  "Graham Macbeth",
  "Brandon Badgett",
  "Alec Haring",
  "Victoria Campbell",
  // Crew Members
  "Abby Rivera",
  "Aleksandr Molchagin",
  "Alvaro Gil",
  "Anthony Crisafulli",
  "Bich Dudla",
  "Bob Strubel",
  "Brandon Thivierge",
  "Bucky the Horse",
  "Cameron Lynch",
  "Casey Snow",
  "Chris Pence",
  "Christopher Nyberg",
  "Dan Bedian",
  "Dani Milliken",
  "Darrin Jahnel",
  "Debbie Schermerhorn",
  "Dom Favata",
  "Eva Trimboli",
  "Gabe Colon",
  "Glenn Easton",
  "Greg Westover",
  "Harsha Bindana",
  "Ian Ballard",
  "Jacob Hand",
  "James Heffernan",
  "Janelle Olsen",
  "Jesse Lucier",
  "John Healey",
  "John Higgins",
  "Jon Keller",
  "Jory Hutchins",
  "Joshua Cantor-Stone",
  "Justin Gillespie",
  "Kari Skinner",
  "Marc Matsen",
  "Matt Anderson",
  "Michael Shirk",
  "Michael Young",
  "Mike Hamilton",
  "Morgan Canion",
  "Nick Brown",
  "Nick Sprague",
  "Peter Hodges",
  "Ryan Greenman",
  "Sean Mullen",
  "Steve Nguyen",
];

async function main() {
  console.log("Looking up War Week XI event...");

  const [foundEvent] = await db
    .select({ id: event.id })
    .from(event)
    .where(eq(event.name, "War Week XI"));

  if (!foundEvent) {
    throw new Error('Event "War Week XI" not found');
  }

  const eventId = foundEvent.id;
  console.log(`Found event: ${eventId}`);

  const teams = await db
    .select({ id: eventTeam.id, name: eventTeam.name })
    .from(eventTeam)
    .where(eq(eventTeam.eventId, eventId));

  const redTeam = teams.find((t) => t.name === "Red Pill");
  const blueTeam = teams.find((t) => t.name === "Blue Pill");

  if (!redTeam) throw new Error('Team "Red Pill" not found for War Week XI');
  if (!blueTeam) throw new Error('Team "Blue Pill" not found for War Week XI');

  console.log(`Found Red Pill team: ${redTeam.id}`);
  console.log(`Found Blue Pill team: ${blueTeam.id}`);

  await db.transaction(async (tx) => {
    async function addMembersToTeam(teamId: string, members: string[]) {
      for (const name of members) {
        const [placeholder] = await tx
          .insert(eventPlaceholderParticipant)
          .values({ eventId, displayName: name })
          .returning({ id: eventPlaceholderParticipant.id });

        await tx.insert(eventTeamMember).values({
          eventTeamId: teamId,
          eventPlaceholderParticipantId: placeholder.id,
        });
      }
    }

    console.log(`\nAdding ${RED_PILL_MEMBERS.length} members to Red Pill...`);
    await addMembersToTeam(redTeam.id, RED_PILL_MEMBERS);

    console.log(`Adding ${BLUE_PILL_MEMBERS.length} members to Blue Pill...`);
    await addMembersToTeam(blueTeam.id, BLUE_PILL_MEMBERS);
  });

  console.log("\nDone!");
  console.log(`  Red Pill:  ${RED_PILL_MEMBERS.length} members`);
  console.log(`  Blue Pill: ${BLUE_PILL_MEMBERS.length} members`);
  console.log(
    `  Total:     ${RED_PILL_MEMBERS.length + BLUE_PILL_MEMBERS.length} members`,
  );

  process.exit(0);
}

main().catch((err) => {
  console.error("Failed:", err.message);
  process.exit(1);
});
