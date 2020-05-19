import axios from "axios";

export default () => {
    return axios.create({
        withCredentials: true
    }).interceptors.response.use((response) => {
        return response;
    }, (error) => {
        return Promise.resolve({ error });
    });
};
