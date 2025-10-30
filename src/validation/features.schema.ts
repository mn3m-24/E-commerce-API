import { z } from "zod";

export const featuresSchema = z
    .object({
        page: z
            .string()
            .regex(/^\d+$/, "Page query parameter must be a number"),
        sort: z.string(),
        limit: z
            .string()
            .regex(/^\d+$/, "Limit query parameter must be a number"),
        fields: z.string(),
        search: z.string(),
    })
    .partial();
