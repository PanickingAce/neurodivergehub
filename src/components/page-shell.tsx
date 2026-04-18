import { ReactNode, useState } from "react";
import { useLocation } from "wouter";
import { ChevronLeft, Settings, Sun, Moon, Contrast, Type, Wind } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { useTheme } from "@/contexts/theme-context";

interface PageShellProps {
  title: string;
  children: ReactNode;
}

export function PageShell({ title, children }: PageShellProps) {
  const [, setLocation] = useLocation();
  const { theme, setTheme, dyslexiaFont, setDyslexiaFont, reducedMotion, setReducedMotion } = useTheme();
  const [settingsOpen, setSettingsOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[hsl(var(--background))] text-[hsl(var(--foreground))]">
      
      {/* 🌿 SOFT HEADER */}
      <header className="sticky top-0 z-50 backdrop-blur-md bg-[hsl(var(--background))]/80">
        <div className="max-w-2xl mx-auto px-4 py-4 flex justify-between items-center">
          
          {/* LEFT */}
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setLocation("/")}
              className="rounded-full opacity-70 hover:opacity-100"
            >
              <ChevronLeft className="w-5 h-5" />
            </Button>

            <div>
              <h1 className="text-lg font-semibold leading-tight">{title}</h1>
              <p className="text-xs text-muted-foreground">
                take it slow, no pressure
              </p>
            </div>
          </div>

          {/* SETTINGS */}
          <Popover open={settingsOpen} onOpenChange={setSettingsOpen}>
            <PopoverTrigger asChild>
              <Button variant="ghost" size="icon" className="rounded-full opacity-70 hover:opacity-100">
                <Settings className="w-4 h-4" />
              </Button>
            </PopoverTrigger>

            <PopoverContent className="w-72 p-4 rounded-2xl shadow-md border border-[hsl(var(--border))]">
              <p className="text-xs font-semibold text-muted-foreground uppercase mb-3">
                display
              </p>

              <div className="space-y-4">

                {/* THEME */}
                <div className="flex items-center justify-between">
                  <Label className="text-sm flex items-center gap-2">
                    <Sun className="w-3.5 h-3.5" /> Theme
                  </Label>
                  <Select value={theme} onValueChange={(v: "dawn" | "night" | "hc") => setTheme(v)}>
                    <SelectTrigger className="w-[110px] h-7 text-xs rounded-lg">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="dawn"><Sun className="w-3 h-3 mr-2" />Dawn</SelectItem>
                      <SelectItem value="night"><Moon className="w-3 h-3 mr-2" />Night</SelectItem>
                      <SelectItem value="hc"><Contrast className="w-3 h-3 mr-2" />High</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* DYSLEXIA FONT */}
                <div className="flex items-center justify-between">
                  <Label className="text-sm flex items-center gap-2 cursor-pointer">
                    <Type className="w-3.5 h-3.5" /> Dyslexia font
                  </Label>
                  <Switch checked={dyslexiaFont} onCheckedChange={setDyslexiaFont} />
                </div>

                {/* MOTION */}
                <div className="flex items-center justify-between">
                  <Label className="text-sm flex items-center gap-2 cursor-pointer">
                    <Wind className="w-3.5 h-3.5" /> Reduce motion
                  </Label>
                  <Switch checked={reducedMotion} onCheckedChange={setReducedMotion} />
                </div>

                {/* FULL SETTINGS */}
                <div className="pt-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="w-full text-xs justify-start opacity-70 hover:opacity-100"
                    onClick={() => {
                      setSettingsOpen(false);
                      setLocation("/settings");
                    }}
                  >
                    <Settings className="w-3.5 h-3.5 mr-2" />
                    full settings
                  </Button>
                </div>

              </div>
            </PopoverContent>
          </Popover>

        </div>
      </header>

      {/* 🌿 MAIN CONTENT */}
      <main className="max-w-2xl mx-auto px-4 py-8 space-y-6">
        {children}
      </main>
    </div>
  );
}