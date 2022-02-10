import { io } from 'socket.io-client';

import { getCookies } from '../api';

export const socket = io("http://localhost:3001",{
    autoConnect: false,
    withCredentials: true,
    extraHeaders: {
        "x-csrf-token": getCookies()['messenger-csrfToken'] || getCookies()[' messenger-csrfToken']
    }
});