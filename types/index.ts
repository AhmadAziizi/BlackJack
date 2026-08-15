// ─── Card Types ───────────────────────────────────────────────────────────────

export type Suit = '♠' | '♥' | '♦' | '♣';
export type Rank = '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9' | '10' | 'J' | 'Q' | 'K' | 'Z';

export interface Card {
  suit: Suit;
  rank: Rank;
  faceDown: boolean; // used for the dealer's hidden second card
}

// ─── Player Types ─────────────────────────────────────────────────────────────

// What happened to a player during or after the round
export type PlayerStatus =
  | 'playing'   // it is currently their turn
  | 'standing'  // they chose to stand, waiting for dealer
  | 'bust'      // their hand went over 21
  | 'blackjack' // they hit exactly 21
  | 'win'       // they beat the dealer
  | 'lose'      // dealer beat them
  | 'push';     // tie with the dealer

export interface PlayerState {
  name: string;         // "Player 1", "Player 2", or "Dealer"
  hand: Card[];         // the cards they are holding
  score: number;        // current best hand value (ace-adjusted)
  status: PlayerStatus;
}

// ─── Game Phase ───────────────────────────────────────────────────────────────

// Which stage of the round we are in
export type GamePhase =
  | 'idle'          // no round in progress — show a "Deal" button
  | 'player1Turn'   // Player 1 is deciding Hit or Stand
  | 'player1Transition' // Transition screen after P1 finishes
  | 'player2Turn'   // Player 2 is deciding Hit or Stand
  | 'player2Transition' // Transition screen after P2 finishes
  | 'dealerTurn'    // dealer auto-plays
  | 'roundOver';    // results are shown

// ─── Scoreboard ───────────────────────────────────────────────────────────────

export interface PlayerRecord {
  wins: number;
  losses: number;
  pushes: number;
}

export interface ScoreboardState {
  player1: PlayerRecord;
  player2: PlayerRecord;
}

// ─── Full Game State ──────────────────────────────────────────────────────────

export interface GameState {
  deck: Card[];
  player1: PlayerState;
  player2: PlayerState;
  dealer: PlayerState;
  phase: GamePhase;
  scoreboard: ScoreboardState;
}
