import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { PlayerStatus } from '../types';

interface Props {
  playerName: string;
  status: PlayerStatus;
  score: number;
  nextPlayerName: string;
  onStartNext: () => void;
}

export default function TransitionOverlay({
  playerName,
  status,
  score,
  nextPlayerName,
  onStartNext,
}: Props) {
  let statusMessage = '';
  switch (status) {
    case 'bust':
      statusMessage = 'Busts💥';
      break;
    case 'blackjack':
      statusMessage = 'Blackjack!⭐';
      break;
    case 'standing':
      statusMessage = 'Stands';
      break;
    default:
      statusMessage = 'Finishes';
  }

  return (
    <View style={styles.overlay}>
      <Text style={styles.headerText}>
        {playerName} {statusMessage}
      </Text>
      <Text style={styles.scoreText}>Final Score: {score}</Text>

      <View style={styles.spacer} />

      <Text style={styles.nextText}>{nextPlayerName}, you're next</Text>
      
      <TouchableOpacity style={styles.button} onPress={onStartNext}>
        <Text style={styles.buttonText}>Start {nextPlayerName}'s Turn</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    backgroundColor: 'rgba(0, 0, 0, 0.75)',
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    marginVertical: 20,
    width: '90%',
  },
  headerText: {
    color: '#ffffff',
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  scoreText: {
    color: '#f0f0f0',
    fontSize: 18,
    marginBottom: 16,
  },
  spacer: {
    height: 20,
  },
  nextText: {
    color: '#f8f8f8',
    fontSize: 16,
    marginBottom: 16,
    fontStyle: 'italic',
  },
  button: {
    backgroundColor: '#3498db', // blue button for transition
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 8,
    width: '100%',
    alignItems: 'center',
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
