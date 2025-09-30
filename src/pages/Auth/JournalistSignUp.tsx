import React, { useState, useEffect } from "react";
import Header from "../../components/header";
import { useNavigate } from "react-router-dom";
import SignUp from "../../assets/SignUp.mp4";
import { useToast } from "../../context/ToastContext";
import { motion } from "framer-motion";

const industries = [
  "Technology", "Healthcare", "Finance", "Geopolitics", "Environment", "Arts & Culture",
  "Sports", "Education", "Automotive", "Retail", "Biotechnology", "Real Estate",
  "Defense", "Energy", "Food & Beverage"
];

const JournalistSignUp: React.FC = () => {
  const navigate = useNavigate();
  const { addToast } = useToast();

  // Form State
  const [firstName, setFirstName] = useState("");
  const [surname, setSurname] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [country, setCountry] = useState("");
  const [publication, setPublication] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);
  const [licenseFile, setLicenseFile] = useState<File | null>(null);
  const [licenseFileName, setLicenseFileName] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleInterestClick = (interest: string) => {
    setSelectedInterests(prev =>
      prev.includes(interest)
        ? prev.filter(i => i !== interest)
        : [...prev, interest]
    );
  };

  const handleLicenseUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const allowedTypes = ['application/pdf', 'image/jpeg', 'image/png', 'image/jpg'];
      if (!allowedTypes.includes(file.type)) {
        setError("Please upload a PDF, JPEG, or PNG file.");
        return;
      }
      
      if (file.size > 5 * 1024 * 1024) {
        setError("File size must be less than 5MB.");
        return;
      }
      
      setLicenseFile(file);
      setLicenseFileName(file.name);
      setError("");
    }
  };

