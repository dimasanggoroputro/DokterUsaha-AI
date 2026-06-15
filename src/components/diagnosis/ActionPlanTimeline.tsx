"use client";

import { Calendar, Check } from "lucide-react";
import { useState, useEffect } from "react";
import { ActionPlanWeek } from "@/types/diagnosis";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { syncProgressAction } from "@/actions/syncProgress";

interface ActionPlanTimelineProps {
  timeline: ActionPlanWeek[];
  diagnosisId: string;
  initialCheckedTasks?: Record<string, boolean>;
}

export function ActionPlanTimeline({
  timeline,
  diagnosisId,
  initialCheckedTasks,
}: ActionPlanTimelineProps) {
  const [checkedTasks, setCheckedTasks] = useState<Record<string, boolean>>(
    initialCheckedTasks || {}
  );

  const storageKey = `dokterusaha_ap_progress_${diagnosisId}`;

  // Merge local storage fallback on mount
  useEffect(() => {
    if (typeof window !== "undefined" && diagnosisId) {
      try {
        const saved = localStorage.getItem(storageKey);
        if (saved) {
          const parsed = JSON.parse(saved);
          setCheckedTasks((prev) => ({
            ...parsed,
            ...prev, // initialCheckedTasks from DB takes priority
          }));
        }
      } catch (err) {
        console.warn("Failed to load local action plan progress:", err);
      }
    }
  }, [diagnosisId, storageKey]);

  // Toggle task check state and save to local storage + Supabase
  const toggleTask = async (weekNum: number, taskIdx: number) => {
    const taskKey = `${weekNum}_${taskIdx}`;
    const updated = {
      ...checkedTasks,
      [taskKey]: !checkedTasks[taskKey],
    };
    setCheckedTasks(updated);

    // 1. Save to local storage
    if (typeof window !== "undefined" && diagnosisId) {
      try {
        localStorage.setItem(storageKey, JSON.stringify(updated));
      } catch (err) {
        console.warn("Failed to save local progress:", err);
      }
    }

    // 2. Sync online to Supabase
    try {
      await syncProgressAction(diagnosisId, updated);
    } catch (err) {
      console.warn("Supabase progress sync failed (possibly offline):", err);
    }
  };

  return (
    <Card className="border-border/50 bg-card">
      <CardHeader className="pb-4">
        <div className="flex items-center gap-2">
          <div className="flex size-7 items-center justify-center rounded-lg bg-success/20 text-success-foreground border border-success-border/10">
            <Calendar className="size-4" />
          </div>
          <div>
            <CardTitle className="text-base">
              Resep Rencana Aksi (Action Plan)
            </CardTitle>
            <CardDescription className="text-xs">
              Centang langkah yang sudah Anda selesaikan untuk memantau kemajuan pemulihan usaha
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-2">
        <div className="relative border-l border-muted-foreground/20 ml-3 pl-6 space-y-8 pb-2">
          {timeline.map((plan, index) => (
            <div key={index} className="relative">
              {/* Timeline dot */}
              <span className="absolute -left-[37px] top-1.5 flex size-6 items-center justify-center rounded-full bg-[#002d54] text-[10px] font-bold text-white shadow-sm">
                M{plan.week}
              </span>

              {/* Card wrapper for weekly content */}
              <div className="rounded-lg border border-border/50 bg-card/50 p-4 transition-all duration-200 hover:border-border hover:shadow-sm">
                <h4 className="text-sm font-bold text-[#002d54] flex items-center gap-1.5">
                  Minggu ke-{plan.week}: {plan.title}
                </h4>

                <ul className="mt-3 space-y-3">
                  {plan.tasks.map((task, taskIdx) => {
                    const taskKey = `${plan.week}_${taskIdx}`;
                    const isChecked = !!checkedTasks[taskKey];
                    return (
                      <li
                        key={taskIdx}
                        className="flex items-start gap-2.5 text-xs transition-all duration-200"
                      >
                        <button
                          type="button"
                          onClick={() => toggleTask(plan.week, taskIdx)}
                          className={cn(
                            "flex h-4.5 w-4.5 shrink-0 items-center justify-center rounded-full border transition-all duration-200 focus:outline-none mt-0.5 cursor-pointer",
                            isChecked 
                              ? "bg-success border-success text-white shadow-sm" 
                              : "border-slate-300 bg-transparent hover:border-slate-400 text-transparent"
                          )}
                        >
                          <Check className="size-3 stroke-[3px]" />
                        </button>
                        <span
                          onClick={() => toggleTask(plan.week, taskIdx)}
                          className={cn(
                            "pt-0.5 leading-relaxed cursor-pointer transition-colors duration-200 flex-1 select-none",
                            isChecked 
                              ? "line-through text-muted-foreground/50 italic" 
                              : "text-foreground/80 hover:text-foreground"
                          )}
                        >
                          {task}
                        </span>
                      </li>
                    );
                  })}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
