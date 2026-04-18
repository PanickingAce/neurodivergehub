import { useState } from "react";
import { PageShell } from "@/components/page-shell";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Library, Plus, X, ExternalLink, BookMarked } from "lucide-react";

interface SensoryRating {
  textDensity: number;
  chapterLength: number;
  linearPlot: number;
  contentIntensity: number;
  descriptionDetail: number;
}

interface ShelfBook {
  id: string;
  title: string;
  author: string;
  amazonUrl: string;
  ratings: SensoryRating;
  notes: string;
  addedAt: string;
}

const RATING_LABELS: Record<keyof SensoryRating, { label: string; low: string; high: string }> = {
  textDensity: { label: "Text density", low: "Airy / spaced out", high: "Dense / wall-of-text" },
  chapterLength: { label: "Chapter length", low: "Very short (bite-sized)", high: "Long / no stopping points" },
  linearPlot: { label: "Plot structure", low: "Non-linear / jumps around", high: "Very linear / predictable" },
  contentIntensity: { label: "Emotional intensity", low: "Gentle / calm", high: "Intense / heavy content" },
  descriptionDetail: { label: "Sensory descriptions", low: "Minimal", high: "Very vivid / detailed" },
};

const DEFAULT_RATINGS: SensoryRating = { textDensity: 5, chapterLength: 5, linearPlot: 5, contentIntensity: 3, descriptionDetail: 5 };

export default function SensoryShelf() {
  const [shelf, setShelf] = useState<ShelfBook[]>(() => {
    try { return JSON.parse(localStorage.getItem("sensoryshelf_books") || "[]"); } catch { return []; }
  });
  const [adding, setAdding] = useState(false);
  const [form, setForm] = useState({ title: "", author: "", amazonUrl: "", notes: "" });
  const [ratings, setRatings] = useState<SensoryRating>(DEFAULT_RATINGS);

  const saveBook = () => {
    if (!form.title.trim()) return;
    const book: ShelfBook = {
      id: crypto.randomUUID(),
      ...form,
      ratings,
      addedAt: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
    };
    const updated = [book, ...shelf];
    setShelf(updated);
    localStorage.setItem("sensoryshelf_books", JSON.stringify(updated));
    setForm({ title: "", author: "", amazonUrl: "", notes: "" });
    setRatings(DEFAULT_RATINGS);
    setAdding(false);
  };

  const removeBook = (id: string) => {
    const updated = shelf.filter(b => b.id !== id);
    setShelf(updated);
    localStorage.setItem("sensoryshelf_books", JSON.stringify(updated));
  };

  const safeBooks = shelf.filter(b => b.ratings.textDensity <= 4 && b.ratings.contentIntensity <= 4 && b.ratings.chapterLength <= 4);

  return (
    <PageShell title="SensoryShelf">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-accent/50 p-2.5 rounded-xl text-foreground">
              <Library className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-2xl font-bold">SensoryShelf</h2>
              <p className="text-muted-foreground text-sm">Rate books by sensory factors. Build your safe library.</p>
            </div>
          </div>
          <Button onClick={() => setAdding(!adding)} className="gap-2" data-testid="add-book-toggle">
            {adding ? <><X className="w-4 h-4" /> Cancel</> : <><Plus className="w-4 h-4" /> Add Book</>}
          </Button>
        </div>

        {adding && (
          <Card className="border-primary/30 mb-8 shadow-sm">
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Rate a book</CardTitle>
            </CardHeader>
            <CardContent className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <Label className="text-xs mb-1 block">Book title *</Label>
                  <Input placeholder="e.g. The Midnight Library" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} data-testid="input-book-title" />
                </div>
                <div>
                  <Label className="text-xs mb-1 block">Author</Label>
                  <Input placeholder="e.g. Matt Haig" value={form.author} onChange={e => setForm({ ...form, author: e.target.value })} />
                </div>
              </div>
              <div>
                <Label className="text-xs mb-1 block">Amazon link (optional)</Label>
                <Input placeholder="https://amazon.com/..." value={form.amazonUrl} onChange={e => setForm({ ...form, amazonUrl: e.target.value })} />
              </div>

              <div className="space-y-5 py-2">
                <p className="text-sm font-medium text-muted-foreground">Sensory ratings (1 = low, 10 = high)</p>
                {(Object.keys(RATING_LABELS) as (keyof SensoryRating)[]).map(key => (
                  <div key={key} className="space-y-2">
                    <div className="flex justify-between items-center">
                      <Label className="text-sm">{RATING_LABELS[key].label}</Label>
                      <span className="text-sm font-medium text-primary">{ratings[key]}/10</span>
                    </div>
                    <Slider
                      value={[ratings[key]]}
                      onValueChange={([v]) => setRatings({ ...ratings, [key]: v })}
                      min={1} max={10} step={1}
                      className="w-full"
                    />
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>{RATING_LABELS[key].low}</span>
                      <span>{RATING_LABELS[key].high}</span>
                    </div>
                  </div>
                ))}
              </div>

              <div>
                <Label className="text-xs mb-1 block">Personal notes</Label>
                <Input placeholder="Anything else to remember..." value={form.notes} onChange={e => setForm({ ...form, notes: e.target.value })} />
              </div>

              <Button onClick={saveBook} disabled={!form.title.trim()} data-testid="save-book">
                Save to shelf
              </Button>
            </CardContent>
          </Card>
        )}

        <Tabs defaultValue="all" className="w-full">
          <TabsList className="grid grid-cols-2 w-full max-w-xs mb-6 bg-muted/50 p-1 rounded-xl">
            <TabsTrigger value="all" className="rounded-lg">All Books ({shelf.length})</TabsTrigger>
            <TabsTrigger value="safe" className="rounded-lg">Safe Reads ({safeBooks.length})</TabsTrigger>
          </TabsList>

          <TabsContent value="all">
            <BookGrid books={shelf} onRemove={removeBook} />
          </TabsContent>
          <TabsContent value="safe">
            <p className="text-sm text-muted-foreground mb-4">Books rated low on text density, emotional intensity, and chapter length.</p>
            <BookGrid books={safeBooks} onRemove={removeBook} />
          </TabsContent>
        </Tabs>
      </div>
    </PageShell>
  );
}

