import axios from "axios";
import { API_URL } from "@/env";
import { getToken } from "../utils/token";

export const getNotificationsAsync = async () => {
    try {
        const token = await getToken();
        const response = await axios.get(
            `${API_URL}/notifications`, {
                headers: {
                    'x-auth-token': token
                }
            }
        )
        console.log(response.data);
        return response.data;
    } catch (error: any) {
        console.log(error)
        throw new Error("Get notifications failed.")
    }
}

export const markAsReadAsync = async (notificationId: string) => {
    try {
        const token = await getToken();
        const response = await axios.put(
            `${API_URL}/notifications/${notificationId}/read`,
            {},
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
        throw new Error("Mark as read failed.")
    }
}

