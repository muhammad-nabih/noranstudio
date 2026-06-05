# Creative Portfolio - Complete Setup Guide

## Prerequisites
- Node.js 18+ installed
- pnpm (or npm/yarn)
- Sanity account at https://sanity.io
- Vercel account for deployment (optional)

---

## Step 1: Project Setup

### Clone/Extract Project
```bash
cd /vercel/share/v0-project
```

### Install Dependencies
```bash
pnpm install
```

---

## Step 2: Sanity CMS Configuration

### Create Sanity Project
1. Go to https://sanity.io and sign up
2. Create a new project
3. Choose "Standalone" as project type
4. Copy your **Project ID** and **Dataset name**

### Configure Environment Variables
Create `.env.local` file in project root:

```env
NEXT_PUBLIC_SANITY_PROJECT_ID=your_project_id_here
NEXT_PUBLIC_SANITY_DATASET=production
NEXT_PUBLIC_SANITY_API_VERSION=2024-01-01
```

Replace `your_project_id_here` with your actual Sanity project ID.

### Initialize Sanity Studio
```bash
# Generate CORS settings for your local dev server
pnpm sanity cors add http://localhost:3000 --credentials

# (Optional) Push initial schema to Sanity
pnpm sanity deploy
```

---

## Step 3: Development Setup

### Terminal 1 - Next.js Application
```bash
pnpm dev
```
App runs at: http://localhost:3000

### Terminal 2 - Sanity Studio (optional)
```bash
pnpm dev:studio
```
Studio runs at: http://localhost:3333

---

## Step 4: Create Content in Sanity

### Access Sanity Studio
1. Go to http://localhost:3333
2. Or go to https://sanity.io/manage/YOUR_PROJECT_ID

### Create Projects
1. Click "Projects" in the sidebar
2. Click "Create"
3. Fill in:
   - **Title**: Project name (e.g., "Coca Cola Campaign")
   - **Slug**: Auto-generated from title
   - **Description**: Short description
   - **Image**: Upload featured image
   - **Featured**: Toggle to feature on homepage
   - **Published At**: Publication date

### Create Galleries
1. Click "Galleries" in the sidebar
2. Click "Create"
3. Add:
   - **Title**: Gallery name
   - **Description**: Gallery description
   - **Images**: Upload multiple images
   - **Order**: Display order number

### Link Galleries to Projects
1. Edit a project
2. In the "Galleries" array, add references to created galleries
3. Publish

### Create Services
1. Click "Services" in the sidebar
2. Click "Create"
3. Add:
   - **Title**: Service name
   - **Description**: Service description
   - **Order**: Display order

---

## Step 5: Customize the Application

### Update Header Navigation
Edit `/components/common/Header.tsx` to modify navigation links and branding.

### Customize Colors
Edit `/app/globals.css` theme variables:
```css
:root {
  --primary: #ff00ff;  /* Change primary color */
  --background: #ffffff;  /* Light mode background */
}

.dark {
  --background: #0a0e27;  /* Dark mode background */
}
```

### Update Copy & Content
- Update homepage text in `/app/page.tsx`
- Update About page in `/app/about/page.tsx`
- Update Contact info in `/app/contact/page.tsx`
- Update case studies in `/app/case-studies/page.tsx`

### Modify Animations
- Scroll animations: `/lib/animations/gsap-advanced.ts`
- 3D animations: `/components/3d/AnimatedCanvas.tsx`
- Gallery animations: `/components/galleries/ModalGallery.tsx`

---

## Step 6: Testing

### Local Testing
```bash
# Run dev server
pnpm dev

# Check all pages work:
# - http://localhost:3000 (Home)
# - http://localhost:3000/about (About)
# - http://localhost:3000/contact (Contact)
# - http://localhost:3000/case-studies (Case Studies)
# - http://localhost:3000/campaigns/[slug] (Campaign detail)
```

### Build Testing
```bash
# Create production build
pnpm build

# Test production build locally
pnpm start
```

### Performance Testing
```bash
# Check Web Vitals
# Use Chrome DevTools > Lighthouse
# Target scores:
# - Performance: 90+
# - Accessibility: 95+
# - Best Practices: 95+
# - SEO: 100
```

---

## Step 7: Deployment

