import React, { createContext, useContext, useEffect, useState } from "react";

type Theme = "dawn" | "night" | "hc";

interface ThemeContextState {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  dyslexiaFont: boolean;
  setDyslexiaFont: (enabled: boolean) => void;
  reducedMotion: boolean;
  setReducedMotion: (enabled: boolean) => void;
}

const initialState: ThemeContextState = {
  theme: "dawn",
  setTheme: () => null,
  dyslexiaFont: false,
  setDyslexiaFont: () => null,
  reducedMotion: false,
  setReducedMotion: () => null,
};

const ThemeProviderContext = createContext<ThemeContextState>(initialState);

export function ThemeProvider({
  children,
  defaultTheme = "dawn",
  storageKey = "neurodiverge-hub-ui-theme",
}: {
  children: React.ReactNode;
  defaultTheme?: Theme;
  storageKey?: string;
}) {
  const [theme, setTheme] = useState<Theme>(
    () => (localStorage.getItem(storageKey) as Theme) || defaultTheme
  );
  
  const [dyslexiaFont, setDyslexiaFont] = useState<boolean>(
    () => localStorage.getItem(`${storageKey}-font`) === "true"
  );
  
  const [reducedMotion, setReducedMotion] = useState<boolean>(false);

 useEffect(() => {
  const root = window.document.documentElement;

  // remove all themes first
  root.classList.remove("dawn", "night", "contrast");

  // apply current theme
if (theme === "hc") {
  root.classList.add("contrast");
} else {
  root.classList.add(theme);
}

  // dyslexia toggle
  if (dyslexiaFont) {
    root.classList.add("dyslexic");
  } else {
    root.classList.remove("dyslexic");
  }

}, [theme, dyslexiaFont]);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReducedMotion(mediaQuery.matches);
    
    const handler = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
    mediaQuery.addEventListener("change", handler);
    return () => mediaQuery.removeEventListener("change", handler);
  }, []);

  const value = {
    theme,
    setTheme: (theme: Theme) => {
      localStorage.setItem(storageKey, theme);
      setTheme(theme);
    },
    dyslexiaFont,
    setDyslexiaFont: (enabled: boolean) => {
      localStorage.setItem(`${storageKey}-font`, String(enabled));
      setDyslexiaFont(enabled);
    },
    reducedMotion,
    setReducedMotion: (enabled: boolean) => {
      setReducedMotion(enabled);
    },
  };

  return (
    <ThemeProviderContext.Provider value={value}>
      {children}
    </ThemeProviderContext.Provider>
  );
}

export const useTheme = () => {
  const context = useContext(ThemeProviderContext);
  
  if (context === undefined)
    throw new Error("useTheme must be used within a ThemeProvider");
    
  return context;
};
