require("dotenv").config();

import Anthropic from "@anthropic-ai/sdk";

const anthropic = new Anthropic();

async function main() {

const msg = await anthropic.messages.stream({
  messages: [{role: 'user', content: "Create a simple todo app"}],
  model: 'claude-3-5-sonnet-20241022',
  max_tokens: 100,
}).on('text', (text) => {
  console.log('-----',text);
});
console.log(msg);
}

main();