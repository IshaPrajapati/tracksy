import { getNotifications } from '@/actions/user'
import { NotificationList } from '@/components/notifications/notification-list'
import { MarkAllReadButton } from '@/components/notifications/mark-all-read-button'
import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'Notifications' }

export default async function NotificationsPage() {
  const { data: notifications } = await getNotifications()

  return (
    <div className="max-w-2xl mx-auto space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Notifications</h1>
          <p className="text-muted-foreground mt-1">{notifications.filter((n) => !n.is_read).length} unread</p>
        </div>
        {notifications.some((n) => !n.is_read) && <MarkAllReadButton />}
      </div>
      <NotificationList initialNotifications={notifications} />
    </div>
  )
}
