"use client"

import React from "react"
import Sidebar from "../components/Sidebar"
import Topbar from "../components/Topbar"
import { Outlet } from "react-router-dom"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Heart, MessageCircle, ChevronDown, ChevronUp } from "lucide-react"
import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"
import { motion } from "framer-motion"
import { useSidebar } from "../store/useSidebar"
import Post from "../components/Post"



// Reusable Post component defined inline per request


export default function Home() {
  const {isOpen, toggle, open, close} = useSidebar();

  

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="flex min-h-screen">
        {/* Sidebar */}
        <Sidebar isOpen={isOpen} onNavigate={close} />

        {/* Main */}
        <div className={`flex-1 ${isOpen ? "md:pl-64" : "md:pl-0"}`}>
          <Topbar
            onMenuClick={toggle}
            onSearchSubmit={() => {}}
            placeholder="Search by title or tag..."
          />

          <main className="px-4 py-6 md:px-8">
            {/* Feed */}
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  )
}
