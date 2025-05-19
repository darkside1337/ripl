import React from "react";
import SidebarSkeleton from "./sidebar-skeleton";
import MobileNavbarSkeleton from "./mobile-navbar-skeleton";

const NavbarSkeleton = () => {
  return (
    <>
      <SidebarSkeleton />
      <MobileNavbarSkeleton />
    </>
  );
};

export default NavbarSkeleton;
