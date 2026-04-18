import { useState } from "react";
import { PageShell } from "@/components/page-shell";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";

// ─── CURATED RECIPES ─── Add or edit recipes here ────────────────────────────
const RECIPES = [
  {
    id: 1,
    title: "Gentle Rice Bowl",
    description: "Plain, predictable, comforting. Minimal texture variety. Easy to customise by adding or removing toppings.",
    tags: ["Low-texture", "Mild", "Quick", "5-ingredient"],
    servings: "1–2",
    time: "20 min",
    ingredients: [
      "1 cup white rice",
      "2 cups water",
      "1 tbsp butter or oil",
      "Salt (optional)",
      "Toppings of choice: steamed broccoli, a fried egg, or just plain",
    ],
    instructions: "Rinse rice. Add rice and water to a pot, bring to boil, reduce heat, cover and simmer 15 minutes. Fluff with a fork. Stir in butter and salt. Add toppings if desired.",
    notes: "White rice has a consistent, predictable texture. Skip toppings entirely if texture mixing is difficult.",
  },
  {
    id: 2,
    title: "Plain Pasta with Butter",
    description: "The safe food of safe foods. Consistent, mild, endlessly reliable. No surprises.",
    tags: ["Low-texture", "Mild", "Quick", "Vegetarian"],
    servings: "2",
    time: "15 min",
    ingredients: [
      "200g pasta (penne or spaghetti work well)",
      "2 tbsp butter",
      "Salt for pasta water",
      "Parmesan (optional)",
    ],
    instructions: "Cook pasta in salted boiling water until al dente (check package). Drain, reserving a little pasta water. Return to pot, add butter, stir until melted and coats pasta. Add a splash of pasta water if it needs loosening.",
    notes: "Cook slightly longer than al dente if you prefer softer textures. Penne tends to have a more uniform texture than spaghetti.",
  },
  {
    id: 3,
    title: "Scrambled Eggs (Soft Method)",
    description: "Low-effort, high-protein. The slow-cook method gives a consistent, soft texture throughout.",
    tags: ["Quick", "5-ingredient", "High-protein"],
    servings: "1",
    time: "8 min",
    ingredients: [
      "2–3 eggs",
      "1 tbsp butter",
      "2 tbsp milk or cream",
      "Salt and pepper (optional)",
    ],
    instructions: "Whisk eggs with milk and a pinch of salt. Melt butter in a pan on low heat. Add egg mixture. Stir slowly and constantly with a spatula, moving eggs gently. Remove from heat when just set — they'll continue cooking. Serve immediately.",
    notes: "Low and slow is the key — high heat makes eggs rubbery and unpredictable in texture.",
  },
  {
    id: 4,
    title: "Simple Oat Porridge",
    description: "Warm, smooth, filling. Oats expand to a predictable consistency. Good for slow mornings.",
    tags: ["Low-texture", "Vegetarian", "Warming"],
    servings: "1",
    time: "10 min",
    ingredients: [
      "½ cup rolled oats (not instant — more consistent)",
      "1 cup milk or water (or a mix)",
      "1 tsp honey or sugar (optional)",
      "Pinch of salt",
    ],
    instructions: "Add oats and liquid to a small pot. Heat on medium, stirring frequently, for 5–7 minutes until thick and smooth. Add sweetener and salt to taste.",
    notes: "The texture varies a lot with the liquid ratio — more liquid = thinner. Find your ratio and keep it consistent.",
  },
  {
    id: 5,
    title: "Mild Chicken and Rice",
    description: "Comforting, filling, and predictable. Only mild seasoning — just enough to add flavour without being overwhelming.",
    tags: ["Mild", "High-protein", "ND-friendly"],
    servings: "2",
    time: "30 min",
    ingredients: [
      "2 chicken thighs or breasts",
      "1 cup rice",
      "2 cups chicken stock or water",
      "½ tsp salt",
      "1 tbsp olive oil",
    ],
    instructions: "Cook rice in chicken stock. Meanwhile, heat oil in a pan. Season chicken lightly with salt. Cook on medium heat ~6 min per side until cooked through. Let rest 2 minutes, then slice. Serve over rice.",
    notes: "Stock adds gentle flavour without strong spices. Skip seasoning entirely if preferred.",
  },
  {
    id: 6,
    title: "Banana and Peanut Butter Toast",
    description: "No cooking required. Sweet, filling, and uses familiar textures. One of those meals that requires almost no decision-making.",
    tags: ["No-cook", "5-ingredient", "Quick", "Vegetarian"],
    servings: "1",
    time: "3 min",
    ingredients: [
      "2 slices bread (your preferred kind)",
      "2 tbsp peanut butter (smooth tends to be easier texture-wise)",
      "1 banana",
    ],
    instructions: "Toast bread if preferred. Spread peanut butter. Slice banana and layer on top.",
    notes: "If peanut butter textures are difficult, try sunflower seed butter or plain butter with banana.",
  },
];

