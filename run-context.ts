import { Agent, run, RunContext, tool } from "@openai/agents";
import "dotenv/config";
import { z } from "zod";

interface MyContext {
    userId: string;
    userName: string
}

const getUserInfoTool = tool({
    name: 'get_user_info',
    description: 'Get the user info',
    parameters: z.object({}),
    execute: async (_, ctx?: RunContext<MyContext>): Promise<string> => {
        return `UserId=${ctx?.context.userId}\nUserName=${ctx?.context?.userName}`
    }
})

const customerExpertAgent = new Agent<MyContext>({
    name: 'Customer Support Agent',
    tools: [getUserInfoTool],
    instructions: ({ context }) => {
        return `You are an expert customer support agent`
    }
})

async function main(query: string = '', ctx: MyContext) {
    const result = await run(customerExpertAgent, query, {
        context: ctx
    })
    console.log('Result: ', result.finalOutput)
}

main("Hey, What's my name?", {
    userId: '1',
    userName: 'Anshu'
})