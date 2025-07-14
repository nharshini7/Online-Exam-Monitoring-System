import React, { createContext, useContext, useState } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const initialToken = localStorage.getItem('token');
  const initialUsername = localStorage.getItem('username');
  const initialFirstname = localStorage.getItem('firstname');
  const initialLastname = localStorage.getItem('lastname');
  const initialSubject = localStorage.getItem('subject');

  const [auth, setAuth] = useState(initialToken);
  const [username, setUsername] = useState(initialUsername);
  const [firstname, setFirstname] = useState(initialFirstname);
  const [lastname, setLastname] = useState(initialLastname);
  const [subject, setSubject] = useState(initialSubject);

  const login = (token, username, firstname, lastname, subject) => {
    localStorage.setItem('token', token);
    localStorage.setItem('username', username);
    localStorage.setItem('firstname', firstname);
    localStorage.setItem('lastname', lastname);
    localStorage.setItem('subject', subject);

    setAuth(token);
    setUsername(username);
    setFirstname(firstname);
    setLastname(lastname);
    setSubject(subject);
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    localStorage.removeItem('firstname');
    localStorage.removeItem('lastname');
    localStorage.removeItem('subject');

    setAuth(null);
    setUsername(null);
    setFirstname(null);
    setLastname(null);
    setSubject(null);
  };

  return (
    <AuthContext.Provider value={{ auth, username, firstname, lastname, subject, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
