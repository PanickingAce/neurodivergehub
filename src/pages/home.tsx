import { useState } from "react";
import {
  BookOpen, Utensils, BrainCircuit, Library,
  FileText, Settings, Moon, Sun, Contrast, Type,
  ExternalLink, Heart, User, ChevronRight, Gamepad2,
  CalendarDays, BookMarked, ArrowRight, Newspaper, ChefHat, Pencil
} from "lucide-react";
import { motion } from "framer-motion";
import { useTheme } from "@/contexts/theme-context";
import { useAccount } from "@/contexts/account-context";
import { AppCard } from "@/components/app-card";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useLocation } from "wouter";

// ─── EBOOK DATA ─── Edit entries here to update the ebook library ─────────────
const EBOOKS = [
  {
    id: 1,
    title: "The ADHD Advantage",
    author: "Dale Archer",
    description: "Reframes ADHD traits as core strengths. Practical and empowering.",
    tags: ["ADHD", "Non-Fiction"],
    amazonUrl: "https://www.amazon.com/s?k=The+ADHD+Advantage+Dale+Archer",
  },
  {
    id: 2,
    title: "Unmasking Autism",
    author: "Devon Price",
    description: "A compassionate, affirming guide to the autistic experience.",
    tags: ["Autism", "Identity"],
    amazonUrl: "https://www.amazon.com/s?k=Unmasking+Autism+Devon+Price",
  },
  {
    id: 3,
    title: "The Highly Sensitive Person",
    author: "Elaine N. Aron",
    description: "Essential reading for understanding and embracing hypersensitivity.",
    tags: ["HSP", "Sensory"],
    amazonUrl: "https://www.amazon.com/s?k=The+Highly+Sensitive+Person+Elaine+Aron",
  },
  {
    id: 4,
    title: "Scattered Minds",
    author: "Gabor Maté",
    description: "A compassionate exploration of ADHD — roots, impacts, and healing.",
    tags: ["ADHD", "Emotional Wellbeing"],
    amazonUrl: "https://www.amazon.com/s?k=Scattered+Minds+Gabor+Mate",
  },
  {
    id: 5,
    title: "Neurotribes",
    author: "Steve Silberman",
    description: "Award-winning history of autism and the neurodiversity movement.",
    tags: ["Autism", "History"],
    amazonUrl: "https://www.amazon.com/s?k=Neurotribes+Steve+Silberman",
  },
  {
    id: 6,
    title: "Smart but Stuck",
    author: "Thomas E. Brown",
    description: "How intelligent people with ADHD get stuck — and how to break free.",
    tags: ["ADHD", "Executive Function"],
    amazonUrl: "https://www.amazon.com/s?k=Smart+but+Stuck+Thomas+Brown",
  },
];

// ─── PLANNER TEMPLATES ─── Edit entries here to update planners ───────────────
const PLANNER_TEMPLATES = [
  {
    id: "adhd-daily",
    name: "ADHD Daily Planner",
    description: "Time blocks with built-in transition warnings and reward checkpoints.",
    features: ["Visual time blocks", "Priority ranking", "Reward tracker", "Energy check-ins"],
    amazonUrl: "https://www.amazon.com/s?k=ADHD+daily+planner+neurodivergent",
    badge: "Most popular",
  },
  {
    id: "autism-weekly",
    name: "Autism-Friendly Weekly",
    description: "Highly structured weekly layout with predictable sections and visual clarity.",
    features: ["Fixed routine sections", "Sensory notes column", "Transition warnings", "Weekly preview"],
    amazonUrl: "https://www.amazon.com/s?k=autism+friendly+weekly+planner",
    badge: "Structured",
  },
  {
    id: "spoon-theory",
    name: "Spoon Theory Planner",
    description: "Energy-based planning. Plan with your real capacity, not imaginary energy.",
    features: ["Daily spoon budget", "Task energy rating", "Rest slots built in", "Recovery tracker"],
    amazonUrl: "https://www.amazon.com/s?k=spoon+theory+planner+chronic+illness",
    badge: "Energy-based",
  },
  {
    id: "pda-friendly",
    name: "PDA-Friendly Planner",
    description: "Low-demand, choice-based planner. Options presented as possibilities, never commands.",
    features: ["Choice-based tasks", "No fixed order", "Autonomy-first design", "'Maybe today' section"],
    amazonUrl: "https://www.amazon.com/s?k=PDA+demand+avoidance+planner",
    badge: "Low-demand",
  },
  {
    id: "now-next-later",
    name: "Now / Next / Later",
    description: "Simple three-column format. No hours — just proximity.",
    features: ["Now / Next / Later columns", "No hourly grid", "Daily intentions", "End-of-day reflection"],
    amazonUrl: "https://www.amazon.com/s?k=now+next+later+planner+ADHD",
    badge: "Simple",
  },
  {
    id: "sensory-log",
    name: "Sensory & Wellbeing Journal",
    description: "Track daily sensory experiences, triggers, and coping strategies.",
    features: ["Sensory log", "Trigger tracker", "Coping notes", "Mood & energy scale"],
    amazonUrl: "https://www.amazon.com/s?k=sensory+journal+neurodivergent+wellbeing",
    badge: "Journal",
  },
];

