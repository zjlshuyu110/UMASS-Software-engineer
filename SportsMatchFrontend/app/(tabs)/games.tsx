import { Text, View, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Colors, Typescale } from "@/constants/theme";
import { Game } from "@/src/models/Game";
import GameCard from "@/src/components/ui/game-card";
import React, { useState, useCallback } from "react";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { getMyGamesAsync } from "@/src/apiCalls/game";
import { useFocusEffect } from "@react-navigation/native";

export default function GamesView() {
  const [games, setGames] = useState<Game[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchGames = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await getMyGamesAsync();
      
      // Transform backend games to match Game interface
      const transformedGames: Game[] = response.games.map((game: any) => {
        // Handle creator - could be object or string
        const creatorName = typeof game.creator === 'object' && game.creator.name 
          ? game.creator.name 
          : typeof game.creator === 'string' 
          ? game.creator 
          : 'Unknown';
        
        // Handle players - could be array of objects or strings
        const playersList = Array.isArray(game.players) 
          ? game.players.map((p: any) => typeof p === 'object' && p.name ? p.name : String(p))
          : [];
        
        // Handle dates
        const startAt = game.startAt ? new Date(game.startAt) : new Date();
        const createdAt = game.createdAt ? new Date(game.createdAt) : new Date();
        
        return {
          _id: game._id || game.id || '',
          name: game.name || '',
          sportType: game.sportType || '',
          creator: creatorName,
          players: playersList,
          maxPlayers: game.maxPlayers || 0,
          status: game.status || 'open',
          startAt: startAt,
          createdAt: createdAt,
          location: game.location || '',
          userRole: game.userRole || undefined,
        };
      });
      
      setGames(transformedGames);
    } catch (err) {
      console.error('Error fetching games:', err);
      setError('Failed to load games');
    } finally {
      setLoading(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      fetchGames();
    }, [fetchGames])
  );

  // Filter games by role
  const createdGames = games.filter(game => game.userRole === 'creator');
  const acceptedGames = games.filter(game => game.userRole === 'player');
  const pendingGames = games.filter(game => game.userRole === 'invited' || game.userRole === 'requester');

  function navigateToGameDetails(game: Game) {
    router.push({
      pathname: "/gameDetails" as any,
      params: {
        gameId: game._id || '',
        userRole: game.userRole || '',
      },
    });
  }

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
          <Text style={styles.headerText}>Games</Text>
          <TouchableOpacity
            style={styles.addButton}
            onPress={() => router.push("/gameDetails/newGame")}
          >
            <Ionicons name="add" size={28} color="white" />
          </TouchableOpacity>
        </View>
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <ActivityIndicator size="large" color={Colors.primaryLight} />
        </View>
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
          <Text style={styles.headerText}>Games</Text>
          <TouchableOpacity
            style={styles.addButton}
            onPress={() => router.push("/gameDetails/newGame")}
          >
            <Ionicons name="add" size={28} color="white" />
          </TouchableOpacity>
        </View>
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <Text style={{ color: 'red', marginBottom: 16 }}>{error}</Text>
          <TouchableOpacity onPress={fetchGames}>
            <Text style={{ color: Colors.primaryLight }}>Retry</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
        <Text style={styles.headerText}>Games</Text>
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => router.push("/gameDetails/newGame")}
        >
          <Ionicons name="add" size={28} color="white" />
        </TouchableOpacity>
      </View>
      <View>
        <Text
          style={styles.sectionText}
        >
          Created Games
        </Text>
        <View>
          {createdGames.length === 0 ? (
            <View style={styles.emptyBanner}>
              <Text style={styles.emptyText}>You haven't created any games yet</Text>
            </View>
          ) : (
            <ScrollView
              horizontal={true}
              style={styles.scrollContainer}
              showsHorizontalScrollIndicator={false}
            >
              {createdGames
                .reduce((rows: Game[][], _, index) => {
                  if (index % 2 === 0)
                    rows.push(createdGames.slice(index, index + 2));
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
          )}
        </View>
      </View>
      <View>
        <Text
          style={styles.sectionText}
        >
          Accepted Games
        </Text>
        <View>
          {acceptedGames.length === 0 ? (
            <View style={styles.emptyBanner}>
              <Text style={styles.emptyText}>You haven't joined any games yet</Text>
            </View>
          ) : (
            <ScrollView
              horizontal={true}
              style={styles.scrollContainer}
              showsHorizontalScrollIndicator={false}
            >
              {acceptedGames
                .reduce((rows: Game[][], _, index) => {
                  if (index % 2 === 0)
                    rows.push(acceptedGames.slice(index, index + 2));
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
          )}
        </View>
      </View>
      <View>
        <Text style={styles.sectionText}>
          Pending Games
        </Text>
        <View>
          {pendingGames.length === 0 ? (
            <View style={styles.emptyBanner}>
              <Text style={styles.emptyText}>No pending games</Text>
            </View>
          ) : (
            <ScrollView
              horizontal={true}
              style={styles.scrollContainer}
              showsHorizontalScrollIndicator={false}
            >
              {pendingGames.map((game, colIndex) => (
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
          )}
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
  emptyBanner: {
    paddingHorizontal: 12,
    paddingVertical: 16,
    marginHorizontal: 6,
    marginBottom: 16,
    backgroundColor: Colors.gray100 || '#f5f5f5',
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyText: {
    ...Typescale.bodyM,
    color: Colors.gray600 || '#666',
    textAlign: 'center',
  },
});
