import { useState, useEffect, useCallback } from "react";
import authService from "../../services/authService";
import { Search, MapPin, Phone, ExternalLink, RefreshCw } from "lucide-react";

function BloodBanks() {
  const [bloodBanks, setBloodBanks] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Search query & City filter input
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCity, setSelectedCity] = useState("");
  const [cities, setCities] = useState([]);

  const fetchBloodBanks = useCallback(async () => {
    setLoading(true);
    try {
      let data = [];
      if (selectedCity) {
        data = await authService.getBloodBanksByCity(selectedCity);
      } else {
        data = await authService.getBloodBanks();
      }
      setBloodBanks(data);

      // Extract unique cities list if it's the initial load
      if (!selectedCity) {
        const uniqueCities = [...new Set(data.map((item) => item.city))].filter(Boolean);
        setCities(uniqueCities);
      }
    } catch (err) {
      console.error("Error fetching blood banks:", err);
      setBloodBanks([]);
      setCities([]);
    } finally {
      setLoading(false);
    }
  }, [selectedCity]);

  useEffect(() => {
    fetchBloodBanks();
  }, [fetchBloodBanks]);

  // Filter local banks list based on search query string match
  const filteredBanks = bloodBanks.filter((bank) => {
    const nameMatch = bank.bankName?.toLowerCase().includes(searchQuery.toLowerCase());
    const cityMatch = bank.city?.toLowerCase().includes(searchQuery.toLowerCase());
    const addressMatch = bank.address?.toLowerCase().includes(searchQuery.toLowerCase());
    return nameMatch || cityMatch || addressMatch;
  });

  return (
    <section id="blood-banks" className="py-20 bg-white border-b border-slate-100 scroll-mt-16">
      <div className="max-w-7xl mx-auto px-6">
        
        {/* Title */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <h2 className="text-xs font-bold uppercase tracking-widest text-red-600">
            Emergency Search
          </h2>
          <p className="text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight">
            Find Nearby Certified Blood Banks
          </p>
          <div className="w-12 h-1 bg-red-600 mx-auto rounded-full" />
        </div>

        {/* Filter Toolbar Controls */}
        <div className="max-w-4xl mx-auto mb-10 bg-slate-50 border border-slate-100 p-5 rounded-2xl flex flex-col md:flex-row gap-4 items-center">
          
          {/* Text Input Search */}
          <div className="relative w-full md:flex-1">
            <Search className="absolute left-4 top-3.5 text-slate-400" size={18} />
            <input
              type="text"
              placeholder="Search by name, city, address..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-11 pr-4 py-3 rounded-xl border border-slate-200 bg-white text-sm font-semibold text-slate-800 placeholder-slate-400 focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500/20"
            />
          </div>

          {/* City Selection Dropdown */}
          <div className="w-full md:w-64">
            <select
              value={selectedCity}
              onChange={(e) => setSelectedCity(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white text-sm font-semibold text-slate-700 focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500/20"
            >
              <option value="">All Cities</option>
              {cities.map((city) => (
                <option key={city} value={city}>
                  {city}
                </option>
              ))}
            </select>
          </div>

          {/* Refresh action */}
          <button
            onClick={() => {
              setSearchQuery("");
              setSelectedCity("");
              fetchBloodBanks();
            }}
            className="p-3 border border-slate-200 bg-white text-slate-500 hover:text-red-600 hover:border-red-100 hover:shadow-sm rounded-xl transition duration-200 cursor-pointer shrink-0"
            title="Reload blood banks"
          >
            <RefreshCw size={18} className={loading ? "animate-spin" : ""} />
          </button>
        </div>

        {/* Cards Output Display */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-16 space-y-4">
            <div className="w-10 h-10 border-4 border-slate-100 border-t-red-600 rounded-full animate-spin" />
            <p className="text-sm font-bold text-slate-400">Loading blood banks...</p>
          </div>
        ) : filteredBanks.length === 0 ? (
          <div className="text-center py-16 max-w-md mx-auto space-y-4 border border-dashed border-slate-200 rounded-3xl p-8 bg-slate-50/50">
            <MapPin className="mx-auto text-slate-350 stroke-[1.5]" size={44} />
            <div className="space-y-1">
              <h3 className="font-bold text-slate-800">No Blood Banks Found</h3>
              <p className="text-xs text-slate-400 font-semibold leading-relaxed">
                We couldn't find any blood banks matching "{searchQuery || selectedCity}". Try clearing filters or revising terms.
              </p>
            </div>
          </div>
        ) : (
          <div className="max-w-5xl mx-auto grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredBanks.map((bank) => (
              <div
                key={bank.id}
                className="p-6 bg-white border border-slate-100 rounded-2xl shadow-sm hover:shadow-md hover:border-red-100 transition-all duration-300 flex flex-col justify-between"
              >
                <div className="space-y-4">
                  <div className="space-y-1">
                    <span className="text-[9px] font-extrabold uppercase px-2.5 py-1 rounded bg-slate-100 text-slate-600 tracking-wider">
                      {bank.city || "Authorized Center"}
                    </span>
                    <h3 className="text-base font-bold text-slate-900 leading-snug pt-1.5">
                      {bank.bankName}
                    </h3>
                  </div>

                  <div className="space-y-2 text-xs md:text-sm font-semibold text-slate-500">
                    <div className="flex items-start gap-2.5">
                      <MapPin size={15} className="text-red-500 shrink-0 mt-0.5" />
                      <span className="leading-tight">{bank.address}</span>
                    </div>
                    {bank.phoneNumber && (
                      <div className="flex items-center gap-2.5">
                        <Phone size={15} className="text-slate-400 shrink-0" />
                        <span>{bank.phoneNumber}</span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="pt-6 border-t border-slate-100 mt-6 flex justify-between items-center">
                  <a
                    href={`tel:${bank.phoneNumber}`}
                    className="text-xs font-bold text-red-600 hover:text-red-700"
                  >
                    Call Center
                  </a>

                  <a
                    href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                      bank.bankName + " " + bank.address + " " + bank.city
                    )}`}
                    target="_blank"
                    rel="noreferrer"
                    className="text-xs font-bold text-slate-400 hover:text-slate-700 flex items-center gap-1"
                  >
                    Directions
                    <ExternalLink size={11} />
                  </a>
                </div>
              </div>
            ))}
          </div>
        )}

      </div>
    </section>
  );
}

export default BloodBanks;
