import { Link } from "react-router";
import { MapPin, Users, BadgeCheck, Phone, Clock } from "lucide-react";
import { Card, CardContent } from "./ui/card";
import { Button } from "./ui/button";
import { RatingStars } from "./RatingStars";
import { Badge } from "./ui/badge";

export interface Contractor {
  id: string;
  name: string;
  rating: number;
  reviews: number;
  workers: number;
  priceRange: string;
  location: string;
  // ✅ FIX 1: dono field accept karo — backend "imageUrl" bhejta hai, component "image" use karta tha
  image?: string;
  imageUrl?: string;
  verified: boolean;
  category: string;
}

interface ContractorCardProps {
  contractor: Contractor;
}

// ✅ FIX 2: Fallback image — /public folder mein rakho ya online placeholder use karo
const FALLBACK_IMAGE = "https://placehold.co/400x300/e2e8f0/94a3b8?text=No+Image";

export function ContractorCard({ contractor }: ContractorCardProps) {
  // ✅ FIX 3: imageUrl ya image — jo bhi available ho woh use karo
  const imageSrc = contractor.imageUrl || contractor.image || FALLBACK_IMAGE;

  return (
    <Card className="overflow-hidden hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 group border-0 shadow-md">
      <div className="relative h-48 bg-gradient-to-br from-gray-100 to-gray-200 overflow-hidden">
        <img
          src={imageSrc}
          alt={contractor.name}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
          onError={(e) => {
            // ✅ FIX 4: Image load fail ho toh placeholder dikho
            (e.target as HTMLImageElement).src = FALLBACK_IMAGE;
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
        {contractor.verified && (
          <Badge className="absolute top-3 right-3 bg-primary shadow-lg">
            <BadgeCheck className="h-3 w-3 mr-1" />
            Verified
          </Badge>
        )}
        <Badge className="absolute bottom-3 left-3 bg-green-500 text-white shadow-lg">
          <Clock className="h-3 w-3 mr-1" />
          Available Now
        </Badge>
      </div>
      <CardContent className="p-5">
        <div className="space-y-4">
          <div>
            <h3 className="font-bold text-lg mb-2 group-hover:text-primary transition-colors">{contractor.name}</h3>
            <div className="flex items-center justify-between mb-2">
              <RatingStars rating={contractor.rating} size={16} />
              <p className="text-xs text-muted-foreground">
                ({contractor.reviews} reviews)
              </p>
            </div>
          </div>

          <div className="space-y-2 text-sm">
            <div className="flex items-center text-muted-foreground">
              <Users className="h-4 w-4 mr-2 text-primary" />
              <span className="font-medium">{contractor.workers} workers</span>
            </div>
            <div className="flex items-center text-muted-foreground">
              <MapPin className="h-4 w-4 mr-2 text-primary" />
              <span>{contractor.location}</span>
            </div>
          </div>

          <div className="pt-3 border-t border-border">
            <div className="flex items-center justify-between mb-3">
              <div>
                <p className="text-xs text-muted-foreground">Starting from</p>
                <p className="font-bold text-lg text-primary">{contractor.priceRange}</p>
                <p className="text-xs text-muted-foreground">per worker/day</p>
              </div>
            </div>
            <div className="flex gap-2">
              <Link to={`/contractor/${contractor.id}`} className="flex-1">
                <Button size="sm" className="w-full shadow-sm">View Details</Button>
              </Link>
              <Button size="sm" variant="outline" className="shadow-sm hover:bg-green-50">
                <Phone className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}