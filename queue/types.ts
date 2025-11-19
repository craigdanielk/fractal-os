import { NormalizedEvent } from "../kernel/events/types";



export type QueueRecord = NormalizedEvent & {

  retries: number;

};

