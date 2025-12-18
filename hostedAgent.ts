import { Agent, hostedMcpTool, run } from '@openai/agents';
import 'dotenv/config';

const agent = new Agent({
  name: 'MCP Assistant',
  instructions: 'You must always use the MCP tools to answer questions.',
  tools: [
    hostedMcpTool({
      serverLabel: 'gitmcp',
      serverUrl: 'https://gitmcp.io/openai/codex',
    }),
  ],
});

async function main(q: string) {
  const result = await run(agent, q);
  console.log(result.finalOutput);
}

main('What is this repo about?');