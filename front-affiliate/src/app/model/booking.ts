import { User } from "./user";
import { Restaurant } from "./restaurant";
import { BookingStatus } from "./bookingstatus";

export interface Booking {
    booking_id: number;
    booking_date: string;
    booking_time: string;
    pax: number;
    restaurant_id: number;
    userid: number;
    bookingstatus_id: number;
    
    objRestaurant: Restaurant;
    objUser: User;
    objBookingStatus: BookingStatus;
}