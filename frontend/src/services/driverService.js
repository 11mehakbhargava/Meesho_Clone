import { API_V1_BASE } from '../config/apiConfig';

/**
 * Driver Service - 100% PostgreSQL Database Driven
 */

const getDriverHeaders = () => {
  const token =
    localStorage.getItem('mshoppy_driver_token') ||
    localStorage.getItem('token') ||
    localStorage.getItem('mshoppy_auth_token');
  const storedDriver = localStorage.getItem('mshoppy_driver_session');
  let driverId = localStorage.getItem('mshoppy_driver_id') || '';
  let driverPhone = localStorage.getItem('mshoppy_driver_phone') || '';
  try {
    if (storedDriver) {
      const parsed = JSON.parse(storedDriver);
      if (parsed?.id) driverId = parsed.id;
      if (parsed?.phone) driverPhone = parsed.phone;
    }
  } catch (_) {}

  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { 'Authorization': `Bearer ${token}` } : {})
  };

  if (driverId && driverId !== 'driver_local_01') {
    headers['x-driver-id'] = driverId;
  }
  if (driverPhone) {
    headers['x-driver-phone'] = driverPhone;
  }

  return headers;
};

export async function fetchDriverDashboard() {
  const res = await fetch(`${API_V1_BASE}/driver/dashboard`, {
    headers: getDriverHeaders()
  });
  if (!res.ok) throw new Error('Failed to fetch driver dashboard');
  const data = await res.json();
  return data.data;
}

export async function fetchAvailableTasks() {
  const res = await fetch(`${API_V1_BASE}/driver/available-tasks`, {
    headers: getDriverHeaders()
  });
  if (!res.ok) throw new Error('Failed to fetch available tasks');
  const data = await res.json();
  return data.tasks || [];
}

export async function fetchTaskDetails(taskId) {
  const res = await fetch(`${API_V1_BASE}/driver/task/${encodeURIComponent(taskId)}`, {
    headers: getDriverHeaders()
  });
  if (!res.ok) throw new Error('Failed to fetch task details');
  const data = await res.json();
  return data.task;
}

export async function acceptDeliveryTask(taskId) {
  const res = await fetch(`${API_V1_BASE}/driver/accept-task/${encodeURIComponent(taskId)}`, {
    method: 'POST',
    headers: getDriverHeaders()
  });
  if (!res.ok) throw new Error('Failed to accept task');
  return res.json();
}

export async function startDeliveryRun(taskId) {
  const res = await fetch(`${API_V1_BASE}/driver/start-run/${encodeURIComponent(taskId)}`, {
    method: 'POST',
    headers: getDriverHeaders()
  });
  if (!res.ok) throw new Error('Failed to start run');
  return res.json();
}

export async function verifyDeliveryOtp(taskId, otp) {
  const res = await fetch(`${API_V1_BASE}/driver/verify-otp`, {
    method: 'POST',
    headers: getDriverHeaders(),
    body: JSON.stringify({ taskId, otp })
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'OTP verification failed');
  return data;
}

export async function fetchDeliveryHistory() {
  const res = await fetch(`${API_V1_BASE}/driver/history`, {
    headers: getDriverHeaders()
  });
  if (!res.ok) throw new Error('Failed to fetch delivery history');
  const data = await res.json();
  return data.deliveries || [];
}

export async function fetchDriverEarnings() {
  const res = await fetch(`${API_V1_BASE}/driver/earnings`, {
    headers: getDriverHeaders()
  });
  if (!res.ok) throw new Error('Failed to fetch driver earnings');
  const data = await res.json();
  return data.earnings;
}

export async function fetchReversePickups() {
  const res = await fetch(`${API_V1_BASE}/driver/reverse-pickups`, {
    headers: getDriverHeaders()
  });
  if (!res.ok) throw new Error('Failed to fetch reverse pickups');
  const data = await res.json();
  return data.returns || [];
}

/**
 * Driver Mobile Authentication
 */
export async function sendDriverOtp(phone) {
  const res = await fetch(`${API_V1_BASE}/driver/auth/send-otp`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ phone })
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Failed to send OTP');
  return data;
}

export async function verifyDriverOtp(phone, otp, fullName, firebaseUid) {
  const res = await fetch(`${API_V1_BASE}/driver/auth/verify-otp`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ phone, otp, fullName, firebaseUid })
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Failed to verify OTP');
  
  if (data.driver && data.token) {
    localStorage.setItem('mshoppy_driver_session', JSON.stringify(data.driver));
    localStorage.setItem('mshoppy_driver_token', data.token);
    localStorage.setItem('mshoppy_driver_id', data.driver.id);
    localStorage.setItem('mshoppy_driver_phone', data.driver.phone);
  }
  return data;
}

export function getStoredDriver() {
  try {
    const raw = localStorage.getItem('mshoppy_driver_session');
    return raw ? JSON.parse(raw) : null;
  } catch (_) {
    return null;
  }
}

export function clearDriverSession() {
  localStorage.removeItem('mshoppy_driver_session');
  localStorage.removeItem('mshoppy_driver_token');
  localStorage.removeItem('mshoppy_driver_id');
  localStorage.removeItem('mshoppy_driver_phone');
}

/**
 * Driver KYC Onboarding (DL, RC, Aadhar)
 */
export async function submitDriverKyc(formData) {
  const res = await fetch(`${API_V1_BASE}/driver/kyc/submit`, {
    method: 'POST',
    headers: getDriverHeaders(),
    body: JSON.stringify(formData)
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Failed to submit KYC');
  return data;
}

export async function fetchDriverKycStatus() {
  const res = await fetch(`${API_V1_BASE}/driver/kyc/status`, {
    headers: getDriverHeaders()
  });
  if (!res.ok) throw new Error('Failed to fetch KYC status');
  return res.json();
}

export async function adminApproveDriver(driverId, status = 'APPROVED') {
  const res = await fetch(`${API_V1_BASE}/driver/admin/approve/${encodeURIComponent(driverId)}`, {
    method: 'POST',
    headers: getDriverHeaders(),
    body: JSON.stringify({ status })
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Failed to approve driver');
  return data;
}
