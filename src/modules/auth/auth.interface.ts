import { Role } from "../../../generated/prisma/client";

export interface IRegisterUser {
    name: string;
    email: string;
    password?: string;
    role?: Role;
    phone?: string;
    address?: string;
}

export interface ILoginUser {
    email: string;
    password?: string;
}

export interface IAuthResponse {
    accessToken: string;
    user: {
        id: string;
        name: string;
        email: string;
        role: Role;
        phone?: string | null;
        address?: string | null;
    };
}
