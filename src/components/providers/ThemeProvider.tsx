"use client";

import * as React from "react";

export type Theme = "light" | "dark" | "system";
type ResolvedTheme = "light" | "dark";

interface ThemeContextValue {
    theme: Theme;
    resolvedTheme: ResolvedTheme;
    setTheme: (theme: Theme) => void;
}

const ThemeContext = React.createContext<ThemeContextValue>({
    theme: "system",
    resolvedTheme: "light",
    setTheme: () => {},
});

const STORAGE_KEY = "theme";
const COOKIE_KEY = "theme";
const COOKIE_MAX_AGE = 60 * 60 * 24 * 365; // 1 year

function getSystemTheme(): ResolvedTheme {
    if (typeof window === "undefined") return "light";
    return window.matchMedia("(prefers-color-scheme: dark)").matches
        ? "dark"
        : "light";
}

/**
 * "system" leaves <html> unclassed so the CSS
 * (@media prefers-color-scheme) decides; light/dark force a class.
 */
function applyThemeClass(theme: Theme) {
    if (typeof document === "undefined") return;
    const root = document.documentElement;
    root.classList.remove("light", "dark");
    if (theme === "light") root.classList.add("light");
    else if (theme === "dark") root.classList.add("dark");
}

function persistTheme(theme: Theme) {
    if (typeof document === "undefined") return;
    try {
        if (theme === "system") {
            document.cookie = `${COOKIE_KEY}=; max-age=0; path=/`;
        } else {
            document.cookie = `${COOKIE_KEY}=${theme}; max-age=${COOKIE_MAX_AGE}; path=/`;
        }
    } catch {
        // cookie unavailable (edge tracking protection) — localStorage still works
    }
}

function readStoredTheme(): Theme {
    if (typeof window === "undefined") return "system";
    try {
        const stored = window.localStorage.getItem(STORAGE_KEY);
        return stored === "light" || stored === "dark" || stored === "system"
            ? stored
            : "system";
    } catch {
        return "system";
    }
}

/**
 * Theme provider without any <script> tag (React 19 warns about scripts
 * rendered by components). The initial class on <html> is rendered by the
 * server from the "theme" cookie, and system preference is handled purely
 * in CSS — so there is no flash of the wrong theme either.
 */
export function ThemeProvider({ children }: { children: React.ReactNode }) {
    const [theme, setThemeState] = React.useState<Theme>("system");
    const [resolvedTheme, setResolvedTheme] =
        React.useState<ResolvedTheme>("light");
    const themeRef = React.useRef<Theme>(theme);
    themeRef.current = theme;

    React.useEffect(() => {
        const stored = readStoredTheme();
        setThemeState(stored);
        applyThemeClass(stored);
        setResolvedTheme(stored === "system" ? getSystemTheme() : stored);

        const media = window.matchMedia("(prefers-color-scheme: dark)");
        const onChange = (event: MediaQueryListEvent) => {
            if (themeRef.current !== "system") return;
            setResolvedTheme(event.matches ? "dark" : "light");
        };
        media.addEventListener("change", onChange);
        return () => media.removeEventListener("change", onChange);
    }, []);

    const setTheme = React.useCallback((next: Theme) => {
        setThemeState(next);
        try {
            window.localStorage.setItem(STORAGE_KEY, next);
        } catch {
            // storage unavailable (private mode) — theme still applies for the session
        }
        persistTheme(next);
        applyThemeClass(next);
        setResolvedTheme(next === "system" ? getSystemTheme() : next);
    }, []);

    const value = React.useMemo(
        () => ({ theme, resolvedTheme, setTheme }),
        [theme, resolvedTheme, setTheme],
    );

    return (
        <ThemeContext.Provider value={value}>
            {children}
        </ThemeContext.Provider>
    );
}

export function useTheme() {
    return React.useContext(ThemeContext);
}
