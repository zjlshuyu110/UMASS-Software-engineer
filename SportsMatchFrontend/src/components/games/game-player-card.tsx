import { View, Text, StyleSheet } from "react-native";
import React, { JSX } from "react";
import { Colors } from "@/constants/theme";
import { Ionicons } from "@expo/vector-icons";

interface Player {
  name: string;
  age: number;
  skillLevel: number;
}

function getSkillLevelLabel(level: number) {
  const max = 5;
  const empty = Math.max(0, Math.min(max, Math.floor(level + 1)));
  const filled = max - empty;
  const icons: JSX.Element[] = [];

  for (let i = 0; i < empty; i++) {
    icons.push(
      <Ionicons
        key={`filled-${i}`}
        name="square"
        style={{ color: Colors.primary, marginRight: 4 }}
      />
    );
  }

  for (let i = 0; i < filled; i++) {
    icons.push(
      <Ionicons
        key={`empty-${i}`}
        name="square-outline"
        style={{ color: Colors.primary, marginRight: 4 }}
      />
    );
  }

  return <View style={{ flexDirection: "row" }}>{icons}</View>;
}

export default function GamePlayerCard({ player }: { player: Player }) {
  return (
    <View style={styles.container}>
      <Text style={styles.playerName}>{player.name}</Text>
      <Text style={styles.playerAge}>{player.age} years</Text>
      {getSkillLevelLabel(player.skillLevel)}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 12,
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
});
