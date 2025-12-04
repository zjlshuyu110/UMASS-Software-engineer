export interface Notification {
    _id: string,
    type: NotificationType,
    category: NotificationCategory,
    title: string,
    date: Date,
    unread: boolean,
    game: any, // Can be Game object or string ID
    createdAt?: Date
}

export type NotificationType = "accept" | "reject" | "join"
export type NotificationCategory = "game" | "request" | "invitation"