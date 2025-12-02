export interface Notification {
    type: NotificationType,
    title: string,
    date: Date,
    unread: boolean
}

export type NotificationType = "accept" | "reject" | "pending"