import { useCallback, useEffect, useMemo, useState } from "react";
import { toast } from "react-toastify";
import { Building2, Search, X, Phone, MapPin, Clock, RefreshCw } from "lucide-react";
import patientPortalService from "../../services/patientPortalService";
import EmptyState from "../../components/common/EmptyState";

function NearbyBloodBanks() {
  const [banks, setBanks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [cityFilter, setCityFilter] = useState("");

  const fetchBanks = useCallback(async () => {
    try {
      setLoading(true);
      const data = await patientPortalService.getAllBloodBanks();
      setBanks(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load blood banks.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchBanks(); }, [fetchBanks]);

  const cities = useMemo(() => [...new Set(banks.map((b) => b.city).filter(Boolean))].sort(), [banks]);

  const filtered = useMemo(() => {
    return banks.filter((b) => {
      const matchCity = !cityFilter || b.city?.toLowerCase() === cityFilter.toLowerCase();
      const matchSearch = !search ||
        b.bloodBankName?.toLowerCase().includes(search.toLowerCase()) ||
        b.city?.toLowerCase().includes(search.toLowerCase()) ||
        b.address?.toLowerCase().includes(search.toLowerCase());
      return matchCity && matchSearch;
    });
  }, [banks, cityFilter, search]);

  const formatTime = (t) => {
    if (!t) return "—";
    const [h, m] = t.split(":");
    const hour = parseInt(h, 10);
    const ampm = hour >= 12 ? "PM" : "AM";
    return `${hour % 12 || 12}:${m} ${ampm}`;
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
            <Building2 className="text-red-500" size={24} /> Nearby Blood Banks
          </h1>
          <p className="text-slate-500 text-sm mt-1">
            {loading ? "Loading..." : `${filtered.length} blood bank${filtered.length !== 1 ? "s" : ""} found`}
          </p>
        </div>
        <button onClick={fetchBanks} className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white border border-slate-200 text-slate-600 hover:border-red-300 hover:text-red-600 text-sm font-medium transition shadow-sm">
          <RefreshCw size={14} className={loading ? "animate-spin" : ""} /> Refresh
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-4 mb-6 flex flex-wrap gap-3">
        <div className="flex items-center gap-2 flex-1 min-w-[200px] border border-slate-200 rounded-xl px-3 bg-slate-50">
          <Search size={15} className="text-slate-400" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name, city or address..."
            className="flex-1 py-2 bg-transparent text-sm outline-none text-slate-700"
          />
          {search && <button onClick={() => setSearch("")}><X size={14} className="text-slate-400 hover:text-slate-600" /></button>}
        </div>
        <select
          value={cityFilter}
          onChange={(e) => setCityFilter(e.target.value)}
          className="border border-slate-200 rounded-xl px-3 py-2 text-sm text-slate-700 bg-slate-50 outline-none"
        >
          <option value="">All Cities</option>
          {cities.map((c) => <option key={c} value={c}>{c}</option>)}
        </select>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 animate-pulse">
          {[...Array(6)].map((_, i) => <div key={i} className="h-52 bg-white rounded-2xl" />)}
        </div>
      ) : filtered.length === 0 ? (
        <EmptyState title="No Blood Banks Found" description="No blood banks match your search. Try adjusting the filters." icon={Building2} />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {filtered.map((bank) => (
            <div key={bank.id} className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden hover:shadow-md hover:border-red-100 transition-all duration-200 group">
              {/* Header */}
              <div className="bg-gradient-to-r from-red-500 to-rose-500 p-4 text-white">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h3 className="font-bold text-base leading-tight">{bank.bloodBankName}</h3>
                    <p className="text-red-100 text-xs mt-0.5">{bank.licenseNumber}</p>
                  </div>
                  {bank.available24Hours && (
                    <span className="shrink-0 text-xs bg-white/20 text-white font-bold px-2.5 py-1 rounded-lg border border-white/30">
                      24/7
                    </span>
                  )}
                </div>
              </div>

              {/* Body */}
              <div className="p-4 space-y-3">
                <div className="flex items-start gap-2.5 text-sm text-slate-600">
                  <MapPin size={15} className="text-slate-400 mt-0.5 shrink-0" />
                  <span className="leading-snug">{bank.address}, {bank.city}, {bank.state} - {bank.pincode}</span>
                </div>

                <div className="flex items-center gap-2.5 text-sm text-slate-600">
                  <Phone size={15} className="text-slate-400 shrink-0" />
                  <a href={`tel:${bank.mobileNumber}`} className="hover:text-red-600 transition font-medium">
                    {bank.mobileNumber}
                  </a>
                </div>

                {!bank.available24Hours && (
                  <div className="flex items-center gap-2.5 text-sm text-slate-600">
                    <Clock size={15} className="text-slate-400 shrink-0" />
                    <span>{formatTime(bank.openingTime)} – {formatTime(bank.closingTime)}</span>
                  </div>
                )}

                {bank.managerName && (
                  <div className="flex items-center justify-between bg-slate-50 rounded-xl px-3 py-2 text-xs">
                    <span className="text-slate-500 font-semibold uppercase tracking-wider">Manager</span>
                    <span className="font-semibold text-slate-700">{bank.managerName}</span>
                  </div>
                )}

                <a
                  href={`https://maps.google.com/?q=${encodeURIComponent(`${bank.bloodBankName}, ${bank.city}`)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 w-full mt-2 bg-slate-50 hover:bg-red-50 border border-slate-200 hover:border-red-200 text-slate-600 hover:text-red-600 rounded-xl py-2 text-xs font-semibold transition"
                >
                  📍 View on Google Maps
                </a>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default NearbyBloodBanks;
