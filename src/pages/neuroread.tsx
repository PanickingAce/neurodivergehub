import { useState } from "react";
import { PageShell } from "@/components/page-shell";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { BookOpen, Search, ExternalLink, Heart, Star } from "lucide-react";

const BOOKS = [
  {
    id: 1,
    title: "The ADHD Advantage",
    author: "Dale Archer",
    description: "Reframes ADHD traits as strengths. Practical strategies for focus and productivity.",
    tags: ["ADHD", "Strengths-Based", "Non-Fiction"],
    sensory: { textDensity: "Low", chapterLength: "Short", contentWarnings: "None" },
    amazonUrl: "https://www.amazon.com/s?k=The+ADHD+Advantage+Dale+Archer",
    rating: 4.5,
  },
  {
    id: 2,
    title: "Unmasking Autism",
    author: "Devon Price",
    description: "A compassionate guide to understanding and embracing the autistic experience.",
    tags: ["Autism", "Identity", "Self-Acceptance"],
    sensory: { textDensity: "Medium", chapterLength: "Medium", contentWarnings: "Mild Trauma" },
    amazonUrl: "https://www.amazon.com/s?k=Unmasking+Autism+Devon+Price",
    rating: 4.8,
  },
  {
    id: 3,
    title: "Scattered Minds",
    author: "Gabor Maté",
    description: "A compassionate exploration of ADHD — its roots, impacts, and paths to healing.",
    tags: ["ADHD", "Emotional Wellbeing", "Non-Fiction"],
    sensory: { textDensity: "Medium", chapterLength: "Medium", contentWarnings: "Trauma Themes" },
    amazonUrl: "https://www.amazon.com/s?k=Scattered+Minds+Gabor+Mate",
    rating: 4.7,
  },
  {
    id: 4,
    title: "The Highly Sensitive Person",
    author: "Elaine N. Aron",
    description: "Essential reading for understanding hypersensitivity. Validates sensory experiences.",
    tags: ["Hypersensitivity", "Self-Help", "HSP"],
    sensory: { textDensity: "Low", chapterLength: "Short", contentWarnings: "None" },
    amazonUrl: "https://www.amazon.com/s?k=The+Highly+Sensitive+Person+Elaine+Aron",
    rating: 4.6,
  },
  {
    id: 5,
    title: "All the Weight of Our Dreams",
    author: "Lydia X. Z. Brown (ed.)",
    description: "Anthology of writing and art by autistic people of color. Deeply affirming.",
    tags: ["Autism", "Anthology", "BIPOC", "Fiction & Poetry"],
    sensory: { textDensity: "Low", chapterLength: "Very Short", contentWarnings: "Varies by piece" },
    amazonUrl: "https://www.amazon.com/s?k=All+the+Weight+of+Our+Dreams",
    rating: 4.9,
  },
  {
    id: 6,
    title: "Smart but Stuck",
    author: "Thomas E. Brown",
    description: "Explores how intelligent people with ADHD can get 'stuck' and how to break free.",
    tags: ["ADHD", "Executive Function", "Non-Fiction"],
    sensory: { textDensity: "Low", chapterLength: "Short", contentWarnings: "None" },
    amazonUrl: "https://www.amazon.com/s?k=Smart+but+Stuck+Thomas+Brown",
    rating: 4.4,
  },
  {
    id: 7,
    title: "Neurotribes",
    author: "Steve Silberman",
    description: "The history of autism and the push for a more humane world. Award-winning.",
    tags: ["Autism", "History", "Non-Fiction"],
    sensory: { textDensity: "High", chapterLength: "Long", contentWarnings: "Historical Ableism" },
    amazonUrl: "https://www.amazon.com/s?k=Neurotribes+Steve+Silberman",
    rating: 4.7,
  },
  {
    id: 8,
    title: "The Explosive Child",
    author: "Ross W. Greene",
    description: "Practical, compassionate approach to supporting kids with ADHD and sensory challenges.",
    tags: ["ADHD", "Parenting", "Sensory", "Non-Fiction"],
    sensory: { textDensity: "Low", chapterLength: "Short", contentWarnings: "None" },
    amazonUrl: "https://www.amazon.com/s?k=The+Explosive+Child+Ross+Greene",
    rating: 4.5,
  },
];

const DENSITY_COLOR: Record<string, string> = {
  "Very Short": "text-green-600",
  "Short": "text-green-500",
  "Medium": "text-yellow-500",
  "Long": "text-orange-500",
  "Low": "text-green-500",
  "High": "text-orange-500",
};

