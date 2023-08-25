
// Importing React and required hooks
import React, { useMemo, FC } from "react";

// Enums to define the types of absences for better type safety
enum AbsenceType {
  Krankheit = "Krankheit",
  Unfall = "Unfall",
  Other = "Other",
}

// Type definition for a single Absence
// Using 'readonly' to make sure the properties are immutable
interface Absence {
  readonly surname: string;
  readonly absence: AbsenceType;
  readonly d_start: string;
  readonly d_end: string;
}

// Type definition for a Person
// Using 'readonly' to make sure the properties are immutable
interface Person {
  readonly name: string;
  readonly absences: ReadonlyArray<Absence>;
}

// Constant colors for different absence types
// Using TypeScript's Record utility type for better type safety
const ABSENCE_COLORS: Record<AbsenceType, string> = {
  [AbsenceType.Krankheit]: "#CBFFA9",
  [AbsenceType.Unfall]: "#FF9B9B",
  [AbsenceType.Other]: "#FFD6A5",
};

// Constant for number of days in a week
const DAYS_IN_WEEK = 7;

// Custom hook to group absences by surname
// useMemo is used for performance optimization
const useGroupedAbsences = (data: ReadonlyArray<Absence>) => {
  return useMemo(() => {
    return data.reduce((acc: Record<string, { dates: Absence[] }>, absence) => {
      const { surname, d_start, d_end } = absence;
      if (!acc[surname]) {
        acc[surname] = { dates: [] };
      }
      acc[surname].dates.push({ ...absence, dateRange: `${d_start} - ${d_end}` });
      return acc;
    }, {});
  }, [data]);
};

// Utility function to get the dates for the current week
const getDatesForCurrentWeek = (date: Date): ReadonlyArray<Date> => {
  const currentDayOfWeek = date.getDay();
  const firstDayOfWeek = date.getDate() - currentDayOfWeek + (currentDayOfWeek === 0 ? -6 : 1);
  return Array.from({ length: DAYS_IN_WEEK }, (_, i) => new Date(new Date(date).setDate(firstDayOfWeek + i)));
};

// Main Component
const WeekViewCalendar: FC<{ demoData: Absence[] }> = ({ demoData }) => {
  const currentDate = new Date();
  const startDate = new Date(currentDate.getFullYear(), 0, 1);
  const elapsedDays = Math.floor((currentDate.getTime() - startDate.getTime()) / (24 * 60 * 60 * 1000));
  const weekNumber = Math.ceil(elapsedDays / DAYS_IN_WEEK);
  const weekDates = getDatesForCurrentWeek(currentDate);

  const groupedAbsences = useGroupedAbsences(demoData);
  const sortedData = useMemo(() => Object.entries(groupedAbsences).map(([name, data]) => ({ name, absences: data.dates })), [groupedAbsences]);

  return (
    <div className="max-h-40 flex overflow-auto">
      <table className="rounded-md">
        <thead className="rounded-md bg-slate-100">
          <tr className="border">
            <th className="border font-thin">KW {weekNumber}</th>
            {weekDates.map((date, index) => {
              const displayDate = new Date(date).toLocaleDateString();
              return <th className="border p-2 text-sm" key={index}>{displayDate}</th>;
            })}
          </tr>
        </thead>
        <tbody className="rounded-md max-h-5">
          {sortedData.map((person, index) => <PersonRow key={index} person={person} weekDates={weekDates} />)}
        </tbody>
      </table>
    </div>
  );
};

// Sub-components
const PersonRow: FC<{ person: Person; weekDates: Date[] }> = React.memo(({ person, weekDates }) => {
});
const DateCell: FC<{ date: Date; absences: Absence[] }> = React.memo(({ date, absences }) => {
});

export default WeekViewCalendar;
