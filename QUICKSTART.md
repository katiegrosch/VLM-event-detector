# Quick Start Guide

## Get Up and Running in 3 Steps

### 1. Install Dependencies

```bash
npm install
```

This will install:
- React 18 and React DOM
- TypeScript
- Tailwind CSS
- Vite (dev server)
- Lucide React (icons)

### 2. Start Development Server

```bash
npm run dev
```

The app will be available at `http://localhost:5173`

### 3. Explore the Demo

The app comes pre-loaded with 50 mock events. Try:

#### Filter Events
- Click the date pickers to filter by date range
- Select a zone or driver from the dropdowns
- Click issue type pills to filter by specific issues
- Check "Show only untagged" to find videos with no issues

#### Review an Event
1. Click any row in the event table
2. Watch the video in the modal that opens
3. Change the "Override Issue Type" dropdown if needed
4. Add notes in the text area
5. Click "Save Review"

#### Share Results
- Click "Share these results" button (top right)
- View summary statistics
- Click "Copy Summary to Clipboard"
- Paste into email, Slack, ticket system, etc.

#### Share Individual Event
1. Open an event detail modal
2. Scroll to "Share Event" section
3. Click "Generate Driver Summary" for coaching
4. Click "Generate External Summary" for city/resident communication
5. Copy to clipboard and share

## What's Included

### Mock Data
- 50 events spread over 7 days
- 4 drivers across 5 zones
- Mix of issue types (missed pickup, blocked access, etc.)
- ~30% pre-reviewed events
- Real sample video (Big Buck Bunny) for all events

### All Core Features
✅ Event list with sorting  
✅ Advanced filtering (date, zone, driver, issue type)  
✅ Video review with embedded player  
✅ Human override for AI labels  
✅ Notes/coaching text  
✅ Share individual events  
✅ Share filtered result sets  
✅ Review status tracking  

## Next Steps

### Connect to Your Backend

Replace the mock functions in `src/api.ts`:

```typescript
// Change this:
export const fetchEvents = async (filters?: EventFilters): Promise<Event[]> => {
  // Mock implementation
  await new Promise((resolve) => setTimeout(resolve, 300));
  return filtered;
};

// To this:
export const fetchEvents = async (filters?: EventFilters): Promise<Event[]> => {
  const response = await fetch('/api/events', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(filters),
  });
  return response.json();
};
```

### Customize Styling

All styling uses Tailwind CSS. To customize:

1. Edit `tailwind.config.js` for theme changes
2. Modify Tailwind classes in components
3. Add custom CSS in `src/index.css`

### Add New Features

The code is structured for easy extension:

- **New filters**: Add to `Filters.tsx` and `EventFilters` type
- **New issue types**: Update `types.ts` (IssueType union)
- **New metadata**: Add fields to `Event` type
- **Analytics**: Create new components in `src/components/`

## Common Tasks

### Change Mock Data

Edit `generateMockEvents()` in `src/api.ts`:

```typescript
// Add more drivers
const drivers = [
  { id: "D001", name: "John Smith" },
  { id: "D005", name: "Your Name" }, // Add here
];

// Change number of events
for (let i = 0; i < 100; i++) { // Was 50
  // ...
}
```

### Change Video Source

In `src/api.ts`, modify the `videoUrl`:

```typescript
events.push({
  // ...
  videoUrl: "https://your-cdn.com/video.mp4",
  // ...
});
```

### Build for Production

```bash
npm run build
```

Output will be in `dist/` directory. Deploy to any static host (Netlify, Vercel, S3, etc.).

## Troubleshooting

### Port 5173 already in use

```bash
# Kill the process using the port
lsof -ti:5173 | xargs kill -9

# Or change the port in vite.config.ts
export default defineConfig({
  plugins: [react()],
  server: { port: 3000 }
})
```

### TypeScript errors

```bash
# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install
```

### Styling not working

Make sure Tailwind is processing correctly:

```bash
# Check postcss.config.js exists
# Check tailwind.config.js has correct content paths
# Restart dev server
npm run dev
```

## Need Help?

- Check the full `README.md` for detailed documentation
- Review component files - they're well-commented
- Look at `src/types.ts` for data structure definitions

---

**You're all set!** 🎉 The demo is fully functional with mock data. When you're ready, swap out the API layer and connect to your real backend.

