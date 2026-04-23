export type Submission = {
  id: string;
  submittedAt: string;
  fullName: string;
  phone: string;
  stage: string;
  ideaSentence: string;
  buildingWhat: string;
  targetCustomer: string;
  problem: string;
  currentSolutions: string;
  whySwitch: string;
  doneSoFar: string[];
  bottleneck: string;
  hoursWeekly: string;
  outcome: string;
  agreed: boolean;
};

const KEY = "perpex_byob_submissions_v1";
const ADMIN_KEY = "perpex_admin_session_v1";

export function getSubmissions(): Submission[] {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(localStorage.getItem(KEY) || "[]");
  } catch {
    return [];
  }
}

export function addSubmission(s: Omit<Submission, "id" | "submittedAt">): Submission {
  const full: Submission = {
    ...s,
    id: crypto.randomUUID(),
    submittedAt: new Date().toISOString(),
  };
  const list = getSubmissions();
  list.unshift(full);
  localStorage.setItem(KEY, JSON.stringify(list));
  return full;
}

export function setAdminSession(v: boolean) {
  if (v) localStorage.setItem(ADMIN_KEY, "1");
  else localStorage.removeItem(ADMIN_KEY);
}

export function isAdminLoggedIn(): boolean {
  if (typeof window === "undefined") return false;
  return localStorage.getItem(ADMIN_KEY) === "1";
}
