import { Teacher } from './teachers.entity';

export const rowToTeacher = (row: any): Teacher => {
  return {
    id: row.id,
    userId: row.user_id,
    code: row.code,
    name: row.name,
    email: row.email,
    phone: row.phone,
    dateOfBirth: row.date_of_birth,
    gender: row.gender,
    title: row.title,
    titleCoefficient: row.title_coefficient,
    maxTheses: row.max_theses,
    currentTheses: row.current_theses,
    specialization: row.specialization,
  };
};

export const rowsToTeachers = (rows: any[]): Teacher[] => {
  return rows.map(rowToTeacher);
};
