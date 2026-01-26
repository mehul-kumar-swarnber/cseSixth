const timetable = {
  Monday:   ["Data Structures", "OS", "DBMS", "Networks", "Maths"],
  Tuesday:  ["DBMS", "Data Structures", "OS", "Maths", "Elective"],
  Wednesday:["Networks", "DBMS", "OS", "Data Structures", "Lab"],
  Thursday: ["OS", "Maths", "Data Structures", "DBMS", "Elective"],
  Friday:   ["Maths", "Networks", "OS", "Data Structures", "Lab"],
};

function getToday() {
  const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  return days[new Date().getDay()];
}

export default function Timetable() {
  const today = getToday();
  const periods = timetable[today] || [];
  return (
    <div className="p-6 space-y-4">
      <h1 className="text-3xl font-bold mb-8 bg-linear-to-r from-indigo-400 to-purple-500 bg-clip-text text-transparent">
        Today's Timetable
      </h1>
      <div className="w-full max-w-md mx-auto bg-gray-900/80 rounded-2xl shadow-xl border border-gray-800 divide-y divide-gray-800">
        {periods.length === 0 ? (
          <div className="p-6 text-center text-gray-400">No classes today!</div>
        ) : (
          periods.map((subject, i) => (
            <div key={i} className="flex items-center justify-between p-4">
              <span className="text-lg font-semibold text-indigo-300">Period {i + 1}</span>
              <span className="text-gray-100 font-medium">{subject}</span>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
