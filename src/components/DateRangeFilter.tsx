import { Calendar, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { DateRangePreset, DateRange } from '@/hooks/useRegistrations';

interface DateRangeFilterProps {
  preset: DateRangePreset;
  onPresetChange: (preset: DateRangePreset) => void;
  customRange: DateRange;
  onCustomRangeChange: (range: DateRange) => void;
}

const DateRangeFilter = ({ preset, onPresetChange, customRange, onCustomRangeChange }: DateRangeFilterProps) => {
  const presetLabels: Record<DateRangePreset, string> = {
    all: 'All Time',
    today: 'Today',
    last7days: 'Last 7 Days',
    last30days: 'Last 30 Days',
    custom: 'Custom Range',
  };

  return (
    <div className="flex items-center gap-2 flex-wrap">
      <Select value={preset} onValueChange={(value: DateRangePreset) => onPresetChange(value)}>
        <SelectTrigger className="w-[160px]">
          <Calendar className="h-4 w-4 mr-2" />
          <SelectValue placeholder="Date range" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Time</SelectItem>
          <SelectItem value="today">Today</SelectItem>
          <SelectItem value="last7days">Last 7 Days</SelectItem>
          <SelectItem value="last30days">Last 30 Days</SelectItem>
          <SelectItem value="custom">Custom Range</SelectItem>
        </SelectContent>
      </Select>

      {preset === 'custom' && (
        <div className="flex items-center gap-2">
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "justify-start text-left font-normal w-[130px]",
                  !customRange.from && "text-muted-foreground"
                )}
              >
                {customRange.from ? format(customRange.from, "MMM dd, yyyy") : "Start date"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <CalendarComponent
                mode="single"
                selected={customRange.from}
                onSelect={(date) => onCustomRangeChange({ ...customRange, from: date })}
                initialFocus
                className="p-3 pointer-events-auto"
              />
            </PopoverContent>
          </Popover>
          <span className="text-muted-foreground">to</span>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "justify-start text-left font-normal w-[130px]",
                  !customRange.to && "text-muted-foreground"
                )}
              >
                {customRange.to ? format(customRange.to, "MMM dd, yyyy") : "End date"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <CalendarComponent
                mode="single"
                selected={customRange.to}
                onSelect={(date) => onCustomRangeChange({ ...customRange, to: date })}
                disabled={(date) => customRange.from ? date < customRange.from : false}
                initialFocus
                className="p-3 pointer-events-auto"
              />
            </PopoverContent>
          </Popover>
        </div>
      )}
    </div>
  );
};

export default DateRangeFilter;
