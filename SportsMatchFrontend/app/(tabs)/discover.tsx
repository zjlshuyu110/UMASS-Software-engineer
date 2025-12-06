import { Text, View, StyleSheet, TouchableOpacity, ScrollView, Image, ActivityIndicator, TouchableWithoutFeedback, Modal, Button } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Typescale } from '@/constants/theme';
import GameCard from '@/src/components/ui/game-card';
import { Game } from '@/src/models/Game';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '@/constants/theme';
import { useCallback, useState } from 'react';
import { useAppDispatch } from '@/hooks/reduxHooks';
import { loadToken } from '@/src/redux/slices/userSlice';
import { useFocusEffect } from '@react-navigation/native';
import { getGamesSoonAsync } from '@/src/apiCalls/game';
import { SPORT_TYPES } from '@/constants/game';

export default function DiscoverView() {
  const dispatch = useAppDispatch();
  const [games, setGames] = useState<Game[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [modalVisible, setModalVisible] = useState<boolean>(false);

  const fetchGames = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await getGamesSoonAsync();
      
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
      async function checkIfTokenExists() {
        const token = await dispatch(loadToken()).unwrap();
        if (!token) {
          router.push("/");
        } else {
          fetchGames();
        }
      }
      checkIfTokenExists();
    }, [dispatch, fetchGames])
  );

  function navigateToGameDetails(game: Game) {
      router.push({
        pathname: "/gameDetails" as any,
        params: {
          gameId: game._id || '',
          userRole: game.userRole || '',
        },
      });
  }

  function navigateToQuerySearch() {
    router.push({
      pathname: "/search/querySearch" as any,
    })
  }

  function navigateToSportSearch(sportType: string) {
    router.push({
      pathname: "/search/sportSearch" as any,
      params: { sportType }
    })
  }

    return (
        <SafeAreaView style={styles.container} edges={['top']}>
          <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContainer}>
            <Text style={styles.headerText}>Discover</Text>
            <TouchableWithoutFeedback onPress={navigateToQuerySearch}>
              <View style={styles.searchBar}>
                <Ionicons size={12} color={'black'} name='search' style={{ marginRight: 4 }} />
                <Text style={{color: Colors.gray700}}>Search for games</Text>
              </View>
            </TouchableWithoutFeedback>

            {/* Sports Categories */}
            <View style={styles.sportCategoriesContainer}>
                {sports.map((sport, index) => (
                  <TouchableOpacity key={index} style={styles.categoryCard} onPress={() => navigateToSportSearch(sport.name)}>
                    <Image style={{width:40, height:40}} source={sport.icon}/>
                    <Text style={{ ...Typescale.labelS, marginTop: 8, fontWeight: 700 }}>{sport.name}</Text>
                  </TouchableOpacity>
                ))}
                  <TouchableOpacity style={styles.categoryCard} onPress={() => setModalVisible(true)}>
                    <Ionicons size={40} color={Colors.primaryLight} name='grid'/>
                    <Text style={{ ...Typescale.labelS, marginTop: 8, fontWeight: 700 }}>More</Text>
                  </TouchableOpacity>
            </View>

            {/* Games Happening Soon */}
            <Text style={styles.sectionText}>Happening Soon</Text>
            {loading ? (
              <View style={{ paddingVertical: 20, alignItems: 'center' }}>
                <ActivityIndicator size="large" color={Colors.primaryLight} />
              </View>
            ) : error ? (
              <View style={styles.emptyBanner}>
                <Text style={styles.emptyText}>{error}</Text>
              </View>
            ) : games.length === 0 ? (
              <View style={styles.emptyBanner}>
                <Text style={styles.emptyText}>No games happening soon</Text>
              </View>
            ) : (
              <View style={{ rowGap: 8 }}>
                {games.map((game, index) => <GameCard key={game._id} game={game} onPress={()=>{navigateToGameDetails(game)}} />)}
              </View>
            )}
          </ScrollView>

          <Modal transparent={true} visible={modalVisible} animationType='slide' onRequestClose={() => setModalVisible(false)}>
            <View style={styles.modalOverlay}>
              <View style={styles.modalContent}>
                <View style={styles.modalHeader}>
                  <Text style={styles.modalTitle}>Sport Types</Text>
                  <Button title='Cancel' onPress={() => setModalVisible(false)} color={Colors.primaryLight}></Button>
                </View>
                <ScrollView>
                {SPORT_TYPES.map((sport, id) => 
                (<TouchableWithoutFeedback key={sport} onPress={() => {
                    navigateToSportSearch(sport)
                    setModalVisible(false)
                  }}>
                  <View style={styles.modalOption}>
                    <Text style={styles.modalOptionText}>{sport}</Text>
                  </View>
                </TouchableWithoutFeedback>))}
                </ScrollView>
              </View>
            </View>
          </Modal>
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
]

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
    ... Typescale.headlineL,
    marginBottom: 12
  },
  searchBar: {
    backgroundColor: '#F8F9FA',
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginBottom: 12,
    borderRadius: 8,
    flexDirection: 'row', 
    alignItems: 'center'
  },
  sectionText: {
    ...Typescale.titleL, 
    marginBottom: 8
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
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingTop: 20,
    paddingBottom: 40,
    maxHeight: '60%',
  },
  modalHeader: {
    flexDirection: 'row', 
    alignItems:'center', 
    justifyContent: 'space-between', 
    paddingHorizontal: 20
  },
  modalTitle: {
    ...Typescale.titleM,
    color: Colors.gray900,
    fontWeight: '600',
    textAlignVertical: 'center',
  },
  modalOption: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.gray200,
  },
  modalOptionText: {
    ...Typescale.bodyL,
    color: Colors.gray900,
  },
});