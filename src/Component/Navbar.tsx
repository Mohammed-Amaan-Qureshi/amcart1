"use client";
import { IUser } from "@/app/model/user.model";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import logo from "@/assets/Logo.png";
import {
  AiOutlineSearch,
  AiOutlineUser,
  AiOutlineShoppingCart,
  AiOutlineMenu,
  AiOutlineClose,
  AiOutlineHome,
  AiOutlineAppstore,
  AiOutlinePhone,
  AiOutlineShop,
  AiOutlineLogin,
  AiOutlineLogout,
  AiOutlineSolution,
} from "react-icons/ai";
import { GoListUnordered } from "react-icons/go";
import { AnimatePresence, motion } from "motion/react";
import { signOut } from "next-auth/react";

function Navbar({ user }: { user: IUser }) {
  const navigate = useRouter();
  const [openMenu, setOpenMenu] = useState<boolean>(false);
  const [openSideBar, setOpenSideBar] = useState<boolean>(false);

  return (
    <div className="fixed top-0 right-0 w-full h-auto px-4 py-2 bg-black z-50">
      <div className="w-full flex justify-between items-center">
        <div
          className="flex justify-center items-center cursor-pointer"
          onClick={() => navigate.push("/")}
        >
          <Image src={logo} alt="" width={100} />
        </div>

        {user.role == "user" && (
          <div className="hidden md:flex gap-8">
            <NavItems label="Home" path="/" navigate={navigate} />
            <NavItems label="Cateogries" path="/cateogry" navigate={navigate} />
            <NavItems label="Shop" path="/shop" navigate={navigate} />
            <NavItems label="Orders" path="/orders" navigate={navigate} />
          </div>
        )}

        {/* desktop icons */}
        {user.role === "user" ? (
          <div className="hidden md:flex items-center gap-6">
            <NavIconBtn
              Icon={AiOutlineSearch}
              onClick={() => navigate.push("/cateogry")}
            />
            <NavIconBtn
              Icon={AiOutlinePhone}
              onClick={() => navigate.push("/support")}
            />

            <div className=" relative">
              {user?.image ? (
                <Image
                  src={user.image}
                  alt="User"
                  width={40}
                  height={40}
                  className="w-10 h-10 object-cover rounded-full border border-gray-700 cursor-pointer"
                  onClick={() => setOpenMenu(!openMenu)}
                />
              ) : (
                <NavIconBtn
                  Icon={AiOutlineUser}
                  onClick={() => {
                    setOpenMenu(!openMenu);
                  }}
                />
              )}

              <AnimatePresence>
                {openMenu && (
                  <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.5 }}
                    className=" absolute right-0 mt-3 w-48 rounded-xl backdrop-blur-lg shadow-lg border border-gray-400"
                  >
                    <NavDropDownBtn
                      Icon={AiOutlineUser}
                      label="Profile"
                      onClick={() => {
                        navigate.push("/profile");
                        setOpenMenu(false);
                      }}
                    />
                    <NavDropDownBtn
                      Icon={AiOutlineLogin}
                      label="Login"
                      onClick={() => {
                        navigate.push("/login");
                        setOpenMenu(false);
                      }}
                    />
                    <NavDropDownBtn
                      Icon={AiOutlineLogout}
                      label="Logout"
                      onClick={() => {
                        signOut();
                        setOpenMenu(false);
                      }}
                    />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            {user?.role === "user" && (
              <CartBtn navigate={navigate} count={user.cart?.length} />
            )}
          </div>
        ) : (
          <div className="hidden md:flex relative">
            {user?.image ? (
              <div className=" flex gap-4">
              <NavIconBtn
              Icon={AiOutlinePhone}
              onClick={() => navigate.push("/support")}
            />
              <Image
                src={user.image}
                alt="User"
                width={40}
                height={40}
                className="w-10 h-10 object-cover rounded-full border border-gray-700 cursor-pointer"
                onClick={() => setOpenMenu(!openMenu)}
              />
              </div>
            ) : (
              <NavIconBtn
                Icon={AiOutlineUser}
                onClick={() => {
                  setOpenMenu(!openMenu);
                }}
              />
            )}

            <AnimatePresence>
              {openMenu && (
                <motion.div
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.5 }}
                  className=" absolute right-0 mt-3 w-48 rounded-xl backdrop-blur-lg shadow-lg border border-gray-400"
                >
                  <NavDropDownBtn
                    Icon={AiOutlineUser}
                    label="Profile"
                    onClick={() => {
                      navigate.push("/profile");
                      setOpenMenu(false);
                    }}
                  />
                  <NavDropDownBtn
                    Icon={AiOutlineLogin}
                    label="Login"
                    onClick={() => {
                      navigate.push("/login");
                      setOpenMenu(false);
                    }}
                  />
                  <NavDropDownBtn
                    Icon={AiOutlineLogout}
                    label="Logout"
                    onClick={() => {
                      signOut();
                      setOpenMenu(false);
                    }}
                  />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}

        {/* mobile icons */}

        <div className="md:hidden flex items-center gap-4">
          {user?.role === "vendor" || user?.role === "admin" ? (
            <>
              <NavIconBtn
                Icon={AiOutlinePhone}
                onClick={() => navigate.push("/support")}
              />

              <div className=" relative">
                {user?.image ? (
                  <Image
                    src={user.image}
                    alt="User"
                    width={32}
                    height={32}
                    className="w-8 h-8 object-cover rounded-full border border-gray-700 cursor-pointer"
                    onClick={() => setOpenMenu(!openMenu)}
                  />
                ) : (
                  <NavIconBtn
                    Icon={AiOutlineUser}
                    onClick={() => {
                      setOpenMenu(!openMenu);
                    }}
                  />
                )}

                <AnimatePresence>
                  {openMenu && (
                    <motion.div
                      initial={{ opacity: 0, y: -20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.5 }}
                      className=" absolute right-0 mt-3 w-48 rounded-xl backdrop-blur-lg shadow-lg border border-gray-400"
                    >
                      <NavDropDownBtn
                        Icon={AiOutlineUser}
                        label="Profile"
                        onClick={() => {
                          navigate.push("/profile");
                          setOpenMenu(false);
                        }}
                      />
                      <NavDropDownBtn
                        Icon={AiOutlineLogin}
                        label="Login"
                        onClick={() => {
                          navigate.push("/login");
                          setOpenMenu(false);
                        }}
                      />
                      <NavDropDownBtn
                        Icon={AiOutlineLogout}
                        label="Logout"
                        onClick={() => {
                          signOut();
                          setOpenMenu(false);
                        }}
                      />
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </>
          ) : (
            <>
              <NavIconBtn
                Icon={AiOutlineSearch}
                onClick={() => navigate.push("/cateogry")}
              />
              <NavIconBtn
                Icon={AiOutlinePhone}
                onClick={() => navigate.push("/support")}
              />
              <CartBtn navigate={navigate} count={user.cart?.length} />
              <AiOutlineMenu
                className="text-xl cursor-pointer"
                onClick={() => setOpenSideBar(true)}
              />

              <AnimatePresence>
                {openSideBar && (
                  <motion.div
                    initial={{ x: "100%" }}
                    animate={{ x: 0 }}
                    exit={{ x: "100%" }}
                    transition={{ type: "spring", stiffness: 250, damping: 20 }}
                    className=" fixed top-0 right-0 h-screen w-[65%] bg-black/90 backdrop-blur-lg p-6 text-white"
                  >
                    <div className="flex justify-between items-center mb-6 ">
                      <h1 className="text-xl font-semibold">Menu</h1>
                      <AiOutlineClose
                        size={28}
                        className="cursor-pointer"
                        onClick={() => setOpenSideBar(false)}
                      />
                    </div>

                    <div className=" flex flex-col gap-4 text-lg">
                      <SidebarBtn
                        label="Home"
                        Icon={AiOutlineHome}
                        path="/"
                        navigate={navigate}
                        setOpenSideBar={setOpenSideBar}
                      />
                      <SidebarBtn
                        label="Cateogries"
                        Icon={AiOutlineAppstore}
                        path="/cateogry"
                        navigate={navigate}
                        setOpenSideBar={setOpenSideBar}
                      />
                      <SidebarBtn
                        label="Shop"
                        Icon={AiOutlineShop}
                        path="/shop"
                        navigate={navigate}
                        setOpenSideBar={setOpenSideBar}
                      />
                      <SidebarBtn
                        label="Orders"
                        Icon={GoListUnordered}
                        path="/orders"
                        navigate={navigate}
                        setOpenSideBar={setOpenSideBar}
                      />
                      <SidebarBtn
                        label="Profile"
                        Icon={AiOutlineUser}
                        path="/profile"
                        navigate={navigate}
                        setOpenSideBar={setOpenSideBar}
                      />
                      <SidebarBtn
                        label="Login"
                        Icon={AiOutlineLogin}
                        path="/login"
                        navigate={navigate}
                        setOpenSideBar={setOpenSideBar}
                      />
                      <SidebarBtnForSignOut
                        label="Logout"
                        Icon={AiOutlineLogout}
                        setOpenSideBar={setOpenSideBar}
                      />
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default Navbar;

const NavItems = ({ label, path, navigate }: any) => (
  <button
    onClick={() => navigate.push(path)}
    className=" transition cursor-pointer hover:text-gray-500"
  >
    {label}
  </button>
);

const NavIconBtn = ({ Icon, onClick }: any) => (
  <motion.button onClick={onClick} whileHover={{ scale: 1.1 }}>
    <Icon size={24} className=" cursor-pointer" />
  </motion.button>
);

const NavDropDownBtn = ({ Icon, label, onClick }: any) => (
  <button
    className=" flex items-center gap-3 w-full px-4 py-2 hover:bg-white/10 text-center"
    onClick={() => {
      onClick();
    }}
  >
    {<Icon size={18} />}
    {label}
  </button>
);

const CartBtn = ({ navigate, count }: any) => (
  <motion.button
    onClick={() => navigate.push("/cart")}
    whileHover={{ scale: 1.1 }}
    className=" relative"
  >
    <AiOutlineShoppingCart size={24} className=" cursor-pointer" />

    {count > 0 && (
      <span className=" absolute -top-2  -right-2 bg-blue-500 text-white text-xs rounded-full px-1">
        {count}
      </span>
    )}
  </motion.button>
);

const SidebarBtn = ({ label, path, navigate, Icon, setOpenSideBar }: any) => (
  <button
    className=" flex items-center gap-3 px-4 py-2 rounded-lg bg-gray-700 hover:bg-gray-600 text-left"
    onClick={() => {
      navigate.push(path);
      setOpenSideBar(false);
    }}
  >
    <Icon size={20} />
    {" " + label}
  </button>
);

const SidebarBtnForSignOut = ({ label, Icon, setOpenSideBar }: any) => (
  <button
    className=" flex items-center gap-3 px-4 py-2 rounded-lg bg-gray-700 hover:bg-gray-600 text-left"
    onClick={() => {
      signOut();
      setOpenSideBar(false);
    }}
  >
    <Icon size={20} />
    {" " + label}
  </button>
);
