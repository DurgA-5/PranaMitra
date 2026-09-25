import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { CheckCircle, ChevronLeft, ChevronRight, User, ShieldAlert, MapPin, Sparkles } from "lucide-react";
import api from "../../api/axios";
import { getUserId } from "../../utils/token";
import PranaMitraBrand from "../../components/common/PranaMitraBrand";
import { motion, AnimatePresence } from "framer-motion";


function CompleteProfile() {
  const navigate = useNavigate();
  const userId = getUserId();

  // Form Fields
  const [bloodGroup, setBloodGroup] = useState("");
  const [age, setAge] = useState("");
  const [gender, setGender] = useState("");
  const [hospitalName, setHospitalName] = useState("");
  const [doctorName, setDoctorName] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [pincode, setPincode] = useState("");
  const [attenderName, setAttenderName] = useState("");
  const [attenderMobile, setAttenderMobile] = useState("");

  // Flow State
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  // Input Field helpers
  const getAgeNum = () => parseInt(age, 10);

  const isStepValid = (s) => {
    switch (s) {
      case 1:
        return (
          bloodGroup !== "" &&
          gender !== "" &&
          age !== "" &&
          !isNaN(getAgeNum()) &&
          getAgeNum() >= 0
        );
      case 2:
        return (
          hospitalName.trim() !== "" &&
          doctorName.trim() !== ""
        );
      case 3:
        return (
          address.trim() !== "" &&
          city.trim() !== "" &&
          state.trim() !== "" &&
          pincode.trim() !== "" &&
          /^[0-9]{6}$/.test(pincode)
        );
      case 4:
        return (
          attenderName.trim() !== "" &&
          attenderMobile.trim() !== "" &&
          /^[6-9][0-9]{9}$/.test(attenderMobile)
        );
      default:
        return false;
    }
  };

  const handleNext = () => {
    if (isStepValid(step) && step < 4) {
      setStep(step + 1);
    }
  };

  const handlePrev = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (loading) return;

    // Direct validations sanity checks
    if (!isStepValid(1) || !isStepValid(2) || !isStepValid(3) || !isStepValid(4)) {
      toast.error("Please complete all sections with valid details.");
      return;
    }

    try {
      setLoading(true);
      await api.post(`/auth/complete-profile/patient/${userId}`, {
        bloodGroup,
        age: getAgeNum(),
        gender,
        hospitalName,
        doctorName,
        address,
        city,
        state,
        pincode,
        attenderName,
        attenderMobile,
      });

      setSuccess(true);
      toast.success("Profile completed successfully!");
    } catch (error) {
      console.error("Failed to complete profile", error);
      const errMsg = error.response?.data?.message || "Failed to complete profile. Please verify all details.";
      toast.error(errMsg);
    } finally {
      setLoading(false);
    }
  };

  const progressPercentage = step * 25;

  return (
    <div className="h-screen w-screen bg-[#F8F9FA] flex overflow-hidden font-sans">
      {/* Left Branding Panel (35%) */}
      <div className="hidden md:flex w-[35%] bg-gradient-to-b from-[#B71C1C] to-[#E53935] text-white p-12 flex-col justify-between items-center h-full select-none shadow-2xl relative overflow-hidden text-center">
        {/* Subtle background texture overlay */}
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:16px_16px]" />

        {/* Top Header Logo */}
        <div className="flex flex-col items-center gap-3">
          <PranaMitraBrand size="md" showSubtitle={true} subtitleText="Blood Management System" darkBg={true} />
        </div>


        {/* Central Dynamic Titles */}
        <div className="space-y-4 max-w-xs z-10">
          <h2 className="text-3xl font-extrabold tracking-tight">Complete Your Patient Profile</h2>
          <p className="text-red-100 text-xs leading-relaxed font-semibold">
            Complete your profile to access all features and help us provide faster emergency blood support.
          </p>
        </div>

        {/* Bottom Slogan */}
        <div className="space-y-1 select-none">
          <p className="text-sm font-bold tracking-wide">Every Drop Counts.</p>
          <p className="text-[10px] text-red-100 font-semibold uppercase tracking-wider">Every Donation Saves a Life.</p>
        </div>
      </div>

      {/* Right Form Panel (65%) */}
      <div className="flex-1 w-full md:w-[65%] flex flex-col justify-center items-center p-6 h-full overflow-y-auto bg-[#F8F9FA]">
        
        {success ? (
          /* Success Screen Card */
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full max-w-[550px] bg-white rounded-3xl shadow-xl border border-slate-100 p-10 text-center space-y-6"
          >
            <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle size={44} className="text-green-600" />
            </div>
            <div className="space-y-2">
              <h2 className="text-2xl font-bold text-[#212121]">Profile Completed Successfully</h2>
              <p className="text-[#6B7280] text-sm">
                Thank you for completing your profile. Your account is now ready to use.
              </p>
            </div>
            <button
              onClick={() => navigate("/patient")}
              className="w-full bg-[#B71C1C] hover:bg-[#E53935] text-white rounded-xl py-3.5 font-bold text-sm tracking-wider uppercase transition shadow-sm hover:shadow-md active:scale-[0.98] cursor-pointer h-12"
            >
              Continue to Dashboard
            </button>
          </motion.div>
        ) : (
          /* Onboarding Form Wizard Card */
          <div className="w-full max-w-[650px] bg-white rounded-3xl shadow-xl border border-slate-100 p-8 md:p-10 flex flex-col relative">
            {/* Step Indicator Header */}
            <div className="mb-6 space-y-3">
              <div className="flex justify-between items-center text-xs font-bold text-[#6B7280] uppercase tracking-wider">
                <span>Step {step} of 4</span>
                <span className="text-[#B71C1C]">{progressPercentage}%</span>
              </div>
              
              {/* Progress Bar Container */}
              <div className="relative w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: "25%" }}
                  animate={{ width: `${progressPercentage}%` }}
                  transition={{ duration: 0.3, ease: "easeInOut" }}
                  className="absolute top-0 left-0 h-full bg-[#B71C1C] rounded-full"
                />
              </div>

              {/* Steps Dots visualization */}
              <div className="flex justify-between items-center text-[10px] font-bold text-[#6B7280] pt-1">
                <span className={step >= 1 ? "text-[#B71C1C]" : ""}>● Personal</span>
                <span className={step >= 2 ? "text-[#B71C1C]" : ""}>● Clinical</span>
                <span className={step >= 3 ? "text-[#B71C1C]" : ""}>● Address</span>
                <span className={step >= 4 ? "text-[#B71C1C]" : ""}>● Contact</span>
              </div>
            </div>

            {/* Steps Container */}
            <form onSubmit={handleSubmit} className="space-y-6">
              <AnimatePresence mode="wait">
                {step === 1 && (
                  <motion.div
                    key="step1"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.2 }}
                    className="space-y-4"
                  >
                    <div className="flex items-center gap-2 border-b border-slate-100 pb-2 mb-4">
                      <User size={18} className="text-[#B71C1C]" />
                      <h3 className="text-sm font-bold uppercase tracking-wider text-[#212121]">Personal Information</h3>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {/* Blood Group Required */}
                      <div className="space-y-1.5">
                        <label className="block text-xs font-semibold uppercase tracking-wider text-[#6B7280]">Blood Group Required</label>
                        <select
                          value={bloodGroup}
                          onChange={(e) => setBloodGroup(e.target.value)}
                          required
                          className="w-full border border-slate-200 rounded-xl px-4 py-2.5 outline-none focus:border-[#B71C1C] focus:ring-1 focus:ring-[#B71C1C]/25 transition text-sm text-[#212121] bg-[#F8F9FA] h-11"
                        >
                          <option value="">Select Blood Group</option>
                          <option value="A_POSITIVE">A+</option>
                          <option value="A_NEGATIVE">A-</option>
                          <option value="B_POSITIVE">B+</option>
                          <option value="B_NEGATIVE">B-</option>
                          <option value="AB_POSITIVE">AB+</option>
                          <option value="AB_NEGATIVE">AB-</option>
                          <option value="O_POSITIVE">O+</option>
                          <option value="O_NEGATIVE">O-</option>
                        </select>
                      </div>

                      {/* Gender */}
                      <div className="space-y-1.5">
                        <label className="block text-xs font-semibold uppercase tracking-wider text-[#6B7280]">Gender</label>
                        <select
                          value={gender}
                          onChange={(e) => setGender(e.target.value)}
                          required
                          className="w-full border border-slate-200 rounded-xl px-4 py-2.5 outline-none focus:border-[#B71C1C] focus:ring-1 focus:ring-[#B71C1C]/25 transition text-sm text-[#212121] bg-[#F8F9FA] h-11"
                        >
                          <option value="">Select Gender</option>
                          <option value="MALE">Male</option>
                          <option value="FEMALE">Female</option>
                          <option value="OTHER">Other</option>
                        </select>
                      </div>

                      {/* Age */}
                      <div className="sm:col-span-2 space-y-1.5">
                        <label className="block text-xs font-semibold uppercase tracking-wider text-[#6B7280]">Patient Age</label>
                        <input
                          type="number"
                          value={age}
                          onChange={(e) => setAge(e.target.value)}
                          placeholder="Enter patient age"
                          required
                          min="0"
                          className="w-full border border-slate-200 rounded-xl px-4 py-2.5 outline-none focus:border-[#B71C1C] focus:ring-1 focus:ring-[#B71C1C]/25 transition text-sm text-[#212121] bg-[#F8F9FA] h-11"
                        />
                        {age !== "" && getAgeNum() < 0 && (
                          <p className="text-[10px] font-bold text-[#B71C1C]">Please enter a valid age</p>
                        )}
                      </div>
                    </div>
                  </motion.div>
                )}

                {step === 2 && (
                  <motion.div
                    key="step2"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.2 }}
                    className="space-y-4"
                  >
                    <div className="flex items-center gap-2 border-b border-slate-100 pb-2 mb-4">
                      <ShieldAlert size={18} className="text-[#B71C1C]" />
                      <h3 className="text-sm font-bold uppercase tracking-wider text-[#212121]">Clinical Information</h3>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {/* Hospital Name */}
                      <div className="sm:col-span-2 space-y-1.5">
                        <label className="block text-xs font-semibold uppercase tracking-wider text-[#6B7280]">Hospital Name</label>
                        <input
                          type="text"
                          value={hospitalName}
                          onChange={(e) => setHospitalName(e.target.value)}
                          placeholder="Hospital/Clinic name where admitted"
                          required
                          className="w-full border border-slate-200 rounded-xl px-4 py-2.5 outline-none focus:border-[#B71C1C] focus:ring-1 focus:ring-[#B71C1C]/25 transition text-sm text-[#212121] bg-[#F8F9FA] h-11"
                        />
                      </div>

                      {/* Doctor Name */}
                      <div className="sm:col-span-2 space-y-1.5">
                        <label className="block text-xs font-semibold uppercase tracking-wider text-[#6B7280]">Treating Doctor Name</label>
                        <input
                          type="text"
                          value={doctorName}
                          onChange={(e) => setDoctorName(e.target.value)}
                          placeholder="Dr. Name"
                          required
                          className="w-full border border-slate-200 rounded-xl px-4 py-2.5 outline-none focus:border-[#B71C1C] focus:ring-1 focus:ring-[#B71C1C]/25 transition text-sm text-[#212121] bg-[#F8F9FA] h-11"
                        />
                      </div>
                    </div>
                  </motion.div>
                )}

                {step === 3 && (
                  <motion.div
                    key="step3"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.2 }}
                    className="space-y-4"
                  >
                    <div className="flex items-center gap-2 border-b border-slate-100 pb-2 mb-4">
                      <MapPin size={18} className="text-[#B71C1C]" />
                      <h3 className="text-sm font-bold uppercase tracking-wider text-[#212121]">Address Details</h3>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {/* Address */}
                      <div className="sm:col-span-2 space-y-1.5">
                        <label className="block text-xs font-semibold uppercase tracking-wider text-[#6B7280]">Full Address</label>
                        <input
                          type="text"
                          value={address}
                          onChange={(e) => setAddress(e.target.value)}
                          placeholder="Residential address details"
                          required
                          className="w-full border border-slate-200 rounded-xl px-4 py-2.5 outline-none focus:border-[#B71C1C] focus:ring-1 focus:ring-[#B71C1C]/25 transition text-sm text-[#212121] bg-[#F8F9FA] h-11"
                        />
                      </div>

                      {/* City */}
                      <div className="space-y-1.5">
                        <label className="block text-xs font-semibold uppercase tracking-wider text-[#6B7280]">City</label>
                        <input
                          type="text"
                          value={city}
                          onChange={(e) => setCity(e.target.value)}
                          placeholder="City"
                          required
                          className="w-full border border-slate-200 rounded-xl px-4 py-2.5 outline-none focus:border-[#B71C1C] focus:ring-1 focus:ring-[#B71C1C]/25 transition text-sm text-[#212121] bg-[#F8F9FA] h-11"
                        />
                      </div>

                      {/* State */}
                      <div className="space-y-1.5">
                        <label className="block text-xs font-semibold uppercase tracking-wider text-[#6B7280]">State</label>
                        <input
                          type="text"
                          value={state}
                          onChange={(e) => setState(e.target.value)}
                          placeholder="State"
                          required
                          className="w-full border border-slate-200 rounded-xl px-4 py-2.5 outline-none focus:border-[#B71C1C] focus:ring-1 focus:ring-[#B71C1C]/25 transition text-sm text-[#212121] bg-[#F8F9FA] h-11"
                        />
                      </div>

                      {/* Pincode */}
                      <div className="sm:col-span-2 space-y-1.5">
                        <label className="block text-xs font-semibold uppercase tracking-wider text-[#6B7280]">Pincode</label>
                        <input
                          type="text"
                          value={pincode}
                          onChange={(e) => setPincode(e.target.value)}
                          placeholder="6-digit postal code"
                          required
                          className="w-full border border-slate-200 rounded-xl px-4 py-2.5 outline-none focus:border-[#B71C1C] focus:ring-1 focus:ring-[#B71C1C]/25 transition text-sm text-[#212121] bg-[#F8F9FA] h-11"
                        />
                        {pincode !== "" && !/^[0-9]{6}$/.test(pincode) && (
                          <p className="text-[10px] font-bold text-[#B71C1C]">Must be exactly 6 digits</p>
                        )}
                      </div>
                    </div>
                  </motion.div>
                )}

                {step === 4 && (
                  <motion.div
                    key="step4"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.2 }}
                    className="space-y-4"
                  >
                    <div className="flex items-center gap-2 border-b border-slate-100 pb-2 mb-4">
                      <Sparkles size={18} className="text-[#B71C1C]" />
                      <h3 className="text-sm font-bold uppercase tracking-wider text-[#212121]">Emergency Contact & Review</h3>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {/* Emergency Contact Name */}
                      <div className="space-y-1.5">
                        <label className="block text-xs font-semibold uppercase tracking-wider text-[#6B7280]">Emergency Contact Name</label>
                        <input
                          type="text"
                          value={attenderName}
                          onChange={(e) => setAttenderName(e.target.value)}
                          placeholder="Relative or Attender Name"
                          required
                          className="w-full border border-slate-200 rounded-xl px-4 py-2.5 outline-none focus:border-[#B71C1C] focus:ring-1 focus:ring-[#B71C1C]/25 transition text-sm text-[#212121] bg-[#F8F9FA] h-11"
                        />
                      </div>

                      {/* Emergency Contact Phone */}
                      <div className="space-y-1.5">
                        <label className="block text-xs font-semibold uppercase tracking-wider text-[#6B7280]">Emergency Contact Number</label>
                        <input
                          type="tel"
                          value={attenderMobile}
                          onChange={(e) => setAttenderMobile(e.target.value)}
                          placeholder="10-digit mobile number"
                          required
                          className="w-full border border-slate-200 rounded-xl px-4 py-2.5 outline-none focus:border-[#B71C1C] focus:ring-1 focus:ring-[#B71C1C]/25 transition text-sm text-[#212121] bg-[#F8F9FA] h-11"
                        />
                        {attenderMobile !== "" && !/^[6-9][0-9]{9}$/.test(attenderMobile) && (
                          <p className="text-[10px] font-bold text-[#B71C1C]">Must start with 6-9 and be 10 digits</p>
                        )}
                      </div>
                    </div>

                    {/* Summary Review Listing */}
                    <div className="border border-slate-100 rounded-2xl p-5 space-y-4 bg-slate-50/50 mt-4">
                      <h4 className="text-xs font-bold text-[#6B7280] uppercase tracking-widest border-b border-slate-100 pb-1.5">Review Credentials</h4>
                      
                      <div className="grid grid-cols-2 gap-4 text-xs font-semibold">
                        <div>
                          <p className="text-[10px] text-slate-400 uppercase">Blood Group Required</p>
                          <p className="text-[#212121] mt-0.5">{bloodGroup.replace("_POSITIVE", "+").replace("_NEGATIVE", "-")}</p>
                        </div>
                        <div>
                          <p className="text-[10px] text-slate-400 uppercase">Gender / Age</p>
                          <p className="text-[#212121] mt-0.5">{gender} / {age} Yrs</p>
                        </div>
                        <div>
                          <p className="text-[10px] text-slate-400 uppercase">Hospital / Doctor</p>
                          <p className="text-[#212121] mt-0.5 truncate">{hospitalName} ({doctorName})</p>
                        </div>
                        <div>
                          <p className="text-[10px] text-slate-400 uppercase">Attender Info</p>
                          <p className="text-[#212121] mt-0.5 truncate">{attenderName} ({attenderMobile})</p>
                        </div>
                        <div className="col-span-2">
                          <p className="text-[10px] text-slate-400 uppercase">Residential Address</p>
                          <p className="text-[#212121] mt-0.5">{address}, {city}, {state} - {pincode}</p>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Wizard Navigation Buttons */}
              <div className="flex justify-between items-center gap-4 pt-6 border-t border-slate-100 mt-8 shrink-0">
                <button
                  type="button"
                  onClick={handlePrev}
                  disabled={step === 1 || loading}
                  className="flex items-center gap-1.5 text-xs font-bold text-[#6B7280] hover:text-[#B71C1C] disabled:text-slate-300 disabled:cursor-not-allowed transition duration-200 cursor-pointer h-10 select-none"
                >
                  <ChevronLeft size={16} />
                  <span>Previous</span>
                </button>

                {step < 4 ? (
                  <button
                    type="button"
                    onClick={handleNext}
                    disabled={!isStepValid(step)}
                    className="flex items-center gap-1.5 bg-[#B71C1C] hover:bg-[#E53935] disabled:bg-slate-200 text-white disabled:text-slate-400 px-5 py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider transition shadow-sm hover:shadow-md disabled:shadow-none active:scale-[0.98] disabled:active:scale-100 cursor-pointer disabled:cursor-not-allowed h-10 select-none"
                  >
                    <span>Next</span>
                    <ChevronRight size={16} />
                  </button>
                ) : (
                  <button
                    type="submit"
                    disabled={loading || !isStepValid(1) || !isStepValid(2) || !isStepValid(3) || !isStepValid(4)}
                    className="flex items-center gap-2 bg-[#B71C1C] hover:bg-[#E53935] disabled:bg-slate-300 text-white px-6 py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider transition shadow-sm hover:shadow-md active:scale-[0.98] disabled:active:scale-100 cursor-pointer disabled:cursor-not-allowed h-10 select-none"
                  >
                    <CheckCircle size={16} />
                    <span>{loading ? "Saving..." : "Complete Profile"}</span>
                  </button>
                )}
              </div>
            </form>
          </div>
        )}

      </div>
    </div>
  );
}

export default CompleteProfile;
