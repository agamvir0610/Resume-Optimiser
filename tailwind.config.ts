import type { Config } from "tailwindcss";
const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      boxShadow: {
        card: "0 10px 20px rgba(0,0,0,0.06), 0 6px 6px rgba(0,0,0,0.08)"
      }
    }
  },
  plugins: []
};
export default config;
