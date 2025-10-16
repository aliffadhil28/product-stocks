import { Label } from "./ui/label";
import { Input } from "./ui/input";

export const InputLabel = ({ useLabel = false, required, label, type, name, id, value, className = '', ...props }) => {
    return (
        <div className="flex flex-col gap-2">
            {useLabel && <Label htmlFor={name} className="block font-medium text-sm text-gray-700 dark:text-gray-100">{label} {required ? <span className="text-red-500">*</span> : null}</Label>}
            <Input
                id={id}
                type={type}
                name={name}
                value={value}
                className={className}
                {...props}
            />
        </div>
    );
}