// ─── BLOG ARTICLE PREVIEWS ─── Shown on home page ────────────────────────────
const BLOG_PREVIEWS = [
  { id: "not-broken", title: "You're not broken. You're wired differently.", tags: ["Identity", "Neurodivergence"] },
  { id: "adhd-time", title: "ADHD and time blindness: Why clocks feel like a foreign language.", tags: ["ADHD", "Executive Function"] },
  { id: "sensory-overload", title: "Sensory overload: When the world is just too loud.", tags: ["Sensory", "HSP"] },
];

export default function Home() {
  const { theme, setTheme, dyslexiaFont, setDyslexiaFont, reducedMotion } = useTheme();
  const { isLoggedIn, account } = useAccount();
  const [, setLocation] = useLocation();

  const tools = [
    {
      title: "MindMap",
      description: "Daily mood check-ins and personalised coping strategies. Track how you're feeling over time.",
      icon: <BrainCircuit className="w-8 h-8" />,
      tags: ["Mental Health", "Mood Tracking", "Coping Tools"],
      color: "primary" as const,
      href: "/mindmap",
    },
    {
      title: "SafePlate",
      description: "Food aversion tracker with safe, predictable recipe suggestions. No texture surprises.",
      icon: <Utensils className="w-8 h-8" />,
      tags: ["Food", "Aversions", "ARFID-Friendly"],
      color: "accent" as const,
      href: "/safeplate",
    },
    {
      title: "Calm Games",
      description: "Gentle activities for when you need to reset — breathing, word puzzles, colour matching.",
      icon: <Gamepad2 className="w-8 h-8" />,
      tags: ["Overstimulation", "Calming", "Regulation"],
      color: "secondary" as const,
      href: "/games",
    },
    {
      title: "My Planner",
      description: "Your personal online planner. Add tasks, set priorities, take scratch notes. Saved on your device.",
      icon: <CalendarDays className="w-8 h-8" />,
      tags: ["Planning", "Tasks", "Organisation"],
      color: "primary" as const,
      href: "/planner",
    },
    {
      title: "NeuroRead",
      description: "Book recommendations with sensory-safety ratings for ADHD, autism, and hypersensitivity.",
      icon: <BookOpen className="w-8 h-8" />,
      tags: ["Reading", "Sensory-Friendly"],
      color: "accent" as const,
      href: "/neuroread",
    },
    {
      title: "SensoryShelf",
      description: "Rate books by sensory factors — text density, chapter length, emotional intensity, and more.",
      icon: <Library className="w-8 h-8" />,
      tags: ["Books", "Sensory Ratings"],
      color: "secondary" as const,
      href: "/sensoryshelf",
    },
  ];

  const fade = (delay = 0) => ({
    initial: reducedMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 16 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true },
    transition: { duration: 0.4, delay },
  });

  return (
    <div className="min-h-screen bg-background text-foreground pb-24 overflow-x-hidden">

      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/80 backdrop-blur-md">
        <div className="container mx-auto px-4 py-3 md:py-4 flex justify-between items-center gap-4">
          <div className="flex items-center gap-3">
            <div className="bg-primary/20 p-2 rounded-xl text-primary">
              <BrainCircuit className="w-6 h-6" />
            </div>
            <h1 className="text-xl font-bold tracking-tight">NeuroDiverge Hub</h1>
          </div>

          <div className="flex items-center gap-2">
            {/* Quick nav */}
            <nav className="hidden md:flex items-center gap-1 mr-2">
              <button onClick={() => document.getElementById("tools")?.scrollIntoView({ behavior: "smooth" })} className="text-sm text-muted-foreground hover:text-foreground px-3 py-1.5 rounded-lg hover:bg-muted/60 transition-colors">Tools</button>
              <button onClick={() => setLocation("/blogs")} className="text-sm text-muted-foreground hover:text-foreground px-3 py-1.5 rounded-lg hover:bg-muted/60 transition-colors">Blog</button>
              <button onClick={() => document.getElementById("resources")?.scrollIntoView({ behavior: "smooth" })} className="text-sm text-muted-foreground hover:text-foreground px-3 py-1.5 rounded-lg hover:bg-muted/60 transition-colors">Resources</button>
            </nav>

            <div className="flex items-center gap-3 bg-muted/50 rounded-full px-3 py-2">
              <Select value={theme} onValueChange={(v: "dawn" | "night" | "hc") => setTheme(v)}>
                <SelectTrigger className="w-[110px] h-7 text-xs border-none bg-transparent hover:bg-muted focus:ring-0 focus:ring-offset-0">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="dawn"><div className="flex items-center gap-2"><Sun className="w-3 h-3" /><span>Dawn</span></div></SelectItem>
                  <SelectItem value="night"><div className="flex items-center gap-2"><Moon className="w-3 h-3" /><span>Night</span></div></SelectItem>
                  <SelectItem value="hc"><div className="flex items-center gap-2"><Contrast className="w-3 h-3" /><span>High Contrast</span></div></SelectItem>
                </SelectContent>
              </Select>
              <div className="flex items-center gap-1.5 border-l border-border/50 pl-2.5">
                <Label htmlFor="font-toggle" className="text-xs cursor-pointer"><Type className="w-3.5 h-3.5" /></Label>
                <Switch id="font-toggle" checked={dyslexiaFont} onCheckedChange={setDyslexiaFont} className="scale-75 data-[state=checked]:bg-primary" />
              </div>
            </div>

            <Button
              variant="ghost"
              size="icon"
              className="rounded-full"
              onClick={() => setLocation("/settings")}
              aria-label="Settings"
            >
              {isLoggedIn ? (
                <div className="w-7 h-7 rounded-full bg-primary/20 text-primary flex items-center justify-center text-xs font-bold">
                  {account?.displayName?.[0]?.toUpperCase() || "U"}
                </div>
              ) : (
                <User className="w-5 h-5" />
              )}
            </Button>
          </div>
        </div>
      </header>

      {/* Hero */}
 <section className="pt-20 pb-20 text-center">

  <div className="max-w-2xl mx-auto">

    <div className="mb-6 inline-block px-3 py-1 text-sm rounded-full bg-[#f1eef4] text-[#7c6f92]">
      A quiet digital haven
    </div>

    <h1 className="text-4xl md:text-6xl font-semibold leading-tight mb-6">
      A hub for minds that <br />
      <span className="text-[#8fa889]">work differently.</span>
    </h1>

    <p className="text-lg text-[#6b6b6b] mb-8">
      Tools, planners, recipes, books, and blog posts — all built around the real experience of being neurodivergent. No corporate wellness, no flashing alerts, no pressure.
    </p>

    <div className="flex flex-col sm:flex-row gap-3 justify-center">

      <Button
  variant="primary"
  size="lg"
  onClick={() =>
    document.getElementById("tools")?.scrollIntoView({
      behavior: "smooth",
    })
  }
>
  Explore the tools
</Button>

      <Button
  variant="default"
  size="lg"
  onClick={() => setLocation("/blogs")}
>
  Read the blog
</Button>

    </div>

  </div>

</section>

      {/* Tools */}
      <section id="tools" className="pt-6 pb-10">
        <div className="container space-y-4">
          <div className="mb-10 max-w-3xl">
            <h3 className="text-3xl font-bold mb-3">Tools to try</h3>
            <p className="text-muted-foreground">Working examples of what neurodivergent-first software can look like. Use them now — more dedicated apps are on the way.</p>
          </div>
          <div className="space-y-4">
            {tools.map((app, index) => (
              <AppCard key={app.title} {...app} delay={index * 0.08} />
            ))}
          </div>
        </div>
      </section>

      {/* Blog teaser */}
      <section className="py-16 md:py-20">
        <div className="container mx-auto px-4">
          <div className="mb-8 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              <h3 className="text-3xl font-bold mb-2">From the blog</h3>
              <p className="text-muted-foreground">Honest articles about what it's like to live with a brain like yours. No shame, no toxic positivity.</p>
            </div>
            <Button variant="outline" size="sm" className="gap-2 shrink-0 self-start sm:self-auto" onClick={() => setLocation("/blogs")}>
              All articles <ArrowRight className="w-4 h-4" />
            </Button>
          </div>

          <div className="space-y-3">
            {BLOG_PREVIEWS.map((article, i) => (
              <motion.div key={article.id} {...fade(i * 0.08)}>
                <Card
                  className="border-border/50 cursor-pointer hover:border-primary/40 hover:bg-primary/5 transition-colors group h-full"
                  onClick={() => setLocation("/blogs")}
                >
                  <CardHeader>
                    <div className="flex flex-wrap gap-1 mb-2">
                      {article.tags.map(t => <Badge key={t} variant="secondary" className="text-xs font-normal">{t}</Badge>)}
                    </div>
                    <CardTitle className="text-sm leading-snug font-medium group-hover:text-primary transition-colors">
                      {article.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <span className="text-xs text-primary group-hover:underline">Read →</span>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Recipes teaser */}
      <section className="py-12 bg-muted/20">
        <div className="container mx-auto px-4">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-6 max-w-4xl">
            <div className="flex items-center gap-4">
              <div className="bg-accent/20 p-3 rounded-xl text-accent shrink-0">
                <ChefHat className="w-6 h-6" />
              </div>
              <div>
                <h4 className="font-semibold mb-1">ND-Friendly Recipes</h4>
                <p className="text-sm text-muted-foreground">Curated safe-food recipes — mild flavours, predictable textures, minimal ingredients. No surprises.</p>
              </div>
            </div>
            <Button variant="outline" size="sm" className="gap-2 shrink-0" onClick={() => setLocation("/recipes")}>
              Browse recipes <ArrowRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </section>

      {/* Resources: Planners + Ebooks */}
      <section id="resources" className="py-16 md:py-20">
        <div className="container mx-auto px-4">
          <div className="mb-10 max-w-3xl">
            <h3 className="text-3xl font-bold mb-3">Resources</h3>
            <p className="text-muted-foreground">Curated planners and books chosen specifically for neurodivergent needs. All links go to Amazon search results — no affiliate links.</p>
          </div>

          <Tabs defaultValue="planners" className="w-full">
            <TabsList className="grid w-full max-w-xs grid-cols-2 mb-8 bg-muted/50 p-1 rounded-xl">
              <TabsTrigger value="planners" className="rounded-lg py-2.5">Planners</TabsTrigger>
              <TabsTrigger value="ebooks" className="rounded-lg py-2.5">Ebooks</TabsTrigger>
            </TabsList>

            <TabsContent value="planners" className="mt-0">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 max-w-5xl">
                {PLANNER_TEMPLATES.map((template, i) => (
                  <motion.div key={template.id} {...fade(i * 0.07)}>
                    <Card className="h-full flex flex-col border-border/50 hover:shadow-md transition-shadow">
                      <CardHeader className="pb-3">
                        <div className="flex items-start justify-between">
                          <div className="bg-primary/10 p-2 rounded-xl text-primary mb-3">
                            <FileText className="w-5 h-5" />
                          </div>
                          <Badge variant="secondary" className="text-xs font-normal">{template.badge}</Badge>
                        </div>
                        <CardTitle className="text-base leading-snug">{template.name}</CardTitle>
                        <CardDescription className="text-sm leading-relaxed">{template.description}</CardDescription>
                      </CardHeader>
                      <CardContent className="flex-1 flex flex-col justify-between gap-4">
                        <ul className="space-y-1.5">
                          {template.features.map(f => (
                            <li key={f} className="flex items-center gap-2 text-xs text-foreground/80">
                              <div className="w-1 h-1 rounded-full bg-primary shrink-0" />
                              {f}
                            </li>
                          ))}
                        </ul>
                        <Button size="sm" variant="outline" className="w-full gap-2 mt-2" asChild>
                          <a href={template.amazonUrl} target="_blank" rel="noopener noreferrer">
                            <ExternalLink className="w-3.5 h-3.5" /> Buy on Amazon
                          </a>
                        </Button>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="ebooks" className="mt-0">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 max-w-5xl">
                {EBOOKS.map((book, i) => (
                  <motion.div key={book.id} {...fade(i * 0.07)}>
                    <Card className="h-full flex flex-col border-border/50 hover:shadow-md transition-shadow">
                      <CardHeader className="pb-3">
                        <div className="bg-secondary/15 p-2 rounded-xl text-secondary w-fit mb-3">
                          <BookOpen className="w-5 h-5" />
                        </div>
                        <CardTitle className="text-base leading-snug">{book.title}</CardTitle>
                        <p className="text-xs text-muted-foreground">by {book.author}</p>
                        <CardDescription className="text-sm leading-relaxed mt-1">{book.description}</CardDescription>
                      </CardHeader>
                      <CardContent className="flex-1 flex flex-col justify-between gap-3">
                        <div className="flex flex-wrap gap-1.5">
                          {book.tags.map(t => <Badge key={t} variant="outline" className="text-xs font-normal">{t}</Badge>)}
                        </div>
                        <Button size="sm" variant="outline" className="w-full gap-2" asChild>
                          <a href={book.amazonUrl} target="_blank" rel="noopener noreferrer">
                            <ExternalLink className="w-3.5 h-3.5" /> Find on Amazon
                          </a>
                        </Button>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
              <p className="text-xs text-muted-foreground mt-6 text-center">
                All links open Amazon search results. No affiliate income from these links.
              </p>
            </TabsContent>
          </Tabs>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border/40 bg-muted/20 py-12">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex items-center gap-2 text-muted-foreground">
              <BrainCircuit className="w-5 h-5" />
              <span className="font-medium">NeuroDiverge Hub</span>
            </div>
            <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-muted-foreground justify-center">
              <button onClick={() => document.getElementById("tools")?.scrollIntoView({ behavior: "smooth" })} className="hover:text-foreground transition-colors">Tools</button>
              <button onClick={() => setLocation("/blogs")} className="hover:text-foreground transition-colors">Blog</button>
              <button onClick={() => setLocation("/recipes")} className="hover:text-foreground transition-colors">Recipes</button>
              <button onClick={() => setLocation("/planner")} className="hover:text-foreground transition-colors">My Planner</button>
              <button onClick={() => document.getElementById("resources")?.scrollIntoView({ behavior: "smooth" })} className="hover:text-foreground transition-colors">Planners & Ebooks</button>
              <button onClick={() => setLocation("/settings")} className="hover:text-foreground transition-colors">Settings</button>
            </div>
            <div className="text-sm text-muted-foreground flex items-center gap-1">
              Made with <Heart className="w-4 h-4 text-destructive mx-1" /> for neurodivergent people
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
