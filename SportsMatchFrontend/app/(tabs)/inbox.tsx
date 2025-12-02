import { Text, View, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator, Image, Alert } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Typescale, Colors } from '@/constants/theme';
import { useState, useCallback } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { getConversationsAsync, Conversation } from '@/src/apiCalls/message';
import { Ionicons } from '@expo/vector-icons';

export default function InboxView() {
    const [conversations, setConversations] = useState<Conversation[]>([]);
    const [loading, setLoading] = useState(true);

    useFocusEffect(
        useCallback(() => {
            loadConversations();
        }, [])
    );

    const loadConversations = async () => {
        try {
            setLoading(true);
            const data = await getConversationsAsync();
            
            // If no real conversations, show sample data
            if (data.length === 0) {
                setConversations(sampleConversations);
            } else {
                setConversations(data);
            }
        } catch (error) {
            console.error('Failed to load conversations:', error);
            // Show sample data on error
            setConversations(sampleConversations);
        } finally {
            setLoading(false);
        }
    };

    const formatTime = (dateString: string) => {
        const date = new Date(dateString);
        const now = new Date();
        const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);

        if (diffInHours < 24) {
            return date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
        } else if (diffInHours < 48) {
            return 'Yesterday';
        } else {
            return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
        }
    };

    return (
        <SafeAreaView style={styles.container} edges={['top']}>
            <View style={styles.header}>
                <Text style={styles.headerText}>Messages</Text>
                {conversations.length > 0 && (
                    <View style={styles.badge}>
                        <Text style={styles.badgeText}>
                            {conversations.reduce((sum, conv) => sum + conv.unreadCount, 0)}
                        </Text>
                    </View>
                )}
            </View>

            {/* Demo Notice */}
            {conversations === sampleConversations && (
                <View style={styles.demoNotice}>
                    <Ionicons name="information-circle" size={16} color={Colors.primary} />
                    <Text style={styles.demoNoticeText}>
                        Showing demo messages. Real messages will appear here.
                    </Text>
                </View>
            )}

            {loading ? (
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color={Colors.primary} />
                    <Text style={styles.loadingText}>Loading messages...</Text>
                </View>
            ) : conversations.length === 0 ? (
                <View style={styles.emptyContainer}>
                    <Ionicons name="chatbubbles-outline" size={64} color={Colors.gray400} />
                    <Text style={styles.emptyText}>No messages yet</Text>
                    <Text style={styles.emptySubtext}>Start chatting with other players!</Text>
                </View>
            ) : (
                <ScrollView style={styles.conversationsList}>
                    {conversations.map((conversation, index) => (
                        <TouchableOpacity 
                            key={index} 
                            style={styles.conversationCard}
                            onPress={() => Alert.alert('Chat', `Chat with ${conversation.partner.name} (Coming soon)`)}
                        >
                            <View style={styles.avatarContainer}>
                                {conversation.partner.display_picture ? (
                                    <Image 
                                        source={{ uri: conversation.partner.display_picture }} 
                                        style={styles.avatar}
                                    />
                                ) : (
                                    <View style={styles.avatarPlaceholder}>
                                        <Ionicons name="person" size={24} color={Colors.gray600} />
                                    </View>
                                )}
                                {conversation.unreadCount > 0 && (
                                    <View style={styles.onlineBadge} />
                                )}
                            </View>

                            <View style={styles.conversationContent}>
                                <View style={styles.conversationHeader}>
                                    <Text style={styles.partnerName}>{conversation.partner.name}</Text>
                                    <Text style={styles.timestamp}>
                                        {formatTime(conversation.lastMessage.createdAt)}
                                    </Text>
                                </View>
                                <View style={styles.messagePreview}>
                                    <Text 
                                        style={[
                                            styles.lastMessage,
                                            conversation.unreadCount > 0 && styles.unreadMessage
                                        ]}
                                        numberOfLines={1}
                                    >
                                        {conversation.lastMessage.messageType === 'game_invite' 
                                            ? '🎮 Game Invitation'
                                            : conversation.lastMessage.content
                                        }
                                    </Text>
                                    {conversation.unreadCount > 0 && (
                                        <View style={styles.unreadBadge}>
                                            <Text style={styles.unreadBadgeText}>
                                                {conversation.unreadCount}
                                            </Text>
                                        </View>
                                    )}
                                </View>
                            </View>
                        </TouchableOpacity>
                    ))}
                </ScrollView>
            )}
        </SafeAreaView>
    );
}

