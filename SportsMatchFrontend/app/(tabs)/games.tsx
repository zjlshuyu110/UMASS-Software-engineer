import { Text, View, StyleSheet, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Colors, Typescale } from "@/constants/theme";
import { Game } from "@/src/models/Game";
import GameCard from "@/src/components/discover/game-card";
import React from "react";
import { dateTemps } from "@/src/utils/date-utils";
import { router } from "expo-router";

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
        startAt: game.startAt.toISOString(),
        createdAt: game.createdAt.toISOString(),
      },
    });
  }

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.headerText}>Games</Text>
      <View>
        <Text
          style={{
            marginTop: 16,
            ...Typescale.bodyM,
            color: "#000000",
            ...Typescale.titleL,
          }}
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
        <Text
          style={{
            marginTop: 16,
            ...Typescale.bodyM,
            color: "#000000",
            ...Typescale.titleL,
          }}
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
          style={{
            marginTop: 16,
            ...Typescale.bodyM,
            color: "#000000",
            ...Typescale.titleL,
          }}
        >
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
    padding: 12,
  },
  headerText: {
    ...Typescale.headlineL,
    marginBottom: 12,
    color: "#881c1c",
  },
  heading: {
    fontSize: 40,
    paddingHorizontal: 10,
  },
  card: {
    marginRight: 12,
    width: 300,
    shadowColor: "#000",
    shadowOffset: { width: 1, height: 1 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
    backgroundColor: Colors.gray100,
    borderWidth: 0,
  },
  scrollContainer: {
    paddingVertical: 12,
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
  },
];
