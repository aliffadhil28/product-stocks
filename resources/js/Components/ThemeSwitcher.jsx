import React, { useContext, useEffect, useState } from "react";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/Components/ui/select"
import { toast } from "sonner";
import { applyTheme } from "@/utils/helper";
import { dashboardThemes as themes } from "@/data/themeList";
import { Switch } from "./ui/switch";
import { ThemeContext } from "@/Contexts/ThemeContext";

export default function ThemeSwitcher() {
    const [themeColor, setThemeColor] = useState("black_white");
    const { theme, toggleTheme } = useContext(ThemeContext);

    useEffect(() => {
        const savedTheme = localStorage.getItem("selectedTheme");
        if (savedTheme) {
            applyTheme(savedTheme);
            setThemeColor(savedTheme);
        }
    }, []);

    const handleThemeChange = (value) => {
        applyTheme(value);
        setThemeColor(value);
    };

    const saveTheme = () => {
        localStorage.setItem("selectedTheme", themeColor);
        toast.success("Theme saved!");
    };

    const resetTheme = () => {
        applyTheme("black_white");
    };

    return (
        <div className="p-4">
            <Select value={themeColor} onValueChange={handleThemeChange}>
                <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select Theme" />
                </SelectTrigger>
                <SelectContent>
                    {themes.map((t) => (
                        <SelectItem key={t.name} value={t.name}>
                            {t.name.replace('_', ' ').replace(/\b\w/g, c => c.toUpperCase())}
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>

            <div className="mt-4 flex gap-2">
                <button
                    className="bg-primary text-primary-foreground px-4 py-2 rounded w-32 truncate"
                    title="Primary"
                >
                    Primary
                </button>
                <button
                    className="bg-secondary text-secondary-foreground px-4 py-2 rounded w-32 truncate"
                    title="Secondary"
                >
                    Secondary
                </button>
            </div>

            <div className="flex gap-2 items-center justify-between mt-4">
                <button
                    className="border rounded text-sm px-3 py-2 w-40 truncate"
                    onClick={resetTheme}
                    title="Reset to Default"
                >
                    Reset to Default
                </button>
                <button
                    className="bg-primary text-primary-foreground rounded text-sm px-3 py-2 w-40 truncate"
                    onClick={saveTheme}
                    title="Save Theme"
                >
                    Save Theme
                </button>
            </div>
            <div className="flex items-center justify-between mt-4">
                <span className="text-sm">{theme === "dark" ? "Light" : "Dark"} Mode</span>
                <Switch
                    checked={theme === "dark"}
                    onCheckedChange={toggleTheme}
                />
            </div>
        </div>
    );
}