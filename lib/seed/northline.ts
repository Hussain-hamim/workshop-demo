import type {
  AccountBrief,
  DiscoveryPlan,
  FollowUpQuestions,
  Proposal,
  SolutionHypothesis,
  StructuredRequirements,
} from "../types";

export const NORTHLINE = {
  company_name: "Northline Logistics",
  company_url: "https://northlinefreight.example",
  contact_name: "Sarah Chen",
  contact_title: "VP Operations",
};

export const NORTHLINE_TRANSCRIPT = `Sarah Chen (VP Operations, Northline Logistics): Thanks for making time. I'll be direct — our dispatch process is held together with spreadsheets, radios, and tribal knowledge. It's starting to break.

Consultant: Appreciate the candor. Walk me through what a typical day looks like for dispatch.

Sarah: We run regional LTL and dedicated freight across the Midwest — Illinois, Indiana, Wisconsin, Iowa, Michigan. About 120 people. Forty-two drivers, eight dispatchers, a small customer service team, and the usual back office. Dispatchers sit in a room in Joliet with whiteboards and a shared Google Sheet that nobody fully trusts.

Every morning they rebuild the board: which trucks are available, which loads dropped overnight from email, which customers called in. Then they start assigning. If a driver calls in sick, or a pickup runs late, the sheet falls apart and people start texting each other.

Consultant: Where do new loads come from?

Sarah: Mix of email, phone, and a couple of shippers who still fax. Customer service copies them into the sheet. There's no portal. Customers call us constantly asking "where's my freight?" and CS has to walk over to dispatch or ping someone on Slack. We lose hours a day on status chasing.

Consultant: Any existing software in the mix?

Sarah: QuickBooks for invoicing. A very old McLeod install that we barely use — it was set up for a different operation years ago. Drivers use a cheap ELD for hours-of-service, but it doesn't talk to dispatch. No TMS worth mentioning. No customer portal. No driver app.

Consultant: Who feels this the most?

Sarah: Dispatchers first. Then CS. Then me, because on-time performance is slipping and we had two service failures last quarter that almost cost us a CPG account. Drivers are frustrated too — they get assignments by phone, then the plan changes, and nobody updates them cleanly.

Consultant: What would "better" look like for you?

Sarah: I want one place where loads come in, get assigned, and stay visible. Dispatchers should see capacity and constraints without rebuilding a board. Customers should be able to see status without calling. Drivers should get the next stop on their phone. And I want a real picture of on-time performance without someone building a report by hand on Friday.

Consultant: Any must-haves versus nice-to-haves?

Sarah: Must-have is dispatch and load tracking that the team will actually use. If it doesn't replace the spreadsheet in month one, we've failed. Customer portal is close behind — that's the status-call problem. Driver mobile would be huge but I could live with phase two if we have to. Integrations... QuickBooks for sure. The ELD if it's not a nightmare. McLeod we can probably leave behind.

Consultant: Who else needs to buy in?

Sarah: I'm the champion. I'll use this every day. Our CEO, Mark Alvarez, signs off on anything over a certain spend — I don't want to quote the number on this call. IT is basically one person, Priya Nair. She'll care about security and whether this sits in our Microsoft 365 world. Dispatch lead, Tom Brennan, will be the skeptic. If Tom doesn't like the workflow, the team won't adopt it.

Consultant: Timeline?

Sarah: We have a peak season in Q4. I'd like something live for dispatch before then — so a first version in the next 3 to 4 months if that's realistic. After the two failures, leadership is paying attention. It's not "someday."

Consultant: Rough sense of users?

Sarah: Dispatchers plus CS plus me to start. Drivers if we do mobile. I don't have a clean headcount for licenses — CS is around six people, dispatch is eight, but some overlap and part-timers. I need to confirm that.

Consultant: Any API or data you already have that we should plug into?

Sarah: I'm not sure what the ELD vendor even offers. Priya would know. Customers have asked about EDI from a couple of larger shippers — I don't know if we can support that. We didn't get into budget on this call; I'll need to talk to Mark before I can be useful there.

Consultant: Anything else we should not miss?

Sarah: Don't boil the ocean. We've been burned by a "platform" that sat unused. Start with dispatch, tracking, and a simple portal. Prove it with one lane or one customer group if you have to. And please don't make us fill out a 40-field form to create a load. These people are moving freight, not doing data entry.`;

