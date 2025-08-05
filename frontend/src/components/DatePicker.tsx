'use client';

import { useState } from 'react';
import { ChevronDownIcon } from "lucide-react";
import { Button } from '@/components/ui/button';
import { Calendar } from "@/components/ui/calendar";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";

interface DatePickerProps {
    value: Date | undefined;
    onChange: (date: Date | undefined) => void;
    placeholder?: string;
    disabled?: boolean;
    className?: string;
}

export default function DatePicker({
    value,
    onChange,
    placeholder = "Select date",
    disabled = false,
    className = "w-48 justify-between font-normal",
}: DatePickerProps) {
    const [open, setOpen] = useState<boolean>(false);

    const handleSelect = (date: Date | undefined) => {
        onChange(date);
        setOpen(false);
    };

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button
                    variant="outline"
                    disabled={disabled}
                    className={className}
                >
                    {value ? value.toLocaleDateString() : placeholder}
                    <ChevronDownIcon />
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto overflow-hidden p-0" align="start">
                <Calendar
                    mode="single"
                    selected={value}
                    captionLayout="dropdown"
                    disabled={(date) => {
                        const today = new Date();
                        // Compare only the date part (year, month, day)
                        const dateOnly = new Date(date.getFullYear(), date.getMonth(), date.getDate());
                        const todayOnly = new Date(today.getFullYear(), today.getMonth(), today.getDate());
                        return dateOnly > todayOnly;
                    }}
                    onSelect={handleSelect}
                />
            </PopoverContent>
        </Popover>
    );
}