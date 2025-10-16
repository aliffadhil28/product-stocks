import { usePage } from "@inertiajs/react";

export const hasRole = (role) => {
    const { auth } = usePage().props;
    return auth.user && auth.user.roles && auth.user.roles.includes(role);
}

export const hasPermission = (permission) => {
    const { auth } = usePage().props;
    return auth.user && auth.user.permissions && auth.user.permissions.includes(permission);
}