import { Restaurant } from "@/types/restaurant";
import Image from "next/image";

interface RestaurantCardProps {
  restaurant: Restaurant | null;
}

export default function RestaurantCard({ restaurant }: RestaurantCardProps) {
  if (!restaurant) {
    return (
      <div className="bg-gray-100 p-4 rounded-lg">
        No restaurant data available
      </div>
    );
  }

  return (
    <div className="bg-white shadow-lg rounded-lg overflow-hidden">
      {restaurant.image_url ? (
        <Image
          src={restaurant.image_url}
          alt={restaurant.name}
          width={300}
          height={200}
          className="w-full h-48 object-cover"
        />
      ) : (
        <div className="w-full h-48 bg-gray-200 flex items-center justify-center">
          <span className="text-gray-500">No image available</span>
        </div>
      )}
      <div className="p-4">
        <h2 className="text-xl font-bold mb-2">{restaurant.name}</h2>
        <p className="text-gray-600 mb-2">{restaurant.display_address}</p>
        <p className="text-gray-600 mb-2">{restaurant.display_phone}</p>
        <div className="flex items-center mb-2">
          <span className="text-yellow-500 mr-1">★</span>
          <span>{restaurant.rating.toFixed(1)}</span>
        </div>
        {restaurant.business_url && (
          <a
            href={restaurant.business_url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-500 hover:underline"
          >
            Visit Website
          </a>
        )}
      </div>
    </div>
  );
}
