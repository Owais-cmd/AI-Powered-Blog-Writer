"use client"

import React from "react"
import { motion } from "framer-motion"
import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"
import { Sparkles, Eye, Send, X, Tag } from "lucide-react"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { usePostStore } from "../store/usePostStore"
import { toast } from "react-hot-toast"
// Simple, stubbed "grammar issues" dictionary.
// We treat these as suspicious tokens to underline in preview when proofread is active.
const SUSPICIOUS_TOKENS = [
  "teh",
  "alot",
  "recieve",
  "definately",
  "seperate",
  "occured",
  "untill",
  "wich",
  "becuase",
  "adress",
  "wierd",
  "very",
  "really",
  "basically",
]



// Highlight suspicious tokens with a red dotted underline in preview.
// We apply this to common text containers in ReactMarkdown via components prop.
function highlightText(text, proofreadActive) {
  if (!proofreadActive || !text) return text

  // Split on word boundaries to preserve punctuation spacing
  return text.split(/(\b)/).map((chunk, idx) => {
    const lower = chunk.toLowerCase()
    if (SUSPICIOUS_TOKENS.includes(lower)) {
      return (
        <span
          key={idx}
          className="underline decoration-red-500/80 decoration-dotted underline-offset-4"
          title="Possible issue (mock)"
        >
          {chunk}
        </span>
      )
    }
    return <React.Fragment key={idx}>{chunk}</React.Fragment>
  })
}

