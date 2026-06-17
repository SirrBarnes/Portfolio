import useClock from "./Clock";

type Props = {
    open: boolean;
    onClose: () => void;
};

export default function Windows11ClockPanel({ open, onClose }: Props) {
    const { now, timeZone } = useClock();

    if (!open) return null;

    const time = new Intl.DateTimeFormat("en-US", {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        timeZone,
    }).format(now);

    const dateString = new Intl.DateTimeFormat("en-US", {
        weekday: "long",
        month: "long",
        day: "numeric",
        timeZone,
    }).format(now);

    const parts = new Intl.DateTimeFormat("en-US", {
        timeZone,
        year: "numeric",
        month: "numeric",
        day: "numeric",
    }).formatToParts(now);

    const year = Number(parts.find(p => p.type === "year")?.value);
    const month = Number(parts.find(p => p.type === "month")?.value);
    const day = Number(parts.find(p => p.type === "day")?.value);

    const firstDay = new Date(year, month - 1, 1).getDay();
    const daysInMonth = new Date(year, month, 0).getDate();

    const days = Array.from({ length: 42 }, (_, i) => {
        const d = i - firstDay + 1;
        return d > 0 && d <= daysInMonth ? d : null;
    });

    const weekDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

    return (
        <>
            <div className="clock-backdrop" onClick={onClose} />

            <div className="clock-panel">
                <div className="clock-header-bar">
                    <span>Clock</span>
                    <button className="clock-close" onClick={onClose}>✕</button>
                </div>

                <div className="clock-time">{time}</div>
                <div className="clock-date">{dateString}</div>

                <div className="clock-month">
                    {new Date(year, month - 1).toLocaleString("default", {
                        month: "long",
                    })}{" "}
                    {year}
                </div>

                <div className="clock-weekdays">
                    {weekDays.map((d) => (
                        <div key={d} className="clock-weekday">
                            {d}
                        </div>
                    ))}
                </div>

                <div className="clock-days">
                    {days.map((d, i) => {
                        const isToday = d === day;

                        return (
                            <div
                                key={i}
                                className={`clock-day ${isToday ? "today" : ""}`}
                            >
                                {d ?? ""}
                            </div>
                        );
                    })}
                </div>
            </div>
        </>
    );
}