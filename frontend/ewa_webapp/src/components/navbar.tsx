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
import Chat from "@/components/chat";
import { useNavigate } from 'react-router-dom';


export const Navbar = () => {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [cartCount, setCartCount] = useState<number>(0);
  const [userName, setUserName] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const navigate = useNavigate();

  const toggleChat = () => {
    // Only open chat if user is logged in
    if (!userId && !isChatOpen) {
      navigate('/login');
      return;
    }
    setIsChatOpen(!isChatOpen);
  };

  useEffect(() => {
    const updateCartCount = () => {
      const cartItems = JSON.parse(localStorage.getItem("cart") || "[]");
      setCartCount(cartItems.length);
    };

    const checkLoginStatus = () => {
      const token = localStorage.getItem("token");
      const name = localStorage.getItem("userName");
      const id = localStorage.getItem("userId");
      if (token && name && id) {
        setUserName(name);
        setUserId(id);
      } else {
        setUserName(null);
        setUserId(null);
      }
    };

    updateCartCount();
    checkLoginStatus();

    window.addEventListener("storage", () => {
      updateCartCount();
      checkLoginStatus();
    });

    return () => {
      window.removeEventListener("storage", updateCartCount);
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userName");
    localStorage.removeItem("userId");
    setUserName(null);
    setUserId(null);
    setIsChatOpen(false); // Close chat when logging out
    navigate("/login");
  };

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
            {userName ? (
              <>
                <NavbarItem>
                  <p>Welcome, {userName}!</p>
                </NavbarItem>
                <NavbarItem>
                  <Link
                    className={clsx(
                      linkStyles({ color: "foreground" }),
                      "data-[active=true]:text-primary data-[active=true]:font-medium"
                    )}
                    color="foreground"
                    href="/orders"
                  >
                    Order History
                  </Link>
                </NavbarItem>
              </>
            ) : (
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
            )}
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
              onClick={toggleChat}
            >
              Chat with AI
            </Button>
          </NavbarItem>
          {userName && (
            <NavbarItem className="hidden md:flex">
              <Button
                className="text-sm font-normal text-white"
                onClick={handleLogout}
                variant="flat"
                style={{
                  background: "linear-gradient(90deg, #f2123b, #f23125, #f3446c)",
                  color: "#fff",
                  borderRadius: "8px",
                  padding: "0.5rem 1.5rem",
                  fontWeight: "bold",
                }}
              >
                Logout
              </Button>
            </NavbarItem>
          )}
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
            {userName ? (
              <>
                <NavbarMenuItem>
                  <p>Welcome, {userName}!</p>
                </NavbarMenuItem>
                <NavbarMenuItem>
                  <Link color="foreground" href="/orders" size="lg">
                    Order History
                  </Link>
                </NavbarMenuItem>
              </>
            ) : (
              <NavbarMenuItem>
                <Link color="foreground" href="/login" size="lg">
                  Login
                </Link>
              </NavbarMenuItem>
            )}
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
            {userName && (
              <NavbarMenuItem>
                <Button
                  className="text-sm font-normal text-white"
                  onClick={handleLogout}
                  variant="ghost"
                  style={{
                    background: "linear-gradient(90deg, #f2123b, #f23125, #f3446c)",
                    color: "#fff",
                    borderRadius: "8px",
                    padding: "0.5rem 1.5rem",
                    fontWeight: "bold",
                  }}
                >
                  Logout
                </Button>
              </NavbarMenuItem>
            )}
          </div>
        </NavbarMenu>
      </NextUINavbar>

      {isChatOpen && userId && (
        <Chat 
          selectedCarBrand="new" 
          userId={userId}
        />
      )}
    </>
  );
};

export default Navbar;