import React from "react";
import { EventFilters, IssueType, issueTypeLabels } from "../types";
import { Filter, X } from "lucide-react";

interface FiltersProps {
  filters: EventFilters;
  onFiltersChange: (filters: EventFilters) => void;
  zones: string[];
  drivers: Array<{ id: string; name: string }>;
  eventCount: number;
  onShareResults: () => void;
}

const issueTypeOptions: IssueType[] = [
  "missed_pickup",
  "blocked_access",
  "bin_missing",
  "overflow_visible",
  "none",
];

export const Filters: React.FC<FiltersProps> = ({
  filters,
  onFiltersChange,
  zones,
  drivers,
  eventCount,
  onShareResults,
}) => {
  const handleIssueTypeToggle = (issueType: IssueType) => {
    const currentTypes = filters.issueTypes || [];
    const newTypes = currentTypes.includes(issueType)
      ? currentTypes.filter((t) => t !== issueType)
      : [...currentTypes, issueType];
    
    onFiltersChange({ ...filters, issueTypes: newTypes.length > 0 ? newTypes : undefined });
  };

  const clearFilters = () => {
    onFiltersChange({});
  };

  const hasActiveFilters =
    filters.dateFrom ||
    filters.dateTo ||
    filters.zone ||
    filters.driver ||
    (filters.issueTypes && filters.issueTypes.length > 0) ||
    filters.showOnlyUntagged;

  return (
    <div className="bg-white border-b border-gray-200 p-6 space-y-4">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Filter className="w-5 h-5 text-gray-500" />
          <h2 className="text-lg font-semibold text-gray-900">Filters</h2>
          {hasActiveFilters && (
            <button
              onClick={clearFilters}
              className="ml-2 text-sm text-gray-500 hover:text-gray-700 flex items-center gap-1"
            >
              <X className="w-4 h-4" />
              Clear all
            </button>
          )}
        </div>
        <div className="flex items-center gap-4">
          <span className="text-sm text-gray-600">
            {eventCount} {eventCount === 1 ? "event" : "events"} found
          </span>
          {eventCount > 0 && (
            <button
              onClick={onShareResults}
              className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 transition-colors"
            >
              Share these results
            </button>
          )}
        </div>
      </div>

      {/* Date Range */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            From Date
          </label>
          <input
            type="date"
            value={filters.dateFrom || ""}
            onChange={(e) =>
              onFiltersChange({ ...filters, dateFrom: e.target.value || undefined })
            }
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            To Date
          </label>
          <input
            type="date"
            value={filters.dateTo || ""}
            onChange={(e) =>
              onFiltersChange({ ...filters, dateTo: e.target.value || undefined })
            }
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Zone
          </label>
          <select
            value={filters.zone || "all"}
            onChange={(e) =>
              onFiltersChange({
                ...filters,
                zone: e.target.value === "all" ? undefined : e.target.value,
              })
            }
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Zones</option>
            {zones.map((zone) => (
              <option key={zone} value={zone}>
                {zone}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Driver
          </label>
          <select
            value={filters.driver || "all"}
            onChange={(e) =>
              onFiltersChange({
                ...filters,
                driver: e.target.value === "all" ? undefined : e.target.value,
              })
            }
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Drivers</option>
            {drivers.map((driver) => (
              <option key={driver.id} value={driver.id}>
                {driver.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Issue Type Multi-Select */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Issue Types
        </label>
        <div className="flex flex-wrap gap-2">
          {issueTypeOptions.map((issueType) => {
            const isSelected = filters.issueTypes?.includes(issueType);
            return (
              <button
                key={issueType}
                onClick={() => handleIssueTypeToggle(issueType)}
                className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
                  isSelected
                    ? "bg-blue-600 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                {issueTypeLabels[issueType]}
              </button>
            );
          })}
        </div>
      </div>

      {/* Show Only Untagged */}
      <div className="flex items-center">
        <input
          id="show-untagged"
          type="checkbox"
          checked={filters.showOnlyUntagged || false}
          onChange={(e) =>
            onFiltersChange({ ...filters, showOnlyUntagged: e.target.checked || undefined })
          }
          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
        />
        <label htmlFor="show-untagged" className="ml-2 text-sm text-gray-700">
          Show only events with no issue detected (untagged videos)
        </label>
      </div>
    </div>
  );
};

