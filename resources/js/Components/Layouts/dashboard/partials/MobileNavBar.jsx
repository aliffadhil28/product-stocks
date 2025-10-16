import { useState } from "react";
import { Link, usePage } from "@inertiajs/react";
import { Button } from "@/Components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/Components/ui/sheet";
import { hasPermission, hasRole } from "@/utils/userAccess";
import Notifications from "@/Components/Notifications";
import LucideIcon from "@/Components/LucideIcons";
import { Popover, PopoverContent, PopoverTrigger } from "@/Components/ui/popover";

const MobileNavBar = ({
    user,
    header,
    groups,
    menu,
    mainItems,
    hasVisibleItems,
    isGroupActive,
    NavItem,
    DynamicIcon,
    isItemVisible,
    cn
}) => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [notifications, setNotifications] = useState([]);

    const countNotificationUnread = notifications && notifications.length > 0 ? notifications.filter((notif) => notif.is_read == 0).length : 0

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

    // Komponen untuk dropdown mobile
    const MobileDropdown = ({ title, items, icon }) => {
        const [isOpen, setIsOpen] = useState(false);
        const isGroupItemActive = isGroupActive(items);

        // Filter items yang visible
        const visibleItems = items.filter(isItemVisible);

        if (visibleItems.length === 0) {
            return null;
        }

        return (
            <div className="w-full">
                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        setIsOpen(!isOpen);
                    }}
                    className={cn(
                        "flex w-full items-center justify-between gap-3 rounded-lg px-3 py-2 text-sm transition-all hover:bg-accent hover:text-accent-foreground",
                        isGroupItemActive
                            ? "bg-accent text-accent-foreground font-medium"
                            : "text-muted-foreground"
                    )}
                >
                    <div className="flex items-center gap-3">
                        <DynamicIcon name={icon} className="h-4 w-4 flex-shrink-0" />
                        <span>{title}</span>
                    </div>
                    <DynamicIcon
                        name="ChevronDown"
                        className={cn(
                            "h-3 w-3 transition-transform duration-200",
                            isOpen && "rotate-180"
                        )}
                    />
                </button>

                {isOpen && (
                    <div
                        className="mt-1 ml-6 space-y-1"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {visibleItems.map((item, index) => (
                            <NavItem
                                key={index}
                                item={item}
                                className="py-1.5"
                                onClick={() => setIsSidebarOpen(false)}
                            />
                        ))}
                    </div>
                )}
            </div>
        );
    };

    return (
        <div className="lg:hidden">
            <div className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80 border-b">
                <div className="flex items-center justify-between px-4 py-3">
                    <div className="flex items-center gap-3">
                        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                            <DynamicIcon name="LayoutDashboard" className="h-4 w-4" />
                        </div>
                        <div>
                            <h2 className="text-lg font-semibold">{header.includes('-') ? header.split('-')[1] : header}</h2>
                        </div>
                    </div>
                    <div className="flex items-center">
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
                        <Sheet open={isSidebarOpen} onOpenChange={setIsSidebarOpen}>
                            <SheetTrigger asChild>
                                <Button variant="outline" size="icon" onClick={() => setIsSidebarOpen(true)}>
                                    <DynamicIcon name="Menu" className="h-5 w-5" />
                                </Button>
                            </SheetTrigger>
                            <SheetContent side="top" className="w-full">
                                <div className="flex flex-col h-full">
                                    <div className="p-6 border-b">
                                        <div className="flex items-center gap-3">
                                            <DynamicIcon name="LayoutDashboard" className="h-4 w-4" />
                                            <span>{header.includes('-') ? header.split('-')[1] : header}</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex-1 overflow-auto py-4" onClick={(e) => e.stopPropagation()}>
                                    {mainItems?.filter(item => hasPermission(`${String(item.name).toLowerCase()}/view`) || hasRole('admin')).map((item, index) => {
                                        return (
                                            <NavItem
                                                key={index}
                                                item={item}
                                                onClick={() => setIsSidebarOpen(false)}
                                            />
                                        );
                                    })}

                                    {groups && groups.length > 0 && groups.map((group, index) => {
                                        if (!hasVisibleItems(group.name)) {
                                            return null;
                                        }
                                        return (
                                            <div key={index}>
                                                <MobileDropdown
                                                    title={group.name.charAt(0).toUpperCase() + group.name.slice(1)}
                                                    items={menu.filter((item) => item.group === group.name)}
                                                    icon={group.icon}
                                                />
                                            </div>
                                        );
                                    })}
                                </div>
                                <div className="p-4 border-t">
                                    <Link href={route('logout')} method="post" as="button" className="w-full rounded-lg hover:bg-secondary/50 transition">
                                        <div className="flex items-center gap-3 text-sm w-full mx-auto bg-secondary p-2 rounded-lg justify-center text-secondary-foreground">
                                            <DynamicIcon name="LogOut" className="h-3 w-3 inline-block me-1" />
                                            <span className="truncate">Log Out</span>
                                        </div>
                                    </Link>
                                </div>
                            </SheetContent>
                        </Sheet>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MobileNavBar;