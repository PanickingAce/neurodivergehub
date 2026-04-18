import { useState } from "react";
import { PageShell } from "@/components/page-shell";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { useAccount } from "@/contexts/account-context";
import { useListRecipes, useCreateRecipe, useDeleteRecipe } from "@workspace/api-client-react";
import { ChefHat, Plus, X, Clock, User, Trash2, BookOpen } from "lucide-react";

const TAG_OPTIONS = ["ND-friendly", "Low-texture", "Mild", "Quick", "Vegetarian", "Vegan", "Gluten-free", "Dairy-free", "5-ingredient", "No-cook"];

export default function CommunityRecipes() {
  const { account, isLoggedIn } = useAccount();
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    title: "",
    description: "",
    ingredients: "",
    instructions: "",
    tags: [] as string[],
  });
  const [formError, setFormError] = useState("");
  const [formSuccess, setFormSuccess] = useState("");

  const { data: recipes = [], refetch } = useListRecipes();
  const createMutation = useCreateRecipe();
  const deleteMutation = useDeleteRecipe();

  const toggleTag = (tag: string) => {
    setForm(f => ({
      ...f,
      tags: f.tags.includes(tag) ? f.tags.filter(t => t !== tag) : [...f.tags, tag],
    }));
  };

  const handleSubmit = async () => {
    if (!form.title.trim() || !form.description.trim() || !form.ingredients.trim() || !form.instructions.trim()) {
      setFormError("Please fill in all required fields.");
      return;
    }
    setFormError("");
    try {
      await createMutation.mutateAsync({
        data: {
          title: form.title.trim(),
          description: form.description.trim(),
          ingredients: form.ingredients.trim(),
          instructions: form.instructions.trim(),
          tags: form.tags.join(", "),
          authorName: account?.displayName || "Anonymous",
        },
      });
      setForm({ title: "", description: "", ingredients: "", instructions: "", tags: [] });
      setShowForm(false);
      setFormSuccess("Recipe shared with the community!");
      setTimeout(() => setFormSuccess(""), 4000);
      refetch();
    } catch {
      setFormError("Could not submit recipe. Please try again.");
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await deleteMutation.mutateAsync({ id });
      refetch();
    } catch {
      // silent
    }
  };

  return (
    <PageShell title="Community Recipes">
      <div className="max-w-2xl mx-auto space-y-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold mb-1">Community Recipes</h2>
            <p className="text-muted-foreground text-sm">Safe, sensory-friendly recipes shared by our community. No overwhelming flavours, no pressure.</p>
          </div>
          {isLoggedIn && (
            <Button onClick={() => setShowForm(v => !v)} size="sm" className="gap-2 shrink-0">
              <Plus className="w-4 h-4" /> Share recipe
            </Button>
          )}
        </div>

        {!isLoggedIn && (
          <div className="bg-muted/40 rounded-xl px-4 py-3 text-sm text-muted-foreground flex items-center gap-2">
            <User className="w-4 h-4 shrink-0" />
            Sign in via Settings to share your own recipes.
          </div>
        )}

        {formSuccess && (
          <div className="bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 text-sm px-4 py-3 rounded-xl">
            {formSuccess}
          </div>
        )}

        {showForm && isLoggedIn && (
          <Card className="border-primary/30 bg-primary/5">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base flex items-center gap-2">
                  <ChefHat className="w-4 h-4" /> Add your recipe
                </CardTitle>
                <Button variant="ghost" size="icon" className="w-7 h-7" onClick={() => setShowForm(false)}>
                  <X className="w-4 h-4" />
                </Button>
              </div>
              <CardDescription>Sharing as <strong>{account?.displayName}</strong></CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {formError && (
                <div className="text-red-600 dark:text-red-400 text-xs">{formError}</div>
              )}
              <div>
                <Label className="text-xs mb-1 block">Recipe name *</Label>
                <Input value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} placeholder="e.g. Gentle rice bowl" />
              </div>
              <div>
                <Label className="text-xs mb-1 block">Short description *</Label>
                <Input value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} placeholder="What makes this recipe ND-friendly?" />
              </div>
              <div>
                <Label className="text-xs mb-1 block">Ingredients * (one per line)</Label>
                <Textarea value={form.ingredients} onChange={e => setForm(f => ({ ...f, ingredients: e.target.value }))} placeholder={"1 cup rice\n2 cups water\n..."} className="min-h-[90px] text-sm" />
              </div>
              <div>
                <Label className="text-xs mb-1 block">Instructions *</Label>
                <Textarea value={form.instructions} onChange={e => setForm(f => ({ ...f, instructions: e.target.value }))} placeholder="Step by step instructions..." className="min-h-[90px] text-sm" />
              </div>
              <div>
                <Label className="text-xs mb-1.5 block">Tags</Label>
                <div className="flex flex-wrap gap-1.5">
                  {TAG_OPTIONS.map(tag => (
                    <button
                      key={tag}
                      onClick={() => toggleTag(tag)}
                      className={`text-xs px-2.5 py-1 rounded-full border transition-colors ${form.tags.includes(tag) ? "bg-primary text-primary-foreground border-primary" : "border-border text-muted-foreground hover:border-primary/50"}`}
                    >
                      {tag}
                    </button>
                  ))}
                </div>
              </div>
              <Button onClick={handleSubmit} disabled={createMutation.isPending} className="w-full">
                {createMutation.isPending ? "Sharing..." : "Share with community"}
              </Button>
            </CardContent>
          </Card>
        )}

        {recipes.length === 0 ? (
          <div className="text-center py-16">
            <BookOpen className="w-10 h-10 text-muted-foreground/30 mx-auto mb-3" />
            <p className="text-muted-foreground text-sm">No recipes yet. Be the first to share one!</p>
          </div>
        ) : (
          <div className="space-y-4">
            {[...recipes].reverse().map(recipe => {
              const tags = recipe.tags ? recipe.tags.split(", ").filter(Boolean) : [];
              const isOwn = account?.displayName === recipe.authorName;
              return (
                <Card key={recipe.id} className="border-border/50">
                  <CardHeader className="pb-2">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <CardTitle className="text-base">{recipe.title}</CardTitle>
                        <p className="text-sm text-muted-foreground mt-0.5">{recipe.description}</p>
                      </div>
                      {isOwn && (
                        <Button
                          variant="ghost"
                          size="icon"
                          className="w-7 h-7 text-muted-foreground hover:text-red-500 shrink-0"
                          onClick={() => handleDelete(recipe.id)}
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </Button>
                      )}
                    </div>
                    <div className="flex items-center gap-3 text-xs text-muted-foreground mt-1">
                      <span className="flex items-center gap-1"><User className="w-3 h-3" />{recipe.authorName}</span>
                      <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{new Date(recipe.createdAt).toLocaleDateString()}</span>
                    </div>
                    {tags.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-2">
                        {tags.map(tag => <Badge key={tag} variant="secondary" className="text-xs">{tag}</Badge>)}
                      </div>
                    )}
                  </CardHeader>
                  <CardContent className="pt-0">
                    <details className="group">
                      <summary className="text-xs text-primary cursor-pointer select-none py-1 hover:underline">Show ingredients & instructions</summary>
                      <div className="mt-3 space-y-3 text-sm">
                        <div>
                          <p className="font-medium text-xs uppercase tracking-wide text-muted-foreground mb-1">Ingredients</p>
                          <ul className="space-y-0.5 text-sm">
                            {recipe.ingredients.split("\n").map((line, i) => (
                              <li key={i} className="text-foreground/80">{line}</li>
                            ))}
                          </ul>
                        </div>
                        <div>
                          <p className="font-medium text-xs uppercase tracking-wide text-muted-foreground mb-1">Instructions</p>
                          <p className="text-foreground/80 whitespace-pre-line leading-relaxed">{recipe.instructions}</p>
                        </div>
                      </div>
                    </details>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </PageShell>
  );
}
