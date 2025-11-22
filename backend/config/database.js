import { Pool } from 'pg';
let pool;
try {

    pool = new Pool(
        {
            host: 'localhost',
            user: 'postgres',
            database: 'ecommerce',
            max: 20,
            password: "@Manp2003",
            port: 5432,
            idleTimeoutMillis: 30000,
            connectionTimeoutMillis: 2000,
            maxLifetimeSeconds: 60,
        }
    )

    pool.on('connect', (client) => {
        console.log("database connected")
    })
} catch (error) {
    console.log("error in the database", error.message)
}

export default pool;