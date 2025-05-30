import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "@/pages/Home";
import { ToastManager } from "@/components/toast/ToastManager";

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
      </Routes>
      <ToastManager />
    </BrowserRouter>
  );
};

export default App;
