import { useState, useEffect } from "react";
import { PageShell } from "@/components/page-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, CheckCircle2, Circle, Trash2 } from "lucide-react";

type Bucket = "today" | "week" | "someday" | "done";

interface Task {
  id: number;
  title: string;
  completed: boolean;
  bucket: Bucket;
  priority: "low" | "medium" | "high";
}

export default function Planner() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [input, setInput] = useState("");
  const [activeTab, setActiveTab] = useState<Bucket>("today");
 const [priority, setPriority] = useState<"low" | "medium" | "high">("medium"); 

  // ✅ LOAD FROM BACKEND
  useEffect(() => {
    fetch("http://localhost:5000/api/tasks")
      .then(res => res.json())
      .then(data => setTasks(data))
      .catch(err => console.error(err));
  }, []);

  // ✅ ADD TASK (NOW WITH BUCKET)
  const addTask = async () => {
    if (!input.trim()) return;

    try {
      const res = await fetch("http://localhost:5000/api/tasks", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          title: input,
          bucket: activeTab, 
          priority
        })
      });

      const newTask = await res.json();
      setTasks([newTask, ...tasks]);
      setInput("");
    } catch (err) {
      console.error(err);
    }
  };

  // ✅ TOGGLE DONE (BACKEND)
  const toggleDone = async (id: number) => {
    try {
      const res = await fetch(`http://localhost:5000/api/tasks/${id}`, {
        method: "PUT",
      });

      const updated = await res.json();

      setTasks(ts =>
        ts.map(t => (t.id === id ? updated : t))
      );
    } catch (err) {
      console.error(err);
    }
  };

  //EDIT
const editTask = async (id: number, newTitle: string) => {
  const res = await fetch(`http://localhost:5000/api/tasks/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ title: newTitle })
  });

  const updated = await res.json();

  setTasks(ts =>
    ts.map(t => (t.id === id ? updated : t))
  );
};

  // ✅ DELETE
  const deleteTask = async (id: number) => {
    try {
      await fetch(`http://localhost:5000/api/tasks/${id}`, {
        method: "DELETE"
      });

      setTasks(tasks.filter(t => t.id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  // ✅ CORRECT FILTER LOGIC
  const filtered = (b: Bucket) => {
    if (b === "done") {
      return tasks.filter(t => t.completed);
    }

    return tasks.filter(
      t => t.bucket === b && !t.completed
    );
  };

  return (
    <PageShell title="planner">

      <div className="px-4 py-6 max-w-2xl mx-auto space-y-8">

        {/* HEADER */}
        <div>
          <p className="text-sm text-[#7a7a7a]">
            just one thing at a time
          </p>
        </div>

        {/* ADD TASK */}
        <div className="flex gap-2 items-center">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="what needs your attention?"
            onKeyDown={(e) => e.key === "Enter" && addTask()}
          />
          <Button onClick={addTask} size="icon">
            <Plus className="w-4 h-4" />
          </Button>
        </div>

        {/* TABS */}
        <div className="space-y-4">

          <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as Bucket)}>

            <TabsList>
              {["today", "week", "someday", "done"].map((b) => (
                <TabsTrigger key={b} value={b}>
                  {b}
                </TabsTrigger>
              ))}
            </TabsList>

            {(["today", "week", "someday", "done"] as Bucket[]).map(bucket => (
              <TabsContent key={bucket} value={bucket}>

                {filtered(bucket).length === 0 ? (
                  <div className="text-center py-12 text-sm text-[#9a9a9a]">
                    nothing here yet
                  </div>
                ) : (
                  <div className="space-y-3">

                    {filtered(bucket).map(task => (
                      <div
                        key={task.id}
                        className="
                          flex items-center gap-3
                          p-4
                          rounded-xl
                          bg-white
                          border border-[#e8e8e6]
                          shadow-[0_2px_6px_rgba(0,0,0,0.04)]
                        "
                      >

                        {/* TOGGLE */}
                        <button onClick={() => toggleDone(task.id)}>
                          {task.completed ? (
                            <CheckCircle2 className="w-5 h-5 text-green-500" />
                          ) : (
                            <Circle className="w-5 h-5 text-[#9a9a9a]" />
                          )}
                        </button>

                       <p className={`
  text-sm flex-1
  ${task.completed ? "line-through text-[#9a9a9a]" : ""}
  ${task.priority === "high" ? "text-red-500" : ""}
  ${task.priority === "medium" ? "text-yellow-600" : ""}
  ${task.priority === "low" ? "text-green-600" : ""}
`}>
  {task.title}
</p>

                        {/* DELETE */}
                        <button onClick={() => deleteTask(task.id)}>
                          <Trash2 className="w-4 h-4 text-[#9a9a9a] hover:text-red-500" />
                        </button>

                      </div>
                    ))}

                  </div>
                )}

              </TabsContent>
            ))}
          </Tabs>

        </div>

        {/* NOTES */}
        <div className="space-y-2 pt-2">
          <p className="text-sm text-[#7a7a7a]">brain dump</p>
          <Textarea placeholder="write anything here, no structure needed" />
        </div>

        <div className="h-6" />

      </div>

    </PageShell>
  );
}