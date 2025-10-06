"use client"
import { Card, CardDescription,CardHeader,CardTitle,CardFooter } from "./card"

function ItemCard({ quote, name, title }) {
  return (
     <Card className="h-full rounded-2xl border w-90  transition-transform duration-200 hover:-translate-y-0.5 hover:shadow-sm">
          <CardHeader className="space-y-2">
            <CardTitle className="text-base md:text-lg">{quote}</CardTitle>
            <CardDescription className="text-sm leading-relaxed text-muted-foreground">
              {name} - {title}
            </CardDescription>
          </CardHeader>
          
      </Card>
  )
}

/**
 * items: Array<{ quote: string, name: string, title: string, avatarSrc?: string }>
 * direction: "right" | "left"
 * speed: "slow" | "normal" | "fast"
 * pauseOnHover: boolean
 */
export function InfiniteMovingCards({
  items = [],
  direction = "right",
  speed = "normal",
  pauseOnHover = true,
  className = "",
  titleId,
}) {
  const duration = speed === "fast" ? 20 : speed === "slow" ? 60 : 35

  return (
    <div
      className={`group relative overflow-hidden ${className}`}
      aria-labelledby={titleId}
      // Mask fade on edges for nicer loop
      style={{
        WebkitMaskImage: "linear-gradient(to right, transparent, black 10%, black 90%, transparent)",
        maskImage: "linear-gradient(to right, transparent, black 10%, black 90%, transparent)",
      }}
    >
      <div
        className={`marquee-track flex gap-4 will-change-transform`}
        style={{
          animation: `${direction === "right" ? "marquee-right" : "marquee-left"} ${duration}s linear infinite`,
          // The track contains two copies for seamless looping
        }}
      >
        {/* First copy */}
        <div className="flex gap-4">
          {items.map((item, idx) => (
            <ItemCard key={`a-${idx}`} {...item} />
          ))}
        </div>
        {/* Second copy */}
        <div className="flex gap-4">
          {items.map((item, idx) => (
            <ItemCard key={`b-${idx}`} {...item} />
          ))}
        </div>
      </div>

      <style jsx='true'>{`
        @keyframes marquee-right {
          0% {
            transform: translateX(-50%);
          }
          100% {
            transform: translateX(0%);
          }
        }
        @keyframes marquee-left {
          0% {
            transform: translateX(0%);
          }
          100% {
            transform: translateX(-50%);
          }
        }
        /* Pause on hover for better UX */
        .group:hover .marquee-track {
          ${pauseOnHover ? "animation-play-state: paused;" : ""}
        }

        /* Respect reduced motion */
        @media (prefers-reduced-motion: reduce) {
          .marquee-track {
            animation: none !important;
          }
        }
      `}</style>
    </div>
  )
}
