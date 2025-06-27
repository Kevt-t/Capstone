export const BASE_URL = "https://www.playlab.ai/api/v1";

export async function createConversation(PROJECT_ID: string, API_KEY: string) {
  // Make a POST request to create a new conversation
  const res = await fetch(`${BASE_URL}/projects/${PROJECT_ID}/conversations`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({}),
  });
  // Handle error response
  if (!res.ok) {
    const text = await res.text();
    console.error("Conversation creation failed:", text);
    return null;
  }
  // Extract and return the conversation object
  const { conversation } = await res.json();
  return conversation;
}

export async function sendMessage(PROJECT_ID: string, API_KEY: string, conversationId: string, userPrompt: string) {
  // Send user message to an existing conversation
  const res = await fetch(`${BASE_URL}/projects/${PROJECT_ID}/conversations/${conversationId}/messages`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      input: {
        message: userPrompt,
      },
    }),
  });
  // Handle error or missing response body
  if (!res.ok || !res.body) {
    const text = await res.text();
    console.error("Message sending failed:", text);
    return null;
  }
  // Return the response body stream for processing
  return res.body;
}

export function extractDeltaFromLine(line: string): string {
  // Skip lines that don't start with "data:"
  if (!line.startsWith("data:")) return "";
  try {
    // Parse the JSON data and extract the delta field
    const json = JSON.parse(line.replace("data: ", ""));
    return json?.delta ?? "";
  } catch {
    // Ignore invalid lines
    return "";
  }
}
