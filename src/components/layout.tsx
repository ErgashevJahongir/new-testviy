import { Outlet } from "react-router-dom";

import Header from "@/components/header";
import Sidebar from "@/components/sidebar";

export default function Layout() {
  return (
    <>
      <Header />
      <main className="container flex w-full h-full">
        <Sidebar />
        <div className="px-4 py-2 w-full">
          <Outlet />
        </div>
      </main>
    </>
  );
}
