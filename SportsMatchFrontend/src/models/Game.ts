export interface Game {
    name: string;
    sportType: string;
    creator: string;
    players: string[];
    maxPlayers: number;
    status: string;
    startAt: Date;
    createdAt: Date;
}