export interface DBProject {

  id: string;

  tenant_id: string;

  name: string;

  description?: string;

  status?: string;

  priority?: string;

  progress?: number;

  budget?: number;

  actual_cost?: number;

  start_date?: string;

  target_end_date?: string;

  actual_end_date?: string;

  updated_at: string;

}

