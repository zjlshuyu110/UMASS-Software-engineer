import { Colors, Typescale } from "@/constants/theme";
import { Ionicons } from "@expo/vector-icons";
import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import GamePlayerCard from "@/src/components/games/game-player-card";
import { useLocalSearchParams, useRouter } from "expo-router";
import {formatISOToDayDate} from "@/src/utils/date-utils";
import { getGameByIdAsync, sendRequestAsync, acceptInviteAsync } from "@/src/apiCalls/game";

const { width: screenWidth, height: screenHeight } = Dimensions.get("window");

interface GameData {
  _id: string;
  name: string;
  sportType: string;
  location: string;
  startAt: string;
  maxPlayers: number;
  players: any[];
  userRole?: 'creator' | 'player' | 'invited' | 'requester';
}

interface PlayerData {
  name: string;
  age: number;
  skillLevel: number;
}

export default function GameDetails() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const gameId = params.gameId as string;
  const initialUserRole = params.userRole as string;

  const [game, setGame] = useState<GameData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [requesting, setRequesting] = useState(false);
  const [actionCompleted, setActionCompleted] = useState(false);

  useEffect(() => {
    if (gameId) {
      fetchGameData();
    }
  }, [gameId]);

  const fetchGameData = async () => {
    try {
      setLoading(true);
      setError(null);
      setActionCompleted(false);
      const response = await getGameByIdAsync(gameId);
      setGame(response.game);
    } catch (err) {
      console.error('Error fetching game:', err);
      setError('Failed to load game details');
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    router.back();
  };

  const handleRequestToJoin = async () => {
    try {
      setRequesting(true);
      await sendRequestAsync(gameId);
      setActionCompleted(true);
      Alert.alert("Success", "Request sent successfully!", [
        { text: "OK", onPress: () => fetchGameData() }
      ]);
    } catch (err: any) {
      Alert.alert("Error", err.message || "Failed to send request");
    } finally {
      setRequesting(false);
    }
  };

  const handleAcceptInvite = async () => {
    try {
      setRequesting(true);
      await acceptInviteAsync(gameId);
      setActionCompleted(true);
      Alert.alert("Success", "Invitation accepted! You've joined the game.", [
        { text: "OK", onPress: () => fetchGameData() }
      ]);
    } catch (err: any) {
      Alert.alert("Error", err.message || "Failed to accept invitation");
    } finally {
      setRequesting(false);
    }
  };

  // Transform players data with skill levels
  const transformPlayers = (): PlayerData[] => {
    if (!game || !game.players) return [];
    
    return game.players.map((player: any) => {
      // Check if player has the sport in their interests
      const sportInterests = player.sport_interests || {};
      const skillLevel = sportInterests[game.sportType] || 1; // Default to Beginner (1)
      
      return {
        name: player.name || 'Unknown',
        age: player.age || 0,
        skillLevel: skillLevel
      };
    });
  };

  const players = transformPlayers();
  const userRole = game?.userRole || initialUserRole;
  const isJoined = userRole === 'creator' || userRole === 'player';
  const isRequestPending = userRole === 'requester';
  const isInvited = userRole === 'invited';
  
  // Determine button text and state
  const getButtonText = () => {
    if (isJoined) return 'Already Joined';
    if (actionCompleted && isInvited) return 'Invitation Accepted';
    if (actionCompleted && !isInvited) return 'Request Sent';
    if (isRequestPending) return 'Request Pending';
    if (isInvited) return 'Accept Invite';
    return 'Request to Join';
  };

  const getButtonColor = () => {
    if (isJoined || isRequestPending || actionCompleted) {
      return Colors.gray700;
    }
    return Colors.primary;
  };

  const isButtonDisabled = () => {
    return isJoined || isRequestPending || requesting || actionCompleted;
  };

  const handleButtonPress = () => {
    if (isInvited) {
      handleAcceptInvite();
    } else {
      handleRequestToJoin();
    }
  };
  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 16, paddingHorizontal: 12, paddingTop: 12 }}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={handleBack}
            className="flex-1 w-full"
          >
            <Ionicons name="arrow-back" size={24} />
          </TouchableOpacity>
          <Text style={styles.headerText}>Details</Text>
        </View>
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <ActivityIndicator size="large" color={Colors.primaryLight} />
        </View>
      </SafeAreaView>
    );
  }

  if (error || !game) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 16, paddingHorizontal: 12, paddingTop: 12 }}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={handleBack}
            className="flex-1 w-full"
          >
            <Ionicons name="arrow-back" size={24} />
          </TouchableOpacity>
          <Text style={styles.headerText}>Details</Text>
        </View>
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <Text style={{ color: 'red', marginBottom: 16 }}>{error || 'Game not found'}</Text>
          <TouchableOpacity onPress={fetchGameData}>
            <Text style={{ color: Colors.primaryLight }}>Retry</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 16, paddingHorizontal: 12, paddingTop: 12 }}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={handleBack}
          className="flex-1 w-full"
        >
          <Ionicons name="arrow-back" size={24} />
        </TouchableOpacity>
        <Text style={styles.headerText}>Details</Text>
      </View>
      <ScrollView style={styles.scrollView}>
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
          <View style={styles.cardContainer}>
            <View style={styles.detailRow}>
              <Ionicons
                size={Typescale.labelXXL.fontSize}
                name="flame"
                color={Colors.gray700}
              ></Ionicons>
              <Text style={styles.gameDetail}>{game.sportType}</Text>
            </View>
            <View style={styles.detailRow}>
              <Ionicons
                size={Typescale.labelXXL.fontSize}
                name="location"
                color={Colors.gray700}
                style={{ marginTop: 4 }}
              ></Ionicons>
              <Text style={styles.gameDetail}>{game.location}</Text>
            </View>
            <View style={styles.detailRow}>
              <Ionicons
                size={Typescale.labelXXL.fontSize}
                name="time"
                color={Colors.gray700}
                style={{ marginTop: 4 }}
              ></Ionicons>
              <Text style={styles.gameDetail}>{formatISOToDayDate(game.startAt)}</Text>
            </View>
            <View style={styles.detailRow}>
              <Ionicons
                size={Typescale.labelXXL.fontSize}
                name="person"
                color={Colors.gray700}
                style={{ marginTop: 4 }}
              ></Ionicons>
              <Text style={styles.gameDetail}>
                {game.players.length} / {game.maxPlayers}
              </Text>
            </View>
            <TouchableOpacity
              style={{
                marginTop: 12,
                padding: 8,
                backgroundColor: getButtonColor(),
                borderRadius: 8,
                alignItems: "center",
                opacity: requesting ? 0.6 : 1,
              }}
              disabled={isButtonDisabled()}
              onPress={handleButtonPress}
            >
              {requesting ? (
                <ActivityIndicator size="small" color={Colors.primaryWhite} />
              ) : (
                <Text style={styles.addPlayerButton}>
                  {getButtonText()}
                </Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
        <View style={styles.cardContainer}>
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
          <View>
            {players.length === 0 ? (
              <Text style={{ ...Typescale.bodyM, color: Colors.gray600, textAlign: 'center', paddingVertical: 16 }}>
                No players joined yet
              </Text>
            ) : (
              players.map((player: PlayerData, index: number) => (
                <GamePlayerCard key={index} player={player} />
              ))
            )}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.gray200
  },
  headerText: {
    ...Typescale.titleM,
  },
  scrollView: {
    flex: 1,
    paddingHorizontal: 12,
  },
  cardContainer: {
    borderRadius: 8,
    paddingVertical: 16,
    paddingHorizontal: 12,
    shadowColor: Colors.gray800,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 2,
    backgroundColor: Colors.gray100,
  },
  detailRow: {
    flexDirection: "row",
    columnGap: 8,
    marginBottom: 4,
    alignItems: 'center'
  },
  backButton: {
    marginRight: 12,
  },
  gameDetail: {
    ...Typescale.labelL,
    color: Colors.gray800,
  },
  addPlayerButton: {
    ...Typescale.labelL,
    color: Colors.primaryWhite,
  },
});
