import React from "react";
import { Event, issueTypeLabels, issueTypeColors } from "../types";
import { CheckCircle, Clock } from "lucide-react";

interface EventListProps {
  events: Event[];
  selectedEventId?: string;
  onSelectEvent: (event: Event) => void;
  loading?: boolean;
}

export const EventList: React.FC<EventListProps> = ({
  events,
  selectedEventId,
  onSelectEvent,
  loading,
}) => {
  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-500">Loading events...</div>
      </div>
    );
  }

  if (events.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-gray-500">
        <Clock className="w-12 h-12 mb-2 text-gray-400" />
        <p className="text-lg font-medium">No events match your filters</p>
        <p className="text-sm">Try adjusting your search criteria</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Status
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Timestamp
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Driver
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Zone
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Issue Type
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Confidence
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Address
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {events.map((event) => {
            const isSelected = event.id === selectedEventId;
            const isReviewed = !!event.humanLabel;
            const effectiveLabel = event.humanLabel || event.issueType;

            return (
              <tr
                key={event.id}
                onClick={() => onSelectEvent(event)}
                className={`cursor-pointer hover:bg-gray-50 transition-colors ${
                  isSelected ? "bg-blue-50" : ""
                }`}
              >
                <td className="px-6 py-4 whitespace-nowrap">
                  {isReviewed ? (
                    <div className="flex items-center text-green-600" title="Reviewed by ops">
                      <CheckCircle className="w-5 h-5" />
                    </div>
                  ) : (
                    <div className="flex items-center text-gray-400" title="Pending review">
                      <Clock className="w-5 h-5" />
                    </div>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  <div>{new Date(event.timestamp).toLocaleDateString()}</div>
                  <div className="text-gray-500">
                    {new Date(event.timestamp).toLocaleTimeString()}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">
                    {event.driverName}
                  </div>
                  <div className="text-sm text-gray-500">{event.driverId}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {event.zone}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="space-y-1">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        issueTypeColors[effectiveLabel]
                      }`}
                    >
                      {issueTypeLabels[effectiveLabel]}
                    </span>
                    {isReviewed && event.humanLabel !== event.issueType && (
                      <div className="text-xs text-gray-500">
                        AI: {issueTypeLabels[event.issueType]}
                      </div>
                    )}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <span className="text-sm text-gray-900">
                      {(event.confidence * 100).toFixed(0)}%
                    </span>
                    <div className="ml-2 w-16 bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-blue-600 h-2 rounded-full"
                        style={{ width: `${event.confidence * 100}%` }}
                      />
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {event.address || "—"}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

