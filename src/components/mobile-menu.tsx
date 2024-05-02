import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { AlignJustify } from "lucide-react";

import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";

export default function MobileMenu() {
  const { pathname } = useLocation();
  const [navbarLinkSheetOpen, setNavbarLinkSheetOpen] = useState(false);

  return (
    <Sheet open={navbarLinkSheetOpen} onOpenChange={setNavbarLinkSheetOpen}>
      <SheetTrigger asChild>
        <Button
          size="icon"
          variant="ghost"
          className="flex focus-visible:ring-transparent lg:hidden"
        >
          <AlignJustify className="h-[1.2rem] w-[1.2rem] scale-100" />
        </Button>
      </SheetTrigger>
      <SheetContent side="left">
        <SheetHeader>
          <SheetTitle className="text-left">Sahifalar</SheetTitle>
        </SheetHeader>
        <div className="grid gap-4 py-4">
          <div className="flex flex-col items-start gap-1 w-full">
            <Link className="w-full" onClick={() => setNavbarLinkSheetOpen(false)} to="/">
              <Button
                variant={pathname === "/" ? "secondary" : "ghost"}
                className="w-full justify-start"
              >
                Mahsulotlar
              </Button>
            </Link>
            <Link className="w-full" onClick={() => setNavbarLinkSheetOpen(false)} to="/category">
              <Button
                variant={pathname === "/category" ? "secondary" : "ghost"}
                className="w-full justify-start"
              >
                Kategoriyalar
              </Button>
            </Link>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
