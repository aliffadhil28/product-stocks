import { useState, forwardRef, useImperativeHandle } from "react"
import { Check, ChevronsUpDown } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from "@/components/ui/command"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"

const ComboBox = forwardRef(({ data, name, setValue, value }, ref) => {
    const [open, setOpen] = useState(false)
    const [internalValue, setInternalValue] = useState(value || "");
    
    // Sync internal value dengan prop value
    useState(() => {
        setInternalValue(value || "");
    }, [value]);
    
    // Expose methods to parent component via ref (optional)
    useImperativeHandle(ref, () => ({
        getValue: () => internalValue,
        // setValue: (newValue) => {            
        //     setInternalValue(newValue);
        //     setValue?.(newValue);
        // },
        clearValue: () => {
            setInternalValue("");
            setValue?.("");
        }
    }));

    return (
        <Popover open={open} onOpenChange={setOpen}>
            {internalValue && console.log(internalValue, data.find((item) => item.value === internalValue)?.label)}
            <PopoverTrigger asChild>
                <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={open}
                    className="w-full justify-between"
                >
                    {internalValue
                        ? data.find((item) => item.value === internalValue)?.label
                        : `Select ${name}...`}
                    <ChevronsUpDown className="opacity-50" />
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-full p-0">
                <Command>
                    <CommandInput placeholder={`Search ${name}...`} className="h-9" />
                    <CommandList>
                        <CommandEmpty>No {name} found.</CommandEmpty>
                        <CommandGroup>
                            {data.map((item) => (
                                <CommandItem
                                    key={item.value}
                                    value={item.value}
                                    onSelect={() => {
                                        setInternalValue(item.value);
                                        setValue?.(item.value);
                                        setOpen(false);
                                    }}
                                >
                                    {item.label}
                                    <Check
                                        className={cn(
                                            "ml-auto",
                                            internalValue === item.value ? "opacity-100" : "opacity-0"
                                        )}
                                    />
                                </CommandItem>
                            ))}
                        </CommandGroup>
                    </CommandList>
                </Command>
            </PopoverContent>
        </Popover>
    )
});

ComboBox.displayName = "ComboBox";
export default ComboBox;