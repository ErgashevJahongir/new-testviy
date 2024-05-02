import { Link } from "react-router-dom";

import { ModeToggle } from "@/components/mode-toggle";
import MobileMenu from "@/components/mobile-menu";

export default function Header() {
  return (
    <header className="container h-[60px] flex justify-between items-center gap-5 px-4 py-2 border-b-2 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex items-center gap-2">
        <MobileMenu />
        <Link className=" font-bold text-lg" to="/">
          Test App
        </Link>
      </div>
      <div>
        <ModeToggle />
      </div>
    </header>
  );
}
