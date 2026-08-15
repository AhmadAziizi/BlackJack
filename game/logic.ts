import { Card, PlayerState, PlayerStatus } from '../types';

// ─── Card Value ───────────────────────────────────────────────────────────────

// Returns the base numeric value of a single card rank.
// Aces are returned as 11 here; we reduce them later if the hand busts.
function cardValue(rank: Card['rank']): number {
  if (['J', 'Q', 'K'].includes(rank)) return 10;
  if (rank === 'A') return 11;
  return parseInt(rank, 10);
}

// ─── Hand Score ───────────────────────────────────────────────────────────────

// Calculate the best score for a hand.
// If the total is over 21 and the hand contains an Ace counted as 11,
// we drop it to 1 (subtract 10) until we are at or below 21 or run out of aces.
export function calcScore(hand: Card[]): number {
  // Only count face-up cards so the dealer's hidden card is ignored
  const visibleCards = hand.filter((c) => !c.faceDown);

  let total = 0;
  let aces = 0; // number of aces currently counted as 11

  for (const card of visibleCards) {
    const val = cardValue(card.rank);
    total += val;
    if (card.rank === 'A') aces++;
  }

  // Reduce aces from 11 to 1 whenever we are busting
  while (total > 21 && aces > 0) {
    total -= 10;
    aces--;
  }

  return total;
}

// ─── Status Checks ────────────────────────────────────────────────────────────

export function isBust(score: number): boolean {
  return score > 21;
}

export function isBlackjack(score: number): boolean {
  return score === 21;
}

// ─── Dealer Logic ─────────────────────────────────────────────────────────────

// Reveals the dealer's hidden card (flips faceDown to false).
export function revealDealerHand(dealer: PlayerState): PlayerState {
  return {
    ...dealer,
    hand: dealer.hand.map((c) => ({ ...c, faceDown: false })),
  };
}

// Dealer must hit until their score is >= 17.
// Returns true if the dealer should draw another card.
export function dealerShouldHit(score: number): boolean {
  return score < 17;
}

// ─── Round Results ────────────────────────────────────────────────────────────

// Determine the final status for a single player given the dealer's final score.
export function resolvePlayer(
  player: PlayerState,
  dealerScore: number,
  dealerBusted: boolean,
): PlayerStatus {
  if (player.status === 'bust') return 'bust';

  if (player.score === 21 || player.status === 'blackjack') {
    if (dealerScore === 21 && !dealerBusted) return 'push';
    return 'blackjack';
  }

  if (dealerBusted) return 'win';
  if (player.score > dealerScore) return 'win';
  if (player.score < dealerScore) return 'lose';
  return 'push';
}
