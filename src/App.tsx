import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "@/pages/Home";
import SDK from "@/pages/SDK";
import { ToastManager } from "@/components/toast/ToastManager";

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/sdk" element={<SDK />} />
      </Routes>
      <ToastManager />
    </BrowserRouter>
  );
};

export default App;
