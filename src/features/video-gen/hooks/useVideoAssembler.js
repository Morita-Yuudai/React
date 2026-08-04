"use client";

import { useCallback, useMemo, useState } from "react";
import {
  DEFAULT_TRANSFORMATION_ID,
  DEFAULT_TRANSITION_ID,
  PATTERN_CATEGORY,
  findPatternById,
  getPatternsByCategory,
} from "../constants/patterns";

const DEFAULT_MODEL = "kling3_0_turbo";
const DEFAULT_ASPECT_RATIO = "9:16";
const DEFAULT_DURATION = 5;

/**
 * Collects the selected transformation/transition patterns from
 * constants/patterns.js and assembles them into a single Higgsfield
 * generate_video request. Pure state + composition only — no fetch calls
 * here, those live in useVideoGeneration.
 */
export function useVideoAssembler({
  transformationId = DEFAULT_TRANSFORMATION_ID,
  transitionId = DEFAULT_TRANSITION_ID,
} = {}) {
  const [selectedTransformationId, setTransformationId] = useState(transformationId);
  const [selectedTransitionId, setTransitionId] = useState(transitionId);

  const transformationOptions = useMemo(
    () => getPatternsByCategory(PATTERN_CATEGORY.TRANSFORMATION),
    []
  );
  const transitionOptions = useMemo(
    () => getPatternsByCategory(PATTERN_CATEGORY.TRANSITION),
    []
  );

  const assembledPrompt = useMemo(() => {
    const transition = findPatternById(selectedTransitionId);
    const transformation = findPatternById(selectedTransformationId);
    return [transition?.instruction, transformation?.instruction].filter(Boolean).join(" ");
  }, [selectedTransformationId, selectedTransitionId]);

  const buildRequest = useCallback(
    (mediaId, overrides = {}) => ({
      model: overrides.model ?? DEFAULT_MODEL,
      prompt: assembledPrompt,
      aspectRatio: overrides.aspectRatio ?? DEFAULT_ASPECT_RATIO,
      duration: overrides.duration ?? DEFAULT_DURATION,
      medias: [{ role: "start_image", value: mediaId }],
    }),
    [assembledPrompt]
  );

  return {
    transformationOptions,
    transitionOptions,
    selectedTransformationId,
    selectedTransitionId,
    setTransformationId,
    setTransitionId,
    assembledPrompt,
    buildRequest,
  };
}
