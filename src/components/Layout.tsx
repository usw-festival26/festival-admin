import { ReactNode } from 'react'
import Sidebar from './Sidebar'
import TopBar from './TopBar'

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <div className="admin-wrapper">
      <Sidebar />
      <main className="main-content">
        <TopBar />
        {children}
      </main>
    </div>
  )
}
