import { Star } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StarRatingProps {
  rating: number;
  totalStars?: number;
  size?: number;
  className?: string;
  showText?: boolean;
}

export function StarRating({ rating, totalStars = 5, size = 20, className, showText = true }: StarRatingProps) {
  const fullStars = Math.floor(rating);
  const partialStar = rating % 1;
  const emptyStars = totalStars - fullStars - (partialStar > 0 ? 1 : 0);

  return (
    <div className={cn("flex items-center gap-2", className)}>
      <div className="flex items-center">
        {[...Array(fullStars)].map((_, i) => (
          <Star key={`full-${i}`} fill="hsl(var(--secondary))" strokeWidth={0} style={{ width: size, height: size }} />
        ))}
        {partialStar > 0 && (
          <div style={{ position: 'relative', width: size, height: size }}>
            <Star style={{ width: size, height: size }} className="text-muted-foreground/50" fill="hsl(var(--muted))" strokeWidth={0} />
            <div style={{ position: 'absolute', top: 0, left: 0, overflow: 'hidden', width: `${partialStar * 100}%` }}>
              <Star style={{ width: size, height: size }} fill="hsl(var(--secondary))" strokeWidth={0} />
            </div>
          </div>
        )}
        {[...Array(emptyStars)].map((_, i) => (
          <Star key={`empty-${i}`} className="text-muted-foreground/50" fill="hsl(var(--muted))" strokeWidth={0} style={{ width: size, height: size }} />
        ))}
      </div>
      {showText && <span className="text-sm font-medium text-muted-foreground">{rating.toFixed(1)}</span>}
    </div>
  );
}
