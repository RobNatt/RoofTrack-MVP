export type InspectionStatus = 'scheduled' | 'completed' | 'canceled';

export interface Inspection {
  id: string;
  lead_id: string;
  company_id: string;
  user_id: string;
  scheduled_date: string;
  scheduled_time: string;
  status: InspectionStatus;
  notes?: string;
  created_at: string;
  // Joined data from leads table
  lead_name?: string;
  lead_address?: string;
}