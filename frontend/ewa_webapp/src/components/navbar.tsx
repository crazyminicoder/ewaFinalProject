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
import { useEffect, useState } from "react";
import Chat from "@/components/chat"; // Import the Chat component

export const Navbar = () => {
  const [isChatOpen, setIsChatOpen] = useState(false); // State to toggle the chat visibility
  const [cartCount, setCartCount] = useState<number>(0); // State to track cart count
  const [isLoggedIn, setIsLoggedIn] = useState(false); // Track login state
  const [userId, setUserId] = useState(''); // Store user ID

  
  const toggleChat = () => {
    setIsChatOpen(!isChatOpen); // Toggle chat on button click
  };

  // Update the cart count from localStorage
  useEffect(() => {
    const userId = localStorage.getItem('userId');
    if (userId) {
      setIsLoggedIn(true);
      setUserId(userId);
    }
    const updateCartCount = () => {
      const cartItems = JSON.parse(localStorage.getItem("cart") || "[]");
      setCartCount(cartItems.length);
    };

    updateCartCount();

    // Add an event listener to update the cart count when localStorage changes
    window.addEventListener("storage", updateCartCount);

    // Cleanup the event listener
    return () => {
      window.removeEventListener("storage", updateCartCount);
    };
  }, []);

  return (
    <>
      <NextUINavbar maxWidth="xl" position="sticky">
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
          <div className="hidden lg:flex gap-6 justify-start ml-4">
            {/* Updated navigation items */}
            <NavbarItem>
              <Link
                className={clsx(
                  linkStyles({ color: "foreground" }),
                  "data-[active=true]:text-primary data-[active=true]:font-medium",
                )}
                color="foreground"
                href="/models"
              >
                Models
              </Link>
            </NavbarItem>
            {isLoggedIn ? (
              <NavbarItem>
                <Link
                className={clsx(
                  linkStyles({ color: "foreground" }),
                  "data-[active=true]:text-primary data-[active=true]:font-medium",
                )}
                color="foreground"
                href={`/orders/${userId}`}
              >
                Orders
                </Link>
              </NavbarItem>
            ) :(
            <NavbarItem>
              <Link
                className={clsx(
                  linkStyles({ color: "foreground" }),
                  "data-[active=true]:text-primary data-[active=true]:font-medium",
                )}
                color="foreground"
                href="/login"
              >
                Login
              </Link>
            </NavbarItem>
            )}
            <NavbarItem>
              <Link
                className={clsx(
                  linkStyles({ color: "foreground" }),
                  "data-[active=true]:text-primary data-[active=true]:font-medium",
                )}
                color="foreground"
                href="/cart"
              >
                Cart
                {cartCount > 0 && (
                  <span className="ml-2 bg-red-500 text-white rounded-full px-2 py-1 text-xs">
                    {cartCount}
                  </span>
                )}
              </Link>
            </NavbarItem>
          </div>
        </NavbarContent>

        <NavbarContent className="hidden sm:flex basis-1/5 sm:basis-full" justify="end">
          <NavbarItem className="hidden sm:flex gap-2">
            <ThemeSwitch />
          </NavbarItem>
          <NavbarItem className="hidden md:flex">
            <Button
              as={Link}
              className="text-sm font-normal text-white"
              href="#"
              variant="flat"
              style={{
                background: "linear-gradient(90deg, #f2123b, #f23125, #f3446c)",
                color: "#fff",
                borderRadius: "8px",
                padding: "0.5rem 1.5rem",
                fontWeight: "bold",
              }}
              onClick={toggleChat} // Toggle chat on button click
            >
              Chat with AI
            </Button>
          </NavbarItem>
        </NavbarContent>

        <NavbarContent className="sm:hidden basis-1 pl-4" justify="end">
          <ThemeSwitch /> 
          <NavbarMenuToggle />
        </NavbarContent>

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
                {cartCount > 0 && (
                  <span className="ml-2 bg-red-500 text-white rounded-full px-2 py-1 text-xs">
                    {cartCount}
                  </span>
                )}
              </Link>
            </NavbarMenuItem>
          </div>
        </NavbarMenu>
      </NextUINavbar>

      {/* Render Chat component if isChatOpen is true */}
      {isChatOpen && <Chat selectedCarBrand="Tesla" />} {/* Replace "Tesla" with dynamic data if needed */}
    </>
  );
};

export default Navbar;
