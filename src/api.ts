import { Event, EventFilters, IssueType } from "./types";

// Mock data generator
const generateMockEvents = (): Event[] => {
  const drivers = [
    { id: "D001", name: "John Smith" },
    { id: "D002", name: "Maria Garcia" },
    { id: "D003", name: "David Chen" },
    { id: "D004", name: "Sarah Johnson" },
  ];

  const zones = ["Zone A", "Zone B", "Downtown", "Industrial District", "Suburbs"];
  
  const issueTypes: IssueType[] = [
    "missed_pickup",
    "blocked_access",
    "bin_missing",
    "overflow_visible",
    "none",
  ];

  const addresses = [
    "123 Main St",
    "456 Oak Ave",
    "789 Elm Blvd",
    "321 Pine Rd",
    "654 Maple Dr",
    "987 Cedar Ln",
  ];

  const events: Event[] = [];
  const now = new Date();

  // Generate 50 mock events over the last 7 days
  for (let i = 0; i < 50; i++) {
    const driver = drivers[Math.floor(Math.random() * drivers.length)];
    const issueType = issueTypes[Math.floor(Math.random() * issueTypes.length)];
    const hasIssue = issueType !== "none";
    
    // Some events have human labels (reviewed)
    const hasHumanLabel = Math.random() > 0.7;
    
    const daysAgo = Math.floor(Math.random() * 7);
    const hoursAgo = Math.floor(Math.random() * 24);
    const eventDate = new Date(now);
    eventDate.setDate(eventDate.getDate() - daysAgo);
    eventDate.setHours(eventDate.getHours() - hoursAgo);

    events.push({
      id: `EVT-${String(i + 1).padStart(4, "0")}`,
      timestamp: eventDate.toISOString(),
      driverName: driver.name,
      driverId: driver.id,
      routeId: `R${Math.floor(Math.random() * 20) + 1}`,
      zone: zones[Math.floor(Math.random() * zones.length)],
      issueType: issueType,
      humanLabel: hasHumanLabel ? issueTypes[Math.floor(Math.random() * issueTypes.length)] : undefined,
      confidence: Math.round((0.5 + Math.random() * 0.5) * 100) / 100,
      hasIssue: hasIssue,
      videoUrl: `https://drive.google.com/uc?export=download&id=11A5U8OgoG0zOKrz6ojfWS0fj2HEEgYP8`, // Google Drive video
      address: addresses[Math.floor(Math.random() * addresses.length)],
      notes: hasHumanLabel ? "Reviewed by ops manager" : undefined,
    });
  }

  return events.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
};

// In-memory store for demo purposes
let mockEvents = generateMockEvents();

/**
 * Fetch events with optional filters
 * In a real app, this would make an HTTP request to your backend
 */
export const fetchEvents = async (filters?: EventFilters): Promise<Event[]> => {
  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 300));

  let filtered = [...mockEvents];

  if (filters) {
    // Filter by date range
    if (filters.dateFrom) {
      const fromDate = new Date(filters.dateFrom);
      filtered = filtered.filter((e) => new Date(e.timestamp) >= fromDate);
    }
    if (filters.dateTo) {
      const toDate = new Date(filters.dateTo);
      toDate.setHours(23, 59, 59, 999); // End of day
      filtered = filtered.filter((e) => new Date(e.timestamp) <= toDate);
    }

    // Filter by zone
    if (filters.zone && filters.zone !== "all") {
      filtered = filtered.filter((e) => e.zone === filters.zone);
    }

    // Filter by driver
    if (filters.driver && filters.driver !== "all") {
      filtered = filtered.filter((e) => e.driverId === filters.driver);
    }

    // Filter by issue types
    if (filters.issueTypes && filters.issueTypes.length > 0) {
      filtered = filtered.filter((e) => {
        // Check both AI label and human override
        const effectiveLabel = e.humanLabel || e.issueType;
        return filters.issueTypes!.includes(effectiveLabel);
      });
    }

    // Show only untagged (no issue detected)
    if (filters.showOnlyUntagged) {
      filtered = filtered.filter((e) => e.issueType === "none" && !e.humanLabel);
    }
  }

  return filtered;
};

/**
 * Save a review (human override + notes) for an event
 * In a real app, this would POST to your backend
 */
export const saveReview = async (
  eventId: string,
  humanLabel: IssueType,
  notes: string
): Promise<Event> => {
  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 200));

  const eventIndex = mockEvents.findIndex((e) => e.id === eventId);
  if (eventIndex === -1) {
    throw new Error(`Event ${eventId} not found`);
  }

  // Update the event
  mockEvents[eventIndex] = {
    ...mockEvents[eventIndex],
    humanLabel,
    notes: notes.trim() || undefined,
  };

  return mockEvents[eventIndex];
};

/**
 * Get unique zones for filter dropdown
 */
export const getZones = (): string[] => {
  const zones = new Set(mockEvents.map((e) => e.zone));
  return Array.from(zones).sort();
};

/**
 * Get unique drivers for filter dropdown
 */
export const getDrivers = (): Array<{ id: string; name: string }> => {
  const driversMap = new Map<string, string>();
  mockEvents.forEach((e) => {
    driversMap.set(e.driverId, e.driverName);
  });
  
  return Array.from(driversMap.entries())
    .map(([id, name]) => ({ id, name }))
    .sort((a, b) => a.name.localeCompare(b.name));
};

