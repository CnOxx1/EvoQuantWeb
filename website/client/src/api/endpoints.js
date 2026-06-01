import apiClient from './client';

// Pages
export const getPage = (slug) => apiClient.get(`/pages/${slug}`);
export const getPages = () => apiClient.get('/pages');
export const updatePage = (slug, data) => apiClient.put(`/pages/${slug}`, data);

// Sections
export const getSections = (pageId) => apiClient.get(`/sections/${pageId}`);
export const createSection = (data) => apiClient.post('/sections', data);
export const updateSection = (id, data) => apiClient.put(`/sections/${id}`, data);
export const deleteSection = (id) => apiClient.delete(`/sections/${id}`);

// Links
export const getLinks = (category) => apiClient.get('/links', { params: category ? { category } : {} });
export const getAllLinks = () => apiClient.get('/links/admin/all');
export const createLink = (data) => apiClient.post('/links', data);
export const updateLink = (id, data) => apiClient.put(`/links/${id}`, data);
export const deleteLink = (id) => apiClient.delete(`/links/${id}`);

// Founders
export const getFounders = () => apiClient.get('/founders');
export const getAllFounders = () => apiClient.get('/founders/admin/all');
export const createFounder = (data) => apiClient.post('/founders', data);
export const updateFounder = (id, data) => apiClient.put(`/founders/${id}`, data);
export const deleteFounder = (id) => apiClient.delete(`/founders/${id}`);

// Partners
export const getPartners = () => apiClient.get('/partners');
export const getAllPartners = () => apiClient.get('/partners/admin/all');
export const createPartner = (data) => apiClient.post('/partners', data);
export const updatePartner = (id, data) => apiClient.put(`/partners/${id}`, data);
export const deletePartner = (id) => apiClient.delete(`/partners/${id}`);

// Translations
export const getTranslations = (lang) => apiClient.get(`/translations/${lang}`);
export const getAdminTranslations = (lang) => apiClient.get(`/translations/admin/${lang}`);
export const updateTranslations = (lang, data) => apiClient.put(`/translations/${lang}`, data);

// Settings
export const getPublicSettings = () => apiClient.get('/settings/public');
export const getAllSettings = () => apiClient.get('/settings/admin/all');
export const updateSettings = (data) => apiClient.put('/settings/admin/all', data);

// Auth
export const login = (username, password) => apiClient.post('/auth/login', { username, password });
export const verifyToken = () => apiClient.get('/auth/verify');

// Contact
export const submitContact = (data) => apiClient.post('/contact', data);
export const getContacts = (page = 1) => apiClient.get(`/contact/admin/all?page=${page}`);
export const markContactRead = (id) => apiClient.put(`/contact/admin/${id}/read`);

// Upload
export const uploadFile = (file) => {
  const formData = new FormData();
  formData.append('file', file);
  return apiClient.post('/upload', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
};
