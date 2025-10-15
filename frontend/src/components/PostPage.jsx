"use client"

import { useEffect, useMemo, useState } from "react"
import { Link, useParams } from "react-router-dom"
import { motion } from "framer-motion"
import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"
import { Heart, ArrowLeft, Send } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Spinner } from "@/components/ui/spinner"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { usePostStore } from "../store/usePostStore"
import { useAuthStore } from "../store/useAuthStore"
import { set } from "mongoose"
import { use } from "react"
import toast from "react-hot-toast"

function readingTimeFromMarkdown(md) {
  const words = md?.split(/\s+/g).filter(Boolean).length || 0
  const minutes = Math.max(1, Math.ceil(words / 200))
  return `${minutes} min read`
}

const fadeIn = {
  initial: { opacity: 0, y: 8 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.35, ease: "easeOut" } },
}

export default function PostPage() {
  const { id } = useParams()
  const { getPostById, isLoadingPost, post, likePost } = usePostStore();
  const { user } = useAuthStore();

  const [liked, setLiked] = useState(false)
  const [likeCount, setLikeCount] = useState(post?.likes?.length || 0)
  const [commentText, setCommentText] = useState("")
  const [comments, setComments] = useState([
    {
      id: "c1",
      name: "Jordan",
      avatar: "/commenter-avatar.jpg",
      text: "Great insights! The human-in-the-loop part resonated.",
      timestamp: new Date(Date.now() - 1000 * 60 * 45).toISOString(),
    },
    {
      id: "c2",
      name: "Taylor",
      avatar: "/commenter-avatar.jpg",
      text: "Would love a deeper dive into measuring outcomes.",
      timestamp: new Date(Date.now() - 1000 * 60 * 5).toISOString(),
    },
  ])

  useEffect(() => {
    if (id) {
      getPostById(id);
    }

  }, [getPostById, id])

  useEffect(() => {
    if (post && user) {
      if (user?._id) {
        const isLiked = post.likes.some(
          (like) => like._id === user._id // ✅ compare by _id
        );
        setLiked(isLiked);
        setLikeCount(post.likes.length || 0)
      }
    }}, [post,user])


  

  const formattedDate = useMemo(() => {
    try {
      if (!post?.createdAt) return "";
      return new Date(post.createdAt).toLocaleDateString(undefined, {
        month: "short",
        day: "numeric",
        year: "numeric",
      })
    } catch {
      return ""
    }
  }, [post?.createdAt])

  const readTime = useMemo(() => {
    if (!post?.content) return ""
    readingTimeFromMarkdown(post.content || "")
  }, [post?.content])

  async function onToggleLike(){
    if(post?.user._id===user?._id){
      toast.error("You cannot like your own post.")
      return;
    }
    setLikeCount((count) => (liked ? Math.max(0, count - 1) : count + 1))
    setLiked((v) => !v)
    await likePost(post._id, user._id);
  }

  function onPostComment() {
    const text = commentText.trim()
    if (!text) return
    const newComment = {
      id: `c-${Date.now()}`,
      name: "You",
      avatar: "/abstract-ai-representation.png",
      text,
      timestamp: new Date().toISOString(),
    }
    setComments((curr) => [newComment, ...curr])
    setCommentText("")
  }

  const mdComponents = {
    h1: ({ children }) => <h1 className="mt-8 mb-4 text-3xl font-bold tracking-tight text-foreground">{children}</h1>,
    h2: ({ children }) => (
      <h2 className="mt-6 mb-3 text-2xl font-semibold tracking-tight text-foreground">{children}</h2>
    ),
    h3: ({ children }) => (
      <h3 className="mt-5 mb-2 text-xl font-semibold tracking-tight text-foreground">{children}</h3>
    ),
    p: ({ children }) => <p className="my-4 leading-relaxed text-foreground/90">{children}</p>,
    ul: ({ children }) => <ul className="my-4 ml-5 list-disc space-y-2">{children}</ul>,
    ol: ({ children }) => <ol className="my-4 ml-5 list-decimal space-y-2">{children}</ol>,
    li: ({ children }) => <li className="leading-relaxed">{children}</li>,
    a: ({ href, children }) => (
      <a href={href} className="text-primary underline underline-offset-2 hover:opacity-90">
        {children}
      </a>
    ),
    code: ({ inline, children }) =>
      inline ? (
        <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-sm text-foreground">{children}</code>
      ) : (
        <code className="block overflow-x-auto rounded-md bg-muted p-4 font-mono text-sm text-foreground" role="region">
          {children}
        </code>
      ),
    pre: ({ children }) => <pre className="my-4">{children}</pre>,
    blockquote: ({ children }) => (
      <blockquote className="my-4 border-l-4 border-border pl-4 italic text-foreground/80">{children}</blockquote>
    ),
    hr: () => <Separator className="my-8" />,
  }

  if (isLoadingPost) {

    return <div className='w-full h-screen flex items-center justify-center'>
      <Spinner />
    </div>

  }

  return (
    <main className="mx-auto max-w-3xl px-4 py-8 md:py-12">
      {/* Header */}
      <motion.div variants={fadeIn} initial="initial" animate="animate">
        <Button asChild variant="ghost" className="mb-4 px-0 text-muted-foreground hover:text-foreground">
          <Link to="/">
            <ArrowLeft className="mr-2 h-4 w-4" aria-hidden="true" />
            Back to feed
          </Link>
        </Button>

        <Card className="border-border bg-card/80 backdrop-blur supports-[backdrop-filter]:bg-card/60">
          <div>
            {post?.image && (
              <div className="relative h-60 w-full overflow-hidden rounded-t-md">
                <img
                  src={post.image}
                  alt={post.title}
                  className="absolute inset-0 h-full w-full object-cover"
                  loading="lazy"
                />
              </div>
            )}
          </div>
          <CardHeader className="space-y-3">
            <CardTitle className="text-balance text-3xl font-bold leading-tight text-foreground">
              {post?.title}
            </CardTitle>

            {/* Tags */}
            <div className="flex flex-wrap items-center gap-2">
              {Array.isArray(post?.tags) &&
                post?.tags.map((t) => (
                  <Badge key={t} variant="secondary" className="rounded-full">
                    {t}
                  </Badge>
                ))}
            </div>

            {/* Author Row */}
            <div className="flex flex-wrap items-center gap-3 pt-1 text-sm text-muted-foreground">
              <Link
                to={`/profile/${post?.user?.name || ""}`}
                className="flex items-center gap-2 hover:opacity-90"
              >
                <Avatar className="h-8 w-8">
                  <AvatarImage
                    src={post?.user?.profileImage || "/placeholder.svg"}
                    alt={post?.user?.name || "Author avatar"}
                  />
                  <AvatarFallback>{(post?.user?.name || "A").slice(0, 2).toUpperCase()}</AvatarFallback>
                </Avatar>
                <span className="font-medium text-foreground">{post?.user?.name}</span>
              </Link>
              <span aria-hidden="true">•</span>
              <time dateTime={post?.publishedAt}>{formattedDate}</time>
              <span aria-hidden="true">•</span>
              <span>{readTime}</span>
            </div>
          </CardHeader>

          {/* Content */}
          <CardContent className="pt-0">
            <motion.div
              variants={fadeIn}
              initial="initial"
              animate="animate"
              className="prose prose-neutral prose-headings:scroll-mt-24 max-w-none"
            >
              <ReactMarkdown remarkPlugins={[remarkGfm]} components={mdComponents}>
                {post?.content || ""}
              </ReactMarkdown>
            </motion.div>
          </CardContent>

          {/* Interactions */}
          <CardFooter className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Button
                variant={liked ? "default" : "secondary"}
                onClick={onToggleLike}
                aria-pressed={liked}
                aria-label={liked ? "Unlike post" : "Like post"}
              >
                <Heart className={`mr-2 h-4 w-4 ${liked ? "fill-current" : ""}`} aria-hidden="true" />
                {likeCount}
              </Button>
            </div>
          </CardFooter>
        </Card>
      </motion.div>

      {/* Comments */}
      <section className="mt-8">
        <motion.h2
          variants={fadeIn}
          initial="initial"
          animate="animate"
          className="mb-3 text-lg font-semibold tracking-tight text-foreground"
          id="comments-heading"
        >
          Comments
        </motion.h2>

        <Card aria-labelledby="comments-heading">
          <CardContent className="pt-6">
            <div className="flex flex-col gap-3 sm:flex-row">
              <Input
                placeholder="Write a comment..."
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                aria-label="Write a comment"
                className="sm:flex-1"
              />
              <Button onClick={onPostComment} className="sm:self-start">
                <Send className="mr-2 h-4 w-4" aria-hidden="true" />
                Post Comment
              </Button>
            </div>

            <Separator className="my-6" />

            <ul className="space-y-4">
              {comments.map((c) => (
                <li key={c.id} className="flex items-start gap-3">
                  <Avatar className="h-9 w-9">
                    <AvatarFallback>{c.name.slice(0, 2).toUpperCase()}</AvatarFallback>
                  </Avatar>
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2 text-sm">
                      <span className="font-medium text-foreground">{c.name}</span>
                      <span className="text-muted-foreground">
                        {new Date(c.timestamp).toLocaleString(undefined, {
                          month: "short",
                          day: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </span>
                    </div>
                    <p className="mt-1 text-foreground/90">{c.text}</p>
                  </div>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </section>
    </main>
  )
}
