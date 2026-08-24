// Canlı ders yardımcıları — max 10 kişi kontrolü
export const MAX_PARTICIPANTS = 10;

export function roomNameForClass(classId: string, scheduledAt: string) {
  return `class-${classId}-${scheduledAt}`.slice(0, 80).replace(/[^a-zA-Z0-9-_]/g, "-");
}

export function canJoin(participantCount: number) {
  return participantCount < MAX_PARTICIPANTS;
}
