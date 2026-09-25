import { useState } from "react";
import { Check, Info } from "lucide-react";

function Compatibility() {
  const bloodGroups = ["O-", "O+", "B-", "B+", "A-", "A+", "AB-", "AB+"];

  const compatibilityMap = {
    "O-": {
      donate: ["O-", "O+", "B-", "B+", "A-", "A+", "AB-", "AB+"], // Universal donor
      receive: ["O-"],
    },
    "O+": {
      donate: ["O+", "B+", "A+", "AB+"],
      receive: ["O-", "O+"],
    },
    "B-": {
      donate: ["B-", "B+", "AB-", "AB+"],
      receive: ["O-", "B-"],
    },
    "B+": {
      donate: ["B+", "AB+"],
      receive: ["O-", "O+", "B-", "B+"],
    },
    "A-": {
      donate: ["A-", "A+", "AB-", "AB+"],
      receive: ["O-", "A-"],
    },
    "A+": {
      donate: ["A+", "AB+"],
      receive: ["O-", "O+", "A-", "A+"],
    },
    "AB-": {
      donate: ["AB-", "AB+"],
      receive: ["O-", "B-", "A-", "AB-"],
    },
    "AB+": {
      donate: ["AB+"], // Universal recipient
      receive: ["O-", "O+", "B-", "B+", "A-", "A+", "AB-", "AB+"],
    },
  };

  const [selectedGroup, setSelectedGroup] = useState("A+");

  return (
    <section id="compatibility" className="py-20 bg-slate-50 border-b border-slate-100 scroll-mt-16">
      <div className="max-w-7xl mx-auto px-6">
        
        {/* Title */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <h2 className="text-xs font-bold uppercase tracking-widest text-red-600">
            Medical Helper
          </h2>
          <p className="text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight">
            Blood Group Compatibility Checker
          </p>
          <div className="w-12 h-1 bg-red-600 mx-auto rounded-full" />
        </div>

        {/* Checker Widget Box */}
        <div className="max-w-4xl mx-auto bg-white rounded-3xl border border-slate-100 shadow-xl overflow-hidden grid md:grid-cols-12">
          
          {/* Left panel: Group selectors */}
          <div className="md:col-span-5 bg-slate-900 text-white p-8 flex flex-col justify-between">
            <div>
              <h3 className="text-lg font-bold mb-2">Select Blood Type</h3>
              <p className="text-xs text-slate-400 font-semibold mb-6">
                Click a blood group badge to test its compatibility rates.
              </p>

              <div className="grid grid-cols-4 gap-3">
                {bloodGroups.map((group) => (
                  <button
                    key={group}
                    onClick={() => setSelectedGroup(group)}
                    className={`h-12 rounded-xl text-sm font-bold border transition-all duration-200 cursor-pointer ${
                      selectedGroup === group
                        ? "bg-red-600 border-red-600 text-white shadow-lg shadow-red-600/20 scale-[1.05]"
                        : "bg-slate-800 border-slate-700 text-slate-300 hover:border-slate-500 hover:text-white"
                    }`}
                  >
                    {group}
                  </button>
                ))}
              </div>
            </div>

            <div className="mt-8 p-4 bg-slate-800/50 rounded-2xl border border-slate-700/30 flex gap-3 items-start">
              <Info size={16} className="text-red-500 shrink-0 mt-0.5" />
              <p className="text-[11px] text-slate-400 leading-relaxed font-semibold">
                {selectedGroup === "O-" && "O- is the universal red blood cell donor, meaning their blood can be given to patients of any blood type."}
                {selectedGroup === "AB+" && "AB+ is the universal recipient, meaning patients with this type can receive red blood cells from any blood type."}
                {selectedGroup !== "O-" && selectedGroup !== "AB+" && `Learn whom individuals with blood group ${selectedGroup} can donate to or receive from.`}
              </p>
            </div>
          </div>

          {/* Right panel: Results */}
          <div className="md:col-span-7 p-8 space-y-8 bg-white">
            
            {/* Can Donate To grid */}
            <div className="space-y-4">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Can Donate Red Blood Cells To:
              </h4>
              <div className="flex flex-wrap gap-2.5">
                {bloodGroups.map((group) => {
                  const canDonate = compatibilityMap[selectedGroup].donate.includes(group);
                  return (
                    <div
                      key={group}
                      className={`flex items-center gap-1.5 px-4 py-2.5 rounded-xl border text-sm font-bold transition-all duration-300 ${
                        canDonate
                          ? "bg-red-50 border-red-200 text-red-700 shadow-sm"
                          : "bg-slate-50 border-slate-100 text-slate-350 opacity-40"
                      }`}
                    >
                      {canDonate && <Check size={14} className="stroke-[3]" />}
                      {group}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Can Receive From grid */}
            <div className="space-y-4">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Can Receive Red Blood Cells From:
              </h4>
              <div className="flex flex-wrap gap-2.5">
                {bloodGroups.map((group) => {
                  const canReceive = compatibilityMap[selectedGroup].receive.includes(group);
                  return (
                    <div
                      key={group}
                      className={`flex items-center gap-1.5 px-4 py-2.5 rounded-xl border text-sm font-bold transition-all duration-300 ${
                        canReceive
                          ? "bg-emerald-50 border-emerald-200 text-emerald-700 shadow-sm"
                          : "bg-slate-50 border-slate-100 text-slate-350 opacity-40"
                      }`}
                    >
                      {canReceive && <Check size={14} className="stroke-[3]" />}
                      {group}
                    </div>
                  );
                })}
              </div>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
}

export default Compatibility;
