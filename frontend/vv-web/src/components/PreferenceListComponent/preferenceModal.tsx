import { useAppContext } from "@/context/AppContext";
import { useEffect, useState } from "react";
import axios from "axios";
import { Venue } from "@/context/AppContext";


const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

// Props for the PreferenceModal component
type PreferenceModalProps = {
  venue: Venue;
  initialRank?: number;
  onClose: () => void;
  onSave: (rank: number) => void;
};

// adding or updating a venue preference rank

export default function PreferenceModal(props: PreferenceModalProps) {
  const { venue, initialRank, onClose, onSave } = props;
  const { currentUser } = useAppContext();

  /** State for the preference rank input */
  const [rank, setRank] = useState(initialRank ? initialRank.toString() : "");
  /** State for error message */
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Update the rank state to reflect the new initial rank value
  useEffect(() => {
    setRank(initialRank?.toString() || "");
  }, [initialRank]);

  // Handles changes to the rank input
  const handleRankChange = (value: string) => {
    setRank(value);

    if (error) {
      setError("");
    }
  };

  // Handles saving the preference rank
  const handleSave = async () => {
    // Validate user is logged in and is a hirer
    if (!currentUser || currentUser.role !== "hirer") {
      setError("Please sign in as a hirer to save preferences");
      return;
    }

    const numericRank = Number(rank);
    if (!rank || Number.isNaN(numericRank) || numericRank <= 0) {
      setError("Please choose a valid preference rank.");
      return;
    }

    setIsSubmitting(true);

    try {
      await axios.post(`${API_BASE_URL}/preferences`, {
        hirerID: currentUser.id,
        venueID: venue.id,
        rank: numericRank,
      });

      onSave(numericRank);
    } catch (err: any) {
      console.log(err);
      setError(err?.response?.data?.message || "Failed to save preference");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm">
      <div className="w-full max-w-md overflow-hidden rounded-[28px] bg-white shadow-2xl">
        <div className="p-6">
          {/* Header with title and close button */}
          <div className="flex items-start justify-between gap-4 border-b border-gray-200 pb-4">
            <div>
              <h2 className="text-2xl font-semibold text-[#2B0F74]">
                Add to preference list
              </h2>
              <p className="mt-1 text-sm text-[#6B6B8D]">
                Choose how highly you prefer this venue.
              </p>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-[#F7F5FF] text-[#2B0F74] transition hover:bg-[#EDEBFF]"
              aria-label="Close preference modal"
            >
              ×
            </button>
          </div>

          {/* Main content with venue info and rank input */}
          <div className="space-y-4 py-6">
            <div className="rounded-2xl border border-[#E6E0F8] bg-[#F9F7FF] p-4 text-sm text-[#292B36]">
              <p className="font-semibold text-[#2B0F74]">Venue</p>
              <p>{venue.name}</p>
              <p className="mt-1 text-[#6B6B8D]">
                {venue.location} • {venue.type}
              </p>
            </div>

            {/* Rank input field */}
            <label className="space-y-2 text-sm font-medium text-[#2B0F74]">
              <span>Preference rank *</span>
              <input
                type="number"
                min="1"
                value={rank}
                onChange={(e) => handleRankChange(e.target.value)}
                placeholder="Enter 1 for highest preference"
                className="w-full rounded-2xl border border-[#E6E0F8] bg-[#F9F7FF] px-4 py-3 text-sm text-[#292B36] outline-none focus:border-[#8C73FF] focus:ring-2 focus:ring-[#A78CFF]/30"
              />
              {error ? <p className="text-xs text-red-600">{error}</p> : null}
            </label>
          </div>

          {/* Action buttons */}
          <div className="flex justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={() => onClose()}
              className="rounded-2xl border border-[#D4C1EC] bg-white px-5 py-3 text-sm font-semibold text-[#2B0F74] transition hover:bg-[#F7F5FF]"
            >
              Cancel
            </button>

            <button
              type="button"
              onClick={handleSave}
              disabled={isSubmitting || !currentUser || currentUser.role !== "hirer"}
              className={`rounded-2xl px-5 py-3 text-sm font-semibold text-white transition ${
                currentUser && currentUser.role === "hirer"
                  ? "bg-[#736CED] hover:bg-[#6259d9] disabled:opacity-50"
                  : "bg-gray-400 cursor-not-allowed"
              }`}
            >
              {currentUser?.role == "hirer" ? "Save preference" : "Login as hirer to save"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}