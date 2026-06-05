# Creative Campaign Showcase Portfolio

**"Design Excellence Beyond Limits"**

Luxury creative portfolio with advanced 3D animations, Sanity CMS integration, and brand identity inspired by Mohamed Nabih's design philosophy. Built with Next.js 16, React 19, Three.js, and GSAP.

## Brand Identity

**Tagline**: "IDENTITY THAT BREAKS LIMITS"

### Visual Identity
- **Primary Color**: Neon Magenta `#FF00FF` with glow effects
- **Background**: Deep Dark `#0A0E27`
- **Accent**: Cyan `#00FFFF`
- **Display Font**: CINZEL (bold, elegant, luxury)
- **Body Font**: POPPINS (modern, clean, readable)

## Tech Stack

- **Framework**: Next.js 16 with App Router
- **Styling**: Tailwind CSS v4 with @theme configuration
- **Fonts**: Google Fonts (CINZEL + POPPINS)
- **CMS**: Sanity Studio for headless content management
- **3D Graphics**: Three.js with particle systems
- **Animations**: GSAP (ScrollTrigger), Framer Motion, CSS animations
- **UI Components**: shadcn/ui, custom luxury components
- **Language**: TypeScript 5
- **Image Optimization**: Next.js Image with WebP/AVIF support

## Features

- ✅ **Luxury Design System** - Neon magenta, dark backgrounds, premium typography
- ✅ **3D Animations** - Three.js particle systems, rotating geometries, lighting
- ✅ **Campaign Grid** - Dynamic campaigns with hover glow effects
- ✅ **GSAP Effects** - Scroll-triggered animations, parallax, staggered reveals
- ✅ **Dark/Light Mode** - Complete theme support with persistence
- ✅ **Elegant Loader** - Neon-themed loading screen with animations
- ✅ **Modal Gallery** - Full-screen image gallery with keyboard controls
- ✅ **Responsive Design** - Mobile-first, works on all devices (375px to 3840px+)
- ✅ **Image Optimization** - WebP/AVIF format support, lazy loading
- ✅ **SEO Ready** - Meta tags, structured data, fast page loads
- ✅ **Campaign Bug Fixed** - Slug routing now works correctly (was showing [object%20Object])

## Quick Start

### Installation (5 minutes)

```bash
# 1. Install dependencies
pnpm install

# 2. Create environment file
cp .env.example .env.local

# 3. Add your Sanity project ID
# Edit .env.local:
# NEXT_PUBLIC_SANITY_PROJECT_ID=your_project_id
# NEXT_PUBLIC_SANITY_DATASET=production

# 4. Start development servers
pnpm dev              # Next.js on port 3000
pnpm dev:studio       # Sanity Studio on port 3333

# 5. Open in browser
# http://localhost:3000 (Portfolio)
# http://localhost:3333 (Sanity Studio)
```

### Environment Variables

Required for deployment:
- `NEXT_PUBLIC_SANITY_PROJECT_ID` - Your Sanity project ID
- `NEXT_PUBLIC_SANITY_DATASET` - Dataset name (e.g., "production")
- `NEXT_PUBLIC_SANITY_API_VERSION` - API version (e.g., "2024-01-01")

## Project Structure

```
/app
  ├── layout.tsx                    # Root layout with fonts and providers
  ├── globals.css                   # Tailwind @theme, design tokens, utilities
  ├── page.tsx                      # Homepage with hero & campaigns
  ├── about/page.tsx                # About page
  ├── contact/page.tsx              # Contact page
  ├── case-studies/page.tsx         # Case studies page
  └── campaigns/[slug]/page.tsx     # Campaign detail page

/components
  ├── common/
  │   ├── Header.tsx                # Navigation with theme toggle
  │   ├── Loader.tsx                # Elegant neon loader
  │   └── ThemeToggle.tsx           # Dark/light mode toggle
  ├── campaigns/
  │   └── CampaignGrid.tsx          # Grid with luxury cards & glow
  ├── galleries/
  │   ├── ModalGallery.tsx          # Full-screen image modal
  │   └── GalleryGrid.tsx           # Gallery grid display
  ├── 3d/
  │   ├── AnimatedCanvas.tsx        # Three.js canvas with particles
  │   └── SplineHand.tsx            # 3D hand model
  └── providers/
      ├── ThemeProvider.tsx         # Dark/light mode provider
      ├── LoadingProvider.tsx       # Loading state provider
      └── BarbaProvider.tsx         # Page transition provider

/lib
  ├── sanity.ts                     # Sanity client configuration
  ├── sanity-queries.ts             # GROQ queries for campaigns
  ├── types/index.ts                # TypeScript interfaces
  ├── animations/
  │   ├── gsap-advanced.ts          # Advanced GSAP utilities
  │   └── framer-variants.ts        # Framer Motion variants
  ├── image-optimization.ts         # Image utility functions
  ├── performance.ts                # Web Vitals & monitoring
  └── utils.ts                      # Helper functions

/studio
  └── schemas/
      ├── index.ts                  # Schema exports
      ├── project.ts                # Campaign schema
      ├── gallery.ts                # Gallery schema
      └── service.ts                # Service schema

/public
  ├── fonts/                        # Custom fonts
  └── images/                       # Static images

/documentation
  ├── BRAND_IDENTITY.md             # Design system & colors
  ├── BUG_FIXES.md                  # All bugs fixed
  ├── IMPROVEMENTS.md               # Features added
  ├── SETUP_GUIDE.md                # Detailed setup
  └── IMPLEMENTATION_COMPLETE.md    # Project overview

Configuration Files:
  ├── next.config.mjs               # Next.js optimization config
  ├── sanity.config.ts              # Sanity CMS configuration
  ├── sanity.cli.ts                 # Sanity CLI setup
  ├── tailwind.config.ts            # Tailwind configuration
  └── tsconfig.json                 # TypeScript configuration
```

