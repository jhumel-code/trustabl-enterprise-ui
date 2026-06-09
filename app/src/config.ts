/** Deployment posture for the running instance.
 *
 *  In a real build this would come from server-injected config. Flip `localOnly`
 *  to false to surface live online/offline status in the top bar instead of the
 *  privacy badge. */
export const deployment = {
  // Local-only install: no telemetry, no external calls — your code never leaves
  // your infrastructure (scans run from the local rules cache).
  localOnly: true,
}
