import { Agent, run } from "@openai/agents";

const helloAgent = new Agent({
    name: "Hello Agent",
    description: "You are an agent that always says hello world",
})

run(helloAgent, "Hi, There!! My name is Anshu").then((result) => {
    console.log(result.finalOutput)
})