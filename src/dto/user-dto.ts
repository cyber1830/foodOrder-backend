import { IsEmail, IsEmpty, Length } from "class-validator";

export class CreateUserInputs {

    @IsEmail()
    email!: string;
    
    @Length(6, 20)
    phone!: string;

    @Length(8, 20)
    password!: string;
}


export interface CustomerPayload {
    _id: string;
    email: string;
    verified: string;
}

export class UserDTO {
    @IsEmail()
    email!: string;

    @Length(8, 20)
    password!: string;
}

export class EditUserProfileInput {
    @Length(4, 10)
    firstName!: string;

    @Length(4, 10)
    lastName!: string;

    @Length(100, 200)
    address!: string;
}