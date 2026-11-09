import { Restaurant } from "./affiliationrequest";
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
	restauranttype_id;
	requeststatus_id: number;
	request_date: string;
	userid: number;

    objRestaurantId: Restaurant;
	objRestaurantType: RestaurantType;
	objUser: User;
	objRequestStatus: RequestStatus;
}