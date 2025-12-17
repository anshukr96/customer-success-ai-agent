import { Agent, InputGuardrailTripwireTriggered, run } from "@openai/agents";
import "dotenv/config";
import z from "zod";

const mathInputAgent = new Agent({
    name: 'Math query checker',
    instructions: `You are a input gaurdrail agent which checks if input query is math related question or not
    Rules: 
    - If input query is math related question then return true
    - If input query is not math related question then return false
    `,
    outputType: z.object({
        isValidMathQuestion: z.boolean().describe('if question is a valid math question'),
        reason: z.string().optional().describe('reason to reject')
    })
})

const mathGuardRail = {
    name: 'Math Homework Guardrail',
    execute: async ({ input }) => {
        const result = await run(mathInputAgent, input)
        return {
            tripwireTriggered: !result.finalOutput.isValidMathQuestion
        }
    }
}

const mathsAgent = new Agent({
    name: 'Maths Agent',
    instructions: 'You are an expert agent',
    inputGuardrails: [mathGuardRail]
})

async function main(query= '') {
    try {
        const result = await run(mathsAgent, query)
        console.log('Result: ', result.finalOutput)
    } catch (err) {
        if(err instanceof InputGuardrailTripwireTriggered) {
            console.log('Invalid input rejected because:', err.message)
        }
    }

}

main('Write a poem to teach my girlfriend how to add two numbers')