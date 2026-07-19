import { Eye, Pencil, Trash2, ArrowUpDown, ArrowUp, ArrowDown } from "lucide-react";

function BloodBankTable({
  bloodBanks = [],
  onView,
  onEdit,
  onDeleteClick,
  sortField,
  sortOrder,
  onSort,
}) {
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
                onClick={() => onSort("bloodBankName")}
                className="px-6 py-4 font-semibold cursor-pointer select-none hover:bg-slate-100 transition-colors"
                role="columnheader"
                aria-sort={sortField === "bloodBankName" ? (sortOrder === "asc" ? "ascending" : "descending") : "none"}
              >
                Blood Bank {renderSortIndicator("bloodBankName")}
              </th>
              <th className="px-6 py-4 font-semibold">Manager</th>
              <th className="px-6 py-4 font-semibold">Email & Phone</th>
              <th
                onClick={() => onSort("city")}
                className="px-6 py-4 font-semibold cursor-pointer select-none hover:bg-slate-100 transition-colors"
                role="columnheader"
                aria-sort={sortField === "city" ? (sortOrder === "asc" ? "ascending" : "descending") : "none"}
              >
                City {renderSortIndicator("city")}
              </th>
              <th className="px-6 py-4 font-semibold">Hours</th>
              <th
                onClick={() => onSort("active")}
                className="px-6 py-4 font-semibold cursor-pointer select-none hover:bg-slate-100 transition-colors"
                role="columnheader"
                aria-sort={sortField === "active" ? (sortOrder === "asc" ? "ascending" : "descending") : "none"}
              >
                Status {renderSortIndicator("active")}
              </th>
              <th className="px-6 py-4 font-semibold text-center">Actions</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-100 bg-white">
            {bloodBanks.map((bank) => (
              <tr
                key={bank.id}
                className="transition-colors hover:bg-slate-50/50"
              >
                <td className="px-6 py-4 font-medium text-slate-500 font-mono text-xs">
                  #{bank.id}
                </td>

                <td className="px-6 py-4">
                  <div className="font-semibold text-slate-800">
                    {bank.bloodBankName}
                  </div>
                  <div className="text-xs text-slate-400 mt-0.5">Lic: {bank.licenseNumber}</div>
                </td>

                <td className="px-6 py-4 text-slate-600">
                  {bank.managerName}
                </td>

                <td className="px-6 py-4 text-slate-600 text-xs">
                  <div className="font-semibold">{bank.email}</div>
                  <div className="text-slate-400 mt-0.5 font-mono">{bank.mobileNumber}</div>
                </td>

                <td className="px-6 py-4 text-slate-600">
                  {bank.city}
                </td>

                <td className="px-6 py-4 text-slate-600">
                  {bank.available24Hours ? (
                    <span className="rounded-lg bg-green-50 text-green-700 px-2.5 py-0.5 text-xs font-semibold border border-green-200">
                      24 Hours
                    </span>
                  ) : (
                    <span className="text-xs">
                      {bank.openingTime ? bank.openingTime.substring(0, 5) : "-"} -{" "}
                      {bank.closingTime ? bank.closingTime.substring(0, 5) : "-"}
                    </span>
                  )}
                </td>

                <td className="px-6 py-4">
                  <span
                    className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                      bank.active
                        ? "bg-green-50 text-green-700 border border-green-200"
                        : "bg-slate-50 text-slate-600 border border-slate-200"
                    }`}
                  >
                    {bank.active ? "Active" : "Inactive"}
                  </span>
                </td>

                <td className="px-6 py-4">
                  <div className="flex justify-center gap-2">
                    <button
                      type="button"
                      onClick={() => onView?.(bank)}
                      className="text-slate-600 hover:text-blue-600 p-1.5 rounded-xl hover:bg-slate-100 transition focus:outline-none focus:ring-2 focus:ring-slate-100"
                      title="View details"
                      aria-label={`View details of ${bank.bloodBankName}`}
                    >
                      <Eye size={16} />
                    </button>

                    <button
                      type="button"
                      onClick={() => onEdit?.(bank)}
                      className="text-slate-600 hover:text-green-600 p-1.5 rounded-xl hover:bg-slate-100 transition focus:outline-none focus:ring-2 focus:ring-slate-100"
                      title="Edit blood bank"
                      aria-label={`Edit ${bank.bloodBankName}`}
                    >
                      <Pencil size={16} />
                    </button>

                    <button
                      type="button"
                      onClick={() => onDeleteClick?.(bank.id)}
                      className="text-slate-600 hover:text-red-600 p-1.5 rounded-xl hover:bg-slate-100 transition focus:outline-none focus:ring-2 focus:ring-slate-100"
                      title="Delete blood bank"
                      aria-label={`Delete ${bank.bloodBankName}`}
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

export default BloodBankTable;
