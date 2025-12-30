import { useState, useEffect, useMemo, useCallback } from 'react';
import { supabase, Registration } from '@/lib/supabase';
import { startOfDay, subDays, isAfter, isBefore, isEqual, parseISO, startOfToday } from 'date-fns';

export type FilterType = 'all' | string;
export type SortField = 'name' | 'created_at' | 'registration_type';
export type SortDirection = 'asc' | 'desc';
export type DateRangePreset = 'all' | 'today' | 'last7days' | 'last30days' | 'custom';

export interface DateRange {
  from: Date | undefined;
  to: Date | undefined;
}

export const useRegistrations = () => {
  const [registrations, setRegistrations] = useState<Registration[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<FilterType>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortField, setSortField] = useState<SortField>('created_at');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');
  const [dateRangePreset, setDateRangePreset] = useState<DateRangePreset>('all');
  const [customDateRange, setCustomDateRange] = useState<DateRange>({ from: undefined, to: undefined });
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const fetchRegistrations = useCallback(async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('registrations')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setRegistrations(data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch registrations');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchRegistrations();
  }, [fetchRegistrations]);

  // Get unique registration types dynamically
  const uniqueTypes = useMemo(() => {
    const types = new Set<string>();
    registrations.forEach(r => {
      if (r.registration_type) {
        types.add(r.registration_type.toLowerCase());
      }
    });
    return Array.from(types);
  }, [registrations]);

  const counts = useMemo(() => {
    const today = startOfToday();
    const last7Days = subDays(today, 7);
    
    const typeCounts: Record<string, number> = {
      all: registrations.length,
    };
    
    uniqueTypes.forEach(type => {
      typeCounts[type] = registrations.filter(r => r.registration_type?.toLowerCase() === type).length;
    });
    
    return {
      ...typeCounts,
      today: registrations.filter(r => {
        const date = startOfDay(parseISO(r.created_at));
        return isEqual(date, today);
      }).length,
      last7Days: registrations.filter(r => {
        const date = parseISO(r.created_at);
        return isAfter(date, last7Days) || isEqual(startOfDay(date), startOfDay(last7Days));
      }).length,
    };
  }, [registrations, uniqueTypes]);

  const filteredAndSortedRegistrations = useMemo(() => {
    let result = [...registrations];

    // Apply type filter
    if (filter !== 'all') {
      result = result.filter(r => r.registration_type?.toLowerCase() === filter);
    }

    // Apply search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim();
      result = result.filter(r => 
        r.name?.toLowerCase().includes(query) ||
        r.email?.toLowerCase().includes(query) ||
        r.phone?.toLowerCase().includes(query) ||
        r.company?.toLowerCase().includes(query)
      );
    }

    // Apply date range filter
    const today = startOfToday();
    if (dateRangePreset === 'today') {
      result = result.filter(r => {
        const date = startOfDay(parseISO(r.created_at));
        return isEqual(date, today);
      });
    } else if (dateRangePreset === 'last7days') {
      const last7Days = subDays(today, 7);
      result = result.filter(r => {
        const date = parseISO(r.created_at);
        return isAfter(date, last7Days) || isEqual(startOfDay(date), startOfDay(last7Days));
      });
    } else if (dateRangePreset === 'last30days') {
      const last30Days = subDays(today, 30);
      result = result.filter(r => {
        const date = parseISO(r.created_at);
        return isAfter(date, last30Days) || isEqual(startOfDay(date), startOfDay(last30Days));
      });
    } else if (dateRangePreset === 'custom' && customDateRange.from) {
      result = result.filter(r => {
        const date = startOfDay(parseISO(r.created_at));
        const from = customDateRange.from ? startOfDay(customDateRange.from) : null;
        const to = customDateRange.to ? startOfDay(customDateRange.to) : from;
        
        if (from && to) {
          return (isAfter(date, from) || isEqual(date, from)) && (isBefore(date, to) || isEqual(date, to));
        }
        return true;
      });
    }

    // Apply sort
    result.sort((a, b) => {
      let comparison = 0;
      
      switch (sortField) {
        case 'name':
          comparison = (a.name || '').localeCompare(b.name || '');
          break;
        case 'registration_type':
          comparison = (a.registration_type || '').localeCompare(b.registration_type || '');
          break;
        case 'created_at':
        default:
          comparison = new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
          break;
      }
      
      return sortDirection === 'asc' ? comparison : -comparison;
    });

    return result;
  }, [registrations, filter, searchQuery, sortField, sortDirection, dateRangePreset, customDateRange]);

  // Pagination
  const totalPages = Math.ceil(filteredAndSortedRegistrations.length / pageSize);
  const paginatedRegistrations = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize;
    return filteredAndSortedRegistrations.slice(startIndex, startIndex + pageSize);
  }, [filteredAndSortedRegistrations, currentPage, pageSize]);

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [filter, searchQuery, dateRangePreset, customDateRange, pageSize]);

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('desc');
    }
  };

  const addRegistration = async (registration: Omit<Registration, 'id' | 'created_at'>) => {
    try {
      const { data, error } = await supabase
        .from('registrations')
        .insert([registration])
        .select()
        .single();

      if (error) throw error;
      setRegistrations(prev => [data, ...prev]);
      return { success: true, data };
    } catch (err) {
      return { success: false, error: err instanceof Error ? err.message : 'Failed to add registration' };
    }
  };

  const deleteRegistration = async (id: number) => {
    try {
      const { error } = await supabase
        .from('registrations')
        .delete()
        .eq('id', id);

      if (error) throw error;
      setRegistrations(prev => prev.filter(r => r.id !== id));
      return { success: true };
    } catch (err) {
      return { success: false, error: err instanceof Error ? err.message : 'Failed to delete registration' };
    }
  };

  return {
    registrations: paginatedRegistrations,
    allFilteredRegistrations: filteredAndSortedRegistrations,
    loading,
    error,
    filter,
    setFilter,
    searchQuery,
    setSearchQuery,
    sortField,
    sortDirection,
    handleSort,
    dateRangePreset,
    setDateRangePreset,
    customDateRange,
    setCustomDateRange,
    counts,
    uniqueTypes,
    currentPage,
    setCurrentPage,
    pageSize,
    setPageSize,
    totalPages,
    totalFiltered: filteredAndSortedRegistrations.length,
    addRegistration,
    deleteRegistration,
    refetch: fetchRegistrations,
  };
};
