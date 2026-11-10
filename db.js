import { Pool } from "pg"

const pool = new Pool({
    host: 'localhost',
    user: 'postgres',
    password: 'senai',
    database: 'mecanicaSaep',
    port: 5432,
})

export default pool


