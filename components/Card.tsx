import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Card as CardType } from '../types';

interface Props {
  card: CardType;
}

// Red suits get a red color, black suits stay dark
const redSuits = ['♥', '♦'];

export default function Card({ card }: Props) {
  // Show a face-down card as a plain blank rectangle
  if (card.faceDown) {
    return <View style={[styles.card, styles.faceDown]} />;
  }

  const isRed = redSuits.includes(card.suit);
  const textColor = isRed ? '#c0392b' : '#1a1a1a';

  return (
    <View style={styles.card}>
      <Text style={[styles.rank, { color: textColor }]}>{card.rank}</Text>
      <Text style={[styles.suit, { color: textColor }]}>{card.suit}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    width: 52,
    height: 72,
    backgroundColor: '#ffffff',
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#cccccc',
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 4,
    // subtle shadow so the card lifts off the green table
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3,
    elevation: 4,
  },
  faceDown: {
    backgroundColor: '#1a5276', // dark blue back pattern
  },
  rank: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  suit: {
    fontSize: 14,
  },
});
