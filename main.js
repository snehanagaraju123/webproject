// public/js/main.js
// Utility: read / write current user in sessionStorage
export function setCurrentUser(user) { sessionStorage.setItem("student", JSON.stringify(user)); }
export function getCurrentUser()     { return JSON.parse(sessionStorage.getItem("student") || "null"); }
export function logout()             { sessionStorage.removeItem("student"); location.href="login.html"; }
