// Reserve-team support for odd player counts.
//
// With an odd number of players we still build a full N-team bracket, but one
// team (the reserve) starts with a single player. That team's first match is
// locked until the feeder match - the lowest-numbered losers-bracket match -
// has been played. The feeder's loser is the first team eliminated, and one of
// its players joins the reserve team. Then the bracket continues as normal.
//
//   seat         index in teams[] where the solo reserve team is placed
//   reserveMatch the reserve team's first match (locked until the team is full)
//   feederMatch  lowest-numbered losers match; its loser donates a player
//
// The seat is chosen per bracket so the feeder match never depends on the
// reserve's own match. 3-team (5 players) has no such seat - with only two
// full teams, eliminating one of them IS the tournament - so odd counts start
// at 7 players. 7 players restructure the 4-team bracket via reserveMode: the
// 1 seed gets a bye, Match 3 is the elimination that donates, and the reserve
// enters the losers final (Match 4) as a series it must lose twice to exit.
export const RESERVE_CONFIG: Record<
  number,
  { seat: number; reserveMatch: number; feederMatch: number }
> = {
  4: { seat: 3, reserveMatch: 4, feederMatch: 3 },
  5: { seat: 0, reserveMatch: 3, feederMatch: 4 },
  6: { seat: 1, reserveMatch: 4, feederMatch: 5 },
  7: { seat: 0, reserveMatch: 5, feederMatch: 4 },
  8: { seat: 5, reserveMatch: 4, feederMatch: 5 },
  9: { seat: 0, reserveMatch: 5, feederMatch: 6 },
};
