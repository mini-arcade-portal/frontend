import { BrowserRouter, Routes, Route, Outlet } from 'react-router-dom'

import { TopNav } from '@/components/TopNav'
import { ProtectedRoute } from '@/components/ProtectedRoute'

import { LoginPage } from '@/pages/LoginPage'
import { RegisterPage } from '@/pages/RegisterPage'
import { HomePage } from '@/pages/HomePage'
import { PlayPage } from '@/pages/PlayPage'
import { LeaderboardPage } from '@/pages/LeaderboardPage'
import { MyScoresPage } from '@/pages/MyScoresPage'

function Layout() {
  return (
    <div className="max-w-[1240px] mx-auto px-8 py-6 pb-16">
      <TopNav />
      <Outlet />
    </div>
  )
}

export function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          {/* public */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          {/* protected */}
          <Route element={<ProtectedRoute />}>
            <Route path="/" element={<HomePage />} />
            <Route path="/play/:slug" element={<PlayPage />} />
            <Route path="/leaderboard" element={<LeaderboardPage />} />
            <Route path="/me" element={<MyScoresPage />} />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
