import { ApiVenue, ApiVendor } from "@/pages/Hirer";

//Props for the PreferenceList component
type VenuePreference = {
  id: number;
  rank: number;
  venue: ApiVenue;
};

type PreferenceListProps = {
  preferences: VenuePreference[];
  venues: ApiVenue[];
  vendors: ApiVendor[];
  onViewVenue: (venue: ApiVenue) => void;
  onRemovePreference: (preferenceId: number) => void;
};

//Component that displays a list of user's saved venue preferences

export default function PreferenceList(props: PreferenceListProps) {
  const { preferences, venues, vendors, onViewVenue, onRemovePreference } =
    props;

  /** Check if the user has any saved preferences */
  const hasSavedPreferences = preferences.length > 0;

  return (
    <div className="space-y-4">
      <div className="mb-4">
        <p className="text-sm font-medium text-[#6B6B8D]">Preference list</p>
        <h2 className="text-2xl font-semibold text-[#2B0F74]">
          Your saved venue preferences
        </h2>
      </div>

      {!hasSavedPreferences ? (
        <div className="rounded-3xl border border-[#E8E5F8] bg-[#F9F7FF] p-6 text-[#4B4B6B]">
          <p>You haven't saved any venues to your preference list yet.</p>
          <p className="mt-2 text-sm">
            Open a venue's details and add it to your list to apply later.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {/* List of saved preferences */}
          {preferences.map((item) => {
           const currentVenue = item.venue ?? venues.find((v) => v.id === item.venue?.id);
          const currentVendor =
              currentVenue?.vendor ??
              vendors.find((v) => v.id === currentVenue?.vendorID);

            if (!currentVenue) {
              return null;
            }

            return (
              <div
                key={item.id}
                className="rounded-[28px] border border-[#E8E5F8] bg-white p-5 shadow-sm"
              >
                <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                  <div>
                    <p className="text-sm text-[#6B6B8D]">Rank {item.rank}</p>
                    <h3 className="text-xl font-semibold text-[#2B0F74]">
                      {currentVenue.name}
                    </h3>
                    <p className="mt-1 text-sm text-[#4B4B6B]">
                      {currentVenue.type} • {currentVenue.location}
                    </p>
                    <p className="mt-2 text-sm text-[#4B4B6B]">
                      Vendor: {currentVendor?.name || "Unknown"}
                    </p>
                  </div>

                  {/* Action buttons */}
                  <div className="flex flex-col gap-2 sm:items-end">
                    <button
                      type="button"
                      onClick={() => onViewVenue(currentVenue)}
                      className="inline-flex rounded-2xl bg-[#736CED] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#6259d9]"
                    >
                      View details
                    </button>
                    <button
                      type="button"
                      onClick={() => onRemovePreference(item.id)}
                      className="inline-flex rounded-2xl border border-[#E6E0F8] bg-white px-4 py-2 text-sm font-semibold text-[#2B0F74] transition hover:bg-[#F7F5FF]"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
