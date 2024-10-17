import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { Button } from "@nextui-org/button";
import { Link } from "@nextui-org/link";
import {
  Navbar as NextUINavbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  NavbarMenuToggle,
  NavbarMenu,
  NavbarMenuItem,
} from "@nextui-org/navbar";
import { link as linkStyles } from "@nextui-org/theme";
import clsx from "clsx";
import { ThemeSwitch } from "@/components/theme-switch";
import { Logo } from "@/components/icons";

export const Navbar = () => {
  const navigate = useNavigate();

  const handleChatClick = () => {
    navigate("/chat-ai"); // Redirects to the chat page
  };

  return (
    <>
      <NextUINavbar maxWidth="xl" position="sticky">
        {/* Left Content: Logo and Brand */}
        <NavbarContent className="basis-1/5 sm:basis-full" justify="start">
          <NavbarBrand className="gap-3 max-w-fit">
            <Link
              className="flex justify-start items-center gap-1"
              color="foreground"
              href="/"
            >
              <Logo />
              <p className="font-bold text-inherit">NEXTGEN CARS</p>
            </Link>
          </NavbarBrand>
          {/* Desktop Navigation Links */}
          <div className="hidden lg:flex gap-6 justify-start ml-4">
            <NavbarItem>
              <Link
                className={clsx(
                  linkStyles({ color: "foreground" }),
                  "data-[active=true]:text-primary data-[active=true]:font-medium"
                )}
                color="foreground"
                href="/models"
              >
                Models
              </Link>
            </NavbarItem>
            <NavbarItem>
              <Link
                className={clsx(
                  linkStyles({ color: "foreground" }),
                  "data-[active=true]:text-primary data-[active=true]:font-medium"
                )}
                color="foreground"
                href="/login"
              >
                Login
              </Link>
            </NavbarItem>
            <NavbarItem>
              <Link
                className={clsx(
                  linkStyles({ color: "foreground" }),
                  "data-[active=true]:text-primary data-[active=true]:font-medium"
                )}
                color="foreground"
                href="/cart"
              >
                Cart
              </Link>
            </NavbarItem>
          </div>
        </NavbarContent>

        {/* Right Content: Theme Switch and AI Chat Button */}
        <NavbarContent className="hidden sm:flex basis-1/5 sm:basis-full" justify="end">
          <NavbarItem className="hidden sm:flex gap-2">
            <ThemeSwitch />
          </NavbarItem>
          <NavbarItem className="hidden md:flex">
            <Button
              onClick={handleChatClick} // Navigate to /chat-ai route
              className="text-sm font-normal text-white"
              variant="flat"
              style={{
                background: "linear-gradient(90deg, #f2123b, #f23125, #f3446c)",
                color: "#fff",
                borderRadius: "8px",
                padding: "0.5rem 1.5rem",
                fontWeight: "bold",
              }}
            >
              Chat with AI
            </Button>
          </NavbarItem>
        </NavbarContent>

        {/* Mobile Menu: Theme Switch and Menu Toggle */}
        <NavbarContent className="sm:hidden basis-1 pl-4" justify="end">
          <ThemeSwitch />
          <NavbarMenuToggle />
        </NavbarContent>

        {/* Navbar Menu for Mobile View */}
        <NavbarMenu>
          <div className="mx-4 mt-2 flex flex-col gap-2">
            <NavbarMenuItem>
              <Link color="foreground" href="/models" size="lg">
                Models
              </Link>
            </NavbarMenuItem>
            <NavbarMenuItem>
              <Link color="foreground" href="/login" size="lg">
                Login
              </Link>
            </NavbarMenuItem>
            <NavbarMenuItem>
              <Link color="foreground" href="/cart" size="lg">
                Cart
              </Link>
            </NavbarMenuItem>
          </div>
        </NavbarMenu>
      </NextUINavbar>
    </>
  );
};

export default Navbar;
