import React, { useState, useEffect } from "react";
import { Controller, Control, FieldValues } from "react-hook-form";
import { format, getDaysInMonth, startOfMonth, getDay } from "date-fns";
import {
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/Popover";
import { cn } from "@/lib/utils";

interface DatePickerProps {
  name: string;
  control: Control<FieldValues>;
  error?: boolean;
  label?: string;
  minDate?: Date;
  maxDate?: Date;
  setValue: (name: string, value: string) => void;
}

const MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

const DAYS = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];

const DatePicker = ({
  name,
  control,
  error,
  minDate,
  maxDate,
  setValue,
}: DatePickerProps) => {
  const [calendarOpen, setCalendarOpen] = useState(false);
  const currentDate = new Date();
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [viewDate, setViewDate] = useState({
    month: currentDate.getMonth(),
    year: currentDate.getFullYear(),
  });

  // Generate calendar days
  const generateCalendarDays = () => {
    const year = viewDate.year;
    const month = viewDate.month;

    const daysInMonth = getDaysInMonth(new Date(year, month));
    const firstDayOfMonth = getDay(startOfMonth(new Date(year, month)));

    const days = [];

    // Add empty cells for days before the first day of the month
    for (let i = 0; i < firstDayOfMonth; i++) {
      days.push({ day: null, isCurrentMonth: false });
    }

    // Add days of the current month
    for (let i = 1; i <= daysInMonth; i++) {
      const date = new Date(year, month, i);
      const isDisabled =
        (minDate && date < minDate) || (maxDate && date > maxDate);

      days.push({
        day: i,
        date,
        isToday:
          i === currentDate.getDate() &&
          month === currentDate.getMonth() &&
          year === currentDate.getFullYear(),
        isSelected:
          selectedDate &&
          i === selectedDate.getDate() &&
          month === selectedDate.getMonth() &&
          year === selectedDate.getFullYear(),
        isDisabled,
      });
    }

    return days;
  };

  const navigateMonth = (increment: number) => {
    setViewDate((prev) => {
      let newMonth = prev.month + increment;
      let newYear = prev.year;

      if (newMonth > 11) {
        newMonth = 0;
        newYear += 1;
      } else if (newMonth < 0) {
        newMonth = 11;
        newYear -= 1;
      }

      return { month: newMonth, year: newYear };
    });
  };

  const navigateYear = (increment: number) => {
    setViewDate((prev) => ({
      ...prev,
      year: prev.year + increment,
    }));
  };

  const handleDateSelect = (date: Date) => {
    setSelectedDate(date);
    setValue(name, format(date, "yyyy-MM-dd"));
    setCalendarOpen(false);
  };

  // Update view date when selected date changes
  useEffect(() => {
    if (selectedDate) {
      setViewDate({
        month: selectedDate.getMonth(),
        year: selectedDate.getFullYear(),
      });
    }
  }, [selectedDate]);

  return (
    <Controller
      name={name}
      control={control}
      render={({ field }) => {
        // Update selectedDate when field.value changes
        if (field.value && !selectedDate) {
          // Use setTimeout to avoid React warning about updating during render
          setTimeout(() => {
            setSelectedDate(new Date(field.value));
          }, 0);
        }

        return (
          <Popover open={calendarOpen} onOpenChange={setCalendarOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "w-full justify-start text-left font-normal px-4 py-2.5 h-auto border-gray-300 hover:border-primary",
                  !field.value && "text-gray-900",
                  error && "border-red-500 focus:border-red-500 bg-red-50/50"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4 text-primary" />
                {field.value ? (
                  <span className="text-gray-900 font-medium">
                    {format(new Date(field.value), "PPP")}
                  </span>
                ) : (
                  <span className="text-gray-900">
                    Select your date of birth
                  </span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent
              className="w-auto p-0 bg-white border border-gray-200 shadow-lg rounded-lg"
              align="start"
            >
              {/* Header with month and year navigation */}
              <div className="flex items-center justify-between px-3 py-3 bg-blue-50 rounded-t-lg border-b border-gray-200">
                <div className="flex items-center">
                  <button
                    type="button"
                    onClick={() => navigateMonth(-1)}
                    className="p-1 rounded-full hover:bg-blue-100 text-primary"
                  >
                    <ChevronLeft className="h-5 w-5" />
                  </button>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => navigateYear(-1)}
                    className="p-1 rounded-full hover:bg-blue-100 text-primary"
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </button>
                  <span className="font-bold text-primary">
                    {MONTHS[viewDate.month]} {viewDate.year}
                  </span>
                  <button
                    type="button"
                    onClick={() => navigateYear(1)}
                    className="p-1 rounded-full hover:bg-blue-100 text-primary"
                  >
                    <ChevronRight className="h-4 w-4" />
                  </button>
                </div>

                <div className="flex items-center">
                  <button
                    type="button"
                    onClick={() => navigateMonth(1)}
                    className="p-1 rounded-full hover:bg-blue-100 text-primary"
                  >
                    <ChevronRight className="h-5 w-5" />
                  </button>
                </div>
              </div>

              {/* Month selector */}
              <div className="px-3 py-2 bg-white border-b border-gray-200">
                <div className="grid grid-cols-4 gap-1 w-full">
                  {MONTHS.map((month, index) => (
                    <button
                      key={month}
                      type="button"
                      onClick={() =>
                        setViewDate((prev) => ({ ...prev, month: index }))
                      }
                      className={cn(
                        "px-2 py-1 text-sm rounded",
                        viewDate.month === index
                          ? "bg-primary text-white font-bold"
                          : "text-gray-900 hover:bg-blue-50 hover:text-primary"
                      )}
                    >
                      {month.substring(0, 3)}
                    </button>
                  ))}
                </div>
              </div>

              {/* Calendar grid */}
              <div className="p-3">
                {/* Day headers */}
                <div className="grid grid-cols-7 gap-1 mb-2">
                  {DAYS.map((day) => (
                    <div
                      key={day}
                      className="text-center font-bold text-gray-900"
                    >
                      {day}
                    </div>
                  ))}
                </div>

                {/* Calendar days */}
                <div className="grid grid-cols-7 gap-1">
                  {generateCalendarDays().map((day, i) => (
                    <div key={i} className="h-9 w-9 relative">
                      {day.day !== null && (
                        <button
                          type="button"
                          disabled={day.isDisabled}
                          onClick={() => day.date && handleDateSelect(day.date)}
                          className={cn(
                            "absolute inset-0 flex items-center justify-center rounded-md text-sm font-medium",
                            day.isSelected && "bg-primary text-white",
                            day.isToday &&
                              !day.isSelected &&
                              "bg-blue-100 text-primary border border-primary",
                            !day.isSelected &&
                              !day.isToday &&
                              "text-gray-900 hover:bg-blue-50 hover:text-primary",
                            day.isDisabled &&
                              "text-gray-400 opacity-50 hover:bg-transparent cursor-not-allowed"
                          )}
                        >
                          {day.day}
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </PopoverContent>
          </Popover>
        );
      }}
    />
  );
};

export default DatePicker;
