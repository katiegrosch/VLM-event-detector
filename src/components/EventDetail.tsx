import React, { useState } from "react";
import { Event, IssueType, issueTypeLabels, issueTypeColors } from "../types";
import {
  X,
  Save,
  Share2,
  Copy,
  CheckCircle,
  AlertCircle,
  MapPin,
  User,
  Calendar,
  Route,
} from "lucide-react";

interface EventDetailProps {
  event: Event;
  onClose: () => void;
  onSave: (eventId: string, humanLabel: IssueType, notes: string) => Promise<void>;
}

const issueTypeOptions: IssueType[] = [
  "missed_pickup",
  "blocked_access",
  "bin_missing",
  "overflow_visible",
  "none",
];

export const EventDetail: React.FC<EventDetailProps> = ({
  event,
  onClose,
  onSave,
}) => {
  const [humanLabel, setHumanLabel] = useState<IssueType>(
    event.humanLabel || event.issueType
  );
  const [notes, setNotes] = useState(event.notes || "");
  const [saving, setSaving] = useState(false);
  const [showDriverShare, setShowDriverShare] = useState(false);
  const [showExternalShare, setShowExternalShare] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    try {
      await onSave(event.id, humanLabel, notes);
    } finally {
      setSaving(false);
    }
  };

  const hasChanges =
    humanLabel !== (event.humanLabel || event.issueType) ||
    notes !== (event.notes || "");

  const isReviewed = !!event.humanLabel;

  // Generate shareable summaries
  const driverShareText = `
Event Review - ${event.id}
Driver: ${event.driverName}
Date: ${new Date(event.timestamp).toLocaleString()}
Location: ${event.address || event.zone}
Issue: ${issueTypeLabels[humanLabel]}
${notes ? `Notes: ${notes}` : ""}

Review this event for coaching purposes.
  `.trim();

  const externalShareText = `
Event Reference: ${event.id}
Date: ${new Date(event.timestamp).toLocaleString()}
Location: ${event.address || event.zone}
Route: ${event.routeId}
Issue Type: ${issueTypeLabels[humanLabel]}
${notes ? `Details: ${notes}` : ""}
  `.trim();

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-5xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">{event.id}</h2>
            <p className="text-sm text-gray-500 mt-1">
              {new Date(event.timestamp).toLocaleString()}
            </p>
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
          {/* Video Player */}
          <div className="bg-gray-900 rounded-lg overflow-hidden">
            {event.videoUrl.includes('drive.google.com') ? (
              <iframe
                src={event.videoUrl}
                className="w-full"
                style={{ height: "400px" }}
                allow="autoplay"
                title="Event Video"
              />
            ) : (
              <video
                src={event.videoUrl}
                controls
                className="w-full"
                style={{ maxHeight: "400px" }}
              >
                Your browser does not support the video tag.
              </video>
            )}
          </div>

          {/* Event Metadata */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="flex items-start gap-2">
              <User className="w-5 h-5 text-gray-400 mt-0.5" />
              <div>
                <div className="text-sm font-medium text-gray-900">
                  {event.driverName}
                </div>
                <div className="text-xs text-gray-500">{event.driverId}</div>
              </div>
            </div>
            <div className="flex items-start gap-2">
              <MapPin className="w-5 h-5 text-gray-400 mt-0.5" />
              <div>
                <div className="text-sm font-medium text-gray-900">{event.zone}</div>
                <div className="text-xs text-gray-500">
                  {event.address || "No address"}
                </div>
              </div>
            </div>
            <div className="flex items-start gap-2">
              <Route className="w-5 h-5 text-gray-400 mt-0.5" />
              <div>
                <div className="text-sm font-medium text-gray-900">
                  Route {event.routeId}
                </div>
                <div className="text-xs text-gray-500">Route ID</div>
              </div>
            </div>
            <div className="flex items-start gap-2">
              <Calendar className="w-5 h-5 text-gray-400 mt-0.5" />
              <div>
                <div className="text-sm font-medium text-gray-900">
                  {new Date(event.timestamp).toLocaleDateString()}
                </div>
                <div className="text-xs text-gray-500">
                  {new Date(event.timestamp).toLocaleTimeString()}
                </div>
              </div>
            </div>
          </div>

          {/* AI Detection */}
          <div className="bg-gray-50 rounded-lg p-4 space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold text-gray-900">
                AI Detection
              </h3>
              <span
                className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                  issueTypeColors[event.issueType]
                }`}
              >
                {issueTypeLabels[event.issueType]}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Confidence</span>
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-gray-900">
                  {(event.confidence * 100).toFixed(0)}%
                </span>
                <div className="w-24 bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-blue-600 h-2 rounded-full"
                    style={{ width: `${event.confidence * 100}%` }}
                  />
                </div>
              </div>
            </div>
            {isReviewed && (
              <div className="flex items-center gap-2 text-green-600 text-sm">
                <CheckCircle className="w-4 h-4" />
                <span>Reviewed by ops manager</span>
              </div>
            )}
          </div>

          {/* Human Override */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-blue-600" />
              <h3 className="text-lg font-semibold text-gray-900">
                Human Review
              </h3>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Override Issue Type
              </label>
              <select
                value={humanLabel}
                onChange={(e) => setHumanLabel(e.target.value as IssueType)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {issueTypeOptions.map((type) => (
                  <option key={type} value={type}>
                    {issueTypeLabels[type]}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Notes (Coaching, Context, etc.)
              </label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={4}
                placeholder="Add any relevant notes, coaching feedback, or context..."
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <button
              onClick={handleSave}
              disabled={!hasChanges || saving}
              className={`w-full flex items-center justify-center gap-2 px-4 py-2 rounded-md font-medium transition-colors ${
                hasChanges && !saving
                  ? "bg-blue-600 text-white hover:bg-blue-700"
                  : "bg-gray-300 text-gray-500 cursor-not-allowed"
              }`}
            >
              <Save className="w-4 h-4" />
              {saving ? "Saving..." : "Save Review"}
            </button>
          </div>

          {/* Share Section */}
          <div className="space-y-4 border-t pt-6">
            <div className="flex items-center gap-2">
              <Share2 className="w-5 h-5 text-blue-600" />
              <h3 className="text-lg font-semibold text-gray-900">Share Event</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Share with Driver */}
              <div className="border border-gray-200 rounded-lg p-4 space-y-3">
                <h4 className="font-medium text-gray-900">Share with Driver</h4>
                <p className="text-sm text-gray-600">
                  Create a summary for driver coaching
                </p>
                <button
                  onClick={() => setShowDriverShare(!showDriverShare)}
                  className="w-full px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors text-sm font-medium"
                >
                  Generate Driver Summary
                </button>
                {showDriverShare && (
                  <div className="space-y-2">
                    <pre className="text-xs bg-gray-50 p-3 rounded border border-gray-200 overflow-x-auto whitespace-pre-wrap">
                      {driverShareText}
                    </pre>
                    <button
                      onClick={() => copyToClipboard(driverShareText)}
                      className="w-full flex items-center justify-center gap-2 px-3 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors text-sm"
                    >
                      <Copy className="w-4 h-4" />
                      {copied ? "Copied!" : "Copy to Clipboard"}
                    </button>
                  </div>
                )}
              </div>

              {/* Share Externally */}
              <div className="border border-gray-200 rounded-lg p-4 space-y-3">
                <h4 className="font-medium text-gray-900">Share Externally</h4>
                <p className="text-sm text-gray-600">
                  Create a summary for city/resident
                </p>
                <button
                  onClick={() => setShowExternalShare(!showExternalShare)}
                  className="w-full px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors text-sm font-medium"
                >
                  Generate External Summary
                </button>
                {showExternalShare && (
                  <div className="space-y-2">
                    <pre className="text-xs bg-gray-50 p-3 rounded border border-gray-200 overflow-x-auto whitespace-pre-wrap">
                      {externalShareText}
                    </pre>
                    <button
                      onClick={() => copyToClipboard(externalShareText)}
                      className="w-full flex items-center justify-center gap-2 px-3 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors text-sm"
                    >
                      <Copy className="w-4 h-4" />
                      {copied ? "Copied!" : "Copy to Clipboard"}
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

