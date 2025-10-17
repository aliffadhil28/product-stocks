
import { dashboardThemes as themes } from '@/data/themeList';

export const applyTheme = (themeName) => {
    const selected = themes.find(t => t.name === themeName)?.colors;
    if (selected) {
        document.documentElement.style.setProperty("--primary", selected.primary);
        document.documentElement.style.setProperty("--primary-foreground", selected.primaryForeground);
        document.documentElement.style.setProperty("--secondary", selected.secondary);
        document.documentElement.style.setProperty("--secondary-foreground", selected.secondaryForeground);
    }
};

export const numberToCurrency = (number, locale = 'id-ID', currency = 'IDR') => {
    return new Intl.NumberFormat(locale, {
        style: 'currency',
        currency: currency,
    }).format(number);
};

export const numberFormat = (value) => {
    return new Intl.NumberFormat('id-ID').format(value);
};

export const formatDateTime = (dateString) => {
    const options = {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
    };
    return new Date(dateString).toLocaleDateString('id-ID', options);
};

export const formatDate = (dateString) => {
    const options = {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    };
    return new Date(dateString).toLocaleDateString('id-ID', options);
};

export const formatTime = (dateString) => {
    const options = {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
    };
    return new Date(dateString).toLocaleTimeString('id-ID', options);
};
