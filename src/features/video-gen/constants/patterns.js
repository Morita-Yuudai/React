/**
 * Instruction pattern registry for the video-gen feature.
 *
 * Each pattern is a small, reusable text fragment. useVideoAssembler picks one
 * TRANSFORMATION pattern + one TRANSITION pattern and combines their
 * `instruction` strings into a single Higgsfield prompt. Keeping patterns here
 * (instead of inline in components) lets non-engineers tune the wording
 * without touching hook/UI logic.
 */

export const PATTERN_CATEGORY = {
  TRANSFORMATION: "transformation",
  TRANSITION: "transition",
};

export const VIDEO_GEN_PATTERNS = [
  {
    id: "ai-character",
    category: PATTERN_CATEGORY.TRANSFORMATION,
    label: "AIキャラクター化",
    description: "着用者をアドベンチャーパーク風の3Dゲームキャラクターに変身させる",
    instruction:
      "Keep the same wrist, pose and camera framing as the reference photo, then transform the subject into a stylized 3D adventure-park game character (cel-shaded, adventure gear).",
  },
  {
    id: "gear-glow-up",
    category: PATTERN_CATEGORY.TRANSFORMATION,
    label: "装備グロー装飾",
    description: "身に付けている道具・リストバンドに光るAI装飾を追加",
    instruction:
      "Keep the person and pose unchanged, add glowing holographic decoration and rank-badge iconography onto the worn wristband and gear, subtle particle glow, same lighting.",
  },
  {
    id: "fantasy-armor",
    category: PATTERN_CATEGORY.TRANSFORMATION,
    label: "ファンタジー装備化",
    description: "身に付けている道具をファンタジー風の装備に変化させる",
    instruction:
      "Keep the pose and framing identical, reimagine the worn wristband and gear as ornate fantasy-adventurer equipment, same body proportions and background.",
  },
  {
    id: "neon-cyber",
    category: PATTERN_CATEGORY.TRANSFORMATION,
    label: "ネオン近未来化",
    description: "近未来的なネオン装飾で全体を演出する",
    instruction:
      "Keep the pose and composition identical, apply a near-future neon aesthetic to the worn gear and wristband with cyan/magenta rim-light accents.",
  },
  {
    id: "zoom-punch",
    category: PATTERN_CATEGORY.TRANSITION,
    label: "パンチズーム",
    description: "手首のリストバンドへ素早くズームインしてから変身する",
    instruction:
      "Start on a wide shot, rapid punch-in zoom toward the wristband on the wrist, snap-cut on the zoom peak into the transformed result.",
  },
  {
    id: "whip-pan",
    category: PATTERN_CATEGORY.TRANSITION,
    label: "ホイップパン",
    description: "TikTok風の高速ホイップパンで場面転換する",
    instruction:
      "Use a fast horizontal whip-pan blur transition, TikTok-style, to cut from the original shot into the transformed shot.",
  },
  {
    id: "glitch-cut",
    category: PATTERN_CATEGORY.TRANSITION,
    label: "グリッチカット",
    description: "デジタルグリッチで切り替える演出にする",
    instruction:
      "Transition with a brief digital glitch / RGB-split flicker before revealing the transformed result.",
  },
  {
    id: "match-cut",
    category: PATTERN_CATEGORY.TRANSITION,
    label: "マッチカット",
    description: "同一ポーズを維持したままシームレスに切り替える",
    instruction:
      "Perform a seamless match-cut, keeping the exact same pose and camera angle across the cut so the transformation feels continuous.",
  },
];

export const DEFAULT_TRANSFORMATION_ID = "ai-character";
export const DEFAULT_TRANSITION_ID = "zoom-punch";

export function getPatternsByCategory(category) {
  return VIDEO_GEN_PATTERNS.filter((pattern) => pattern.category === category);
}

export function findPatternById(id) {
  return VIDEO_GEN_PATTERNS.find((pattern) => pattern.id === id);
}
