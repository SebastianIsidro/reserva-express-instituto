import { UserType } from "./usertype";

export interface User {
    userid: number;
    name: string;
    lastname: string;
    phone: string;
    gender: string;
    birthdate: string;
    email: string;
    password_plain: string;
    password: string;
    creation_date: string;
    usertype_id: number;
    
    objUserType: UserType;
}