export const NORTHLINE_ACCOUNT_BRIEF: AccountBrief = {
  whatTheyDo:
    "Regional less-than-truckload and dedicated freight carrier serving shippers across the Midwest. Moves inbound and outbound freight for manufacturers, distributors, and a handful of CPG accounts.",
  businessModel:
    "Asset-based regional carrier: owns/operates a fleet, sells capacity and service reliability rather than a digital marketplace. Revenue is per-load / contracted lanes, with customer service as a differentiator that is currently under strain.",
  companySize:
    "Approximately 120 employees. About 42 drivers, 8 dispatchers, a small customer-service team, plus operations and back office in Joliet, Illinois.",
  locations:
    "Headquarters and dispatch in Joliet, IL. Serves Illinois, Indiana, Wisconsin, Iowa, and Michigan. No public indication of coastal or national expansion.",
  recentNews: [
    "Quiet operator — little press beyond local chamber and industry directory listings.",
    "Industry context: regional LTL shippers are pushing carriers for live tracking after several high-profile service misses in the sector.",
    "Q4 peak season is the operational planning horizon leadership is talking about internally.",
  ],
  hiringActivity:
    "Public listings recently include a dispatcher and a customer-service representative — a signal that volume is up and the current process is absorbing people rather than software.",
  leadership: [
    "Mark Alvarez — CEO (commercial and spend approval)",
    "Sarah Chen — VP Operations (day-to-day ops, likely champion)",
    "Priya Nair — IT (lean team; Microsoft 365 environment)",
    "Tom Brennan — Dispatch lead (adoption gatekeeper)",
  ],
  products: [
    "Regional LTL",
    "Dedicated / contracted lanes",
    "Basic pickup and delivery with phone/email status updates",
  ],
  competitors: [
    "Regional LTL peers (e.g. similar Midwest independents)",
    "National LTL networks when shippers need broader coverage",
    "3PLs who already offer customer portals and tracking as table stakes",
  ],
  likelyTechStack: [
    "QuickBooks (invoicing)",
    "Legacy McLeod install (underused)",
    "Consumer ELD for HOS, not integrated to dispatch",
    "Google Sheets + Slack + email/fax for load intake",
    "Microsoft 365 (IT preference)",
  ],
  strategicInitiatives: [
    "Protect a key CPG account after recent service failures",
    "Improve on-time performance with a real operational picture",
    "Reduce inbound 'where's my freight?' calls",
    "Get a usable dispatch system live before Q4 peak",
  ],
  publicPainSignals: [
    "Manual dispatch on whiteboards and untrusted spreadsheets",
    "No customer portal — status is handled by phone",
    "Disconnected ELD, billing, and dispatch tools",
    "Hiring into dispatcher/CS roles instead of removing load from the process",
  ],
};

export const NORTHLINE_DISCOVERY_PLAN: DiscoveryPlan = {
  likelyPriorities: [
    "Stabilize dispatch so the board does not collapse when a driver or pickup changes",
    "Give customers self-serve status to stop the call volume",
    "Show leadership a credible on-time picture before Q4",
    "Adopt something the dispatch team will actually use — not another unused platform",
  ],
  painHypotheses: [
    "Load intake is fragmented (email, phone, fax), so the spreadsheet is always stale",
    "Status lives in people's heads, so CS cannot answer without interrupting dispatch",
    "Driver assignments by phone create change-chaos and missed updates",
    "On-time reporting is a Friday spreadsheet, so problems surface too late",
  ],
  reasonsTheyNeedSoftware: [
    "Spreadsheet dispatch does not scale with exception handling",
    "Customers and CPG accounts now expect tracking as a default",
    "Service failures have executive attention — there is a window to fund an ops system",
    "Existing McLeod is not the system of record; they are already living outside it",
  ],
  questionsToSkip: [
    "What does the company do / where do they operate? (public + brief)",
    "Do they already have a modern TMS? (legacy McLeod, barely used)",
    "Are they a broker vs asset-based? (asset-based regional carrier)",
    "What accounting tool they use? (QuickBooks is known)",
  ],
  discoveryQuestions: [
    "When a same-day change hits, what is the actual sequence from dispatch to driver to customer?",
    "Which customers generate the most status calls, and what would they need to stop calling?",
    "What does 'replacing the spreadsheet in month one' look like for Tom's team — fields, speed, exceptions?",
    "Who creates a load today, and what is the minimum information they have at that moment?",
    "What would make this a failure in Mark's eyes by Q4?",
    "How does QuickBooks invoicing relate to delivered loads today?",
    "What constraints matter for assignment — HOS, equipment type, customer windows, driver home time?",
    "Is EDI from larger shippers a phase-1 requirement or a talking point?",
    "How should Priya think about identity, access, and where the system is hosted?",
    "If we piloted with one customer group or lane, which one would prove the most?",
  ],
  likelyObjections: [
    "We tried a platform before and nobody used it",
    "Dispatchers will not fill out long forms",
    "IT is one person — we cannot take on a heavy implementation",
    "Budget needs Mark, and we may not get a number on the first pass",
    "Don't touch McLeod / ELD if integration becomes the project",
  ],
  projectWedges: [
    "Dispatcher workstation that replaces the morning board rebuild",
    "Customer status portal for the CPG account that almost churned",
    "Exception-handling workflow (sick driver, late pickup) with a live board",
    "Friday on-time snapshot for leadership — small, visible win",
  ],
  caseStudiesToMention: [
    "Regional carrier that replaced a shared spreadsheet with a live dispatch board in 90 days",
    "Ops team that cut inbound status calls by giving one key account a tracking link",
    "Phased delivery: dispatch first, portal second, driver app later — so adoption is not gated on mobile",
  ],
  thingsToListenFor: [
    "Whether Tom (dispatch lead) is in the room or being spoken for",
    "Hard Q4 date vs wishful 'before peak'",
    "Budget language: 'talk to Mark' vs a range",
    "User counts that stay vague — CS/dispatch overlap, part-timers, drivers",
    "EDI and ELD API mentioned as hope rather than known capability",
    "Appetite for a narrow pilot vs a full cutover",
  ],
};

