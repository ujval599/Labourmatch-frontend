interface StatsCounterProps {
  number: string;
  label: string;
  suffix?: string;
}

export function StatsCounter({ number, label, suffix = "" }: StatsCounterProps) {
  return (
    <div className="text-center p-6 rounded-xl bg-white/50 backdrop-blur-sm border border-border hover:shadow-lg transition-all">
      <p className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent mb-2">
        {number}{suffix}
      </p>
      <p className="text-muted-foreground text-sm">{label}</p>
    </div>
  );
}
