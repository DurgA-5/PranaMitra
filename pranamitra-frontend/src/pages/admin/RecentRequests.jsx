function RecentRequests() {

  const requests = [

    {
      patient: "Rahul Sharma",
      blood: "O+",
      hospital: "Apollo Hospital",
      status: "Emergency",
    },

    {
      patient: "Priya Singh",
      blood: "A-",
      hospital: "AIIMS",
      status: "Pending",
    },

    {
      patient: "Ramesh Kumar",
      blood: "B+",
      hospital: "Care Hospital",
      status: "Accepted",
    },

  ];

  return (

    <div className="bg-white rounded-2xl shadow-md p-6">

      <h2 className="text-xl font-bold mb-6">
        Recent Blood Requests
      </h2>

      <table className="w-full">

        <thead>

          <tr className="text-left border-b">

            <th className="pb-3">Patient</th>

            <th>Blood</th>

            <th>Hospital</th>

            <th>Status</th>

          </tr>

        </thead>

        <tbody>

          {requests.map((item, index) => (

            <tr key={index} className="border-b">

              <td className="py-4">
                {item.patient}
              </td>

              <td>{item.blood}</td>

              <td>{item.hospital}</td>

              <td>

                <span className="bg-red-100 text-red-700 px-3 py-1 rounded-full text-sm">

                  {item.status}

                </span>

              </td>

            </tr>

          ))}

        </tbody>

      </table>

    </div>

  );

}

export default RecentRequests;