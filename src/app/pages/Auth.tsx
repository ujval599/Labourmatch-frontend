// src/app/pages/Auth.tsx
import { useState } from "react";
import { useNavigate, Link } from "react-router";
import { LogIn, UserPlus, Loader2, Users, HardHat, CheckCircle2, AlertCircle } from "lucide-react";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";
import { useAuth } from "../../context/AuthContext";

export default function Auth() {
  const navigate = useNavigate();
  const { login, register, setSelectedRole, selectedRole } = useAuth();

  const [loginData, setLoginData] = useState({ phone: "", password: "" });
  const [signupData, setSignupData] = useState({ name: "", phone: "", email: "", password: "" });

  const [termsAccepted, setTermsAccepted] = useState(false);
  const [signupError, setSignupError] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const getRedirect = () => {
    try {
      const u = JSON.parse(localStorage.getItem("user") || "{}");
      if (u.role === "ADMIN") return "/admin";
    } catch {}
    return "/";
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      await login(loginData.phone, loginData.password);
      navigate(getRedirect());
    } catch (err: any) {
      setError(err?.response?.data?.message || err?.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setSignupError("");

    if (!selectedRole) {
      setSignupError("Please select your role — User or Contractor.");
      return;
    }
    if (!termsAccepted) {
      setSignupError("Please accept the Terms & Conditions to continue.");
      return;
    }
    if (signupData.password.length < 6) {
      setSignupError("Password must be at least 6 characters.");
      return;
    }
    if (!/^\d{10}$/.test(signupData.phone)) {
      setSignupError("Please enter a valid 10-digit phone number.");
      return;
    }

    setLoading(true);

    try {
      // ✅ FIX: Chahe User ho ya Contractor — dono ko sirf User table mein save karo
      // Contractor profile baad mein "Become a Contractor" page se banegi
      await register(signupData.name, signupData.phone, signupData.email, signupData.password);

      // ✅ Role save karo localStorage mein taaki login ke baad pata rahe
      if (selectedRole === "contractor") {
        setSelectedRole("contractor");
      }

      navigate("/");

    } catch (err: any) {
      setSignupError(err?.response?.data?.message || err?.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary via-primary/95 to-secondary flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">

        {/* Logo */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-white rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-2xl">
            <span className="text-primary font-bold text-3xl">LM</span>
          </div>
          <h1 className="text-4xl font-bold text-white mb-3">Welcome to LabourMatch</h1>
          <p className="text-white/90 text-lg">Find trusted labour contractors near you</p>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg text-sm text-center">{error}</div>
        )}

        <Tabs defaultValue="login" className="w-full">
          <TabsList className="grid w-full grid-cols-2 bg-white/20 backdrop-blur-sm p-1 mb-4">
            <TabsTrigger value="login" className="data-[state=active]:bg-white data-[state=active]:text-primary text-white text-sm font-semibold">Login</TabsTrigger>
            <TabsTrigger value="signup" className="data-[state=active]:bg-white data-[state=active]:text-primary text-white text-sm font-semibold">Sign Up</TabsTrigger>
          </TabsList>

          {/* Login Tab */}
          <TabsContent value="login">
            <Card className="border-0 shadow-2xl">
              <CardHeader>
                <CardTitle className="flex items-center gap-2"><LogIn className="h-5 w-5" /> Login</CardTitle>
                <CardDescription>Login with phone and password</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleLogin} className="space-y-4">
                  <div>
                    <Label>Phone Number</Label>
                    <Input type="tel" required placeholder="9876543210" value={loginData.phone}
                      onChange={(e) => setLoginData({ ...loginData, phone: e.target.value })}
                      className="mt-2 h-12" maxLength={10} />
                  </div>
                  <div>
                    <Label>Password</Label>
                    <Input type="password" required placeholder="••••••••" value={loginData.password}
                      onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                      className="mt-2 h-12" />
                  </div>
                  <Button type="submit" className="w-full h-12" disabled={loading}>
                    {loading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null} Login
                  </Button>
                  <div className="text-center">
                    <Link to="/forgot-password" className="text-xs text-primary hover:underline font-medium">
                      Forgot Password?
                    </Link>
                  </div>
                </form>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Sign Up Tab */}
          <TabsContent value="signup">
            <Card className="border-0 shadow-2xl">
              <CardHeader>
                <CardTitle className="flex items-center gap-2"><UserPlus className="h-5 w-5" /> Create Account</CardTitle>
                <CardDescription>Create your account</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSignup} className="space-y-4">
                  <div>
                    <Label>Full Name</Label>
                    <Input required placeholder="Your name" value={signupData.name}
                      onChange={(e) => setSignupData({ ...signupData, name: e.target.value })} className="mt-2 h-12" />
                  </div>
                  <div>
                    <Label>Phone Number</Label>
                    <Input type="tel" required placeholder="9876543210" value={signupData.phone}
                      onChange={(e) => setSignupData({ ...signupData, phone: e.target.value })}
                      className="mt-2 h-12" maxLength={10} />
                  </div>
                  <div>
                    <Label>Email (Optional)</Label>
                    <Input type="email" placeholder="email@example.com" value={signupData.email}
                      onChange={(e) => setSignupData({ ...signupData, email: e.target.value })} className="mt-2 h-12" />
                  </div>
                  <div>
                    <Label>Password</Label>
                    <Input type="password" required placeholder="Min 6 characters" value={signupData.password}
                      onChange={(e) => setSignupData({ ...signupData, password: e.target.value })} className="mt-2 h-12" />
                  </div>

                  {/* Role Selection */}
                  <div className="pt-2 border-t border-gray-100">
                    <div className="flex items-center justify-between mb-3">
                      <p className="text-xs text-gray-500 font-medium">I am joining as a: <span className="text-red-500">*</span></p>
                      {!selectedRole && <span className="text-xs text-red-400 italic">Required</span>}
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <button type="button" onClick={() => setSelectedRole("user")}
                        className={`relative flex items-center justify-center gap-2 border-2 py-3 px-4 rounded-xl font-semibold text-sm transition-all ${
                          selectedRole === "user"
                            ? "border-primary bg-primary text-white shadow-md scale-105"
                            : "border-gray-200 text-gray-600 hover:border-primary hover:bg-primary/5 hover:text-primary"
                        }`}>
                        <Users className="h-4 w-4" />
                        User
                        {selectedRole === "user" && <CheckCircle2 className="h-4 w-4 absolute top-1 right-1 text-white" />}
                      </button>
                      <button type="button" onClick={() => setSelectedRole("contractor")}
                        className={`relative flex items-center justify-center gap-2 border-2 py-3 px-4 rounded-xl font-semibold text-sm transition-all ${
                          selectedRole === "contractor"
                            ? "border-amber-500 bg-amber-500 text-white shadow-md scale-105"
                            : "border-gray-200 text-gray-600 hover:border-amber-500 hover:bg-amber-50 hover:text-amber-600"
                        }`}>
                        <HardHat className="h-4 w-4" />
                        Contractor
                        {selectedRole === "contractor" && <CheckCircle2 className="h-4 w-4 absolute top-1 right-1 text-white" />}
                      </button>
                    </div>

                    {/* Contractor info message */}
                    {selectedRole === "contractor" && (
                      <div className="mt-3 p-3 bg-amber-50 border border-amber-200 rounded-xl">
                        <p className="text-xs text-amber-700 font-medium">
                          Register to become a contractor. Use the same phone number that you used to log in.
                        </p>
                      </div>
                    )}

                    {selectedRole && (
                      <p className="text-xs text-center mt-2 font-medium text-primary">
                        ✓ Selected: {selectedRole === "user" ? "User" : "Contractor"}
                      </p>
                    )}
                  </div>

                  {/* Terms & Conditions */}
                  <div className={`border rounded-xl p-3 transition-colors ${termsAccepted ? "border-green-300 bg-green-50" : "border-gray-200 bg-gray-50"}`}>
                    <label className="flex items-start gap-3 cursor-pointer">
                      <div className="relative flex-shrink-0 mt-0.5">
                        <input type="checkbox" checked={termsAccepted} onChange={(e) => setTermsAccepted(e.target.checked)} className="sr-only" />
                        <div className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-all ${termsAccepted ? "bg-green-500 border-green-500" : "border-gray-300 bg-white"}`}>
                          {termsAccepted && (
                            <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                            </svg>
                          )}
                        </div>
                      </div>
                      <span className="text-xs text-gray-600 leading-relaxed">
                        I agree to LabourMatch's{" "}
                        <Link to="/terms-and-conditions" target="_blank" className="text-primary font-semibold underline hover:text-primary/80">Terms & Conditions</Link>
                        {" "}and{" "}
                        <Link to="/privacy-policy" target="_blank" className="text-primary font-semibold underline hover:text-primary/80">Privacy Policy</Link>.
                        I confirm that all information provided is accurate.
                      </span>
                    </label>
                  </div>

                  {signupError && (
                    <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm">
                      <AlertCircle className="h-4 w-4 flex-shrink-0" />
                      {signupError}
                    </div>
                  )}

                  <Button type="submit" className="w-full h-12" disabled={loading}>
                    {loading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                    Create Account
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}