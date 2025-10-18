import axios from 'axios';
import { API_URL } from '@/env';
import { saveToken } from '../utils/token';


export const login = async (email: string, password: string) =>  {
    const response = await axios.post(`${API_URL}/auth/login`, { email, password }, {
        headers: {
            'Content-Type': 'application/json',
        },
    });
    if (response.status === 200) {
        if (response.data.token){
        await saveToken(response.data.token);
        return(response.data.token);
        } else {
            throw new Error('No token')
        }
    } else if (response.status === 400) {
        throw new Error('Invalid credentials');
    } else {
        throw new Error('Login failed');
    }
};