### Deploy to Vercel (Recommended)

#### Option A: Using Vercel CLI
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Follow prompts to connect GitHub repo and deploy
```

#### Option B: Using GitHub
1. Push code to GitHub repository
2. Go to https://vercel.com
3. Click "New Project"
4. Select your GitHub repository
5. Configure environment variables
6. Click "Deploy"

### Environment Variables on Vercel
1. Go to Project Settings > Environment Variables
2. Add:
   - `NEXT_PUBLIC_SANITY_PROJECT_ID`
   - `NEXT_PUBLIC_SANITY_DATASET`
   - `NEXT_PUBLIC_SANITY_API_VERSION`
3. Redeploy after adding variables

### Configure CORS on Sanity
Update Sanity CORS settings to allow your Vercel domain:
```bash
pnpm sanity cors add https://your-domain.vercel.app --credentials
```

---

## Step 8: Post-Deployment

### Verify Everything Works
- [ ] Homepage loads with 3D animations
- [ ] Dark/Light mode toggle works
- [ ] Navigation links work correctly
- [ ] Campaign cards display and link properly
- [ ] Modal gallery opens and functions
- [ ] Contact form submits
- [ ] All pages are accessible
- [ ] Images load optimally
- [ ] Scroll animations trigger correctly

### Monitor Performance
- Check Vercel Analytics
- Monitor Core Web Vitals
- Use PageSpeed Insights
- Monitor error logs

### Update DNS (Optional)
If using custom domain:
1. Go to Vercel project settings
2. Add custom domain
3. Update DNS records at your registrar
4. Verify domain setup

---

## Troubleshooting

### Issue: Sanity client not connecting
**Solution**: Check environment variables are set correctly:
```bash
echo $NEXT_PUBLIC_SANITY_PROJECT_ID
echo $NEXT_PUBLIC_SANITY_DATASET
```

### Issue: Images not loading
**Solution**: 
1. Verify Sanity image URLs are accessible
2. Check CORS settings in Sanity
3. Clear browser cache and rebuild

### Issue: Dark mode not persisting
**Solution**: Check localStorage is enabled in browser:
- Open DevTools > Application > Local Storage
- Verify theme-preference key exists

### Issue: Animations not smooth
**Solution**:
1. Check GPU acceleration is enabled
2. Reduce particle count in AnimatedCanvas.tsx
3. Profile performance with Chrome DevTools

### Issue: Build errors
**Solution**:
```bash
# Clear cache and reinstall
rm -rf .next node_modules pnpm-lock.yaml
pnpm install
pnpm build
```

---

## File Structure Quick Reference

```
Project Root
├── app/                    # Next.js app directory
├── components/             # React components
├── lib/                    # Utility functions
├── studio/                 # Sanity Studio schemas
├── public/                 # Static assets
├── .env.local             # Environment variables (add this)
├── next.config.mjs        # Next.js config
├── sanity.config.ts       # Sanity Studio config
├── sanity.cli.ts          # Sanity CLI config
├── package.json           # Dependencies
└── tsconfig.json          # TypeScript config
```

---

## Useful Commands

```bash
# Development
pnpm dev                    # Start dev server
pnpm dev:studio           # Start Sanity Studio dev
pnpm build                # Build for production
pnpm start                # Start production server
pnpm lint                 # Run linter

# Sanity
pnpm sanity --help        # Sanity CLI help
pnpm sanity deploy        # Deploy schema to Sanity
pnpm sanity cors list     # List CORS settings
```

---

## Additional Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [Sanity Documentation](https://www.sanity.io/docs)
- [GSAP Documentation](https://greensock.com/docs/)
- [Framer Motion Documentation](https://www.framer.com/motion/)
- [Three.js Documentation](https://threejs.org/docs/)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)

---

## Support

For issues or questions:
1. Check the IMPROVEMENTS.md file for feature documentation
2. Review the troubleshooting section above
3. Check official documentation for dependencies
4. Review code comments in relevant files

---

## Next Steps

1. Set up Sanity project
2. Configure environment variables
3. Create initial content
4. Test locally
5. Deploy to Vercel
6. Monitor performance
7. Customize branding and copy
8. Optimize images and content

Enjoy building with this creative portfolio!
