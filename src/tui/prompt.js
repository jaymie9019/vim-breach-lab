import readline from "node:readline/promises";

export async function prompt(question) {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });
  const answer = await rl.question(question);
  rl.close();
  return answer.trim();
}
