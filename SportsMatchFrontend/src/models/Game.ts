export interface Game {
    _id?: string;
    name: string;
    sportType: string;
    creator: string;
    players: string[];
    maxPlayers: number;
    status: string;
    startAt: Date;
    createdAt: Date;
    location: string;
    userRole?: 'creator' | 'player' | 'invited' | 'requester';
}