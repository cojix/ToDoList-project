import React, { useState } from 'react';

function AuthPage({ onLoginSuccess }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [mode, setMode] = useState('login'); // 'login' or 'register'

  const handleSubmit = async () => {
    const url = mode === 'login'
      ? 'http://127.0.0.1:5000/auth/login'
      : 'http://127.0.0.1:5000/auth/register';

    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    });
    const data = await res.json();

    if (res.ok && mode === 'login') {
      // 登录成功，保存 token 到 localStorage
      localStorage.setItem('token', data.token);
      onLoginSuccess(); // 通知父组件：登录成功，切换到 TodoList 界面
    } else if (res.ok && mode === 'register') {
      alert('注册成功，请切换到登录！');
    } else {
      alert(data.error || '请求失败');
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-gray-100">
      <div className="p-6 bg-white shadow-md rounded-md">
        <h1 className="text-2xl font-bold mb-4">
          {mode === 'login' ? '登录' : '注册'}
        </h1>
        <input
          className="border p-2 mb-2 w-full"
          type="text"
          placeholder="用户名"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <input
          className="border p-2 mb-2 w-full"
          type="password"
          placeholder="密码"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button
          onClick={handleSubmit}
          className="bg-blue-500 text-white px-4 py-2 rounded-md w-full mb-2 hover:bg-blue-600 transition"
        >
          {mode === 'login' ? '登录' : '注册'}
        </button>
        <button
          onClick={() => setMode(mode === 'login' ? 'register' : 'login')}
          className="text-blue-500 hover:underline"
        >
          切换到{mode === 'login' ? '注册' : '登录'}
        </button>
      </div>
    </div>
  );
}

export default AuthPage;
