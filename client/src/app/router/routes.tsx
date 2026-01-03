import { Routes, Route } from "react-router-dom";
import Home from "../../pages/Home";
import Login from "../../pages/auth/Login";
import Register from "../../pages/auth/Register";
import NotFound from "../../pages/NotFound";

export const AppRoutes = () => {
  return (
    <Routes>
      {/* Головна сторінка */}
      <Route path="/" element={<Home />} />

      {/* Публічні сторінки */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* 404 */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};