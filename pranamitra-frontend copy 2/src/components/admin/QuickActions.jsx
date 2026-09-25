import { useNavigate } from "react-router-dom";
import { UserPlus, PlusCircle, Droplet, Building } from "lucide-react";

function QuickActions() {
  const navigate = useNavigate();

  const actions = [
    {
      title: "Add Donor",
      icon: UserPlus,
      color: "text-red-600 bg-red-50/50 hover:bg-red-50 border border-red-100 hover:border-red-200",
      path: "/admin/donors?add=true",
    },
    {
      title: "Add Patient",
      icon: PlusCircle,
      color: "text-orange-600 bg-orange-50/50 hover:bg-orange-50 border border-orange-100 hover:border-orange-200",
      path: "/admin/patients?add=true",
    },
    {
      title: "Add Request",
      icon: Droplet,
      color: "text-pink-600 bg-pink-50/50 hover:bg-pink-50 border border-pink-100 hover:border-pink-200",
      path: "/admin/requests?add=true",
    },
    {
      title: "Add Bank",
      icon: Building,
      color: "text-indigo-600 bg-indigo-50/50 hover:bg-indigo-50 border border-indigo-100 hover:border-indigo-200",
      path: "/admin/bloodbanks?add=true",
    },
  ];

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 select-none">
      <h2 className="text-base font-bold mb-5 text-slate-800 tracking-tight">
        Quick Actions
      </h2>

      <div className="grid grid-cols-2 gap-4">
        {actions.map((act) => {
          const Icon = act.icon;
          return (
            <button
              key={act.title}
              onClick={() => navigate(act.path)}
              className={`flex flex-col items-center justify-center p-4 rounded-2xl transition-all duration-200 hover:-translate-y-0.5 active:scale-[0.98] text-center cursor-pointer ${act.color}`}
            >
              <Icon size={20} className="mb-2 shrink-0" />
              <span className="text-xs font-bold tracking-tight">{act.title}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

export default QuickActions;
