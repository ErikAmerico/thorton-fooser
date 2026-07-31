import { useEffect, useMemo, useRef, useState } from "react";
import { PlayerFromDB, Team } from "../../../types";

const SPIN_MS = 2000; // how long each name rattles before locking
const SETTLE_MS = 500; // pause after a name locks - long enough for the
// team-complete pop to play out before the next team starts drawing

/**
 * Zero-width markers prefixed onto a player's name while it is spinning or has
 * just landed. renderTeamName passes them through untouched, and TeamSlot
 * strips them back off - so the reveal styles individual names without any of
 * the 174 call sites in the bracket components having to pass extra props.
 */
export const SPIN_MARK = "⁣"; // invisible separator - name is rattling
export const LAND_MARK = "⁤"; // invisible plus - team just completed, pop
export const HOLD_MARK = "⁠"; // word joiner - name landed, team still drawing

// The reel slows as it approaches the lock, so names are readable and the
// landing feels like a slot machine settling rather than an abrupt stop.
const FIRST_TICK_MS = 130; // opening pace - quick but legible
const LAST_TICK_MS = 420; // final few names linger

/** Delay before the next name flips, easing from fast to slow. */
function tickDelay(progress: number) {
  const eased = progress * progress; // slow down hard near the end
  return FIRST_TICK_MS + (LAST_TICK_MS - FIRST_TICK_MS) * eased;
}

/**
 * Slot-machine reveal for freshly generated teams.
 *
 * Returns a stand-in `teams` array that fills one player at a time - seed 1
 * player 1, seed 1 player 2, seed 2 player 1, and so on. The slot currently
 * spinning shows a rapidly changing name from the selected roster; slots not
 * yet reached are blank.
 *
 * It returns the same Team[] shape the brackets already consume, so no bracket
 * component changes - they keep calling renderTeamName(teamN).
 *
 * `enabled: false` (history, or a bracket restored from localStorage) returns
 * the real teams immediately.
 */
export function useTeamReveal(
  finalTeams: Team[] | null,
  pool: PlayerFromDB[],
  enabled: boolean
) {
  // one entry per player slot, in reveal order
  const slots = useMemo(() => {
    if (!finalTeams) return [];
    const out: { team: number; index: number }[] = [];
    finalTeams.forEach((team, t) =>
      team.forEach((_, i) => out.push({ team: t, index: i }))
    );
    return out;
  }, [finalTeams]);

  // how many slots have locked; -1 means "not revealing"
  const [locked, setLocked] = useState(-1);
  const [spinFrame, setSpinFrame] = useState(0);
  // brief window after the last name lands, so the final team can pop too
  const [finishing, setFinishing] = useState(false);
  // Slot count is frozen when the draw starts. The 7-player reserve team gains
  // a second player mid-tournament, which would otherwise grow slots.length
  // and make a finished reveal look unfinished - restarting the whole draw.
  const totalSlots = useRef(0);
  const active = locked >= 0 && locked < totalSlots.current;

  // The reveal runs at most once per bracket. Teams can legitimately change
  // afterwards - the 7-player reserve gains a donor from the first eliminated
  // team - and that must NOT restart the draw or reshuffle anything on screen.
  const hasRun = useRef(false);

  useEffect(() => {
    if (!enabled) {
      // a bracket restored from localStorage, or history
      hasRun.current = false;
      setLocked(-1);
      return;
    }
    if (!finalTeams || pool.length === 0 || slots.length === 0) return;
    if (hasRun.current) return;
    hasRun.current = true;
    totalSlots.current = slots.length;
    setLocked(0);
    setSpinFrame(0);
    setFinishing(false);
  }, [finalTeams, enabled, pool.length, slots.length]);

  // hold the last team's pop briefly before handing back the plain teams
  useEffect(() => {
    if (locked < 0 || locked < totalSlots.current) return;
    setFinishing(true);
    const t = setTimeout(() => setFinishing(false), 700);
    return () => clearTimeout(t);
  }, [locked]);

  // The reel reschedules itself with a growing delay so it decelerates into
  // the lock; a separate timeout ends the spin and moves to the next slot.
  useEffect(() => {
    if (!active) return;
    const spinMs = SPIN_MS;
    let reel: ReturnType<typeof setTimeout>;
    const startedAt = Date.now();

    const step = () => {
      const progress = Math.min(1, (Date.now() - startedAt) / spinMs);
      setSpinFrame((f) => f + 1);
      reel = setTimeout(step, tickDelay(progress));
    };
    reel = setTimeout(step, tickDelay(0));

    const lock = setTimeout(() => {
      setLocked((n) => n + 1);
      setSpinFrame(0);
    }, spinMs + SETTLE_MS);

    return () => {
      clearTimeout(reel);
      clearTimeout(lock);
    };
  }, [active, locked]);

  /** Jump straight to the finished teams. */
  const skip = () => setLocked(totalSlots.current);

  const teams = useMemo(() => {
    if (!finalTeams) return null;
    if (locked < 0) return finalTeams;

    // one step past the last slot: every name is in, flash the final team
    if (locked >= totalSlots.current) {
      const lastTeam = slots[totalSlots.current - 1]?.team ?? -1;
      if (!finishing) return finalTeams;
      return finalTeams.map((team, t) =>
        t === lastTeam
          ? team.map((p) => ({ ...p, name: LAND_MARK + p.name }))
          : team
      );
    }

    // The pop belongs to the TEAM, not each player: a team stays lit from its
    // first name landing until its last one does, then flashes once. Work out
    // which team just completed, and which is mid-draw.
    const teamOf = (slotIdx: number) => slots[slotIdx]?.team ?? -1;
    const drawingTeam = teamOf(locked);
    // the team that finished on the previous lock (its last slot was locked-1)
    const justFinishedTeam =
      locked > 0 && teamOf(locked - 1) !== drawingTeam ? teamOf(locked - 1) : -1;

    let slotIdx = -1;
    return finalTeams.map((team, t) =>
      team.map((player) => {
        slotIdx++;
        if (slotIdx < locked) {
          // this team completed a moment ago - flash the whole team
          if (t === justFinishedTeam)
            return { ...player, name: LAND_MARK + player.name };
          // an earlier name on the team still being drawn stays lit
          if (t === drawingTeam)
            return { ...player, name: HOLD_MARK + player.name };
          return player; // settled
        }
        if (slotIdx > locked) return { ...player, name: "" }; // not reached
        // spinning: cycle the roster, offset so each slot looks different
        const spun = pool[(spinFrame + slotIdx * 3) % pool.length];
        return { ...spun, name: SPIN_MARK + spun.name };
      })
    );
  }, [finalTeams, slots, locked, spinFrame, pool]);

  // which team/player slot is mid-spin, so the UI can highlight that cell
  const spinningAt = active ? slots[locked] : null;

  return { teams, isRevealing: active, skip, spinningAt };
}
