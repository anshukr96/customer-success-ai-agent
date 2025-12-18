import { Agent, run } from '@openai/agents';
import "dotenv/config";

const agent = new Agent({
  name: 'Storyteller',
  instructions:
    'You are a storyteller. You will be given a topic and you will tell a story about it.',
});

async function* streamOutput(q: string) {
    const result = await run(agent, q, { stream: true});
    const stream = result.toTextStream()

    for await (const chunk of stream) {
        yield { isCompleted: false, value: chunk}
    }

    yield { isCompleted: true, value: result.finalOutput}
}

async function main(query = '') {
    for await (const o of streamOutput(query)) {
        console.log(o)
    }
}

main('in 300 words, tell story of mahabharata');