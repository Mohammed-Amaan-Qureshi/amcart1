const config = {
  content: [
    "./src/app/**/*.{ts,tsx,js,jsx}",
    "./src/pages/**/*.{ts,tsx,js,jsx}",
    "./src/components/**/*.{ts,tsx,js,jsx}",
  ],
  theme: { extend: {} },
  plugins: {
    "@tailwindcss/postcss": {},
  },
};

export default config;