export default function NeuroRead() {
  const [search, setSearch] = useState("");
  const [filterTag, setFilterTag] = useState("all");
  const [favorites, setFavorites] = useState<number[]>(() => {
    try { return JSON.parse(localStorage.getItem("neuroread_favorites") || "[]"); } catch { return []; }
  });

  const toggleFavorite = (id: number) => {
    const updated = favorites.includes(id) ? favorites.filter(f => f !== id) : [...favorites, id];
    setFavorites(updated);
    localStorage.setItem("neuroread_favorites", JSON.stringify(updated));
  };

  const filtered = BOOKS.filter(b => {
    const matchSearch = b.title.toLowerCase().includes(search.toLowerCase()) || b.author.toLowerCase().includes(search.toLowerCase());
    const matchTag = filterTag === "all" || b.tags.some(t => t.toLowerCase().includes(filterTag.toLowerCase()));
    return matchSearch && matchTag;
  });

  return (
    <PageShell title="NeuroRead">
      <div className="max-w-5xl mx-auto">
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-3">
            <div className="bg-primary/20 p-2.5 rounded-xl text-primary">
              <BookOpen className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-2xl font-bold">NeuroRead</h2>
              <p className="text-muted-foreground text-sm">Books chosen for neurodivergent minds — rated for sensory comfort</p>
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search books or authors..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="pl-9"
              data-testid="search-books"
            />
          </div>
          <Select value={filterTag} onValueChange={setFilterTag}>
            <SelectTrigger className="w-full sm:w-[200px]" data-testid="filter-tag">
              <SelectValue placeholder="Filter by condition" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Books</SelectItem>
              <SelectItem value="adhd">ADHD</SelectItem>
              <SelectItem value="autism">Autism</SelectItem>
              <SelectItem value="hypersensitivity">Hypersensitivity / HSP</SelectItem>
              <SelectItem value="non-fiction">Non-Fiction</SelectItem>
              <SelectItem value="fiction">Fiction & Poetry</SelectItem>
            </SelectContent>
          </Select>
          <Button
            variant={filterTag === "favorites" ? "default" : "outline"}
            onClick={() => setFilterTag(filterTag === "favorites" ? "all" : "favorites")}
            className="gap-2"
            data-testid="filter-favorites"
          >
            <Heart className="w-4 h-4" />
            Saved ({favorites.length})
          </Button>
        </div>

        {filterTag === "favorites" ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {BOOKS.filter(b => favorites.includes(b.id)).map(book => (
              <BookCard key={book.id} book={book} isFavorite={favorites.includes(book.id)} onToggleFavorite={toggleFavorite} />
            ))}
            {favorites.length === 0 && (
              <div className="col-span-2 text-center py-16 text-muted-foreground">
                <Heart className="w-10 h-10 mx-auto mb-3 opacity-30" />
                <p>No saved books yet. Tap the heart on any book to save it.</p>
              </div>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filtered.map(book => (
              <BookCard key={book.id} book={book} isFavorite={favorites.includes(book.id)} onToggleFavorite={toggleFavorite} />
            ))}
            {filtered.length === 0 && (
              <div className="col-span-2 text-center py-16 text-muted-foreground">
                <BookOpen className="w-10 h-10 mx-auto mb-3 opacity-30" />
                <p>No books match your search.</p>
              </div>
            )}
          </div>
        )}
      </div>
    </PageShell>
  );
}

function BookCard({ book, isFavorite, onToggleFavorite }: {
  book: typeof BOOKS[0];
  isFavorite: boolean;
  onToggleFavorite: (id: number) => void;
}) {
  return (
    <Card className="border border-border/50 hover:shadow-md transition-shadow" data-testid={`book-card-${book.id}`}>
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start">
          <div className="flex-1 pr-3">
            <CardTitle className="text-lg leading-snug">{book.title}</CardTitle>
            <p className="text-sm text-muted-foreground mt-0.5">by {book.author}</p>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 rounded-full shrink-0"
            onClick={() => onToggleFavorite(book.id)}
            aria-label={isFavorite ? "Remove from saved" : "Save book"}
            data-testid={`favorite-${book.id}`}
          >
            <Heart className={`w-4 h-4 transition-colors ${isFavorite ? "fill-red-500 text-red-500" : "text-muted-foreground"}`} />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm text-foreground/80 leading-relaxed">{book.description}</p>

        <div className="flex flex-wrap gap-1.5">
          {book.tags.map(tag => (
            <Badge key={tag} variant="secondary" className="text-xs font-normal">{tag}</Badge>
          ))}
        </div>

        <div className="bg-muted/40 rounded-xl p-3 grid grid-cols-3 gap-2 text-xs">
          <div>
            <p className="text-muted-foreground mb-0.5">Text density</p>
            <p className={`font-medium ${DENSITY_COLOR[book.sensory.textDensity] || ""}`}>{book.sensory.textDensity}</p>
          </div>
          <div>
            <p className="text-muted-foreground mb-0.5">Chapter length</p>
            <p className={`font-medium ${DENSITY_COLOR[book.sensory.chapterLength] || ""}`}>{book.sensory.chapterLength}</p>
          </div>
          <div>
            <p className="text-muted-foreground mb-0.5">Warnings</p>
            <p className="font-medium">{book.sensory.contentWarnings}</p>
          </div>
        </div>

        <div className="flex items-center justify-between pt-1">
          <div className="flex items-center gap-1 text-sm text-muted-foreground">
            <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
            <span>{book.rating}</span>
          </div>
          <Button size="sm" variant="outline" className="gap-1.5 text-xs h-8" asChild>
            <a href={book.amazonUrl} target="_blank" rel="noopener noreferrer" data-testid={`amazon-${book.id}`}>
              <ExternalLink className="w-3 h-3" />
              Find on Amazon
            </a>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
