"use client"
import { Menu } from "lucide-react"
import { Button } from "./ui/button"
import { Input } from "./ui/input"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar"

export default function Topbar({
  onMenuClick,
  searchQuery = "",
  onSearchChange,
  onSearchSubmit,
  placeholder = "Search posts...",
}) {
  return (
    <header className="sticky top-0 z-20 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
      <div className="flex h-16 items-center gap-3 px-4 md:px-6">
        <div className="md:hidden">
          <Button variant="ghost" size="icon" aria-label="Open sidebar" onClick={onMenuClick}>
            <Menu className="h-5 w-5" />
          </Button>
        </div>

        <form
          className="mx-auto w-full max-w-xl"
          onSubmit={(e) => {
            e.preventDefault()
            onSearchSubmit?.()
          }}
          role="search"
          aria-label="Search posts by title or tag"
        >
          <label htmlFor="topbar-search" className="sr-only">
            Search posts
          </label>
          <Input
            id="topbar-search"
            placeholder={placeholder}
            className="w-full"
            type="search"
            inputMode="search"
            value={searchQuery}
            onChange={(e) => onSearchChange?.(e.target.value)}
          />
        </form>

        <div className="ml-auto">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-10 w-10 rounded-full" aria-label="User menu">
                <Avatar className="h-9 w-9">
                  <AvatarImage src="/diverse-person-avatars.png" alt="User avatar" />
                  <AvatarFallback>UA</AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Profile</DropdownMenuItem>
              <DropdownMenuItem>Sign Out</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  )
}
