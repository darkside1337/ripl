// mobile is a bottom bar and a top bar
// tablet is a sidebar with icons only
// desktop is a sidebar left with icons and text
import MobileNavbar from "./mobile-navbar";
import Sidebar from "./sidebar";

export default async function Navbar({ user }) {
  const user = {
    userName: "user",
    fullName: "user",
    image: "user",
    role: "user",
  };

  return (
    <>
      {/*  responsive sidebar for tablet and desktop */}
      <Sidebar user={user} />
      {/* Mobile topbar && BottomBar components */}
      <MobileNavbar />
    </>
  );
}
