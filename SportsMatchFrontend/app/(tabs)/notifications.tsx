import { Text, View, StyleSheet, TouchableOpacity, FlatList } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Typescale, Colors } from '@/constants/theme';
import { Ionicons } from '@expo/vector-icons';
import { Notification } from '@/src/models/Notification';
import { useMemo, useState, useEffect } from 'react';
import { getNotificationsAsync, markAsReadAsync } from '@/src/apiCalls/notification';
import { useRouter } from 'expo-router';

type IconName = React.ComponentProps<typeof Ionicons>["name"];
type FilterState = "none" | "unread" | "read"

export default function NotificationsView() {
  const [selectedFilter, setSelectedFilter] = useState<FilterState>("none");
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const response = await getNotificationsAsync();
      // Parse date strings to Date objects
      const parsedNotifications = response.notifications.map((noti: any) => ({
        ...noti,
        date: new Date(noti.date),
        createdAt: noti.createdAt ? new Date(noti.createdAt) : undefined
      }));
      setNotifications(parsedNotifications);
    } catch (error) {
      console.error('Error fetching notifications:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleMarkAsRead = async (notificationId: string) => {
    try {
      await markAsReadAsync(notificationId);
      // Update local state optimistically
      setNotifications(prevNotifications =>
        prevNotifications.map(noti =>
          noti._id === notificationId ? { ...noti, unread: false } : noti
        )
      );
    } catch (error) {
      console.error('Error marking notification as read:', error);
      // Refresh notifications on error to sync with server
      fetchNotifications();
    }
  };

  const handleFilterPress = (pressed: FilterState) => {
    setSelectedFilter((prev) => {
      if (prev === "none") return pressed;
      return prev === pressed ? "none" : pressed;
    });
  };

  const filteredNotifications = useMemo(
    () =>
      notifications.filter((noti) => {
        return (
          selectedFilter === "none" ||
          (selectedFilter === "unread" && noti.unread) ||
          (selectedFilter === "read" && !noti.unread)
        );
      }),
    [selectedFilter, notifications]
  );

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <Text style={styles.headerText}>Notifications</Text>
      <View style={{flexDirection: 'row', paddingHorizontal: 12, gap: 6, height: 32, marginBottom: 16}}>
        <TouchableOpacity
          onPress={() => handleFilterPress("unread")}>
          <View style={[
            styles.filterChip,
            selectedFilter === "unread" && styles.filterChipActive
          ]}>
            <Text style={[
              styles.filterText,
              selectedFilter === "unread" && styles.filterTextActive
            ]}>Unread</Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => handleFilterPress("read")}>
          <View style={[
            styles.filterChip,
            selectedFilter === "read" && styles.filterChipActive
          ]}>
            <Text style={[
              styles.filterText,
              selectedFilter === "read" && styles.filterTextActive
            ]}>Read</Text>
          </View>
        </TouchableOpacity>
      </View>
      {/* Notifications */}
      <FlatList 
          data={filteredNotifications}
          keyExtractor={(noti) => noti._id}
          contentContainerStyle={{ gap: 8 }}
          refreshing={loading}
          onRefresh={fetchNotifications}
          renderItem={({ item }) => (
            <NotificationCard 
              notification={item}
              onMarkAsRead={() => handleMarkAsRead(item._id)}
            />
          )}
          ListEmptyComponent={
              !loading && filteredNotifications.length === 0 ? (
              <Text style={styles.emptyText}>No notifications.</Text>
              ) : null
          }
      />
    </SafeAreaView>
  );
}

