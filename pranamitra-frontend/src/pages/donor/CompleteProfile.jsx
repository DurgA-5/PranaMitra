import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { CheckCircle, ChevronLeft, ChevronRight, User, GraduationCap, MapPin, Sparkles } from "lucide-react";
import api from "../../api/axios";
import { getUserId } from "../../utils/token";
import logo from "../../assets/logos/pranamitra-logo.jpeg";
import { motion, AnimatePresence } from "framer-motion";

function CompleteProfile() {
  const navigate = useNavigate();
  const userId = getUserId();

  // Form Fields
  const [bloodGroup, setBloodGroup] = useState("");
  const [age, setAge] = useState("");
  const [gender, setGender] = useState("");
  const [weight, setWeight] = useState("");
  const [collegeName, setCollegeName] = useState("");
  const [department, setDepartment] = useState("");
  const [yearOfStudy, setYearOfStudy] = useState("");
  const [studentId, setStudentId] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [pincode, setPincode] = useState("");
  const [availableToDonate, setAvailableToDonate] = useState(true);

  // Flow State
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  // Input Field Touched/Error helpers
  const getAgeNum = () => parseInt(age, 10);
  const getWeightNum = () => parseFloat(weight);

  const isStepValid = (s) => {
    switch (s) {
      case 1:
        return (
          bloodGroup !== "" &&
          gender !== "" &&
          age !== "" &&
          !isNaN(getAgeNum()) &&
          getAgeNum() >= 18 &&
          weight !== "" &&
          !isNaN(getWeightNum()) &&
          getWeightNum() >= 45
        );
      case 2:
        return (
          collegeName.trim() !== "" &&
          department.trim() !== "" &&
          yearOfStudy !== "" &&
          studentId.trim() !== ""
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
        return true;
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

    // Direct sanity checks
    if (!isStepValid(1) || !isStepValid(2) || !isStepValid(3)) {
      toast.error("Please complete all sections with valid details.");
      return;
    }

    try {
      setLoading(true);
      await api.post(`/auth/complete-profile/donor/${userId}`, {
        bloodGroup,
        age: getAgeNum(),
        gender,
        weight: getWeightNum(),
        collegeName,
        department,
        yearOfStudy,
        studentId,
        address,
        city,
        state,
        pincode,
        availableToDonate,
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
          <img src={logo} alt="Logo" className="h-14 w-auto rounded-2xl bg-white p-0.5" />
          <div>
            <h3 className="text-xl font-bold tracking-tight text-white">PranaMitra</h3>
            <p className="text-[10px] tracking-wider text-red-100 font-bold uppercase mt-0.5">
              Digital Blood Management Platform
            </p>
          </div>
        </div>

        {/* Central Dynamic Titles */}
        <div className="space-y-4 max-w-xs z-10">
          <h2 className="text-3xl font-extrabold tracking-tight">Complete Your Donor Profile</h2>
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
              onClick={() => navigate("/donor")}
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
                <span className={step >= 2 ? "text-[#B71C1C]" : ""}>● Academic</span>
                <span className={step >= 3 ? "text-[#B71C1C]" : ""}>● Address</span>
                <span className={step >= 4 ? "text-[#B71C1C]" : ""}>● Review</span>
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
                      {/* Blood Group */}
                      <div className="space-y-1.5">
                        <label className="block text-xs font-semibold uppercase tracking-wider text-[#6B7280]">Blood Group</label>
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
                      <div className="space-y-1.5">
                        <label className="block text-xs font-semibold uppercase tracking-wider text-[#6B7280]">Age (Years)</label>
                        <input
                          type="number"
                          value={age}
                          onChange={(e) => setAge(e.target.value)}
                          placeholder="Min 18 years"
                          required
                          min="18"
                          className="w-full border border-slate-200 rounded-xl px-4 py-2.5 outline-none focus:border-[#B71C1C] focus:ring-1 focus:ring-[#B71C1C]/25 transition text-sm text-[#212121] bg-[#F8F9FA] h-11"
                        />
                        {age !== "" && getAgeNum() < 18 && (
                          <p className="text-[10px] font-bold text-[#B71C1C]">Must be at least 18 years old</p>
                        )}
                      </div>

                      {/* Weight */}
                      <div className="space-y-1.5">
                        <label className="block text-xs font-semibold uppercase tracking-wider text-[#6B7280]">Weight (kg)</label>
                        <input
                          type="number"
                          value={weight}
                          onChange={(e) => setWeight(e.target.value)}
                          placeholder="Min 45 kg"
                          required
                          min="45"
                          step="0.1"
                          className="w-full border border-slate-200 rounded-xl px-4 py-2.5 outline-none focus:border-[#B71C1C] focus:ring-1 focus:ring-[#B71C1C]/25 transition text-sm text-[#212121] bg-[#F8F9FA] h-11"
                        />
                        {weight !== "" && getWeightNum() < 45 && (
                          <p className="text-[10px] font-bold text-[#B71C1C]">Must be at least 45 kg</p>
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
                      <GraduationCap size={18} className="text-[#B71C1C]" />
                      <h3 className="text-sm font-bold uppercase tracking-wider text-[#212121]">Academic Information</h3>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {/* College Name */}
                      <div className="sm:col-span-2 space-y-1.5">
                        <label className="block text-xs font-semibold uppercase tracking-wider text-[#6B7280]">College Name</label>
                        <input
                          type="text"
                          value={collegeName}
                          onChange={(e) => setCollegeName(e.target.value)}
                          placeholder="College/University Name"
                          required
                          className="w-full border border-slate-200 rounded-xl px-4 py-2.5 outline-none focus:border-[#B71C1C] focus:ring-1 focus:ring-[#B71C1C]/25 transition text-sm text-[#212121] bg-[#F8F9FA] h-11"
                        />
                      </div>

                      {/* Department */}
                      <div className="space-y-1.5">
                        <label className="block text-xs font-semibold uppercase tracking-wider text-[#6B7280]">Department</label>
                        <input
                          type="text"
                          value={department}
                          onChange={(e) => setDepartment(e.target.value)}
                          placeholder="CS, ECE, Mechanical, etc."
                          required
                          className="w-full border border-slate-200 rounded-xl px-4 py-2.5 outline-none focus:border-[#B71C1C] focus:ring-1 focus:ring-[#B71C1C]/25 transition text-sm text-[#212121] bg-[#F8F9FA] h-11"
                        />
                      </div>

                      {/* Year of Study */}
                      <div className="space-y-1.5">
                        <label className="block text-xs font-semibold uppercase tracking-wider text-[#6B7280]">Year of Study</label>
                        <select
                          value={yearOfStudy}
                          onChange={(e) => setYearOfStudy(e.target.value)}
                          required
                          className="w-full border border-slate-200 rounded-xl px-4 py-2.5 outline-none focus:border-[#B71C1C] focus:ring-1 focus:ring-[#B71C1C]/25 transition text-sm text-[#212121] bg-[#F8F9FA] h-11"
                        >
                          <option value="">Select Year</option>
                          <option value="1st Year">1st Year</option>
                          <option value="2nd Year">2nd Year</option>
                          <option value="3rd Year">3rd Year</option>
                          <option value="4th Year">4th Year</option>
                          <option value="Postgraduate">Postgraduate</option>
                        </select>
                      </div>

                      {/* Student ID */}
                      <div className="sm:col-span-2 space-y-1.5">
                        <label className="block text-xs font-semibold uppercase tracking-wider text-[#6B7280]">Student ID Roll Number</label>
                        <input
                          type="text"
                          value={studentId}
                          onChange={(e) => setStudentId(e.target.value)}
                          placeholder="Enter your student ID Card number"
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
                        <label className="block text-xs font-semibold uppercase tracking-wider text-[#6B7280]">Residential Address</label>
                        <input
                          type="text"
                          value={address}
                          onChange={(e) => setAddress(e.target.value)}
                          placeholder="Hostel, Street name, House number"
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
                          placeholder="City name"
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
                      <h3 className="text-sm font-bold uppercase tracking-wider text-[#212121]">Donation & Review</h3>
                    </div>

                    {/* Available checkbox */}
                    <div className="flex items-center gap-3 p-4 bg-slate-50 border border-slate-100 rounded-2xl mb-4 select-none">
                      <input
                        type="checkbox"
                        id="available"
                        checked={availableToDonate}
                        onChange={(e) => setAvailableToDonate(e.target.checked)}
                        className="h-5 w-5 rounded border-slate-300 text-[#B71C1C] focus:ring-[#B71C1C]/20 cursor-pointer"
                      />
                      <label htmlFor="available" className="text-xs font-bold uppercase tracking-wider text-[#6B7280] cursor-pointer">
                        Available to Donate Immediately
                      </label>
                    </div>

                    {/* Summary Review Listing */}
                    <div className="border border-slate-100 rounded-2xl p-5 space-y-4 bg-slate-50/50">
                      <h4 className="text-xs font-bold text-[#6B7280] uppercase tracking-widest border-b border-slate-100 pb-1.5">Review Credentials</h4>
                      
                      <div className="grid grid-cols-2 gap-4 text-xs font-semibold">
                        <div>
                          <p className="text-[10px] text-slate-400 uppercase">Blood Group</p>
                          <p className="text-[#212121] mt-0.5">{bloodGroup.replace("_POSITIVE", "+").replace("_NEGATIVE", "-")}</p>
                        </div>
                        <div>
                          <p className="text-[10px] text-slate-400 uppercase">Gender / Age</p>
                          <p className="text-[#212121] mt-0.5">{gender} / {age} Yrs</p>
                        </div>
                        <div>
                          <p className="text-[10px] text-slate-400 uppercase">Weight</p>
                          <p className="text-[#212121] mt-0.5">{weight} kg</p>
                        </div>
                        <div>
                          <p className="text-[10px] text-slate-400 uppercase">College / Department</p>
                          <p className="text-[#212121] mt-0.5 truncate">{collegeName} ({department})</p>
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
                    disabled={loading || !isStepValid(1) || !isStepValid(2) || !isStepValid(3)}
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
