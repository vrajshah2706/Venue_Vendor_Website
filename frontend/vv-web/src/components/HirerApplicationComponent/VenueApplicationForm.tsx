import { useState, useEffect, type FormEvent } from "react";
import { Venue,Vendor, UnavailableSlot} from "@/context/AppContext";

type VenueApplicationFormProps = {
  venue: Venue;
  vendor?: Vendor;
  unavailableSlots: UnavailableSlot[];
  onClose: () => void;
  onSubmit: (application: {
    eventName: string;
    eventType: string;
    dateTime: string;
    people: number;
    duration: number;
    comment: string;
  }) => void;
};

export default function VenueApplicationForm({ venue, vendor, unavailableSlots, onClose, onSubmit }: VenueApplicationFormProps) {
  const [eventName, setEventName] = useState("");
  const [eventType, setEventType] = useState(venue.type);
  const [dateTime, setDateTime] = useState("");
  const [people, setPeople] = useState("");
  const [duration, setDuration] = useState("");
  const [message, setMessage] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [availabilityError, setAvailabilityError] = useState("");

  const eventTypeOptions = Array.from(new Set([venue.type, "Function", "Bar", "Party", "Conference"]));

  //checking for authorisation if the user is logged in as hirer or not, to change the enquire now button 
  const [isHirer, setIsHirer] = useState(false);
  
  useEffect(() => {
    const storedUser = localStorage.getItem("currentUser");

    //not signed in yet
    if (!storedUser) {
      setIsHirer(false);
      return;
    }
    //if signed in check if hirer 
    try {
      const user = JSON.parse(storedUser);
      setIsHirer(user?.role === "hirer");
    } catch {
      setIsHirer(false);
    }
  }, []);
  
  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault(); 
    //checking if the current user applying is hirer or not
    const storedUser = localStorage.getItem("currentUser");

    if (!storedUser) {
      return;
    }

    const user = JSON.parse(storedUser);

    if (user.role !== "hirer") {
      return;
    } 
          

    //validating form inputs and showing error messages if invalid
    const newErrors: Record<string, string> = {};

    if (!eventName.trim()) newErrors.eventName = "Please enter an event name.";
    if (!eventType) newErrors.eventType = "Please select an event type.";
    if (!dateTime) newErrors.dateTime = "Please choose a date and time.";
    if (!people || Number(people) <= 0) newErrors.people = "Please enter the number of people.";
    if (!duration || Number(duration) <= 0) newErrors.duration = "Please enter a duration in minutes.";

    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;
    //checking if the venue is available at the selected date and time by comparing with unavailable slots of the venue
    const eventStart = new Date(dateTime);
    const eventEnd = new Date(eventStart.getTime() + Number(duration) * 60000);

    const venueUnavailable = unavailableSlots.some((slot) => {
      if (slot.venueID !== venue.id) return false;
      const slotStart = new Date(slot.from);
      const slotEnd = new Date(slot.to);
      if (Number.isNaN(slotStart.getTime()) || Number.isNaN(slotEnd.getTime())) return false;
      return eventStart < slotEnd && eventEnd > slotStart;
    });

    if (venueUnavailable) {
      setAvailabilityError("This venue is unavailable at the selected date and time.");
      return;
    }

    setAvailabilityError("");
    onSubmit({
      eventName,
      eventType,
      dateTime,
      people: Number(people),
      duration: Number(duration),
      comment: message,
    });
  };

  
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
      <div className="w-full max-w-3xl overflow-hidden rounded-[28px] bg-white shadow-2xl">
        <div className="p-6">
          <div className="flex items-start justify-between gap-4 pb-4 border-b border-gray-200">
            <div>
              <h2 className="text-2xl font-semibold text-[#2B0F74]">Apply for {venue.name}</h2>
              <p className="mt-1 text-sm text-[#6B6B8D]">Supply information below to submit your venue request.</p>
            </div>
            <button
              onClick={onClose}
              className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-[#F7F5FF] text-[#2B0F74] transition hover:bg-[#EDEBFF]"
              aria-label="Close application form"
            >
              ×
            </button>
          </div>
          {/* form to apply to the venue with event details and message to supplier, with validation and error messages */}
          <form className="grid gap-5 py-6" onSubmit={handleSubmit}>
            {/* event name and type */}
            <div className="grid gap-4 sm:grid-cols-2">
             
              <label className="space-y-2 text-sm font-medium text-[#2B0F74]">
                Event name *
                <input
                  value={eventName}
                  onChange={(e) => setEventName(e.target.value)}
                  placeholder="Enter the event name"
                  className="w-full rounded-2xl border border-[#E6E0F8] bg-[#F9F7FF] px-4 py-3 text-sm text-[#292B36] outline-none focus:border-[#8C73FF] focus:ring-2 focus:ring-[#A78CFF]/30"
                />
                {errors.eventName && <p className="text-xs text-red-600">{errors.eventName}</p>}
              </label>

              <label className="space-y-2 text-sm font-medium text-[#2B0F74]">
                Event type *
                <select
                  value={eventType}
                  onChange={(e) => setEventType(e.target.value)}
                  className="w-full rounded-2xl border border-[#E6E0F8] bg-[#F9F7FF] px-4 py-3 text-sm text-[#292B36] outline-none focus:border-[#8C73FF] focus:ring-2 focus:ring-[#A78CFF]/30"
                >
                  {eventTypeOptions.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
                {errors.eventType && <p className="text-xs text-red-600">{errors.eventType}</p>}
              </label>
            </div>
            {/* event date and time, people, duration */}
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="space-y-2 text-sm font-medium text-[#2B0F74]">
                Event date and time *
                <input
                  type="datetime-local"
                  value={dateTime}
                  onChange={(e) => setDateTime(e.target.value)}
                  className="w-full rounded-2xl border border-[#E6E0F8] bg-[#F9F7FF] px-4 py-3 text-sm text-[#292B36] outline-none focus:border-[#8C73FF] focus:ring-2 focus:ring-[#A78CFF]/30"
                />
                {errors.dateTime && <p className="text-xs text-red-600">{errors.dateTime}</p>}
                {availabilityError && <p className="text-xs text-red-600">{availabilityError}</p>}
              </label>

              <label className="space-y-2 text-sm font-medium text-[#2B0F74]">
                Number of people *
                <input
                  type="number"
                  min="1"
                  value={people}
                  onChange={(e) => setPeople(e.target.value)}
                  placeholder="Enter a number"
                  className="w-full rounded-2xl border border-[#E6E0F8] bg-[#F9F7FF] px-4 py-3 text-sm text-[#292B36] outline-none focus:border-[#8C73FF] focus:ring-2 focus:ring-[#A78CFF]/30"
                />
                {errors.people && <p className="text-xs text-red-600">{errors.people}</p>}
              </label>

              <label className="space-y-2 text-sm font-medium text-[#2B0F74]">
                Duration (minutes) *
                <input
                  type="number"
                  min="1"
                  value={duration}
                  onChange={(e) => setDuration(e.target.value)}
                  placeholder="Enter duration"
                  className="w-full rounded-2xl border border-[#E6E0F8] bg-[#F9F7FF] px-4 py-3 text-sm text-[#292B36] outline-none focus:border-[#8C73FF] focus:ring-2 focus:ring-[#A78CFF]/30"
                />
                {errors.duration && <p className="text-xs text-red-600">{errors.duration}</p>}
              </label>
            </div>
            {/* message to supplier */}
            <div className="space-y-2 text-sm font-medium text-[#2B0F74]">
              <label>
                Message to supplier
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  rows={4}
                  placeholder="Share more information here about your enquiry"
                  className="w-full rounded-2xl border border-[#E6E0F8] bg-[#F9F7FF] px-4 py-3 text-sm text-[#292B36] outline-none focus:border-[#8C73FF] focus:ring-2 focus:ring-[#A78CFF]/30"
                />
              </label>
            </div>
            {/* submit and cancel buttons, submit button disabled if not logged in as hirer */}
            <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
              <button
                type="button"
                onClick={onClose}
                className="w-full rounded-2xl border border-[#D4C1EC] bg-white px-5 py-3 text-sm font-semibold text-[#2B0F74] transition hover:bg-[#F7F5FF] sm:w-auto"
              >
                Cancel
              </button>
              
              <button
                type="submit"
                disabled={!isHirer}
                className={`w-full rounded-2xl px-5 py-3 text-sm font-semibold text-white transition sm:w-auto ${
                  isHirer
                    ? "bg-[#ff3b82] hover:bg-[#e11d48]"
                    : "bg-gray-400 cursor-not-allowed"
                }`}
              >
                {isHirer ? "Enquire Now" : "Login as hirer to apply"}
              </button>
              
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
