export const DRAW_TRAVEL_MS = 650;

// Compare contents, not array identity or count: duplicate delivery is not a draw.
export const getAddedDraws = (previous: readonly number[], next: readonly number[]) =>
  next.filter(number => !previous.includes(number));

export const getDrawTiming = (duration: number, reducedMotion = false) => {
  const holdMs = duration * 1000;
  const travelMs = reducedMotion ? 1 : DRAW_TRAVEL_MS;
  const totalMs = holdMs + travelMs * 2;
  return { holdMs, travelMs, totalMs, holdStart: travelMs / totalMs, holdEnd: (travelMs + holdMs) / totalMs };
};