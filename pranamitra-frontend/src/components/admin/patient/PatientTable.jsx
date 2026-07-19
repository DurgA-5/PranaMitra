import { Eye, Pencil, Trash2, ArrowUpDown, ArrowUp, ArrowDown } from "lucide-react";

function PatientTable({
  patients = [],
  onView,
  onEdit,
  onDeleteClick,
  sortField,
  sortOrder,
  onSort,
}) {
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

  const renderSortIndicator = (field) => {
    if (sortField !== field) {
      return <ArrowUpDown size={14} className="ml-1 text-slate-400 inline" />;
    }
    return sortOrder === "asc" ? (
      <ArrowUp size={14} className="ml-1 text-red-600 inline font-bold" />
    ) : (
      <ArrowDown size={14} className="ml-1 text-red-600 inline font-bold" />
    );
  };

  return (
    <div className="overflow-hidden rounded-2xl bg-white shadow-sm border border-slate-100">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-slate-100 text-left text-sm">
          <thead className="bg-slate-50 text-slate-700">
            <tr>
              <th className="px-6 py-4 font-semibold">ID</th>
              <th
                onClick={() => onSort("patientName")}
                className="px-6 py-4 font-semibold cursor-pointer select-none hover:bg-slate-100 transition-colors"
                role="columnheader"
                aria-sort={sortField === "patientName" ? (sortOrder === "asc" ? "ascending" : "descending") : "none"}
              >
                Patient Name {renderSortIndicator("patientName")}
              </th>
              <th
                onClick={() => onSort("bloodGroup")}
                className="px-6 py-4 font-semibold cursor-pointer select-none hover:bg-slate-100 transition-colors"
                role="columnheader"
                aria-sort={sortField === "bloodGroup" ? (sortOrder === "asc" ? "ascending" : "descending") : "none"}
              >
                Blood Group {renderSortIndicator("bloodGroup")}
              </th>
              <th className="px-6 py-4 font-semibold">Gender / Age</th>
              <th className="px-6 py-4 font-semibold">Attender Mobile</th>
              <th
                onClick={() => onSort("city")}
                className="px-6 py-4 font-semibold cursor-pointer select-none hover:bg-slate-100 transition-colors"
                role="columnheader"
                aria-sort={sortField === "city" ? (sortOrder === "asc" ? "ascending" : "descending") : "none"}
              >
                City {renderSortIndicator("city")}
              </th>
              <th
                onClick={() => onSort("emergencyLevel")}
                className="px-6 py-4 font-semibold cursor-pointer select-none hover:bg-slate-100 transition-colors"
                role="columnheader"
                aria-sort={sortField === "emergencyLevel" ? (sortOrder === "asc" ? "ascending" : "descending") : "none"}
              >
                Emergency {renderSortIndicator("emergencyLevel")}
              </th>
              <th
                onClick={() => onSort("requestStatus")}
                className="px-6 py-4 font-semibold cursor-pointer select-none hover:bg-slate-100 transition-colors"
                role="columnheader"
                aria-sort={sortField === "requestStatus" ? (sortOrder === "asc" ? "ascending" : "descending") : "none"}
              >
                Status {renderSortIndicator("requestStatus")}
              </th>
              <th className="px-6 py-4 font-semibold text-center">Actions</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-100 bg-white">
            {patients.map((patient) => (
              <tr
                key={patient.id}
                className="transition-colors hover:bg-slate-50/50"
              >
                <td className="px-6 py-4 font-medium text-slate-500 font-mono text-xs">
                  #{patient.id}
                </td>

                <td className="px-6 py-4">
                  <div className="font-semibold text-slate-800">
                    {patient.patientName || "-"}
                  </div>
                  <div className="text-xs text-slate-400 mt-0.5">
                    Doctor: {patient.doctorName || "-"}
                  </div>
                </td>

                <td className="px-6 py-4">
                  <span className="rounded-lg bg-red-50 text-red-600 px-2.5 py-1 text-xs font-bold border border-red-100">
                    {formatBloodGroup(patient.bloodGroup)}
                  </span>
                </td>

                <td className="px-6 py-4 text-slate-600">
                  {patient.gender || "-"} / {patient.age || "-"} yrs
                </td>

                <td className="px-6 py-4 text-slate-600 font-mono text-xs">
                  {patient.attenderMobile || "-"}
                </td>

                <td className="px-6 py-4 text-slate-600">
                  {patient.city || "-"}
                </td>

                <td className="px-6 py-4">
                  <span
                    className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                      patient.emergencyLevel === "CRITICAL"
                        ? "bg-red-50 text-red-700 border border-red-200 animate-pulse"
                        : patient.emergencyLevel === "HIGH"
                        ? "bg-orange-50 text-orange-700 border border-orange-200"
                        : patient.emergencyLevel === "MEDIUM"
                        ? "bg-yellow-50 text-yellow-700 border border-yellow-200"
                        : "bg-blue-50 text-blue-700 border border-blue-200"
                    }`}
                  >
                    {patient.emergencyLevel || "-"}
                  </span>
                </td>

                <td className="px-6 py-4">
                  <span
                    className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                      patient.requestStatus === "APPROVED" || patient.requestStatus === "COMPLETED"
                        ? "bg-green-50 text-green-700 border border-green-200"
                        : patient.requestStatus === "PENDING"
                        ? "bg-amber-50 text-amber-700 border border-amber-200"
                        : "bg-slate-50 text-slate-600 border border-slate-200"
                    }`}
                  >
                    {patient.requestStatus || "-"}
                  </span>
                </td>

                <td className="px-6 py-4">
                  <div className="flex justify-center gap-2">
                    <button
                      type="button"
                      onClick={() => onView?.(patient)}
                      className="text-slate-600 hover:text-blue-600 p-1.5 rounded-xl hover:bg-slate-100 transition focus:outline-none focus:ring-2 focus:ring-slate-100"
                      title="View details"
                      aria-label={`View details of ${patient.patientName}`}
                    >
                      <Eye size={16} />
                    </button>

                    <button
                      type="button"
                      onClick={() => onEdit?.(patient)}
                      className="text-slate-600 hover:text-green-600 p-1.5 rounded-xl hover:bg-slate-100 transition focus:outline-none focus:ring-2 focus:ring-slate-100"
                      title="Edit patient"
                      aria-label={`Edit ${patient.patientName}`}
                    >
                      <Pencil size={16} />
                    </button>

                    <button
                      type="button"
                      onClick={() => onDeleteClick?.(patient.id)}
                      className="text-slate-600 hover:text-red-600 p-1.5 rounded-xl hover:bg-slate-100 transition focus:outline-none focus:ring-2 focus:ring-slate-100"
                      title="Delete patient"
                      aria-label={`Delete ${patient.patientName}`}
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default PatientTable;
