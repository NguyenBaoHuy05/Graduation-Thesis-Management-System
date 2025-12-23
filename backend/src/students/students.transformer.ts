import { Student } from './students.entity';

export function rowToStudent(row: any): Student {
  return {
    id: row.id,
    code: row.code,
    name: row.name,
    email: row.email,
    phone: row.phone || undefined,
    className: row.class_name || undefined,
    major: row.major || undefined,
    gpa: row.gpa || undefined,
    creditsAccumulated: row.credits_accumulated || undefined,
  };
}

export function rowsToStudents(rows: any[]): Student[] {
  return rows.map(rowToStudent);
}
