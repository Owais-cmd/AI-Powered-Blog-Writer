"use client"

import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import {Link} from "react-router-dom"
import { motion, useReducedMotion } from "framer-motion"

import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {useAuthStore} from "../store/useAuthStore"
import {usePostStore} from "../store/usePostStore"
import {Spinner} from "@/components/ui/spinner"
import toast from "react-hot-toast"

function formatDate(isoString) {
  const d = new Date(isoString)
  if (isNaN(d.getTime())) return ""
  return d.toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" })
}


export default function Profile() {
  const prefersReducedMotion = useReducedMotion()
const {user,update, isUpdating}=useAuthStore();
  // Mocked profile data
  const [name, setName] = useState(user?.name)
  const [bio, setBio] = useState(user?.bio || "")
  const [avatarUrl, setAvatarUrl] = useState(user?.profileImage)
  const lastObjectUrlRef = useRef(null)
  const {isLoadingPosts, myposts,isDeleting,getMyPosts,deletePost} = usePostStore()
  
  useEffect(() => {
    async function fetchPosts() {
     await getMyPosts();
    }
    fetchPosts()
    return () => {
      if (lastObjectUrlRef.current) {
        URL.revokeObjectURL(lastObjectUrlRef.current)
      }
    }
  }, [getMyPosts])

  // Avatar upload
  const fileInputRef = useRef(null)
  const onChangeAvatar = useCallback((e) => {
    const file = e.target.files?.[0]
    ///
		if (file) {
			const reader = new FileReader();
			reader.onload = () => {
				setAvatarUrl(reader.result);
			};
			reader.readAsDataURL(file);
		}
  }, [])


  const onUpdateProfile = useCallback(() => {
    update({name,bio,profileImage:avatarUrl});
  }, [name, bio, avatarUrl])

  const onDeletePost = async(postId) => {
    await deletePost(postId);
    toast.success("Post deleted")
  }

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

  if(isLoadingPosts){
   
    return <div className='w-full h-screen flex items-center justify-center'>
      <Spinner />
    </div>
  
  }


  return (
    <main className="mx-auto w-full max-w-4xl px-4 py-4 sm:py-10 md:py-4">
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
                  src={avatarUrl || "/placeholder.svg?height=128&width=128&query=profile%20avatar"}
                  alt={name ? `${name} avatar` : "User avatar"}
                />
                <AvatarFallback className="text-sm">{name.slice(0,2)}</AvatarFallback>
              </Avatar>
              <Button
                type="button"
                variant="secondary"
                size="sm"
                className="absolute -bottom-2 left-[-0.5px] rounded-full border border-border bg-foreground backdrop-blur"
                onClick={() => fileInputRef.current?.click()}
                aria-label="Change avatar"
              >
                Change
              </Button>
              <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={onChangeAvatar} />
            </div>
            <div className="flex-1">
              <div className="grid gap-2">
                <label htmlFor="name" className="text-sm font-medium text-muted-foreground">
                  Name
                </label>
                <Input
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Your name"
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
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                placeholder="Tell us about yourself"
                rows={4}
              />
            </div>
          </CardContent>
          <CardFooter className="flex justify-end">
            <Button type="button" onClick={onUpdateProfile} className="font-medium" disabled={isUpdating}>
              {isUpdating ? "Updating..." : "Update"}
            </Button>
          </CardFooter>
        </Card>

        {/* Posts list */}
        <section aria-labelledby="posts-heading" className="grid gap-4">
          <h2 id="posts-heading" className="text-lg font-semibold tracking-tight text-foreground">
            Your Posts
          </h2>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {myposts.map((p) => (
              <motion.div key={p._id} {...cardHover}>
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
                    <Button variant="destructive" onClick={() => onDeletePost(p._id)} disabled={isDeleting}>
                      {isDeleting?'Deleting...':"Delete"}
                    </Button>
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
