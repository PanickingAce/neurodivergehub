import { useState, useEffect } from "react";
import { PageShell } from "@/components/page-shell";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BrainCircuit, Leaf, Save, CalendarDays, Lightbulb } from "lucide-react";

type Mood = "thriving" | "okay" | "low" | "overwhelmed" | "shutdown";
type Energy = "full" | "moderate" | "low" | "empty";

interface MoodEntry {
  id: string;
  date: string;
  mood: Mood;
  energy: Energy;
  notes: string;
}

const MOOD_OPTIONS: { value: Mood; label: string; color: string }[] = [
  { value: "thriving", label: "Thriving", color: "bg-green-100 text-green-700 border-green-200 dark:bg-green-900/30 dark:text-green-300" },
  { value: "okay", label: "Okay", color: "bg-blue-100 text-blue-700 border-blue-200 dark:bg-blue-900/30 dark:text-blue-300" },
  { value: "low", label: "Low", color: "bg-yellow-100 text-yellow-700 border-yellow-200 dark:bg-yellow-900/30 dark:text-yellow-300" },
  { value: "overwhelmed", label: "Overwhelmed", color: "bg-orange-100 text-orange-700 border-orange-200 dark:bg-orange-900/30 dark:text-orange-300" },
  { value: "shutdown", label: "Shutdown", color: "bg-red-100 text-red-700 border-red-200 dark:bg-red-900/30 dark:text-red-300" },
];

const ENERGY_OPTIONS: { value: Energy; label: string }[] = [
  { value: "full", label: "Full tank" },
  { value: "moderate", label: "Half tank" },
  { value: "low", label: "Running low" },
  { value: "empty", label: "Empty" },
];

const COPING_STRATEGIES: Record<Mood, { title: string; items: string[] }> = {
  thriving: {
    title: "Riding the wave",
    items: ["Use this energy for tasks you've been avoiding", "Connect with someone you care about", "Spend time on a passion project", "Document what's working — you'll want this later"],
  },
  okay: {
    title: "Maintain and restore",
    items: ["Keep to your predictable routine", "Gentle movement (walk, stretch)", "Low-demand creative activity", "Comfortable sensory environment"],
  },
  low: {
    title: "Gentle support",
    items: ["Lower expectations — you're doing enough", "Rest without guilt", "Comfort food, comfort media, comfort space", "Small, manageable tasks only", "Reach out to a trusted person"],
  },
  overwhelmed: {
    title: "Reduce input, restore safety",
    items: ["Reduce sensory input — dim lights, quiet space", "One thing at a time, nothing else", "Grounding: name 5 things you can see", "Permission to cancel/postpone everything non-essential", "Body scan: unclench jaw, soften shoulders"],
  },
  shutdown: {
    title: "You don't need to do anything",
    items: ["Rest without any demands on yourself", "A quiet, dark, comfortable space is medicine", "Weighted blanket, familiar sounds, safe textures", "You are not failing — your nervous system is resting", "When ready: small sip of water, small stretch"],
  },
};

