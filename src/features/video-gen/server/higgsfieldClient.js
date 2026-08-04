/**
 * Server-only adapter to Higgsfield's REST API. Import this only from
 * app/api/video-gen/* route handlers, never from a "use client" file —
 * it reads HIGGSFIELD_API_KEY from process.env and must not ship to the
 * browser bundle.
 *
 * Request/response shapes mirror the media_upload / generate_video /
 * job status contract exposed through Higgsfield's MCP tools. Confirm the
 * exact base URL and endpoint paths against the account's Higgsfield API
 * docs before relying on this in production — they are not verified here.
 */

const API_BASE_URL = process.env.HIGGSFIELD_API_BASE_URL ?? "https://platform.higgsfield.ai";

function getApiKey() {
  const apiKey = process.env.HIGGSFIELD_API_KEY;
  if (!apiKey) {
    throw new Error("HIGGSFIELD_API_KEY is not configured");
  }
  return apiKey;
}

async function higgsfieldFetch(path, options = {}) {
  const res = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers: {
      Authorization: `Bearer ${getApiKey()}`,
      ...options.headers,
    },
  });
  if (!res.ok) {
    const body = await res.text().catch(() => "");
    throw new Error(`Higgsfield request failed (${res.status} ${path}): ${body}`);
  }
  return res.json();
}

export async function requestUploadUrl(filename, contentType) {
  return higgsfieldFetch("/v1/media/upload-url", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ filename, content_type: contentType }),
  }); // -> { media_id, upload_url }
}

export async function confirmMedia(mediaId) {
  return higgsfieldFetch(`/v1/media/${mediaId}/confirm`, { method: "POST" });
}

export async function submitVideoGeneration({ model, prompt, medias, aspectRatio, duration }) {
  return higgsfieldFetch("/v1/generate/video", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      model,
      prompt,
      medias,
      params: { aspect_ratio: aspectRatio, duration },
    }),
  }); // -> { job_id }
}

export async function getGenerationStatus(jobId) {
  return higgsfieldFetch(`/v1/jobs/${jobId}`); // -> { state, video_url, message }
}
