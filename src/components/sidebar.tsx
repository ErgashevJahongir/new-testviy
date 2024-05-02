import { Link, useLocation } from "react-router-dom";

import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandList,
} from "@/components/ui/command";

const Sidebar = () => {
  const { pathname } = useLocation();

  return (
    <aside className="max-w-[275px] w-full hidden lg:block sticky sidebarHeader border-r-2">
      <Command>
        <CommandList className="py-2 px-2">
          <CommandEmpty>No results found.</CommandEmpty>
          <CommandGroup heading="Sahifalar">
            <Link to="/">
              <CommandItem
                className={pathname === "/" ? "bg-accent text-accent-foreground mb-1" : "mb-1"}
                data-selected={false}
              >
                <span>Mahsulotlar</span>
              </CommandItem>
            </Link>
            <Link to="/category">
              <CommandItem
                className={
                  pathname === "/category" ? "bg-accent text-accent-foreground mb-1" : "mb-1"
                }
              >
                <span>Kategoriyalar</span>
              </CommandItem>
            </Link>
          </CommandGroup>
        </CommandList>
      </Command>
    </aside>
  );
};

export default Sidebar;
