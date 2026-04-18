import { useState } from "react";
import { PageShell } from "@/components/page-shell";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Clock, ArrowLeft, BookOpen } from "lucide-react";
import { motion } from "framer-motion";

interface Article {
  id: string;
  title: string;
  excerpt: string;
  tags: string[];
  readTime: number;
  content: string;
}

// ─── BLOG ARTICLES ─── Add new articles here ────────────────────────────────
const ARTICLES: Article[] = [
  {
    id: "not-broken",
    title: "You're not broken. You're wired differently.",
    excerpt: "Society was built around one type of brain. If yours doesn't fit the mould, that doesn't mean something went wrong — it means you're navigating a world that wasn't built for you.",
    tags: ["Neurodivergence", "Identity", "Self-compassion"],
    readTime: 6,
    content: `Society has a very specific picture of what a "normal" brain looks like. It pays attention for long stretches. It follows instructions the first time. It transitions between tasks smoothly, remembers birthdays without a dozen reminders, and doesn't need to stim to process a difficult emotion.

If that doesn't sound like you, you've probably spent years wondering what's wrong with you.

The answer is: nothing.

**What neurodivergence actually means**

Neurodivergence is an umbrella term for brains that process, learn, and experience the world in ways that diverge from what's considered typical. This includes ADHD, autism, dyslexia, dyspraxia, dyscalculia, sensory processing differences, and more. Many people have more than one.

These aren't disorders of deficiency — they're variations in how the human brain is organised. And those variations come with real challenges, yes, but also often with genuine strengths that neurotypical brains don't share.

**The problem isn't you — it's the fit**

Imagine you were left-handed in a world where everything — scissors, desks, keyboards, handshakes — was designed for the right hand. You'd struggle constantly. You'd be slower, messier, more frustrated. And someone might conclude that you were clumsy or careless.

But the problem wouldn't be your hand. It would be the tools.

Neurodivergent people face this every day. Schools that reward sitting still and moving at the same pace as everyone else. Workplaces that confuse output with presence. Social environments built around unwritten rules that nobody explained to you.

The struggle is real. But it's not evidence of personal failing.

**What changes when you understand this**

When you start to see your brain as different rather than broken, something shifts. You stop spending energy on self-blame and start spending it on finding what actually works for you.

Maybe you need sound to focus. Maybe you need silence. Maybe you do your best thinking at 11pm, or in 20-minute bursts, or while pacing. Maybe you need tasks written down or you'll genuinely forget them — not because you're irresponsible, but because working memory works differently in your brain.

None of that is a character flaw. It's a user manual.

**You deserve tools built for your brain**

This hub exists because most tools weren't designed with neurodivergent people in mind. We built this as a starting point — a place where the design choices start from your needs, not from the assumption that everyone's brain works the same way.

You're not catching up. You're just using different routes to get to the same place. And some of those routes are worth celebrating.`,
  },
  {
    id: "adhd-time",
    title: "ADHD and time blindness: Why clocks feel like a foreign language",
    excerpt: "It's not that you don't care about being on time. Your brain genuinely perceives time differently — and once you understand that, you can build systems that actually help.",
    tags: ["ADHD", "Time Management", "Executive Function"],
    readTime: 7,
    content: `Ask someone with ADHD what time it is without looking at a clock, and they'll likely give you a number that's off by an hour or more in either direction. This isn't carelessness. It's a neurological difference called time blindness — and it's one of the most misunderstood aspects of ADHD.

**What time blindness actually is**

Neurotypical brains have an internal clock that runs in the background constantly. It tells them how much time has passed, how much time is left, and when to start preparing for the next thing. It's mostly automatic.

ADHD brains often lack this background clock. Time is experienced as two states: NOW and NOT NOW. Either something is happening immediately and urgently, or it's some abstract future event that doesn't feel real yet.

This is why ADHDers often:
- Miss appointments they were completely intending to keep
- Spend three hours on something they thought would take twenty minutes
- Have no idea it's been six hours since they last ate
- Start getting ready ten minutes before they need to leave — repeatedly, every time, no matter how often it backfires

**It's not a motivation problem**

The most important thing to understand: this is not laziness, not disrespect, and not a lack of caring. It's a genuine deficit in the brain's ability to perceive and track time passing.

Research by Dr. Russell Barkley, one of the leading ADHD researchers, describes ADHD as fundamentally a disorder of time — the inability to use the past to predict the future and adjust behaviour accordingly.

That's why ADHD-ers often know what they need to do and still don't do it. The future doesn't feel urgent enough to motivate action in the present.

**What actually helps**

Since internal time awareness is impaired, external time awareness becomes essential:

**Make time visible.** Analogue clocks, visual timers (like Time Timers that show time passing as a shrinking coloured arc), countdown apps — these externalise the clock your brain doesn't have.

**Use transition alarms.** Not one alarm 5 minutes before you need to leave. A series: 30 minutes, 15 minutes, 5 minutes. Each one narrows the window and makes the urgency feel real.

**Time tasks before trusting estimates.** ADHDers consistently underestimate how long things take. Actively timing yourself on common tasks builds a more accurate internal database — slowly.

**Build "time buffers" into your schedule.** Assume everything will take longer than you think, because it almost certainly will. If you think something takes 20 minutes, schedule 40.

**Work with urgency, not against it.** Since ADHD brains often need urgency to activate, some people intentionally create artificial deadlines. Working in a café with a closing time. Setting a timer. Telling someone what you'll have done by when.

Time blindness doesn't disappear. But with the right external scaffolding, you can build a life that works with your brain rather than assuming it will somehow catch up.`,
  },
  {
    id: "sensory-overload",
    title: "Sensory overload: When the world is just too loud",
    excerpt: "Sensory overload is not being dramatic. It's your nervous system reaching its threshold — and the more you understand it, the better you can protect yourself from it.",
    tags: ["Sensory Processing", "HSP", "Autism", "Self-care"],
    readTime: 6,
    content: `The fluorescent light above you is humming. There's a conversation happening three desks away. Someone's perfume is overwhelming in a way that feels almost physical. The fabric of your shirt feels wrong on your skin. The room is too warm and also somehow too cold.

For most people, these are minor background irritations. For someone with sensory processing differences — common in autistic people, those with ADHD, and Highly Sensitive People — they can be the edge of collapse.

**What sensory overload actually is**

The brain receives constant sensory information — sight, sound, smell, touch, taste, temperature, proprioception (body position), vestibular (balance). Most brains are good at filtering: they process sensory information and discard most of it, only bringing important things to conscious attention.

In some brains, this filter works differently. Everything comes through at full volume. The brain has to actively process inputs that others barely register — and that processing has a cost. When the cost accumulates faster than the brain can recover, you hit overload.

Overload can look like: emotional dysregulation, shutdown (going quiet and withdrawn), meltdown (emotional outburst that feels uncontrollable), physical symptoms like headache or nausea, or simply an overwhelming urge to escape.

**It's not sensitivity as weakness**

"Sensitive" has been weaponised as an insult — a way of telling people their responses are excessive and they need to toughen up. But sensitivity is neurological, not characterological. You can't decide to stop processing sensory information by believing in yourself harder.

In fact, sensory sensitivity is often linked to higher awareness of the environment — an evolutionary trait that has genuine value, even if it's uncomfortable in a world full of fluorescent lights and open-plan offices.

**Identifying your triggers**

The first step to managing sensory overload is understanding what your triggers are. For most people, this is a unique combination:

- **Auditory**: Background noise, overlapping conversations, sudden loud sounds, specific frequencies (like certain music or air conditioning hum)
- **Visual**: Flickering lights, bright colours, busy patterns, screens at certain brightness levels
- **Tactile**: Certain fabrics, tags in clothing, light touch vs firm pressure, temperature changes
- **Olfactory**: Artificial scents, cleaning products, certain foods
- **Social**: Crowded spaces, eye contact, processing multiple people talking at once

**Practical protection**

Once you know your triggers, you can build your environment accordingly:

- Noise-cancelling headphones are not antisocial. They're a tool.
- Sunglasses indoors when the light is harsh is not dramatic. It's regulation.
- Choosing clothing that feels comfortable over clothing that "looks right" is not vanity. It's reducing background noise.
- Leaving a party early when you're done is not rudeness. It's managing your threshold.

Communicate what you need. Build in recovery time after high-sensory situations. Create safe, low-sensory spaces in your home. Don't apologise for having a nervous system that tells you the truth about what it needs.`,
  },
  {
    id: "masking",
    title: "Masking: The invisible weight of pretending",
    excerpt: "Masking is the exhausting performance of appearing neurotypical. Many people do it for years before they even realise it has a name — or that it's draining the life out of them.",
    tags: ["Autism", "ADHD", "Mental Health", "Identity"],
    readTime: 7,
    content: `From the outside, you look like you're managing fine. You make eye contact. You laugh at the right moments. You say the right things in conversations. You hold it together at work. You seem okay.

On the inside, you're running a constant background programme, consuming enormous processing power, just to appear the way people expect you to appear.

This is masking. And it's one of the most exhausting things a neurodivergent person can do.

**What masking is**

Masking (sometimes called camouflaging) is the process of hiding, suppressing, or compensating for neurodivergent traits in order to fit in with neurotypical expectations. It can include:

- Suppressing stimming (fidgeting, rocking, hand movements) that would draw attention
- Forcing eye contact even when it's painful or distracting
- Scripting conversations in advance because natural conversation feels unreliable
- Mirroring other people's body language and speech patterns
- Feigning interest in topics you don't understand or care about
- Monitoring yourself constantly for "normal" responses

Most people who mask learned to do it in childhood, often before they had any language for what they were doing. They simply noticed that certain behaviours made other people uncomfortable, and they learned to hide them.

**The cost of masking**

Masking is a survival strategy. In many environments, it genuinely is necessary for safety and belonging. But the cost is enormous.

Studies of autistic adults have found strong links between masking and anxiety, depression, burnout, and suicidal ideation. When you spend years performing a version of yourself that isn't you, you can lose track of who you actually are.

ADHD masking is less discussed but equally real — the hyperfocus deployed to appear attentive, the enormous effort of sitting still, the scripts and compensations that make people think you're "a bit scattered" rather than significantly struggling.

**Burnout: When the mask breaks**

Autistic burnout is a specific state that can result from sustained masking and other stressors. It looks like a profound loss of function — things that used to be manageable become impossible. Speech becomes harder. Sensory sensitivity increases. Executive function collapses. It can be mistaken for depression, and it can last months or years.

One of the most important things to know is that burnout is not permanent — but recovery requires genuine rest, which means stopping the performance, not just taking a day off while still forcing everything.

**Finding your way back to yourself**

If you've been masking for years, unmasking isn't a simple decision. It happens slowly, in safe spaces, with people who have proven they can be trusted with the real you.

Start small. Allow yourself to stim privately. Notice your actual interests, not the ones you've performed. Give yourself permission to find socialising genuinely exhausting and to need recovery time after it.

The goal isn't to become "visibly neurodivergent" in every space. The goal is to have at least some spaces where the performance stops — where you can just be what you are, without the cost.

You were always allowed to be tired. You were always allowed to need a break. You were always allowed to be real.`,
  },
  {
    id: "executive-function",
    title: "Why starting things is so hard (and it's not laziness)",
    excerpt: "Executive function is the brain's management system. When it doesn't work the way it's supposed to, everything from doing dishes to starting a work project can feel impossible — not because you don't want to, but because your brain can't initiate.",
    tags: ["ADHD", "Executive Function", "Mental Health"],
    readTime: 5,
    content: `You've been meaning to do it all day. You've thought about it constantly. You know it needs doing. You know how to do it. You have the time to do it.

And you still can't start.

This isn't laziness. This is executive dysfunction — and it's one of the most misunderstood and most stigmatised aspects of ADHD and many other neurodivergent conditions.

**What executive function actually is**

Executive function is the brain's management system — a collection of mental skills that help you plan, initiate, organise, regulate your emotions, and follow through on tasks. It lives primarily in the prefrontal cortex, which is also the part of the brain that develops last and works differently in ADHD.

Executive function skills include:
- **Task initiation**: starting a task, especially one that doesn't feel immediately rewarding
- **Working memory**: holding information in mind while using it
- **Cognitive flexibility**: shifting between tasks or adapting to change
- **Planning and organisation**: breaking tasks into steps, understanding sequences
- **Inhibition**: stopping yourself from acting impulsively
- **Emotional regulation**: managing the emotions that arise around tasks

In ADHD, all of these can be impaired — not all of them, not all the time, but enough to make daily life significantly harder than it looks from the outside.

**The motivation myth**

One of the cruellest misunderstandings about executive dysfunction is that it's a motivation problem. If you just cared enough, you'd do it.

But ADHD motivation doesn't work like neurotypical motivation. It's not driven by importance, urgency, or logic alone. It's driven by interest, novelty, challenge, or urgency — the so-called ADHD "interest-based nervous system."

This is why someone with ADHD can spend eight hours hyperfocused on something they find genuinely interesting, and then not be able to spend ten minutes on something they know is important. The brain isn't being difficult. It's following its own rules.

**What actually helps**

Because executive function deficits are neurological, "just trying harder" doesn't fix them. But external scaffolding can:

**External reminders**: Timers, alarms, sticky notes in visible places, apps that surface tasks at the right moment. Your brain can't be the only system keeping track.

**Task breakdown**: Large tasks are often unstarted because they're undefined. Breaking them into tiny, specific, actionable steps lowers the initiation threshold. "Write the report" is hard to start. "Open a new document and write the first sentence" is much easier.

**Body doubling**: Working alongside another person — even virtually, even silently — can dramatically improve initiation and follow-through. Something about another presence activates the parts of the brain that enable focus.

**Interest injection**: If a task is boring, making it interesting helps — listening to music, changing locations, turning it into a game or a challenge.

**Self-compassion**: Fighting yourself about why you can't start makes starting harder, not easier. Notice the struggle without judgment, and focus on what might help, not what's wrong with you.

Executive dysfunction doesn't go away. But with the right tools, routines, and understanding, it becomes manageable. You're not fighting yourself. You're learning to work with a brain that has its own requirements.`,
  },
  {
    id: "routines",
    title: "Finding calm: Routines that work with your brain, not against it",
    excerpt: "Routines are often sold as the solution to everything. For neurodivergent people, rigid routines can be as harmful as no routine at all. Here's how to find what actually works.",
    tags: ["Routines", "Wellbeing", "ADHD", "Autism", "Practical Tips"],
    readTime: 6,
    content: `Every productivity article tells you to build a morning routine. Wake up at 5am. Meditate. Journal. Exercise. Plan your day. Be consistent.

For some neurodivergent people, this advice is worse than useless. For others, routine is the foundation that makes everything else possible. The difference is understanding what kind of routine your specific brain needs — and what it definitely doesn't.

**Why routine helps (and why it's complicated)**

Routine reduces decision fatigue. Every decision you make costs cognitive resources, and for a brain that's already stretched by sensory processing, emotional regulation, or executive function challenges, small decisions accumulate to exhaustion quickly.

Having a fixed structure for regular tasks means those tasks don't require decision-making — they just happen. This frees up resources for the things that genuinely require them.

For autistic people especially, routine can be a source of safety. Predictability reduces anxiety. Knowing what comes next means there's less to monitor, less uncertainty to manage.

But here's the complication: rigid routines can also become traps. When the routine breaks — and it will, because life is unpredictable — the dysregulation that follows can be enormous. Flexibility, built into the routine itself, is essential.

**Anchor routines, not rigid schedules**

Instead of a fixed timetable, consider anchor routines — stable sequences of habits tied to events rather than clock times.

"After I wake up, before I do anything else, I drink water and take my medication."
"When I sit down at my desk, I open my task list before I open anything else."
"Before I sleep, I spend ten minutes doing something that doesn't involve a screen."

These anchors are resilient. They don't fail if you sleep in. They don't collapse when Monday becomes Tuesday. They travel with you when your environment changes.

**The minimum viable routine**

When energy is low or life is chaotic, most routines become unsustainable. A minimum viable routine is the stripped-back version that keeps you functioning without requiring full capacity.

What are the 3–5 things that, if you do them, make the day survivable? For many people it's: take medication (if applicable), eat something, drink water, do one necessary task, and do one thing that helps you feel okay.

When everything else falls apart, the minimum viable routine is enough. It keeps the thread.

**Routines for bodies that forget they exist**

Many neurodivergent people have impaired interoception — they don't receive clear signals from their body about hunger, thirst, tiredness, or needing the bathroom. Scheduled body-care prompts aren't a weakness; they're a workaround for a sensory system that sometimes goes quiet.

Set alarms for meals and water if you forget to eat and drink. Build a bedtime that's an actual scheduled event, not a thing that happens when you're finally too exhausted to continue. Check in with yourself at regular intervals.

**Make it yours**

The only routine that works is one that accounts for your specific brain, your schedule, your sensory needs, and what you actually find manageable. Borrowed routines rarely fit perfectly. They're a starting point.

Notice what you always end up doing anyway — those are already anchors. Build around them. Add one small thing at a time. Give each addition three weeks before judging whether it's working.

And be gentle when it breaks. Breaking a routine is not failure. It's information about where it needs to be adjusted.

You don't need a perfect routine. You need a routine that's kind to you.`,
  },
];

