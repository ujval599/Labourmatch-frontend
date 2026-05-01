import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router";
import { Search, MapPin, Building2, Truck, Package, Users, CheckCircle, Phone, BadgeCheck, Zap, Shield, TrendingUp, Star, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Card, CardContent } from "../components/ui/card";
import { CategoryCard } from "../components/CategoryCard";
import { ContractorCard } from "../components/ContractorCard";
import { TrustBadge } from "../components/TrustBadge";
import { useAuth } from "../../context/AuthContext";

const BASE_URL = import.meta.env.VITE_API_URL || "https://labourmatch.onrender.com";

// ✅ Hero background images — public/images/ folder mein save karo
const HERO_IMAGES = [
  "/images/hero1.jpg",
  "/images/hero2.jpg",
  "/images/hero3.jpg",
  "/images/hero4.jpg",
  "/images/hero5.jpg",
  "/images/hero6.jpg",
  "/images/hero7.jpg",
];

export default function Home() {
  const navigate = useNavigate();
  const { isContractor, isAdmin, user } = useAuth();
  const [location, setLocation] = useState("");
  const [featuredContractors, setFeaturedContractors] = useState<any[]>([]);
  const [loadingContractors, setLoadingContractors] = useState(true);

  // ── Image Slider State ──────────────────────────────────────────
  const [currentImg, setCurrentImg] = useState(0);
  const [fade, setFade] = useState(true);

  const goToImg = useCallback((idx: number) => {
    setFade(false);
    setTimeout(() => {
      setCurrentImg(idx);
      setFade(true);
    }, 400);
  }, []);

  const nextImg = useCallback(() => {
    goToImg((currentImg + 1) % HERO_IMAGES.length);
  }, [currentImg, goToImg]);

  const prevImg = useCallback(() => {
    goToImg((currentImg - 1 + HERO_IMAGES.length) % HERO_IMAGES.length);
  }, [currentImg, goToImg]);

  // ✅ Auto change — har 4 second mein image badle
  useEffect(() => {
    const timer = setInterval(nextImg, 4000);
    return () => clearInterval(timer);
  }, [nextImg]);

  // ── Contractors fetch ───────────────────────────────────────────
  useEffect(() => {
    fetch(`${BASE_URL}/api/contractors?limit=6&sortBy=rating`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          const formatted = data.data.map((c: any) => ({
            id: c.id,
            name: c.name,
            rating: c.rating || 0,
            reviews: c.reviewCount || 0,
            workers: c.workers,
            priceRange: `₹${c.priceMin}-${c.priceMax}/day`,
            location: c.city || c.location,
            imageUrl: c.imageUrl || null,
            image: c.imageUrl || null,
            verified: c.verified,
            category: c.category,
          }));
          setFeaturedContractors(formatted);
        }
      })
      .catch(() => {})
      .finally(() => setLoadingContractors(false));
  }, []);

  const handleSearch = () => {
    if (location.trim()) {
      navigate(`/contractors?search=${encodeURIComponent(location)}`);
    } else {
      navigate("/contractors");
    }
  };

  // ✅ User logged in hai to "Become a Contractor" nahi dikhana
  const showBecomeContractor = !user || isContractor || isAdmin;

  return (
    <div className="min-h-screen">

      {/* ── Hero Section with Image Slider ── */}
      <section className="relative py-24 md:py-32 px-4 overflow-hidden min-h-[600px] flex items-center">

        {/* ✅ Background Images — auto change */}
        {HERO_IMAGES.map((img, i) => (
          <div
            key={img}
            className="absolute inset-0 bg-cover bg-center bg-no-repeat transition-opacity duration-700"
            style={{
              backgroundImage: `url(${img})`,
              opacity: i === currentImg ? (fade ? 1 : 0) : 0,
              zIndex: 0,
            }}
          />
        ))}

        {/* Dark overlay — text readable rahe */}
        <div className="absolute inset-0 bg-black/55 z-[1]" />

        {/* Gradient overlay — bottom pe smooth */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/40 z-[1]" />

        {/* ✅ Prev / Next buttons */}
        <button
          onClick={prevImg}
          className="absolute left-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-white/20 hover:bg-white/40 backdrop-blur-sm flex items-center justify-center text-white transition-all"
        >
          <ChevronLeft className="h-5 w-5" />
        </button>
        <button
          onClick={nextImg}
          className="absolute right-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-white/20 hover:bg-white/40 backdrop-blur-sm flex items-center justify-center text-white transition-all"
        >
          <ChevronRight className="h-5 w-5" />
        </button>

        {/* ✅ Dot indicators */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex gap-2">
          {HERO_IMAGES.map((_, i) => (
            <button
              key={i}
              onClick={() => goToImg(i)}
              className={`rounded-full transition-all ${i === currentImg ? "w-6 h-2 bg-white" : "w-2 h-2 bg-white/50 hover:bg-white/80"}`}
            />
          ))}
        </div>

        {/* Content */}
        <div className="max-w-6xl mx-auto relative z-10 w-full">
          <div className="text-center mb-10">
            <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full text-white text-sm mb-6 border border-white/30">
              <Zap className="h-4 w-4" />
              <span>India's Most Trusted Labour Marketplace</span>
            </div>

            <h1 className="text-4xl md:text-6xl font-bold mb-6 text-white leading-tight drop-shadow-lg">
              Get Trusted Labour Contractors
              <br />
              <span className="bg-gradient-to-r from-yellow-200 to-yellow-400 bg-clip-text text-transparent">
                in Minutes
              </span>
            </h1>

            <p className="text-xl md:text-2xl text-white/90 mb-10 max-w-3xl mx-auto drop-shadow">
              Connect with verified contractors for construction, shifting, and daily work.
              <br className="hidden md:block" />
              Fast, reliable, and trusted by thousands.
            </p>

            {/* Search Bar */}
            <div className="bg-white rounded-2xl shadow-2xl p-3 flex flex-col md:flex-row gap-3 max-w-3xl mx-auto mb-8">
              <div className="flex-1 flex items-center px-4 border-2 border-transparent focus-within:border-primary rounded-xl transition-all bg-gray-50">
                <MapPin className="h-5 w-5 text-primary mr-3 flex-shrink-0" />
                <Input
                  type="text"
                  placeholder="Enter your location (e.g., Andheri, Mumbai)"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                  className="border-0 focus-visible:ring-0 focus-visible:ring-offset-0 bg-transparent"
                />
              </div>
              <Button size="lg" onClick={handleSearch} className="md:w-auto w-full shadow-lg hover:shadow-xl transition-all">
                <Search className="h-5 w-5 mr-2" />
                Find Contractors Now
              </Button>
            </div>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <Button size="lg" variant="secondary" onClick={() => navigate("/contractors")} className="shadow-lg hover:shadow-xl transition-all">
                Browse All Contractors
              </Button>
              {/* ✅ Sirf contractor/admin/not-logged-in ko dikhao */}
              {showBecomeContractor && (
                <Button size="lg" variant="outline"
                  className="bg-white/10 backdrop-blur-sm border-white text-white hover:bg-white hover:text-primary shadow-lg"
                  onClick={() => navigate("/register-contractor")}>
                  <CheckCircle className="h-5 w-5 mr-2" />
                  Become a Contractor
                </Button>
              )}
            </div>

            {/* Trust Badges */}
            <div className="flex flex-wrap gap-4 justify-center">
              <TrustBadge icon={BadgeCheck} title="Verified" description="All contractors verified" />
              <TrustBadge icon={Star} title="Top Rated" description="4.8★ average rating" />
              <TrustBadge icon={Zap} title="Fast Service" description="Quick response time" />
            </div>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-20 px-4 bg-gradient-to-b from-white to-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <div className="inline-block bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-semibold mb-4">
              BROWSE BY CATEGORY
            </div>
            <h2 className="text-4xl md:text-5xl font-bold mb-4">What Do You Need Help With?</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">Choose your service and get connected with expert contractors instantly</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <CategoryCard icon={Building2} title="Construction" description="Building, renovation, and masonry work" onClick={() => navigate("/contractors")} />
            <CategoryCard icon={Truck} title="Shifting & Moving" description="Home and office relocation services" onClick={() => navigate("/contractors")} />
            <CategoryCard icon={Package} title="Loading/Unloading" description="Efficient loading and unloading" onClick={() => navigate("/contractors")} />
            <CategoryCard icon={Users} title="Daily Helpers" description="Skilled helpers for daily work" onClick={() => navigate("/contractors")} />
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <div className="inline-block bg-secondary/10 text-secondary px-4 py-2 rounded-full text-sm font-semibold mb-4">HOW IT WORKS</div>
            <h2 className="text-4xl md:text-5xl font-bold mb-4">Get Started in 3 Simple Steps</h2>
            <p className="text-xl text-muted-foreground">Finding reliable contractors has never been easier</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
            <div className="hidden md:block absolute top-1/4 left-0 right-0 h-1 bg-gradient-to-r from-primary via-secondary to-primary opacity-20" style={{ top: "80px" }} />
            {[
              { num: "1", title: "Search by Location", desc: "Enter your area to find nearby verified labour contractors instantly" },
              { num: "2", title: "Compare & Choose", desc: "View ratings, reviews, and prices to select the perfect contractor" },
              { num: "3", title: "Contact & Hire", desc: "Call or message directly to discuss your requirements and start work" },
            ].map((step, i) => (
              <div key={i} className="relative text-center">
                <div className={`bg-gradient-to-br from-primary to-secondary text-white w-20 h-20 rounded-2xl flex items-center justify-center text-3xl font-bold mx-auto mb-6 shadow-xl ${i % 2 === 0 ? "rotate-3" : "-rotate-3"} hover:rotate-0 transition-transform`}>
                  {step.num}
                </div>
                <h3 className="text-2xl font-bold mb-3">{step.title}</h3>
                <p className="text-muted-foreground text-lg">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Contractors */}
      <section className="py-20 px-4 bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center mb-16">
            <div>
              <div className="inline-block bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-semibold mb-4">TOP RATED</div>
              <h2 className="text-4xl md:text-5xl font-bold mb-4">Featured Contractors</h2>
              <p className="text-xl text-muted-foreground">Trusted professionals ready to help you</p>
            </div>
            <Button size="lg" variant="outline" onClick={() => navigate("/contractors")} className="mt-6 md:mt-0 shadow-md hover:shadow-lg transition-all">
              View All Contractors
            </Button>
          </div>

          {loadingContractors ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-80 bg-gray-100 rounded-2xl animate-pulse" />
              ))}
            </div>
          ) : featuredContractors.length === 0 ? (
            <div className="text-center py-16">
              <Users className="h-16 w-16 text-gray-200 mx-auto mb-4" />
              <p className="text-gray-400 text-lg">No contractors registered yet.</p>
              <Button onClick={() => navigate("/register-contractor")} className="mt-4">
                Become First Contractor
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {featuredContractors.map((contractor) => (
                <ContractorCard key={contractor.id} contractor={contractor} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <div className="inline-block bg-secondary/10 text-secondary px-4 py-2 rounded-full text-sm font-semibold mb-4">WHY CHOOSE US</div>
            <h2 className="text-4xl md:text-5xl font-bold mb-4">Your Trust is Our Priority</h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">We're committed to providing the best experience for both customers and contractors</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              { icon: Shield, title: "100% Verified", description: "All contractors undergo thorough background verification" },
              { icon: Star, title: "Top Rated", description: "Only the best contractors with proven track records" },
              { icon: Zap, title: "Quick Response", description: "Get responses from contractors within 2 hours" },
              { icon: CheckCircle, title: "Quality Assured", description: "We ensure high standards of work and professionalism" },
              { icon: Phone, title: "Direct Contact", description: "No middlemen - contact contractors directly" },
              { icon: TrendingUp, title: "Fair Pricing", description: "Transparent pricing with no hidden charges" },
            ].map((item, index) => (
              <Card key={index} className="border-0 shadow-md hover:shadow-xl transition-all group">
                <CardContent className="p-8 text-center">
                  <div className="w-16 h-16 bg-gradient-to-br from-primary/10 to-secondary/10 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                    <item.icon className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="text-xl font-bold mb-3">{item.title}</h3>
                  <p className="text-muted-foreground">{item.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-24 px-4 bg-gradient-to-br from-primary via-primary/95 to-secondary overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS1vcGFjaXR5PSIwLjA1IiBzdHJva2Utd2lkdGg9IjEiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZ3JpZCkiLz48L3N2Zz4=')] opacity-40" />
        <div className="max-w-5xl mx-auto text-center relative z-10">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 text-white">Ready to Find Your Perfect Contractor?</h2>
          <p className="text-xl md:text-2xl mb-10 text-white/90 max-w-3xl mx-auto">
            Join thousands of satisfied customers who found reliable labour contractors through LabourMatch
          </p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <Button size="lg" variant="secondary" onClick={() => navigate("/contractors")} className="text-lg px-8 py-6 shadow-2xl hover:shadow-3xl transition-all">
              <Search className="h-6 w-6 mr-2" /> Browse Contractors
            </Button>
            {showBecomeContractor && (
              <Button size="lg" variant="outline"
                className="bg-white/10 backdrop-blur-sm border-2 border-white text-white hover:bg-white hover:text-primary text-lg px-8 py-6 shadow-2xl"
                onClick={() => navigate("/register-contractor")}>
                <CheckCircle className="h-6 w-6 mr-2" /> Become a Contractor
              </Button>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}