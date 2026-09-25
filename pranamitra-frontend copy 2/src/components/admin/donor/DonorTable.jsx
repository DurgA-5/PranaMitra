import { Eye, Pencil, Trash2, ArrowUpDown, ArrowUp, ArrowDown } from "lucide-react";

function DonorTable({
  donors = [],
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
                onClick={() => onSort("fullName")}
                className="px-6 py-4 font-semibold cursor-pointer select-none hover:bg-slate-100 transition-colors"
                role="columnheader"
                aria-sort={sortField === "fullName" ? (sortOrder === "asc" ? "ascending" : "descending") : "none"}
              >
                Name {renderSortIndicator("fullName")}
              </th>
              <th
                onClick={() => onSort("bloodGroup")}
                className="px-6 py-4 font-semibold cursor-pointer select-none hover:bg-slate-100 transition-colors"
                role="columnheader"
                aria-sort={sortField === "bloodGroup" ? (sortOrder === "asc" ? "ascending" : "descending") : "none"}
              >
                Blood Group {renderSortIndicator("bloodGroup")}
              </th>
              <th className="px-6 py-4 font-semibold">Gender</th>
              <th className="px-6 py-4 font-semibold">Mobile</th>
              <th
                onClick={() => onSort("city")}
                className="px-6 py-4 font-semibold cursor-pointer select-none hover:bg-slate-100 transition-colors"
                role="columnheader"
                aria-sort={sortField === "city" ? (sortOrder === "asc" ? "ascending" : "descending") : "none"}
              >
                City {renderSortIndicator("city")}
              </th>
              <th
                onClick={() => onSort("availableToDonate")}
                className="px-6 py-4 font-semibold cursor-pointer select-none hover:bg-slate-100 transition-colors"
                role="columnheader"
                aria-sort={sortField === "availableToDonate" ? (sortOrder === "asc" ? "ascending" : "descending") : "none"}
              >
                Availability {renderSortIndicator("availableToDonate")}
              </th>
              <th
                onClick={() => onSort("verified")}
                className="px-6 py-4 font-semibold cursor-pointer select-none hover:bg-slate-100 transition-colors"
                role="columnheader"
                aria-sort={sortField === "verified" ? (sortOrder === "asc" ? "ascending" : "descending") : "none"}
              >
                Verified {renderSortIndicator("verified")}
              </th>
              <th className="px-6 py-4 font-semibold text-center">Actions</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-100 bg-white">
            {donors.map((donor) => (
              <tr
                key={donor.id}
                className="transition-colors hover:bg-slate-50/50"
              >
                <td className="px-6 py-4 font-medium text-slate-500 font-mono text-xs">
                  #{donor.id}
                </td>

                <td className="px-6 py-4">
                  <div className="font-semibold text-slate-800">
                    {donor.fullName || "-"}
                  </div>
                  <div className="text-xs text-slate-400 mt-0.5">{donor.email || "-"}</div>
                </td>

                <td className="px-6 py-4">
                  <span className="rounded-lg bg-red-50 text-red-600 px-2.5 py-1 text-xs font-bold border border-red-100">
                    {formatBloodGroup(donor.bloodGroup)}
                  </span>
                </td>

                <td className="px-6 py-4 text-slate-600">
                  {donor.gender || "-"}
                </td>

                <td className="px-6 py-4 text-slate-600 font-mono text-xs">
                  {donor.mobileNumber || "-"}
                </td>

                <td className="px-6 py-4 text-slate-600">
                  {donor.city || "-"}
                </td>

                <td className="px-6 py-4">
                  <span
                    className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                      donor.availableToDonate
                        ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                        : "bg-slate-50 text-slate-600 border border-slate-200"
                    }`}
                  >
                    <span className={`w-1.5 h-1.5 rounded-full ${
                      donor.availableToDonate ? "bg-emerald-500" : "bg-slate-400"
                    }`} />
                    {donor.availableToDonate ? "Available" : "Unavailable"}
                  </span>
                </td>

                <td className="px-6 py-4">
                  <span
                    className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                      donor.verified
                        ? "bg-blue-50 text-blue-700 border border-blue-200"
                        : "bg-amber-50 text-amber-700 border border-amber-200"
                    }`}
                  >
                    {donor.verified ? "Verified" : "Pending"}
                  </span>
                </td>

                <td className="px-6 py-4">
                  <div className="flex justify-center gap-2">
                    <button
                      type="button"
                      onClick={() => onView?.(donor)}
                      className="text-slate-600 hover:text-blue-600 p-1.5 rounded-xl hover:bg-slate-100 transition focus:outline-none focus:ring-2 focus:ring-slate-100"
                      title="View details"
                      aria-label={`View details of ${donor.fullName}`}
                    >
                      <Eye size={16} />
                    </button>

                    <button
                      type="button"
                      onClick={() => onEdit?.(donor)}
                      className="text-slate-600 hover:text-green-600 p-1.5 rounded-xl hover:bg-slate-100 transition focus:outline-none focus:ring-2 focus:ring-slate-100"
                      title="Edit donor"
                      aria-label={`Edit ${donor.fullName}`}
                    >
                      <Pencil size={16} />
                    </button>

                    <button
                      type="button"
                      onClick={() => onDeleteClick?.(donor.id)}
                      className="text-slate-600 hover:text-red-600 p-1.5 rounded-xl hover:bg-slate-100 transition focus:outline-none focus:ring-2 focus:ring-slate-100"
                      title="Delete donor"
                      aria-label={`Delete ${donor.fullName}`}
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

export default DonorTable;