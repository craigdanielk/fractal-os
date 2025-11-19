import { NormalizedEvent, FractalEvent } from "./types";

import { normalizeDelta } from "./normalize";

import { enqueueEvent } from "../../queue/events";



export function ingest(event: FractalEvent) {

  const normalized = normalizeDelta(event);

  if (!normalized) return;

  enqueueEvent(normalized);

}

