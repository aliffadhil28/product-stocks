import { encodeActions } from "@/utils/encodeActions";
import axios from "axios";

const API = axios.create({
    headers: {
        "Content-Type": "application/json",
    },
    timeout: 10000,
});

// interceptor → encode header otomatis
API.interceptors.request.use((config) => {
    if (config.meta && config.meta.action) {
        config.headers["X-Action"] = encodeActions(
            config.meta.action.controller,
            config.meta.action.method
        );
    }
    
    return config;
});

/**
 * Fungsi reusable untuk call API Gateway
 * @param {string} controller nama controller (ex: "UserController")
 * @param {string} method nama method (ex: "index")
 * @param {object} payload data body (default = {})
 * @param {string} type HTTP method (default = "post")
 */
export const fetchPost = async (controller, method, payload = {}) => {
    try {
        const response = await API({
            url: "/api/gateway", // gateway endpoint tetap satu pintu
            method: 'post',
            data: payload,
            meta: { action: { controller, method } },
        });

        return response.data;
    } catch (error) {
        throw error;
    }
};
