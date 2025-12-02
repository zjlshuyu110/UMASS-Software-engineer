import { Text, View, StyleSheet, TextInput, TouchableOpacity, ScrollView, Image, ActivityIndicator, Alert } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Typescale } from '@/constants/theme';
import GameCard from '@/src/components/ui/game-card';
import { Game } from '@/src/models/Game';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '@/constants/theme';
import { useCallback, useState, useEffect } from 'react';
import { useAppDispatch } from '@/hooks/reduxHooks';
import { loadToken } from '@/src/redux/slices/userSlice';
import { useFocusEffect } from '@react-navigation/native';
import { getAllGamesAsync, searchGamesAsync } from '@/src/apiCalls/game';

export default function DiscoverView() {
  const dispatch = useAppDispatch();
  const [games, setGames] = useState<Game[]>([]);
  const [filteredGames, setFilteredGames] = useState<Game[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchText, setSearchText] = useState('');
  const [selectedSport, setSelectedSport] = useState<string | null>(null);

  useFocusEffect(
    useCallback(() => {
      async function checkIfTokenExists() {
        const token = await dispatch(loadToken()).unwrap();
        if (!token) {
          router.push("/");
        }
      }
      checkIfTokenExists();
      loadAllGames();
    }, [dispatch])
  );

  const loadAllGames = async () => {
    try {
      setLoading(true);
      const allGames = await getAllGamesAsync();
      
      // If database is empty, use sample games for demo
      if (allGames.length === 0) {
        console.log('No games in database, using sample games for demo');
        setGames(sampleGames);
        setFilteredGames(sampleGames);
      } else {
        setGames(allGames);
        setFilteredGames(allGames);
      }
    } catch (error) {
      console.error('Failed to load games:', error);
      // On error, use sample games as fallback
      console.log('Error loading games, using sample games as fallback');
      setGames(sampleGames);
      setFilteredGames(sampleGames);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async () => {
    try {
      setLoading(true);
      const filters: any = {};
      
      if (searchText.trim()) {
        filters.name = searchText.trim();
      }
      
      if (selectedSport) {
        filters.sport = selectedSport;
      }
      
      const results = await searchGamesAsync(filters);
      setFilteredGames(results);
    } catch (error) {
      console.error('Search failed:', error);
      Alert.alert('Error', 'Search failed');
    } finally {
      setLoading(false);
    }
  };

  const handleSportFilter = async (sportName: string) => {
    try {
      setLoading(true);
      setSelectedSport(sportName);
      const results = await searchGamesAsync({ sport: sportName });
      setFilteredGames(results);
    } catch (error) {
      console.error('Filter failed:', error);
      Alert.alert('Error', 'Filter failed');
    } finally {
      setLoading(false);
    }
  };

  const clearFilters = () => {
    setSearchText('');
    setSelectedSport(null);
    setFilteredGames(games);
  };


  function navigateToGameDetails(game: any) {
    router.push({
      pathname: "/gameDetails" as any,
      params: {
        name: game.name,
        sportType: game.sportType,
        creator: typeof game.creator === 'string' ? game.creator : game.creator?.name || 'Unknown',
        players: JSON.stringify(game.players || []),
        maxPlayers: game.maxPlayers?.toString() || '10',
        status: game.status,
        location: game.location || '',
        startAt: game.startAt ? new Date(game.startAt).toISOString() : new Date().toISOString(),
        createdAt: game.createdAt ? new Date(game.createdAt).toISOString() : new Date().toISOString(),
      },
    });
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContainer}>
        <Text style={styles.headerText}>Discover</Text>
        
        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <View style={styles.searchBar}>
            <Ionicons size={16} color={Colors.gray600} name='search' style={{ marginRight: 8 }} />
            <TextInput
              style={styles.searchInput}
              placeholder="Search for games..."
              value={searchText}
              onChangeText={setSearchText}
              onSubmitEditing={handleSearch}
              returnKeyType="search"
            />
            {searchText.length > 0 && (
              <TouchableOpacity onPress={() => {
                setSearchText('');
                if (selectedSport) {
                  handleSportFilter(selectedSport);
                } else {
                  setFilteredGames(games);
                }
              }}>
                <Ionicons name="close-circle" size={20} color={Colors.gray600} />
              </TouchableOpacity>
            )}
          </View>
          <TouchableOpacity style={styles.searchButton} onPress={handleSearch}>
            <Text style={styles.searchButtonText}>Search</Text>
          </TouchableOpacity>
        </View>

        {/* Active Filters */}
        {(selectedSport || searchText) && (
          <View style={styles.filtersContainer}>
            <Text style={styles.filtersLabel}>Filters:</Text>
            {selectedSport && (
              <View style={styles.filterChip}>
                <Text style={styles.filterChipText}>{selectedSport}</Text>
                <TouchableOpacity onPress={() => {
                  setSelectedSport(null);
                  if (searchText) {
                    handleSearch();
                  } else {
                    setFilteredGames(games);
                  }
                }}>
                  <Ionicons name="close" size={16} color={Colors.primary} />
                </TouchableOpacity>
              </View>
            )}
            <TouchableOpacity onPress={clearFilters}>
              <Text style={styles.clearFiltersText}>Clear all</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Sports Categories */}
        <View style={styles.sportCategoriesContainer}>
          {sports.map((sport, index) => (
            <TouchableOpacity 
              key={index} 
              style={[
                styles.categoryCard,
                selectedSport === sport.name && styles.categoryCardSelected
              ]}
              onPress={() => handleSportFilter(sport.name)}
            >
              <Image style={{width:40, height:40}} source={sport.icon}/>
              <Text style={{ ...Typescale.labelS, marginTop: 8, fontWeight: 700 }}>{sport.name}</Text>
            </TouchableOpacity>
          ))}
          <TouchableOpacity style={styles.categoryCard}>
            <Ionicons size={40} color={Colors.primaryLight} name='grid'/>
            <Text style={{ ...Typescale.labelS, marginTop: 8, fontWeight: 700 }}>More</Text>
          </TouchableOpacity>
        </View>

        {/* Demo Data Notice */}
        {games === sampleGames && (
          <View style={styles.demoNotice}>
            <Ionicons name="information-circle" size={16} color={Colors.primary} />
            <Text style={styles.demoNoticeText}>
              Showing demo games. Create your own games to see real data!
            </Text>
          </View>
        )}

        {/* Games List */}
        <View style={styles.gamesHeader}>
          <Text style={styles.sectionText}>
            {selectedSport || searchText ? 'Search Results' : 'Available Games'}
          </Text>
          <Text style={styles.gamesCount}>({filteredGames.length})</Text>
        </View>

        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={Colors.primary} />
            <Text style={styles.loadingText}>Loading games...</Text>
          </View>
        ) : filteredGames.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Ionicons name="basketball-outline" size={64} color={Colors.gray400} />
            <Text style={styles.emptyText}>No games found</Text>
            <Text style={styles.emptySubtext}>Try adjusting your search or filters</Text>
          </View>
        ) : (
          <View style={{ rowGap: 8, marginBottom: 20 }}>
            {filteredGames.map((game, index) => (
              <GameCard 
                key={index} 
                game={game} 
                onPress={() => navigateToGameDetails(game)} 
              />
            ))}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  )
}

const sports: { name: string; icon: any }[] = [
  { name: 'Basketball', icon: require('../../assets/images/basketball.png') },
  { name: 'Volleyball', icon: require('../../assets/images/volleyball.png') },
  { name: 'Baseball', icon: require('../../assets/images/baseball.png')  },
  { name: 'Soccer', icon: require('../../assets/images/soccer.png') },
  { name: 'Football', icon: require('../../assets/images/rugby.png') },
  { name: 'Badminton', icon: require('../../assets/images/badminton.png') },
  { name: 'Tennis', icon: require('../../assets/images/tennis.png') },
];

// Demo/Sample games for testing when database is empty
const dateTemps = [8, 9, 10, 11, 12, 13, 14, 15].map((hour) => {
  const date = new Date()
  date.setHours(hour)
  return date
});

const sampleGames: any[] = [
  {
    name: "Basketball Tournament: Winner Gets $1000!",
    sportType: "Basketball",
    creator: { name: "Nam Nguyen" },
    players: [],
    maxPlayers: 24,
    status: "open",
    startAt: dateTemps[0].toISOString(),
    createdAt: dateTemps[0].toISOString(),
    location: "Mill valley Basketball court"
  },
  {
    name: "Chill Volleyball Game For Beginners",
    sportType: "Volleyball",
    creator: { name: "Sahil Kamath" },
    players: [],
    maxPlayers: 8,
    status: "open",
    startAt: dateTemps[1].toISOString(),
    createdAt: dateTemps[1].toISOString(),
    location: "Somewhere in Hadley"
  },
  {
    name: "Volleyball Practice",
    sportType: "Volleyball",
    creator: { name: "Kenneth Rodrigues" },
    players: [],
    maxPlayers: 18,
    status: "open",
    startAt: dateTemps[2].toISOString(),
    createdAt: dateTemps[2].toISOString(),
    location: "Recreation centre"
  },
  {
    name: "Soccer Match - 5v5",
    sportType: "Soccer",
    creator: { name: "John Doe" },
    players: [],
    maxPlayers: 10,
    status: "open",
    startAt: dateTemps[3].toISOString(),
    createdAt: dateTemps[3].toISOString(),
    location: "UMass Soccer Field"
  },
  {
    name: "Tennis Doubles Tournament",
    sportType: "Tennis",
    creator: { name: "Jane Smith" },
    players: [],
    maxPlayers: 4,
    status: "open",
    startAt: dateTemps[4].toISOString(),
    createdAt: dateTemps[4].toISOString(),
    location: "UMass Tennis Courts"
  },
  {
    name: "Badminton Fun Game",
    sportType: "Badminton",
    creator: { name: "Alice Wang" },
    players: [],
    maxPlayers: 6,
    status: "open",
    startAt: dateTemps[5].toISOString(),
    createdAt: dateTemps[5].toISOString(),
    location: "Rec Center Court 3"
  },
];

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    flex: 1,
  },
  scroll: {
    paddingHorizontal: 12, 
    flex: 1
  },
  scrollContainer: {
    flexGrow: 1, 
    paddingBottom: 12 
  },
  headerText: {
    ...Typescale.headlineL,
    marginBottom: 12
  },
  searchContainer: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 12,
  },
  searchBar: {
    flex: 1,
    backgroundColor: '#F8F9FA',
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    padding: 0,
  },
  searchButton: {
    backgroundColor: Colors.primary,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
    justifyContent: 'center',
  },
  searchButtonText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 14,
  },
  filtersContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    flexWrap: 'wrap',
    gap: 8,
  },
  filtersLabel: {
    fontSize: 12,
    color: Colors.gray600,
    fontWeight: '600',
  },
  filterChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.primaryLight,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    gap: 6,
  },
  filterChipText: {
    color: Colors.primary,
    fontSize: 12,
    fontWeight: '600',
  },
  clearFiltersText: {
    color: Colors.primary,
    fontSize: 12,
    fontWeight: '600',
    textDecorationLine: 'underline',
  },
  demoNotice: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF9E6',
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 8,
    marginBottom: 12,
    gap: 8,
    borderWidth: 1,
    borderColor: '#FFE5B4',
  },
  demoNoticeText: {
    flex: 1,
    fontSize: 12,
    color: '#8B6914',
    fontWeight: '500',
  },
  sectionText: {
    ...Typescale.titleL, 
    marginBottom: 8
  },
  gamesHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  gamesCount: {
    ...Typescale.titleM,
    color: Colors.gray600,
    marginLeft: 8,
  },
  sportCategoriesContainer: {
    flexDirection: 'row', 
    flexWrap: 'wrap', 
    justifyContent: 'space-between', 
    gap: 12, 
    marginBottom: 24
  },
  categoryCard: {
    width: '22%', 
    backgroundColor: '#FFF6F5', 
    alignItems: 'center', 
    paddingHorizontal: 8, 
    paddingVertical: 12, 
    borderRadius: 12
  },
  categoryCardSelected: {
    backgroundColor: Colors.primaryLight,
    borderWidth: 2,
    borderColor: Colors.primary,
  },
  loadingContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
  },
  loadingText: {
    marginTop: 12,
    color: Colors.gray600,
    fontSize: 14,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyText: {
    marginTop: 16,
    fontSize: 18,
    fontWeight: '600',
    color: Colors.gray700,
  },
  emptySubtext: {
    marginTop: 8,
    fontSize: 14,
    color: Colors.gray600,
  },
});