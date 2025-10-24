import { Colors, Typescale } from "@/constants/theme";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import GamePlayerCard from "@/src/components/games/game-player-card";
import { useLocalSearchParams, useRouter } from "expo-router";
import {formatISOToDayDate} from "@/src/utils/date-utils"

const { width: screenWidth, height: screenHeight } = Dimensions.get("window");

export default function GameDetails() {
  const router = useRouter();

  const game = { ...useLocalSearchParams() };

  const handleBack = () => {
    router.back();
  };
  const myGame = true;
  return (
    <SafeAreaView style={styles.container}>
      <View style={{ flexDirection: "row", alignItems: "center" }}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={handleBack}
          className="flex-1 w-full"
        >
          <Ionicons name="arrow-back" size={30} color="#881c1c" />
        </TouchableOpacity>{" "}
        <Text style={styles.headerText}>Details</Text>
      </View>
      <View style={{ margin: 12 }}>
        <View style={{ marginBottom: 12 }}>
          <Text
            style={{
              marginBottom: 12,
              color: "#000000",
              ...Typescale.headlineL,
            }}
          >
            {game.name}
          </Text>
          <View
            style={{
              flexDirection: "row",
              borderRadius: 8,
              padding: 8,
              shadowColor: Colors.gray800,
              shadowOffset: {
                width: 0,
                height: 2,
              },
              shadowOpacity: 0.3,
              shadowRadius: 4,
              elevation: 2,
              backgroundColor: Colors.gray100,
            }}
          >
            <View style={{ margin: 6 }}>
              <View style={styles.detailRow}>
                <Ionicons
                  size={Typescale.labelXXL.fontSize}
                  name="flame"
                  color={Colors.gray800}
                  style={{ marginTop: 4 }}
                ></Ionicons>
                <Text style={styles.gameDetail}>{game.sportType}</Text>
              </View>
              <View style={styles.detailRow}>
                <Ionicons
                  size={Typescale.labelXXL.fontSize}
                  name="location"
                  color={Colors.gray800}
                  style={{ marginTop: 4 }}
                ></Ionicons>
                <Text style={styles.gameDetail}>Recreation Center</Text>
              </View>
              <View style={styles.detailRow}>
                <Ionicons
                  size={Typescale.labelXXL.fontSize}
                  name="time-outline"
                  color={Colors.gray800}
                  style={{ marginTop: 4 }}
                ></Ionicons>
                <Text style={styles.gameDetail}>{formatISOToDayDate(game.startAt as string)}</Text>
              </View>
              <View style={styles.detailRow}>
                <Ionicons
                  size={Typescale.labelXXL.fontSize}
                  name="person"
                  color={Colors.gray800}
                  style={{ marginTop: 4 }}
                ></Ionicons>
                <Text style={styles.gameDetail}>
                  {game.players.length} / {game.maxPlayers}
                </Text>
              </View>
            </View>
          </View>
        </View>
        <View
          style={{
            height: screenHeight * 0.5,
            backgroundColor: Colors.gray100,
            borderRadius: 8,
            shadowColor: Colors.gray800,
            shadowOffset: {
              width: 2,
              height: 2,
            },
            shadowOpacity: 0.3,
            shadowRadius: 4,
            elevation: 2,
          }}
        >
          <View style={{ margin: 12 }}>
            <Text
              style={{
                ...Typescale.headlineM,
                color: Colors.gray900,
                marginBottom: 8,
              }}
            >
              Players
            </Text>
            <Text style={{ ...Typescale.bodyM, marginBottom: 8 }}>
              Players who have joined and their skill levels.
            </Text>
            <ScrollView style={{ maxHeight: screenHeight * 0.31 }}>
              {people.map((player: any, index: number) => (
                <GamePlayerCard key={index} player={player} />
              ))}
            </ScrollView>
            <TouchableOpacity
              style={{
                marginTop: 12,
                padding: 12,
                backgroundColor: myGame ? Colors.gray700 : Colors.primary,
                borderRadius: 8,
                alignItems: "center",
              }}
              disabled={myGame}
            >
              <Text style={styles.addPlayerButton}>Request to Join</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 12,
  },
  headerText: {
    ...Typescale.headlineL,
    color: "#881c1c",
  },
  detailRow: {
    flexDirection: "row",
    columnGap: 8,
    marginTop: 4,
  },
  backButton: {
    marginTop: 4,
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  gameDetail: {
    ...Typescale.labelXXL,
    color: Colors.gray900,
  },
  addPlayerButton: {
    ...Typescale.labelXXL,
    color: Colors.primaryWhite,
  },
});

const people = [
  { name: "Alice", age: 30, skillLevel: 1 },
  { name: "Bob", age: 25, skillLevel: 0 },
  { name: "Charlie", age: 35, skillLevel: 2 },
  { name: "David", age: 40, skillLevel: 3 },
  { name: "Eve", age: 28, skillLevel: 1 },
  { name: "Frank", age: 33, skillLevel: 2 },
  { name: "Grace", age: 27, skillLevel: 0 },
  { name: "Heidi", age: 29, skillLevel: 1 },
  { name: "Ivan", age: 31, skillLevel: 3 },
  { name: "Judy", age: 26, skillLevel: 2 },
  { name: "Kate", age: 32, skillLevel: 1 },
  { name: "Leo", age: 34, skillLevel: 0 },
];
