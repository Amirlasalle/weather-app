import type { Config } from "tailwindcss";

export default {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      cursor: {
        fancy: "url(hand.cur), pointer",
      },
      colors: {
        miroRed: "#f50505",
        miroGray: "#555555",
        miroSilver: "#B7BABD",
        caliPopBlue: "#0475d2",
        caliPopsPink: "#de8db9",
        neonGreen: "#73ff01",
        iceCream: "#F4F4E5",
        airbnb: "#ff385c",
        airbnbDark: "#d50027",
        hoverGray: "#F7F7F7",
        outlineDark: "#484848",
        outlineGray: "#b0b0b0",
        default: "#aeaeae",
        spotifyGreen: "#1ed760",
        spotifyLight: "#23f36b",
        dark: "#1b1b1b",
        light: "#f5f5f5",
        primary: "#0088F2",
        // primary: "#05abf2", // 5, 171, 242
        primaryOrange: "#ff7c17", // 80,230,217
        suedeGrey: "#baaba0",
        Pinku: "#B63E96",
        colombianYellow: "#FFCD00",
        colombianBlue: "#003087",
        colombianRed: "#C8102E",
      },
      animation: {
        "spin-slow": "spin 8s linear infinite",
      },
      backgroundImage: {
        circularLight:
          "repeating-radial-gradient(rgba(0,0,0,0.4) 2px,#f5f5f5 5px,#f5f5f5 100px)",

        circularDark:
          "repeating-radial-gradient(rgba(255,255,255,0.5) 2px,#1b1b1b 8px,#1b1b1b 100px)",

        circularLightLg:
          "repeating-radial-gradient(rgba(0,0,0,0.4) 2px,#f5f5f5 5px,#f5f5f5 80px)",

        circularDarkLg:
          "repeating-radial-gradient(rgba(255,255,255,0.5) 2px,#1b1b1b 8px,#1b1b1b 80px)",

        circularLightMd:
          "repeating-radial-gradient(rgba(0,0,0,0.4) 2px,#f5f5f5 5px,#f5f5f5 60px)",

        circularDarkMd:
          "repeating-radial-gradient(rgba(255,255,255,0.5) 2px,#1b1b1b 6px,#1b1b1b 60px)",

        circularLightSm:
          "repeating-radial-gradient(rgba(0,0,0,0.4) 2px,#f5f5f5 5px,#f5f5f5 40px)",

        circularDarkSm:
          "repeating-radial-gradient(rgba(255,255,255,0.5) 2px,#1b1b1b 4px,#1b1b1b 40px)",
      },
    },
    screens: {
      "2xl": { max: "1535px" },
      // => @media (max-width: 1535px) { ... }

      xl: { max: "1279px" },
      // => @media (max-width: 1279px) { ... }

      lgx: { max: "1107px" },
      // => @media (max-width: 1023px) { ... }

      lg: { max: "1023px" },
      // => @media (max-width: 1023px) { ... }
      mdlg: { max: "860px" },
      // => @media (max-width: 860px) { ... }
      md: { max: "767px" },
      // => @media (max-width: 767px) { ... }

      sm: { max: "639px" },
      // => @media (max-width: 639px) { ... }

      xs: { max: "479px" },
      // => @media (max-width: 479px) { ... }

      "2xlmin": { min: "1535px" },
      // => @media (min-width: 1535px) { ... }

      xlmin: { min: "1279px" },
      // => @media (min-width: 1279px) { ... }

      lgxmin: { min: "1107px" },

      lgmin: { min: "1023px" },
      // => @media (min-width: 1023px) { ... }
      mdlgmin: { min: "860px" },
      // => @media (min-width: 860px) { ... }
      mdmin: { min: "767px" },
      // => @media (min-width: 767px) { ... }

      smmin: { min: "639px" },
      // => @media (min-width: 639px) { ... }

      xsmin: { min: "479px" },
    },
  },
  plugins: [],
} satisfies Config;
