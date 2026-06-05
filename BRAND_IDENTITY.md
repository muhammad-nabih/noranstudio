# Brand Identity & Design System

## Overview
This portfolio has been redesigned with a luxury creative identity inspired by Mohamed Nabih's design philosophy: **IDENTITY THAT BREAKS LIMITS**.

## Color System

### Primary Colors
- **Magenta/Neon Pink**: `#FF00FF` - Bold, modern, eye-catching
- **Dark Background**: `#0A0E27` - Deep, sophisticated dark blue-black
- **Accent Cyan**: `#00FFFF` - Complementary neon accent

### Light Mode
- Background: `#FFFFFF` (Pure white)
- Text: `#0A0E27` (Dark ink)
- Cards: `#F3F4F6` (Light gray)
- Primary: `#FF00FF` (Neon magenta)

### Dark Mode
- Background: `#0A0E27` (Deep dark)
- Text: `#FFFFFF` (Pure white)
- Cards: `#1A1F3A` (Dark charcoal)
- Primary: `#FF00FF` (Neon magenta)

## Typography

### Fonts Used
1. **CINZEL** (Google Fonts)
   - Purpose: Display headings and titles
   - Weights: 400, 500, 600, 700, 800, 900
   - Style: Elegant, bold, timeless
   - Usage: All major headings (h1, h2)

2. **POPPINS** (Google Fonts)
   - Purpose: Body text and secondary headings
   - Weights: 300, 400, 500, 600, 700, 800
   - Style: Modern, clean, highly readable
   - Usage: Body text, descriptions, UI elements

### Typography Scale
```
h1: CINZEL 5xl-7xl (font-display)
h2: CINZEL 4xl-5xl (font-display)
h3: CINZEL 2xl-3xl (font-display)
Body: POPPINS regular (font-body)
Small: POPPINS 12px
```

## Design Elements

### Neon Glow Effects
```css
.neon-glow {
  box-shadow: 0 0 20px rgba(255, 0, 255, 0.4), 0 0 40px rgba(255, 0, 255, 0.2);
}

.neon-glow-intense {
  box-shadow: 0 0 30px rgba(255, 0, 255, 0.6), 0 0 60px rgba(255, 0, 255, 0.3);
}

.text-neon {
  color: #ff00ff;
  text-shadow: 0 0 10px rgba(255, 0, 255, 0.8), 0 0 20px rgba(255, 0, 255, 0.4);
}
```

### Luxury Cards
- Rounded corners: 8px radius
- Border: 1px solid primary/20 (subtle)
- Backdrop blur: Glassmorphism effect
- Hover state: Border changes to primary/50, background increases opacity
- Accent line: Gradient top border on hover

### Loading Experience
- Elegant spinner with neon border
- "Loading Experience" text with CINZEL font
- "CRAFTING EXCELLENCE" subtitle
- Three pulsing dots animation
- Dark semi-transparent overlay with backdrop blur

## Page Structure

### Hero Section
- CINZEL display headings with neon text glow
- "IDENTITY THAT BREAKS LIMITS" tagline
- Three.js animated background with particles and 3D shapes
- Call-to-action buttons with neon glow
- Spline 3D hand model on the right

### Featured Campaigns Section
- "FEATURED WORKS" section label
- Campaign grid with luxury card styling
- Cards have:
  - Background image with brightness control
  - Dark overlay gradient
  - Title and description on hover
  - Smooth scale and glow transitions
  - Neon accent line on top

### CTA Section
- "READY TO COLLABORATE" section label
- Gradient background accent
- "Create Something Amazing" heading
- Call-to-action button with neon glow

## Animation Library

### GSAP Animations
- Hero section: Staggered fade-in animations
- Campaign grid: ScrollTrigger staggered reveal
- Parallax effects on scroll
- Text reveal animations

### Three.js Effects
- Multi-layer particle systems
- Rotating torus geometry
- Rotating icosahedron
- Dual-color point lighting (magenta + cyan)
- GPU-accelerated rendering

### Framer Motion
- Page transitions
- Smooth modal animations
- Gallery morphing effects

## Components

### Loader Component
Elegant loading screen with:
- Neon spinner animation
- "Loading Experience" text
- Pulsing dot indicators
- Dark backdrop with blur

### Header
- Sticky navigation
- Theme toggle (light/dark mode)
- Navigation links with active states
- Logo with gradient accent

### Campaign Grid
- Responsive grid (1-3 columns)
- Luxury card styling with neon glow
- Smooth hover animations
- Image brightness control on hover

### Modal Gallery
- Full-screen image display
- Thumbnail navigation
- Keyboard controls (arrow keys, escape)
- Smooth transitions

## Responsive Design

### Breakpoints
- Mobile: < 768px (1 column)
- Tablet: 768px - 1024px (2 columns)
- Desktop: > 1024px (3 columns)

### Mobile-First
- All components scale appropriately
- Touch-friendly button sizes
- Readable typography on small screens
- Hidden desktop elements on mobile

## Accessibility

### Color Contrast
- Primary/magenta text passes WCAG AA standards
- Text shadow for neon effect doesn't reduce readability
- High contrast between backgrounds and text

### Semantic HTML
- Proper heading hierarchy (h1, h2, h3)
- Button elements for interactive controls
- Screen reader support

### Keyboard Navigation
- Tabable buttons and links
- Escape key closes modals
- Arrow keys navigate galleries

## Performance Optimizations

### Image Handling
- Next.js Image component with optimization
- WebP format support
- Responsive image sizes
- Blur placeholder (LQIP) support

### Animation Performance
- GPU-accelerated transforms
- will-change CSS hints
- Backdrop filter optimization
- Three.js camera updates optimized

### Bundle Size
- Tree-shaking enabled
- Code splitting for routes
- Lazy loading for components
- No unused dependencies

## Deployment

### Environment Variables Required
```
NEXT_PUBLIC_SANITY_PROJECT_ID=your_project_id
NEXT_PUBLIC_SANITY_DATASET=production
NEXT_PUBLIC_SANITY_API_VERSION=2024-01-01
```

### Build Configuration
```bash
pnpm build
pnpm start
```

### Development
```bash
pnpm dev          # Next.js dev server
pnpm dev:studio   # Sanity Studio dev server
pnpm studio       # Sanity Studio
```

## Future Enhancements

1. **More 3D Effects**: Interactive 3D models on campaign pages
2. **Video Integration**: Background videos for hero section
3. **Dynamic theming**: User-selectable color schemes
4. **Advanced Analytics**: Scroll depth and interaction tracking
5. **Testimonials**: Client feedback section
6. **Blog**: Content marketing section
7. **Contact Form**: Fully functional with email integration

---

**Design Philosophy**: Break limits. Create excellence. Push boundaries.

**Version**: 2.0
**Last Updated**: June 2026
