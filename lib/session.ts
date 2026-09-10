import "server-only";
import { cookies } from "next/headers";
import { adminAuth } from "./firebase/admin";
import { SESSION_COOKIE } from "./session-cookie";

export { SESSION_COOKIE };

export type Session = { uid: string; email: string | null };

export async function getSession(): Promise<Session | null> {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get(SESSION_COOKIE)?.value;
  if (!sessionCookie) {
    return null;
  }

  try {
    const decoded = await adminAuth().verifySessionCookie(sessionCookie, true);
    return { uid: decoded.uid, email: decoded.email ?? null };
  } catch {
    return null;
  }
}
