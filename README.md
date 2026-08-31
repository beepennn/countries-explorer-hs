# 🌍 Countries Explorer

A modern, responsive country exploration application built with **Next.js 14**, **TypeScript**, and **Tailwind CSS**.

Countries Explorer lets users search, filter, compare, and explore countries from around the world with detailed information such as population, capital cities, regions, languages, currencies, area, and flags.

Country data is retrieved from the **REST Countries v5 API** through a secure Next.js API route, keeping the API key private and avoiding browser CORS issues.

---

## ✨ Features

- 🌍 Browse countries and territories from around the world
- 🔍 Smart search with autocomplete
- 🧭 Search by country name, capital, region, language, currency, or country code
- 🎛️ Advanced filtering
- 📊 Sort countries by name, population, area, region, and capital
- ⚖️ Compare countries side by side
- ❤️ Save favorite countries
- 📄 Pagination for easier browsing
- 🔗 Direct country links using URL parameters
- 🏳️ High-quality country flags
- 📱 Fully responsive layout
- 🌙 Dark and light theme support
- ⚡ Fast client-side filtering and search
- 🔐 Secure server-side REST Countries API integration
- 🚀 Server-side API caching for improved performance
- 🎨 Modern responsive interface using Tailwind CSS

---

## 🖼️ Application Overview

Countries Explorer provides an interactive way to explore global data.

Users can:

- Search for countries instantly
- Browse country flags
- View population and geographic information
- Explore capitals, regions, and subregions
- Discover languages and currencies
- Filter countries using multiple criteria
- Compare multiple countries
- Save favorite countries
- Share direct links to selected countries

---

## 🛠️ Technologies Used

| Technology | Purpose |
| --- | --- |
| **Next.js 14** | React framework and server-side API routes |
| **React 18** | User interface |
| **TypeScript** | Type safety |
| **Tailwind CSS** | Styling and responsive design |
| **REST Countries v5 API** | Country data |
| **Lucide React** | Icons |
| **Radix UI** | Accessible UI primitives |
| **next-themes** | Dark/light theme switching |

---

## 🏗️ Architecture

The application does **not** expose the REST Countries API key to the browser.

Instead, requests flow through a Next.js API route:

```text
Browser
   │
   ▼
/api/countries
   │
   ▼
Next.js Server
   │
   ▼
REST Countries v5 API
```

This architecture provides:

- Better security
- No exposed API keys
- No browser CORS problems
- Centralized API handling
- Server-side caching
- Easier API migrations in the future

---

## 🚀 Getting Started

### Prerequisites

Make sure you have:

- **Node.js 18.17+**
- **npm**
- A **REST Countries v5 API key**

Using a current Node.js LTS release is recommended.

---

## 📦 Installation

### 1. Clone the repository

```bash
git clone https://github.com/YOUR_USERNAME/countries-explorer.git
cd countries-explorer
```

Replace `YOUR_USERNAME` with your GitHub username or update the URL to match your repository.

---

### 2. Install dependencies

```bash
npm install
```

---

### 3. Configure environment variables

Create a file named:

```text
.env.local
```

in the root of the project.

Add your REST Countries API key:

```env
RESTCOUNTRIES_API_KEY=your_api_key_here
```

> [!IMPORTANT]
> Never use `NEXT_PUBLIC_` for this API key.
>
> The API key must remain server-side and should never be committed to Git.

Your `.gitignore` should include:

```text
.env*
```

or at minimum:

```text
.env.local
```

---

### 4. Start the development server

```bash
npm run dev
```

Open:

```text
http://localhost:3000
```

in your browser.

---

## 🔌 API Route

Country data is exposed internally through:

```text
GET /api/countries
```

The route is located at:

```text
app/api/countries/route.ts
```

The server:

1. Authenticates with REST Countries v5
2. Fetches paginated country data
3. Converts the v5 response into the application's internal country format
4. Sorts the countries
5. Returns the normalized data to the frontend
6. Caches responses to reduce unnecessary external API requests

The frontend therefore only needs to request:

```ts
fetch("/api/countries")
```

instead of directly contacting REST Countries.

---

## 📁 Project Structure

