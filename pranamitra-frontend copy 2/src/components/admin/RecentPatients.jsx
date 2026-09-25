import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Eye } from "lucide-react";
import patientService from "../../services/patientService";

function RecentPatients() {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchRecent = async () => {
      try {
        setLoading(true);
        const response = await patientService.getAllPatients();
        const list = Array.isArray(response) ? response : response?.data ?? [];
        const sorted = [...list].sort((a, b) => b.id - a.id).slice(0, 5);
        setPatients(sorted);
      } catch (error) {
        console.error("Failed to load recent patients", error);
      } finally {
        setLoading(false);
      }
    };
    fetchRecent();
  }, []);

  const getEmergencyColor = (level) => {
    switch (level) {
      case "CRITICAL":
        return "bg-red-50 text-red-700 border border-red-200 font-bold animate-pulse";
      case "HIGH":
        return "bg-orange-50 text-orange-700 border border-orange-200 font-semibold";
      case "MEDIUM":
        return "bg-blue-50 text-blue-700 border border-blue-200";
      default:
        return "bg-slate-50 text-slate-700 border border-slate-200";
    }
  };

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
            <h2 className="text-base font-bold text-slate-800 tracking-tight">Recent Patients</h2>
            <span className="bg-orange-50 text-orange-600 text-[10px] font-bold px-2 py-0.5 rounded-full border border-orange-100">
              {patients.length} New
            </span>
          </div>

          <button
            onClick={() => navigate("/admin/patients")}
            className="text-xs font-semibold text-slate-500 hover:text-orange-600 transition"
          >
            View All
          </button>
        </div>

        {/* Scrollable Table Area */}
        <div className="flex-1 overflow-y-auto rounded-xl border border-slate-100 scrollbar-thin min-h-0">
          <table className="w-full text-left text-xs border-collapse">
            <thead className="sticky top-0 bg-slate-50 text-slate-500 font-bold uppercase tracking-wider text-[10px] border-b border-slate-100 z-10">
              <tr>
                <th className="py-3 px-4">Name</th>
                <th className="py-3 px-4">Hospital</th>
                <th className="py-3 px-4 text-center">Group</th>
                <th className="py-3 px-4">Priority</th>
                <th className="py-3 px-4">City</th>
                <th className="py-3 px-4">Required Date</th>
                <th className="py-3 px-4 text-center">Actions</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100">
              {patients.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-400 font-medium">
                    No registered patients found.
                  </td>
                </tr>
              ) : (
                patients.map((patient) => (
                  <tr
                    key={patient.id}
                    className="hover:bg-slate-50/50 transition-colors"
                  >
                    <td className="py-3 px-4 font-bold text-slate-700 whitespace-nowrap">
                      {patient.patientName}
                    </td>
                    <td className="py-3 px-4 text-slate-500 max-w-[140px] truncate whitespace-nowrap">
                      {patient.hospitalName}
                    </td>
                    <td className="py-3 px-4 text-center">
                      <span className="bg-red-50 text-red-600 font-bold px-2 py-0.5 rounded text-[10px] border border-red-100 inline-block">
                        {formatBloodGroup(patient.bloodGroup)}
                      </span>
                    </td>
                    <td className="py-3 px-4 whitespace-nowrap">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${getEmergencyColor(patient.emergencyLevel)}`}>
                        {patient.emergencyLevel}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-slate-600 whitespace-nowrap">
                      {patient.city}
                    </td>
                    <td className="py-3 px-4 text-slate-500 text-[11px] whitespace-nowrap">
                      {patient.requiredDate || (patient.createdAt ? new Date(patient.createdAt).toLocaleDateString() : "-")}
                    </td>
                    <td className="py-3 px-4 text-center">
                      <button
                        type="button"
                        onClick={() => navigate(`/admin/patients`)}
                        className="text-slate-400 hover:text-orange-600 p-1 rounded-lg hover:bg-slate-100 transition inline-flex items-center"
                        title="View patient management"
                      >
                        <Eye size={14} />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default RecentPatients;
