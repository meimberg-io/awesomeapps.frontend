import React, { useState } from "react";

const ThemeSwitcher: React.FC = () => {
    const [theme, setTheme] = useState("light");

    const changeTheme = (newTheme: string) => {
        document.documentElement.setAttribute("data-theme", newTheme);
        setTheme(newTheme);
    };

    return (
        <div className="flex gap-2">
            {["light", "dark", "cupcake", "emerald", "corporate"].map((themeOption) => (
                <button
                    key={themeOption}
                    className={`btn ${theme === themeOption ? "btn-primary" : ""}`}
                    onClick={() => changeTheme(themeOption)}
                >
                    {themeOption}
                </button>
            ))}
        </div>
    );
};

export default ThemeSwitcher;
