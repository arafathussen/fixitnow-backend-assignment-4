export interface ICreateService {
    title: string;
    description: string;
    price: number;
    duration: number;
    categoryId: string;
    technicianId: string;
}

export interface IUpdateService {
    title?: string;
    description?: string;
    price?: number;
    duration?: number;
    categoryId?: string;
    technicianId?: string;
}

export interface IServiceFilterRequest {
    searchTerm?: string;
    categoryId?: string;
    technicianId?: string;
    minPrice?: number;
    maxPrice?: number;
    sortBy?: string;
    sortOrder?: "asc" | "desc";
    page?: number;
    limit?: number;
}