// Sample conversations for demo
const sampleConversations: Conversation[] = [
    {
        partner: {
            _id: '1',
            name: 'Sarah Johnson',
            email: 'sarah@example.com',
            display_picture: undefined
        },
        lastMessage: {
            _id: 'm1',
            sender: { _id: '1', name: 'Sarah Johnson', email: 'sarah@example.com' },
            receiver: { _id: 'current', name: 'You', email: 'you@example.com' },
            content: 'Hey! Are you free for basketball tomorrow?',
            messageType: 'text',
            isRead: false,
            createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString()
        },
        unreadCount: 2,
        messages: []
    },
    {
        partner: {
            _id: '2',
            name: 'Mike Chen',
            email: 'mike@example.com',
            display_picture: undefined
        },
        lastMessage: {
            _id: 'm2',
            sender: { _id: '2', name: 'Mike Chen', email: 'mike@example.com' },
            receiver: { _id: 'current', name: 'You', email: 'you@example.com' },
            content: 'Thanks for the game! That was fun 🏐',
            messageType: 'text',
            isRead: true,
            createdAt: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString()
        },
        unreadCount: 0,
        messages: []
    },
    {
        partner: {
            _id: '3',
            name: 'Emily Rodriguez',
            email: 'emily@example.com',
            display_picture: undefined
        },
        lastMessage: {
            _id: 'm3',
            sender: { _id: '3', name: 'Emily Rodriguez', email: 'emily@example.com' },
            receiver: { _id: 'current', name: 'You', email: 'you@example.com' },
            content: 'Game Invitation',
            messageType: 'game_invite',
            isRead: false,
            createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString()
        },
        unreadCount: 1,
        messages: []
    },
    {
        partner: {
            _id: '4',
            name: 'Tom Wilson',
            email: 'tom@example.com',
            display_picture: undefined
        },
        lastMessage: {
            _id: 'm4',
            sender: { _id: 'current', name: 'You', email: 'you@example.com' },
            receiver: { _id: '4', name: 'Tom Wilson', email: 'tom@example.com' },
            content: 'See you at the court!',
            messageType: 'text',
            isRead: true,
            createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString()
        },
        unreadCount: 0,
        messages: []
    }
];

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        paddingVertical: 12,
    },
    headerText: {
        ...Typescale.headlineL,
    },
    badge: {
        backgroundColor: Colors.primary,
        borderRadius: 12,
        minWidth: 24,
        height: 24,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 8,
    },
    badgeText: {
        color: 'white',
        fontSize: 12,
        fontWeight: '600',
    },
    demoNotice: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FFF9E6',
        paddingHorizontal: 16,
        paddingVertical: 10,
        marginHorizontal: 16,
        marginBottom: 12,
        borderRadius: 8,
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
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    loadingText: {
        marginTop: 12,
        color: Colors.gray600,
        fontSize: 14,
    },
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 32,
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
        textAlign: 'center',
    },
    conversationsList: {
        flex: 1,
    },
    conversationCard: {
        flexDirection: 'row',
        padding: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#F0F0F0',
    },
    avatarContainer: {
        position: 'relative',
        marginRight: 12,
    },
    avatar: {
        width: 50,
        height: 50,
        borderRadius: 25,
    },
    avatarPlaceholder: {
        width: 50,
        height: 50,
        borderRadius: 25,
        backgroundColor: Colors.gray200,
        justifyContent: 'center',
        alignItems: 'center',
    },
    onlineBadge: {
        position: 'absolute',
        bottom: 0,
        right: 0,
        width: 14,
        height: 14,
        borderRadius: 7,
        backgroundColor: '#4CAF50',
        borderWidth: 2,
        borderColor: 'white',
    },
    conversationContent: {
        flex: 1,
        justifyContent: 'center',
    },
    conversationHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 4,
    },
    partnerName: {
        fontSize: 16,
        fontWeight: '600',
        color: Colors.gray900,
    },
    timestamp: {
        fontSize: 12,
        color: Colors.gray600,
    },
    messagePreview: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    lastMessage: {
        flex: 1,
        fontSize: 14,
        color: Colors.gray600,
    },
    unreadMessage: {
        color: Colors.gray900,
        fontWeight: '600',
    },
    unreadBadge: {
        backgroundColor: Colors.primary,
        borderRadius: 10,
        minWidth: 20,
        height: 20,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 6,
        marginLeft: 8,
    },
    unreadBadgeText: {
        color: 'white',
        fontSize: 11,
        fontWeight: '600',
    },
});