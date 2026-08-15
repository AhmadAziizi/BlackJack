import React, { useState } from 'react';
import {
  SafeAreaView,
  ScrollView,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { GameState, PlayerState, GamePhase, ScoreboardState, PlayerRecord } from './types';
import { buildDeck, shuffle, drawCard } from './game/deck';
import {
  calcScore,
  isBust,
  isBlackjack,
  dealerShouldHit,
  revealDealerHand,
  resolvePlayer,
} from './game/logic';
import Hand from './components/Hand';
import ActionButtons from './components/ActionButtons';
import ResultBanner from './components/ResultBanner';
import Scoreboard from './components/Scoreboard';
import TransitionOverlay from './components/TransitionOverlay';

// ─── Helpers ──────────────────────────────────────────────────────────────────

function emptyPlayer(name: string): PlayerState {
  return { name, hand: [], score: 0, status: 'standing' };
}

function emptyScoreboard(): ScoreboardState {
  return {
    player1: { wins: 0, losses: 0, pushes: 0 },
    player2: { wins: 0, losses: 0, pushes: 0 },
  };
}

// ─── Initial State ────────────────────────────────────────────────────────────

const INITIAL_STATE: GameState = {
  deck: [],
  player1: emptyPlayer('Player 1'),
  player2: emptyPlayer('Player 2'),
  dealer: emptyPlayer('Dealer'),
  phase: 'idle',
  scoreboard: emptyScoreboard(),
};

// ─── App ──────────────────────────────────────────────────────────────────────

export default function App() {
  const [game, setGame] = useState<GameState>(INITIAL_STATE);

  // ── Deal: start a new round ────────────────────────────────────────────────
  function handleDeal() {
    let deck = shuffle(buildDeck());

    const draws = Array.from({ length: 6 }, () => {
      const { card, remaining } = drawCard(deck);
      deck = remaining;
      return card;
    });

    const p1Hand = [draws[0], draws[1]];
    const p2Hand = [draws[2], draws[3]];
    const dealerHand = [draws[4], { ...draws[5], faceDown: true }];

    const p1Score = calcScore(p1Hand);
    const p2Score = calcScore(p2Hand);
    const dealerScore = calcScore(dealerHand);

    const p1Status = isBlackjack(p1Score) ? 'blackjack' : 'playing';

    // If P1 has blackjack, go to transition, else their turn
    const startPhase: GamePhase = p1Status === 'blackjack' ? 'player1Transition' : 'player1Turn';

    setGame((prev) => ({
      ...prev,
      deck,
      player1: { name: 'Player 1', hand: p1Hand, score: p1Score, status: p1Status },
      player2: { name: 'Player 2', hand: p2Hand, score: p2Score, status: 'playing' },
      dealer: { name: 'Dealer', hand: dealerHand, score: dealerScore, status: 'playing' },
      phase: startPhase,
    }));
  }

  // ── Hit: active player draws one card ─────────────────────────────────────
  function handleHit() {
    setGame((prev) => {
      const { deck, phase } = prev;
      if (phase !== 'player1Turn' && phase !== 'player2Turn') return prev;

      const isP1 = phase === 'player1Turn';
      const player = isP1 ? prev.player1 : prev.player2;

      const { card, remaining } = drawCard(deck);
      const newHand = [...player.hand, card];
      const newScore = calcScore(newHand);

      let newStatus = player.status;
      let newPhase: GamePhase = phase;

      if (isBust(newScore)) {
        newStatus = 'bust';
        newPhase = isP1 ? 'player1Transition' : 'player2Transition';
      } else if (isBlackjack(newScore)) {
        newStatus = 'blackjack';
        newPhase = isP1 ? 'player1Transition' : 'player2Transition';
      }

      const updatedPlayer: PlayerState = {
        ...player,
        hand: newHand,
        score: newScore,
        status: newStatus,
      };

      return {
        ...prev,
        deck: remaining,
        phase: newPhase,
        ...(isP1 ? { player1: updatedPlayer } : { player2: updatedPlayer }),
      };
    });
  }

  // ── Stand: active player ends their turn ───────────────────────────────────
  function handleStand() {
    setGame((prev) => {
      const { phase } = prev;
      if (phase !== 'player1Turn' && phase !== 'player2Turn') return prev;

      const isP1 = phase === 'player1Turn';
      const player = isP1 ? prev.player1 : prev.player2;

      const updatedPlayer: PlayerState = { ...player, status: 'standing' };
      const newPhase: GamePhase = isP1 ? 'player1Transition' : 'player2Transition';

      return {
        ...prev,
        phase: newPhase,
        ...(isP1 ? { player1: updatedPlayer } : { player2: updatedPlayer }),
      };
    });
  }

  // ── Transition Handlers ────────────────────────────────────────────────────
  function startPlayer2Turn() {
    setGame((prev) => {
      // If Player 2 already has blackjack from the deal, skip their turn too
      if (prev.player2.status === 'blackjack') {
        return { ...prev, phase: 'player2Transition' };
      }
      return { ...prev, phase: 'player2Turn' };
    });
  }

  function startDealerTurn() {
    setGame((prev) => runDealer({ ...prev, phase: 'dealerTurn' }));
  }

  // ── Dealer auto-play ───────────────────────────────────────────────────────
  function runDealer(state: GameState): GameState {
    let { deck } = state;

    let dealer = revealDealerHand(state.dealer);
    dealer = { ...dealer, score: calcScore(dealer.hand) };

    while (dealerShouldHit(dealer.score)) {
      const { card, remaining } = drawCard(deck);
      deck = remaining;
      const newHand = [...dealer.hand, card];
      const newScore = calcScore(newHand);
      dealer = { ...dealer, hand: newHand, score: newScore };

      if (isBust(newScore)) break;
    }

    dealer = { ...dealer, status: isBust(dealer.score) ? 'bust' : 'standing' };
    const dealerBusted = dealer.status === 'bust';

    const player1: PlayerState = {
      ...state.player1,
      status: resolvePlayer(state.player1, dealer.score, dealerBusted),
    };
    const player2: PlayerState = {
      ...state.player2,
      status: resolvePlayer(state.player2, dealer.score, dealerBusted),
    };

    // Calculate scoreboard changes
    const newScoreboard = { ...state.scoreboard };
    
    // Update Player 1 record
    if (player1.status === 'win' || player1.status === 'blackjack') newScoreboard.player1.wins++;
    else if (player1.status === 'lose' || player1.status === 'bust') newScoreboard.player1.losses++;
    else if (player1.status === 'push') newScoreboard.player1.pushes++;

    // Update Player 2 record
    if (player2.status === 'win' || player2.status === 'blackjack') newScoreboard.player2.wins++;
    else if (player2.status === 'lose' || player2.status === 'bust') newScoreboard.player2.losses++;
    else if (player2.status === 'push') newScoreboard.player2.pushes++;

    return { deck, dealer, player1, player2, phase: 'roundOver', scoreboard: newScoreboard };
  }

  // ── Scoreboard / New Round ─────────────────────────────────────────────────
  function handleNewRound() {
    // Keep the scoreboard, reset everything else
    setGame((prev) => ({
      ...INITIAL_STATE,
      scoreboard: prev.scoreboard,
    }));
  }

  function handleResetScoreboard() {
    setGame((prev) => ({
      ...prev,
      scoreboard: emptyScoreboard(),
    }));
  }

  // ─── Render ───────────────────────────────────────────────────────────────

  const phase = game.phase;
  const roundActive = phase !== 'idle';
  const isTransitioning = phase === 'player1Transition' || phase === 'player2Transition';

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.screen}>
        
        {/* Scoreboard is always visible at top */}
        <Scoreboard scoreboard={game.scoreboard} onReset={handleResetScoreboard} />

        {/* Title */}
        <Text style={styles.title}>♠ Ahmed Game♠</Text>

        {/* Show transitions if active, otherwise show the board */}
        {isTransitioning ? (
          <View style={styles.transitionContainer}>
            {phase === 'player1Transition' && (
              <TransitionOverlay
                playerName="Player 1"
                status={game.player1.status}
                score={game.player1.score}
                nextPlayerName="Player 2"
                onStartNext={startPlayer2Turn}
              />
            )}
            {phase === 'player2Transition' && (
              <TransitionOverlay
                playerName="Player 2"
                status={game.player2.status}
                score={game.player2.score}
                nextPlayerName="Dealer"
                onStartNext={startDealerTurn}
              />
            )}
          </View>
        ) : (
          <>
            {/* Dealer section */}
            {roundActive && (
              <View style={styles.section}>
                <Hand
                  player={game.dealer}
                  showScore={phase === 'roundOver'}
                />
              </View>
            )}

            {roundActive && <View style={styles.divider} />}

            {/* Player 1 section */}
            {roundActive && (
              <View style={styles.section}>
                <Hand player={game.player1} showScore />
              </View>
            )}

            {/* Player 2 section */}
            {roundActive && (
              <View style={styles.section}>
                <Hand player={game.player2} showScore />
              </View>
            )}

            {/* Hit / Stand buttons — shown only for the active player */}
            {phase === 'player1Turn' && (
              <ActionButtons
                playerName="Player 1"
                onHit={handleHit}
                onStand={handleStand}
              />
            )}
            {phase === 'player2Turn' && (
              <ActionButtons
                playerName="Player 2"
                onHit={handleHit}
                onStand={handleStand}
              />
            )}

            {/* Dealer is playing message */}
            {phase === 'dealerTurn' && (
              <Text style={styles.dealerMsg}>Dealer is playing…</Text>
            )}

            {/* Round results */}
            {phase === 'roundOver' && (
              <View style={styles.results}>
                <Text style={styles.resultsTitle}>— Results —</Text>
                <ResultBanner playerName={game.player1.name} status={game.player1.status} />
                <ResultBanner playerName={game.player2.name} status={game.player2.status} />
                {game.dealer.status === 'bust' && (
                  <ResultBanner playerName="Dealer" status="bust" />
                )}
              </View>
            )}

            {/* Deal / New Round button */}
            {(phase === 'idle' || phase === 'roundOver') && (
              <TouchableOpacity
                style={styles.dealButton}
                onPress={phase === 'idle' ? handleDeal : handleNewRound}
              >
                <Text style={styles.dealButtonText}>
                  {phase === 'idle' ? 'Deal Cards' : 'New Round'}
                </Text>
              </TouchableOpacity>
            )}
          </>
        )}

      </ScrollView>
    </SafeAreaView>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: '#145a30', // dark border ring — casino table edge
  },
  screen: {
    flexGrow: 1,
    backgroundColor: '#1a6b3a', // casino felt green
    margin: 10,
    borderRadius: 16,
    borderWidth: 6,
    borderColor: '#145a30',
    paddingVertical: 20,
    paddingHorizontal: 12,
    alignItems: 'center',
  },
  title: {
    color: '#f8f8f8',
    fontSize: 28,
    fontWeight: 'bold',
    letterSpacing: 2,
    marginBottom: 16,
  },
  transitionContainer: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    minHeight: 300,
  },
  section: {
    width: '100%',
    alignItems: 'center',
    minHeight: 40,
    marginVertical: 4,
  },
  divider: {
    width: '80%',
    height: 1,
    backgroundColor: '#145a30',
    marginVertical: 10,
  },
  dealerMsg: {
    color: '#f0f0f0',
    fontSize: 15,
    marginTop: 20,
    fontStyle: 'italic',
  },
  results: {
    width: '100%',
    marginVertical: 12,
  },
  resultsTitle: {
    color: '#f8f8f8',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 8,
  },
  dealButton: {
    marginTop: 20,
    backgroundColor: '#f39c12',
    paddingVertical: 14,
    paddingHorizontal: 48,
    borderRadius: 10,
  },
  dealButtonText: {
    color: '#1a1a1a',
    fontSize: 18,
    fontWeight: 'bold',
  },
});
