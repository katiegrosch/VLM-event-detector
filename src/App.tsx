import React, { useState, useEffect } from "react";
import { Event, EventFilters } from "./types";
import { fetchEvents, saveReview, getZones, getDrivers } from "./api";
import { Filters } from "./components/Filters";
import { EventList } from "./components/EventList";
import { EventDetail } from "./components/EventDetail";
import { ShareModal } from "./components/ShareModal";
import { Truck } from "lucide-react";

function App() {
  const [events, setEvents] = useState<Event[]>([]);
  const [filteredEvents, setFilteredEvents] = useState<Event[]>([]);
  const [filters, setFilters] = useState<EventFilters>({});
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [showShareModal, setShowShareModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [zones, setZones] = useState<string[]>([]);
  const [drivers, setDrivers] = useState<Array<{ id: string; name: string }>>([]);

  // Initial load
  useEffect(() => {
    const loadInitialData = async () => {
      setLoading(true);
      try {
        const allEvents = await fetchEvents();
        setEvents(allEvents);
        setFilteredEvents(allEvents);
        setZones(getZones());
        setDrivers(getDrivers());
      } finally {
        setLoading(false);
      }
    };

    loadInitialData();
  }, []);

  // Apply filters whenever they change
  useEffect(() => {
    const applyFilters = async () => {
      setLoading(true);
      try {
        const filtered = await fetchEvents(filters);
        setFilteredEvents(filtered);
      } finally {
        setLoading(false);
      }
    };

    applyFilters();
  }, [filters]);

  const handleSaveReview = async (
    eventId: string,
    humanLabel: Event["issueType"],
    notes: string
  ) => {
    const updatedEvent = await saveReview(eventId, humanLabel, notes);
    
    // Update the event in all lists
    setEvents((prev) =>
      prev.map((e) => (e.id === eventId ? updatedEvent : e))
    );
    setFilteredEvents((prev) =>
      prev.map((e) => (e.id === eventId ? updatedEvent : e))
    );
    
    // Update the selected event
    if (selectedEvent?.id === eventId) {
      setSelectedEvent(updatedEvent);
    }
  };

  const handleSelectEvent = (event: Event) => {
    setSelectedEvent(event);
  };

  const handleCloseDetail = () => {
    setSelectedEvent(null);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-full mx-auto px-6 py-4">
          <div className="flex items-center gap-3">
            <Truck className="w-8 h-8 text-blue-600" />
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Waste Management Event Review
              </h1>
              <p className="text-sm text-gray-600">
                Review and manage events detected from dashcam footage
              </p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-full mx-auto">
        {/* Filters */}
        <Filters
          filters={filters}
          onFiltersChange={setFilters}
          zones={zones}
          drivers={drivers}
          eventCount={filteredEvents.length}
          onShareResults={() => setShowShareModal(true)}
        />

        {/* Event List */}
        <div className="bg-white">
          {filteredEvents.length === 0 && !loading ? (
            <div className="py-12 text-center">
              <p className="text-gray-500">
                No events found. Try adjusting your filters.
              </p>
            </div>
          ) : (
            <EventList
              events={filteredEvents}
              selectedEventId={selectedEvent?.id}
              onSelectEvent={handleSelectEvent}
              loading={loading}
            />
          )}
        </div>
      </main>

      {/* Event Detail Modal */}
      {selectedEvent && (
        <EventDetail
          event={selectedEvent}
          onClose={handleCloseDetail}
          onSave={handleSaveReview}
        />
      )}

      {/* Share Results Modal */}
      {showShareModal && (
        <ShareModal
          events={filteredEvents}
          onClose={() => setShowShareModal(false)}
        />
      )}
    </div>
  );
}

export default App;

