"use client"

import { useState } from "react"
import {Link} from "react-router-dom"
import { motion } from "framer-motion"
import { Eye, EyeOff } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"

export default function Login() {
  const [form, setForm] = useState({ email: "", password: "" })
  const [errors, setErrors] = useState({})
  const [showPassword, setShowPassword] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  function onChange(e) {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  function validate(values) {
    const next = {}
    if (!values.email.trim()) next.email = "Email is required."
    if (!values.password) next.password = "Password is required."
    return next
  }

  async function onSubmit(e) {
    e.preventDefault()
    const v = validate(form)
    setErrors(v)
    if (Object.keys(v).length > 0) return
    try {
      setSubmitting(true)
      // Mock login call
      console.log("[v0] Login submit:", { email: form.email, password: "•••" })
      await new Promise((r) => setTimeout(r, 700))
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div
      className="
        min-h-screen w-full
        bg-gradient-to-b
        from-[hsl(var(--accent))/0.12]
        via-[hsl(var(--background))]
        to-[hsl(var(--background))]
        flex items-center justify-center p-4
      "
    >
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
        className="w-full max-w-md"
      >
        <Card className="shadow-lg border-border">
          <CardHeader className="space-y-1 text-center">
            {/* Decorative mark for visual consistency */}
            <div
              aria-hidden="true"
              className="mx-auto mb-2 h-10 w-10 rounded-full bg-[hsl(var(--accent))/0.2] ring-1 ring-[hsl(var(--accent))]/30"
            />
            <CardTitle className="text-2xl font-semibold text-balance">Welcome back</CardTitle>
            <CardDescription className="text-pretty">
              Log in to continue writing and exploring new posts.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={onSubmit} className="grid gap-4">
              {/* Email */}
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="you@example.com"
                  value={form.email}
                  onChange={onChange}
                  aria-invalid={Boolean(errors.email) || undefined}
                  aria-describedby={errors.email ? "email-error" : undefined}
                />
                {errors.email ? (
                  <p id="email-error" className="text-sm text-red-600">
                    {errors.email}
                  </p>
                ) : null}
              </div>

              {/* Password with visibility toggle */}
              <div className="grid gap-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={form.password}
                    onChange={onChange}
                    aria-invalid={Boolean(errors.password) || undefined}
                    aria-describedby={errors.password ? "password-error" : undefined}
                    className="pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((v) => !v)}
                    className="absolute inset-y-0 right-2 flex items-center text-muted-foreground hover:text-foreground"
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
                {errors.password ? (
                  <p id="password-error" className="text-sm text-red-600">
                    {errors.password}
                  </p>
                ) : null}
                <div className="flex justify-end">
                  <Link to="/forgot-password" className="text-sm underline underline-offset-4 hover:text-foreground">
                    Forgot password?
                  </Link>
                </div>
              </div>

              {/* Submit */}
              <Button type="submit" className="w-full" disabled={submitting}>
                {submitting ? "Logging in..." : "Login"}
              </Button>

              {/* Signup link */}
              <p className="text-center text-sm text-muted-foreground">
                {"Don’t have an account? "}
                <Link to="/signup" className="underline underline-offset-4 hover:text-foreground">
                  Sign up
                </Link>
              </p>
            </form>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}
