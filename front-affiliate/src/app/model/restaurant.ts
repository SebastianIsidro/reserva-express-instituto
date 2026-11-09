import { RestaurantType } from "./restauranttype";
import { User } from "./user";

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
    userid: number;
    
    objRestaurantType: RestaurantType;
    objUser: User;
}