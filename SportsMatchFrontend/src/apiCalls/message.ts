import axios from "axios";
import { API_URL } from "@/env";
import { getToken } from "../utils/token";

export interface Message {
    _id: string;
    sender: {
        _id: string;
        name: string;
        email: string;
        display_picture?: string;
    };
    receiver: {
        _id: string;
        name: string;
        email: string;
        display_picture?: string;
    };
    content: string;
    messageType: 'text' | 'game_invite' | 'system';
    relatedGame?: string;
    isRead: boolean;
    createdAt: string;
}

export interface Conversation {
    partner: {
        _id: string;
        name: string;
        email: string;
        display_picture?: string;
    };
    lastMessage: Message;
    unreadCount: number;
    messages: Message[];
}

export const getConversationsAsync = async (): Promise<Conversation[]> => {
    try {
        const token = await getToken();
        const response = await axios.get(
            `${API_URL}/messages/conversations`, {
                headers: {
                    'x-auth-token': token
                }
            }
        );
        return response.data.conversations;
    } catch (error: any) {
        console.log(error);
        throw new Error("Failed to get conversations.");
    }
};

export const getConversationWithUserAsync = async (userId: string): Promise<Message[]> => {
    try {
        const token = await getToken();
        const response = await axios.get(
            `${API_URL}/messages/conversation/${userId}`, {
                headers: {
                    'x-auth-token': token
                }
            }
        );
        return response.data.messages;
    } catch (error: any) {
        console.log(error);
        throw new Error("Failed to get conversation.");
    }
};

export const sendMessageAsync = async (receiverId: string, content: string, messageType: string = 'text', relatedGame?: string): Promise<Message> => {
    try {
        const token = await getToken();
        const response = await axios.post(
            `${API_URL}/messages/send`,
            { receiverId, content, messageType, relatedGame },
            {
                headers: {
                    'x-auth-token': token
                }
            }
        );
        return response.data.message;
    } catch (error: any) {
        console.log(error);
        throw new Error("Failed to send message.");
    }
};

export const getUnreadCountAsync = async (): Promise<number> => {
    try {
        const token = await getToken();
        const response = await axios.get(
            `${API_URL}/messages/unread-count`, {
                headers: {
                    'x-auth-token': token
                }
            }
        );
        return response.data.unreadCount;
    } catch (error: any) {
        console.log(error);
        return 0;
    }
};