const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  
  // Basic validation
  if (!firstName || !surname || !lastName || !email || !country || !publication || selectedInterests.length === 0) {
    setError("Please fill out all required fields.");
    addToast("Please fill out all required fields.", "error");
    return;
  }

  // Password validation
  if (!password || !confirmPassword) {
    setError("Password and confirmation are required.");
    addToast("Password and confirmation are required.", "error");
    return;
  }

  if (password !== confirmPassword) {
    setError("Passwords do not match.");
    addToast("Passwords do not match.", "error");
    return;
  }

  if (password.length < 6) {
    setError("Password must be at least 6 characters.");
    addToast("Password must be at least 6 characters.", "error");
    return;
  }

  if (!licenseFile) {
    setError("License upload is required.");
    addToast("License upload is required.", "error");
    return;
  }
  
  setIsLoading(true);
  setError("");

  try {
    // Prepare form data for file upload
    const formData = new FormData();
    formData.append("firstName", firstName);
    formData.append("surname", surname);
    formData.append("lastName", lastName);
    formData.append("email", email);
    formData.append("phoneNumber", phoneNumber);
    formData.append("country", country);
    formData.append("publication", publication);
    formData.append("password", password);
    formData.append("confirmPassword", confirmPassword);
    formData.append("interests", JSON.stringify(selectedInterests));
    
    if (licenseFile) {
      formData.append("license", licenseFile);
    }

    console.log('Sending journalist registration...');

    // Register journalist using fetch
    const response = await fetch('http://localhost:5000/api/auth/register/journalist', {
      method: 'POST',
      body: formData,
    });

    const data = await response.json();
    console.log('Journalist registration response:', data);

    if (data.success) {
      addToast("Journalist registration successful! Your account is pending verification.", "success");
      
      // Redirect to login since journalist accounts need verification
      setTimeout(() => {
        navigate('/login');
      }, 2000);
    } else {
      setError(data.message);
      addToast(data.message, "error");
    }
  } catch (error) {
    console.error('Registration error:', error);
    setError("Network error. Please try again.");
    addToast("Network error. Please try again.", "error");
  } finally {
    setIsLoading(false);
  }
};

  const inputStyle = "w-full border border-gray-600 bg-gray-800/50 rounded-md p-2.5 text-sm text-gray-200 placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-500";

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
          <motion.div 
            className="w-full max-w-5xl bg-gray-900/80 backdrop-blur-md rounded-2xl shadow-xl p-6 md:p-10 mt-6 ring-1 ring-white/10"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
          >
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
              
              {/* Left Column: Information */}
              <div className="text-white">
                <h1 className="text-3xl font-bold mb-3">Enroll as a Verified Journalist</h1>
                <p className="text-gray-300 mb-6">Join a Network of Trust and Timely Information. The Press Release Portal is committed to connecting journalists with credible, verified news.</p>
                <ul className="space-y-3 text-sm text-gray-400">
                  <li className="flex items-start"><span className="text-cyan-400 mr-2 mt-1">◆</span><span>Press releases tailored to your specific beats and interests.</span></li>
                  <li className="flex items-start"><span className="text-cyan-400 mr-2 mt-1">◆</span><span>Direct, secure communication channels with verified professionals.</span></li>
                  <li className="flex items-start"><span className="text-cyan-400 mr-2 mt-1">◆</span><span>Exclusive access to embargoed and sensitive information.</span></li>
                  <li className="flex items-start"><span className="text-cyan-400 mr-2 mt-1">◆</span><span>Verification ensures platform integrity and trust.</span></li>
                </ul>
              </div>

              {/* Right Column: Form */}
              <div>
                <h2 className="text-2xl font-bold text-white mb-4">Journalist Enrollment Form</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                  {error && <p className="text-red-400 text-sm bg-red-900/50 p-3 rounded-md">{error}</p>}
                  
                  {/* Name Fields */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <input 
                      type="text" 
                      placeholder="First Name *" 
                      value={firstName} 
                      onChange={e => setFirstName(e.target.value)} 
                      className={inputStyle} 
                      required 
                    />
                    <input 
                      type="text" 
                      placeholder="Surname *" 
                      value={surname} 
                      onChange={e => setSurname(e.target.value)} 
                      className={inputStyle} 
                      required 
                    />
                    <input 
                      type="text" 
                      placeholder="Last Name *" 
                      value={lastName} 
                      onChange={e => setLastName(e.target.value)} 
                      className={inputStyle} 
                      required 
                    />
                  </div>

                  {/* Contact Information */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <input 
                      type="email" 
                      placeholder="Email Address *" 
                      value={email} 
                      onChange={e => setEmail(e.target.value)} 
                      className={inputStyle} 
                      required 
                    />
                    <input 
                      type="text" 
                      placeholder="Optional Phone Number" 
                      value={phoneNumber} 
                      onChange={e => setPhoneNumber(e.target.value)} 
                      className={inputStyle} 
                    />
                    <input 
                      type="text" 
                      placeholder="Country *" 
                      value={country} 
                      onChange={e => setCountry(e.target.value)} 
                      className={inputStyle} 
                      required 
                    />
                    <input 
                      type="text" 
                      placeholder="Publication / Media House *" 
                      value={publication} 
                      onChange={e => setPublication(e.target.value)} 
                      className={inputStyle} 
                      required 
                    />
                  </div>

                  {/* Password Fields */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <input 
                      type="password" 
                      placeholder="Password *" 
                      value={password} 
                      onChange={e => setPassword(e.target.value)} 
                      className={inputStyle} 
                      required 
                    />
                    <input 
                      type="password" 
                      placeholder="Confirm Password *" 
                      value={confirmPassword} 
                      onChange={e => setConfirmPassword(e.target.value)} 
                      className={inputStyle} 
                      required 
                    />
                  </div>
                  
                  {/* License Upload Section */}
                  <div className="border border-gray-600 rounded-md p-4 bg-gray-800/30">
                    <label className="block text-sm font-medium text-gray-300 mb-3">
                      Journalist License / Certification *
                      <span className="text-xs text-gray-500 ml-2">(PDF, JPEG, or PNG, max 5MB)</span>
                    </label>
                    <div className="flex items-center justify-center w-full">
                      <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-600 rounded-lg cursor-pointer bg-gray-800/50 hover:border-cyan-500 transition-colors">
                        <div className="flex flex-col items-center justify-center pt-5 pb-6">
                          <svg className="w-8 h-8 mb-4 text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 16">
                            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"/>
                          </svg>
                          <p className="mb-2 text-sm text-gray-400">
                            <span className="font-semibold">Click to upload</span> or drag and drop
                          </p>
                          <p className="text-xs text-gray-500">{licenseFileName || "Your press card, journalist ID, or certification"}</p>
                        </div>
                        <input 
                          type="file" 
                          className="hidden" 
                          accept=".pdf,.jpg,.jpeg,.png" 
                          onChange={handleLicenseUpload}
                          required
                        />
                      </label>
                    </div>
                    {licenseFileName && (
                      <div className="mt-2 flex items-center text-sm text-cyan-400">
                        <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
                        </svg>
                        {licenseFileName}
                      </div>
                    )}
                  </div>
                  
                  {/* Industries of Interest */}
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-3">Industries of Interest (Select all that apply) *</label>
                    <div className="flex flex-wrap gap-2">
                      {industries.map(interest => (
                        <button
                          type="button"
                          key={interest}
                          onClick={() => handleInterestClick(interest)}
                          className={`px-3 py-1.5 text-xs font-medium border rounded-full transition-colors ${
                            selectedInterests.includes(interest) 
                            ? 'bg-cyan-500 border-cyan-500 text-white' 
                            : 'bg-gray-800/50 border-gray-700 text-gray-300 hover:border-cyan-500'
                          }`}
                        >
                          {interest}
                        </button>
                      ))}
                    </div>
                  </div>
                  
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full mt-2 px-4 py-3 bg-cyan-500 text-white rounded-md text-sm font-bold hover:bg-cyan-600 disabled:opacity-70 transition-colors"
                  >
                    {isLoading ? "Processing..." : "Complete Enrollment"}
                  </button>
                  <p className="text-xs text-gray-500 text-center">
                    By completing enrollment, you agree to our terms of service. Your license will be verified within 24-48 hours.
                  </p>
                </form>
              </div>

            </div>
          </motion.div>
        </main>
      </div>
    </div>
  );
};

export default JournalistSignUp;