export const NORTHLINE_REQUIREMENTS: StructuredRequirements = {
  businessContext: {
    companySituation:
      "Northline is a ~120-person Midwest asset-based carrier. Dispatch runs on whiteboards, a shared Google Sheet, Slack, and phone. A legacy McLeod install is not the system of record. Two recent service failures put a CPG account at risk and have leadership's attention.",
    whyExploring:
      "The current process breaks on exceptions, customers cannot see status without calling, and Q4 peak is approaching. Sarah wants a first version live in 3–4 months that the team will actually use.",
    currentProcess:
      "Loads arrive by email, phone, and occasional fax. CS copies them into a spreadsheet. Dispatchers rebuild the board each morning and assign by phone/radio. Status is tribal knowledge. QuickBooks invoices separately. ELD covers HOS only.",
  },
  problems: [
    {
      painPoint: "Dispatch board is rebuilt daily and collapses on exceptions",
      impact: "Missed assignments, internal scrambling, on-time slippage",
      frequency: "Daily; acute whenever a driver or pickup changes",
      whoExperiencesIt: "Dispatchers, then Sarah / ops leadership",
    },
    {
      painPoint: "No customer-facing status — 'where's my freight?' calls",
      impact: "Hours of CS time; dispatch interrupted; customer trust eroding",
      frequency: "Constant throughout the day",
      whoExperiencesIt: "Customer service, dispatch, key accounts",
    },
    {
      painPoint: "Driver plans change by phone with no clean update path",
      impact: "Driver frustration, stale plans, service failures",
      frequency: "Multiple times per shift",
      whoExperiencesIt: "Drivers and dispatch",
    },
    {
      painPoint: "On-time reporting is a manual Friday exercise",
      impact: "Problems surface too late for leadership to intervene",
      frequency: "Weekly, with lag",
      whoExperiencesIt: "Sarah, CEO",
    },
  ],
  requirements: {
    mustHave: [
      "Live dispatch board that replaces the spreadsheet in month one",
      "Load intake that is fast (not a 40-field form)",
      "Load tracking visible to ops and, soon after, to customers",
      "Exception handling (sick driver, late pickup) without rebuilding the board",
      "QuickBooks connection for invoicing off delivered loads",
    ],
    niceToHave: [
      "Driver mobile app for next-stop assignments",
      "ELD integration for HOS-aware assignment",
      "On-time performance snapshot for leadership",
    ],
    future: [
      "EDI from larger shippers",
      "Broader analytics / lane profitability",
      "Leaving McLeod fully behind",
    ],
  },
  users: {
    userTypes: [
      "Dispatchers",
      "Customer service",
      "VP Operations / ops managers",
      "Drivers (if mobile in a later phase)",
      "Customers (portal, limited view)",
    ],
    approximateCounts:
      "Not confirmed. Directional: ~8 dispatchers, ~6 CS, Sarah; 42 drivers if mobile is in scope. Part-timers and overlap uncounted.",
    permissionsRoles: [
      "Dispatcher: create/assign/update loads",
      "CS: create loads, view status, not reassign fleet",
      "Ops leadership: reporting and oversight",
      "Customer: status on their shipments only",
      "Driver: assigned stops only (phase 2)",
    ],
  },
  workflow: {
    currentState:
      "Intake (email/phone/fax) → CS pastes into sheet → morning board rebuild → phone assignment → exceptions via Slack/text → CS walks to dispatch for status → Friday manual OTP report.",
    desiredState:
      "Intake into one system → live board with capacity/constraints → assignment that notifies the driver → customer-visible status → exception updates in place → operational OTP without a scavenger hunt.",
    handoffs: [
      "CS → Dispatch on new loads",
      "Dispatch → Driver on assignment and changes",
      "Dispatch/CS → Customer on status (should become self-serve)",
      "Ops → QuickBooks on delivery for invoicing",
    ],
  },
  commercial: {
    budgetSignals:
      "Not discussed. CEO Mark Alvarez approves spend over an unnamed threshold. Sarah will need a separate conversation before a number exists.",
    timeline:
      "First version in 3–4 months; dispatch live before Q4 peak. Portal close behind. Driver app acceptable as phase 2.",
    urgency:
      "High. Recent service failures, at-risk CPG account, executive attention, immovable peak season.",
    procurement:
      "CEO sign-off on spend. IT (Priya) will review security and Microsoft 365 fit. No formal RFP mentioned.",
  },
  stakeholders: {
    champion: "Sarah Chen, VP Operations",
    decisionMaker: "Mark Alvarez, CEO (spend)",
    technicalApprover: "Priya Nair, IT",
    potentialBlockers: [
      "Tom Brennan, dispatch lead — adoption veto if workflow is clumsy",
      "Thin IT capacity for a heavy implementation",
      "Budget still unconfirmed with Mark",
    ],
  },
  risks: {
    unresolvedRequirements: [
      "License / user counts",
      "Whether ELD vendor has a usable API",
      "EDI as phase 1 vs later",
      "Pilot vs full cutover",
    ],
    dependencies: [
      "QuickBooks invoicing flow",
      "Microsoft 365 identity / hosting preference",
      "Dispatcher adoption (Tom)",
      "Q4 peak as a hard calendar constraint",
    ],
    missingInformation: [
      "Budget range",
      "Confirmed user counts",
      "ELD API availability",
      "Decision-maker not in the room",
      "EDI requirements from named shippers",
    ],
  },
};

