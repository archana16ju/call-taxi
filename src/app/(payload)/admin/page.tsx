'use client'

import AdminLayout from '@/payload/admin/components/AdminLayout'
import MainDashboard from '@/payload/admin/components/MainDashboard'

export default function AdminPage() {
  return (
    <AdminLayout>
      <MainDashboard />
    </AdminLayout>
  )
}