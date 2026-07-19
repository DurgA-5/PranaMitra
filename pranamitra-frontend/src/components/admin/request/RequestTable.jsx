import { Eye, Pencil, Trash2, CheckCircle2, XCircle, Award, Ban, ArrowUpDown, ArrowUp, ArrowDown } from "lucide-react";

function RequestTable({
  requests = [],
  onView,
  onEdit,
  onDeleteClick,
  onStatusClick,
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
              <th className="px-6 py-4 font-semibold">Request ID</th>
              <th
                onClick={() => onSort("patientName")}
                className="px-6 py-4 font-semibold cursor-pointer select-none hover:bg-slate-100 transition-colors"
                role="columnheader"
                aria-sort={sortField === "patientName" ? (sortOrder === "asc" ? "ascending" : "descending") : "none"}
              >
                Patient {renderSortIndicator("patientName")}
              </th>
              <th
                onClick={() => onSort("bloodGroup")}
                className="px-6 py-4 font-semibold cursor-pointer select-none hover:bg-slate-100 transition-colors"
                role="columnheader"
                aria-sort={sortField === "bloodGroup" ? (sortOrder === "asc" ? "ascending" : "descending") : "none"}
              >
                Blood Group {renderSortIndicator("bloodGroup")}
              </th>
              <th
                onClick={() => onSort("unitsRequired")}
                className="px-6 py-4 font-semibold cursor-pointer select-none hover:bg-slate-100 transition-colors text-center"
                role="columnheader"
                aria-sort={sortField === "unitsRequired" ? (sortOrder === "asc" ? "ascending" : "descending") : "none"}
              >
                Units {renderSortIndicator("unitsRequired")}
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
                onClick={() => onSort("requiredDate")}
                className="px-6 py-4 font-semibold cursor-pointer select-none hover:bg-slate-100 transition-colors"
                role="columnheader"
                aria-sort={sortField === "requiredDate" ? (sortOrder === "asc" ? "ascending" : "descending") : "none"}
              >
                Required Date {renderSortIndicator("requiredDate")}
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
            {requests.map((request) => (
              <tr
                key={request.id}
                className="transition-colors hover:bg-slate-50/50"
              >
                <td className="px-6 py-4 font-medium text-slate-500 font-mono text-xs">
                  {request.requestNumber || `#${request.id}`}
                </td>

                <td className="px-6 py-4 font-semibold text-slate-800">
                  {request.patientName || "-"}
                </td>

                <td className="px-6 py-4">
                  <span className="rounded-lg bg-red-50 text-red-600 px-2.5 py-1 text-xs font-bold border border-red-100">
                    {formatBloodGroup(request.bloodGroup)}
                  </span>
                </td>

                <td className="px-6 py-4 text-center font-bold text-slate-800">
                  {request.unitsRequired || "-"}
                </td>

                <td className="px-6 py-4">
                  <span
                    className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                      request.emergencyLevel === "CRITICAL"
                        ? "bg-red-50 text-red-700 border border-red-200 animate-pulse font-bold"
                        : request.emergencyLevel === "HIGH"
                        ? "bg-orange-50 text-orange-700 border border-orange-200"
                        : request.emergencyLevel === "MEDIUM"
                        ? "bg-yellow-50 text-yellow-700 border border-yellow-200"
                        : "bg-blue-50 text-blue-700 border border-blue-200"
                    }`}
                  >
                    {request.emergencyLevel || "-"}
                  </span>
                </td>

                <td className="px-6 py-4 text-slate-600 text-xs font-mono">
                  {request.requiredDate || "-"}
                </td>

                <td className="px-6 py-4">
                  <span
                    className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                      request.requestStatus === "APPROVED"
                        ? "bg-blue-50 text-blue-700 border border-blue-200"
                        : request.requestStatus === "COMPLETED"
                        ? "bg-green-50 text-green-700 border border-green-200"
                        : request.requestStatus === "PENDING"
                        ? "bg-amber-50 text-amber-700 border border-amber-200"
                        : request.requestStatus === "REJECTED"
                        ? "bg-red-50 text-red-700 border border-red-200"
                        : "bg-slate-50 text-slate-600 border border-slate-200"
                    }`}
                  >
                    {request.requestStatus || "-"}
                  </span>
                </td>

                <td className="px-6 py-4">
                  <div className="flex items-center justify-center gap-2">
                    {/* State transitions */}
                    {request.requestStatus === "PENDING" && (
                      <>
                        <button
                          type="button"
                          onClick={() => onStatusClick(request.id, "approve", "Approve Request", "Are you sure you want to approve this blood request?", "Request approved successfully.")}
                          className="text-green-600 hover:bg-green-50 p-1.5 rounded-lg border border-transparent hover:border-green-100 transition"
                          title="Approve Request"
                          aria-label="Approve request"
                        >
                          <CheckCircle2 size={16} />
                        </button>
                        <button
                          type="button"
                          onClick={() => onStatusClick(request.id, "reject", "Reject Request", "Are you sure you want to reject this blood request?", "Request rejected successfully.")}
                          className="text-red-500 hover:bg-red-50 p-1.5 rounded-lg border border-transparent hover:border-red-100 transition"
                          title="Reject Request"
                          aria-label="Reject request"
                        >
                          <XCircle size={16} />
                        </button>
                      </>
                    )}

                    {request.requestStatus === "APPROVED" && (
                      <>
                        <button
                          type="button"
                          onClick={() => onStatusClick(request.id, "complete", "Mark Completed", "Are you sure this request is successfully completed?", "Request completed successfully.")}
                          className="text-green-600 hover:bg-green-50 p-1.5 rounded-lg border border-transparent hover:border-green-100 transition"
                          title="Mark Completed"
                          aria-label="Mark completed"
                        >
                          <Award size={16} />
                        </button>
                        <button
                          type="button"
                          onClick={() => onStatusClick(request.id, "cancel", "Cancel Request", "Are you sure you want to cancel this request?", "Request cancelled.")}
                          className="text-slate-500 hover:bg-slate-50 p-1.5 rounded-lg border border-transparent hover:border-slate-100 transition"
                          title="Cancel Request"
                          aria-label="Cancel request"
                        >
                          <Ban size={16} />
                        </button>
                      </>
                    )}

                    {request.requestStatus === "REJECTED" && (
                      <button
                        type="button"
                        onClick={() => onStatusClick(request.id, "approve", "Approve Request", "Are you sure you want to approve this rejected request?", "Request approved successfully.")}
                        className="text-green-600 hover:bg-green-50 p-1.5 rounded-lg border border-transparent hover:border-green-100 transition"
                        title="Approve Request"
                        aria-label="Approve request"
                      >
                        <CheckCircle2 size={16} />
                      </button>
                    )}

                    <span className="w-px h-4 bg-slate-100 mx-1"></span>

                    <button
                      type="button"
                      onClick={() => onView?.(request)}
                      className="text-slate-600 hover:text-blue-600 p-1.5 rounded-xl hover:bg-slate-100 transition focus:outline-none focus:ring-2 focus:ring-slate-100"
                      title="View details"
                      aria-label="View request details"
                    >
                      <Eye size={16} />
                    </button>

                    {request.requestStatus !== "COMPLETED" && (
                      <button
                        type="button"
                        onClick={() => onEdit?.(request)}
                        className="text-slate-600 hover:text-green-600 p-1.5 rounded-xl hover:bg-slate-100 transition focus:outline-none focus:ring-2 focus:ring-slate-100"
                        title="Edit request"
                        aria-label="Edit request"
                      >
                        <Pencil size={16} />
                      </button>
                    )}

                    <button
                      type="button"
                      onClick={() => onDeleteClick(request.id)}
                      className="text-slate-600 hover:text-red-600 p-1.5 rounded-xl hover:bg-slate-100 transition focus:outline-none focus:ring-2 focus:ring-slate-100"
                      title="Delete request"
                      aria-label="Delete request"
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

export default RequestTable;
