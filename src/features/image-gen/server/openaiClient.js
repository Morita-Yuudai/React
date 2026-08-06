/**
 * Server-only adapter to OpenAI's Images API. Import this only from
 * app/api/image-gen/* route handlers, never from a "use client" file —
 * it reads OPENAI_API_KEY from process.env and must not ship to the
 * browser bundle.
 */

const API_BASE_URL = "https://api.openai.com/v1";
const DEFAULT_MODEL = "gpt-image-1-mini";
const DEFAULT_SIZE = "1536x1024";

function escapeXml(value) {
  return value.replace(/[&<>"']/g, (char) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&apos;",
  }[char]));
}

// Deterministic gradient placeholder so the agent flow (prompt -> new
// background state) can be demoed end-to-end before OPENAI_API_KEY is
// provisioned for a given environment.
function mockImage(prompt) {
  const hash = [...prompt].reduce((acc, char) => (acc * 31 + char.charCodeAt(0)) % 360, 7);
  const hueA = hash;
  const hueB = (hash + 80) % 360;
  const label = prompt.length > 60 ? `${prompt.slice(0, 57)}...` : prompt;

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1536" height="1024">
    <defs>
      <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stop-color="hsl(${hueA},70%,35%)" />
        <stop offset="100%" stop-color="hsl(${hueB},70%,18%)" />
      </linearGradient>
    </defs>
    <rect width="100%" height="100%" fill="url(#g)" />
    <text x="50%" y="48%" fill="white" font-family="sans-serif" font-size="42" text-anchor="middle" dominant-baseline="middle">${escapeXml(label)}</text>
    <text x="50%" y="58%" fill="white" fill-opacity="0.6" font-family="sans-serif" font-size="22" text-anchor="middle">MOCK PREVIEW (OPENAI_API_KEY not set)</text>
  </svg>`;

  return `data:image/svg+xml;base64,${Buffer.from(svg).toString("base64")}`;
}

export async function generateImage({ prompt, size = DEFAULT_SIZE, model = DEFAULT_MODEL }) {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    return { url: mockImage(prompt) };
  }

  const res = await fetch(`${API_BASE_URL}/images/generations`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
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
