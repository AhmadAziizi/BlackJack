import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

interface Props {
  playerName: string; // shown above the buttons so players know whose turn it is
  onHit: () => void;
  onStand: () => void;
}

export default function ActionButtons({ playerName, onHit, onStand }: Props) {
  return (
    <View style={styles.container}>
      <Text style={styles.turnLabel}>{playerName}'s turn</Text>
      <View style={styles.row}>
        <TouchableOpacity style={[styles.button, styles.hitButton]} onPress={onHit}>
          <Text style={styles.buttonText}>Hit</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.button, styles.standButton]} onPress={onStand}>
          <Text style={styles.buttonText}>Stand</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    marginVertical: 12,
  },
  turnLabel: {
    color: '#070707',
    fontSize: 15,
    marginBottom: 10,
    fontWeight: '600',
  },
  row: {
    flexDirection: 'row',
    gap: 16,
  },
  button: {
    paddingVertical: 12,
    paddingHorizontal: 36,
    borderRadius: 8,
  },
  hitButton: {
    backgroundColor: '#07f86c', // green = go / take a card
  },
  standButton: {
    backgroundColor: '#e74c3c', // red = stop / end turn
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
