import axios from 'axios';

const API = axios.create({ baseURL: 'http://localhost:5000/api/bookings' });

export const fetchAvailability = (date) => API.get(`/availability?date=${date}`);
export const createBooking = (data) => API.post('/', data);
export const fetchAdminAll = () => API.get('/admin/all');
export const updateStatus = (id, status) => API.patch(`/${id}/status`, { status });