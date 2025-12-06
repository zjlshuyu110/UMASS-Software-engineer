import { Colors, Typescale } from "@/constants/theme";
import { searchGamesAsync } from "@/src/apiCalls/game";
import GameCard from "@/src/components/ui/game-card";
import { Game } from "@/src/models/Game";
import { Ionicons } from "@expo/vector-icons";
import { useIsFocused } from "@react-navigation/native";
import { useRouter } from "expo-router"
import { useEffect, useRef, useState } from "react";
import { Text, TouchableOpacity, View, StyleSheet, TextInput, ActivityIndicator, FlatList } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context";

export default function QuerySearchView() {
    const router = useRouter()
    const [query, onChangeQuery] = useState<string>("")
    const [loading, setLoading] = useState<boolean>(false)
    const [error, setError] = useState<string | null>(null)
    const [games, setGames] = useState<Game[] | null>(null)

    const inputRef = useRef<TextInput>(null);
    const isFocused = useIsFocused();

    useEffect(() => {
        if (isFocused) {
        setTimeout(() => inputRef.current?.focus(), 0);
        }
    }, [isFocused]);

    const handleBack = () => {
        router.back();
    };

    const handleSearch = async () => {
        try {
        setLoading(true);
        const filters: any = {};

        if (query.trim()) {
            filters.name = query.trim();
        } else {
            setGames(null)
            return
        }
        
        const result = await searchGamesAsync(filters)
        console.log(result)
        setGames(result)
        setError(null)
        } catch (error) {
            console.error('Search failed:', error)
            setError("There was an error searching for game.")
        } finally {
            setLoading(false)
        }
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
                <TextInput ref={inputRef} placeholder="Search for game" value={query} onChangeText={onChangeQuery} returnKeyType="search" style={styles.searchBar} clearButtonMode="always" onSubmitEditing={handleSearch} />
            </View>
            {/* Search Result */}
            {loading ? 
            <ActivityIndicator size="large" color={Colors.primaryLight}/> :
            error ?
            <Text style={styles.emptyText}>{error}</Text> :
            <FlatList 
                style={styles.listScroll}
                data={games}
                keyExtractor={(game) => game._id}
                contentContainerStyle={{ gap: 8 }}
                renderItem={({ item }) => (
                    <GameCard game={item} onPress={() => navigateToGameDetails(item)} />
                )}
                ListEmptyComponent={
                    !loading && games !== null && games.length === 0 ? (
                    <Text style={styles.emptyText}>No games found.</Text>
                    ) : null
                }
            />
            }
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: 'white',
        flex: 1
    },
    headerText: {
        ...Typescale.titleM,
    },
    backButton: {
        marginRight: 8,
        alignContent: 'center',
    },
    searchBar: {
        backgroundColor: '#F8F9FA',
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderRadius: 8,
        flexDirection: 'row', 
        alignItems: 'center',
        flex: 1
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