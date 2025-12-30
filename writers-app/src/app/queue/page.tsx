import { prisma } from "@/lib/db";
import { format, startOfWeek } from "date-fns";

export const dynamic = "force-dynamic";

export default async function QueuePage() {
  const weekStart = startOfWeek(new Date(), { weekStartsOn: 1 });

  const queue = await prisma.weeklyQueue.findFirst({
    where: { weekStartDate: weekStart },
    orderBy: { createdAt: "desc" },
  });

  if (!queue) {
    return (
      <div className="max-w-5xl mx-auto px-6 py-12">
        <h1 className="text-4xl font-bold mb-2">Weekly Queue</h1>
        <p className="text-gray-600 mb-12">
          Week of {format(weekStart, "MMM d, yyyy")}
        </p>

        <div className="text-center py-16 border border-black">
          <p className="text-gray-600 mb-4">No queue for this week yet.</p>
          <p className="text-sm text-gray-500">
            Upload pieces and run the pipeline to generate your weekly queue.
          </p>
        </div>
      </div>
    );
  }

  const tasks = JSON.parse(queue.tasksJson);
  const doNotTouch = JSON.parse(queue.doNotTouchJson);

  const submissionTasks = tasks.filter((t: any) => t.task_type === "SUBMISSION");
  const platformTasks = tasks.filter((t: any) => t.task_type === "PLATFORM");
  const productTasks = tasks.filter((t: any) => t.task_type === "PRODUCT");

  const totalMinutes = tasks.reduce(
    (sum: number, t: any) => sum + t.time_estimate_minutes,
    0
  );

  return (
    <div className="max-w-5xl mx-auto px-6 py-12">
      <div className="mb-12">
        <h1 className="text-4xl font-bold mb-2">Weekly Queue</h1>
        <p className="text-gray-600 mb-4">
          Week of {format(weekStart, "MMM d, yyyy")}
        </p>
        <div className="flex gap-6 text-sm">
          <span className="font-semibold">
            {tasks.length} task{tasks.length !== 1 ? "s" : ""}
          </span>
          <span className="text-gray-600">
            ~{Math.round(totalMinutes / 60)} hours total
          </span>
        </div>
      </div>

      {/* Submission Tasks */}
      {submissionTasks.length > 0 && (
        <div className="mb-12">
          <h2 className="text-2xl font-bold mb-6 border-b-2 border-black pb-2">
            Submission Tasks ({submissionTasks.length}/3 max)
          </h2>
          <div className="space-y-6">
            {submissionTasks.map((task: any, i: number) => (
              <TaskCard key={i} task={task} />
            ))}
          </div>
        </div>
      )}

      {/* Platform Tasks */}
      {platformTasks.length > 0 && (
        <div className="mb-12">
          <h2 className="text-2xl font-bold mb-6 border-b-2 border-black pb-2">
            Platform Tasks ({platformTasks.length}/3 max)
          </h2>
          <div className="space-y-6">
            {platformTasks.map((task: any, i: number) => (
              <TaskCard key={i} task={task} />
            ))}
          </div>
        </div>
      )}

      {/* Product Tasks */}
      {productTasks.length > 0 && (
        <div className="mb-12">
          <h2 className="text-2xl font-bold mb-6 border-b-2 border-black pb-2">
            Product Tasks ({productTasks.length}/1 max)
          </h2>
          <div className="space-y-6">
            {productTasks.map((task: any, i: number) => (
              <TaskCard key={i} task={task} />
            ))}
          </div>
        </div>
      )}

      {/* Do Not Touch */}
      {doNotTouch.length > 0 && (
        <div className="border-2 border-black p-6">
          <h2 className="text-xl font-bold mb-4">Do Not Touch</h2>
          <p className="text-sm text-gray-600 mb-4">
            Protected pieces (held for submission or other reasons)
          </p>
          <ul className="space-y-2">
            {doNotTouch.map((item: any, i: number) => (
              <li key={i} className="text-sm">
                <span className="font-mono">{item.piece_id}</span> —{" "}
                {item.reason}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

function TaskCard({ task }: { task: any }) {
  return (
    <div className="border border-black p-6">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="font-bold text-lg mb-1">
            {task.task_type.charAt(0) + task.task_type.slice(1).toLowerCase()}
          </h3>
          <p className="text-sm text-gray-700">{task.why_now}</p>
        </div>
        <div className="text-right text-sm">
          <div className="font-semibold">~{task.time_estimate_minutes} min</div>
        </div>
      </div>

      <div className="mb-4">
        <h4 className="text-sm font-semibold mb-2">Checklist</h4>
        <ul className="space-y-1">
          {task.checklist.map((item: string, i: number) => (
            <li key={i} className="flex items-start gap-2 text-sm">
              <input type="checkbox" className="mt-1" />
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </div>

      {task.piece_ids.length > 0 && (
        <div className="text-xs text-gray-500">
          Pieces: {task.piece_ids.join(", ")}
        </div>
      )}
    </div>
  );
}
