import { Notification } from './notifications.entity';

export const rowToNotification = (row: any): Notification => {
  return {
    id: row.id,
    title: row.title,
    content: row.content,
    date: row.date, // Assuming DB date is compatible string or Date object
    type: row.type,
    isRead: row.is_read,
    userId: row.user_id,
    message: row.message,
  };
};

export const rowsToNotifications = (rows: any[]): Notification[] => {
  return rows.map(rowToNotification);
};
