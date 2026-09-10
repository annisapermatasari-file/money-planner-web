// Kept in its own file with no other imports so Edge middleware can read the
// cookie name without pulling the Node-only Firebase Admin SDK into its bundle.
export const SESSION_COOKIE = "session";
