import { Agent, run, tool } from "@openai/agents";
import "dotenv/config";
import { appendFile } from "fs/promises";
import z from "zod";

const fetchAvailablePlans = tool({
    name: 'fetch_available_plans',
    description: 'fetch the available plans for internet',
    parameters: z.object({}),
    execute: async function() {
        return [
            { plan_id: 1, price_inr: 1000, speed: '30MB/s' },
            { plan_id: 2, price_inr: 2000, speed: '50MB/s' },
            { plan_id: 3, price_inr: 3000, speed: '100MB/s' },
        ]
    }
})

const processRefund = tool({
    name: 'process_refund',
    description: 'Process a refund request for a customer',
    parameters: z.object({
        customerId: z.string().describe('id of customer'),
        reason: z.string().describe('reason for refund'),
    }),
    execute: async function({ customerId, reason }) {
        await appendFile('./refunds.txt', `Refund for Customer having ID ${customerId} and reason ${reason}\n`)
        return { refundIssued: true }
    }
})

const refundAgent = new Agent({
    name: "Refund Agent",
    instructions: "You are an expert in issuing refund to customers",
    tools: [processRefund],
})

const salesAgent = new Agent({
    name: "Sales Agent",
    instructions: "You are an expert sales agent of internet broadband comapny who assit users to help them what they wanted.",
    tools: [fetchAvailablePlans, 
        refundAgent.asTool({
            toolName: 'refund_expert',
            toolDescription: 'Handles refund questions and requests.'
        })
    ],
})

async function runAgent(query = '') {
    const result = await run(salesAgent, query)
    console.log(result.finalOutput)
}

runAgent('I have a plan 399. I need a refund right now. my cus Id is 1322 because I am shifting to another place and i amde final decision. so just refund me')