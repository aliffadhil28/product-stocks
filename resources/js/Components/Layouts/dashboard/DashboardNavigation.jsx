import { useState } from "react";
import { Link, usePage } from "@inertiajs/react";
import DesktopSidebar from "./partials/DesktopSideBar";
import MobileNavBar from "./partials/MobileNavBar";
import { hasPermission, hasRole } from "@/utils/userAccess";
import LucideIcon from "../../LucideIcons";
import { cn } from "@/lib/utils";

// Komponen Icon yang dinamis
const DynamicIcon = ({ name, className, ...props }) => {
    return <LucideIcon name={name} className={className} {...props} />;
};

const DashboardNavigation = ({ user, groups, menu, header }) => {
    const [openDropdowns, setOpenDropdowns] = useState({});
    const { url } = usePage();

    const mainItems = menu?.filter((item) => item.group === null);

    // Check if any item in a group is active
    const isGroupActive = (items) => {
        return items.some(item => `/${url.split('/')[2]}` === item.path);
    };

    const safeRoute = (name, params = {}, defaultUrl = "#") => {
        return route().has(name) ? route(name, params) : defaultUrl;
    };


    // Toggle dropdown state
    const toggleDropdown = (groupName) => {
        setOpenDropdowns(prev => ({
            ...prev,
            [groupName]: !prev[groupName]
        }));
    };

    // Komponen untuk item navigasi biasa
    const NavItem = ({ item, onClick, className = "" }) => {
        // Menghapus karakter '/' pertama jika ada, lalu split berdasarkan '/'
        const urlParts = url.startsWith('/') ? url.slice(1).split('/') : url.split('/');

        const isActive = `/${urlParts[0]}/${urlParts[1]}` === `/admin${item.path}`;
        const isHidden = !hasPermission(`${String(item.name.replace(' ','-')).toLowerCase()}/view`) && !hasRole('admin');

        const handleClick = (e) => {
            e.stopPropagation(); // Mencegah event bubbling
            if (onClick) {
                onClick();
            }
        };

        const withNumberSpan = []; // use this if menu have number span

        if (safeRoute(item.route) && !isHidden) {
            return (
                <Link
                    id={`menu-${item?.name.replace(' ','-').toLowerCase()}`}
                    style={{ display: isHidden ? 'none' : 'flex' }}
                    href={safeRoute(`admin.${item.path.replace(/^\//, '').replace(/\//g, '.')}`)}
                    className={cn(
                        "flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm transition-all hover:bg-accent hover:text-accent-foreground",
                        isActive
                            ? "bg-primary text-primary-foreground font-medium"
                            : "text-muted-foreground",
                        className
                    )}
                    onClick={handleClick}
                >
                    <DynamicIcon name={item.icon} className="h-4 w-4 flex-shrink-0" />
                    <span>{item.name}</span>
                    {withNumberSpan.includes(item.name) ? (
                        <span className="p-1 bg-secondary-foreground rounded-full px-3 ms-auto text-primary dark:text-secondary">0</span>
                    ) : (
                        <></>
                    )}
                </Link>
            );
        } else {
            return (
                <span className="text-gray-400">Settings (coming soon)</span>
            );
        }
    };

    // Fungsi untuk memeriksa apakah item visible
    const isItemVisible = (item) => {
        return hasPermission(`${String(item.name.replace(' ','-')).toLowerCase()}/view`) || hasRole('admin');
    };

    // Fungsi untuk memeriksa apakah group memiliki item visible
    const hasVisibleItems = (groupName) => {
        const groupItems = menu.filter((item) => item.group === groupName);
        return groupItems.some(isItemVisible);
    };

    return (
        <>
            <DesktopSidebar
                user={user}
                groups={groups}
                menu={menu}
                mainItems={mainItems}
                openDropdowns={openDropdowns}
                toggleDropdown={toggleDropdown}
                isGroupActive={isGroupActive}
                isItemVisible={isItemVisible}
                hasVisibleItems={hasVisibleItems}
                NavItem={NavItem}
                DynamicIcon={DynamicIcon}
                cn={cn}
            />
            <MobileNavBar
                user={user}
                header={header}
                groups={groups}
                menu={menu}
                mainItems={mainItems}
                hasVisibleItems={hasVisibleItems}
                isItemVisible={isItemVisible}
                NavItem={NavItem}
                DynamicIcon={DynamicIcon}
                isGroupActive={isGroupActive}
                cn={cn}
            />
        </>
    );
};

export default DashboardNavigation;