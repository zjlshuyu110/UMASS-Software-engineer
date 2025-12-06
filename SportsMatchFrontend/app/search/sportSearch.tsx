import { Colors, Typescale } from "@/constants/theme";
import { getGameBySportAsync } from "@/src/apiCalls/game";
import GameCard from "@/src/components/ui/game-card";
import { Game } from "@/src/models/Game";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { Text, StyleSheet, View, TouchableOpacity, ActivityIndicator, ScrollView, FlatList } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function SportSearchView() {
    const router = useRouter();
    const params = useLocalSearchParams();
    const sportType = params.sportType as string
    
    const [games, setGames] = useState<Game[]>([])
    const [loading, setLoading] = useState<boolean>(true)
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {

    })

    const handleBack = () => {
        router.back();
    };

    function navigateToGameDetails(game: Game) {
        router.push({
        pathname: "/gameDetails" as any,
        params: {
            gameId: game._id || '',
            userRole: game.userRole || '',
        },
        });
    }

    useEffect(() => {
        const fetchGamesBySport = async () => {
            try {
                setLoading(true)
                const response = await getGameBySportAsync(sportType)
                console.log(response)
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

                setGames(transformedGames)
            } catch (err) {
                console.error('Error fetching games:', err)
                setError('Failed to load games')
            } finally {
                setLoading(false)
            }
        }

        fetchGamesBySport();
    }, [])
    
    return (
    <SafeAreaView style={styles.container} edges={["top"]}>
        <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 16, paddingHorizontal: 12, paddingTop: 12}}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={handleBack}
            className="flex-1 w-full"
          >
            <Ionicons name="arrow-back" size={24} />
          </TouchableOpacity>
          <Text style={styles.headerText}>{sportType}</Text>
        </View>
        {loading ? 
        <ActivityIndicator size="large" color={Colors.primaryLight}/> :
        error ?
        <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>There was an error getting games.</Text> 
        </View> :
        <FlatList 
            style={styles.listScroll}
            data={games}
            keyExtractor={(game) => game._id}
            contentContainerStyle={{ gap: 8 }}
            renderItem={({ item }) => (
                <GameCard game={item} onPress={() => navigateToGameDetails(item)} />
            )}
            ListEmptyComponent={
                !loading && games.length === 0? (
                <View style={styles.emptyContainer}>
                    <Text style={styles.emptyText}>No {sportType} games found.</Text>
                </View>
                ) : null
            }>
        </FlatList>
        }
        
        
    </SafeAreaView>)
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: 'white',
        flex: 1
    },
    searchBar: {
        backgroundColor: '#F8F9FA',
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderRadius: 8,
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center'
    },
    headerText: {
        ...Typescale.titleM,
      },
    backButton: {
        marginRight: 8,
        alignContent: 'center',
    },
    emptyContainer: {
        justifyContent: 'center',
        flex: 1,
        paddingHorizontal: 12
    },
    emptyText: {
        ...Typescale.titleL, 
        textAlign: 'center', 
        color: Colors.gray700, 
        fontWeight: 400, 
        fontStyle: 'italic', 
    },
    listScroll: {
        paddingHorizontal: 12, 
        flex: 1
    }
})