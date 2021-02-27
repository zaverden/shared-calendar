export type ShacalEvent = {
  publicId: string;
  owned: boolean;
  summary: string;
  description: string;
  start: string;
  end: string;
  location: string;
  attendees?: Array<{
    email: string;
    status: "declined" | "tentative" | "accepted";
  }>;
};

export type Shacal = {
  owned: boolean;
  canAdd: boolean;
  addPermissionGrantedTo?: string[];
  events: ShacalEvent[];
};
export async function loadShacal(publicId: string): Promise<Shacal> {
  const res = await fetch(`/api/c/s/${publicId}`);
  if (res.status === 200) {
    return await res.json();
  }
  throw new Error(res.status.toString());
}
