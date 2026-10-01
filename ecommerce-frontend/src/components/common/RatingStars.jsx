import React from 'react';
import { Star, StarHalf } from 'lucide-react';

const RatingStars = ({ rating = 0, size = 'w-4 h-4', showScore = true, count = null }) => {
  const numericRating = Math.max(0, Math.min(5, Number(rating) || 0));
  const fullStars = Math.floor(numericRating);
  const hasHalfStar = numericRating - fullStars >= 0.3 && numericRating - fullStars <= 0.8;
  const emptyStars = Math.max(0, 5 - fullStars - (hasHalfStar ? 1 : 0));

  return (
    <div className="flex items-center space-x-1.5">
      <div className="flex items-center text-amber-400">
        {[...Array(fullStars)].map((_, i) => (
          <Star key={`full-${i}`} className={`${size} fill-amber-400 text-amber-400`} />
        ))}
        {hasHalfStar && (
          <div className="relative">
            <Star className={`${size} text-slate-200 fill-slate-200`} />
            <div className="absolute inset-0 overflow-hidden w-1/2">
              <Star className={`${size} fill-amber-400 text-amber-400`} />
            </div>
          </div>
        )}
        {[...Array(emptyStars)].map((_, i) => (
          <Star key={`empty-${i}`} className={`${size} text-slate-200 fill-slate-200`} />
        ))}
      </div>
      {showScore && (
        <span className="text-xs font-semibold text-slate-700">
          {numericRating.toFixed(1)}
        </span>
      )}
      {count !== null && (
        <span className="text-xs text-slate-400">
          ({count})
        </span>
      )}
    </div>
  );
};

export default RatingStars;
