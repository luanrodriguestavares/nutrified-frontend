import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { LoginPage } from "./pages/loginPage";
import { RegisterPage } from "./pages/registerPage";
import { DashboardPage } from "./pages/dashboardPage";
import { RegisterMealPage } from "./pages/registerMealPage";
import { RegisterWaterPage } from "./pages/registerWaterPage";
import { MealHistoryPage } from './pages/mealHistoryPage';
import { UserProfilePage } from './pages/userProfilePage';
import { ToastProvider } from './components/toast';

function App() {
    return (
        <ToastProvider>
            <Router>
                <div className="flex">
                    <div className="flex-grow">
                        <Routes>
                            <Route path="/login" element={<LoginPage />} />
                            <Route path="/register" element={<RegisterPage />} />
                            <Route path="/dashboard" element={<DashboardPage />} />
                            <Route path="/register-meal" element={<RegisterMealPage />} />
                            <Route path="/register-water" element={<RegisterWaterPage />} />
                            <Route path="/meal-history" element={<MealHistoryPage />} />
                            <Route path="/user-profile" element={<UserProfilePage />} />
                            <Route path="/" element={<DashboardPage />} />
                        </Routes>
                    </div>
                </div>
            </Router>
        </ToastProvider>
    );
}

export default App;
