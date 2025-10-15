import Post from "../components/Post"
import { Spinner } from "@/components/ui/spinner"
import React from "react"
import { useFeed } from "../store/useFeed"
import { usePostStore } from "../store/usePostStore"
import { useEffect } from "react"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"

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

const Feed = () => {
  const { query } = useFeed();
  const { feed, getFeed, isLoadingFeed ,searchPosts} = usePostStore()


  useEffect(() => {
    const fetchFeed = async () => {
      await getFeed();
    };
    fetchFeed();
  }, [getFeed])

  if (isLoadingFeed) {
    return (
      <div className="w-full flex h-100vh justify-center">
        <Spinner />
      </div>
    )
  }

  return (
    <section aria-label="Feed" className="mx-auto max-w-3xl space-y-6">
      {feed.map((p) => {
        const summary = p.content.slice(0, 200) + (p.content.length > 200 ? "…" : "")
        return (
          <Post
            key={p._id}
            id={p._id}
            title={p.title}
            tags={p.tags}
            userId={p.user._id}
            author={p.user.name}
            summary={p.summary}
            content={p.content}
            initialLikes={p.likes}
            initialComments={p.comments}
          />
        )
      })}
      {feed.length === 0 && (
        <Card className="bg-card/70">
          <CardContent className="p-6 text-sm text-muted-foreground">
            No posts match “{query}”. Try a different search.
          </CardContent>
        </Card>
      )}
    </section>
  )
}

export default Feed