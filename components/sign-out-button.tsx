import { signOut } from "@/auth";
import { Button } from "./ui/button";

export function SignOutButton() {
  return (
    <form
      action={async () => {
        "use server";
        await signOut({
          redirect: true,
          redirectTo: "/auth/sign-in",
        });
      }}
    >
      <Button type="submit">Sign Out</Button>
    </form>
  );
}
