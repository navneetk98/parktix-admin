import axios from 'axios';
export default () => axios.create({
    headers: {
        'Content-Type': 'application/json',
        "accept": "application/json",
        'authorization': `Bearer ${localStorage.getItem('authToken')}`,
    },
});