/** Deployment posture for the running instance.
 *
 *  In a real build this would come from server-injected config. Flip `airGapped`
 *  to false to surface live online/offline status in the top bar instead of the
 *  reassuring air-gapped badge. */
export const deployment = {
  // Self-hosted, air-gapped install — no external calls; offline is the expected,
  // healthy state (scans run from the local rules cache).
  airGapped: true,
}
