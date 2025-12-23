import { FormTemplate } from './formTemplates.entity';
import { Database } from '../types/database.types';

type FormTemplateRow = Database['public']['Tables']['form_templates']['Row'];

export function rowToFormTemplate(row: FormTemplateRow): FormTemplate {
  return {
    id: row.id,
    name: row.name,
    description: row.description || undefined,
    fileUrl: row.file_url,
    type: row.type,
  };
}

export function rowsToFormTemplates(
  rows: FormTemplateRow[] | null | undefined,
): FormTemplate[] {
  if (!rows) return [];
  return rows.map(rowToFormTemplate);
}

export default {
  rowToFormTemplate,
  rowsToFormTemplates,
};
