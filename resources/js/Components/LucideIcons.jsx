import * as Icons from "lucide-react";

export default function LucideIcon({ name, ...props }) {
    const IconComponent = Icons[name];
    if (!IconComponent) return <Icons.HelpCircle {...props} />; // fallback icon
    return <IconComponent {...props} />;
}
