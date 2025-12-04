import axios from "axios";
import { API_URL } from "@/env";
import { getToken } from "../utils/token";

export const getMyGamesAsync = async () => {
    try {
        const token = await getToken();
        const response = await axios.get(
            `${API_URL}/games/my`, {
                headers: {
                    'x-auth-token': token
                }
            }
        )
        console.log(response.data);
        return response.data;
    } catch (error: any) {
        console.log(error)
        throw new Error("Get my games failed.")
    }
}

export const createGameAsync = async (newGame: { name: string, sportType: string, inviteEmails: string[], maxPlayers: number, location: string, startAt: string }) => {
    try {
        const token = await getToken();
        const response = await axios.post(
            `${API_URL}/games/create`, 
            newGame,
            {headers: {'x-auth-token': token},}
        )
        console.log(response.data.game);
        return response.data.game;
    } catch (error: any) {
        console.log(error)
        throw new Error("Create new game failed.")
    }
}

export const getGameByIdAsync = async (gameId: string) => {
    try {
        const token = await getToken();
        const response = await axios.get(
            `${API_URL}/games/${gameId}`,
            {
                headers: {
                    'x-auth-token': token
                }
            }
        )
        console.log(response.data);
        return response.data;
    } catch (error: any) {
        console.log(error)
        throw new Error("Get game by ID failed.")
    }
}

export const sendRequestAsync = async (gameId: string) => {
    try {
        const token = await getToken();
        const response = await axios.post(
            `${API_URL}/games/request`,
            { gameId },
            {
                headers: {
                    'x-auth-token': token
                }
            }
        )
        console.log(response.data);
        return response.data;
    } catch (error: any) {
        console.log(error)
        throw new Error("Send request failed.")
    }
}

export const getGamesSoonAsync = async () => {
    try {
        const token = await getToken();
        const response = await axios.get(
            `${API_URL}/games/soon`, {
                headers: {
                    'x-auth-token': token
                }
            }
        )
        console.log(response.data);
        return response.data;
    } catch (error: any) {
        console.log(error)
        throw new Error("Get games soon failed.")
    }
}

export const acceptInviteAsync = async (gameId: string) => {
    try {
        const token = await getToken();
        const response = await axios.post(
            `${API_URL}/games/accept`,
            { gameId },
            {
                headers: {
                    'x-auth-token': token
                }
            }
        )
        console.log(response.data);
        return response.data;
    } catch (error: any) {
        console.log(error)
        throw new Error("Accept invite failed.")
    }
}