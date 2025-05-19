import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { MoreHorizontal } from "lucide-react";
import { BiLogOut } from "react-icons/bi";
import { handleSignOutAction } from "@/actions/authActions";
import { Button } from "./ui/button";

export default function AvatarWrapper({
  fullName = "",
  username = "",
  avatar = "",
  side = "top",
  setIsOpen,
}: {
  fullName?: string;
  username?: string;
  avatar?: string;
  side?: "top" | "bottom";
  setIsOpen?: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const avatarUrl =
    avatar ||
    `https://avatar.vercel.sh/${username}.svg?text=${username.charAt(0).toUpperCase() || "U"}`;

  const handleLogout = async () => {
    await handleSignOutAction();
  };

  return (
    <div className="w-full flex mt-auto justify-center rounded-full hover:bg-accent/30 transition-all duration-200 ease-in-out py-2 overflow-hidden ">
      <DropdownMenu>
        <DropdownMenuTrigger className="flex items-center lg:gap-2 cursor-pointer w-full justify-center">
          <Avatar className="size-12 ">
            <AvatarImage src={avatarUrl} />
            <AvatarFallback>{username}</AvatarFallback>
          </Avatar>
          <div className="hidden lg:flex items-center gap-2 h-full min-w-24">
            <div className="flex flex-col gap-2 items-start min-w-24">
              <div
                className="text-sm font-medium leading-none truncate max-w-[130px]"
                title={fullName}
              >
                {fullName}
              </div>
              <div
                className="text-xs text-muted-foreground truncate max-w-[130px]"
                title={`@${username}`}
              >
                @{username}
              </div>
            </div>
            <div className="ml-auto hover:bg-accent/30 transition-all duration-200 ease-in-out rounded-full p-2">
              <MoreHorizontal className=" h-4 w-4 text-muted-foreground" />
            </div>
          </div>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          side={side}
          align="end"
          className="w-48"
          sideOffset={10}
        >
          <DropdownMenuItem
            onClick={handleLogout}
            className="flex justify-between items-center cursor-pointer px-4 py-2 text-sm hover:bg-accent/50 focus:bg-accent/50"
          >
            <span>Log Out</span>
            <BiLogOut className="h-4 w-4 text-red-500/70" />
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
