// src/app/pages/RegisterContractor.tsx

import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router";
import { CheckCircle, UserPlus, Loader2, ImagePlus, X, MapPin } from "lucide-react";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Textarea } from "../components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select";
import contractorService from "../../services/contractor.service";

// ── Gujarat ke saare cities + areas ──────────────────────────────
const GUJARAT_LOCATIONS = [
  // Major Cities
  "Ahmedabad", "Surat", "Vadodara", "Rajkot", "Bhavnagar", "Jamnagar",
  "Junagadh", "Gandhinagar", "Anand", "Nadiad", "Mehsana", "Morbi",
  "Surendranagar", "Bharuch", "Valsad", "Navsari", "Porbandar", "Amreli",
  "Botad", "Dahod", "Patan", "Palanpur", "Godhra", "Veraval", "Dwarka",
  "Kutch", "Bhuj", "Gandhidham", "Mundra", "Anjar", "Mandvi",

  // Ahmedabad Areas
  "Maninagar", "Navrangpura", "Satellite", "Bopal", "Gota", "Chandkheda",
  "Naroda", "Vatva", "Odhav", "Nikol", "Vastral", "Isanpur", "Bapunagar",
  "Shahibaug", "Sabarmati", "Motera", "Ranip", "Naranpura", "Thaltej",
  "Prahlad Nagar", "Bodakdev", "Vastrapur", "Ellis Bridge", "Paldi",
  "Vejalpur", "Jivraj Park", "Lambha", "Sanand", "Bavla", "Dholka",
  "Dholera", "Viramgam", "Bareja", "Sarkhej", "Ghuma", "Shela", "Tragad",
  "Kukatpally", "Bhadaj", "Ambawadi", "Law Garden", "CG Road", "SG Highway",

  // Surat Areas
  "Adajan", "Vesu", "Pal", "Katargam", "Udhna", "Sachin", "Dumas",
  "Piplod", "Bhatar", "Althan", "City Light", "Rander", "Limbayat",
  "Varachha", "Salabatpura", "Nanpura", "Chowk Bazaar", "Ring Road Surat",
  "Parvat", "Amroli", "Sarthana", "Kamrej", "Olpad", "Bardoli", "Vyara",
  "Mandvi Surat", "Mahuva", "Songadh", "Tapi",

  // Vadodara Areas
  "Alkapuri", "Fatehgunj", "Gotri", "Karelibaug", "Manjalpur", "Nizampura",
  "Waghodia Road", "Harni", "Makarpura", "Sama", "Akota", "Gorwa",
  "Chhani", "Padra", "Karjan", "Dabhoi", "Sinor", "Kawant",

  // Rajkot Areas
  "Kalawad Road", "Gondal Road", "Mavdi", "Aji Dam Road", "150 Feet Ring Road",
  "Bhaktinagar", "Raiya Road", "Kothariya", "Pedak Road", "University Road",
  "Kalavad", "Gondal", "Jasdan", "Wankaner", "Morbi Road",

  // Mehsana & North Gujarat
  "Unjha", "Visnagar", "Kheralu", "Satlasana", "Harij", "Radhanpur",
  "Chanasma", "Kadi", "Kalol", "Himmatnagar", "Idar", "Modasa",
  "Bayad", "Bhiloda", "Prantij", "Talod", "Shamlaji", "Vadnagar",

  // South Gujarat
  "Bilimora", "Chikhli", "Gandevi", "Vapi", "Silvassa", "Umbergaon",
  "Pardi", "Bulsar", "Dharampur", "Kaprada", "Dang", "Ahwa",

  // Saurashtra Region
  "Jetpur", "Dhoraji", "Upleta", "Vinchhiya", "Paddhari", "Lodhika",
  "Khambhalia", "Okha", "Kalyanpur", "Bhanvad", "Jamkhambhalia",
  "Salaya", "Dhrol", "Lalpur", "Mithapur", "Sikka",
  "Mahuva Bhavnagar", "Talaja", "Palitana", "Gariadhar", "Sihor",
  "Gadhada", "Vallabhipur", "Umrala", "Una", "Keshod", "Mangrol",
  "Manavadar", "Visavadar", "Mendarda", "Talala", "Kodinar",
  "Sutrapada", "Chotila", "Sayla", "Wadhwan", "Muli", "Dhrangadhra",
  "Halvad", "Limbdi", "Lakhtar", "Dasada", "Patdi",

  // Kutch Region
  "Rapar", "Nakhatrana", "Abdasa", "Lakhpat", "Bhachau", "Dudhai",
  "Khavda", "Dayapar", "Vondh", "Samakhyali",
];

