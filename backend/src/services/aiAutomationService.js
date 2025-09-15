import OpenAI from "openai";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_Key });

export async function enrichAuditLog(log) {
    // Prompt the AI with audit log details
    const prompt = `
You are an AI compliance assistant. Given an audit log, summarize it for regulators
and map it to the correct compliance gate.

Audit Log: ${JSON.stringify(log, null, 2)}

Return JSON:
{
  "summary": "...",
  "complianceGate": "Harvest|Packaging|Testing|Transfer|Sale|Unknown",
  "status": "pass|warn|fail"
}
  `;

  const response = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [{ role: "user", content: prompt }],
    temperature: 0.2,
  });

  let enriched;
  try {
    enriched = JSON.parse(response.choices[0].message.content);
  } catch (err) {
    throw new Error("Failed to parse AI response: " + err.message);
  }

  return { ...log, ...enriched };
}