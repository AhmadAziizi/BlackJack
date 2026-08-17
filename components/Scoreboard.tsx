import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { MoneyState } from '../types';

interface Props {
  money: MoneyState;
  onReset: () => void;
}

export default function Scoreboard({ money, onReset }: Props) {
  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <Text style={styles.title}>MONEY</Text>
        <TouchableOpacity onPress={onReset} style={styles.resetBtn}>
          <Text style={styles.resetBtnText}>Reset Money</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.playerRow}>
        <Text style={styles.playerName}>Player 1</Text>
        <Text style={styles.stats}>${money.player1}</Text>
      </View>

      <View style={styles.playerRow}>
        <Text style={styles.playerName}>Player 2</Text>
        <Text style={styles.stats}>${money.player2}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#145a30',
    width: '100%',
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  title: {
    color: '#f39c12',
    fontWeight: 'bold',
    fontSize: 14,
    letterSpacing: 1,
  },
  resetBtn: {
    backgroundColor: '#922b21',
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 4,
  },
  resetBtnText: {
    color: '#ffffff',
    fontSize: 10,
    fontWeight: 'bold',
  },
  playerRow: {
    marginBottom: 4,
  },
  playerName: {
    color: '#ffffff',
    fontSize: 13,
    fontWeight: '600',
  },
  stats: {
    color: '#d0d0d0',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
