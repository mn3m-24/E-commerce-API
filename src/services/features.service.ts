import { Query } from "mongoose";

import type { APIQuery } from "../types/features.types.ts";

export default class APIFeatures<T> {
    public query;
    private queryStr;
    constructor(query: Query<T[], T>, queryStr: APIQuery) {
        this.query = query;
        this.queryStr = queryStr;
    }

    filter() {
        const nonFilterFields = ["page", "sort", "limit", "fields", "search"];

        // remove non-filter fields
        let filtered: { [key: string]: any } = {};
        for (const key in this.queryStr) {
            if (nonFilterFields.includes(key)) continue;
            filtered[key] = this.queryStr[key];
        }
        // parse gte | gt | lte | lt
        filtered = APIFeatures.parseQueryFilter(filtered);

        this.query = this.query.find(filtered);
        return this;
    }

    sort() {
        if (this.queryStr.sort) {
            const sortStr = (this.queryStr.sort as string).split(",").join(" ");
            this.query = this.query.sort(sortStr);
        }
        return this;
    }

    limitFields() {
        if (this.queryStr.fields) {
            const fields = this.queryStr.fields.split(",").join(" ");
            this.query = this.query.select(fields);
        }
        return this;
    }

    paginate() {
        const page = parseInt(this.queryStr.page || "1");
        const limit = parseInt(this.queryStr.limit || "4");
        const skip = (page - 1) * limit;
        this.query = this.query.skip(skip).limit(limit);
        return this;
    }

    search() {
        if (this.queryStr.search) {
            this.query = this.query
                .find(
                    {
                        $text: { $search: this.queryStr.search },
                    },
                    { score: { $meta: "textScore" } },
                )
                .sort({ score: { $meta: "textScore" } });
        }
        return this;
    }

    // a function to parse query string
    // {"price[gte]"": "20"} -> {"price": {"$gte": 20}}}
    private static parseQueryFilter(queryStr: object) {
        const result: { [key: string]: any } = {};
        for (const [key, val] of Object.entries(queryStr)) {
            const match = key.match(/^(.+)\[(gte|gt|lte|lt)\]$/);
            if (match) {
                const prop = match[1] as string;
                const operator = match[2] as string;

                if (!result[prop]) result[prop] = {};
                result[prop][`$${operator}`] = parseFloat(val);
            } else result[key] = val;
        }
        return result;
    }
}
