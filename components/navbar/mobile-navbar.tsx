"use client";
import { cn } from "@/lib/utils";
import { useWindowScroll } from "@uidotdev/usehooks";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  FiBell,
  FiHome,
  FiMail,
  FiSearch,
  FiSettings,
  FiUser,
} from "react-icons/fi";
import { Button } from "@/components/ui/button";
import LogoSVG from "../SVGs/LogoSVG";
import AvatarWrapper from "../avatar-wrapper";
import { Divide } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { useSession } from "next-auth/react";
import { useState } from "react";
interface NavItem {
  id: string;
  href: string;
  label: string;
  icon: React.ReactNode;
  exact: boolean;
}

export const MOBILE_NAV_ITEMS: NavItem[] = [
  {
    id: "home",
    href: "/",
    label: "Home",
    icon: <FiHome className="size-6" />,
    exact: true,
  },
  {
    id: "search",
    href: "/search",
    label: "Search",
    icon: <FiSearch className="size-6" />,
    exact: false,
  },
  {
    id: "notifications",
    href: "/notifications",
    label: "Notifications",
    icon: <FiBell className="size-6" />,
    exact: false,
  },
  {
    id: "messages",
    href: "/messages",
    label: "Messages",
    icon: <FiMail className="size-6" />,
    exact: false,
  },
  {
    id: "profile",
    href: "/profile",
    label: "Profile",
    icon: <FiUser className="size-6" />,
    exact: true,
  },
  {
    id: "settings",
    href: "/profile/settings",
    label: "Settings",
    icon: <FiSettings className="size-6" />,
    exact: true,
  },
];
export default function MobileNavbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <MobileTopBar setIsOpen={setIsOpen} />
      <MobileSidebar isOpen={isOpen} />
      <MobileBottomBar />
    </>
  );
}
function MobileTopBar({ isOpen, setIsOpen }) {
  const { data: session } = useSession();

  return (
    <nav className="flex md:hidden h-[54px]">
      {/* Avatar */}
      <Avatar
        className="size-12 cursor-pointer"
        onClick={() => setIsOpen(!isOpen)}
      >
        <AvatarImage src={session?.user.image as string} />
        <AvatarFallback>{session?.user?.fullName}</AvatarFallback>
      </Avatar>
      {/* Logo */}
      <Link href="/" className="lg:ml-3">
        <LogoSVG width={54} height={54} className="rounded-3xl size-14" />
      </Link>

      {/* Premium Button */}
      <Button variant="outline">Premium</Button>
    </nav>
  );
}
function MobileBottomBar() {
  const [{ x, y }, scrollTo] = useWindowScroll();
  const isScrolling = y || 0 > 0;

  const pathname = usePathname();

  return (
    <nav
      className={cn(
        "flex items-center justify-evenly md:hidden h-[54px] fixed w-full bottom-0 opacity-100 transition-opacity duration-200 ease-in-out z-30",
        "backdrop-blur-sm",
        "border-t border-gray-200 dark:border-gray-700",
        "transition-all duration-300 ease-out",
        isScrolling
          ? "opacity-20 translate-y-[2px]"
          : "opacity-100 translate-y-0"
      )}
    >
      {MOBILE_NAV_ITEMS.map(({ id, href, label, icon, exact }) => {
        const isActive = exact ? pathname === href : pathname.includes(href);
        return (
          <Link
            key={id}
            href={href}
            className={cn(
              "opacity-20 transition-opacity ease-in-out duration-300 px-4 py-2",
              isActive && "opacity-100"
            )}
          >
            {icon}
          </Link>
        );
      })}
    </nav>
  );
}
/*  */
function MobileSidebar({ isOpen }: { isOpen: boolean }) {
  return (
    <div
      className={cn(
        "absolute top-0 left-0 bg-red-500 h-dvh w-[288px] z-50",
        "scale-x-0 origin-left transition-all duration-300 ease-in-out",
        isOpen && "scale-x-100"
      )}
    ></div>
  );
}