export default function Blogs() {
  const [selected, setSelected] = useState<Article | null>(null);

  if (selected) {
    return (
      <PageShell title="Blog">
        <div className="max-w-2xl mx-auto">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setSelected(null)}
            className="gap-2 text-muted-foreground mb-6 -ml-1"
          >
            <ArrowLeft className="w-4 h-4" /> Back to articles
          </Button>

          <div className="mb-2 flex flex-wrap gap-1.5">
            {selected.tags.map(tag => (
              <Badge key={tag} variant="secondary" className="text-xs font-normal">{tag}</Badge>
            ))}
          </div>

          <h2 className="text-2xl md:text-3xl font-bold leading-snug mb-3">{selected.title}</h2>

          <p className="text-xs text-muted-foreground flex items-center gap-1.5 mb-8">
            <Clock className="w-3.5 h-3.5" /> {selected.readTime} min read
          </p>

          <div className="prose prose-sm max-w-none dark:prose-invert leading-relaxed space-y-4">
            {selected.content.split("\n\n").map((para, i) => {
              if (para.startsWith("**") && para.endsWith("**") && para.split("**").length === 3) {
                const text = para.slice(2, -2);
                return <h3 key={i} className="text-lg font-semibold mt-8 mb-2 text-foreground">{text}</h3>;
              }
              const parts = para.split(/(\*\*[^*]+\*\*)/g);
              return (
                <p key={i} className="text-foreground/85 leading-7">
                  {parts.map((part, j) => {
                    if (part.startsWith("**") && part.endsWith("**")) {
                      return <strong key={j} className="font-semibold text-foreground">{part.slice(2, -2)}</strong>;
                    }
                    if (part.startsWith("- ")) {
                      return <span key={j}>{part}</span>;
                    }
                    return part;
                  })}
                </p>
              );
            })}
          </div>
        </div>
      </PageShell>
    );
  }

  return (
    <PageShell title="Blog">
      <div className="max-w-2xl mx-auto space-y-6">
        <div>
          <h2 className="text-2xl font-bold mb-1">Understanding your brain</h2>
          <p className="text-muted-foreground text-sm">
            Honest, compassionate articles about neurodivergence. No shame, no toxic positivity — just real information that might help you feel less alone.
          </p>
        </div>

        <div className="space-y-4">
          {ARTICLES.map((article, i) => (
            <motion.div
              key={article.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.06, duration: 0.35 }}
            >
              <Card
                className="border-border/50 cursor-pointer hover:border-primary/40 hover:bg-primary/5 transition-colors group"
                onClick={() => setSelected(article)}
              >
                <CardHeader className="pb-3">
                  <div className="flex flex-wrap gap-1.5 mb-2">
                    {article.tags.map(tag => (
                      <Badge key={tag} variant="secondary" className="text-xs font-normal">{tag}</Badge>
                    ))}
                  </div>
                  <CardTitle className="text-base leading-snug group-hover:text-primary transition-colors">
                    {article.title}
                  </CardTitle>
                  <CardDescription className="text-sm leading-relaxed mt-1">
                    {article.excerpt}
                  </CardDescription>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-muted-foreground flex items-center gap-1">
                      <Clock className="w-3 h-3" /> {article.readTime} min read
                    </span>
                    <span className="text-xs text-primary group-hover:underline">Read →</span>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        <div className="text-center py-4">
          <div className="inline-flex items-center gap-2 text-xs text-muted-foreground bg-muted/40 px-4 py-2 rounded-full">
            <BookOpen className="w-3.5 h-3.5" /> More articles coming soon
          </div>
        </div>
      </div>
    </PageShell>
  );
}
