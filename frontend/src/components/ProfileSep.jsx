"use client"

import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import { Link, useParams } from "react-router-dom"
import { motion, useReducedMotion } from "framer-motion"

import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import axios from "axios"
import { Spinner } from "@/components/ui/spinner"
import toast from "react-hot-toast"

function formatDate(isoString) {
  const d = new Date(isoString)
  if (isNaN(d.getTime())) return ""
  return d.toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" })
}


export default function Profile() {
  const prefersReducedMotion = useReducedMotion()
  // Mocked profile dat
  const lastObjectUrlRef = useRef(null)
  const { username } = useParams();
  const [user, setUser] = useState(null);
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    async function fetchPosts() {
      const response = await axios.get(`/api/user/${username}`);
      setUser(response.data.user[0]);
      setPosts(response.data.posts);

    }
    fetchPosts()
    return () => {
      if (lastObjectUrlRef.current) {
        URL.revokeObjectURL(lastObjectUrlRef.current)
      }
    }
  }, [username])

  useEffect(() => {
    console.log(user);
    console.log(posts);
  }, [user,posts])



  const containerVariants = useMemo(
    () => ({
      hidden: { opacity: 0, y: 8 },
      show: { opacity: 1, y: 0, transition: { duration: prefersReducedMotion ? 0 : 0.35 } },
    }),
    [prefersReducedMotion],
  )

  const cardHover = useMemo(
    () =>
      prefersReducedMotion
        ? {}
        : {
          whileHover: { y: -2, scale: 1.01 },
          transition: { type: "spring", stiffness: 300, damping: 20 },
        },
    [prefersReducedMotion],
  )



  return (
    <main className="mx-auto w-full max-w-4xl px-4 py-8 sm:py-10 md:py-12">
      <motion.section
        initial="hidden"
        animate="show"
        variants={containerVariants}
        className="grid gap-6"
        aria-labelledby="profile-heading"
      >
        <h1
          id="profile-heading"
          className="text-balance text-2xl font-semibold tracking-tight text-foreground sm:text-3xl"
        >
          Profile
        </h1>

        {/* Profile Card */}
        <Card className="border border-border bg-card">
          <CardHeader className="flex flex-row items-center gap-4">
            <div className="relative">
              <Avatar className="h-16 w-16 border">
                <AvatarImage
                  src={user?.profileImage || "/placeholder.svg?height=128&width=128&query=profile%20avatar"}
                  alt={user ? `${user?.name} avatar` : "User avatar"}
                />
                <AvatarFallback className="text-sm">{user?.name?.slice(0, 2)}</AvatarFallback>
              </Avatar>
            </div>
            <div className="flex-1">
              <div className="grid gap-2">
                <label htmlFor="name" className="text-sm font-medium text-muted-foreground">
                  Name
                </label>
                <Input
                  id="name"
                  value={user?.name}
                  readOnly
                  className="text-base font-medium"
                />
              </div>
            </div>
          </CardHeader>
          <CardContent className="grid gap-6">
            <div className="grid gap-2">
              <label htmlFor="bio" className="text-sm font-medium text-muted-foreground">
                Bio
              </label>
              <Textarea
                id="bio"
                value={user?.bio}
                readOnly
                placeholder="Tell us about yourself"
                rows={4}
              />
            </div>
          </CardContent>
        </Card>

        {/* Posts list */}
        <section aria-labelledby="posts-heading" className="grid gap-4">
          <h2 id="posts-heading" className="text-lg font-semibold tracking-tight text-foreground">
            Your Posts
          </h2>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {posts?.map((p) => (
              <motion.div key={p?._id} {...cardHover}>
                <Card className="h-full border border-border bg-card">
                  <CardHeader>
                    <CardTitle className="text-base font-semibold text-foreground">{p.title}</CardTitle>
                  </CardHeader>
                  <CardContent className="grid gap-3">
                    <div className="flex flex-wrap items-center gap-2">
                      {p.tags.map((t) => (
                        <span
                          key={t}
                          className="rounded-md border border-border px-2 py-0.5 text-xs text-muted-foreground"
                        >
                          #{t}
                        </span>
                      ))}
                    </div>
                    <p className="text-sm text-muted-foreground">Created {formatDate(p.createdAt)}</p>
                  </CardContent>
                  <CardFooter className="flex items-center gap-2">
                    <Link to={`/post/${p._id}`}>
                      <Button
                        variant="outline"
                        size="sm"
                      >
                        Check it out
                      </Button>
                    </Link>
                  </CardFooter>
                </Card>
              </motion.div>
            ))}
          </div>
        </section>
      </motion.section>
    </main>
  )
}
