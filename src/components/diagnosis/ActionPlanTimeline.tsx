"use client";

import { Calendar, CheckCircle2 } from "lucide-react";
import { ActionPlanWeek } from "@/types/diagnosis";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";

interface ActionPlanTimelineProps {
  timeline: ActionPlanWeek[];
}

export function ActionPlanTimeline({ timeline }: ActionPlanTimelineProps) {
  return (
    <Card className="border-border/50">
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
              Panduan langkah per minggu yang disiapkan oleh Dokter Bisnis AI
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-2">
        <div className="relative border-l border-muted-foreground/20 ml-3 pl-6 space-y-8 pb-2">
          {timeline.map((plan, index) => (
            <div key={index} className="relative">
              {/* Timeline dot */}
              <span className="absolute -left-[37px] top-1.5 flex size-6 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground">
                M{plan.week}
              </span>

              {/* Card wrapper for weekly content */}
              <div className="rounded-lg border border-border/50 bg-card p-4 transition-all duration-200 hover:border-border hover:shadow-sm">
                <h4 className="text-sm font-bold text-foreground flex items-center gap-1.5">
                  Minggu ke-{plan.week}: {plan.title}
                </h4>

                <ul className="mt-3 space-y-2.5">
                  {plan.tasks.map((task, taskIdx) => (
                    <li
                      key={taskIdx}
                      className="flex items-start gap-2.5 text-xs text-muted-foreground leading-relaxed"
                    >
                      <CheckCircle2 className="size-3.5 text-success-foreground shrink-0 mt-0.5" />
                      <span>{task}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
