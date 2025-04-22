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
