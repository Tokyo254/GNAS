import React, { useState, useEffect } from "react";
import Header from "../../components/header";
import { Link, useNavigate } from "react-router-dom";
import SignUp from "../../assets/SignUp.mp4";
import { useToast } from "../../context/ToastContext";
import { motion, AnimatePresence, easeIn, easeOut } from "framer-motion";

const industries = [
  "Technology", "Healthcare", "Finance", "Geopolitics", "Environment", "Arts & Culture",
  "Sports", "Education", "Automotive", "Retail", "Biotechnology", "Real Estate",
  "Defense", "Energy", "Food & Beverage"
];

const SignUpWizard: React.FC = () => {
  const [step, setStep] = useState(1);
  const [method, setMethod] = useState<"email" | "endorsement" | "invite">("email");
  const navigate = useNavigate();
  const { addToast } = useToast();

  // Form State
  const [firstName, setFirstName] = useState("");
  const [surname, setSurname] = useState("");
  const [lastName, setLastName] = useState("");
  const [orgEmail, setOrgEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [endorserEmail, setEndorserEmail] = useState("");
  const [inviteCode, setInviteCode] = useState("");
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [orgName, setOrgName] = useState("");
  const [position, setPosition] = useState("");
  const [bio, setBio] = useState("");
  const [interests, setInterests] = useState<string[]>([]);
  const [country, setCountry] = useState(""); // NEW: Country field
  const [phoneNumber, setPhoneNumber] = useState(""); // NEW: Phone number field
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const validateStep1 = () => {
    if (method === "email") {
      if (!firstName || !surname || !lastName || !orgEmail || !password || !confirmPassword || !country) {
        setError("All required fields must be filled.");
        return false;
      }
      if (password !== confirmPassword) {
        setError("Passwords do not match.");
        return false;
      }
      if (password.length < 6) {
        setError("Password must be at least 6 characters.");
        return false;
      }
      if (!agreeTerms) {
        setError("You must agree to the terms and conditions.");
        return false;
      }
    } else if (method === "endorsement" && !endorserEmail) {
      setError("Endorser email is required.");
      return false;
    } else if (method === "invite" && !inviteCode) {
      setError("Invite code is required.");
      return false;
    }
    setError("");
    return true;
  };

  const validateStep2 = () => {
    if (!orgName || !position || !bio) {
      setError("All profile fields are required.");
      return false;
    }
    setError("");
    return true;
  };

  const validateStep3 = () => {
    if (interests.length === 0) {
      setError("Please select at least one industry of interest.");
      return false;
    }
    setError("");
    return true;
  };

  const nextStep = () => { 
    if (step === 1 && !validateStep1()) return; 
    if (step === 2 && !validateStep2()) return;
    setStep(prev => prev + 1); 
  };

  const prevStep = () => setStep(prev => prev - 1);

  const handleInterestClick = (interest: string) => {
    setInterests(prev =>
      prev.includes(interest)
        ? prev.filter(i => i !== interest)
        : [...prev, interest]
    );
  };

 const handleSubmit = async () => {
  if (!validateStep3()) return;
  setIsLoading(true);
  setError("");
  
  try {
    const response = await fetch('http://localhost:5000/api/auth/register/comms', {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        firstName,
        surname, 
        lastName,
        orgEmail,
        password,
        confirmPassword,
        orgName,
        position,
        bio,
        interests: interests, 
        country,
        phoneNumber
      }),
    });

    const data = await response.json();

    if (data.success) {
      addToast("Registration successful! Please check your email for verification.", "success");
      navigate("/login");
    } else {
      setError(data.message || "Registration failed. Please try again.");
      addToast(data.message || "Registration failed.", "error");
    }
  } catch (error) {
    console.error('Registration error:', error);
    setError("Network error. Please check your connection.");
    addToast("Network error. Please try again.", "error");
  } finally {
    setIsLoading(false);
  }
};

  const inputStyle = "w-full border border-gray-600 bg-gray-800/50 rounded-md p-2.5 text-sm text-gray-200 placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-500";
  const stepVariants = {
    hidden: { opacity: 0, x: 20 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.4, ease: easeOut }},
    exit: { opacity: 0, x: -20, transition: { duration: 0.2, ease: easeIn }},
  };

  return (
    <div className="relative min-h-screen w-full overflow-hidden">
      <video
        autoPlay muted loop
        className="fixed top-0 left-0 min-w-full min-h-full w-auto h-auto object-cover z-0 brightness-50"
        style={{ transform: `translateY(${scrollY * 0.3}px)` }}
        src={SignUp}
      />
      <div className="relative z-10 flex flex-col min-h-screen">
        <Header />
        <main className="flex-grow flex items-center justify-center px-4 py-10">
          <div className="w-full max-w-2xl bg-gray-900/80 backdrop-blur-md rounded-2xl shadow-xl p-6 md:p-10 mt-6 ring-1 ring-white/10">
            <h1 className="text-2xl font-bold text-center text-white mb-10">
              Join a Trusted Network of Communicators
            </h1>

            {/* Stepper */}
            <div className="mb-12">
              <div className="relative flex justify-between items-center">
                <div className="absolute left-0 right-0 top-1/2 -translate-y-1/2 h-1 bg-gray-700 z-0 rounded-full">
                  <div
                    className="h-1 bg-cyan-500 rounded-full transition-all duration-500 ease-in-out"
                    style={{ width: `${((step - 1) / 2) * 100}%` }}
                  />
                </div>
                {["Sign Up", "Profile", "Interests"].map((_, index) => {
                  const circleStep = index + 1;
                  return (
                    <div key={circleStep}
                      className={`w-10 h-10 flex items-center justify-center rounded-full font-bold text-sm shadow-md transition-all duration-300 relative z-10 
                        ${step >= circleStep ? "bg-cyan-500 text-white ring-4 ring-gray-900" : "bg-gray-600 text-gray-300"}`
                      }
                    >
                      {circleStep}
                    </div>
                  );
                })}
              </div>
              <div className="flex justify-between mt-2">
                {["Sign Up", "Profile", "Interests"].map((label, index) => (
                  <span key={index} className={`text-xs font-medium w-10 text-center ${step > index ? "text-cyan-400" : "text-gray-500"}`}>{label}</span>
                ))}
              </div>
            </div>

            {error && <p className="text-red-400 text-sm mb-4 text-center bg-red-900/50 p-2 rounded-md ring-1 ring-red-500/50">{error}</p>}

            <AnimatePresence mode="wait">
              {step === 1 && (
                <motion.div key={1} variants={stepVariants} initial="hidden" animate="visible" exit="exit" className="space-y-4">
                  {/* Method Selection */}
                  <div className="flex space-x-2 mb-4">
                    {[
                      { key: "email", label: "Email" },
                      { key: "endorsement", label: "Endorsement" },
                      { key: "invite", label: "Invite Code" }
                    ].map(({ key, label }) => (
                      <button
                        key={key}
                        type="button"
                        onClick={() => setMethod(key as any)}
                        className={`flex-1 py-2 px-3 text-sm font-medium rounded-md transition-colors ${
                          method === key
                            ? "bg-cyan-500 text-white"
                            : "bg-gray-700 text-gray-300 hover:bg-gray-600"
                        }`}
                      >
                        {label}
                      </button>
                    ))}
                  </div>

                  {method === "email" && (
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                        <input type="text" placeholder="First Name *" value={firstName} onChange={e => setFirstName(e.target.value)} className={inputStyle} />
                        <input type="text" placeholder="Surname *" value={surname} onChange={e => setSurname(e.target.value)} className={inputStyle} />
                        <input type="text" placeholder="Last Name *" value={lastName} onChange={e => setLastName(e.target.value)} className={inputStyle} />
                      </div>
                      <input type="email" placeholder="Organization Email *" value={orgEmail} onChange={e => setOrgEmail(e.target.value)} className={inputStyle} />
                      
                      {/* NEW: Country and Phone Number */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <input 
                          type="text" 
                          placeholder="Country *" 
                          value={country} 
                          onChange={e => setCountry(e.target.value)} 
                          className={inputStyle} 
                        />
                        <input 
                          type="text" 
                          placeholder="Optional Phone Number" 
                          value={phoneNumber} 
                          onChange={e => setPhoneNumber(e.target.value)} 
                          className={inputStyle} 
                        />
                      </div>
                      
                      <input type="password" placeholder="Password (min. 6 characters) *" value={password} onChange={e => setPassword(e.target.value)} className={inputStyle} />
                      <input type="password" placeholder="Confirm Password *" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} className={inputStyle} />
                      <label className="flex items-center space-x-3 text-sm text-gray-300">
                        <input type="checkbox" checked={agreeTerms} onChange={e => setAgreeTerms(e.target.checked)} className="h-4 w-4 rounded bg-gray-700 border-gray-600 text-cyan-500 focus:ring-cyan-600"/>
                        <span>I agree to the <a href="/terms" className="text-cyan-400 hover:underline">Terms and Conditions</a></span>
                      </label>
                    </div>
                  )}

                  {method === "endorsement" && (
                    <div className="space-y-4">
                      <input type="email" placeholder="Endorser's Email *" value={endorserEmail} onChange={e => setEndorserEmail(e.target.value)} className={inputStyle} />
                      <p className="text-sm text-gray-400">You will receive an email with further instructions after your endorsement is verified.</p>
                    </div>
                  )}

                  {method === "invite" && (
                    <div className="space-y-4">
                      <input type="text" placeholder="Invite Code *" value={inviteCode} onChange={e => setInviteCode(e.target.value)} className={inputStyle} />
                      <p className="text-sm text-gray-400">Enter the invite code provided by your organization.</p>
                    </div>
                  )}
                </motion.div>
              )}

              {step === 2 && (
                <motion.div key={2} variants={stepVariants} initial="hidden" animate="visible" exit="exit" className="space-y-4">
                  <input type="text" placeholder="Organization Name *" value={orgName} onChange={e => setOrgName(e.target.value)} className={inputStyle} />
                  <input type="text" placeholder="Position *" value={position} onChange={e => setPosition(e.target.value)} className={inputStyle} />
                  <textarea placeholder="Brief Bio *" value={bio} onChange={e => setBio(e.target.value)} rows={3} className={inputStyle} />
                </motion.div>
              )}

              {step === 3 && (
                <motion.div key={3} variants={stepVariants} initial="hidden" animate="visible" exit="exit" className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-3">Industries of Interest (Select all that apply) *</label>
                    <div className="flex flex-wrap gap-2">
                      {industries.map(interest => (
                        <button
                          type="button"
                          key={interest}
                          onClick={() => handleInterestClick(interest)}
                          className={`px-3 py-1.5 text-xs font-medium border rounded-full transition-colors ${
                            interests.includes(interest) 
                            ? 'bg-cyan-500 border-cyan-500 text-white' 
                            : 'bg-gray-800/50 border-gray-700 text-gray-300 hover:border-cyan-500'
                          }`}
                        >
                          {interest}
                        </button>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="mt-8 flex justify-between items-center">
              <button onClick={prevStep} disabled={step === 1} className="px-4 py-2 bg-gray-700 text-white rounded-md text-sm font-medium hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed">Back</button>
              {step < 3 ? (
                <button onClick={nextStep} className="px-4 py-2 bg-cyan-500 text-white rounded-md text-sm font-medium hover:bg-cyan-600">Next</button>
              ) : (
                <button onClick={handleSubmit} disabled={isLoading} className="px-4 py-2 bg-green-600 text-white rounded-md text-sm font-medium hover:bg-green-700 disabled:opacity-70">
                  {isLoading ? "Processing..." : "Finish"}
                </button>
              )}
            </div>

            <div className="mt-8 border-t border-gray-700 pt-4 text-center">
              <p className="text-sm text-gray-400">Already have an account?{" "}
                <Link to="/login" className="text-cyan-400 font-medium hover:underline">Log in</Link>
              </p>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default SignUpWizard;