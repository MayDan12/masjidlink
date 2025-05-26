export type EventType = "lecture" | "janazah" | "iftar" | "class" | "other";
export type RecurringFrequency = "daily" | "weekly" | "monthly";

export interface Event {
  id: string;
  title: string;
  description: string;
  date: string;
  startTime: string;
  endTime?: string;
  location: string;
  type: EventType;
  isRecurring: boolean;
  recurringFrequency?: RecurringFrequency;
  isPublic: boolean;
  maxAttendees?: string;
  rsvps: string[];
  createdAt: string;
  updatedAt: string;
  createdBy: string;
}
export interface Events {
  id: string;
  title: string;
  description: string;
  date: Date;
  startTime: string;
  endTime?: string;
  location: string;
  type: EventType;
  isRecurring: boolean;
  recurringFrequency?: RecurringFrequency;
  isPublic: boolean;
  maxAttendees?: string;
  rsvps: string[];
  createdAt: string;
  updatedAt: string;
  createdBy: string;
}