## Available Scripts

```bash
pnpm dev              # Start Next.js dev server (port 3000)
pnpm build            # Build for production
pnpm start            # Start production server
pnpm lint             # Run ESLint
pnpm type-check       # Check TypeScript errors
pnpm dev:studio       # Start Sanity Studio dev
pnpm studio           # Open Sanity Studio
```

## Animation Patterns

- **Three.js**: Particle systems, rotating geometries, point lighting
- **GSAP ScrollTrigger**: Campaign grid stagger animations on scroll
- **GSAP Timeline**: Parallax effects, text reveals, counter animations
- **Framer Motion**: Gallery transitions, modal animations
- **CSS Animations**: Loading spinner, keyframe sequences

## Design System

### Colors
```css
/* Light Mode */
--color-primary: #FF00FF         /* Neon Magenta */
--color-background: #FFFFFF      /* White */
--color-foreground: #0A0E27      /* Deep Dark */
--color-card: #F3F4F6            /* Light Gray */

/* Dark Mode */
--color-primary: #FF00FF         /* Neon Magenta */
--color-background: #0A0E27      /* Deep Dark */
--color-foreground: #FFFFFF      /* White */
--color-card: #1A1F3A            /* Dark Charcoal */
```

### Typography
```
Headings: CINZEL font-display (bold, elegant)
Body: POPPINS font-body (clean, modern)
```

### Utilities
```css
.neon-glow              /* Magenta glow shadow */
.neon-glow-intense      /* Strong glow for hover */
.text-neon              /* Magenta text with glow */
.luxury-card            /* Premium card styling */
```

## Customization

### Change Primary Color
Edit `/app/globals.css`:
```css
--color-primary: #FF00FF;  /* Change magenta to another color */
```

### Modify Typography
Edit `/app/layout.tsx`:
```typescript
const cinzel = Cinzel({ ... })      /* Change display font */
const poppins = Poppins({ ... })    /* Change body font */
```

### Adjust Animations
- `components/campaigns/CampaignGrid.tsx` - Grid stagger delay
- `components/3d/AnimatedCanvas.tsx` - Particle speed/rotation
- `lib/animations/gsap-advanced.ts` - Global animation speeds

## Performance

### Optimizations Included
- WebP/AVIF image format support
- Responsive image sizing (320px to 3840px)
- GPU-accelerated animations
- CSS minification and tree-shaking
- Code splitting by route
- Lazy loading for images

### Expected Lighthouse Scores
- Performance: 85+
- Accessibility: 95+
- Best Practices: 90+
- SEO: 90+

## Deployment

### Vercel (Recommended)
```bash
# Connect GitHub repository
# Add environment variables in Vercel dashboard
# Deploy automatically on git push
```

### Docker
```dockerfile
FROM node:20-alpine
WORKDIR /app
COPY . .
RUN pnpm install && pnpm build
EXPOSE 3000
CMD ["pnpm", "start"]
```

## Troubleshooting

| Issue | Solution |
|-------|----------|
| Campaign URLs show `[object%20Object]` | ✅ Fixed - upgrade to latest version |
| Images not displaying | Check Sanity dataset and image uploads |
| Fonts not loading | Verify Google Fonts in layout.tsx |
| 3D canvas blank | Check browser WebGL support |

## Documentation

Comprehensive guides available in project:
- **BRAND_IDENTITY.md** - Design system, colors, typography
- **BUG_FIXES.md** - All bugs fixed with details
- **IMPROVEMENTS.md** - Features and enhancements
- **SETUP_GUIDE.md** - Detailed installation guide
- **IMPLEMENTATION_COMPLETE.md** - Project overview

## Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [Sanity Documentation](https://www.sanity.io/docs)
- [Tailwind CSS v4](https://tailwindcss.com/docs)
- [GSAP Docs](https://gsap.com/docs)
- [Three.js](https://threejs.org/docs)
- [Framer Motion](https://www.framer.com/motion/)

## License

MIT License - Use freely for personal and commercial projects.

---

**Version**: 2.0  
**Status**: Production Ready ✅  
**Last Updated**: June 4, 2026

*Breaking Creative Limits Since 2026*
