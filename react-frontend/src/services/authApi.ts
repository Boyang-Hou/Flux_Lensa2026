import type { LoginCredentials, RegisterCredentials, AuthResponse, User } from '../types/auth';

const API_BASE = import.meta.env.VITE_API_BASE || 'https://placeholder.ngrok.io';
const USE_MOCK = import.meta.env.VITE_USE_MOCK === 'true' || import.meta.env.DEV;

const MOCK_USERS_KEY = 'lensa_mock_users';
const MOCK_DELAY = 500;
const DEFAULT_MOCK_USER: MockUser = {
  id: 'mock_default_user',
  email: 'demo@lensa.local',
  name: 'Demo User',
  password: '123456',
  cefrLevel: null,
  hasCompletedTest: false,
  createdAt: '2026-05-01T00:00:00.000Z',
};

interface MockUser extends User {
  password: string;
}

function getMockUsers(): MockUser[] {
  const stored = localStorage.getItem(MOCK_USERS_KEY);
  let users: MockUser[] = [];

  try {
    users = stored ? JSON.parse(stored) : [];
  } catch {
    users = [];
  }

  if (!users.some(user => user.email === DEFAULT_MOCK_USER.email)) {
    const seededUsers = [DEFAULT_MOCK_USER, ...users];
    saveMockUsers(seededUsers);
    return seededUsers;
  }

  return users;
}

function saveMockUsers(users: MockUser[]) {
  localStorage.setItem(MOCK_USERS_KEY, JSON.stringify(users));
}

function generateToken(): string {
  return 'mock_token_' + Math.random().toString(36).substring(2) + Date.now().toString(36);
}

function generateUserId(): string {
  return 'user_' + Math.random().toString(36).substring(2) + Date.now().toString(36);
}

async function mockLogin(credentials: LoginCredentials): Promise<AuthResponse> {
  await new Promise(resolve => setTimeout(resolve, MOCK_DELAY));

  const email = credentials.email.trim().toLowerCase();
  const users = getMockUsers();
  const user = users.find(u => u.email.toLowerCase() === email);

  if (!user) {
    throw new Error('用户不存在');
  }

  if (user.password !== credentials.password) {
    throw new Error('密码错误');
  }

  const token = generateToken();
  const { password: _, ...userWithoutPassword } = user;

  return {
    user: userWithoutPassword,
    token,
  };
}

async function mockRegister(credentials: RegisterCredentials): Promise<AuthResponse> {
  await new Promise(resolve => setTimeout(resolve, MOCK_DELAY));

  const users = getMockUsers();

  if (users.some(u => u.email === credentials.email)) {
    throw new Error('该邮箱已被注册');
  }

  const newUser: MockUser = {
    id: generateUserId(),
    email: credentials.email,
    name: credentials.name,
    password: credentials.password,
    cefrLevel: null,
    hasCompletedTest: false,
    createdAt: new Date().toISOString(),
  };

  users.push(newUser);
  saveMockUsers(users);

  const token = generateToken();
  const { password: _, ...userWithoutPassword } = newUser;

  return {
    user: userWithoutPassword,
    token,
  };
}

async function apiLogin(credentials: LoginCredentials): Promise<AuthResponse> {
  const response = await fetch(`${API_BASE}/api/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(credentials),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: '登录失败' }));
    throw new Error(error.message || '登录失败');
  }

  return response.json();
}

async function apiRegister(credentials: RegisterCredentials): Promise<AuthResponse> {
  const response = await fetch(`${API_BASE}/api/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(credentials),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: '注册失败' }));
    throw new Error(error.message || '注册失败');
  }

  return response.json();
}

export async function login(credentials: LoginCredentials): Promise<AuthResponse> {
  if (USE_MOCK) {
    return mockLogin(credentials);
  }
  return apiLogin(credentials);
}

export async function register(credentials: RegisterCredentials): Promise<AuthResponse> {
  if (USE_MOCK) {
    return mockRegister(credentials);
  }
  return apiRegister(credentials);
}

export async function updateUserLevel(userId: string, cefrLevel: 'A1' | 'A2' | 'B1'): Promise<User> {
  if (USE_MOCK) {
    await new Promise(resolve => setTimeout(resolve, MOCK_DELAY));
    const users = getMockUsers();
    const userIndex = users.findIndex(u => u.id === userId);

    if (userIndex === -1) {
      throw new Error('用户不存在');
    }

    users[userIndex] = {
      ...users[userIndex],
      cefrLevel,
      hasCompletedTest: true,
    };

    saveMockUsers(users);

    const { password: _, ...userWithoutPassword } = users[userIndex];
    return userWithoutPassword;
  }

  const response = await fetch(`${API_BASE}/api/user/level`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ userId, cefrLevel }),
  });

  if (!response.ok) {
    throw new Error('更新用户水平失败');
  }

  return response.json();
}
