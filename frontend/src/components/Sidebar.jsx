"use client"
import { NavLink } from "react-router-dom"
import { useState } from "react"
import { Home, PlusSquare, FileText, User ,ChevronLeft,ChevronRight } from "lucide-react"

const navItems = [
  { to: "/app/feed", label: "Feed", icon: Home },
  { to: "/app/create", label: "Create Post", icon: PlusSquare },
  { to: "/app/myposts", label: "My Posts", icon: FileText },
  { to: "/app/profile", label: "Profile", icon: User },
]

export default function Sidebar({ isOpen = false, onNavigate }) {
  return (
    <aside
      aria-label="Sidebar navigation"
      className={[
        "fixed inset-y-0 left-0 z-40 w-64 border-r border-border bg-card text-foreground",
        "transform transition-transform duration-300 ease-in-out",
        isOpen ? "translate-x-0" : "-translate-x-full",
        "md:translate-x-0",
      ].join(" ")}
    >
      {/* Header */}
      <div className="flex h-16 items-center gap-2 px-4 border-b border-border">
        <div className="h-8 w-8 rounded-md bg-primary/10" aria-hidden />
        <span className="font-semibold">AI Blog</span>
      </div>

      {/* Navigation */}
      <nav className="p-2 flex flex-col justify-between">
        <ul className="space-y-1">
          {navItems.map(({ to, label, icon: Icon }) => (
            <li key={to}>
              <NavLink
                to={to}
                end
                onClick={onNavigate}
                aria-label={label}
                className={({ isActive }) =>
                  [
                    "flex items-center gap-2 rounded-md px-3 py-2 transition-colors duration-300",
                    "hover:bg-accent hover:text-accent-foreground",
                    isActive ? "bg-accent text-accent-foreground" : "text-foreground",
                  ].join(" ")
                }
              >
                <Icon className="h-4 w-4" aria-hidden />
                <span className="text-sm">{label}</span>
              </NavLink>
            </li>
          ))}
        </ul>
    
      </nav>
    </aside>
  )
}
