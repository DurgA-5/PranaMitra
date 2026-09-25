function DashboardCard({
  title,
  value,
  color = "text-red-600",
  subtitle,
}) {
  return (
    <div className="bg-white rounded-2xl shadow-md p-6 hover:shadow-xl transition duration-300">

      <p className="text-gray-500 text-sm">
        {title}
      </p>

      <h2 className={`text-4xl font-bold mt-4 ${color}`}>
        {value}
      </h2>

      <p className="mt-3 text-sm text-gray-500">
        {subtitle}
      </p>

    </div>
  );
}

export default DashboardCard;