import axios from "axios";

const api = axios.create({
    baseURL: 'http://localhost:5000'
});

api.interceptors.request.use(config => {
    const token = localStorage.getItem('accessToken');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

api.interceptors.response.use(
    response => response,
    async error => {
        const originalRequest = error.config;

        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;

            try {
                const refreshResponse = await api.post('/authentication/refresh', {
                    refreshToken: localStorage.getItem('refreshToken')
                });

                const {accessToken, refreshToken} = refreshResponse.data;

                localStorage.setItem('accessToken', accessToken);
                localStorage.setItem('refreshToken', refreshToken);

                originalRequest.headers.Authorization = `Bearer ${newAccess}`;
                return api(originalRequest);
            } catch (refreshErr) {
                localStorage.clear();
                window.location.href = '/login';
            }
        }

        return Promise.reject(error);
    }
);

export default api;