/* filename: components/testimonials.jsx */
"use client"

import { motion, useReducedMotion } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"
import { InfiniteMovingCards } from "./ui/infinite-moving-cards"

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.08 },
  },
}

const item = {
  hidden: { opacity: 0, y: 12 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" } },
}

const testimonials = [
  {
    name: "Ava Thompson",
    role: "Content Strategist",
    quote:
      "This platform helped me publish faster and write better. The AI suggestions feel like a thoughtful editor by my side.",
  },
  {
    name: "Liam Chen",
    role: "Technical Writer",
    quote:
      "Markdown + live preview + AI proofreading is a dream workflow. My drafts are cleaner and I ship more often.",
  },
  {
    name: "Sofia Martínez",
    role: "Founder, Storyline",
    quote: "Engagement has grown since moving our blog here. The reading experience and performance are top-notch.",
  },
]

export default function Testimonials() {
  const prefersReducedMotion = useReducedMotion()

  return (
    <section aria-labelledby="testimonials-heading" className="mx-auto max-w-6xl px-6 py-16 md:px-8 md:py-24">
      <div className="mb-8 md:mb-12">
        <h2 id="testimonials-heading" className="text-pretty text-2xl font-semibold tracking-tight md:text-3xl">
          Loved by writers and readers
        </h2>
        <p className="mt-2 text-muted-foreground leading-relaxed">
          Real stories from people publishing and discovering ideas every day.
        </p>
      </div>

      {prefersReducedMotion ? (
        <motion.div
          className="grid gap-4 md:grid-cols-2 lg:grid-cols-3"
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.2 }}
        >
          {testimonials.map((t, i) => (
            <motion.div key={i} variants={item}>
              <Card className="h-full rounded-2xl border bg-card/70 backdrop-blur supports-[backdrop-filter]:bg-card/60 transition-colors hover:bg-card">
                <CardContent className="p-6">
                  <div className="mb-4 flex items-center gap-3">
                    
                    <div>
                      <div className="font-medium leading-tight">{t.name}</div>
                      <div className="text-xs text-muted-foreground leading-tight">{t.role}</div>
                    </div>
                  </div>
                  <blockquote className="text-sm leading-relaxed text-foreground">
                    <span className="mr-2 select-none text-accent" aria-hidden="true">
                      “
                    </span>
                    {t.quote}
                    <span className="ml-1 select-none text-accent" aria-hidden="true">
                      ”
                    </span>
                  </blockquote>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      ) : (
        <InfiniteMovingCards
          items={testimonials.map((t) => ({
            quote: t.quote,
            name: t.name,
            title: t.role,
            avatarSrc: t.avatar || "/diverse-person-avatars.png",
          }))}
          direction="right"
          speed="normal"
          pauseOnHover={true}
          className="py-2"
          titleId="testimonials-heading"
        />
      )}
    </section>
  )
}
