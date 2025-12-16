import { Agent, run, tool } from "@openai/agents";
import { RECOMMENDED_PROMPT_PREFIX } from "@openai/agents-core/extensions";
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

const receptionAgent = new Agent({
    name: "Reception Agent",
    instructions: `${RECOMMENDED_PROMPT_PREFIX} You are the customer facing agent expert in understanding what customer want and handoff to the appropriate agent.`,
    handoffDescription: `You have two agents available:
       - salesAgent: Expert in handling all queries related to plans and pricing available. Good for new customers
       - refundAgent: Expert in handling user queries for existing customer who want to issue refund
    `,
    handoffs: [salesAgent, refundAgent]
})


async function main(query = '') {
    const result = await run(receptionAgent, query)
    console.log(result.finalOutput)
    console.log(result.history)
}

// main('Hi There, can u pls tell me the best available plan for me, Show me all available plans')
main('Hi There, I am facing internet related issue, so kindly provide me a refund of id cust_123')