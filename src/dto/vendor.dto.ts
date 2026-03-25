export interface VendorDTO {
    name: string;
    email: string;
    phone: string;
    address: string;
    pincode: string;
    foodType: string[];
    password: string;
};

export interface VendorLoginDTO {
    email: string;
    password: string;
};


export interface VendorPayload {
    _id: string;
    name?: string;
    email?: string;
    foodTypes?: string;
};

export interface VendorUpdateDTO {
    name: string;
    address: string;
    phone: string;
    foodType: [string];
}

