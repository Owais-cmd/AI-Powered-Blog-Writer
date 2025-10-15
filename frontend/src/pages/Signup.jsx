"use client"

import { useState } from "react"
import {Link} from "react-router-dom"
import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { useAuthStore } from "../store/useAuthStore"

export default function Signup() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirm: "",
    agree: false,
  })
  const [errors, setErrors] = useState({})
  const [submitting, setSubmitting] = useState(false)
  const {isSigningUp, signup} = useAuthStore();

  function validate(values) {
    const next = {}
    if (!values.name.trim()) next.name = "Name is required."
    if (!values.email.trim()) {
      next.email = "Email is required."
    } else if (!/^\S+@\S+\.\S+$/.test(values.email)) {
      next.email = "Enter a valid email."
    }
    if (!values.password) next.password = "Password is required."
    if (!values.confirm) next.confirm = "Please confirm your password."
    if (values.password && values.confirm && values.password !== values.confirm) {
      next.confirm = "Passwords do not match."
    }
    if (!values.agree) next.agree = "You must agree to the Terms."
    return next
  }

  function onChange(e) {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  function onToggleAgree(checked) {
    setForm((prev) => ({ ...prev, agree: Boolean(checked) }))
  }

  async function onSubmit(e) {
    e.preventDefault()
    const v = validate(form)
    setErrors(v)
    if (Object.keys(v).length > 0) return
    try {
      signup({name:form.name,email:form.email,password:form.password}); 
    }catch (error) {
      console.log(error);
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
            {/* Logo/mark */}
            <div
              aria-hidden="true"
              className="mx-auto mb-2 h-10 w-10 rounded-full bg-[hsl(var(--accent))/0.2] ring-1 ring-[hsl(var(--accent))]/30"
            />
            <CardTitle className="text-2xl font-semibold text-balance">Join our community</CardTitle>
            <CardDescription className="text-pretty">
              Create an account to start writing and sharing your stories.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={onSubmit} className="grid gap-4">
              {/* Name */}
              <div className="grid gap-2">
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  name="name"
                  type="text"
                  placeholder="Jane Doe"
                  value={form.name}
                  onChange={onChange}
                  aria-invalid={Boolean(errors.name) || undefined}
                  aria-describedby={errors.name ? "name-error" : undefined}
                />
                {errors.name ? (
                  <p id="name-error" className="text-sm text-red-600">
                    {errors.name}
                  </p>
                ) : null}
              </div>

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

              {/* Password */}
              <div className="grid gap-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  placeholder="••••••••"
                  value={form.password}
                  onChange={onChange}
                  aria-invalid={Boolean(errors.password) || undefined}
                  aria-describedby={errors.password ? "password-error" : undefined}
                />
                {errors.password ? (
                  <p id="password-error" className="text-sm text-red-600">
                    {errors.password}
                  </p>
                ) : null}
              </div>

              {/* Confirm Password */}
              <div className="grid gap-2">
                <Label htmlFor="confirm">Confirm Password</Label>
                <Input
                  id="confirm"
                  name="confirm"
                  type="password"
                  placeholder="••••••••"
                  value={form.confirm}
                  onChange={onChange}
                  aria-invalid={Boolean(errors.confirm) || undefined}
                  aria-describedby={errors.confirm ? "confirm-error" : undefined}
                />
                {errors.confirm ? (
                  <p id="confirm-error" className="text-sm text-red-600">
                    {errors.confirm}
                  </p>
                ) : null}
              </div>

              {/* Terms */}
              <div className="flex items-start gap-3">
                <Checkbox
                  id="agree"
                  checked={form.agree}
                  onCheckedChange={onToggleAgree}
                  aria-invalid={Boolean(errors.agree) || undefined}
                  aria-describedby={errors.agree ? "agree-error" : undefined}
                />
                <div className="space-y-1">
                  <Label htmlFor="agree" className="font-normal">
                    I agree to the Terms and Conditions
                  </Label>
                  {errors.agree ? (
                    <p id="agree-error" className="text-sm text-red-600">
                      {errors.agree}
                    </p>
                  ) : null}
                </div>
              </div>

              {/* Submit */}
              <Button type="submit" className="w-full" disabled={submitting}>
                {submitting ? "Signing up..." : "Sign Up"}
              </Button>

              {/* Login link */}
              <p className="text-center text-sm text-muted-foreground">
                {"Already have an account? "}
                <Link to="/login" className="underline underline-offset-4 hover:text-foreground">
                  Log in
                </Link>
              </p>
            </form>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}
