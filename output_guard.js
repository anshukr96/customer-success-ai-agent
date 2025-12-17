import { Agent, run } from "@openai/agents";
import "dotenv/config";
import z from "zod";


const sqlGuardrailAgent = new Agent({
    name: 'SQL Guardrail',
    instructions: 'Check if query is safe to execute. The query should be read only and do no modify, delete or drop any table',
    outputType: z.object({
        reason: z.string().optional().describe('reason to reject'),
        isSafe: z.boolean().describe('if query is safe to execute')
    })
})

const sqlGuardrail = {
    name: 'SQL Guard',
    async execute({ agentOutput }) {
        const result = await run(sqlGuardrailAgent, agentOutput.sqlQuery)
        return {
            tripwireTriggered: !result.finalOutput.isSafe,
            outputInfo: !result.finalOutput.reason
        }

    }
}

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
            last_name VARCHAR(100) NOT NULL,
            age INTEGER CHECK (age >= 13 AND age <= 120),
            is_active BOOLEAN DEFAULT true,
            role VARCHAR(20) DEFAULT 'user' CHECK (role IN ('admin', 'moderator', 'user')),
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            profile_picture_url TEXT,
            bio TEXT
        );
        
        -- Comment Table
        CREATE TABLE comments (
            id SERIAL PRIMARY KEY,
            user_id INTEGER NOT NULL REFERENCES users(id),
            post_id INTEGER NOT NULL,
            content TEXT NOT NULL CHECK (LENGTH(content) <= 2000),
            is_edited BOOLEAN DEFAULT false,
            is_deleted BOOLEAN DEFAULT false,
            likes_count INTEGER DEFAULT 0 CHECK (likes_count >= 0),
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            parent_comment_id INTEGER REFERENCES comments(id)
        );
    `,
    outputType: z.object({ 
        sqlQuery: z.string().optional().describe('SQL query')
    }),
    outputGuardrails: [sqlGuardrail]
})

async function main(query = '') {
    const result = await run(sqlAgent, query)
    console.log('Result: ', result.finalOutput.sqlQuery)
}

main('delete all the coments')