import { Separator } from "./ui/separator";
import { Button } from "./ui/button";
import { Check, CheckCircle, Bell } from "lucide-react";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { fetchPost } from "@/hooks/Api";
import { usePage } from "@inertiajs/react";

export default function Notifications({ notifications, fetchNotification }) {
    const { auth } = usePage().props;
    const [notificationItems, setNotificationItems] = useState([]);

    useEffect(() => {
        if (notifications > 0) {
            setNotificationItems(
                notifications.map((notif, index) => ({
                    id: notif.id,
                    message: notif?.message ? notif.message : notif,
                    read: notif.is_read,
                    timestamp: new Date(Date.now() - notif.id * 60000), // dummy timestamp
                    ...notif
                }))
            )
        }
    }, [notifications])

    const user = auth.user;

    const markAsRead = async (id) => {
        setNotificationItems(prev =>
            prev.map(notif =>
                notif.id === id ? { ...notif, read: true } : notif
            )
        );

        try {
            const response = await fetchPost('UserController', 'setNotifRead', { id });
            if(response){
                toast.success(response.message);
                fetchNotification()
            }
        } catch (error) {
            toast.error(error.message);
        }
    };

    const markAllAsRead = async () => {
        setNotificationItems(prev => prev.map(notif => ({ ...notif, read: true })));

        try {
            const response = await fetchPost('UserController', 'setAllNotifRead', { user_id: user.id });
            if(response){
                toast.success(response.message);
                fetchNotification()
            }
        } catch (error) {
            toast.error(error.message);
        }
    };


    const unreadCount = notificationItems.filter(notif => !notif.read).length;

    return (
        <div>
            {/* Header */}
            <div className="p-4 border-b border-gray-100">
                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                        <Bell className="h-5 w-5 text-blue-600" />
                        <h2 className="font-semibold text-lg text-gray-800">Notifications</h2>
                        {unreadCount > 0 && (
                            <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                                {unreadCount}
                            </span>
                        )}
                    </div>
                    {unreadCount > 0 && (
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={markAllAsRead}
                            className="text-xs text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                        >
                            <CheckCircle className="h-4 w-4 mr-1" />
                            Mark all read
                        </Button>
                    )}
                </div>
            </div>

            {/* Notifications List */}
            <div className="max-h-96 overflow-y-auto">
                {notificationItems.length === 0 ? (
                    <div className="p-6 text-center text-gray-500">
                        <Bell className="h-12 w-12 text-gray-300 mx-auto mb-2" />
                        <p>No notifications yet</p>
                        <p className="text-sm">We'll notify you when something arrives</p>
                    </div>
                ) : (
                    <ul>
                        {notificationItems.map((notif, i) => (
                            <li
                                key={notif.id}
                                onClick={() => markAsRead(notif.id)}
                                className={`p-3 border-b border-gray-50 last:border-b-0 transition-all duration-200 cursor-pointer group
                                    ${notif.read
                                        ? "bg-white text-gray-600"
                                        : "bg-blue-50 border-l-4 border-l-blue-500 text-gray-800"
                                    } hover:bg-gray-50 hover:border-l-blue-600`}
                            >
                                <div className="flex items-start justify-between">
                                    <div className="flex-1 min-w-0">
                                        <p className={`text-sm ${notif.read ? "font-normal" : "font-medium"}`}>
                                            {notif.message}
                                        </p>
                                        <p className="text-xs text-gray-500 mt-1">
                                            {notif.time_ago}
                                        </p>
                                    </div>
                                    <div className="flex items-center space-x-2 ml-2">
                                        {!notif.read && (
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    markAsRead(notif.id);
                                                }}
                                                className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 p-1 rounded-full hover:bg-green-100"
                                                title="Mark as read"
                                            >
                                                <Check className="h-3 w-3 text-green-600" />
                                            </button>
                                        )}
                                        {notif.read && (
                                            <CheckCircle className="h-4 w-4 text-green-500" />
                                        )}
                                    </div>
                                </div>
                            </li>
                        ))}
                    </ul>
                )}
            </div>

            {/* Footer */}
            {notificationItems.length > 0 && (
                <>
                    <Separator />
                    <div className="p-3 bg-gray-50 rounded-b-lg">
                        <div className="flex justify-between items-center text-xs text-gray-500">
                            <span>{unreadCount} unread</span>
                            <span>{notificationItems.length} total</span>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}