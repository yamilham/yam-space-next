export default function DailyRoutine() {
  const activities = [
    "💪🏼 Exercise",
    "🧹 Clean",
    "🧑🏼‍🍳 Cook",
    "🎨 Design",
    "🧑🏻‍💻 Code",
  ];

  return (
    <div className="space-y-2">
      {activities.map((activity) => (
        <div
          key={activity}
          className="flex items-start gap-4 p-3 rounded-lg border hover:bg-gray-50 transition-colors"
        >
          <div className="text-md text-gray-700">{activity}</div>
        </div>
      ))}
    </div>
  );
}
