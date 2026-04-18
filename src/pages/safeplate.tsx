import { useState } from "react";
import { PageShell } from "@/components/page-shell";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Utensils, Plus, X, ChefHat, ExternalLink } from "lucide-react";

interface SafeFood {
  id: string;
  name: string;
  texture: string;
  notes: string;
}

interface Aversion {
  id: string;
  type: "texture" | "flavor" | "smell" | "temperature";
  value: string;
}

const RECIPES = [
  { name: "Beige Pasta", safeTags: ["soft", "plain", "mild"], description: "Plain pasta with butter. No sauce, no surprise textures. Reliable every time.", amazonUrl: "https://www.amazon.com/s?k=plain+pasta+buttered+recipe+book+ARFID" },
  { name: "Gentle Rice Bowl", safeTags: ["soft", "bland", "warm"], description: "Steamed rice with a light drizzle of olive oil and salt. Simple, predictable.", amazonUrl: "" },
  { name: "Crispy Cheese Toast", safeTags: ["crunchy", "cheese", "warm"], description: "Toast topped with melted cheddar. Uniform crunch, nothing hidden inside.", amazonUrl: "" },
  { name: "Smooth Soup", safeTags: ["smooth", "warm", "mild"], description: "Blended vegetable soup — no chunks, no surprise bits. Creamy and calming.", amazonUrl: "" },
  { name: "Soft Scrambled Eggs", safeTags: ["soft", "mild", "warm"], description: "Low and slow scrambled eggs — silky texture, no browning or crispy bits.", amazonUrl: "" },
  { name: "Plain Quesadilla", safeTags: ["crispy", "cheese", "mild"], description: "Two tortillas with melted cheese. Predictable crunch, simple flavors.", amazonUrl: "" },
];

const TEXTURE_OPTIONS = ["soft", "crunchy", "smooth", "chewy", "crispy", "mushy", "grainy", "stringy", "lumpy"];
const FLAVOR_OPTIONS = ["spicy", "bitter", "sour", "strong-smell", "overly-sweet", "overly-salty", "acidic"];

