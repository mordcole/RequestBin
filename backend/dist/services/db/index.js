import 'dotenv/config';
import { BodyModel } from './models.js';
import { initTables, binQueries, requestQueries, } from './postgres.js';
import { initDatabases, closeDatabases, pgPool, } from './connection.js';
// Main database service
const db = {
    // Initialize databases and tables
    async init() {
        await initDatabases();
        await initTables();
    },
    // Close all connections
    async close() {
        await closeDatabases();
    },
    // Bin operations
    bins: {
        // Create a new bin
        async create(bin_route, token) {
            return binQueries.create(bin_route, token);
        },
        // Get bin by route (e.g., "abc123")
        async getByRoute(bin_route) {
            return binQueries.getByRoute(bin_route);
        },
        // Get bin by ID
        async getById(id) {
            return binQueries.getById(id);
        },
        // Delete a bin and all its requests (and their bodies from MongoDB)
        async delete(id) {
            // Get all requests for this bin to find their body_ids
            const requests = await requestQueries.getByBinId(id);
            // Delete all bodies from MongoDB in batch
            const bodyIds = requests.map(req => req.body_id);
            if (bodyIds.length > 0) {
                await BodyModel.deleteMany({ _id: { $in: bodyIds } });
            }
            // Delete the bin from PostgreSQL 
            return binQueries.delete(id);
        },
        // Delete old bins
        async deleteOlderThan(hours) {
            const bins = await binQueries.getOlderThan(hours);
            const binIds = bins.map(bin => bin.id);
            if (binIds.length === 0)
                return 0;
            await Promise.all(binIds.map(id => this.delete(id)));
            return binIds.length;
        },
    },
    // Request operations
    requests: {
        // Create a new request with body
        async create(bin_id, data) {
            // First, save body to MongoDB
            const bodyDoc = await BodyModel.create({ body: data.body });
            const body_id = bodyDoc._id.toString();
            // Then, save request to PostgreSQL with body_id reference
            const request = await requestQueries.create(bin_id, data.method, data.parameters, data.headers, body_id);
            // Return combined record
            return {
                ...request,
                body: data.body,
            };
        },
        // Get all requests for a bin (with bodies)
        async getByBinId(bin_id) {
            const requests = await requestQueries.getByBinId(bin_id);
            // Fetch all bodies from MongoDB in parallel
            const requestsWithBodies = await Promise.all(requests.map(async (req) => {
                const bodyDoc = await BodyModel.findById(req.body_id).lean();
                return {
                    ...req,
                    body: bodyDoc?.body ?? null,
                };
            }));
            return requestsWithBodies;
        },
        // Get a single request by ID (with body)
        async getById(id) {
            const request = await requestQueries.getById(id);
            if (!request)
                return null;
            const bodyDoc = await BodyModel.findById(request.body_id).lean();
            return {
                ...request,
                body: bodyDoc?.body ?? null,
            };
        },
        // Get all requests for a bin by its route (convenience method)
        async getByBinRoute(bin_route) {
            const bin = await binQueries.getByRoute(bin_route);
            if (!bin)
                return [];
            return this.getByBinId(bin.id);
        },
        // Delete a request (and its body from MongoDB)
        async delete(id) {
            const request = await requestQueries.getById(id);
            if (!request)
                return false;
            // Delete body from MongoDB
            await BodyModel.findByIdAndDelete(request.body_id);
            // Delete request from PostgreSQL
            return requestQueries.delete(id);
        },
    },
    // Raw pool access (if needed for custom queries)
    pgPool,
};
// Default export
export default db;
//# sourceMappingURL=index.js.map