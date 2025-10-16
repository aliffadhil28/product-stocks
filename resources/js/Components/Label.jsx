export default function Label({ value, className = '', children, ...props }) {
    return (
        <label {...props} className={`block font-medium text-sm text-gray-700 dark:text-gray-200` + className}>
            {value ? value : children}
        </label>
    );
}
