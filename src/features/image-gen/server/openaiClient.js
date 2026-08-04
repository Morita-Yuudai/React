/**
 * Server-only adapter to OpenAI's Images API. Import this only from
 * app/api/image-gen/* route handlers, never from a "use client" file —
 * it reads OPENAI_API_KEY from process.env and must not ship to the
 * browser bundle.
 */

const API_BASE_URL = "https://api.openai.com/v1";
const DEFAULT_MODEL = "gpt-image-1";
const DEFAULT_SIZE = "1536x1024";

function getApiKey() {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    throw new Error("OPENAI_API_KEY is not configured");
  }
  return apiKey;
}

export async function generateImage({ prompt, size = DEFAULT_SIZE, model = DEFAULT_MODEL }) {
  const res = await fetch(`${API_BASE_URL}/images/generations`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${getApiKey()}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ model, prompt, size, n: 1 }),
  });

  if (!res.ok) {
    const body = await res.text().catch(() => "");
    throw new Error(`OpenAI image generation failed (${res.status}): ${body}`);
  }

  const data = await res.json();
  const image = data.data?.[0];
  if (!image) {
    throw new Error("OpenAI returned no image data");
  }

  // gpt-image-1 returns base64; some models (e.g. dall-e-2/3) return a url instead.
  return {
    url: image.url ?? (image.b64_json ? `data:image/png;base64,${image.b64_json}` : null),
  };
}
