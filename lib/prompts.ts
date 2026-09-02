import type { Deal, GenerateStep } from "./types";

function dealHeader(deal: Deal) {
  return `Company: ${deal.company_name}
URL: ${deal.company_url || "(none)"}
Target contact: ${deal.contact_name || "(unknown)"}${deal.contact_title ? `, ${deal.contact_title}` : ""}`;
}

function jsonBlock(label: string, value: unknown) {
  if (!value) return `${label}: (not available)`;
  return `${label}:\n${JSON.stringify(value, null, 2)}`;
}

export function buildPrompt(step: GenerateStep, deal: Deal): string {
  const header = dealHeader(deal);

  if (step === "account_brief") {
    return `You are a sales research analyst preparing a concise Account Brief for a discovery call.

${header}

Use only reasonable public-style inference from the company name, URL, and contact. Do not invent fake news headlines with dates. Be specific and useful for a seller.

Return a JSON object with exactly these keys:
- whatTheyDo (string)
- businessModel (string)
- companySize (string)
- locations (string)
- recentNews (string array)
- hiringActivity (string)
- leadership (string array)
- products (string array)
- competitors (string array)
- likelyTechStack (string array)
- strategicInitiatives (string array)
- publicPainSignals (string array)`;
  }

  if (step === "discovery_plan") {
    return `You are a sales coach turning account research into a point of view for a discovery call. Do not just summarize the company.

${header}

${jsonBlock("Account brief", deal.account_brief)}

Return a JSON object with exactly these keys (all string arrays):
- likelyPriorities
- painHypotheses
- reasonsTheyNeedSoftware
- questionsToSkip (info already public — do not waste call time)
- discoveryQuestions (5-10 company-specific questions)
- likelyObjections
- projectWedges
- caseStudiesToMention (plausible analog stories a custom software firm could reference)
- thingsToListenFor`;
  }

  if (step === "structured_requirements") {
    return `You convert a discovery-call transcript into structured requirements for a custom software proposal.

${header}

${jsonBlock("Account brief", deal.account_brief)}
${jsonBlock("Discovery plan", deal.discovery_plan)}

Transcript:
${deal.transcript || "(empty)"}

Capture what was said. If something was not discussed, say so explicitly in the relevant field — do not invent budget numbers or user counts.

Return a JSON object with exactly these keys:
- businessContext: { companySituation, whyExploring, currentProcess } (strings)
- problems: array of { painPoint, impact, frequency, whoExperiencesIt }
- requirements: { mustHave, niceToHave, future } (string arrays)
- users: { userTypes (string array), approximateCounts (string), permissionsRoles (string array) }
- workflow: { currentState, desiredState (strings), handoffs (string array) }
- commercial: { budgetSignals, timeline, urgency, procurement } (strings)
- stakeholders: { champion, decisionMaker, technicalApprover (strings), potentialBlockers (string array) }
- risks: { unresolvedRequirements, dependencies, missingInformation } (string arrays)`;
  }

  if (step === "follow_up_questions") {
    return `You identify what was NOT answered in discovery and write the questions needed before an accurate proposal.

${header}

${jsonBlock("Structured requirements", deal.structured_requirements)}

Typical gaps to look for: user counts, API/integration availability, decision-maker, budget, timeline, procurement.

Return a JSON object:
- gaps: array of { gap, question, whyItMatters } (all strings)`;
  }

  if (step === "solution_hypothesis") {
    return `Based on discovery, propose what should be built. Be concrete and phased. Do not write a full proposal yet.

${header}

${jsonBlock("Structured requirements", deal.structured_requirements)}
${jsonBlock("Follow-up questions / gaps", deal.follow_up_questions)}

Return a JSON object:
- summary (string) — "Here is what we think should be built."
- architecture (string)
- majorModules (string array)
- workflows (string array)
- integrations (string array)
- userRoles (string array)
- milestones (string array)
- phase1 (string array)
- futurePhases (string array)`;
  }

  return `Write a proposal a custom software firm could walk through with this prospect. Stay consistent with the approved artifacts. Flag unknowns instead of inventing commercial numbers.

${header}

${jsonBlock("Structured requirements", deal.structured_requirements)}
${jsonBlock("Gaps / follow-up questions", deal.follow_up_questions)}
${jsonBlock("Solution hypothesis", deal.solution_hypothesis)}

Return a JSON object:
- executiveSummary (string)
- problemUnderstanding (string)
- proposedSolution (string)
- scope (string array)
- milestones (string array)
- timeline (string)
- exclusions (string array)
- assumptions (string array)
- pricingInputs (string array) — inputs needed to price, not a made-up quote
- nextSteps (string array)`;
}
