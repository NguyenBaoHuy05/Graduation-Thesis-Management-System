import { Council } from './councils.entity';

export const rowToCouncil = (row: any): Council => {
  return {
    id: row.id,
    name: row.name,
    presidentId: row.president_id,
    secretaryId: row.secretary_id,
    reviewerId: row.reviewer_id,
    commissionerId: row.commissioner_id,
    memberIds: row.member_ids || [],
    periodId: row.period_id,
    date: row.date,
    time: row.time,
    room: row.room,
    topicIds: row.topic_ids || [],
    status: row.status,
    description: row.description,
    createdAt: row.created_at,
  };
};

export const rowsToCouncils = (rows: any[]): Council[] => {
  return rows.map(rowToCouncil);
};
