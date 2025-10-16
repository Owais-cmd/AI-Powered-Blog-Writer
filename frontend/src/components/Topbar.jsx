"use client"
import { useEffect } from "react"
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
import { useFeed } from "../store/useFeed"
import { ModeToggle } from "@/components/Mode_toggle"
import {Link} from "react-router-dom"
import { useAuthStore } from "../store/useAuthStore"
import { usePostStore } from "../store/usePostStore"
import { use } from "react"

export default function Topbar({
  onMenuClick,
  onSearchSubmit,
  placeholder = "Search posts...",
}) {
  const {query, setQuery} = useFeed()
  const {logout,user} = useAuthStore();
  const {searchPosts} = usePostStore();

  async function onSearchChange(e){
    setQuery(e.target.value);
    searchPosts(e.target.value);
  }

  return (
    <header className="sticky top-0 z-20 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80 shadow-theme">
      <div className="flex h-16 items-center gap-3 px-4 md:px-6">
        <div className="">
          <Button variant="ghost" size="icon" aria-label="Open sidebar" onClick={()=>{onMenuClick()}}>
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
            className="w-full bg-accent"
            type="search"
            inputMode="search"
            value={query}
            onChange={onSearchChange}
          />
        </form>

        <div className="ml-auto flex gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-10 w-10 rounded-full" aria-label="User menu">
                <Avatar className="h-9 w-9">
                  <AvatarImage src={user.profileImage} alt="User avatar" />
                  <AvatarFallback>{user.name.slice(0,2)}</AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <Link to="/profile"><DropdownMenuItem>Profile</DropdownMenuItem></Link>
              <DropdownMenuItem><button onClick={logout}>Sign Out</button></DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <div className="pt-0.5">
          <ModeToggle />
          </div>
        </div>
      </div>
    </header>
  )
}
