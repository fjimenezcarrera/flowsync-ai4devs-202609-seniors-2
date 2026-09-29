import { BrowserRouter, Navigate, Route, Routes } from 'react-router'
import { AuthProvider } from '@/auth/AuthProvider'
import { GuestOnly, RequireAuth } from '@/auth/routes'
import { LoginPage } from '@/pages/LoginPage'
import { ProfilePage } from '@/pages/ProfilePage'
import { SignupPage } from '@/pages/SignupPage'

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route
            path="/"
            element={
              <RequireAuth>
                <ProfilePage />
              </RequireAuth>
            }
          />
          <Route
            path="/login"
            element={
              <GuestOnly>
                <LoginPage />
              </GuestOnly>
            }
          />
          <Route
            path="/signup"
            element={
              <GuestOnly>
                <SignupPage />
              </GuestOnly>
            }
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}
