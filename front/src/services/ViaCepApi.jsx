import axios from 'axios';

const viaCepApi = axios.create({
    baseURL: 'https://viacep.com.br/ws',
    withCredentials: false,
    headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
    }
});

export default viaCepApi;