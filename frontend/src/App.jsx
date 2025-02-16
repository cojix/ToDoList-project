
import React, { useState } from 'react';
import AuthPage from './AuthPage';
import TodoList from './TodoList';  // TodoList 组件

function App() {
  // 判断是否已登录（token 存在）
  const [isLoggedIn, setIsLoggedIn] = useState(
    !!localStorage.getItem('token')
  );

  const handleLoginSuccess = () => {
    setIsLoggedIn(true);
  };

  return (
    <div>
      {isLoggedIn ? (
        <TodoList />
      ) : (
        <AuthPage onLoginSuccess={handleLoginSuccess} />
      )}
    </div>
  );
}

export default App;

