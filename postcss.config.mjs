const postcssConfig = {
  plugins: {
    "@tailwindcss/postcss": {},
    // Optional: autoprefixer is usually included in @tailwindcss/postcss, 
    // but you can add it explicitly if needed for specific legacy browsers.
    "autoprefixer": {},
  },
};

export default postcssConfig;