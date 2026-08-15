import { Card, Rank, Suit } from '../types';

const SUITS: Suit[] = ['♠', '♥', '♦', '♣'];
const RANKS: Rank[] = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A'];

// Build a fresh 52-card deck
export function buildDeck(): Card[] {
  const deck: Card[] = [];
  for (const suit of SUITS) {
    for (const rank of RANKS) {
      deck.push({ suit, rank, faceDown: false });
    }
  }
  return deck;
}

// Fisher-Yates shuffle — mutates and returns the array
export function shuffle(deck: Card[]): Card[] {
  for (let i = deck.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [deck[i], deck[j]] = [deck[j], deck[i]];
  }
  return deck;
}

// Take the top card off the deck and return it alongside the remaining deck.
// We never mutate the deck directly; we return a new array each time.
export function drawCard(deck: Card[]): { card: Card; remaining: Card[] } {
  const [card, ...remaining] = deck;
  return { card, remaining };
}
