export type Calendar = {
  id: string;
  summary: string;
  description: string;
  color: string;
  publicId?: string;
};
export async function loadCalendarsList(): Promise<Calendar[]> {
  const res = await fetch("/api/c/list");
  if (res.status === 200) {
    return await res.json();
  }
  throw new Error(res.status === 401 ? "401" : "unknown");
}
