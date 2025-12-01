import { View, Text, StyleSheet } from "react-native";
import React from "react";
import { Colors, Typescale } from "@/constants/theme";
import { getSkillLevelLabel } from "@/constants/skillLevels";

interface Player {
  name: string;
  age: number;
  skillLevel: number;
}

export default function GamePlayerCard({ player }: { player: Player }) {
  return (
    <View style={styles.container}>
      <Text style={styles.playerName}>{player.name}</Text>
      <Text style={styles.playerAge}>{player.age} years</Text>
      <Text style={styles.skillLevel}>{getSkillLevelLabel(player.skillLevel)}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: 12,
    borderBottomWidth: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    borderBottomColor: Colors.gray300,
  },
  playerName: {
    width: 100,
    fontSize: 14,
    fontWeight: "bold",
  },
  playerAge: {
    width: 60,
    fontSize: 14,
  },
  skillLevel: {
    ...Typescale.bodyS,
    color: Colors.gray700,
    minWidth: 100,
    textAlign: 'right',
  },
});
