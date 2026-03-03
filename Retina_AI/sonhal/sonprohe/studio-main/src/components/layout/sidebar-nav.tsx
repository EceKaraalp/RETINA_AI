"use client";

import {
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from "@/components/ui/sidebar";
import { LayoutDashboard, Users, Settings, ChevronRight } from "lucide-react";
import { usePathname } from "next/navigation";
import Link from "next/link";

const menuItems = [
  { href: "/dashboard", label: "Panel", icon: LayoutDashboard },
  { href: "/dashboard/hastalar", label: "Hasta Kayıtları", icon: Users },
  { href: "/dashboard/ayarlar", label: "Sistem Ayarları", icon: Settings },
];

export function SidebarNav() {
  const pathname = usePathname();

  return (
    <SidebarMenu className="gap-3">
      {menuItems.map((item) => {
        const isActive =
          pathname.startsWith(item.href) &&
          (item.href !== "/dashboard" || pathname === "/dashboard");

        return (
          <SidebarMenuItem key={item.href}>
            <SidebarMenuButton
              asChild
              isActive={isActive}
              className={`
    relative group flex items-center h-12 px-4 rounded-xl transition-all duration-300
    /* ÖNEMLİ: Hover ve Active durumlarında yazı rengini text-white olarak sabitledik */
    ${
      isActive
        ? "bg-blue-500/20 text-white border border-blue-400/30 shadow-[0_0_20px_rgba(59,130,246,0.2)] hover:text-white hover:bg-blue-500/30"
        : "text-slate-200 hover:text-white hover:bg-white/10"
    }
  `}
            >
              <Link
                href={item.href}
                className="w-full flex items-center justify-between"
              >
                <div className="flex items-center gap-3">
                  <item.icon
                    className={`h-5 w-5 transition-colors ${
                      isActive
                        ? "text-blue-400"
                        : "text-slate-400 group-hover:text-white"
                    }`}
                  />
                  <span className="font-semibold tracking-wide text-[14px]">
                    {item.label}
                  </span>
                </div>
                {isActive && (
                  <div className="h-1.5 w-1.5 rounded-full bg-blue-400 shadow-[0_0_10px_rgba(96,165,250,1)]" />
                )}
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        );
      })}
    </SidebarMenu>
  );
}
