import { VendorPayload } from "./vendor.dto"; 
import { CustomerPayload } from "./user-dto"   

export type AuthPayload = VendorPayload | CustomerPayload;