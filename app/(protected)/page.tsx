import { auth } from "@/auth";
import SidebarSkeleton from "@/components/navbar/sidebar-skeleton";
import { SignOutButton } from "@/components/sign-out-button";
import { redirect } from "next/navigation";

export default async function Home() {
  const session = await auth();

  if (!session?.user) {
    redirect("/auth/sign-in");
  }

  console.log(session?.user);
  return (
    <div>
      <p>{session.user && "Signed in as " + session.user.email}</p>
      <SignOutButton />
    </div>
  );
}