```text
countries-explorer/
│
├── app/
│   ├── api/
│   │   └── countries/
│   │       └── route.ts
│   ├── about/
│   ├── api-info/
│   ├── cookies/
│   ├── help/
│   ├── privacy/
│   ├── terms/
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx
│
├── components/
│   ├── ui/
│   ├── advanced-filters.tsx
│   ├── country-comparison.tsx
│   ├── country-detail.tsx
│   ├── country-explorer.tsx
│   ├── country-list.tsx
│   ├── enhanced-search.tsx
│   ├── error-message.tsx
│   ├── favorites-system.tsx
│   ├── footer.tsx
│   ├── header.tsx
│   ├── pagination.tsx
│   └── theme-toggle.tsx
│
├── hooks/
│   └── use-countries.tsx
│
├── lib/
│
├── public/
│
├── types/
│   └── country.ts
│
├── .env.local
├── next.config.js
├── package.json
├── tailwind.config.js
└── tsconfig.json
```

---

## 📜 Available Scripts

### Development

```bash
npm run dev
```

Starts the local Next.js development server.

---

### Production Build

```bash
npm run build
```

Creates an optimized production build.

---

### Production Server

```bash
npm run start
```

Runs the production build locally.

You must run `npm run build` first.

---

### Lint

```bash
npm run lint
```

Runs the project's linting checks.

---

## 🔐 Environment Variables

| Variable | Required | Description |
| --- | --- | --- |
| `RESTCOUNTRIES_API_KEY` | Yes | REST Countries v5 API key used by the server |

Example:

```env
RESTCOUNTRIES_API_KEY=your_api_key_here
```

Do not commit real API keys to the repository.

---

## 🌐 Deployment

### Vercel

**Vercel is the recommended deployment platform** because the project uses Next.js server-side functionality.

1. Push the repository to GitHub
2. Import the repository into Vercel
3. Open the project's environment variable settings
4. Add:

```text
RESTCOUNTRIES_API_KEY
```

5. Set its value to your REST Countries API key
6. Deploy

---

### Other Platforms

The project can also run on platforms that support Next.js server-side routes, including providers such as Netlify.

A purely static hosting service is not sufficient without additional changes because `/api/countries` requires server-side execution.

---

## 🔒 Security

The REST Countries API key is intentionally accessed only from:

```ts
process.env.RESTCOUNTRIES_API_KEY
```

inside the Next.js server route.

It is **never sent directly to the browser**.

Avoid:

```env
NEXT_PUBLIC_RESTCOUNTRIES_API_KEY=...
```

because variables prefixed with `NEXT_PUBLIC_` can be included in client-side JavaScript.

---

## 🎯 Country Data

The application currently works with country information including:

- Common name
- Official name
- Three-letter country code
- Region
- Subregion
- Capital
- Population
- Area
- Languages
- Currencies
- PNG flags
- SVG flags
- Flag descriptions

The external REST Countries v5 response is normalized on the server so frontend components use one consistent `Country` type.

---

## 🧩 Type Safety

The shared country model is defined in:

```text
types/country.ts
```

Components and hooks use this shared type instead of maintaining separate country interfaces.

Example:

```ts
import type { Country } from "@/types/country"
```

This keeps the application consistent and prevents incompatible country data types across components.

---

## 🤝 Contributing

Contributions are welcome.

### 1. Fork the repository

### 2. Create a feature branch

```bash
git checkout -b feature/amazing-feature
```

### 3. Commit your changes

```bash
git commit -m "feat: add amazing feature"
```

### 4. Push the branch

```bash
git push origin feature/amazing-feature
```

### 5. Open a Pull Request

Please make sure the application builds successfully before submitting:

```bash
npm run build
```

---

## 🐛 Reporting Issues

If you find a bug or have a feature request, open an issue in the GitHub repository.

When reporting a bug, include:

- What you expected to happen
- What actually happened
- Steps to reproduce the issue
- Browser and operating system
- Screenshots or console errors when helpful

Never include API keys or other credentials in an issue.

---

## 📄 License

This project is licensed under the **MIT License**.

---

## 🌎 Countries Explorer

Built to make exploring the world's countries simple, fast, and enjoyable.

**Explore. Compare. Discover.**