export default function Recipes() {
  const [selected, setSelected] = useState<typeof RECIPES[0] | null>(null);

  if (selected) {
    return (
      <PageShell title="Recipes">
        <div className="max-w-2xl mx-auto">
          <button onClick={() => setSelected(null)} className="text-sm text-muted-foreground hover:text-foreground flex items-center gap-1 mb-6">
            ← Back to recipes
          </button>
          <div className="flex flex-wrap gap-1.5 mb-3">
            {selected.tags.map(t => <Badge key={t} variant="secondary" className="text-xs">{t}</Badge>)}
          </div>
          <h2 className="text-2xl font-bold mb-1">{selected.title}</h2>
          <p className="text-muted-foreground text-sm mb-1">{selected.description}</p>
          <div className="flex gap-4 text-xs text-muted-foreground mt-2 mb-6">
            <span>Serves: {selected.servings}</span>
            <span>Time: {selected.time}</span>
          </div>

          <div className="space-y-6">
            <div>
              <h3 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground mb-2">Ingredients</h3>
              <ul className="space-y-1">
                {selected.ingredients.map((ing, i) => (
                  <li key={i} className="text-sm text-foreground/85 flex gap-2">
                    <span className="text-primary mt-1.5 shrink-0">·</span> {ing}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground mb-2">Instructions</h3>
              <p className="text-sm text-foreground/85 leading-relaxed">{selected.instructions}</p>
            </div>
            {selected.notes && (
              <div className="bg-muted/40 rounded-xl px-4 py-3">
                <p className="text-xs font-medium text-muted-foreground mb-1">Note</p>
                <p className="text-sm text-foreground/80">{selected.notes}</p>
              </div>
            )}
          </div>
        </div>
      </PageShell>
    );
  }

  return (
    <PageShell title="Recipes">
      <div className="max-w-2xl mx-auto space-y-6">
        <div>
          <h2 className="text-2xl font-bold mb-1">ND-Friendly Recipes</h2>
          <p className="text-muted-foreground text-sm">
            Curated safe recipes — mild, consistent textures, minimal ingredients, no surprises. More recipes added regularly.
          </p>
        </div>

        <div className="space-y-3">
          {RECIPES.map((recipe, i) => (
            <motion.div
              key={recipe.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.06 }}
            >
              <Card
                className="border-border/50 cursor-pointer hover:border-primary/40 hover:bg-primary/5 transition-colors group"
                onClick={() => setSelected(recipe)}
              >
                <CardHeader className="pb-2">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <CardTitle className="text-base group-hover:text-primary transition-colors">{recipe.title}</CardTitle>
                      <CardDescription className="text-sm mt-0.5">{recipe.description}</CardDescription>
                    </div>
                    <div className="text-xs text-muted-foreground shrink-0 text-right mt-0.5">
                      <p>{recipe.time}</p>
                      <p>Serves {recipe.servings}</p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="flex flex-wrap gap-1">
                    {recipe.tags.map(t => <Badge key={t} variant="secondary" className="text-xs">{t}</Badge>)}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
        <p className="text-xs text-muted-foreground text-center">More recipes coming soon.</p>
      </div>
    </PageShell>
  );
}
