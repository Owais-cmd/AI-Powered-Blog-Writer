/* filename: src/pages/LandingPage.jsx */
"use client"

import { motion } from "framer-motion"
//import Link from "next/link"
import { Link } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import FeatureCard from "../components/Card"
import LightRays from '../components/LightRays';
import { ModeToggle } from "../components/Mode_toggle"
import Testimonials from "../components/InfiniteMovingCards"

const fadeInUp = {
    initial: { opacity: 0, y: 24 },
    whileInView: { opacity: 1, y: 0 },
    transition: { duration: 0.6, ease: "easeOut" },
}

export default function LandingPage() {
    return (
        <div className="min-h-dvh bg-background text-foreground">
            <header className="">
                <div className="mx-auto max-w-6xl px-6 py-4 md:px-8">
                    <nav className="flex items-center justify-between">
                        <Link to="/" className="font-semibold tracking-tight">
                            <span className="sr-only">AI Blog Home</span>
                            <span aria-hidden="true">AI Blog</span>
                        </Link>
                        <div className="flex items-center gap-2">
                            <Button asChild variant="ghost" className="hover:bg-accent/20">
                                <Link
                                    to="/login"
                                    className="focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent rounded-md"
                                >
                                    Login
                                </Link>
                            </Button>
                            <Button asChild className="bg-accent text-accent-foreground hover:bg-accent/90">
                                <Link
                                    to="/signin"
                                    className="focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent rounded-md"
                                >
                                    Sign Up
                                </Link>
                            </Button>
                            <ModeToggle />
                        </div>
                    </nav>
                </div>
            </header>

            <main>
                <div className="border-b " style={{ width: '100%', height: '100vh', position: 'absolute', top: "0px", left: "0px", pointerEvents: "none" }}>
                    <LightRays
                        raysOrigin="top-center"
                        raysColor="#00ffff"
                        raysSpeed={1.5}
                        lightSpread={0.8}
                        rayLength={1.2}
                        followMouse={true}
                        mouseInfluence={0.1}
                        noiseAmount={0.1}
                        distortion={0.05}
                        className="custom-rays"
                    />
                </div>
                {/* Hero */}
                <section className="mx-auto max-w-6xl px-6 py-16 md:px-8 md:py-24 mb-15">

                    <div className="grid items-center gap-10 md:grid-cols-2">
                        <motion.div
                            initial={fadeInUp.initial}
                            whileInView={fadeInUp.whileInView}
                            viewport={{ once: true, amount: 0.3 }}
                            transition={fadeInUp.transition}
                        >
                            <h1 className="text-pretty text-4xl font-bold leading-tight tracking-tight md:text-5xl">
                                A modern AI-powered blog platform
                            </h1>
                            <p className="mt-4 text-muted-foreground leading-relaxed md:text-lg">
                                Write with Markdown, polish with AI, and share your ideas with a vibrant community. Beautifully crafted,
                                blazingly fast, and accessible by default.
                            </p>

                            <div className="mt-8 flex flex-wrap items-center gap-3">
                                <Button asChild size="lg" className="bg-accent text-accent-foreground hover:bg-accent/90">
                                    <Link
                                        to="/signin"
                                        className="focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent rounded-md"
                                    >
                                        Get Started
                                    </Link>
                                </Button>
                                <Button
                                    asChild
                                    size="lg"
                                    variant="outline"
                                    className="border-accent text-foreground hover:bg-accent/10 bg-transparent"
                                >
                                    <Link
                                        to="/login"
                                        className="focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent rounded-md"
                                    >
                                        Sign In
                                    </Link>
                                </Button>
                            </div>
                        </motion.div>

                        <motion.div
                            className="order-first md:order-none"
                            initial={{ opacity: 0, scale: 0.96 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true, amount: 0.3 }}
                            transition={{ duration: 0.6, ease: "easeOut" }}
                        >
                            <Card className="rounded-2xl border-none  dark:border-border dark:bg-card shadow-sm ">
                                <img
                                    src="/hero.png"
                                    alt="Screenshot of the AI Blog editor interface"
                                    className="h-80 w-full rounded-2xl object-cover "
                                />
                            </Card>
                        </motion.div>
                    </div>
                </section>

                {/* Features */}
                <section className="mx-auto pt-10 max-w-6xl px-6 pb-16 md:px-8 md:pb-24 ">
                    <motion.div
                        className="mb-10"
                        initial={{ opacity: 0, y: 16 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, amount: 0.2 }}
                        transition={{ duration: 0.6, ease: "easeOut" }}>
                        <h2 className="text-center text-3xl font-bold tracking-tight md:text-4xl">Features</h2>
                    </motion.div>
                    <motion.div
                        className="grid gap-4 md:grid-cols-2 lg:grid-cols-4"
                        initial="hidden"
                        whileInView="show"
                        viewport={{ once: true, amount: 0.2 }}
                    >
                        <motion.div
                            variants={{
                                hidden: { opacity: 0, y: 16 },
                                show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" } },
                            }}
                        >
                            <FeatureCard
                                title="Write with Markdown"
                                description="Compose posts quickly with clean Markdown syntax and live preview."
                            />
                        </motion.div>
                        <motion.div
                            variants={{
                                hidden: { opacity: 0, y: 16 },
                                show: { opacity: 1, y: 0, transition: { duration: 0.45, ease: "easeOut", delay: 0.05 } },
                            }}
                        >
                            <FeatureCard
                                title="Proofread with AI"
                                description="Level up your writing with AI-powered proofreading and tone suggestions."
                            />
                        </motion.div>
                        <motion.div
                            variants={{
                                hidden: { opacity: 0, y: 16 },
                                show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut", delay: 0.1 } },
                            }}
                        >
                            <FeatureCard
                                title="Discover Posts"
                                description="Find trending topics and curate your feed with smart discovery."
                            />
                        </motion.div>
                        <motion.div
                            variants={{
                                hidden: { opacity: 0, y: 16 },
                                show: { opacity: 1, y: 0, transition: { duration: 0.55, ease: "easeOut", delay: 0.15 } },
                            }}
                        >
                            <FeatureCard
                                title="Engage with Community"
                                description="Follow authors, comment, and collaborate in an inclusive space."
                            />
                        </motion.div>
                    </motion.div>
                </section>
                <section className="border-t">
                    <Testimonials />
                </section>
                
            </main>

            <footer className="border-t">
                <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-6 py-8 text-sm text-muted-foreground md:flex-row md:px-8">
                    <p>© {new Date().getFullYear()} AI Blog. All rights reserved.</p>
                    <nav className="flex items-center gap-6">
                        <Link
                            to="#"
                            className="hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent rounded-md px-1"
                        >
                            About
                        </Link>
                        <Link
                            to="#"
                            className="hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent rounded-md px-1"
                        >
                            Terms
                        </Link>
                        <Link
                            to="#"
                            className="hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent rounded-md px-1"
                        >
                            Privacy
                        </Link>
                    </nav>
                </div>
            </footer>
        </div>
    )
}
