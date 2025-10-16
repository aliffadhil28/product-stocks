import DashboardNavigation from '@/Components/Layouts/dashboard/DashboardNavigation'
import React, { useEffect, useState } from 'react'
import { usePage } from '@inertiajs/react'
import { Head } from '@inertiajs/react';
import ThemeSwitcher from '@/Components/ThemeSwitcher';
import { Sheet, SheetContent, SheetTrigger } from '@/Components/ui/sheet';
import LucideIcon from '@/Components/LucideIcons';
import { applyTheme } from '@/utils/helper';
import { Popover, PopoverContent, PopoverTrigger } from '@/Components/ui/popover';
import Notifications from '@/Components/Notifications';
import echo from '@/echo';
import { toast } from "sonner";
import { fetchPost } from '@/hooks/Api';

const DashboardLayout = ({ header, children }) => {
    const { appName, auth, menu, groups } = usePage().props;
    const [notifications, setNotifications] = useState([]);

    const user = auth.user;
    const role = auth.user.role;
    const permissions = auth.user.permissions;

    const countNotificationUnread = notifications && notifications.length > 0 ? notifications.filter((notif) => notif.is_read == 0).length : 0

    useEffect(() => {
        setNotifications(user?.notifications ?? []);
        const savedTheme = localStorage.getItem("selectedTheme");
        if (savedTheme) {
            applyTheme(savedTheme);
        }
    }, []);

    const fetchNotification = async () => {
        try {
            const response = await fetchPost('UserController', 'getNotifications', { user_id: user.id })
            if (response) {
                setNotifications(response.data)
            }
        } catch (error) {
            toast.error(error.message)
        }
    }

    useEffect(() => {
        if (!user?.id) return;

        const channelName = `user.${user.id}`

        echo.private(channelName)
            .listen('.user.notification', async (e) => {
                await fetchNotification()
                toast.info(e.message)
            })

        return () => {
            echo.leave(channelName)
        }
    }, [user?.id])

    return (
        <>
            <Head title={header} />
            <div className="flex">
                <DashboardNavigation user={user} role={role} permissions={permissions} groups={groups} menu={menu} header={header} />
                <section className="flex flex-col h-screen overflow-y-auto w-full">
                    <header className='sticky top-0 border-b border-muted py-4 bg-white dark:bg-black text-left text-sm p-6'>
                        <div className='flex justify-between items-center'>
                            <h2 className="font-semibold text-xl text-gray-800 leading-tight dark:text-gray-200">
                                {header.includes('-') ? header.split('-')[1] : header}
                            </h2>

                            <div className='flex items-center gap-4'>
                                <Popover>
                                    <PopoverTrigger asChild>
                                        <button className="ml-auto mr-4">
                                            <LucideIcon name={`Bell${countNotificationUnread > 0 ? 'Dot' : ''}`} className={`h-5 w-5 text-gray-600 hover:text-gray-900 ${countNotificationUnread > 0 && 'font-bold text-yellow-500'}`} />
                                        </button>
                                    </PopoverTrigger>
                                    <PopoverContent className="mt-2 w-80 mr-7 bg-white border border-gray-200 rounded-md shadow-lg dark:bg-black">
                                        <Notifications notifications={notifications} fetchNotification={fetchNotification} />
                                    </PopoverContent>
                                </Popover>
                                <Sheet>
                                    <SheetTrigger asChild>
                                        <button className="ml-auto">
                                            <LucideIcon name="Settings" className="h-5 w-5 text-gray-600 hover:text-gray-900" />
                                        </button>
                                    </SheetTrigger>
                                    <SheetContent side="right" className="w-1/4">
                                        <ThemeSwitcher />
                                    </SheetContent>
                                </Sheet>
                            </div>
                        </div>
                    </header>
                    <main className="flex-1 p-6 overflow-y-auto">{children}</main>
                    <footer className='bottom-0 border-t border-muted shadow bg-gray-100 py-4 text-center text-sm dark:bg-black dark:text-gray-200'>
                        {appName} © {new Date().getFullYear()}
                    </footer>
                </section>
            </div>
        </>
    )
}

export default DashboardLayout