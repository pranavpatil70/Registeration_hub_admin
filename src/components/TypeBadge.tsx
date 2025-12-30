interface TypeBadgeProps {
  type: string;
}

const TypeBadge = ({ type }: TypeBadgeProps) => {
  const lowerType = type?.toLowerCase();
  
  // Map different types to color schemes
  const getColorClass = () => {
    switch (lowerType) {
      case 'student':
      case 'attendee':
        return 'bg-badge-student/15 text-badge-student';
      case 'professional':
      case 'speaker':
        return 'bg-badge-professional/15 text-badge-professional';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };
  
  return (
    <span
      className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium font-mono uppercase tracking-wide ${getColorClass()}`}
    >
      {type}
    </span>
  );
};

export default TypeBadge;
