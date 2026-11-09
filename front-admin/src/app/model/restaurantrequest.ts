import { RequestStatus } from "./requeststatus";
import { RestaurantType } from "./restauranttype";
import { User } from "./user";

export interface RestaurantRequest {
    restaurantrequests_id: number;
    restaurant_id: number;
    name: string;
    description: string;
    address: string;
    opening_hours: string;
    closing_hours: string;
    pax_limit: number;
    image_url: string;
    restauranttype_id: number;
    requeststatus_id: number;
    request_date: string;
    userd_id: number;

    objUser: User;
    objRestaurantType: RestaurantType;
    objRequestStatus: RequestStatus;
}