function NotificationCard({ notification, onMarkAsRead }: {notification: Notification, onMarkAsRead: () => void} ) {
  const { bg, icon, iconName } = notificationTypeStyles[notification.type] || notificationTypeStyles.accept;
  const [markingAsRead, setMarkingAsRead] = useState(false);
  const router = useRouter();

  const handleMarkAsRead = async () => {
    try {
      setMarkingAsRead(true);
      await onMarkAsRead();
    } catch (error) {
      console.error('Error marking notification as read:', error);
    } finally {
      setMarkingAsRead(false);
    }
  };

  const handleNotificationPress = () => {
    // Get gameId from notification.game (could be object with _id or just string ID)
    const gameId = typeof notification.game === 'object' && notification.game?._id 
      ? notification.game._id 
      : typeof notification.game === 'string' 
      ? notification.game 
      : null;
    
    if (gameId) {
      router.push({
        pathname: "/gameDetails" as any,
        params: {
          gameId: gameId,
          userRole: '', // Will be determined by the gameDetails page
        },
      });
    }
  };

  return (
    <View style={{flex: 1}}>
      <View style={styles.notificationContainer}>
        <View style={{marginRight: 12}}>
          <View style={{ ...styles.notificationBadge, backgroundColor: bg}}>
            <Ionicons size={20} name={iconName} color={icon}/>
          </View>
        </View>
        <TouchableOpacity 
          style={{ justifyContent: 'space-between', flex: 1 }}
          onPress={handleNotificationPress}
          activeOpacity={0.7}
        >
          <Text style={notification.unread ? styles.notificationTitleUnread : styles.notificationTitleRead}>{notification.title}</Text>
          <Text style={styles.notificationDate}>{notification.date.toLocaleDateString('en-US', {month: 'short', day: '2-digit',})}</Text>
        </TouchableOpacity>
        {notification.unread && (
          <TouchableOpacity 
            onPress={handleMarkAsRead}
            disabled={markingAsRead}
            style={styles.markAsReadButton}
          >
            <Ionicons 
              name="checkmark-done-circle-outline" 
              size={24} 
              color={Colors.primaryLight} 
            />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

const notificationTypeStyles: {[type: string]: {bg: string, icon: string, iconName: IconName}} = {
  accept: {
    bg: "#ecfccb",
    icon: "#84cc16",
    iconName: "checkmark"
  },
  reject: {
    bg: "#fee2e2",
    icon: "#ef4444",
    iconName: "close"
  },
  join: {
    bg: "#fef9c3",
    icon: "#facc15",
    iconName: "ellipsis-horizontal"
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white'
  },
  headerText: {
    ...Typescale.headlineL,
    paddingHorizontal: 12,
    marginBottom: 12
  },
  scroll: {
    flex: 1
  },
  scrollContainer: {
    flexGrow: 1, 
    paddingBottom: 12 
  },
  filterChip: {
    backgroundColor: Colors.gray300,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 50,
  },
  filterChipActive: {
    backgroundColor: Colors.primaryWhite,
    borderWidth: 0.5,
    borderColor: Colors.primaryLight
  },
  filterText: {
    ...Typescale.labelM,
  },
  filterTextActive: {
    color: Colors.primaryLight
  },
  notificationContainer: {
    flexDirection: 'row',
    backgroundColor: 'white',
    padding: 12,
    borderBottomColor: Colors.gray300,
    borderBottomWidth: 1,
  },
  notificationTitleRead: {
    ...Typescale.labelL,
    marginBottom: 4,
    flexWrap: 'wrap',
    fontWeight: 400,
    color: Colors.gray800
  },
    notificationTitleUnread: {
    ...Typescale.labelL,
    marginBottom: 4,
    flexWrap: 'wrap',
    fontWeight: 800,
    color: "black"
  },
  notificationDate: {
    ...Typescale.labelM,
    color: Colors.gray700,
  },
  notificationBadge: {
    borderRadius: 50, 
    width: 40, 
    height: 40, 
    alignItems: 'center', 
    justifyContent: 'center'
  },
  markAsReadButton: {
    marginLeft: 8,
    padding: 4
  },
  loadingContainer: {
    padding: 40,
    alignItems: 'center',
    justifyContent: 'center'
  },
  emptyContainer: {
    padding: 40,
    alignItems: 'center',
    justifyContent: 'center'
  },
  emptyText: {
    ...Typescale.titleL, 
    textAlign: 'center', 
    color: Colors.gray700, 
    fontWeight: 400, 
    fontStyle: 'italic', 
  }
});
