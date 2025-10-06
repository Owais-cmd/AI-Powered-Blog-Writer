"use client"

import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"

export default function FeatureCard({ title, description }) {
  return (
    <Card className="h-full rounded-2xl border  transition-transform duration-200 hover:-translate-y-0.5 hover:shadow-sm">
      <CardHeader className="space-y-2">
        <CardTitle className="text-base md:text-lg">{title}</CardTitle>
        <CardDescription className="text-sm leading-relaxed text-muted-foreground">{description}</CardDescription>
      </CardHeader>
    </Card>
  )
}
