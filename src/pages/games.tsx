import { useState, useEffect, useRef, useCallback } from "react";
import { PageShell } from "@/components/page-shell";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { motion, AnimatePresence } from "framer-motion";
import { RefreshCw, Wind, Puzzle, Palette, Grid3X3, Star, ChevronRight } from "lucide-react";

const GAME_LIST = [
  { id: "breathe", label: "Breathing Guide", icon: Wind, description: "Guided breathing to help you regulate", color: "text-blue-500" },
  { id: "words", label: "Word Unscramble", icon: Puzzle, description: "Gently unscramble calm words", color: "text-green-500" },
  { id: "colours", label: "Colour Match", icon: Palette, description: "Match soothing colour pairs", color: "text-purple-500" },
  { id: "pattern", label: "Pattern Memory", icon: Grid3X3, description: "Tap the pattern in order", color: "text-orange-500" },
];

const WORD_LIST = [
  { scrambled: "ACMLE", word: "CLAME", answer: "CALME", correct: "CALM" },
  { scrambled: "ATQEIU", answer: "QUIET", correct: "QUIET" },
  { scrambled: "TLNSEE", answer: "GENTLE", correct: "GENTLE" },
  { scrambled: "CETPA", answer: "PEACE", correct: "PEACE" },
  { scrambled: "STFER", answer: "FRESH", correct: "FRESH" },
  { scrambled: "TOFRS", answer: "FROST", correct: "FROST" },
  { scrambled: "FTSOA", answer: "FLOAT", correct: "FLOAT" },
  { scrambled: "EAWVS", answer: "WAVES", correct: "WAVES" },
  { scrambled: "ELCRA", answer: "CLEAR", correct: "CLEAR" },
  { scrambled: "HWOLS", answer: "WHOLE", correct: "WHOLE" },
];

const CALM_WORDS = ["CALM", "QUIET", "GENTLE", "PEACE", "FRESH", "FLOAT", "WAVES", "CLEAR", "WHOLE", "STILL", "SOFT", "EASY", "FLOW", "REST", "WARM"];

function shuffle<T>(arr: T[]): T[] {
  return [...arr].sort(() => Math.random() - 0.5);
}

function scrambleWord(word: string): string {
  let scrambled = word;
  let attempts = 0;
  while (scrambled === word && attempts < 20) {
    scrambled = shuffle(word.split("")).join("");
    attempts++;
  }
  return scrambled;
}

