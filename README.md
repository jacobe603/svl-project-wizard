# SVL Project Wizard

A multi-step project creation wizard built with React and Tailwind CSS. This application provides a clean, intuitive interface for creating new projects with form validation, team assignment, and step-by-step navigation.

## Features

- **4-Step Wizard Flow**: Project Details, Jobsite Location, Team Assignment, and Review
- **Sidebar Navigation**: Track progress and review completed steps
- **Form Validation**: Real-time validation with error messaging
- **Autosuggest**: Project name suggestions based on existing projects
- **Team Management**: Assign team members with primary contact selection
- **Responsive Design**: Clean, modern UI with Tailwind CSS v4

## Tech Stack

- **React 19** - UI framework
- **Vite 7** - Build tool and dev server
- **Tailwind CSS v4** - Utility-first CSS framework
- **Lucide React** - Icon library

## Getting Started

### Prerequisites

- Node.js 18+ installed
- npm or yarn package manager

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/jacobe603/svl-project-wizard.git
   cd svl-project-wizard
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

4. Open http://localhost:5173 in your browser

### Build for Production

```bash
npm run build
```

The built files will be in the `dist` folder.

### Preview Production Build

```bash
npm run preview
```

## Deployment

This app is deployed on Vercel for easy sharing and testing.

### Deployment Steps (Vercel)

1. Push code to GitHub repository
2. Go to [vercel.com/new](https://vercel.com/new)
3. Import the GitHub repository
4. Vercel auto-detects Vite configuration
5. Click "Deploy"
6. Get shareable URL (e.g., `your-app.vercel.app`)

### Alternative Deployment Options

- **Netlify**: Drag and drop `dist` folder or connect GitHub
- **GitHub Pages**: Requires base path configuration in `vite.config.js`
- **Railway/Render**: Connect GitHub for automatic deployments

## Project Structure

```
svl-project-wizard/
├── src/
│   ├── App.jsx        # Main application component
│   ├── main.jsx       # React entry point
│   └── index.css      # Tailwind CSS imports and custom styles
├── index.html         # HTML template
├── vite.config.js     # Vite configuration
├── postcss.config.js  # PostCSS configuration for Tailwind
├── package.json       # Dependencies and scripts
└── README.md          # This file
```

## Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run preview` | Preview production build |

## Configuration

### Tailwind CSS v4

This project uses Tailwind CSS v4 with the new CSS-based configuration. Custom animations are defined in `src/index.css`:

```css
@import "tailwindcss";

@theme {
  --animate-fadeIn: fadeIn 0.2s ease-out;

  @keyframes fadeIn {
    0% { opacity: 0; transform: translateY(-4px); }
    100% { opacity: 1; transform: translateY(0); }
  }
}
```

### Vite Configuration

The Vite config includes the React and Tailwind plugins:

```js
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
})
```

## License

MIT