export const NORTHLINE_FOLLOW_UPS: FollowUpQuestions = {
  gaps: [
    {
      gap: "User count was never confirmed",
      question:
        "Can you confirm named users for phase 1 (dispatch, CS, ops) and whether part-timers need their own seats?",
      whyItMatters: "Drives licensing, training plan, and pricing inputs.",
    },
    {
      gap: "Budget was not discussed",
      question:
        "What range is Mark likely to approve for a 3–4 month phase 1, and is this opex vs a capitalized project?",
      whyItMatters: "Without a range, any proposal is a guess and may stall at CEO review.",
    },
    {
      gap: "Decision-maker was not on the call",
      question:
        "Can we get 20 minutes with Mark on what 'success before Q4' means in his words?",
      whyItMatters: "Sarah is champion, not signer. Misalignment here kills the deal late.",
    },
    {
      gap: "API / ELD availability is unclear",
      question:
        "Can Priya share the ELD vendor and whether they expose HOS or location via API?",
      whyItMatters: "Determines if driver-aware dispatch is phase 1 or a later integration.",
    },
    {
      gap: "Integration requirements need clarification",
      question:
        "What is the minimum QuickBooks flow — invoice on delivery, or more — and is EDI from named shippers required before peak?",
      whyItMatters: "Scope and timeline change if EDI is in phase 1.",
    },
    {
      gap: "Timeline is still directional",
      question:
        "What is the actual 'must be live' date for dispatch vs portal, and is a single-lane pilot acceptable?",
      whyItMatters: "Phase 1 cut line and staffing depend on this.",
    },
  ],
};

