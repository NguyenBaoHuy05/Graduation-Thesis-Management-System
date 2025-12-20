import { ThesisPeriod, PeriodMilestone } from './thesisPeriods.entity';
import { Database } from '../types/database.types';

type ThesisPeriodRow = Database['public']['Tables']['thesis_periods']['Row'];

export function rowToThesisPeriod(row: ThesisPeriodRow): ThesisPeriod {
  return {
    id: row.id,
    name: row.name,
    academic_year: row.academic_year,
    start_date: row.start_date,
    end_date: row.end_date,
    status: row.status,
    max_group_size: row.max_group_size || 0,
    milestones: (row.milestones as unknown as PeriodMilestone[]) || [],
    created_at: row.created_at,
  };
}

export function rowsToThesisPeriods(
  rows: ThesisPeriodRow[] | null | undefined,
): ThesisPeriod[] {
  if (!rows) return [];
  return rows.map(rowToThesisPeriod);
}

export default {
  rowToThesisPeriod,
  rowsToThesisPeriods,
};