function BookGrid({ books, onRemove }: { books: ShelfBook[]; onRemove: (id: string) => void }) {
  if (books.length === 0) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        <BookMarked className="w-10 h-10 mx-auto mb-3 opacity-30" />
        <p className="text-sm">No books yet. Add your first rating above.</p>
      </div>
    );
  }
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      {books.map(book => (
        <Card key={book.id} className="border-border/40 hover:shadow-md transition-shadow" data-testid={`shelf-book-${book.id}`}>
          <CardHeader className="pb-2">
            <div className="flex justify-between items-start">
              <div className="flex-1 pr-3">
                <CardTitle className="text-base leading-snug">{book.title}</CardTitle>
                {book.author && <p className="text-xs text-muted-foreground mt-0.5">by {book.author}</p>}
              </div>
              <Button variant="ghost" size="icon" className="h-7 w-7 shrink-0" onClick={() => onRemove(book.id)}>
                <X className="w-3.5 h-3.5" />
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="grid grid-cols-2 gap-x-4 gap-y-1.5">
              {(Object.keys(RATING_LABELS) as (keyof SensoryRating)[]).map(key => (
                <div key={key} className="text-xs">
                  <span className="text-muted-foreground">{RATING_LABELS[key].label}: </span>
                  <span className={`font-medium ${book.ratings[key] <= 3 ? "text-green-600 dark:text-green-400" : book.ratings[key] >= 7 ? "text-orange-500" : ""}`}>
                    {book.ratings[key]}/10
                  </span>
                </div>
              ))}
            </div>
            {book.notes && <p className="text-xs text-muted-foreground italic">"{book.notes}"</p>}
            <div className="flex items-center justify-between pt-1">
              <span className="text-xs text-muted-foreground">{book.addedAt}</span>
              {book.amazonUrl && (
                <Button size="sm" variant="outline" className="gap-1 text-xs h-7 px-2" asChild>
                  <a href={book.amazonUrl} target="_blank" rel="noopener noreferrer">
                    <ExternalLink className="w-3 h-3" /> Amazon
                  </a>
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
