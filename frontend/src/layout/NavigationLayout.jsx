import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Label } from "@/components/ui/label";
import { LogOut } from "lucide-react";
import React, { useContext } from "react";
import { Link, Outlet, useNavigate } from "react-router-dom";
import logo from "@/assets/logo.png";
import { useAuth } from "@/hooks/useAuth";
import { TokenAuth } from "@/context";
import { jwtDecode } from "jwt-decode";
import { toTitleCase } from "@/helpers/title-case";
import { getInitials } from "@/helpers/initials";
import { useUserLogout } from "@/api/auth";
import { toast } from "sonner";
import Cookies from "universal-cookie";

export default function NavigationLayout() {
  return (
    <div className="flex flex-col">
      <div className="flex items-center py-4 px-3 border-b-1">
        <NavTitle />
        <NavigationItems />
      </div>
      <Content />
    </div>
  );
}

const NavTitle = () => {
  return (
    <div className="flex-1 ml-4 flex-row flex gap-2">
      <img src={logo} alt="..." className="w-8" />
      <Label className="text-lg">POPCORNPLAY</Label>
    </div>
  );
};

const NavigationItems = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  return (
    <div className="mr-4 flex gap-6 items-center">
      {isAuthenticated ? (
        <>
          <AvatarUser />
        </>
      ) : (
        <Button onClick={() => navigate("signin")}>Sign In</Button>
      )}
    </div>
  );
};

const AvatarUser = () => {
  const navigate = useNavigate();
  const { checkTokenAuth, logout } = useContext(TokenAuth);
  const { mutate: onUserLogout } = useUserLogout();

  const cookies = new Cookies();
  const token = cookies.get("token");

  if (!token) return null;

  let user;
  try {
    user = jwtDecode(token);
  } catch (error) {
    console.error("Invalid JWT:", error);
    return null;
  }

  const handleLogout = () => {
    const data = new FormData();

    data.append("refresh", checkTokenAuth.refresh);
    onUserLogout(data, {
      onSuccess: (data) => {
        if (data.message) {
          logout();
          navigate("/signin", { replace: true });
          toast.success(data.message);
        }
      },
      onError: (error) => {
        console.log(error);
      },
    });
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <div className="flex items-center gap-2 cursor-pointer">
          <Label>Hello, {toTitleCase(user?.username)}</Label>
          <Avatar>
            <AvatarImage src="" alt="User avatar" />
            <AvatarFallback>{getInitials(user?.username)}</AvatarFallback>
          </Avatar>
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem
          className="hover:cursor-pointer"
          onClick={handleLogout}
        >
          <LogOut className="mr-2 h-4 w-4" />
          <span>Logout</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

const Content = () => {
  return (
    <div className="">
      <Outlet />
    </div>
  );
};
