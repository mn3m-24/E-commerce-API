export interface APIQuery {
    page?: string;
    sort?: string;
    limit?: string;
    fields?: string;
    [key: string]: any; // fallback for filters
    search?: string;
}
