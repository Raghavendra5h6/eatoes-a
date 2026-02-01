const BASE = '/api';

async function request(path, options = {}) {
  const url = path.startsWith('http') ? path : `${BASE}${path}`;
  const res = await fetch(url, {
    headers: { 'Content-Type': 'application/json', ...options.headers },
    ...options,
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || res.statusText);
  return data;
}

export const menuApi = {
  getAll: (category) => request(category ? `/menu?category=${encodeURIComponent(category)}` : '/menu'),
  getOne: (id) => request(`/menu/${id}`),
  create: (body) => request('/menu', { method: 'POST', body: JSON.stringify(body) }),
  update: (id, body) => request(`/menu/${id}`, { method: 'PUT', body: JSON.stringify(body) }),
  toggleAvailability: (id) => request(`/menu/${id}/availability`, { method: 'PATCH' }),
  delete: (id) => request(`/menu/${id}`, { method: 'DELETE' }),
};

export const ordersApi = {
  getAll: (status) => request(status ? `/orders?status=${encodeURIComponent(status)}` : '/orders'),
  getOne: (id) => request(`/orders/${id}`),
  create: (body) => request('/orders', { method: 'POST', body: JSON.stringify(body) }),
  updateStatus: (id, status) =>
    request(`/orders/${id}/status`, { method: 'PATCH', body: JSON.stringify({ status }) }),
  delete: (id) => request(`/orders/${id}`, { method: 'DELETE' }),
};
