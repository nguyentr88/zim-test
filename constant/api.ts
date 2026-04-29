import Config from 'react-native-config';

const {
    HOST = 'https://api.example.com/',
} = Config || {};

const API = 'api/';

// ================================> HOME <================================
export const API_GET_MEMORABLE_MOMENTS = `${HOST}${API}memorable-moments`;

