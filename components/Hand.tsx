import React from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { PlayerState } from '../types';
import CardComponent from './Card';

interface Props {
  player: PlayerState;
  // If true, show the score; hide it while it's not this player's section
  showScore: boolean;
}

export default function Hand({ player, showScore }: Props) {
  return (
    <View style={styles.container}>
      {/* Player name */}
      <Text style={styles.name}>{player.name}</Text>

      {/* Row of cards */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.cards}
      >
        {player.hand.map((card, index) => (
          <CardComponent key={index} card={card} />
        ))}
      </ScrollView>

      {/* Score — hidden when a round hasn't started yet */}
      {showScore && (
        <Text style={styles.score}>Score: {player.score}</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 8,
    alignItems: 'center',
  },
  name: {
    color: '#f0f0f0',
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 6,
    letterSpacing: 0.5,
  },
  cards: {
    flexDirection: 'row',
    paddingVertical: 4,
  },
  score: {
    color: '#f0f0f0',
    fontSize: 13,
    marginTop: 6,
  },
});
