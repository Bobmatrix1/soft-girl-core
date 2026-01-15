import { Bell, X, Trash2 } from 'lucide-react';
import { Button } from './ui/button';
import { motion, AnimatePresence } from 'motion/react';
import { Notification } from '../utils/api';
import { useEffect, useRef, useState } from 'react';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from './ui/alert-dialog';

interface NotificationPanelProps {
  notifications: Notification[];
  onClose: () => void;
  onMarkAllAsRead: () => void;
  onMarkOneAsRead: (id: string) => void;
  onDeleteAll: () => void;
  onOrderNotificationClick: () => void;
  onProductNotificationClick: (productId: string) => void;
}

export default function NotificationPanel({ 
  notifications, 
  onClose, 
  onMarkAllAsRead, 
  onMarkOneAsRead, 
  onDeleteAll,
  onOrderNotificationClick,
  onProductNotificationClick
}: NotificationPanelProps) {
  const panelRef = useRef<HTMLDivElement>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (panelRef.current && !panelRef.current.contains(event.target as Node)) {
        onClose();
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [panelRef, onClose]);

  const handleNotificationClick = (notification: Notification) => {
    if (!notification.isRead) {
      onMarkOneAsRead(notification.id);
    }
    if (notification.type === 'order') {
      onOrderNotificationClick();
    } else if (notification.type === 'restock' && notification.link) {
      onProductNotificationClick(notification.link);
    }
  };

  return (
    <>
      <AnimatePresence>
        {!showDeleteConfirm && (
          <motion.div
            ref={panelRef}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="fixed top-20 right-4 w-80 bg-white/90 backdrop-blur-md border border-pink-100 rounded-2xl shadow-2xl z-[60]"
          >
            <div className="flex items-center justify-between p-4 border-b border-pink-100">
              <h3 className="font-semibold text-lg flex items-center gap-2"><Bell className="w-5 h-5"/> Notifications</h3>
              <Button variant="ghost" size="icon" onClick={onClose}>
                <X className="w-5 h-5" />
              </Button>
            </div>

            <div className="p-2 max-h-96 overflow-y-auto">
              {notifications.length === 0 ? (
                <div className="text-center py-12 text-muted-foreground">
                  <Bell className="w-12 h-12 mx-auto mb-2 opacity-50" />
                  <p>No new notifications</p>
                </div>
              ) : (
                <div className="space-y-2">
                  {notifications.map((notif) => (
                    <div
                      key={notif.id}
                      onClick={() => handleNotificationClick(notif)}
                      className={`p-3 rounded-lg transition-colors cursor-pointer ${
                        notif.isRead ? 'bg-transparent hover:bg-gray-50/50' : 'bg-pink-50 hover:bg-pink-100'
                      }`}
                    >
                      <p className="text-sm font-semibold capitalize">{notif.type} Alert</p>
                      <p className="text-xs text-muted-foreground">{notif.message}</p>
                      <p className="text-xs text-right text-gray-400 mt-1">
                        {new Date(notif.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {notifications.length > 0 && (
              <div className="p-2 border-t border-pink-100 flex justify-between items-center">
                <Button variant="link" size="sm" onClick={onMarkAllAsRead}>
                  Mark all as read
                </Button>
                <Button variant="ghost" size="icon" className="text-red-500" onClick={() => setShowDeleteConfirm(true)}>
                    <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
      <AlertDialog open={showDeleteConfirm} onOpenChange={setShowDeleteConfirm}>
          <AlertDialogContent>
              <AlertDialogHeader>
              <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
              <AlertDialogDescription>
                  This action cannot be undone. This will permanently delete all of your personal notifications.
              </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={() => { onDeleteAll(); setShowDeleteConfirm(false); }}>Delete</AlertDialogAction>
              </AlertDialogFooter>
          </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
