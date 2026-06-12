type FilterSidebarProps = {
locations: string[];
eventTypes: string[];
capacityOptions: number[];
selectedLocation: string;
selectedType: string;
selectedCapacity: string;
searchQuery: string;
onLocationChange: (value: string) => void;
onTypeChange: (value: string) => void;
onCapacityChange: (value: string) => void;
onSearchChange: (value: string) => void;
onClear: () => void;
className?: string;
};

// kept this as a default export since it's probably only used in one place right now
export default function FilterSidebar(props: FilterSidebarProps) {
        const {
        locations,
        eventTypes,
        capacityOptions,
        selectedLocation,
        selectedType,
        selectedCapacity,
        searchQuery,
        onLocationChange,
        onTypeChange,
        onCapacityChange,
        onSearchChange,
        onClear,
        className = "",
        } = props;

        const wrapperClass =
        "overflow-hidden rounded-[28px] border border-[#E8E5F8] bg-white p-6 shadow-[0_18px_40px_rgba(115,108,237,0.08)] " +
        className;

        return (
            <aside className={wrapperClass}>
            {/* heading + reset action */}
            <div className="mb-5 flex items-center justify-between">
            <div>
            <h2 className="text-xl font-semibold text-[#3B22A1]">Filter results</h2>
            <p className="mt-1 text-sm text-[#6B6B8D]">
            Refine by available venue data.
            </p>
            </div>

                <button
                type="button"
                onClick={onClear}
                className="rounded-xl border border-[#E5D9FF] bg-[#F7F2FF] px-3 py-2 text-sm font-medium text-[#5B3ED8] transition hover:bg-[#ede4ff]"
                >
                Clear
                </button>
            </div>

            <div className="space-y-4">
                {/* location */}
                <div className="space-y-2">
                <label
                    htmlFor="locationFilter"
                    className="block text-sm font-semibold text-[#342D7E]"
                >
                    Location
                </label>

                <select
                    id="locationFilter"
                    value={selectedLocation}
                    onChange={(e) => {
                    onLocationChange(e.target.value);
                    }}
                    className="w-full rounded-2xl border border-[#E6E0F8] bg-[#F9F7FF] px-4 py-3 text-sm text-[#292B36] outline-none focus:border-[#8C73FF] focus:ring-2 focus:ring-[#A78CFF]/30"
                >
                    <option value="">All locations</option>
                    {locations.map((place) => {
                    return (
                        <option key={place} value={place}>
                        {place}
                        </option>
                    );
                    })}
                </select>
                </div>

                {/* event type filter */}
                <div className="space-y-2">
                <label
                    htmlFor="typeFilter"
                    className="block text-sm font-semibold text-[#342D7E]"
                >
                    Event type
                </label>

                <select
                    id="typeFilter"
                    value={selectedType}
                    onChange={(e) => onTypeChange(e.target.value)}
                    className="w-full rounded-2xl border border-[#E6E0F8] bg-[#F9F7FF] px-4 py-3 text-sm text-[#292B36] outline-none focus:border-[#8C73FF] focus:ring-2 focus:ring-[#A78CFF]/30"
                >
                    <option value="">All event types</option>
                    {eventTypes.map((item) => (
                    <option key={item} value={item}>
                        {item}
                    </option>
                    ))}
                </select>
                </div>

                {/* minimum capacity - leaving it as string because the select gives us strings anyway */}
                <div className="space-y-2">
                <label
                    htmlFor="capacityFilter"
                    className="block text-sm font-semibold text-[#342D7E]"
                >
                    Minimum capacity
                </label>

                <select
                    id="capacityFilter"
                    value={selectedCapacity}
                    onChange={(e) => onCapacityChange(e.target.value)}
                    className="w-full rounded-2xl border border-[#E6E0F8] bg-[#F9F7FF] px-4 py-3 text-sm text-[#292B36] outline-none focus:border-[#8C73FF] focus:ring-2 focus:ring-[#A78CFF]/30"
                >
                    <option value="">Any capacity</option>
                    {capacityOptions.map((num) => (
                    <option key={num} value={num}>
                        {num} guests+
                    </option>
                    ))}
                </select>
                </div>

                {/* simple text search, maybe later this can support tags too */}
                <div className="space-y-2">
                <label
                    htmlFor="searchFilter"
                    className="block text-sm font-semibold text-[#342D7E]"
                >
                    Search venues
                </label>

                <input
                    id="searchFilter"
                    type="text"
                    value={searchQuery}
                    onChange={(e) => onSearchChange(e.target.value)}
                    placeholder="Search by venue or location"
                    className="w-full rounded-2xl border border-[#E6E0F8] bg-[#F9F7FF] px-4 py-3 text-sm text-[#292B36] outline-none focus:border-[#8C73FF] focus:ring-2 focus:ring-[#A78CFF]/30"
                />
                </div>
            </div>
            </aside>

        );
}