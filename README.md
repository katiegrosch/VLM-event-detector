# VLM Event Review Tool

A lightweight demo frontend for reviewing waste-management events detected from garbage truck dashcam video using a Vision Language Model (VLM).

## Features

### 🎯 Core Workflows

1. **Event List & Review**
   - View all detected events in a clean, sortable table
   - See AI-detected issues with confidence scores
   - Visual indicators for reviewed vs. pending events

2. **Advanced Filtering**
   - Filter by date range, zone, driver, and issue type
   - Search mode for untagged videos (events with no issue detected)
   - Real-time filter updates

3. **Video Review & Override**
   - Watch embedded dashcam videos
   - Override AI determinations with human judgment
   - Add coaching notes and context
   - Save reviews to update event status

4. **Sharing Capabilities**
   - Share individual events with drivers (coaching summaries)
   - Share events externally (city/resident documentation)
   - Share filtered result sets with summary statistics
   - Copy-to-clipboard functionality for easy communication

## Tech Stack

- **React 18** with TypeScript
- **Tailwind CSS** for styling
- **Vite** for fast development and building
- **Lucide React** for icons

## Getting Started

### Prerequisites

- Node.js 18+ and npm

### Installation

1. Install dependencies:

```bash
npm install
```

2. Start the development server:

```bash
npm run dev
```

3. Open your browser to `http://localhost:5173`

### Building for Production

```bash
npm run build
```

The built files will be in the `dist/` directory.

## Project Structure

```
src/
├── types.ts                    # TypeScript type definitions
├── api.ts                      # Mock API layer (replace with real backend)
├── components/
│   ├── Filters.tsx            # Filter controls
│   ├── EventList.tsx          # Event table/list
│   ├── EventDetail.tsx        # Event detail modal with video player
│   └── ShareModal.tsx         # Results sharing modal
├── App.tsx                     # Main application component
├── main.tsx                    # React entry point
└── index.css                   # Global styles
```

## Data Model

Events have the following structure:

```typescript
type Event = {
  id: string;
  timestamp: string;          // ISO date string
  driverName: string;
  driverId: string;
  routeId: string;
  zone: string;
  issueType: IssueType;       // AI-detected label
  humanLabel?: IssueType;     // Human override (optional)
  confidence: number;         // 0-1
  hasIssue: boolean;
  videoUrl: string;
  address?: string;
  notes?: string;             // Freeform coaching notes
};
```

### Issue Types

- `missed_pickup` - Driver missed a scheduled pickup
- `blocked_access` - Access to bin was blocked
- `bin_missing` - Expected bin was not present
- `overflow_visible` - Bin was overflowing
- `none` - No issue detected

## Integrating with Your Backend

The mock API is isolated in `src/api.ts`. Replace these functions with real HTTP calls:

### `fetchEvents(filters?: EventFilters): Promise<Event[]>`

**Mock behavior:** Returns filtered events from in-memory store  
**Real implementation:** Make GET request to your backend with query parameters

```typescript
// Example real implementation:
export const fetchEvents = async (filters?: EventFilters): Promise<Event[]> => {
  const params = new URLSearchParams();
  if (filters?.dateFrom) params.append('from', filters.dateFrom);
  if (filters?.dateTo) params.append('to', filters.dateTo);
  // ... add other filter params
  
  const response = await fetch(`/api/events?${params}`);
  return response.json();
};
```

### `saveReview(eventId: string, humanLabel: IssueType, notes: string): Promise<Event>`

**Mock behavior:** Updates in-memory store  
**Real implementation:** Make PATCH/PUT request to update event

```typescript
// Example real implementation:
export const saveReview = async (
  eventId: string,
  humanLabel: IssueType,
  notes: string
): Promise<Event> => {
  const response = await fetch(`/api/events/${eventId}/review`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ humanLabel, notes }),
  });
  return response.json();
};
```

### `getZones()` and `getDrivers()`

Replace with API calls that return available zones and drivers from your backend.

## Key Components

### Filters Component

Located at `src/components/Filters.tsx`

Provides comprehensive filtering:
- Date range selection
- Zone and driver dropdowns
- Multi-select issue types
- "Show only untagged" checkbox
- Clear all filters button
- Share results button

### EventList Component

Located at `src/components/EventList.tsx`

Displays events in a table with:
- Review status indicators (reviewed vs. pending)
- Timestamp, driver, zone, issue type, confidence
- Visual badges for issue types
- Clickable rows to open detail view

### EventDetail Component

Located at `src/components/EventDetail.tsx`

Full-featured detail modal with:
- Embedded video player
- Event metadata display
- AI detection info with confidence
- Human override controls
- Notes/coaching text area
- Save review functionality
- Share with driver/external buttons

### ShareModal Component

Located at `src/components/ShareModal.tsx`

Summary and sharing interface:
- Total events, reviewed/pending counts
- Issue type breakdown with charts
- Zones and drivers lists
- Complete text summary
- Copy to clipboard

## Customization

### Styling

All styling uses Tailwind CSS. Customize the design by:
- Modifying Tailwind classes in components
- Extending `tailwind.config.js` with custom theme values
- Adding custom CSS in `src/index.css`

### Adding New Issue Types

1. Update `IssueType` in `src/types.ts`
2. Add label to `issueTypeLabels`
3. Add color scheme to `issueTypeColors`
4. Update filters and UI components as needed

### Video Player

Currently uses HTML5 `<video>` element. You can replace with a more feature-rich player (e.g., Video.js, Plyr) by modifying the video player section in `EventDetail.tsx`.

## Demo Data

The app includes 50 mock events with:
- Random distributions across 4 drivers and 5 zones
- Events spread over the last 7 days
- Mix of issue types with varying confidence scores
- ~30% of events pre-reviewed (have human labels)
- Sample video from public CDN (Big Buck Bunny)

To modify mock data generation, edit `generateMockEvents()` in `src/api.ts`.

## Development Tips

- Hot module replacement (HMR) works out of the box with Vite
- TypeScript strict mode is enabled for better type safety
- All components are fully typed with TypeScript
- The app is a single-page application (no routing)
- State management uses React hooks (useState, useEffect)

## Browser Support

Modern browsers with ES2020+ support:
- Chrome/Edge 90+
- Firefox 88+
- Safari 14+

## License

MIT

## Next Steps

To productionize this demo:

1. **Replace mock API** with real backend integration
2. **Add authentication** and user management
3. **Implement real video storage** and streaming
4. **Add pagination** for large event lists
5. **Implement real-time updates** (WebSocket/polling)
6. **Add email/notification** integration for sharing
7. **Enhance video player** with frame-by-frame controls
8. **Add analytics dashboard** for trends and insights
9. **Implement role-based access** control
10. **Add export functionality** (CSV, PDF reports)

---

Built with ❤️ for operations teams managing waste collection routes.

