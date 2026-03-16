import { pgPool } from './connection.js';
// Create tables if they don't exist
export async function initTables() {
    const client = await pgPool.connect();
    try {
        await client.query(`
      CREATE TABLE IF NOT EXISTS bins (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        bin_route VARCHAR(255) UNIQUE NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        token VARCHAR(255) NOT NULL
      )
    `);
        await client.query(`
      CREATE TABLE IF NOT EXISTS requests (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        bin_id UUID REFERENCES bins(id) ON DELETE CASCADE,
        method VARCHAR(10) NOT NULL,
        parameters JSONB DEFAULT '{}',
        headers JSONB DEFAULT '{}',
        body_id VARCHAR(24) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
        // Create index on bin_id for faster lookups
        await client.query(`
      CREATE INDEX IF NOT EXISTS idx_requests_bin_id ON requests(bin_id)
    `);
        console.log('PostgreSQL tables initialized');
    }
    finally {
        client.release();
    }
}
// Bin operations
export const binQueries = {
    // Create a new bin
    async create(bin_route, token) {
        const result = await pgPool.query('INSERT INTO bins (bin_route, token) VALUES ($1, $2) RETURNING *', [bin_route, token]);
        return result.rows[0];
    },
    // Get bin by route
    async getByRoute(bin_route) {
        const result = await pgPool.query('SELECT * FROM bins WHERE bin_route = $1', [
            bin_route,
        ]);
        return result.rows[0] || null;
    },
    // Get bin by ID
    async getById(id) {
        const result = await pgPool.query('SELECT * FROM bins WHERE id = $1', [id]);
        return result.rows[0] || null;
    },
    // Delete a bin (cascades to requests)
    async delete(id) {
        const result = await pgPool.query('DELETE FROM bins WHERE id = $1', [id]);
        return (result.rowCount ?? 0) > 0;
    },
    // Get all bins older than a specified number of hours
    async getOlderThan(hours) {
        const result = await pgPool.query(`SELECT * FROM bins WHERE created_at < NOW() - INTERVAL '1 hour' * $1`, [hours]);
        return result.rows;
    },
};
// Request operations
export const requestQueries = {
    // Create a new request
    async create(bin_id, method, parameters, headers, body_id) {
        const result = await pgPool.query('INSERT INTO requests (bin_id, method, parameters, headers, body_id) VALUES ($1, $2, $3, $4, $5) RETURNING *', [bin_id, method, JSON.stringify(parameters), JSON.stringify(headers), body_id]);
        return result.rows[0];
    },
    // Get all requests for a bin
    async getByBinId(bin_id) {
        const result = await pgPool.query('SELECT * FROM requests WHERE bin_id = $1 ORDER BY created_at DESC', [bin_id]);
        return result.rows;
    },
    // Get a single request by ID
    async getById(id) {
        const result = await pgPool.query('SELECT * FROM requests WHERE id = $1', [id]);
        return result.rows[0] || null;
    },
    // Delete a request
    async delete(id) {
        const result = await pgPool.query('DELETE FROM requests WHERE id = $1', [id]);
        return (result.rowCount ?? 0) > 0;
    },
    // Delete all requests for a bin
    async deleteByBinId(bin_id) {
        const result = await pgPool.query('DELETE FROM requests WHERE bin_id = $1', [
            bin_id,
        ]);
        return result.rowCount ?? 0;
    },
    // Get all bins older than a specified number of hours
    async getBinsOlderThan(hours) {
        const result = await pgPool.query('SELECT * FROM bins WHERE created_at < NOW() - INTERVAL \'$1 hours\'', [hours]);
        return result.rows;
    },
};
//# sourceMappingURL=postgres.js.map