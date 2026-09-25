import { useEffect, useMemo, useState } from "react";
import { toast } from "react-toastify";
import { Search, X, History as HistoryIcon, RefreshCw } from "lucide-react";
import donorPortalService from "../../services/donorPortalService";
import { getUserId } from "../../utils/token";

import Pagination from "../../components/common/Pagination";
import EmptyState from "../../components/common/EmptyState";

function History() {
  const userId = getUserId();

  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  // Search state
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  // Sort state
  const [sortField, setSortField] = useState("id");
  const [sortOrder, setSortOrder] = useState("desc");

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
    }, 300);
    return () => clearTimeout(timer);
  }, [search]);

  const loadHistory = async () => {
    try {
      setLoading(true);
      const data = await donorPortalService.getDonationHistory(userId);
      setHistory(data || []);
    } catch (error) {
      console.error("Failed to load donation history", error);
      toast.error("Failed to fetch donation history.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadHistory();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    setCurrentPage(1);
  }, [debouncedSearch]);

  const handleSort = (field) => {
    if (sortField === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortOrder("asc");
    }
  };

  // Filter matching requests
  const filteredHistory = useMemo(() => {
    const query = debouncedSearch.trim().toLowerCase();

    return history.filter((item) => {
      const pPatient = item.patientName || "";
      const pHospital = item.hospitalName || "";

      return (
        !query ||
        pPatient.toLowerCase().includes(query) ||
        pHospital.toLowerCase().includes(query)
      );
    });
  }, [history, debouncedSearch]);

  // Sort logic
  const sortedHistory = useMemo(() => {
    return [...filteredHistory].sort((a, b) => {
      let aVal = a[sortField];
      let bVal = b[sortField];

      if (sortField === "patientName") {
        aVal = a.patientName || "";
        bVal = b.patientName || "";
      }

      if (typeof aVal === "string") {
        return sortOrder === "asc" ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal);
      } else {
        if (aVal < bVal) return sortOrder === "asc" ? -1 : 1;
        if (aVal > bVal) return sortOrder === "asc" ? 1 : -1;
        return 0;
      }
    });
  }, [filteredHistory, sortField, sortOrder]);

  // Paginated logic
  const paginatedHistory = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return sortedHistory.slice(start, start + pageSize);
  }, [sortedHistory, currentPage, pageSize]);

  const formatBloodGroup = (bg) => {
    if (!bg) return "-";
    return bg
      .replace("A_POSITIVE", "A+")
      .replace("A_NEGATIVE", "A-")
      .replace("B_POSITIVE", "B+")
      .replace("B_NEGATIVE", "B-")
      .replace("AB_POSITIVE", "AB+")
      .replace("AB_NEGATIVE", "AB-")
      .replace("O_POSITIVE", "O+")
      .replace("O_NEGATIVE", "O-");
  };

  return (
    <>
      <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-800 tracking-tight">Donation History</h1>
          <p className="mt-2 text-gray-500 font-medium">Review your past blood donations and completed records.</p>
        </div>
        <button
          type="button"
          onClick={loadHistory}
          className="flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-3 text-slate-600 hover:bg-slate-50 transition"
        >
          <RefreshCw size={18} /> Refresh
        </button>
      </div>

      {/* Filter and Search */}
      <div className="mb-6 rounded-2xl bg-white p-6 shadow-sm border border-slate-100 max-w-md">
        <div className="flex items-center rounded-xl border border-slate-200 px-4 focus-within:border-red-500 focus-within:ring-2 focus-within:ring-red-50 transition bg-white relative">
          <Search size={18} className="text-gray-400 shrink-0" />
          <input
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search patient, hospital..."
            className="ml-3 w-full py-3 outline-none bg-transparent text-sm text-slate-800 pr-6"
          />
          {search && (
            <button
              type="button"
              onClick={() => setSearch("")}
              className="absolute right-3 p-1 rounded-full text-slate-400 hover:bg-slate-100"
            >
              <X size={14} />
            </button>
          )}
        </div>
      </div>

      {loading ? (
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 space-y-4 animate-pulse">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-12 bg-slate-100 rounded-xl"></div>
          ))}
        </div>
      ) : filteredHistory.length === 0 ? (
        <EmptyState
          title="No History Found"
          description={
            debouncedSearch
              ? `We couldn't find any history matching "${debouncedSearch}".`
              : "You don't have any past blood donations in the system yet."
          }
          icon={HistoryIcon}
          actionText={debouncedSearch ? "Clear Search" : undefined}
          onAction={debouncedSearch ? () => setSearch("") : undefined}
        />
      ) : (
        <>
          <div className="overflow-hidden rounded-2xl bg-white shadow-sm border border-slate-100">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-slate-100 text-left text-sm">
                <thead className="bg-slate-50 text-slate-700">
                  <tr>
                    <th
                      onClick={() => handleSort("donationDate")}
                      className="px-6 py-4 font-semibold cursor-pointer hover:bg-slate-100 select-none"
                    >
                      Donation Date
                    </th>
                    <th
                      onClick={() => handleSort("patientName")}
                      className="px-6 py-4 font-semibold cursor-pointer hover:bg-slate-100 select-none"
                    >
                      Patient
                    </th>
                    <th className="px-6 py-4 font-semibold">Hospital</th>
                    <th className="px-6 py-4 font-semibold text-center">Blood Group</th>
                    <th className="px-6 py-4 font-semibold text-center">Units</th>
                    <th className="px-6 py-4 font-semibold">Status</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-slate-100 bg-white">
                  {paginatedHistory.map((item) => (
                    <tr key={item.id} className="hover:bg-slate-50/50">
                      <td className="px-6 py-4 text-slate-500 font-mono text-xs">
                        {item.donationDate}
                      </td>
                      <td className="px-6 py-4 font-semibold text-slate-800">
                        {item.patientName || "-"}
                      </td>
                      <td className="px-6 py-4 text-slate-600">
                        {item.hospitalName || "-"}
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span className="rounded-lg bg-red-50 text-red-600 px-2.5 py-1 text-xs font-bold border border-red-100">
                          {formatBloodGroup(item.bloodGroup)}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-center font-bold text-slate-800">
                        {item.units || "-"}
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                            item.status === "DONATED"
                              ? "bg-green-50 text-green-700 border border-green-200"
                              : "bg-slate-50 text-slate-500 border border-slate-200"
                          }`}
                        >
                          {item.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <Pagination
            currentPage={currentPage}
            pageSize={pageSize}
            totalItems={filteredHistory.length}
            onPageChange={setCurrentPage}
            onPageSizeChange={(size) => {
              setPageSize(size);
              setCurrentPage(1);
            }}
          />
        </>
      )}
    </>
  );
}

export default History;
