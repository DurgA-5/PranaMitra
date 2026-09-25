import { Eye, Pencil, Trash2 } from "lucide-react";
import bloodBanks from "../../data/bloodbanks";

function BloodBankTable() {
  return (
    <div className="bg-white rounded-2xl shadow-md overflow-hidden">

      <div className="px-6 py-5 border-b">
        <h2 className="text-xl font-bold text-slate-800">
          Blood Banks
        </h2>

        <p className="text-gray-500 text-sm mt-1">
          Registered blood banks across India.
        </p>
      </div>

      <div className="overflow-x-auto">

        <table className="min-w-full">

          <thead className="bg-slate-100">

            <tr>

              <th className="px-6 py-4 text-left">ID</th>
              <th className="px-6 py-4 text-left">Blood Bank</th>
              <th className="px-6 py-4 text-left">City</th>
              <th className="px-6 py-4 text-left">Phone</th>
              <th className="px-6 py-4 text-left">Blood Groups</th>
              <th className="px-6 py-4 text-left">Status</th>
              <th className="px-6 py-4 text-center">Actions</th>

            </tr>

          </thead>

          <tbody>

            {bloodBanks.map((bank) => (

              <tr key={bank.id} className="border-b hover:bg-gray-50">

                <td className="px-6 py-4">{bank.id}</td>

                <td className="px-6 py-4 font-semibold">
                  {bank.name}
                </td>

                <td className="px-6 py-4">
                  {bank.city}
                </td>

                <td className="px-6 py-4">
                  {bank.phone}
                </td>

                <td className="px-6 py-4">
                  {bank.bloodGroups}
                </td>

                <td className="px-6 py-4">

                  <span
                    className={`px-3 py-1 rounded-full text-sm font-semibold ${
                      bank.status === "Available"
                        ? "bg-green-100 text-green-700"
                        : "bg-yellow-100 text-yellow-700"
                    }`}
                  >
                    {bank.status}
                  </span>

                </td>

                <td className="px-6 py-4">

                  <div className="flex justify-center gap-3">

                    <button className="text-blue-600">
                      <Eye size={18} />
                    </button>

                    <button className="text-green-600">
                      <Pencil size={18} />
                    </button>

                    <button className="text-red-600">
                      <Trash2 size={18} />
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