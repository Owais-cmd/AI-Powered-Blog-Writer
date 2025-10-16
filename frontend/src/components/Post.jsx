import React, { useEffect } from "react"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { AvatarImage, Avatar, AvatarFallback } from "@/components/ui/avatar"
import { motion } from "framer-motion"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Heart, MessageCircle } from "lucide-react"
import { Textarea } from "@/components/ui/textarea"
import { Link } from "react-router-dom"
import { usePostStore } from "../store/usePostStore"
import { useAuthStore } from "../store/useAuthStore"
import { toast } from "react-hot-toast"
import { useCommentStore } from "../store/useCommentStore"

export default function Post({ id, title, tags, userId, author, summary, content, initialLikes, initialComments = [] }) {
  const [expanded, setExpanded] = React.useState(false)
  const { addComment, isAdding, getCommentsByPost, isLoadingComments } = useCommentStore();
  const { user } = useAuthStore();
  const [comments, setComments] = React.useState(initialComments);
  const [liked, setLiked] = React.useState(false)
  const [likes, setLikes] = React.useState(initialLikes.length || 0)
  const [newComment, setNewComment] = React.useState("")
  const { likePost } = usePostStore()

  useEffect(() => {
    if (user?._id) {
      const isLiked = initialLikes.some(
        (like) => like._id === user._id // ✅ compare by _id
      );
      if (id) {
        async function getComments() {
          const temp = await getCommentsByPost(id);
          setComments(temp);

        }
        getComments();
      }

      setLiked(isLiked);
    }
  }, [user?._id])

  const toggleLike = React.useCallback(() => {
    if (userId === user?._id) {
      toast.error("You cannot like your own post.")
      return;
    }
    likePost(id, user._id);
    setLikes((count) => (liked ? count - 1 : count + 1))
    setLiked((v) => !v)
  }, [liked])

   const handleAddComment = React.useCallback(async() => {
    const text = newComment.trim()
    if (!text) return
    const temp = await addComment({ content: text, post: id, user: user._id });
    toast.success("Comment added successfully")
    setComments([temp, ...comments]);
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
          <Link to={`/profile/${author}`}><div className="text-sm text-muted-foreground">By {author}</div></Link>
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
            <Link to={`/post/${id}`}>
              <Button
                variant="outline"
                size="sm"
                aria-expanded={expanded}
              >
                Check it out
              </Button>
            </Link>
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
                      <div key={c._id} className="flex items-start gap-3">
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={c.user.profileImage} alt="User avatar" />
                          <AvatarFallback className="bg-accent/15 text-foreground">
                            {c.user.author?.slice(0, 2).toUpperCase() || "YY"}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="text-sm font-medium">{c.user.name || "You"}</div>
                          <div className="text-sm text-foreground/90 leading-relaxed">{c.content}</div>
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
                  <Button onClick={handleAddComment} className="sm:self-start" aria-label="Add comment" disabled={isAdding}>
                    {isAdding ? "Adding..." : "Add Comment"}
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