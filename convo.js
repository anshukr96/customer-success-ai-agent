import { Agent, run, tool } from "@openai/agents";
import "dotenv/config";
import z from "zod";

let sharedHistory = []

const executeSQL = tool({
    name: 'execute_sql',
    description: 'This executes the SQL Query',
    parameters: z.object({
        sql: z.string().describe('the sql query')
    }),
    execute: async function({ sql }) {
        console.log('[SQL]: Execute: ', sql)
    }
})

const sqlAgent = new Agent({
    name: 'SQL Agent',
    instructions: `You are a SQL agent that are specialized in generating SQL queries as per 
                    User Request
        Postgres Schema:
        -- User Table
        CREATE TABLE users (
            id SERIAL PRIMARY KEY,
            username VARCHAR(50) UNIQUE NOT NULL,
            email VARCHAR(255) UNIQUE NOT NULL,
            first_name VARCHAR(100) NOT NULL,
        );
        
        -- Comment Table
        CREATE TABLE comments (
            id SERIAL PRIMARY KEY,
            user_id INTEGER NOT NULL REFERENCES users(id),
            post_id INTEGER NOT NULL,
            content TEXT NOT NULL CHECK (LENGTH(content) <= 2000),
        );
    `,
    tools: [executeSQL]
})

async function main(query = '') {
    sharedHistory.push({ role: 'user', content: query})
    const result = await run(sqlAgent, sharedHistory)
    sharedHistory = result.history

    console.log('Result: ', result.finalOutput)
}

main('Hi! My name is Anshu').then(() => {
    main('Greet the user who is introducing himself.')
})