import pool from "./index"
import fs from 'fs';
import path from 'path';


async function runSchema(){
    try{

        const schemaPath = path.join(__dirname, '../../src/db/schema.sql');
        const schema=fs.readFileSync(schemaPath,'utf-8');
        await pool.query(schema);
        console.log('Schema has been created successfully!');
    }catch(error){
        console.error('Error running schema:', error);
    }finally{
        await pool.end();

    }
}

runSchema();