export interface IUpdateTechnicianProfile {
    bio?: string;
    experienceYears?: number;
    hourlyRate?: number;
    isAvailable?: boolean;
}

export interface ITechnicianFilterRequest {
    searchTerm?: string;
    isAvailable?: boolean | string;
    minRate?: number;
    maxRate?: number;
    sortBy?: string;
    sortOrder?: "asc" | "desc";
    page?: number;
    limit?: number;
}
