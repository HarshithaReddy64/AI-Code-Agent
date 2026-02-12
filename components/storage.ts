import { User, ReviewRecord } from '../types';

const USER_KEY = 'agent_current_user';
const HISTORY_PREFIX = 'agent_history_';

export const getStoredUser = (): User | null => {
  const data = localStorage.getItem(USER_KEY);
  return data ? JSON.parse(data) : null;
};

export const setStoredUser = (user: User | null): void => {
  if (user) {
    localStorage.setItem(USER_KEY, JSON.stringify(user));
  } else {
    localStorage.removeItem(USER_KEY);
  }
};

export const getHistory = (username: string): ReviewRecord[] => {
  const data = localStorage.getItem(`${HISTORY_PREFIX}${username}`);
  return data ? JSON.parse(data) : [];
};

export const saveToHistory = (username: string, record: ReviewRecord): void => {
  const history = getHistory(username);
  const updatedHistory = [record, ...history];
  localStorage.setItem(`${HISTORY_PREFIX}${username}`, JSON.stringify(updatedHistory));
};

export const clearHistory = (username: string): void => {
  localStorage.removeItem(`${HISTORY_PREFIX}${username}`);
};