"use client"

import React from "react"
import Sidebar from "../components/Sidebar"
import Topbar from "../components/Topbar"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Separator } from "@/components/ui/separator"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Heart, MessageCircle, ChevronDown, ChevronUp } from "lucide-react"
import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"
import { motion } from "framer-motion"
import { useSidebar } from "../store/useSidebar"

const demoPosts = [
  {
    id: "1",
    title: "How I Write Better with AI",
    tags: ["ai", "writing", "productivity"],
    author: "Ava Thompson",
    content: `# Writing with Assistive AI\n\nI’ve been using AI to improve my drafts. Here’s the workflow:\n\n- Outline ideas\n- Draft quickly\n- Let AI suggest edits\n\n> It’s like having a thoughtful editor.\n\n\`\`\`js\nconst tip = 'Write now, edit later.'\nconsole.log(tip)\n\`\`\`\n\nAnd that’s all you need to ship consistently.`,
    likes: 42,
    comments: [
      { id: "c-1", author: "Liam", text: "Great tips! Using this now." },
      { id: "c-2", author: "Sofia", text: "The code snippet made me smile :)" },
    ],
  },
  {
    id: "2",
    title: "Designing Clean Blog Layouts",
    tags: ["design", "css", "ux"],
    author: "Liam Chen",
    content: `## A layout that reads well\n\nGood layouts prioritize legibility, rhythm, and breathing room.\n\n- Larger title\n- Comfortable line-height\n- Consistent spacing\n\nTry badges for tags and clear affordances for actions.`,
    likes: 18,
    comments: [{ id: "c-3", author: "Ava", text: "Totally agree on spacing." }],
  },
  {
    id: "3",
    title: "Tags vs. Categories: When to Use What",
    tags: ["content", "taxonomy"],
    author: "Sofia Martínez",
    content: `Tags are flexible, categories are structural. For most blogs:\n\n- Use categories sparingly\n- Use tags to enrich discovery\n\nThis balance supports both browsing and search.`,
    likes: 7,
    comments: [],
  },
]

// Reusable Post component defined inline per request
function Post({ title, tags, author, summary, content, initialLikes = 0, initialComments = [] }) {
  const [expanded, setExpanded] = React.useState(false)
  const [liked, setLiked] = React.useState(false)
  const [likes, setLikes] = React.useState(initialLikes)
  const [comments, setComments] = React.useState(initialComments)
  const [newComment, setNewComment] = React.useState("")

  const toggleLike = React.useCallback(() => {
    setLiked((v) => !v)
    setLikes((n) => (liked ? Math.max(0, n - 1) : n + 1))
  }, [liked])

  const handleAddComment = React.useCallback(() => {
    const text = newComment.trim()
    if (!text) return
    setComments((arr) => [...arr, { id: `local-${Date.now()}`, author: "You", text }])
    setNewComment("")
  }, [newComment])

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25, ease: "easeOut" }}
    >
      <Card className="bg-card/70 backdrop-blur supports-[backdrop-filter]:bg-card/60 transition-colors hover:bg-card">
        <CardHeader className="cursor-pointer" onClick={() => setExpanded((v) => !v)}>
          <CardTitle className="text-pretty text-xl font-semibold">{title}</CardTitle>
          <div className="mt-2 flex flex-wrap gap-2">
            {tags.map((tag) => (
              <Badge key={tag} variant="secondary" className="capitalize">
                {tag}
              </Badge>
            ))}
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          <div className="text-sm text-muted-foreground">By {author}</div>

          {!expanded ? (
            <p className="text-foreground leading-relaxed">{summary}</p>
          ) : (
            <div className="prose prose-sm max-w-none text-foreground">
              <ReactMarkdown remarkPlugins={[remarkGfm]}>{content}</ReactMarkdown>
            </div>
          )}
        </CardContent>

        <CardFooter className="flex flex-col gap-4">
          <div className="flex w-full items-center justify-between">
            <div className="flex items-center gap-3">
              <Button
                variant={liked ? "default" : "secondary"}
                size="sm"
                onClick={(e) => {
                  e.stopPropagation()
                  toggleLike()
                }}
                aria-pressed={liked}
                aria-label={liked ? "Unlike post" : "Like post"}
              >
                <Heart className={`mr-2 h-4 w-4 ${liked ? "" : "opacity-80"}`} />
                {likes}
              </Button>
              <div className="flex items-center text-sm text-muted-foreground">
                <MessageCircle className="mr-2 h-4 w-4" />
                {comments.length}
              </div>
            </div>

            <Button
              variant="outline"
              size="sm"
              onClick={(e) => {
                e.stopPropagation()
                setExpanded((v) => !v)
              }}
              aria-expanded={expanded}
            >
              {expanded ? (
                <>
                  Collapse <ChevronUp className="ml-2 h-4 w-4" />
                </>
              ) : (
                <>
                  Read more <ChevronDown className="ml-2 h-4 w-4" />
                </>
              )}
            </Button>
          </div>

          {expanded && (
            <>
              <Separator />

              <div className="w-full space-y-3">
                <h4 className="text-sm font-semibold">Comments</h4>
                <div className="space-y-3">
                  {comments.length === 0 ? (
                    <p className="text-sm text-muted-foreground">Be the first to comment.</p>
                  ) : (
                    comments.map((c) => (
                      <div key={c.id} className="flex items-start gap-3">
                        <Avatar className="h-8 w-8">
                          <AvatarFallback className="bg-accent/15 text-foreground">
                            {c.author?.slice(0, 2).toUpperCase() || "YY"}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="text-sm font-medium">{c.author || "You"}</div>
                          <div className="text-sm text-foreground/90 leading-relaxed">{c.text}</div>
                        </div>
                      </div>
                    ))
                  )}
                </div>

                <div className="flex flex-col gap-2 sm:flex-row">
                  <Textarea
                    placeholder="Write a comment..."
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    className="sm:flex-1"
                    rows={2}
                  />
                  <Button onClick={handleAddComment} className="sm:self-start" aria-label="Add comment">
                    Add Comment
                  </Button>
                </div>
              </div>
            </>
          )}
        </CardFooter>
      </Card>
    </motion.div>
  )
}