export const NORTHLINE_SOLUTION: SolutionHypothesis = {
  summary:
    "A focused operations system for Northline: live dispatch, load tracking, and a simple customer portal in phase 1. Driver mobile and deeper integrations follow once the spreadsheet is actually dead.",
  architecture:
    "Cloud-hosted web app (Microsoft-friendly identity) with a single operational database. Dispatch and CS use a fast web workstation. Customers get a tightly scoped portal. Drivers, later, use a lightweight mobile client. QuickBooks is a one-way handoff on delivery. ELD/EDI are integration adapters, not the core.",
  majorModules: [
    "Load intake (short form + email capture later)",
    "Live dispatch board (capacity, assignments, exceptions)",
    "Shipment tracking timeline",
    "Customer status portal",
    "Basic on-time / exception reporting",
    "QuickBooks delivery-to-invoice handoff",
  ],
  workflows: [
    "Create load → appear on live board",
    "Assign driver/truck with visible constraints",
    "Handle exception without rebuilding the day",
    "Customer checks status without calling",
    "Mark delivered → queue for invoicing",
  ],
  integrations: [
    "QuickBooks (phase 1)",
    "Microsoft 365 SSO (phase 1 preference)",
    "ELD API (phase 1 if available, else phase 2)",
    "Shipper EDI (phase 2 unless a named account blocks go-live)",
  ],
  userRoles: [
    "Dispatcher",
    "Customer service",
    "Operations manager",
    "Customer (portal)",
    "Driver (phase 2)",
    "Admin / IT",
  ],
  milestones: [
    "Week 2: workflow workshop with Tom's desk as the source of truth",
    "Week 6: dispatch board in use on a pilot set of loads",
    "Week 10: tracking + customer portal for one account group",
    "Week 14: QuickBooks handoff + OTP snapshot; phase 1 live before peak",
  ],
  phase1: [
    "Replace spreadsheet dispatch",
    "Exception handling on a live board",
    "Internal tracking",
    "Customer portal for at least one key account",
    "QuickBooks invoicing handoff",
    "OTP snapshot for Sarah/Mark",
  ],
  futurePhases: [
    "Driver mobile next-stop app",
    "ELD-aware assignment",
    "EDI for larger shippers",
    "Richer analytics and lane views",
  ],
};

export const NORTHLINE_PROPOSAL: Proposal = {
  executiveSummary:
    "Northline's growth is constrained by a dispatch process that lives in spreadsheets, phones, and hallway questions. This proposal covers a 14-week phase 1: a live dispatch board, shipment tracking, a customer status portal for a pilot account group, and a QuickBooks handoff — in time to operate before Q4 peak. Driver mobile and deeper integrations are explicitly later.",
  problemUnderstanding:
    "Dispatchers rebuild the day every morning. Customers call for status because nothing is visible. Drivers get plans by phone. On-time performance is reconstructed on Fridays. Two service failures have already threatened a CPG relationship. The team does not need another unused platform; they need the spreadsheet to go away in month one.",
  proposedSolution:
    "A purpose-built operations application: fast load intake, a live board that survives exceptions, tracking that CS and customers can see, and a narrow reporting slice for leadership. Hosted in a way Priya can live with (Microsoft 365 identity). Designed with Tom's workflow first so adoption is not optional theater.",
  scope: [
    "Load create / edit with a short operational form",
    "Live dispatch board: units, loads, assignments, exceptions",
    "Internal shipment timeline",
    "Customer portal: status for a defined account group",
    "Roles for dispatch, CS, ops manager, customer, admin",
    "QuickBooks handoff on delivered loads",
    "Weekly on-time / exception snapshot",
    "Onboarding and desk-side training for dispatch + CS",
  ],
  milestones: [
    "Kickoff and dispatcher workflow workshop",
    "Pilot board live on a constrained load set",
    "Portal live for one customer group",
    "Phase 1 production cutover before Q4 peak",
  ],
  timeline:
    "Approximately 14 weeks for phase 1, assuming timely access to Tom, Priya, and a QuickBooks sandbox. A one-week slip still fits a pre-peak go-live if kickoff is prompt.",
  exclusions: [
    "Driver mobile application (phase 2)",
    "Full ELD integration unless API is confirmed during kickoff",
    "EDI onboarding for shippers",
    "Replacing or migrating McLeod as a program",
    "Custom hardware, radios, or ELD devices",
    "Broad BI / data warehouse work",
  ],
  assumptions: [
    "Sarah remains the internal champion and can convene dispatch for workshops",
    "Phase 1 user count is on the order of dispatch + CS + ops leadership (to be confirmed)",
    "A single customer group is acceptable for the first portal",
    "QuickBooks is the invoicing system of record",
    "Budget and CEO approval proceed in parallel with discovery close-out",
  ],
  pricingInputs: [
    "Named phase-1 users (dispatch, CS, ops) — count unconfirmed",
    "Customer portal accounts for the pilot group — count unconfirmed",
    "Implementation / workshop / training effort for 14-week phase 1",
    "Hosting and Microsoft 365 SSO setup",
    "Optional: ELD adapter if API exists (quoted separately)",
    "Phase 2 driver seats — not in this price until in scope",
  ],
  nextSteps: [
    "Confirm user counts and portal pilot account with Sarah",
    "Short session with Mark on success criteria and budget range",
    "Priya: identity, hosting, ELD vendor/API",
    "Desk observation with Tom for the phase 1 board",
    "Revise this proposal with numbers and a kickoff date",
  ],
};
