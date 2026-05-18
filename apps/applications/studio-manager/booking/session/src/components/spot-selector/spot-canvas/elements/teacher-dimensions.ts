// Legacy parity: saas-legacy `COACH_CANVAS_AVATAR_DEFAULT_SIZE` (80). The
// teacher avatar renders at `(data.height ?? base) * coachHeight` where
// coachHeight is a scale factor from the room blueprint.
export const COACH_AVATAR_BASE_SIZE = 80;

/** Coach data the teacher element needs to render. Kept in a UI-free module
 *  so non-React consumers (data hooks, view-box) can import it. */
export type TeacherCoach = {
  id: number;
  name: string;
  firstname?: string | null;
  photo?: string | null;
};
