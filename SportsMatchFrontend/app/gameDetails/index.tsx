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
  TouchableWithoutFeedback,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import GamePlayerCard from "@/src/components/games/game-player-card";
import { useLocalSearchParams, useRouter } from "expo-router";
import {formatISOToDayDate} from "@/src/utils/date-utils";
import { getGameByIdAsync, sendRequestAsync, acceptInviteAsync, acceptRequestAsync, rejectRequestAsync } from "@/src/apiCalls/game";
import GameRequestCard from "@/src/components/games/game-request-card";

const { width: screenWidth, height: screenHeight } = Dimensions.get("window");

interface RequestData {
  _id?: string;
  email: string;
  name: string;
  age: number;
  sport_interests?: any;
  status: string;
  requestedAt?: string;
}

interface GameData {
  _id: string;
  name: string;
  sportType: string;
  location: string;
  startAt: string;
  maxPlayers: number;
  players: any[];
  requests?: RequestData[];
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
  const [requestSent, setRequestSent] = useState(initialUserRole === 'requester');
  const [acceptingInvite, setAcceptingInvite] = useState(false);
  const [inviteAccepted, setInviteAccepted] = useState(initialUserRole === 'player' || initialUserRole === 'creator');

  const [showRequests, setShowRequests] = useState(false)

  useEffect(() => {
    if (gameId) {
      fetchGameData();
    }
  }, [gameId]);

  const fetchGameData = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await getGameByIdAsync(gameId);
      setGame(response.game);
      // Sync local state with fetched game data
      const fetchedUserRole = response.game?.userRole || initialUserRole;
      setRequestSent(fetchedUserRole === 'requester');
      setInviteAccepted(fetchedUserRole === 'player' || fetchedUserRole === 'creator');
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
      setRequestSent(true);
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
      setAcceptingInvite(true);
      const response = await acceptInviteAsync(gameId);
      // Update game state immediately with the updated game data
      if (response.game) {
        setGame(response.game);
        // Sync local state with updated game data
        const fetchedUserRole = response.game?.userRole || initialUserRole;
        setRequestSent(fetchedUserRole === 'requester');
        // User is now a player after accepting invite
        setInviteAccepted(true);
      }
      Alert.alert("Success", "Invite accepted successfully!", [
        { text: "OK", onPress: () => fetchGameData() }
      ]);
    } catch (err: any) {
      Alert.alert("Error", err.message || "Failed to accept invite");
    } finally {
      setAcceptingInvite(false);
    }
  };

    const showDeleteAlert = () => {
    Alert.alert(
      "Delete game",
      "Are you sure you want to delete this game?",
      [
        { text: "Cancel", style: "cancel"},
        {
          text: "Delete", style: "destructive",
          onPress: () =>{
            // Handle deleting game
          }
        }
      ]
    )
  }

  const handleAcceptRequest = async (requestEmail: string) => {
    try {
      const response = await acceptRequestAsync(gameId, requestEmail);
      // Update game state immediately with the updated game data
      if (response.game) {
        setGame(response.game);
      }
      Alert.alert("Success", "Request accepted successfully!", [
        { text: "OK", onPress: () => fetchGameData() }
      ]);
    } catch (err: any) {
      Alert.alert("Error", err.message || "Failed to accept request");
    }
  };

  const handleRejectRequest = async (requestEmail: string) => {
    try {
      const response = await rejectRequestAsync(gameId, requestEmail);
      // Update game state immediately with the updated game data
      if (response.game) {
        setGame(response.game);
      }
      Alert.alert("Success", "Request rejected successfully!", [
        { text: "OK", onPress: () => fetchGameData() }
      ]);
    } catch (err: any) {
      Alert.alert("Error", err.message || "Failed to reject request");
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
  const isJoined = userRole === 'creator' || userRole === 'player' || inviteAccepted;
  const isRequestPending = userRole === 'requester' || requestSent;
  const isInvited = userRole === 'invited' && !inviteAccepted;
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
              backgroundColor: isJoined || isRequestPending ? Colors.gray700 : Colors.primary,
              borderRadius: 8,
              alignItems: "center",
              opacity: requesting || acceptingInvite ? 0.6 : 1,
            }}
            disabled={isJoined || isRequestPending || requesting || acceptingInvite}
            onPress={isInvited ? handleAcceptInvite : handleRequestToJoin}
          >
            {requesting || acceptingInvite ? (
              <ActivityIndicator size="small" color={Colors.primaryWhite} />
            ) : (
              <Text style={styles.addPlayerButton}>
                {isJoined 
                  ? 'Already Joined' 
                  : isRequestPending 
                    ? 'Already Requested' 
                    : isInvited 
                      ? 'Accept Invite' 
                      : 'Request to Join'}
              </Text>
            )}
          </TouchableOpacity>
        </View>
        <View style={styles.cardContainer}>
          <Text style={styles.cardTitle}>Players</Text>
          <Text style={styles.cardSubtitle}>Players who have joined and their skill levels.</Text>
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
        {
        game.userRole === "creator" ? 
        <View>
          <View style={styles.cardContainer}>
            <TouchableWithoutFeedback onPress={() => setShowRequests(!showRequests)}>
              <View style={{flexDirection: 'row', alignItems: 'center'}}>
                <Text style={styles.cardTitle}>Requests</Text>
                <Ionicons name={showRequests ? "chevron-up" : "chevron-down"} size={24} color={Colors.gray700}/>
              </View>
            </TouchableWithoutFeedback>
            {
              showRequests ?
              <View>
                <Text style={styles.cardSubtitle}>Players who are requesting to join your game.</Text> 
                {!game.requests || game.requests.filter((req: RequestData) => req.status === 'pending').length === 0 ? (
                  <Text style={{ ...Typescale.bodyM, color: Colors.gray600, textAlign: 'center', paddingVertical: 16 }}>
                    No pending requests
                  </Text>
                ) : (
                  game.requests
                    .filter((req: RequestData) => req.status === 'pending')
                    .map((request: RequestData, index: number) => {
                      // Transform request to player data format
                      const sportInterests = request.sport_interests || {};
                      const skillLevel = sportInterests[game.sportType] || 1;
                      const requestPlayer: PlayerData = {
                        name: request.name || request.email || 'Unknown',
                        age: request.age || 0,
                        skillLevel: skillLevel
                      };
                      
                      return (
                        <GameRequestCard 
                          key={index} 
                          player={requestPlayer} 
                          onAccept={() => handleAcceptRequest(request.email)} 
                          onReject={() => handleRejectRequest(request.email)}
                        />
                      );
                    })
                )}
              </View> 
              : null
            }
          </View>
          <TouchableOpacity style={styles.deleteButtonContainer}
            onPress={showDeleteAlert}>
              <Text style={styles.deleteGameButton}>Delete Game</Text>
          </TouchableOpacity>
        </View> 
        : null
        }
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
    marginBottom: 16,
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
  cardTitle: {
    ...Typescale.headlineM,
    color: Colors.gray900,
    marginBottom: 8,
    flex: 1
  },
  cardSubtitle: {
    ...Typescale.bodyM, 
    marginBottom: 8 
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
  deleteButtonContainer: {
    marginVertical: 40, 
    paddingVertical: 8, 
    backgroundColor: Colors.gray300, 
    alignItems: 'center', 
    borderColor: Colors.gray400, 
    borderWidth: 1.5, 
    borderRadius: 4
  },
  deleteGameButton: {
    ...Typescale.labelL, 
    color: "#ef4444"
  }
});
