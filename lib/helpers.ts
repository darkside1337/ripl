// TODO: type this

export const prettifyFlattenedErrors = (
  errorsObject: Record<string, string[]>
) => {
  // errors object is a zod error.flatten().fieldErrors
  return Object.entries(errorsObject)
    .map(([name, messages]) => {
      // If there are multiple messages, create multiple error objects
      return messages.map((message: string) => ({
        name,
        type: "custom",
        message,
      }));
    })
    .flat(); // Flatten the nested arrays
};

export function generateUniqueUsernameFromEmail(email: string) {
  const adjectives = [
    "brave",
    "clever",
    "cool",
    "curious",
    "fast",
    "fancy",
    "friendly",
    "gentle",
    "happy",
    "kind",
    "lucky",
    "mighty",
    "neat",
    "nifty",
    "quiet",
    "quick",
    "sharp",
    "shiny",
    "smart",
    "snappy",
    "sunny",
    "swift",
    "witty",
    "zesty",
  ];

  const nouns = [
    "arrow",
    "breeze",
    "cloud",
    "comet",
    "ember",
    "falcon",
    "flame",
    "fox",
    "glow",
    "hawk",
    "leaf",
    "light",
    "luna",
    "mist",
    "nova",
    "pebble",
    "ray",
    "river",
    "shade",
    "sky",
    "spark",
    "storm",
    "wave",
    "whisker",
    "zephyr",
  ];

  const [localPart] = email.split("@");
  const base = localPart.replace(/[^a-z0-9]/gi, "").toLowerCase();

  const adjective = adjectives[Math.floor(Math.random() * adjectives.length)];
  const noun = nouns[Math.floor(Math.random() * nouns.length)];
  const number = Math.floor(10 + Math.random() * 90); // 2-digit number

  return `${base}-${adjective}${noun}${number}`;
}
