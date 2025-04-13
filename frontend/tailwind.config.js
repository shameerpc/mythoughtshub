// tailwind.config.js
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  daisyui: {
    themes: ["light", "dark", "cupcake", "dracula", "bumblebee", "night"], // pick your faves
  },
  plugins: [require("daisyui")],
};
