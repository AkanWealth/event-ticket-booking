const waitingLists: { [key: number]: number[] } = {};

export function addToWaitingList(eventId: number, userId: number): void {
  if (!waitingLists[eventId]) {
    waitingLists[eventId] = [];
  } 
  waitingLists[eventId].push(userId);
}

export function getNextFromWaitingList(eventId: string): number | null {
  return waitingLists[eventId]?.shift() || null;
}

export function getWaitingListCount(eventId: number): number {
  return waitingLists[eventId]?.length || 0;
}
