import { BrowserRouter, Route, Routes } from "react-router-dom"
import ScamAnalyzerPage from "./pages/scam/ScamAnalyzerPage"
import { LoginPage } from "./pages/auth/LoginPage"
import { RegisterPage } from "./pages/auth/RegisterPage"
import BillAnalyzerPage from "./pages/bill/BillPage"
import HomePage from "./pages/HomePage"
import AppShell from "./components/layout/AppShell"

function App() {

  return (
    <BrowserRouter>
      <AppShell>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/scam" element={<ScamAnalyzerPage />} />
          <Route path="/bill" element={<BillAnalyzerPage />} />
        </Routes>
      </AppShell>
    </BrowserRouter>
  )
}

export default App