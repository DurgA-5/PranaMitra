import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Eye, Building } from "lucide-react";
import bloodBankService from "../../services/bloodBankService";

function RecentBloodBanks() {
  const [banks, setBanks] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchRecent = async () => {
      try {
        setLoading(true);
        const response = await bloodBankService.getAllBloodBanks();
        const list = Array.isArray(response) ? response : response?.data ?? [];
        const sorted = [...list].sort((a, b) => b.id - a.id).slice(0, 5);
        setBanks(sorted);
      } catch (error) {
        console.error("Failed to load recent blood banks", error);
      } finally {
        setLoading(false);
      }
    };
    fetchRecent();
  }, []);

  if (loading) {
    return (
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 h-[400px] flex flex-col justify-between animate-pulse">
        <div className="flex justify-between items-center mb-6">
          <div className="h-6 bg-slate-200 rounded w-1/3"></div>
          <div className="h-4 bg-slate-200 rounded w-12"></div>
        </div>
        <div className="space-y-3 flex-1">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-10 bg-slate-100 rounded-xl w-full"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 h-[400px] flex flex-col justify-between hover:shadow-md transition-shadow select-none">
      <div className="flex-1 flex flex-col min-h-0">
        {/* Card Header */}
        <div className="flex justify-between items-center mb-5 shrink-0">
          <div className="flex items-center gap-2.5">
            <h2 className="text-base font-bold text-slate-800 tracking-tight">Recent Blood Banks</h2>
            <span className="bg-indigo-50 text-indigo-600 text-[10px] font-bold px-2 py-0.5 rounded-full border border-indigo-100">
              {banks.length} Facilities
            </span>
          </div>

          <button
            onClick={() => navigate("/admin/bloodbanks")}
            className="text-xs font-semibold text-slate-500 hover:text-indigo-600 transition"
          >
            View All
          </button>
        </div>

        {/* Scrollable Table Area / Empty State */}
        {banks.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center border border-slate-100 border-dashed rounded-xl flex-1">
            <Building className="text-slate-300 mb-2 animate-bounce" size={36} />
            <h3 className="text-sm font-bold text-slate-800">No Blood Banks Yet</h3>
            <p className="text-slate-400 text-xs mt-1">Add a blood bank to see data here.</p>
          </div>
        ) : (
          <div className="flex-1 overflow-y-auto rounded-xl border border-slate-100 scrollbar-thin min-h-0">
            <table className="w-full text-left text-xs border-collapse">
              <thead className="sticky top-0 bg-slate-50 text-slate-500 font-bold uppercase tracking-wider text-[10px] border-b border-slate-100 z-10">
                <tr>
                  <th className="py-3 px-4">Blood Bank</th>
                  <th className="py-3 px-4">City</th>
                  <th className="py-3 px-4">Contact</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-center">Actions</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100">
                {banks.map((bank) => (
                  <tr
                    key={bank.id}
                    className="hover:bg-slate-50/50 transition-colors"
                  >
                    <td className="py-3 px-4 font-bold text-slate-700 whitespace-nowrap">
                      {bank.bloodBankName}
                    </td>
                    <td className="py-3 px-4 text-slate-600 whitespace-nowrap">
                      {bank.city}
                    </td>
                    <td className="py-3 px-4 text-slate-500 font-mono text-[11px] whitespace-nowrap">
                      {bank.mobileNumber}
                    </td>
                    <td className="py-3 px-4 whitespace-nowrap">
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${
                          bank.active
                            ? "bg-green-50 text-green-700 border-green-200"
                            : "bg-slate-50 text-slate-600 border-slate-200"
                        }`}
                      >
                        {bank.active ? "Active" : "Inactive"}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-center">
                      <button
                        type="button"
                        onClick={() => navigate(`/admin/bloodbanks`)}
                        className="text-slate-400 hover:text-indigo-600 p-1 rounded-lg hover:bg-slate-100 transition inline-flex items-center"
                        title="View blood bank details"
                      >
                        <Eye size={14} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

export default RecentBloodBanks;
