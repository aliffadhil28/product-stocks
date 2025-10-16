import { Link, usePage } from "@inertiajs/react";

const DesktopSidebar = ({
    user,
    groups,
    menu,
    mainItems,
    openDropdowns,
    toggleDropdown,
    isGroupActive,
    isItemVisible,
    hasVisibleItems,
    NavItem,
    DynamicIcon,
    cn
}) => {

    // Komponen untuk dropdown di desktop width
    const DesktopDropdown = ({ title, items, icon }) => {

        const isGroupItemActive = isGroupActive(items);
        const isOpen = openDropdowns[title];

        // Filter items yang visible
        const visibleItems = items.filter(isItemVisible);

        // Jika tidak ada item visible, jangan render dropdown
        if (visibleItems.length === 0) {
            return null;
        }

        return (
            <div className={`w-full`}>
                <button
                    onClick={() => toggleDropdown(title)}
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
                    <div className="mt-1 ml-6 space-y-1">
                        {visibleItems.map((item, index) => (
                            <NavItem
                                key={index}
                                item={item}
                                className="py-1.5"
                            />
                        ))}
                    </div>
                )}
            </div>
        );
    };

    return (
        <div className="hidden lg:flex h-screen w-64 flex-col border-r bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="p-6 border-b">
                <div className="flex items-center gap-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                        <DynamicIcon name="LayoutDashboard" className="h-4 w-4" />
                    </div>
                    <div>
                        <h2 className="text-lg font-semibold">{user?.name || 'User'}</h2>
                        <p className="text-xs text-muted-foreground">Welcome back!</p>
                    </div>
                </div>
            </div>

            <div className="flex-1 overflow-auto py-4">
                <nav className="space-y-1 px-3">
                    {/* Main Items */}
                    <div className="space-y-1">
                        {mainItems.map((item, index) => (
                            <NavItem key={index} item={item} />
                        ))}
                    </div>

                    {groups && groups.length > 0 && groups.map((group, index) => {
                        if (!hasVisibleItems(group.name)) {
                            return null;
                        }

                        return (
                            <div key={index}>
                                <DesktopDropdown
                                    title={group.name.charAt(0).toUpperCase() + group.name.slice(1)}
                                    items={menu.filter((item) => item.group === group.name)}
                                    icon={group.icon}
                                />
                            </div>
                        );
                    })}

                </nav>
            </div>

            {/* User section at bottom */}
            <div className="p-4 border-t flex flex-col items-center gap-2 justify-between text-sm">
                <div className="flex items-center gap-3">
                    <Link href={route('profile.edit')} className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/10" as="button">
                        <DynamicIcon name="User" className="h-3 w-3" />
                    </Link>
                    <span className="truncate">{user?.email || 'user@example.com'}</span>
                </div>

                <Link
                    href={route('logout')}
                    method="post"
                    as="button"
                    className="flex items-center gap-2 p-1 rounded bg-secondary text-secondary-foreground hover:bg-secondary/20 hover:text-muted-foreground font-medium transition w-4/5"
                >
                    <span className="mx-auto flex gap-2 justify-between items-center">
                        <DynamicIcon name="LogOut" className="h-4 w-4" />
                        Logout</span>
                </Link>
            </div>
        </div>
    );
};

export default DesktopSidebar;