export default function Home() {
  const {isOpen, toggle, open, close} = useSidebar();
  const [query, setQuery] = React.useState("")

  const closeSidebar = React.useCallback(() => setIsSidebarOpen(false), [])
  const toggleSidebar = React.useCallback(() => setIsSidebarOpen((v) => !v), [])

  const posts = React.useMemo(() => demoPosts, [])
  const filteredPosts = React.useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return posts
    return posts.filter((p) => {
      const inTitle = p.title.toLowerCase().includes(q)
      const inTags = p.tags.some((t) => t.toLowerCase().includes(q))
      return inTitle || inTags
    })
  }, [posts, query])

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="flex min-h-screen">
        {/* Sidebar */}
        <Sidebar isOpen={isOpen} onNavigate={closeSidebar} />

        {/* Overlay for mobile drawer */}
        {!isOpen ? (
          <button
            aria-label="Close sidebar overlay"
            className="fixed inset-0 z-30 bg-foreground/40 md:hidden"
            onClick={closeSidebar}
          />
        ) : null}

        {/* Main */}
        <div className="flex-1 md:pl-64">
          <Topbar
            onMenuClick={toggle}
            searchQuery={query}
            onSearchChange={setQuery}
            onSearchSubmit={() => {}}
            placeholder="Search by title or tag..."
          />

          <main className="px-4 py-6 md:px-8">
            {/* Feed */}
            <section aria-label="Feed" className="mx-auto max-w-3xl space-y-6">
              {filteredPosts.map((p) => {
                const summary = p.content.slice(0, 200) + (p.content.length > 200 ? "…" : "")
                return (
                  <Post
                    key={p.id}
                    title={p.title}
                    tags={p.tags}
                    author={p.author}
                    summary={summary}
                    content={p.content}
                    initialLikes={p.likes}
                    initialComments={p.comments}
                  />
                )
              })}
              {filteredPosts.length === 0 && (
                <Card className="bg-card/70">
                  <CardContent className="p-6 text-sm text-muted-foreground">
                    No posts match “{query}”. Try a different search.
                  </CardContent>
                </Card>
              )}
            </section>
          </main>
        </div>
      </div>
    </div>
  )
}
