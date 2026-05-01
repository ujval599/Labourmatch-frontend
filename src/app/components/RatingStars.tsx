import { Star } from "lucide-react";

interface RatingStarsProps {
  rating: number;
  maxRating?: number;
  size?: number;
  showNumber?: boolean;
}

export function RatingStars({ 
  rating, 
  maxRating = 5, 
  size = 16,
  showNumber = true 
}: RatingStarsProps) {
  return (
    <div className="flex items-center gap-1">
      {Array.from({ length: maxRating }).map((_, index) => {
        const isFilled = index < Math.floor(rating);
        const isPartial = index === Math.floor(rating) && rating % 1 !== 0;
        
        return (
          <Star
            key={index}
            className={`${isFilled ? 'fill-yellow-400 text-yellow-400' : isPartial ? 'fill-yellow-200 text-yellow-400' : 'text-gray-300'}`}
            size={size}
          />
        );
      })}
      {showNumber && (
        <span className="text-sm text-muted-foreground ml-1">
          {rating.toFixed(1)}
        </span>
      )}
    </div>
  );
}
