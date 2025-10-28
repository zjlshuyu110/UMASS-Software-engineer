import axios from "axios";
import { API_URL } from "@/env";
import { getToken } from "../utils/token";

export const getGamesAsync = async () => {
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

export const createGameAsync = async (newGame: { name: string, sportType: string, inviteEmails: string[] }) => {
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