export default function MindMap() {
  const [selectedMood, setSelectedMood] = useState<Mood | null>(null);
  const [selectedEnergy, setSelectedEnergy] = useState<Energy | null>(null);
  const [notes, setNotes] = useState("");
  const [saved, setSaved] = useState(false);
  const [history, setHistory] = useState<MoodEntry[]>(() => {
    try { return JSON.parse(localStorage.getItem("mindmap_history") || "[]"); } catch { return []; }
  });

  useEffect(() => { if (saved) { const t = setTimeout(() => setSaved(false), 2000); return () => clearTimeout(t); } }, [saved]);

  const saveEntry = () => {
    if (!selectedMood || !selectedEnergy) return;
    const entry: MoodEntry = {
      id: crypto.randomUUID(),
      date: new Date().toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" }),
      mood: selectedMood,
      energy: selectedEnergy,
      notes,
    };
    const updated = [entry, ...history].slice(0, 30);
    setHistory(updated);
    localStorage.setItem("mindmap_history", JSON.stringify(updated));
    setNotes("");
    setSaved(true);
  };

  const moodColor = (mood: Mood) => MOOD_OPTIONS.find(m => m.value === mood)?.color || "";

  return (
    <PageShell title="MindMap">
      <div className="max-w-3xl mx-auto">
        <div className="mb-8 flex items-center gap-3">
          <div className="bg-secondary/20 p-2.5 rounded-xl text-secondary">
            <BrainCircuit className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-2xl font-bold">MindMap</h2>
            <p className="text-muted-foreground text-sm">Check in with yourself. No judgment, no pressure.</p>
          </div>
        </div>

        <Tabs defaultValue="checkin" className="w-full">
          <TabsList className="grid grid-cols-3 w-full max-w-sm mb-8 bg-muted/50 p-1 rounded-xl">
            <TabsTrigger value="checkin" className="rounded-lg">Check In</TabsTrigger>
            <TabsTrigger value="coping" className="rounded-lg">Support</TabsTrigger>
            <TabsTrigger value="history" className="rounded-lg">History</TabsTrigger>
          </TabsList>

          <TabsContent value="checkin" className="space-y-6">
            <Card className="border-border/50">
              <CardHeader className="pb-3">
                <CardTitle className="text-base font-medium">How are you today?</CardTitle>
              </CardHeader>
              <CardContent className="space-y-5">
                <div className="flex flex-wrap gap-2">
                  {MOOD_OPTIONS.map(m => (
                    <button
                      key={m.value}
                      onClick={() => setSelectedMood(m.value)}
                      className={`px-4 py-2 rounded-full border text-sm font-medium transition-all ${selectedMood === m.value ? m.color + " border-2" : "bg-muted/30 border-border/50 text-muted-foreground hover:bg-muted"}`}
                      data-testid={`mood-${m.value}`}
                    >
                      {m.label}
                    </button>
                  ))}
                </div>

                <div>
                  <p className="text-sm text-muted-foreground mb-2">Energy level (spoons)</p>
                  <div className="flex flex-wrap gap-2">
                    {ENERGY_OPTIONS.map(e => (
                      <button
                        key={e.value}
                        onClick={() => setSelectedEnergy(e.value)}
                        className={`px-3 py-1.5 rounded-full border text-sm transition-all ${selectedEnergy === e.value ? "bg-primary text-primary-foreground border-primary" : "bg-muted/30 border-border/50 text-muted-foreground hover:bg-muted"}`}
                      >
                        {e.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <p className="text-sm text-muted-foreground mb-2">Notes (optional — just for you)</p>
                  <Textarea
                    placeholder="Anything on your mind..."
                    value={notes}
                    onChange={e => setNotes(e.target.value)}
                    className="resize-none min-h-[80px]"
                    data-testid="mood-notes"
                  />
                </div>

                <Button
                  onClick={saveEntry}
                  disabled={!selectedMood || !selectedEnergy}
                  className="gap-2 w-full sm:w-auto"
                  data-testid="save-checkin"
                >
                  {saved ? <><Leaf className="w-4 h-4" /> Saved</> : <><Save className="w-4 h-4" /> Save check-in</>}
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="coping">
            {selectedMood ? (
              <Card className="border-border/50">
                <CardHeader className="pb-3">
                  <div className="flex items-center gap-2">
                    <Lightbulb className="w-5 h-5 text-primary" />
                    <CardTitle className="text-base">{COPING_STRATEGIES[selectedMood].title}</CardTitle>
                  </div>
                  <p className="text-sm text-muted-foreground">Based on your current mood: <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium ${moodColor(selectedMood)}`}>{selectedMood}</span></p>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    {COPING_STRATEGIES[selectedMood].items.map((item, i) => (
                      <li key={i} className="flex items-start gap-3 text-sm leading-relaxed">
                        <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2 shrink-0" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ) : (
              <div className="text-center py-12 text-muted-foreground">
                <BrainCircuit className="w-10 h-10 mx-auto mb-3 opacity-30" />
                <p className="text-sm">Select a mood in the Check In tab to see personalised support strategies.</p>
              </div>
            )}
          </TabsContent>

          <TabsContent value="history">
            {history.length > 0 ? (
              <div className="space-y-3">
                {history.map(entry => (
                  <Card key={entry.id} className="border-border/40" data-testid={`history-entry-${entry.id}`}>
                    <CardContent className="pt-4 pb-3">
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-center gap-2">
                          <CalendarDays className="w-4 h-4 text-muted-foreground shrink-0" />
                          <span className="text-sm text-muted-foreground">{entry.date}</span>
                        </div>
                        <div className="flex gap-2">
                          <Badge className={`text-xs ${moodColor(entry.mood)}`}>{entry.mood}</Badge>
                          <Badge variant="outline" className="text-xs">{entry.energy}</Badge>
                        </div>
                      </div>
                      {entry.notes && (
                        <p className="text-sm text-foreground/70 mt-2 ml-6 italic">"{entry.notes}"</p>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 text-muted-foreground">
                <CalendarDays className="w-10 h-10 mx-auto mb-3 opacity-30" />
                <p className="text-sm">No check-ins yet. Your history will appear here.</p>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </PageShell>
  );
}
