import { Text, View, StyleSheet, ScrollView, Touchable, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Colors, Typescale } from "@/constants/theme";
import { Game } from "@/src/models/Game";
import GameCard from "@/src/components/ui/game-card";
import React from "react";
import { dateTemps } from "@/src/utils/date-utils";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

export default function GamesView() {
  function navigateToGameDetails(game: Game) {
    router.push({
      pathname: "/gameDetails" as any,
      params: {
        name: game.name,
        sportType: game.sportType,
        creator: game.creator,
        players: JSON.stringify(game.players),
        maxPlayers: game.maxPlayers.toString(),
        status: game.status,
        location: game.location,
        startAt: game.startAt.toISOString(),
        createdAt: game.createdAt.toISOString(),
      },
    });
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
        <Text style={styles.headerText}>Games</Text>
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => router.push("/gameDetails/newGame")}
        >
          <Ionicons name="add" size={24} color="white" />
        </TouchableOpacity>
      </View>
      <View>
        <Text
          style={styles.sectionText}
        >
          My Games
        </Text>
        <View>
          <ScrollView
            horizontal={true}
            style={styles.scrollContainer}
            showsHorizontalScrollIndicator={false}
          >
            {gamesToday
              .reduce((rows: Game[][], _, index) => {
                if (index % 2 === 0)
                  rows.push(gamesToday.slice(index, index + 2));
                return rows;
              }, [])
              .map((pair, rowIndex) => (
                <View
                  key={rowIndex}
                  style={{ flexDirection: "column", rowGap: 12 }}
                >
                  {pair.map((game, colIndex) => (
                    <GameCard
                      key={colIndex}
                      game={game}
                      style={styles.card}
                      onPress={() => {
                        navigateToGameDetails(game);
                      }}
                    />
                  ))}
                </View>
              ))}
          </ScrollView>
        </View>
      </View>
      <View>
        <Text
          style={styles.sectionText}
        >
          Upcoming Games
        </Text>
        <View>
          <ScrollView
            horizontal={true}
            style={styles.scrollContainer}
            showsHorizontalScrollIndicator={false}
          >
            {gamesToday
              .reduce((rows: Game[][], _, index) => {
                if (index % 2 === 0)
                  rows.push(gamesToday.slice(index, index + 2));
                return rows;
              }, [])
              .map((pair, rowIndex) => (
                <View
                  key={rowIndex}
                  style={{ flexDirection: "column", rowGap: 12 }}
                >
                  {pair.map((game, colIndex) => (
                    <GameCard
                      key={colIndex}
                      game={game}
                      style={styles.card}
                      onPress={() => {
                        navigateToGameDetails(game);
                      }}
                    />
                  ))}
                </View>
              ))}
          </ScrollView>
        </View>
      </View>
      <View>
        <Text style={styles.sectionText}>
          Pending Games
        </Text>
        <View>
          <ScrollView
            horizontal={true}
            style={styles.scrollContainer}
            showsHorizontalScrollIndicator={false}
          >
            {gamesToday.map((game, colIndex) => (
              <GameCard
                key={colIndex}
                game={game}
                style={styles.card}
                onPress={() => {
                  navigateToGameDetails(game);
                }}
              />
            ))}
          </ScrollView>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 12,
    backgroundColor: 'white',
    flex: 1
  },
  headerText: {
    ...Typescale.headlineL,
    marginBottom: 12,
  },
  heading: {
    fontSize: 40,
    paddingHorizontal: 10,
  },
  card: {
    marginRight: 12,
    width: 300,
  },
  scrollContainer: {
    paddingHorizontal: 12,
    marginHorizontal: -12,
    marginBottom: 16
  },
  addButton: {
    flexDirection: "row",
    alignItems: "center",
    padding: 2,
    borderRadius: 120,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    backgroundColor: Colors.primaryLight,
  },
  sectionText: {
    ...Typescale.titleL, 
    marginBottom: 8
  },
});
const gamesToday: Game[] = [
  {
    name: "Basketball Tournament: Winner Gets $1000!",
    sportType: "Basketball",
    creator: "Nam Nguyen",
    players: [],
    maxPlayers: 24,
    status: "open",
    startAt: dateTemps[0],
    createdAt: dateTemps[0],
    location: "Rec Center Terrace"
  },
  {
    name: "Chill Pickleball Game For Beginners",
    sportType: "Pickleball",
    creator: "Sahil Kamath",
    players: [],
    maxPlayers: 8,
    status: "open",
    startAt: dateTemps[1],
    createdAt: dateTemps[1],
    location: "Rec Center Terrace"
  },
  {
    name: "Volleyball Practice",
    sportType: "Volleyball",
    creator: "Kenneth Rodrigues",
    players: [],
    maxPlayers: 18,
    status: "open",
    startAt: dateTemps[2],
    createdAt: dateTemps[2],
    location: "Rec Center Terrace"
  },
  {
    name: "Soccer Match",
    sportType: "Soccer",
    creator: "Emily Johnson",
    players: [],
    maxPlayers: 22,
    status: "open",
    startAt: dateTemps[3],
    createdAt: dateTemps[3],
    location: "Rec Center Terrace"
  },
  {
    name: "Morning Tennis Session",
    sportType: "Tennis",
    creator: "Michael Smith",
    players: [],
    maxPlayers: 4,
    status: "open",
    startAt: dateTemps[4],
    createdAt: dateTemps[4],
    location: "Rec Center Terrace"
  },
  {
    name: "Evening Badminton Fun",
    sportType: "Badminton",
    creator: "Sarah Lee",
    players: [],
    maxPlayers: 4,
    status: "open",
    startAt: dateTemps[5],
    createdAt: dateTemps[5],
    location: "Rec Center Terrace"
  },
];
