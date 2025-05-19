"use client";
import { cn } from "@/lib/utils";
import Link from "next/link";
import {
  FiBell,
  FiHome,
  FiMail,
  FiSearch,
  FiSettings,
  FiUser,
} from "react-icons/fi";
import { buttonVariants } from "../ui/button";
import { usePathname } from "next/navigation";
import { twMerge } from "tailwind-merge";
import LogoSVG from "../SVGs/LogoSVG";
import TweetButton from "../PostTweetButton";
import AvatarWrapper from "../avatar-wrapper";
import { User } from "next-auth";
import SidebarSkeleton from "./sidebar-skeleton";

interface NavItem {
  id: string;
  href: string;
  label: string;
  icon: React.ReactNode;
  exact: boolean;
}

export const NAV_ITEMS: NavItem[] = [
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
const avatarMockUrl =
  "https://sm.ign.com/ign_pk/cover/a/avatar-gen/avatar-generations_rpge.jpg";
// responsive sidebar for tablet and desktop

export default function Sidebar({
  user,
  className,
}: {
  user: User;
  className?: string;
}) {
  const pathname = usePathname();

  if (!user) {
    return <SidebarSkeleton />;
  }

  const { fullName, userName, image } = user;
  console.log(user);

  return (
    <aside
      className={twMerge(
        "hidden md:flex flex-col fixed h-dvh border-r px-4 py-6 items-start gap-8 shadow-lg",
        "lg:w-[var(--sidebar-width-desktop)]",
        "md:w-[var(--sidebar-width-tablet)]",
        className
      )}
    >
      {/* Logo */}
      <Link href="/" className="lg:ml-3">
        <LogoSVG width={74} height={74} className="rounded-3xl md:size-15" />
      </Link>
      {/* // nav items */}
      <div className="w-full flex flex-col gap-6">
        {NAV_ITEMS.map(({ id, href, label, icon, exact }) => (
          <SidebarItem
            key={id}
            text={label}
            icon={icon}
            isActive={exact ? pathname === href : pathname.startsWith(href)}
            href={href}
          />
        ))}
        <TweetButton />
        {/* Tweet Button */}
      </div>
      {/* Avatar */}
      <AvatarWrapper
        fullName={fullName as string}
        username={userName as string}
        avatar={image as string}
      />
    </aside>
  );
}

function SidebarItem({
  text,
  icon,
  isActive,
  href,
}: {
  text: string;
  icon: React.ReactNode;
  isActive: boolean;
  href: string;
}) {
  return (
    <Link
      href={href}
      className={cn(
        buttonVariants({ variant: "ghost" }),
        "hover:bg-white/20 rounded-full px-4 py-6 text-xl flex md:justify-center lg:justify-start items-center gap-3"
      )}
    >
      <div>{icon}</div>
      <span
        className={`
        ${isActive ? "opacity-100" : "opacity-60"}
        text-base
        font-medium
        leading-none
        transition-all
        duration-200
        ease-in-out
        flex-1
        lg:group-hover:opacity-100
        hidden
        lg:block
      `}
      >
        {text}
      </span>
    </Link>
  );
}
