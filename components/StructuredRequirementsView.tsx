"use client";

import {
  ArrowRight,
  CircleDollarSign,
  GitBranch,
  ShieldAlert,
  TriangleAlert,
  Users,
  Workflow,
} from "lucide-react";
import type { StructuredRequirements } from "@/lib/types";
import { FieldCard, SectionCard } from "./SectionCard";
import { EditableSection } from "./EditableSection";
import { HBar } from "./visuals";

type Props = {
  data: StructuredRequirements;
  editing: boolean;
  onChange: (next: StructuredRequirements) => void;
};

function joinProblems(problems: StructuredRequirements["problems"]) {
  return problems.map((p) =>
    [p.painPoint, p.impact, p.frequency, p.whoExperiencesIt].join(" | "),
  );
}

function parseProblems(lines: string[]): StructuredRequirements["problems"] {
  return lines.filter(Boolean).map((line) => {
    const [painPoint = "", impact = "", frequency = "", whoExperiencesIt = ""] =
      line.split("|").map((part) => part.trim());
    return { painPoint, impact, frequency, whoExperiencesIt };
  });
}

export function StructuredRequirementsView({ data, editing, onChange }: Props) {
  return (
    <div className="space-y-5">
      <div className="grid gap-4 md:grid-cols-3">
        <FieldCard
          icon={Workflow}
          title="Company situation"
          editing={editing}
          value={data.businessContext.companySituation}
          onChange={(v) =>
            onChange({
              ...data,
              businessContext: {
                ...data.businessContext,
                companySituation: String(v),
              },
            })
          }
        />
        <FieldCard
          icon={TriangleAlert}
          tone="amber"
          title="Why they are exploring this"
          editing={editing}
          value={data.businessContext.whyExploring}
          onChange={(v) =>
            onChange({
              ...data,
              businessContext: {
                ...data.businessContext,
                whyExploring: String(v),
              },
            })
          }
        />
        <FieldCard
          icon={GitBranch}
          title="Current process"
          editing={editing}
          value={data.businessContext.currentProcess}
          onChange={(v) =>
            onChange({
              ...data,
              businessContext: {
                ...data.businessContext,
                currentProcess: String(v),
              },
            })
          }
        />
      </div>

      <SectionCard
        icon={TriangleAlert}
        tone="rose"
        title="Problems in the operation"
        highlight
      >
        {editing ? (
          <EditableSection
            editing
            label="pain | impact | frequency | who"
            list
            value={joinProblems(data.problems)}
            onChange={(v) =>
              onChange({ ...data, problems: parseProblems(v as string[]) })
            }
          />
        ) : (
          <div className="grid gap-3 md:grid-cols-2">
            {data.problems.map((p, i) => (
              <article
                key={i}
                className="rounded-xl bg-rose-50 p-4 ring-1 ring-rose-200"
              >
                <p className="font-medium text-rose-950">{p.painPoint}</p>
                <p className="mt-2 text-sm text-rose-900/80">{p.impact}</p>
                <div className="mt-3 flex flex-wrap gap-2 text-[11px]">
                  <span className="rounded-full bg-white px-2 py-0.5">
                    {p.frequency}
                  </span>
                  <span className="rounded-full bg-white px-2 py-0.5">
                    {p.whoExperiencesIt}
                  </span>
                </div>
              </article>
            ))}
          </div>
        )}
      </SectionCard>

      <SectionCard icon={GitBranch} title="Requirements mix">
        {!editing ? (
          <div className="mb-4">
            <HBar
              items={[
                {
                  label: "Must-have",
                  value: data.requirements.mustHave.length,
                  color: "#0f766e",
                },
                {
                  label: "Nice-to-have",
                  value: data.requirements.niceToHave.length,
                  color: "#c9a227",
                },
                {
                  label: "Future",
                  value: data.requirements.future.length,
                  color: "#c45c26",
                },
              ]}
            />
          </div>
        ) : null}
        <div className="grid gap-4 md:grid-cols-3">
          <EditableSection
            editing={editing}
            label="Must-have"
            list
            value={data.requirements.mustHave}
            onChange={(v) =>
              onChange({
                ...data,
                requirements: { ...data.requirements, mustHave: v as string[] },
              })
            }
          />
          <EditableSection
            editing={editing}
            label="Nice-to-have"
            list
            value={data.requirements.niceToHave}
            onChange={(v) =>
              onChange({
                ...data,
                requirements: {
                  ...data.requirements,
                  niceToHave: v as string[],
                },
              })
            }
          />
          <EditableSection
            editing={editing}
            label="Future"
            list
            value={data.requirements.future}
            onChange={(v) =>
              onChange({
                ...data,
                requirements: { ...data.requirements, future: v as string[] },
              })
            }
          />
        </div>
      </SectionCard>

      <div className="grid gap-4 md:grid-cols-2">
        <SectionCard icon={Workflow} title="Current → desired workflow">
          {editing ? (
            <div className="space-y-3">
              <EditableSection
                editing
                label="Current"
                value={data.workflow.currentState}
                onChange={(v) =>
                  onChange({
                    ...data,
                    workflow: { ...data.workflow, currentState: String(v) },
                  })
                }
              />
              <EditableSection
                editing
                label="Desired"
                value={data.workflow.desiredState}
                onChange={(v) =>
                  onChange({
                    ...data,
                    workflow: { ...data.workflow, desiredState: String(v) },
                  })
                }
              />
            </div>
          ) : (
            <div className="grid gap-3 sm:grid-cols-[1fr_auto_1fr] sm:items-center">
              <p className="rounded-xl bg-stone-100 p-4 text-sm leading-relaxed">
                {data.workflow.currentState}
              </p>
              <ArrowRight className="mx-auto text-teal-800" />
              <p className="rounded-xl bg-teal-950 p-4 text-sm leading-relaxed text-teal-50">
                {data.workflow.desiredState}
              </p>
            </div>
          )}
          <div className="mt-4">
            <EditableSection
              editing={editing}
              label="Handoffs"
              list
              value={data.workflow.handoffs}
              onChange={(v) =>
                onChange({
                  ...data,
                  workflow: { ...data.workflow, handoffs: v as string[] },
                })
              }
            />
          </div>
        </SectionCard>

        <SectionCard icon={Users} tone="gold" title="Buying map">
          {editing ? (
            <div className="grid gap-3">
              <EditableSection
                editing
                label="Champion"
                value={data.stakeholders.champion}
                onChange={(v) =>
                  onChange({
                    ...data,
                    stakeholders: {
                      ...data.stakeholders,
                      champion: String(v),
                    },
                  })
                }
              />
              <EditableSection
                editing
                label="Decision-maker"
                value={data.stakeholders.decisionMaker}
                onChange={(v) =>
                  onChange({
                    ...data,
                    stakeholders: {
                      ...data.stakeholders,
                      decisionMaker: String(v),
                    },
                  })
                }
              />
              <EditableSection
                editing
                label="Technical approver"
                value={data.stakeholders.technicalApprover}
                onChange={(v) =>
                  onChange({
                    ...data,
                    stakeholders: {
                      ...data.stakeholders,
                      technicalApprover: String(v),
                    },
                  })
                }
              />
              <EditableSection
                editing
                label="Blockers"
                list
                value={data.stakeholders.potentialBlockers}
                onChange={(v) =>
                  onChange({
                    ...data,
                    stakeholders: {
                      ...data.stakeholders,
                      potentialBlockers: v as string[],
                    },
                  })
                }
              />
            </div>
          ) : (
            <div className="relative mx-auto grid max-w-md place-items-center gap-4 py-2">
              <StakeNode
                label="Champion"
                value={data.stakeholders.champion}
                tone="teal"
              />
              <div className="grid w-full grid-cols-2 gap-3">
                <StakeNode
                  label="Decision-maker"
                  value={data.stakeholders.decisionMaker}
                  tone="gold"
                />
                <StakeNode
                  label="Technical"
                  value={data.stakeholders.technicalApprover}
                  tone="ink"
                />
              </div>
              <div className="w-full rounded-xl bg-rose-50 p-3 ring-1 ring-rose-200">
                <p className="text-[11px] font-semibold uppercase tracking-wide text-rose-800">
                  Potential blockers
                </p>
                <ul className="mt-1 space-y-1 text-sm text-rose-950">
                  {data.stakeholders.potentialBlockers.map((b, i) => (
                    <li key={i}>{b}</li>
                  ))}
                </ul>
              </div>
            </div>
          )}
        </SectionCard>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <SectionCard icon={Users} title="Users">
          <EditableSection
            editing={editing}
            label="User types"
            list
            value={data.users.userTypes}
            onChange={(v) =>
              onChange({
                ...data,
                users: { ...data.users, userTypes: v as string[] },
              })
            }
          />
          <EditableSection
            editing={editing}
            label="Approximate counts"
            value={data.users.approximateCounts}
            onChange={(v) =>
              onChange({
                ...data,
                users: { ...data.users, approximateCounts: String(v) },
              })
            }
          />
          <EditableSection
            editing={editing}
            label="Permissions / roles"
            list
            value={data.users.permissionsRoles}
            onChange={(v) =>
              onChange({
                ...data,
                users: { ...data.users, permissionsRoles: v as string[] },
              })
            }
          />
        </SectionCard>
        <SectionCard icon={CircleDollarSign} tone="amber" title="Commercial">
          <div className="grid gap-3 sm:grid-cols-2">
            <EditableSection
              editing={editing}
              label="Budget signals"
              value={data.commercial.budgetSignals}
              onChange={(v) =>
                onChange({
                  ...data,
                  commercial: { ...data.commercial, budgetSignals: String(v) },
                })
              }
            />
            <EditableSection
              editing={editing}
              label="Timeline"
              value={data.commercial.timeline}
              onChange={(v) =>
                onChange({
                  ...data,
                  commercial: { ...data.commercial, timeline: String(v) },
                })
              }
            />
            <EditableSection
              editing={editing}
              label="Urgency"
              value={data.commercial.urgency}
              onChange={(v) =>
                onChange({
                  ...data,
                  commercial: { ...data.commercial, urgency: String(v) },
                })
              }
            />
            <EditableSection
              editing={editing}
              label="Procurement"
              value={data.commercial.procurement}
              onChange={(v) =>
                onChange({
                  ...data,
                  commercial: { ...data.commercial, procurement: String(v) },
                })
              }
            />
          </div>
        </SectionCard>
      </div>

      <SectionCard icon={ShieldAlert} tone="rose" title="Risks & unknowns">
        <div className="grid gap-4 md:grid-cols-3">
          <EditableSection
            editing={editing}
            label="Unresolved"
            list
            value={data.risks.unresolvedRequirements}
            onChange={(v) =>
              onChange({
                ...data,
                risks: {
                  ...data.risks,
                  unresolvedRequirements: v as string[],
                },
              })
            }
          />
          <EditableSection
            editing={editing}
            label="Dependencies"
            list
            value={data.risks.dependencies}
            onChange={(v) =>
              onChange({
                ...data,
                risks: { ...data.risks, dependencies: v as string[] },
              })
            }
          />
          <EditableSection
            editing={editing}
            label="Missing information"
            list
            value={data.risks.missingInformation}
            onChange={(v) =>
              onChange({
                ...data,
                risks: { ...data.risks, missingInformation: v as string[] },
              })
            }
          />
        </div>
      </SectionCard>
    </div>
  );
}

function StakeNode({
  label,
  value,
  tone,
}: {
  label: string;
  value: string;
  tone: "teal" | "gold" | "ink";
}) {
  const bg = {
    teal: "bg-teal-950 text-teal-50",
    gold: "bg-amber-500 text-amber-950",
    ink: "bg-slate-900 text-white",
  }[tone];
  return (
    <div className={`w-full rounded-2xl px-4 py-3 text-center ${bg}`}>
      <p className="text-[10px] font-semibold uppercase tracking-widest opacity-80">
        {label}
      </p>
      <p className="mt-1 text-sm font-medium">{value}</p>
    </div>
  );
}
