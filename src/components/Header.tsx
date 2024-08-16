"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import logo from "@/assets/ngoding-seru-logo.png";
import photoProfile from "@/assets/photo-profile.svg";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { logout } from "@/store/reducer/auth";
import { getProfile } from "@/store/reducer/user";
import { useDispatch, useSelector } from "react-redux";
import { useRouter, usePathname } from "next/navigation";
import type { AppDispatch, RootState } from "@/store";
import { Icon } from "@iconify/react";

export default function Header() {
  const router = useRouter();
  const pathname = usePathname();
  const dispatch: AppDispatch = useDispatch();

  const { isAuth } = useSelector((state: RootState) => state.auth);
  const { profile } = useSelector((state: RootState) => state.user);

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  const handleLogout = () => {
    router.push("/login");
    dispatch(logout());
    dispatch(getProfile(null));
  };

  const navUser = [
    { href: "/", label: "Home" },
    { href: "/admin/questions", label: "Admin" },
    { href: "/products/orders", label: "Pesanan" },
  ];

  const navAdmin = [
    { href: "/admin", label: "Admin" },
    { href: "/admin/dashboard", label: "Dashboard" },
  ];

  const navItems = pathname.startsWith("/admin") ? navAdmin : navUser;

  return (
    <header className="fixed inset-x-0 flex items-center h-20 z-50 bg-white border-b-[1px]">
      <div className="container flex justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center space-x-4 font-cofo-black">
          <Image
            src={logo}
            alt="Ngoding seru logo"
            width={80}
            height={80}
            quality={100}
          />
          <div>NGODING SERU</div>
        </Link>

        {/* Navigation Menu */}
        <nav
          className={`hidden lg:flex items-center space-x-10 text-primary text-sm`}
        >
          {navItems.map((item) => {
            const isActive = pathname.endsWith(item.href);

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`px-4 py-2 ${
                  isActive ? "text-primary bg-secondary rounded-md" : ""
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        {isAuth ? (
          <div className="relative flex items-center">
            <div className="flex lg:hidden bg-white mt-[2px]">
              <Icon
                icon="mage:dash-menu"
                className="text-primary size-7"
                onClick={() => setSidebarOpen(true)}
              />
            </div>

            {/* Profile */}
            <div
              className="hidden lg:flex items-center space-x-4 cursor-pointer"
              onClick={() => setIsProfileOpen(!isProfileOpen)}
            >
              <span className="text-lg">{profile?.Username || "new user"}</span>
              <Avatar>
                <AvatarImage
                  src={profile?.Image}
                  alt="Photo profile"
                  className="rounded-full"
                  style={{ objectFit: "cover", backgroundColor: "white" }}
                />
                <AvatarFallback>
                  <Image
                    src={photoProfile}
                    alt="Photo profile"
                    width={40}
                    height={40}
                    quality={100}
                    className="bg-white rounded-full"
                  />
                </AvatarFallback>
              </Avatar>
            </div>

            {/* Dropdown Profile */}
            <div
              className={`${
                isProfileOpen ? "absolute top-16 -right-4" : "hidden"
              } flex flex-col space-y-2 text-left bg-white p-4 rounded-md`}
            >
              <Button
                onClick={() =>
                  router.push(
                    `${profile?.Role === "admin" ? "/admin" : "/profile"}`
                  )
                }
                className="bg-secondary text-primary hover:bg-primary hover:text-white"
              >
                {profile?.Role === "admin" ? "Admin" : "Akun"}
              </Button>
              <Button
                onClick={handleLogout}
                className="bg-secondary text-primary hover:bg-primary hover:text-white"
              >
                Keluar
              </Button>
            </div>
          </div>
        ) : (
          <div className="flex items-center">
            <div
              className="flex lg:hidden"
              onClick={() => setSidebarOpen(true)}
            >
              <Icon icon="mage:dash-menu" className="text-primary size-6" />
            </div>
            <div className="hidden lg:flex space-x-2">
              <Link href="/admin/questions">
                <Button variant="outline">Admin</Button>
              </Link>
              <Link href="/login">
                <Button>Masuk</Button>
              </Link>
            </div>
          </div>
        )}

        {/* Sidebar */}
        <div
          className={`fixed top-0 right-0 z-50 bg-white min-h-screen w-64 shadow-lg transition-transform duration-300 ease-in-out ${
            sidebarOpen ? "translate-x-0" : "translate-x-full"
          }`}
        >
          <div className="flex justify-end pt-7 pr-7">
            <Icon
              icon="mage:multiply"
              height={24}
              className="text-gray-600 cursor-pointer hover:text-gray-800 transition-colors"
              onClick={() => setSidebarOpen(false)}
            />
          </div>
          <div className="flex flex-col items-center p-4">
            <Avatar className="size-20">
              <AvatarImage
                src={profile?.Image}
                alt="Photo profile"
                className="rounded-full"
                style={{ objectFit: "cover", backgroundColor: "white" }}
              />
              <AvatarFallback>
                <Image
                  src={photoProfile}
                  alt="Photo profile"
                  width={80}
                  height={80}
                  quality={100}
                  className="bg-white rounded-full"
                />
              </AvatarFallback>
            </Avatar>
            <div className="text-lg mb-6 mt-2">{profile?.Username}</div>
            <div className="flex flex-col space-y-2 w-full">
              {isAuth ? (
                <>
                  <Button
                    variant={"secondary"}
                    className="w-full text-center py-2 hover:bg-gray-100 rounded-lg transition-colors"
                    onClick={() => {
                      setSidebarOpen(false);
                      router.push(
                        profile?.Role === "admin" ? "/admin" : "/profile"
                      );
                    }}
                  >
                    {profile?.Role === "admin" ? "Admin" : "Akun"}
                  </Button>
                  <Button
                    variant={"secondary"}
                    className={`${
                      profile?.Role === "admin" ? "flex" : "hidden"
                    } w-full text-center py-2 hover:bg-gray-100 rounded-lg transition-colors`}
                    onClick={() => {
                      setSidebarOpen(false);
                      router.push("/admin/dashboard");
                    }}
                  >
                    Dashboard
                  </Button>
                  <Button
                    variant={"secondary"}
                    className="w-full text-center py-2 hover:bg-gray-100 rounded-lg transition-colors"
                    onClick={handleLogout}
                  >
                    Keluar
                  </Button>
                </>
              ) : (
                <>
                  <Button
                    variant={"secondary"}
                    className="w-full text-center py-2 hover:bg-gray-100 rounded-lg transition-colors"
                    onClick={() => router.push("/admin/questions")}
                  >
                    Admin
                  </Button>
                  <Button
                    variant={"secondary"}
                    className="w-full text-center py-2 hover:bg-gray-100 rounded-lg transition-colors"
                    onClick={() => router.push("/login")}
                  >
                    Masuk
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
