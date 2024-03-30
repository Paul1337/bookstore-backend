import { Request } from 'express';
import { Role } from '../enums/role.enum';

export interface UserPayloadScheme {
    username: string;
    email: string;
    id: number;
    roles: Role[];
}

export interface RequestExtended extends Request {
    user?: UserPayloadScheme;
}

export interface GoogleUserScheme {
    username: string;
    email: string;
    googleId: string;
}

export interface RequestWithGoogle extends Request {
    googleUser: GoogleUserScheme;
}
