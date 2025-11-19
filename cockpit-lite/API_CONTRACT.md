# FRACTΛL API Contract v1.0.0

## Frozen API Contract - DO NOT CHANGE WITHOUT VERSION BUMP

### Services API

#### Projects Service
- `getProjects(): Promise<Project[]>`
- `getProjectById(id: string): Promise<Project | null>`
- `getProjectsByClient(clientId: string): Promise<Project[]>`
- `createProject(input: Partial<DBProject>): Promise<Project>`
- `updateProject(id: string, input: Partial<DBProject>): Promise<Project>`
- `deleteProject(id: string): Promise<void>`

#### Tasks Service
- `getTasks(): Promise<Task[]>`
- `getTaskById(id: string): Promise<Task | null>`
- `getTasksByProject(projectId: string): Promise<Task[]>`
- `getSubtasks(parentTaskId: string): Promise<Task[]>`
- `createTask(input: Partial<DBTask>): Promise<Task>`
- `updateTask(id: string, input: Partial<DBTask>): Promise<Task>`
- `deleteTask(id: string): Promise<void>`

#### Time Service
- `getTimeEntries(): Promise<TimeEntry[]>`
- `getTimeEntryById(id: string): Promise<TimeEntry | null>`
- `getTimeEntriesByTask(taskId: string): Promise<TimeEntry[]>`
- `createTimeEntry(input: Partial<DBTimeEntry>): Promise<TimeEntry>`
- `updateTimeEntry(id: string, input: Partial<DBTimeEntry>): Promise<TimeEntry>`
- `deleteTimeEntry(id: string): Promise<void>`

#### Economics Service
- `getEconomics(): Promise<EconomicsModel[]>`
- `getCurrentEconomics(): Promise<EconomicsModel | null>`
- `createEconomics(input: Partial<DBEconomicsModel>): Promise<EconomicsModel>`
- `updateEconomics(id: string, input: Partial<DBEconomicsModel>): Promise<EconomicsModel>`
- `deleteEconomics(id: string): Promise<void>`

### Realtime API
- `subscribe(table: string, cb: Callback): RealtimeChannel`
- `triggerLocal(table: string, payload: any): void`

### Cache API
- `cacheGet(key: string): any | null`
- `cacheSet(key: string, value: any): void`
- `cacheInvalidate(prefix: string): void`

### Offline API
- `cachePut(table: string, item: any): Promise<void>`
- `cacheBulkPut(table: string, items: any[]): Promise<void>`
- `cacheGetAll(table: string): Promise<any[]>`
- `queueMutation(type: string, entity: string, payload: any): Promise<void>`
- `drainQueue(syncFn: (entry: any) => Promise<void>): Promise<void>`