export default function SafePlate() {
  const [safeFoods, setSafeFoods] = useState<SafeFood[]>(() => {
    try { return JSON.parse(localStorage.getItem("safeplate_foods") || "[]"); } catch { return []; }
  });
  const [aversions, setAversions] = useState<Aversion[]>(() => {
    try { return JSON.parse(localStorage.getItem("safeplate_aversions") || "[]"); } catch { return []; }
  });
  const [newFood, setNewFood] = useState({ name: "", texture: "", notes: "" });
  const [newAversion, setNewAversion] = useState<{ type: "texture" | "flavor" | "smell" | "temperature"; value: string }>({ type: "texture", value: "" });

  const saveToStorage = (foods: SafeFood[], avs: Aversion[]) => {
    localStorage.setItem("safeplate_foods", JSON.stringify(foods));
    localStorage.setItem("safeplate_aversions", JSON.stringify(avs));
  };

  const addFood = () => {
    if (!newFood.name.trim()) return;
    const updated = [...safeFoods, { id: crypto.randomUUID(), ...newFood }];
    setSafeFoods(updated);
    saveToStorage(updated, aversions);
    setNewFood({ name: "", texture: "", notes: "" });
  };

  const removeFood = (id: string) => {
    const updated = safeFoods.filter(f => f.id !== id);
    setSafeFoods(updated);
    saveToStorage(updated, aversions);
  };

  const addAversion = (value: string) => {
    if (!value || aversions.some(a => a.value === value)) return;
    const updated = [...aversions, { id: crypto.randomUUID(), type: newAversion.type, value }];
    setAversions(updated);
    saveToStorage(safeFoods, updated);
  };

  const removeAversion = (id: string) => {
    const updated = aversions.filter(a => a.id !== id);
    setAversions(updated);
    saveToStorage(safeFoods, updated);
  };

  const suggestedRecipes = RECIPES.filter(r =>
    !r.safeTags.some(tag => aversions.some(a => a.value === tag))
  );

  return (
    <PageShell title="SafePlate">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8 flex items-center gap-3">
          <div className="bg-accent/50 p-2.5 rounded-xl text-foreground">
            <Utensils className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-2xl font-bold">SafePlate</h2>
            <p className="text-muted-foreground text-sm">Track your safe foods and find recipes that won't surprise you</p>
          </div>
        </div>

        <Tabs defaultValue="safe-foods" className="w-full">
          <TabsList className="grid grid-cols-3 w-full max-w-md mb-8 bg-muted/50 p-1 rounded-xl">
            <TabsTrigger value="safe-foods" className="rounded-lg">Safe Foods</TabsTrigger>
            <TabsTrigger value="aversions" className="rounded-lg">Aversions</TabsTrigger>
            <TabsTrigger value="recipes" className="rounded-lg">Recipes</TabsTrigger>
          </TabsList>

          <TabsContent value="safe-foods">
            <Card className="border-border/50 mb-4">
              <CardHeader className="pb-3">
                <CardTitle className="text-base">Add a safe food</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <Label className="text-xs mb-1 block">Food name</Label>
                    <Input placeholder="e.g. Plain crackers" value={newFood.name} onChange={e => setNewFood({ ...newFood, name: e.target.value })} data-testid="input-food-name" />
                  </div>
                  <div>
                    <Label className="text-xs mb-1 block">Texture</Label>
                    <Input placeholder="e.g. Crunchy, dry" value={newFood.texture} onChange={e => setNewFood({ ...newFood, texture: e.target.value })} />
                  </div>
                </div>
                <Input placeholder="Notes (optional)" value={newFood.notes} onChange={e => setNewFood({ ...newFood, notes: e.target.value })} />
                <Button onClick={addFood} className="gap-2" data-testid="add-safe-food">
                  <Plus className="w-4 h-4" /> Add Food
                </Button>
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              {safeFoods.map(food => (
                <Card key={food.id} className="border-border/40 bg-card/50" data-testid={`safe-food-${food.id}`}>
                  <CardContent className="pt-4 pb-3">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-medium">{food.name}</p>
                        {food.texture && <p className="text-xs text-muted-foreground mt-0.5">{food.texture}</p>}
                        {food.notes && <p className="text-xs text-muted-foreground/70 mt-1 italic">{food.notes}</p>}
                      </div>
                      <Button variant="ghost" size="icon" className="h-7 w-7 shrink-0" onClick={() => removeFood(food.id)}>
                        <X className="w-3.5 h-3.5" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
              {safeFoods.length === 0 && (
                <div className="col-span-3 text-center py-12 text-muted-foreground">
                  <Utensils className="w-8 h-8 mx-auto mb-2 opacity-30" />
                  <p className="text-sm">No safe foods added yet. Start building your list above.</p>
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="aversions">
            <Card className="border-border/50 mb-6">
              <CardHeader className="pb-3">
                <CardTitle className="text-base">Common texture aversions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2 mb-4">
                  {TEXTURE_OPTIONS.map(t => (
                    <Button
                      key={t}
                      variant={aversions.some(a => a.value === t) ? "default" : "outline"}
                      size="sm"
                      className="h-8 text-xs capitalize"
                      onClick={() => aversions.some(a => a.value === t) ? removeAversion(aversions.find(a => a.value === t)!.id) : addAversion(t)}
                    >
                      {t}
                    </Button>
                  ))}
                </div>
                <p className="text-sm font-medium text-muted-foreground mb-3">Flavor / smell aversions</p>
                <div className="flex flex-wrap gap-2">
                  {FLAVOR_OPTIONS.map(f => (
                    <Button
                      key={f}
                      variant={aversions.some(a => a.value === f) ? "default" : "outline"}
                      size="sm"
                      className="h-8 text-xs"
                      onClick={() => aversions.some(a => a.value === f) ? removeAversion(aversions.find(a => a.value === f)!.id) : addAversion(f)}
                    >
                      {f.replace(/-/g, " ")}
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>

            {aversions.length > 0 && (
              <div>
                <p className="text-sm text-muted-foreground mb-3">Your current aversions ({aversions.length}):</p>
                <div className="flex flex-wrap gap-2">
                  {aversions.map(a => (
                    <Badge key={a.id} variant="secondary" className="gap-1.5 pr-1.5 py-1">
                      {a.value}
                      <button onClick={() => removeAversion(a.id)} className="ml-1 rounded-full hover:bg-muted">
                        <X className="w-3 h-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </TabsContent>

          <TabsContent value="recipes">
            <div className="mb-4">
              <p className="text-sm text-muted-foreground">
                {aversions.length > 0
                  ? `Showing recipes that avoid your ${aversions.length} aversion(s).`
                  : "Add aversions to get more personalised suggestions."}
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {suggestedRecipes.map(recipe => (
                <Card key={recipe.name} className="border-border/40 hover:shadow-md transition-shadow">
                  <CardHeader className="pb-2">
                    <div className="flex items-center gap-2">
                      <ChefHat className="w-4 h-4 text-muted-foreground" />
                      <CardTitle className="text-base">{recipe.name}</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <p className="text-sm text-foreground/80">{recipe.description}</p>
                    <div className="flex flex-wrap gap-1.5">
                      {recipe.safeTags.map(tag => (
                        <Badge key={tag} variant="outline" className="text-xs capitalize">{tag}</Badge>
                      ))}
                    </div>
                    {recipe.amazonUrl && (
                      <Button size="sm" variant="outline" className="gap-1.5 text-xs h-8 w-full" asChild>
                        <a href={recipe.amazonUrl} target="_blank" rel="noopener noreferrer">
                          <ExternalLink className="w-3 h-3" /> Find Cookbook on Amazon
                        </a>
                      </Button>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </PageShell>
  );
}
