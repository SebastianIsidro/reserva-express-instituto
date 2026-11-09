import { RestaurantType } from "./restauranttype";

export interface Restaurant {
    restaurant_id: number;
    name: string;
    description: string;
    address: string;
    opening_hours: string;
    closing_hours: string;
    pax_limit: number;
    image_url: string;
    enable: string;
    restauranttype_id: number;
    
    objRestaurantType: RestaurantType;
}