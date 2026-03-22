export default async function handler(req, res) {
  const { message, mode } = JSON.parse(req.body);

  let systemPrompt = {
    chat: "You are a helpful assistant.",
    research: "You are a deep research AI. Give structured, detailed answers.",
    study: "You are a strict teacher for JEE/NDA. Explain step-by-step."
  }[mode];

  try {
    const r = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.OPENROUTER_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "openai/gpt-4o-mini",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: message }
        ]
      })
    });

    const data = await r.json();

    res.status(200).json({
      reply: data.choices?.[0]?.message?.content || "No response"
    });

  } catch (e) {
    res.status(500).json({ reply: "Server error" });
  }
}
