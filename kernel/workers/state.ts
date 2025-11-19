import { ETL_LoadProjects, ETL_LoadClients, ETL_LoadTasks, ETL_LoadTime, ETL_LoadEconomics } from "../etl/etl.engine";



const cache: Record<string, any> = {};

const ttl = 5000; // 5 seconds



export const LiveState = {

  async get(key: string) {

    const entry = cache[key];

    const now = Date.now();



    if (entry && now - entry.ts < ttl) return entry.data;



    const loader = {

      "projects": ETL_LoadProjects,

      "clients": ETL_LoadClients,

      "tasks": ETL_LoadTasks,

      "time": ETL_LoadTime,

      "economics": ETL_LoadEconomics,

    }[key];



    if (!loader) throw new Error(`Unknown LiveState key: ${key}`);



    const data = await loader();

    cache[key] = { data, ts: now };

    return data;

  },



  invalidate(key: string) {

    delete cache[key];

  }

};

