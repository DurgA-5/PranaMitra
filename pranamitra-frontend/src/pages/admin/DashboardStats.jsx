import DashboardCard from "../layout/DashboardCard";

function DashboardStats() {

  const stats = [

    {
      title: "Registered Donors",
      value: "15,420",
      subtitle: "+12% this month",
      color: "text-red-600",
    },

    {
      title: "Blood Requests",
      value: "124",
      subtitle: "Active Today",
      color: "text-orange-600",
    },

    {
      title: "Blood Banks",
      value: "326",
      subtitle: "Across India",
      color: "text-blue-600",
    },

    {
      title: "Lives Saved",
      value: "8,245",
      subtitle: "Growing Daily",
      color: "text-green-600",
    },

  ];

  return (

    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">

      {stats.map((item) => (

        <DashboardCard
          key={item.title}
          title={item.title}
          value={item.value}
          subtitle={item.subtitle}
          color={item.color}
        />

      ))}

    </div>

  );

}

export default DashboardStats;