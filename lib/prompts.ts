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

export function buildTranscriptPrompt(deal: Deal): string {
  const speaker =
    deal.contact_name?.trim() ||
    `a ${deal.contact_title || "senior"} contact`;
  const title = deal.contact_title ? `, ${deal.contact_title}` : "";

  return `Write a realistic discovery-call transcript for a custom-software workshop demo.

${dealHeader(deal)}

${jsonBlock("Account brief", deal.account_brief)}
${jsonBlock("Discovery plan", deal.discovery_plan)}

The call is between:
- ${speaker}${title} at ${deal.company_name}
- a Consultant from a custom software firm

Return ONLY the transcript. No title, no markdown fences, no commentary.

Format every line as:
Name (role, company): spoken text
or
Consultant: spoken text

Use the contact's first name after the first line. Invent plausible operational detail that fits the company, but do not invent fake news headlines, dollar amounts, or exact user counts. Leave a few gaps a later step can turn into follow-up questions (budget, headcount, API readiness, who signs).

Cover, in a natural conversation:
1. Why they took the meeting / what is breaking
2. Typical day and current process
3. Where work comes in
4. Existing tools
5. Who feels the pain
6. What better looks like
7. Must-haves versus later
8. Stakeholders (champion, approver, skeptic) — invent first and last names that fit
9. Timeline
10. Users
11. Integrations / data
12. A closing "don't boil the ocean" note

Keep it tight: 12–16 short exchanges, about 350–450 words. Enough for the next step to extract requirements, not a full novel.`;
}

export function fallbackTranscript(deal: Deal): string {
  const company = deal.company_name || "the company";
  const fullName = deal.contact_name?.trim() || "Alex Rivera";
  const first = fullName.split(" ")[0] || "Alex";
  const title = deal.contact_title || "VP Operations";
  const pain =
    deal.account_brief?.publicPainSignals?.[0] ||
    "too much of the operation still runs on spreadsheets, chat, and tribal knowledge";

  return `${fullName} (${title}, ${company}): Thanks for making time. I'll be direct — ${pain}. It is starting to show up in the numbers, and I don't want another quarter of firefighting.

Consultant: Appreciate the candor. Walk me through what a typical day looks like.

${first}: We are not a tiny shop, but the ops layer still feels like one. The team starts the morning in a shared spreadsheet and a group chat. Overnight issues land by email. Someone rebuilds the board: what is in flight, who is available, which customers pinged. If one thing slips, people start texting each other and the sheet is stale within an hour.

Consultant: Where does new work come in?

${first}: Mix of email, phone, and a couple of partners who still send files. There is no portal. Customers call for status constantly. Someone has to walk over to ops or ping Slack. We lose hours a day on that.

Consultant: What software is already in the mix?

${first}: Finance has a system. There is an older platform we barely use — it was set up for a different shape of the business. The field / frontline team has a lightweight tool that does not talk to ops. No customer portal. No shared live view. Slack and Google Workspace are the real system of record, which is a polite way of saying they are not.

Consultant: Who feels this the most?

${first}: The ops team first. Then customer-facing people. Then me, because service is slipping and we had a couple of incidents that almost cost us a real account. The people doing the work are frustrated too — the plan changes and nobody updates them cleanly.

Consultant: What would better look like?

${first}: One place where work comes in, gets assigned, and stays visible. Ops should see capacity without rebuilding a board. Customers should see status without calling. The people in the field should get the next action on their phone. And I want a real picture of performance without someone building a Friday deck by hand.

Consultant: Must-haves versus later?

${first}: Must-have is the ops board and tracking that the team will actually use. If it does not replace the spreadsheet in month one, we have failed. A simple status view for customers is close behind. Mobile for the field would be huge but I could live with phase two. Integrations: finance, yes. The old platform we can probably leave behind. Don't rebuild our whole stack.

Consultant: Who else needs to buy in?

${first}: I'm the champion. I'll live in this. Our CEO signs anything over a certain spend — I don't want to quote the number on this call. IT is a small team; they'll care about security and whether this sits in our Microsoft / Google world. There is an ops lead who will be the skeptic. If that person hates the workflow, the team will not adopt it.

Consultant: Timeline?

${first}: We have a busy season coming. I want a first version in the next 3 to 4 months if that's realistic. After the incidents, leadership is paying attention. This is not a someday project.

Consultant: Rough sense of users?

${first}: Ops plus customer team plus me to start. Field users if we do mobile. I don't have a clean headcount for licenses — I need to confirm that. Some overlap and part-timers.

Consultant: Any APIs or data we should plug into?

${first}: I'm not sure what the field vendor even offers. IT would know. A couple of larger customers have asked about EDI or a status API. We didn't get into budget on this call; I'll need to talk internally before I can be useful there.

Consultant: Anything we should not miss?

${first}: Don't boil the ocean. We have been burned by a platform that sat unused. Start with intake, assignment, tracking, and a simple status view. Prove it with one team or one customer group if you have to. And please don't make us fill out a 40-field form to create a job. These people are running the operation, not doing data entry.`;
}
