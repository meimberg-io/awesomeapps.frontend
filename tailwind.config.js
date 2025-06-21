module.exports = {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
        './src/styles/**/*.{css,scss}',
    ],
    theme: {
        extend: {
            colors: {
                saprimary: {
                    50: "#feeee6",
                    100: "#fdd7c3",
                    200: "#fc9d6b",
                    300: "#fb8141",
                    400: "#f95905",
                    500: "#d14b04",
                    600: "#ae3e03",
                    700: "#8b3202",
                    800: "#6d2702",
                    900: "#4f1c01",
                    950: "#311101",
                },
                sasecondary: {
                    50: "#e6f6fe",
                    100: "#c3e9fd",
                    200: "#82d2fc",
                    300: "#41bafb",
                    400: "#05a5f9",
                    500: "#036294",
                    600: "#0373ae",
                    700: "#025c8b",
                    800: "#02486d",
                    900: "#01344f",
                    950: "#012131",
                },
            },
        },
    },
    plugins: [require("daisyui")],
    daisyui: {
        themes: ["dark", "black"],
    },
};