"use server";



import { ProjectAPI } from "../../kernel/api/projects.api";

import { ClientAPI } from "../../kernel/api/clients.api";

import { TaskAPI } from "../../kernel/api/tasks.api";

import { TimeAPI } from "../../kernel/api/time.api";

import { EconomicsAPI } from "../../kernel/api/economics.api";



export const Data = {

  projects: ProjectAPI,

  clients: ClientAPI,

  tasks: TaskAPI,

  time: TimeAPI,

  economics: EconomicsAPI

};



export type DataProvider = typeof Data;