export default function CreatePost() {
  const [title, setTitle] = React.useState("")
  const [content, setContent] = React.useState(`# Welcome to your new post
  
Write your content in Markdown. Use **bold**, _italics_, lists, and more.

- Use Tabs on mobile to switch between editor and preview
- On larger screens, you will see a side-by-side two-pane layout

Happy writing!`)
  const [activeTab, setActiveTab] = React.useState("editor")
  const [proofreadActive, setProofreadActive] = React.useState(false)
  const [coverImageUrl, setCoverImageUrl] = React.useState(null)
  const [dragActive, setDragActive] = React.useState(false)
  const fileInputRef = React.useRef(null)
  const {createPost, isCreatingPost} = usePostStore();
  // Cover image helpers (FileReader preview, DnD)
  function handleFiles(files) {
    const file = files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => {
      setCoverImageUrl(reader.result)
    }
    reader.readAsDataURL(file)
  }

  function onFileChange(e) {
    handleFiles(e.target.files)
  }

  function onDragOver(e) {
    e.preventDefault()
    setDragActive(true)
  }

  function onDragLeave(e) {
    e.preventDefault()
    setDragActive(false)
  }

  function onDrop(e) {
    e.preventDefault()
    setDragActive(false)
    handleFiles(e.dataTransfer?.files)
  }

  function removeCoverImage() {
    setCoverImageUrl(null)
    if (fileInputRef.current) fileInputRef.current.value = ""
  }
 


  function onProofread() {
    // Mock: toggles proofread state so preview underlines suspicious words.
    setProofreadActive(true)
  }

  function onPreview() {
    setActiveTab("preview")
  }

  async function onPublish() {
    await createPost({title, content, image: coverImageUrl});
    toast.success("Post published!")
    // Clear form
    setTitle("")
    setContent("")
    setCoverImageUrl(null)
    setProofreadActive(false)
    setActiveTab("editor")
  }

  // AceternityUI-inspired micro-animations
  const cardVariants = {
    hidden: { opacity: 0, y: 8 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.28, ease: "easeOut" } },
  }

  const buttonWhileHover = { scale: 1.02 }
  const buttonWhileTap = { scale: 0.98 }

  return (
    <main className="min-h-[calc(100vh-4rem)] py-4 px-4 md:py-4 ">
      <motion.div initial="hidden" animate="visible" variants={cardVariants} className="mx-auto w-full max-w-4xl">
        <Card className="border-border/50 shadow-theme">
          <CardHeader className="space-y-2">
            <CardTitle className="text-balance text-2xl font-semibold tracking-tight">Create a New Post</CardTitle>
            <CardDescription className="text-pretty">
              Draft, proofread, and preview your post before publishing. Tags help readers discover your content.
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-6">
            {/* Cover Image */}
            <div className="space-y-2">
              <Label htmlFor="cover" className="text-sm font-medium text-foreground/80">
                Cover Image
              </Label>

              {coverImageUrl ? (
                <div className="rounded-lg border border-border/60 bg-card p-3">
                  <img
                    src={coverImageUrl || "/placeholder.svg"}
                    alt="Cover image preview"
                    className="h-48 w-full rounded-md object-cover shadow-sm sm:h-64"
                  />
                  <div className="mt-3 flex items-center gap-2">
                    <Button variant="outline" type="button" onClick={removeCoverImage}>
                      Remove Image
                    </Button>
                    <Button variant="secondary" type="button" onClick={() => fileInputRef.current?.click()}>
                      Change
                    </Button>
                  </div>
                </div>
              ) : (
                <label
                  htmlFor="cover"
                  onDragOver={onDragOver}
                  onDragLeave={onDragLeave}
                  onDrop={onDrop}
                  className={[
                    "flex cursor-pointer flex-col items-center justify-center gap-2 rounded-lg border border-dashed px-6 py-8 text-center transition-colors",
                    "border-border/70 bg-accent hover:border-primary/40",
                    dragActive ? "border-primary/60 bg-accent/10" : "",
                  ].join(" ")}
                >
                  <div className="text-sm text-muted-foreground">
                    Drag and drop an image here, or click to select a file.
                  </div>
                  <div className="text-xs text-muted-foreground/80">PNG, JPG, or WEBP up to ~5MB</div>
                </label>
              )}

              <Input
                id="cover"
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={onFileChange}
                className="hidden"
                aria-label="Upload cover image"
              />
            </div>

            {/* Title */}
            <div className="space-y-2">
              <label htmlFor="title" className="text-sm font-medium text-foreground/80">
                Title
              </label>
              <Input
                id="title"
                placeholder="A concise, compelling title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="h-12 text-lg font-semibold"
                aria-label="Post title"
              />
            </div>

            {/* Actions */}
            <div className="flex flex-wrap items-center gap-2">
              <motion.div whileHover={buttonWhileHover} whileTap={buttonWhileTap}>
                <Button variant="secondary" onClick={onProofread}>
                  <Sparkles className="mr-2 size-4" />
                  Proofread
                </Button>
              </motion.div>

              <motion.div whileHover={buttonWhileHover} whileTap={buttonWhileTap}>
                <Button variant="outline" onClick={onPreview}>
                  <Eye className="mr-2 size-4" />
                  Preview
                </Button>
              </motion.div>

              <motion.div whileHover={buttonWhileHover} whileTap={buttonWhileTap} className="ml-auto">
                <Button onClick={onPublish} disabled={isCreatingPost}>
                  <Send className="mr-2 size-4" />
                  {isCreatingPost ? "Publishing..." : "Publish"}
                </Button>
              </motion.div>
            </div>

            {/* Mobile: Tabs for Editor/Preview */}
            <div className="md:hidden">
              <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="editor">Editor</TabsTrigger>
                  <TabsTrigger value="preview">Preview</TabsTrigger>
                </TabsList>
                <TabsContent value="editor" className="space-y-2">
                  <div className=" border-2  rounded-md  ">
                    <label htmlFor="content-mobile" className="sr-only">
                    Editor content
                  </label>
                  <Textarea
                    id="content-mobile"
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    className="min-h-[260px] resize-y"
                    placeholder="Write your post in Markdown..."
                    aria-label="Markdown editor"
                  />
                  </div>
                  
                </TabsContent>
                <TabsContent value="preview" className="space-y-2">
                  <div className="rounded-md border border-border/60 bg-card p-4">
                    <ReactMarkdown
                      remarkPlugins={[remarkGfm]}
                      components={{
                        p: ({ node, children }) => (
                          <p>
                            {Array.isArray(children)
                              ? children.map((child, i) =>
                                  typeof child === "string" ? highlightText(child, proofreadActive) : child,
                                )
                              : typeof children === "string"
                                ? highlightText(children, proofreadActive)
                                : children}
                          </p>
                        ),
                        li: ({ node, children }) => (
                          <li>
                            {Array.isArray(children)
                              ? children.map((child, i) =>
                                  typeof child === "string" ? highlightText(child, proofreadActive) : child,
                                )
                              : typeof children === "string"
                                ? highlightText(children, proofreadActive)
                                : children}
                          </li>
                        ),
                        h1: ({ children }) => <h1 className="mt-6 text-3xl font-bold">{children}</h1>,
                        h2: ({ children }) => <h2 className="mt-5 text-2xl font-semibold">{children}</h2>,
                        h3: ({ children }) => <h3 className="mt-4 text-xl font-semibold">{children}</h3>,
                        code: ({ children }) => (
                          <code className="rounded bg-muted px-1.5 py-0.5 text-sm">{children}</code>
                        ),
                        a: (props) => <a {...props} className="text-primary underline underline-offset-4" />,
                      }}
                    >
                      {content}
                    </ReactMarkdown>
                  </div>
                  {proofreadActive && (
                    <p className="text-xs text-muted-foreground">
                      Underlined words indicate potential issues (mocked).
                    </p>
                  )}
                </TabsContent>
              </Tabs>
            </div>

            {/* Desktop: Two-pane editor/preview */}
            <div className="hidden gap-4 md:grid md:grid-cols-2">
              <div className="flex flex-col">
                <label htmlFor="content" className="mb-2 text-sm font-medium text-foreground">
                  Editor
                </label>
                <Textarea
                  id="content"
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  className="min-h-[420px] resize-y bg-background"
                  placeholder="Write your post in Markdown..."
                  aria-label="Markdown editor"
                />
              </div>
              <div className="flex flex-col">
                <label className="mb-2 text-sm font-medium text-foreground/80">Live Preview</label>
                <div className="min-h-[420px] rounded-md border border-border/60 bg-card p-5">
                  <ReactMarkdown
                    remarkPlugins={[remarkGfm]}
                    components={{
                      p: ({ node, children }) => (
                        <p>
                          {Array.isArray(children)
                            ? children.map((child, i) =>
                                typeof child === "string" ? highlightText(child, proofreadActive) : child,
                              )
                            : typeof children === "string"
                              ? highlightText(children, proofreadActive)
                              : children}
                        </p>
                      ),
                      li: ({ node, children }) => (
                        <li>
                          {Array.isArray(children)
                            ? children.map((child, i) =>
                                typeof child === "string" ? highlightText(child, proofreadActive) : child,
                              )
                            : typeof children === "string"
                              ? highlightText(children, proofreadActive)
                              : children}
                        </li>
                      ),
                      h1: ({ children }) => <h1 className="mt-6 text-3xl font-bold">{children}</h1>,
                      h2: ({ children }) => <h2 className="mt-5 text-2xl font-semibold">{children}</h2>,
                      h3: ({ children }) => <h3 className="mt-4 text-xl font-semibold">{children}</h3>,
                      code: ({ children }) => (
                        <code className="rounded bg-muted px-1.5 py-0.5 text-sm">{children}</code>
                      ),
                      a: (props) => <a {...props} className="text-primary underline underline-offset-4" />,
                    }}
                  >
                    {content}
                  </ReactMarkdown>
                </div>
                {proofreadActive && (
                  <p className="mt-2 text-xs text-muted-foreground">
                    Underlined words indicate potential issues (mocked).
                  </p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </main>
  )
}
