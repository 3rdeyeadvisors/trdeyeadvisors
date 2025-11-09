import { useEffect, useState } from "react";
import { Clock } from "lucide-react";

interface RaffleCountdownProps {
  endDate: string;
}

interface TimeRemaining {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

const RaffleCountdown = ({ endDate }: RaffleCountdownProps) => {
  const [timeRemaining, setTimeRemaining] = useState<TimeRemaining>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    const calculateTimeRemaining = () => {
      const end = new Date(endDate).getTime();
      const now = new Date().getTime();
      const difference = end - now;

      if (difference <= 0) {
        setTimeRemaining({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        return;
      }

      setTimeRemaining({
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        minutes: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((difference % (1000 * 60)) / 1000),
      });
    };

    calculateTimeRemaining();
    const interval = setInterval(calculateTimeRemaining, 1000);

    return () => clearInterval(interval);
  }, [endDate]);

  const TimeBlock = ({ value, label }: { value: number; label: string }) => (
    <div className="flex flex-col items-center">
      <div className="bg-primary/10 rounded-lg px-4 py-3 min-w-[70px]">
        <span className="text-2xl font-bold text-primary">{value.toString().padStart(2, '0')}</span>
      </div>
      <span className="text-xs text-muted-foreground mt-1">{label}</span>
    </div>
  );

  return (
    <div className="flex items-center justify-center gap-2">
      <Clock className="w-5 h-5 text-primary" />
      <div className="flex gap-2">
        <TimeBlock value={timeRemaining.days} label="Days" />
        <span className="text-2xl font-bold text-muted-foreground self-center">:</span>
        <TimeBlock value={timeRemaining.hours} label="Hours" />
        <span className="text-2xl font-bold text-muted-foreground self-center">:</span>
        <TimeBlock value={timeRemaining.minutes} label="Minutes" />
        <span className="text-2xl font-bold text-muted-foreground self-center">:</span>
        <TimeBlock value={timeRemaining.seconds} label="Seconds" />
      </div>
    </div>
  );
};

export default RaffleCountdown;
