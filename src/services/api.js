import axios from "axios";

const BASE_URL = "https://dynamic-form-backend-gumc.onrender.com";

export const getFormById = (id) => axios.get(`${BASE_URL}/api/forms/${id}`);