function BreatheGame() {
  const PHASES: { label: string; duration: number; color: string }[] = [
    { label: "Breathe in", duration: 4, color: "bg-blue-400/80" },
    { label: "Hold", duration: 4, color: "bg-purple-400/80" },
    { label: "Breathe out", duration: 6, color: "bg-teal-400/80" },
    { label: "Hold", duration: 2, color: "bg-slate-400/80" },
  ];
  const [phaseIdx, setPhaseIdx] = useState(0);
  const [active, setActive] = useState(false);
  const [count, setCount] = useState(PHASES[0].duration);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const phase = PHASES[phaseIdx];

  const stop = useCallback(() => {
    setActive(false);
    if (timerRef.current) clearInterval(timerRef.current);
    setPhaseIdx(0);
    setCount(PHASES[0].duration);
  }, []);

  const start = () => {
    setActive(true);
    setPhaseIdx(0);
    setCount(PHASES[0].duration);
  };

  useEffect(() => {
    if (!active) return;
    setCount(PHASES[phaseIdx].duration);
    timerRef.current = setInterval(() => {
      setCount(c => {
        if (c <= 1) {
          const next = (phaseIdx + 1) % PHASES.length;
          setPhaseIdx(next);
          return PHASES[next].duration;
        }
        return c - 1;
      });
    }, 1000);
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [active, phaseIdx]);

  return (
    <div className="flex flex-col items-center gap-6 py-4">
      <div className="relative flex items-center justify-center w-44 h-44">
        <motion.div
          className={`absolute rounded-full ${phase.color} transition-colors duration-700`}
          animate={active ? {
            width: phaseIdx === 0 ? "176px" : phaseIdx === 2 ? "80px" : undefined,
            height: phaseIdx === 0 ? "176px" : phaseIdx === 2 ? "80px" : undefined,
          } : { width: "100px", height: "100px" }}
          transition={{ duration: PHASES[phaseIdx]?.duration ?? 4, ease: "easeInOut" }}
          style={{ width: "100px", height: "100px" }}
        />
        <div className="relative z-10 text-center">
          <p className="text-white font-medium text-sm drop-shadow">{active ? phase.label : "Ready?"}</p>
          {active && <p className="text-white text-3xl font-bold drop-shadow">{count}</p>}
        </div>
      </div>
      <div className="flex gap-2">
        {!active ? (
          <Button onClick={start} size="sm" className="gap-2"><Wind className="w-4 h-4" /> Start breathing</Button>
        ) : (
          <Button onClick={stop} variant="outline" size="sm">Stop</Button>
        )}
      </div>
      <p className="text-xs text-muted-foreground text-center max-w-xs">Box breathing: inhale 4s, hold 4s, exhale 6s, hold 2s. Repeat.</p>
    </div>
  );
}

function WordGame() {
  const newWord = () => {
    const w = CALM_WORDS[Math.floor(Math.random() * CALM_WORDS.length)];
    return { word: w, scrambled: scrambleWord(w) };
  };
  const [current, setCurrent] = useState(newWord);
  const [guess, setGuess] = useState("");
  const [status, setStatus] = useState<"idle" | "correct" | "wrong">("idle");
  const [score, setScore] = useState(0);

  const check = () => {
    if (guess.toUpperCase().trim() === current.word) {
      setStatus("correct");
      setScore(s => s + 1);
      setTimeout(() => { setCurrent(newWord()); setGuess(""); setStatus("idle"); }, 1200);
    } else {
      setStatus("wrong");
      setTimeout(() => setStatus("idle"), 800);
    }
  };

  const skip = () => { setCurrent(newWord()); setGuess(""); setStatus("idle"); };

  return (
    <div className="flex flex-col items-center gap-5 py-4">
      <div className="flex items-center gap-2">
        <Star className="w-4 h-4 text-yellow-500" />
        <span className="text-sm font-medium">{score} solved</span>
      </div>
      <div className="text-4xl font-mono font-bold tracking-[0.25em] text-primary">
        {current.scrambled.split("").map((l, i) => (
          <span key={i} className="inline-block">{l}</span>
        ))}
      </div>
      <p className="text-xs text-muted-foreground">Unscramble this calming word</p>
      <div className="flex gap-2 w-full max-w-xs">
        <input
          className={`flex-1 border rounded-xl px-3 py-2 text-center text-sm font-mono uppercase tracking-widest focus:outline-none focus:ring-2 transition-colors ${status === "correct" ? "bg-green-100 border-green-400 ring-green-300" : status === "wrong" ? "bg-red-100 border-red-400 ring-red-300" : "border-border focus:ring-primary/40"}`}
          value={guess}
          onChange={e => setGuess(e.target.value.toUpperCase())}
          onKeyDown={e => e.key === "Enter" && check()}
          maxLength={current.word.length}
          placeholder="Your answer"
        />
        <Button onClick={check} size="sm">Check</Button>
      </div>
      <div className="flex gap-2">
        <Button variant="ghost" size="sm" onClick={skip} className="text-muted-foreground">Skip <ChevronRight className="w-3 h-3" /></Button>
      </div>
      <AnimatePresence>
        {status === "correct" && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="text-green-600 dark:text-green-400 text-sm font-medium">
            Correct!
          </motion.div>
        )}
        {status === "wrong" && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="text-orange-500 text-sm">
            Try again
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

const COLOUR_PALETTE = [
  "#88b4a8", "#c9b8d4", "#f5c9a0", "#a8c4b0", "#d4c5b5",
  "#8ab0d0", "#e0b4b4", "#b4d4c4", "#c8d4a4", "#d4b8c4",
];

function ColourGame() {
  const makeGrid = () => {
    const colours = shuffle(COLOUR_PALETTE).slice(0, 6);
    const pairs = shuffle([...colours, ...colours]);
    return pairs.map((c, i) => ({ id: i, colour: c, flipped: false, matched: false }));
  };

  const [cards, setCards] = useState(makeGrid);
  const [selected, setSelected] = useState<number[]>([]);
  const [matches, setMatches] = useState(0);
  const [checking, setChecking] = useState(false);

  const flip = (id: number) => {
    if (checking || selected.length === 2) return;
    const card = cards.find(c => c.id === id);
    if (!card || card.flipped || card.matched) return;

    const newSelected = [...selected, id];
    setCards(cs => cs.map(c => c.id === id ? { ...c, flipped: true } : c));
    setSelected(newSelected);

    if (newSelected.length === 2) {
      setChecking(true);
      const [a, b] = newSelected;
      const ca = cards.find(c => c.id === a)!;
      const cb = cards.find(c => c.id === b)!;
      setTimeout(() => {
        if (ca.colour === cb.colour) {
          setCards(cs => cs.map(c => (c.id === a || c.id === b) ? { ...c, matched: true } : c));
          setMatches(m => m + 1);
        } else {
          setCards(cs => cs.map(c => (c.id === a || c.id === b) ? { ...c, flipped: false } : c));
        }
        setSelected([]);
        setChecking(false);
      }, 900);
    }
  };

  const reset = () => { setCards(makeGrid()); setSelected([]); setMatches(0); setChecking(false); };

  return (
    <div className="flex flex-col items-center gap-5 py-4">
      <div className="flex items-center gap-4">
        <span className="text-sm text-muted-foreground">{matches} / 6 matched</span>
        <Button variant="ghost" size="sm" onClick={reset} className="gap-1 text-muted-foreground h-7">
          <RefreshCw className="w-3 h-3" /> Reset
        </Button>
      </div>
      {matches === 6 && (
        <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="text-sm font-medium text-green-600 dark:text-green-400">
          All matched!
        </motion.div>
      )}
      <div className="grid grid-cols-4 gap-2 max-w-[280px]">
        {cards.map(card => (
          <motion.button
            key={card.id}
            onClick={() => flip(card.id)}
            className={`w-14 h-14 rounded-xl border-2 transition-all ${card.matched ? "opacity-50 cursor-default border-transparent" : "cursor-pointer hover:scale-105"} ${!card.flipped && !card.matched ? "border-border bg-muted" : "border-transparent"}`}
            style={card.flipped || card.matched ? { backgroundColor: card.colour } : {}}
            whileHover={!card.flipped && !card.matched ? { scale: 1.05 } : {}}
            whileTap={!card.flipped && !card.matched ? { scale: 0.95 } : {}}
          />
        ))}
      </div>
      <p className="text-xs text-muted-foreground">Find all matching colour pairs</p>
    </div>
  );
}

function PatternGame() {
  const SIZE = 9;
  const LEVELS = [3, 4, 5, 6];
  const [level, setLevel] = useState(0);
  const [sequence, setSequence] = useState<number[]>([]);
  const [showing, setShowing] = useState(false);
  const [activeCell, setActiveCell] = useState<number | null>(null);
  const [userSeq, setUserSeq] = useState<number[]>([]);
  const [status, setStatus] = useState<"idle" | "watch" | "input" | "correct" | "wrong">("idle");
  const [score, setScore] = useState(0);

  const generateAndShow = (lvl = level) => {
    const len = LEVELS[lvl];
    const seq = Array.from({ length: len }, () => Math.floor(Math.random() * SIZE));
    setSequence(seq);
    setUserSeq([]);
    setStatus("watch");
    let i = 0;
    const show = () => {
      if (i >= seq.length) {
        setActiveCell(null);
        setShowing(false);
        setStatus("input");
        return;
      }
      setActiveCell(seq[i]);
      setTimeout(() => {
        setActiveCell(null);
        setTimeout(() => { i++; show(); }, 250);
      }, 600);
    };
    setShowing(true);
    setTimeout(show, 400);
  };

  const handleCellTap = (idx: number) => {
    if (status !== "input") return;
    const newSeq = [...userSeq, idx];
    setUserSeq(newSeq);

    if (newSeq[newSeq.length - 1] !== sequence[newSeq.length - 1]) {
      setStatus("wrong");
      setTimeout(() => { setStatus("idle"); setUserSeq([]); }, 1200);
      return;
    }

    if (newSeq.length === sequence.length) {
      setStatus("correct");
      setScore(s => s + 1);
      const next = Math.min(level + 1, LEVELS.length - 1);
      setLevel(next);
      setTimeout(() => generateAndShow(next), 1200);
    }
  };

  return (
    <div className="flex flex-col items-center gap-5 py-4">
      <div className="flex items-center gap-4">
        <span className="text-sm text-muted-foreground">Score: {score}</span>
        <Badge variant="secondary" className="text-xs">Level {level + 1}</Badge>
      </div>

      {status === "idle" && (
        <Button onClick={() => generateAndShow()} size="sm" className="gap-2">
          <Grid3X3 className="w-4 h-4" /> Start pattern
        </Button>
      )}
      {status === "watch" && <p className="text-sm text-muted-foreground animate-pulse">Watch the pattern...</p>}
      {status === "input" && <p className="text-sm text-primary">Repeat the pattern!</p>}
      {status === "correct" && <p className="text-sm text-green-600 dark:text-green-400 font-medium">Correct! Next level...</p>}
      {status === "wrong" && <p className="text-sm text-orange-500">Oops! Try again.</p>}

      <div className="grid grid-cols-3 gap-2.5">
        {Array.from({ length: SIZE }, (_, i) => {
          const isActive = activeCell === i;
          const isUser = userSeq[userSeq.length - 1] === i && status === "input";
          return (
            <motion.button
              key={i}
              onClick={() => handleCellTap(i)}
              className={`w-16 h-16 rounded-xl border-2 transition-colors ${status === "input" ? "cursor-pointer" : "cursor-default"} ${isActive ? "bg-primary border-primary" : "bg-muted border-border hover:border-primary/40"}`}
              animate={isActive ? { scale: [1, 1.1, 1] } : {}}
              transition={{ duration: 0.3 }}
            />
          );
        })}
      </div>
      <p className="text-xs text-muted-foreground">Watch then repeat the lit squares in order</p>
    </div>
  );
}

const GAME_COMPONENTS: Record<string, React.FC> = {
  breathe: BreatheGame,
  words: WordGame,
  colours: ColourGame,
  pattern: PatternGame,
};

export default function Games() {
  const [activeGame, setActiveGame] = useState<string | null>(null);

  const GameComponent = activeGame ? GAME_COMPONENTS[activeGame] : null;
  const meta = GAME_LIST.find(g => g.id === activeGame);

  return (
    <PageShell title="Calm Games">
      <div className="max-w-2xl mx-auto space-y-6">
        <div>
          <h2 className="text-2xl font-bold mb-1">Calm Games</h2>
          <p className="text-muted-foreground text-sm">Gentle activities for when you need to reset. Low-pressure, no scores that matter, no timers.</p>
        </div>

        {!activeGame ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {GAME_LIST.map(game => {
              const Icon = game.icon;
              return (
                <Card
                  key={game.id}
                  className="border-border/50 cursor-pointer hover:border-primary/40 hover:bg-primary/5 transition-colors group"
                  onClick={() => setActiveGame(game.id)}
                >
                  <CardHeader>
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-xl bg-muted flex items-center justify-center group-hover:scale-105 transition-transform`}>
                        <Icon className={`w-5 h-5 ${game.color}`} />
                      </div>
                      <div>
                        <CardTitle className="text-base">{game.label}</CardTitle>
                        <CardDescription className="text-xs mt-0.5">{game.description}</CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                </Card>
              );
            })}
          </div>
        ) : (
          <div>
            <div className="flex items-center gap-3 mb-5">
              <Button variant="ghost" size="sm" onClick={() => setActiveGame(null)} className="text-muted-foreground gap-1 h-7">
                ← Back
              </Button>
              {meta && (
                <span className="text-base font-semibold">{meta.label}</span>
              )}
            </div>
            <Card className="border-border/50">
              <CardContent className="pt-6">
                {GameComponent && <GameComponent />}
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </PageShell>
  );
}
