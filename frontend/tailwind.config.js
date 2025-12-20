/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        neon: {
          purple: "#7C3AED",
          teal: "#14B8A6",
          cyan: "#22D3EE"
        },
        chrome: "#E5E7EB"
      },
      boxShadow: {
        neon: '0 20px 60px rgba(124, 58, 237, 0.25)',
        chrome: '0 12px 40px rgba(34, 211, 238, 0.15)'
      },
      backdropBlur: {
        xs: '2px'
      }
    }
  },
  plugins: []
};
