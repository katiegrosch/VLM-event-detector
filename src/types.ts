export type IssueType =
  | "missed_pickup"
  | "blocked_access"
  | "bin_missing"
  | "overflow_visible"
  | "none";

export type Event = {
  id: string;
  timestamp: string; // ISO
  driverName: string;
  driverId: string;
  routeId: string;
  zone: string; // e.g. "Zone A", "Downtown"
  issueType: IssueType; // current AI label
  humanLabel?: IssueType; // optional override
  confidence: number; // 0–1
  hasIssue: boolean; // AI says event_present
  videoUrl: string; // URL to mp4
  address?: string;
  notes?: string; // freeform text from ops
};

export type EventFilters = {
  dateFrom?: string;
  dateTo?: string;
  zone?: string;
  driver?: string;
  issueTypes?: IssueType[];
  showOnlyUntagged?: boolean; // Show only events with issueType === "none"
};

// Helper to get a human-readable label for issue types
export const issueTypeLabels: Record<IssueType, string> = {
  missed_pickup: "Missed Pickup",
  blocked_access: "Blocked Access",
  bin_missing: "Bin Missing",
  overflow_visible: "Overflow Visible",
  none: "No Issue",
};

// Color coding for issue types
export const issueTypeColors: Record<IssueType, string> = {
  missed_pickup: "bg-red-100 text-red-800",
  blocked_access: "bg-orange-100 text-orange-800",
  bin_missing: "bg-yellow-100 text-yellow-800",
  overflow_visible: "bg-purple-100 text-purple-800",
  none: "bg-gray-100 text-gray-800",
};