// ── City Autocomplete Component ───────────────────────────────────
function LocationAutocomplete({
  id, name, label, placeholder, value, onChange, required = false,
}: {
  id: string; name: string; label: string; placeholder: string;
  value: string; onChange: (val: string) => void; required?: boolean;
}) {
  const [query, setQuery] = useState(value);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [showList, setShowList] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  // Close on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setShowList(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setQuery(val);
    onChange(val);
    if (val.length >= 2) {
      const filtered = GUJARAT_LOCATIONS.filter(loc =>
        loc.toLowerCase().includes(val.toLowerCase())
      ).slice(0, 8);
      setSuggestions(filtered);
      setShowList(filtered.length > 0);
    } else {
      setSuggestions([]);
      setShowList(false);
    }
  };

  const handleSelect = (loc: string) => {
    setQuery(loc);
    onChange(loc);
    setSuggestions([]);
    setShowList(false);
  };

  return (
    <div ref={wrapperRef} className="relative">
      <Label htmlFor={id}>{label} {required && "*"}</Label>
      <div className="relative mt-1">
        <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
        <input
          id={id}
          name={name}
          required={required}
          autoComplete="off"
          placeholder={placeholder}
          value={query}
          onChange={handleInput}
          onFocus={() => {
            if (suggestions.length > 0) setShowList(true);
          }}
          className="flex h-10 w-full rounded-md border border-input bg-background pl-9 pr-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
        />
      </div>

      {showList && (
        <ul className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-xl shadow-lg max-h-52 overflow-y-auto">
          {suggestions.map((loc) => (
            <li key={loc}
              onMouseDown={() => handleSelect(loc)}
              className="flex items-center gap-2 px-4 py-2.5 hover:bg-orange-50 cursor-pointer text-sm text-gray-700 transition-colors">
              <MapPin className="h-3.5 w-3.5 text-orange-400 flex-shrink-0" />
              {loc}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

// ── Main Page ─────────────────────────────────────────────────────
export default function RegisterContractor() {
  const navigate = useNavigate();
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    name: "", phone: "", email: "",
    location: "", city: "", workers: "", workType: "",
    priceRange: "", experience: "", description: "",
  });

  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setImage(file);
    if (file) {
      if (!file.type.startsWith("image/")) {
        setError("Only image files are allowed. (JPG, PNG, etc.)");
        setImage(null); setImagePreview(null); return;
      }
      if (file.size > 5 * 1024 * 1024) {
        setError("The image size should be less than 5MB.");
        setImage(null); setImagePreview(null); return;
      }
      setError("");
      setImagePreview(URL.createObjectURL(file));
    } else {
      setImagePreview(null);
    }
  };

  const handleRemoveImage = () => { setImage(null); setImagePreview(null); };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const fd = new FormData();
      Object.entries(formData).forEach(([k, v]) => fd.append(k, v));
      if (image) fd.append("image", image, image.name);
      const result = await contractorService.register(fd);
      if (result.success) {
        setSubmitted(true);
      } else {
        setError(result.message);
      }
    } catch (err: any) {
      setError(err?.response?.data?.message || "Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <Card className="max-w-lg w-full">
          <CardContent className="p-12 text-center">
            <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="h-10 w-10 text-primary" />
            </div>
            <h2 className="text-2xl font-bold mb-4">Registration Submitted!</h2>
            <p className="text-muted-foreground mb-6">
              Thank you! Our team will verify your details and contact you within 24–48 hours.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button onClick={() => navigate("/")}>Go to Home</Button>
              <Button variant="outline" onClick={() => navigate("/contractors")}>View Contractors</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-primary text-white py-12 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">Register as a Contractor</h1>
          <p className="text-lg opacity-90">Join our platform and connect with new customers</p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8">
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left sidebar */}
          <div className="space-y-6">
            <Card>
              <CardHeader><CardTitle>Benefits</CardTitle></CardHeader>
              <CardContent className="space-y-4">
                {[
                  ["More Clients", "Reach thousands of customers"],
                  ["Build Your Reputation", "Get reviews and ratings"],
                  ["Free Listing", "No registration fee"],
                  ["Direct Contact", "Customers contact you directly"],
                ].map(([title, desc]) => (
                  <div key={title} className="flex gap-3">
                    <CheckCircle className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-semibold text-sm">{title}</p>
                      <p className="text-xs text-muted-foreground">{desc}</p>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
            <Card>
              <CardHeader><CardTitle>Requirements</CardTitle></CardHeader>
              <CardContent className="space-y-2 text-sm text-muted-foreground">
                <p>• Valid phone number</p>
                <p>• Min 2 years of experience</p>
                <p>• Min 5 workers in the team</p>
                <p>• Clear price range</p>
                <p>• Optional: Profile photo</p>
              </CardContent>
            </Card>

            {/* Gujarat Cities Info */}
            <Card className="border-orange-200 bg-orange-50">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm text-orange-700 flex items-center gap-2">
                  <MapPin className="h-4 w-4" /> Gujarat Coverage
                </CardTitle>
              </CardHeader>
              <CardContent className="text-xs text-orange-600 space-y-1">
                <p>📍 Ahmedabad, Surat, Vadodara</p>
                <p>📍 Rajkot, Bhavnagar, Jamnagar</p>
                <p>📍 Gandhinagar, Anand, Mehsana</p>
                <p>📍 Kutch, Morbi, Bharuch + more</p>
                <p className="text-orange-500 font-medium mt-2">150+ Gujarat locations available</p>
              </CardContent>
            </Card>
          </div>

          {/* Main form */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Registration Form</CardTitle>
                <CardDescription>Fill in your details to register</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">

                  {/* Personal Information */}
                  <div className="space-y-4">
                    <h3 className="font-semibold text-gray-800 border-b pb-2">Personal Information</h3>

                    <div>
                      <Label htmlFor="name">Full Name *</Label>
                      <Input id="name" name="name" required placeholder="Your full name"
                        value={formData.name} onChange={handleChange} />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="phone">Phone Number *</Label>
                        <Input id="phone" name="phone" type="tel" required placeholder="9876543210"
                          value={formData.phone} onChange={handleChange} maxLength={10} />
                      </div>
                      <div>
                        <Label htmlFor="email">Email (Optional)</Label>
                        <Input id="email" name="email" type="email" placeholder="your@email.com"
                          value={formData.email} onChange={handleChange} />
                      </div>
                    </div>

                    {/* ✅ Location + City — Gujarat Autocomplete */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <LocationAutocomplete
                        id="location" name="location" required
                        label="Location (Area/Mohalla)"
                        placeholder="Jaise: Bopal, Adajan, Alkapuri..."
                        value={formData.location}
                        onChange={(val) => setFormData(f => ({ ...f, location: val }))}
                      />
                      <LocationAutocomplete
                        id="city" name="city" required
                        label="City"
                        placeholder="Jaise: Ahmedabad, Surat..."
                        value={formData.city}
                        onChange={(val) => setFormData(f => ({ ...f, city: val }))}
                      />
                    </div>
                  </div>

                  {/* Business Information */}
                  <div className="space-y-4">
                    <h3 className="font-semibold text-gray-800 border-b pb-2">Business Information</h3>

                    <div>
                      <Label>Type of Work *</Label>
                      <Select name="workType" required onValueChange={(v) => setFormData({ ...formData, workType: v })}>
                        <SelectTrigger><SelectValue placeholder="Select work type" /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="construction">Construction</SelectItem>
                          <SelectItem value="shifting">Shifting & Moving</SelectItem>
                          <SelectItem value="loading">Loading/Unloading</SelectItem>
                          <SelectItem value="helpers">Daily Helpers</SelectItem>
                          <SelectItem value="multiple">Multiple Services</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="workers">Number of Workers *</Label>
                        <Input id="workers" name="workers" type="number" required placeholder="15"
                          value={formData.workers} onChange={handleChange} />
                      </div>
                      <div>
                        <Label htmlFor="experience">Years of Experience *</Label>
                        <Input id="experience" name="experience" type="number" required placeholder="5"
                          value={formData.experience} onChange={handleChange} />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="priceRange">Price Range (per worker/day) *</Label>
                      <Input id="priceRange" name="priceRange" required placeholder="500-700"
                        value={formData.priceRange} onChange={handleChange} />
                    </div>

                    <div>
                      <Label htmlFor="description">Description</Label>
                      <Textarea id="description" name="description"
                        placeholder="Tell us about your team and services..." rows={3}
                        value={formData.description} onChange={handleChange} />
                    </div>

                    {/* Image Upload */}
                    <div>
                      <Label htmlFor="image">Profile Photo (Optional)</Label>
                      {imagePreview ? (
                        <div className="mt-2 relative w-32 h-32">
                          <img src={imagePreview} alt="Profile Preview"
                            className="w-32 h-32 object-cover rounded-lg border-2 border-primary" />
                          <button type="button" onClick={handleRemoveImage}
                            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-0.5 hover:bg-red-600">
                            <X className="h-4 w-4" />
                          </button>
                        </div>
                      ) : (
                        <div className="mt-2 border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-primary transition-colors">
                          <ImagePlus className="h-8 w-8 mx-auto mb-2 text-gray-400" />
                          <p className="text-sm text-muted-foreground mb-2">JPG, PNG allowed • Max 5MB</p>
                          <Input id="image" type="file" accept="image/jpeg,image/jpg,image/png,image/webp"
                            onChange={handleImageChange} className="cursor-pointer" />
                        </div>
                      )}
                    </div>
                  </div>

                  <Button type="submit" size="lg" className="w-full" disabled={loading}>
                    {loading
                      ? <><Loader2 className="h-5 w-5 mr-2 animate-spin" /> Submitting...</>
                      : <><UserPlus className="h-5 w-5 mr-2" /> Submit Registration</>
                    }
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}