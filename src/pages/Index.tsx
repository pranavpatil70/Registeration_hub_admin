import { Users, GraduationCap, Briefcase, LayoutDashboard, Calendar, CalendarDays } from 'lucide-react';
import StatCard from '@/components/StatCard';
import RegistrationsTable from '@/components/RegistrationsTable';
import SearchBar from '@/components/SearchBar';
import DateRangeFilter from '@/components/DateRangeFilter';
import TablePagination from '@/components/TablePagination';
import AddRegistrationDialog from '@/components/AddRegistrationDialog';
import ExportButtons from '@/components/ExportButtons';
import ThemeToggle from '@/components/ThemeToggle';
import { useRegistrations } from '@/hooks/useRegistrations';
import { Skeleton } from '@/components/ui/skeleton';
import { Toaster } from '@/components/ui/sonner';

const Index = () => {
  const {
    registrations,
    allFilteredRegistrations,
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
    totalFiltered,
    addRegistration,
    deleteRegistration,
  } = useRegistrations();

  if (error) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 rounded-full bg-destructive/10 flex items-center justify-center mx-auto">
            <LayoutDashboard className="h-8 w-8 text-destructive" />
          </div>
          <p className="text-destructive font-mono text-lg">Error loading data</p>
          <p className="text-muted-foreground text-sm max-w-md">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 sm:px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/10 rounded-lg">
                <LayoutDashboard className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h1 className="text-lg sm:text-xl font-bold text-foreground">Admin Portal</h1>
                <p className="text-xs text-muted-foreground font-mono hidden sm:block">Registration Management</p>
              </div>
            </div>
            <ThemeToggle />
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-6 sm:space-y-8">
        {/* Stats Section */}
        <section>
          <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-4">
            Overview
          </h2>
          <div className="grid grid-cols-2 lg:grid-cols-5 gap-3 sm:gap-4">
            {loading ? (
              <>
                {[...Array(5)].map((_, i) => (
                  <Skeleton key={i} className="h-28 sm:h-32 rounded-xl" />
                ))}
              </>
            ) : (
              <>
                <StatCard
                  title="Total"
                  value={counts.all || 0}
                  icon={Users}
                  description="All registrations"
                  delay={0}
                />
                {uniqueTypes.slice(0, 2).map((type, idx) => (
                  <StatCard
                    key={type}
                    title={type.charAt(0).toUpperCase() + type.slice(1)}
                    value={counts[type] || 0}
                    icon={idx === 0 ? GraduationCap : Briefcase}
                    description={`${type} entries`}
                    delay={(idx + 1) * 100}
                  />
                ))}
                <StatCard
                  title="Today"
                  value={counts.today || 0}
                  icon={Calendar}
                  description="Registered today"
                  delay={300}
                />
                <StatCard
                  title="Last 7 Days"
                  value={counts.last7Days || 0}
                  icon={CalendarDays}
                  description="Past week"
                  delay={400}
                />
              </>
            )}
          </div>
        </section>

        {/* Table Section */}
        <section>
          <div className="flex flex-col gap-4 mb-4">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
                Registrations
              </h2>
              <div className="flex items-center gap-2 flex-wrap">
                <AddRegistrationDialog onAdd={addRegistration} />
                <ExportButtons 
                  allRegistrations={allFilteredRegistrations} 
                  filteredRegistrations={allFilteredRegistrations} 
                />
              </div>
            </div>
            
            {!loading && (
              <div className="flex flex-col gap-4">
                <div className="flex flex-col sm:flex-row gap-4">
                  <SearchBar value={searchQuery} onChange={setSearchQuery} />
                  <DateRangeFilter
                    preset={dateRangePreset}
                    onPresetChange={setDateRangePreset}
                    customRange={customDateRange}
                    onCustomRangeChange={setCustomDateRange}
                  />
                </div>
                <div className="flex gap-2 flex-wrap">
                  <button
                    onClick={() => setFilter('all')}
                    className={`filter-button font-mono ${filter === 'all' ? 'filter-button-active' : 'filter-button-inactive'}`}
                  >
                    All <span className="ml-2 opacity-70">({counts.all || 0})</span>
                  </button>
                  {uniqueTypes.map(type => (
                    <button
                      key={type}
                      onClick={() => setFilter(type)}
                      className={`filter-button font-mono ${filter === type ? 'filter-button-active' : 'filter-button-inactive'}`}
                    >
                      {type.charAt(0).toUpperCase() + type.slice(1)}s
                      <span className="ml-2 opacity-70">({counts[type] || 0})</span>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
          
          {loading ? (
            <div className="space-y-2">
              <Skeleton className="h-12 rounded-t-xl" />
              {[...Array(5)].map((_, i) => (
                <Skeleton key={i} className="h-16" />
              ))}
            </div>
          ) : (
            <>
              <RegistrationsTable
                registrations={registrations}
                sortField={sortField}
                sortDirection={sortDirection}
                onSort={handleSort}
                onDelete={deleteRegistration}
              />
              <TablePagination
                currentPage={currentPage}
                totalPages={totalPages}
                pageSize={pageSize}
                totalItems={totalFiltered}
                onPageChange={setCurrentPage}
                onPageSizeChange={setPageSize}
              />
            </>
          )}
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-border mt-auto">
        <div className="container mx-auto px-4 sm:px-6 py-4">
          <p className="text-xs text-muted-foreground font-mono text-center">
            Admin Portal • Last updated: {new Date().toLocaleDateString()}
          </p>
        </div>
      </footer>

      <Toaster />
    </div>
  );
};

export default Index;
