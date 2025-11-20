import React, { useMemo, useState } from "react";
import { Event, issueTypeLabels } from "../types";
import { X, Copy, BarChart3 } from "lucide-react";

interface ShareModalProps {
  events: Event[];
  onClose: () => void;
}

export const ShareModal: React.FC<ShareModalProps> = ({ events, onClose }) => {
  const [copied, setCopied] = useState(false);

  // Calculate summary statistics
  const summary = useMemo(() => {
    const issueTypeCounts = events.reduce((acc, event) => {
      const effectiveLabel = event.humanLabel || event.issueType;
      acc[effectiveLabel] = (acc[effectiveLabel] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const reviewedCount = events.filter((e) => e.humanLabel).length;

    const zones = new Set(events.map((e) => e.zone));
    const drivers = new Set(events.map((e) => e.driverName));

    return {
      total: events.length,
      issueTypeCounts,
      reviewedCount,
      unreviewed: events.length - reviewedCount,
      zones: Array.from(zones).sort(),
      drivers: Array.from(drivers).sort(),
    };
  }, [events]);

  // Generate shareable text summary
  const shareText = useMemo(() => {
    const lines = [
      "=== Event Review Summary ===",
      `Generated: ${new Date().toLocaleString()}`,
      "",
      `Total Events: ${summary.total}`,
      `Reviewed: ${summary.reviewedCount}`,
      `Pending Review: ${summary.unreviewed}`,
      "",
      "Issue Breakdown:",
    ];

    Object.entries(summary.issueTypeCounts)
      .sort((a, b) => b[1] - a[1])
      .forEach(([type, count]) => {
        lines.push(`  • ${issueTypeLabels[type as keyof typeof issueTypeLabels]}: ${count}`);
      });

    lines.push("", "Zones Covered:", ...summary.zones.map((z) => `  • ${z}`));
    lines.push("", "Drivers:", ...summary.drivers.map((d) => `  • ${d}`));

    lines.push("", "Event IDs:");
    events.forEach((event) => {
      const effectiveLabel = event.humanLabel || event.issueType;
      lines.push(
        `  • ${event.id} - ${issueTypeLabels[effectiveLabel]} - ${new Date(
          event.timestamp
        ).toLocaleString()}`
      );
    });

    return lines.join("\n");
  }, [events, summary]);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(shareText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-3xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center gap-2">
            <BarChart3 className="w-6 h-6 text-blue-600" />
            <h2 className="text-2xl font-bold text-gray-900">Share Results</h2>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Summary Cards */}
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-blue-50 rounded-lg p-4">
              <div className="text-2xl font-bold text-blue-900">
                {summary.total}
              </div>
              <div className="text-sm text-blue-700">Total Events</div>
            </div>
            <div className="bg-green-50 rounded-lg p-4">
              <div className="text-2xl font-bold text-green-900">
                {summary.reviewedCount}
              </div>
              <div className="text-sm text-green-700">Reviewed</div>
            </div>
            <div className="bg-orange-50 rounded-lg p-4">
              <div className="text-2xl font-bold text-orange-900">
                {summary.unreviewed}
              </div>
              <div className="text-sm text-orange-700">Pending</div>
            </div>
          </div>

          {/* Issue Type Breakdown */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-3">
              Issue Type Breakdown
            </h3>
            <div className="space-y-2">
              {Object.entries(summary.issueTypeCounts)
                .sort((a, b) => b[1] - a[1])
                .map(([type, count]) => {
                  const percentage = ((count / summary.total) * 100).toFixed(1);
                  return (
                    <div key={type} className="flex items-center gap-3">
                      <div className="w-40 text-sm text-gray-700">
                        {issueTypeLabels[type as keyof typeof issueTypeLabels]}
                      </div>
                      <div className="flex-1 bg-gray-200 rounded-full h-6 relative">
                        <div
                          className="bg-blue-600 h-6 rounded-full flex items-center justify-end pr-2"
                          style={{ width: `${percentage}%`, minWidth: "40px" }}
                        >
                          <span className="text-xs font-medium text-white">
                            {count}
                          </span>
                        </div>
                      </div>
                      <div className="w-16 text-sm text-gray-600 text-right">
                        {percentage}%
                      </div>
                    </div>
                  );
                })}
            </div>
          </div>

          {/* Zones and Drivers */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Zones ({summary.zones.length})
              </h3>
              <ul className="text-sm text-gray-700 space-y-1">
                {summary.zones.map((zone) => (
                  <li key={zone} className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 bg-blue-600 rounded-full" />
                    {zone}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Drivers ({summary.drivers.length})
              </h3>
              <ul className="text-sm text-gray-700 space-y-1">
                {summary.drivers.map((driver) => (
                  <li key={driver} className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 bg-green-600 rounded-full" />
                    {driver}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Text Summary */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Shareable Summary
            </h3>
            <pre className="text-xs bg-gray-50 p-4 rounded border border-gray-200 overflow-x-auto whitespace-pre-wrap max-h-64">
              {shareText}
            </pre>
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-gray-200 bg-gray-50">
          <button
            onClick={copyToClipboard}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors font-medium"
          >
            <Copy className="w-5 h-5" />
            {copied ? "Copied to Clipboard!" : "Copy Summary to Clipboard"}
          </button>
        </div>
      </div>
    </div>
  );
};

