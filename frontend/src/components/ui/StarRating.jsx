import { useState } from 'react';
import { FiStar } from 'react-icons/fi';

const StarRating = ({ rating = 0, onRate, size = 20, readonly = false }) => {
    const [hoverRating, setHoverRating] = useState(0);

    return (
        <div className="flex items-center gap-0.5">
            {[1, 2, 3, 4, 5].map((star) => {
                const isFilled = star <= (hoverRating || rating);

                return (
                    <button
                        key={star}
                        type="button"
                        onClick={() => !readonly && onRate?.(star)}
                        onMouseEnter={() => !readonly && setHoverRating(star)}
                        onMouseLeave={() => !readonly && setHoverRating(0)}
                        disabled={readonly}
                        className={`transition-all duration-150 ${
                            readonly ? 'cursor-default' : 'cursor-pointer hover:scale-110'
                        }`}
                    >
                        <FiStar
                            size={size}
                            className={isFilled ? 'text-amber-400' : 'text-gray-300'}
                            fill={isFilled ? 'currentColor' : 'none'}
                        />
                    </button>
                );
            })}
        </div>
    );
};

export default StarRating;