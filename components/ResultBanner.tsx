import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { PlayerStatus } from '../types';

interface Props {
  playerName: string;
  status: PlayerStatus;
}

// Map each outcome to a human-readable label and a background color
const OUTCOME_DISPLAY: Record<PlayerStatus, { label: string; color: string }> = {
  win: { label: '🏆 Win!', color: '#1e8449' },
  lose: { label: '❌ Loss', color: '#922b21' },
  push: { label: '🤝 Push (Tie)', color: '#7d6608' },
  bust: { label: '💥 Sikildin!', color: '#922b21' },
  blackjack: { label: '⭐ Blackjack!', color: '#1a5276' },
  playing: { label: '', color: 'transparent' },
  standing: { label: '', color: 'transparent' },
};

export default function ResultBanner({ playerName, status }: Props) {
  const outcome = OUTCOME_DISPLAY[status];

  // Don't render anything while the round is still in progress
  if (!outcome.label) return null;

  return (
    <View style={[styles.banner, { backgroundColor: outcome.color }]}>
      <Text style={styles.name}>{playerName}</Text>
      <Text style={styles.result}>{outcome.label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  banner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
    marginVertical: 4,
    marginHorizontal: 16,
  },
  name: {
    color: '#ffffff',
    fontSize: 15,
    fontWeight: '600',
  },
  result: {
    color: '#ffffff',
    fontSize: 15,
    fontWeight: 'bold',
  },
});
