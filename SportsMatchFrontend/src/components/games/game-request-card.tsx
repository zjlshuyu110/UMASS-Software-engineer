import { View, Text, StyleSheet, TouchableWithoutFeedback } from "react-native";
import React from "react";
import { Colors, Typescale } from "@/constants/theme";
import { Player } from "./game-player-card";
import { getSkillLevelLabel } from "@/constants/skillLevels";
import { Ionicons } from "@expo/vector-icons";

type GameRequestCardProps = {
    player: Player;
    onAccept?: () => void;
    onReject?: () => void
}

export default function GameRequestCard({ player, onAccept, onReject}: GameRequestCardProps) {
    
    return (
        <View style={styles.container}>
            <Text style={styles.playerName}>{player.name}</Text>
            <Text style={styles.playerAge}>{player.age} years</Text>
            <Text style={styles.skillLevel}>{getSkillLevelLabel(player.skillLevel)}</Text>
            <View style={{ flexDirection: 'row', gap: 8}}>
            <TouchableWithoutFeedback onPress={onAccept}>
                <View style={[styles.buttonContainer, {backgroundColor: Colors.green100}]}>
                    <Ionicons size={20} name="checkmark"/>
                </View>
            </TouchableWithoutFeedback>
            <TouchableWithoutFeedback onPress={onReject}>
                <View style={[styles.buttonContainer, {backgroundColor: Colors.red100}]}>
                    <Ionicons size={20} name="close"/>
                </View>
            </TouchableWithoutFeedback>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: 12,
    borderBottomWidth: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: 'center',
    borderBottomColor: Colors.gray300,
  },
  playerName: {
    flex: 1,
    fontSize: 14,
    fontWeight: "bold",
  },
  playerAge: {
    flex: 1,
    fontSize: 14,
    textAlign: 'center',
  },
  skillLevel: {
    flex: 1,
    ...Typescale.bodyS,
    color: Colors.gray700,
    textAlign: 'center',
  },
  buttonContainer: {
    width: 28, 
    height: 28, 
    alignItems: 'center', 
    justifyContent: 'center', 
    borderRadius: 50
  }
})