import { Text, View, StyleSheet, ScrollView } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Typescale, Colors } from '@/constants/theme';
import { Ionicons } from '@expo/vector-icons';
import { Notification } from '@/src/models/Notification';

type IconName = React.ComponentProps<typeof Ionicons>["name"];

export default function NotificationsView() {
    return (
        <SafeAreaView style={styles.container} edges={['top']}>
          <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContainer}>
            <Text style={styles.headerText}>Notifications</Text>
            {/* Notifications */}
            <View>
              {notifications.map((noti, index) => <NotificationCard key={index} notification={noti} />)}
            </View>
          </ScrollView>
        </SafeAreaView>
    );
}

function NotificationCard({ notification }: {notification: Notification} ) {
  const { bg, icon, iconName } = typeStyles[notification.type]

  return (
    <View style={{flex: 1}}>
      <View style={styles.notificationContainer}>
        <View style={{marginRight: 12}}>
          <View style={{ ...styles.notificationBadge, backgroundColor: bg}}>
            <Ionicons size={20} name={iconName} color={icon}/>
          </View>
        </View>
        <View style={{ justifyContent: 'space-between', flex: 1}}>
          <Text style={notification.unread ? styles.notificationTitleUnread : styles.notificationTitleRead}>{notification.title}</Text>
          <Text style={styles.notificationDate}>{notification.date.toLocaleDateString('en-US', {month: 'short', day: '2-digit',})}</Text>
        </View>
      </View>
    </View>
  );
}

const typeStyles: {[type: string]: {bg: string, icon: string, iconName: IconName}} = {
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
  pending: {
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
  }
});

const notifications: Notification[] = [
  {
    type: 'reject',
    title: "Rejected from \"Basketball Tournament: Winner Gets $1000\"",
    date: new Date(),
    unread: true
  },
  {
    type: 'accept',
    title: "Accepted to \"Basketball Tournament: Winner Gets $1000\"",
    date: new Date(),
    unread: false,
  },
  {
    type: 'pending',
    title: "Nam Nguyen requesting to join \"Basketball Tournament: Winner Gets $1000\"",
    date: new Date(),
    unread: false
  },
]