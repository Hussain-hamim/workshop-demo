export type StorageMode = "browser" | "sqlite";

export type GenerateStep =
  | "account_brief"
  | "discovery_plan"
  | "structured_requirements"
  | "follow_up_questions"
  | "solution_hypothesis"
  | "proposal";

export type AccountBrief = {
  whatTheyDo: string;
  businessModel: string;
  companySize: string;
  locations: string;
  recentNews: string[];
  hiringActivity: string;
  leadership: string[];
  products: string[];
  competitors: string[];
  likelyTechStack: string[];
  strategicInitiatives: string[];
  publicPainSignals: string[];
};

export type DiscoveryPlan = {
  likelyPriorities: string[];
  painHypotheses: string[];
  reasonsTheyNeedSoftware: string[];
  questionsToSkip: string[];
  discoveryQuestions: string[];
  likelyObjections: string[];
  projectWedges: string[];
  caseStudiesToMention: string[];
  thingsToListenFor: string[];
};

export type StructuredRequirements = {
  businessContext: {
    companySituation: string;
    whyExploring: string;
    currentProcess: string;
  };
  problems: Array<{
    painPoint: string;
    impact: string;
    frequency: string;
    whoExperiencesIt: string;
  }>;
  requirements: {
    mustHave: string[];
    niceToHave: string[];
    future: string[];
  };
  users: {
    userTypes: string[];
    approximateCounts: string;
    permissionsRoles: string[];
  };
  workflow: {
    currentState: string;
    desiredState: string;
    handoffs: string[];
  };
  commercial: {
    budgetSignals: string;
    timeline: string;
    urgency: string;
    procurement: string;
  };
  stakeholders: {
    champion: string;
    decisionMaker: string;
    technicalApprover: string;
    potentialBlockers: string[];
  };
  risks: {
    unresolvedRequirements: string[];
    dependencies: string[];
    missingInformation: string[];
  };
};

export type FollowUpQuestions = {
  gaps: Array<{
    gap: string;
    question: string;
    whyItMatters: string;
  }>;
};

export type SolutionHypothesis = {
  summary: string;
  architecture: string;
  majorModules: string[];
  workflows: string[];
  integrations: string[];
  userRoles: string[];
  milestones: string[];
  phase1: string[];
  futurePhases: string[];
};

export type Proposal = {
  executiveSummary: string;
  problemUnderstanding: string;
  proposedSolution: string;
  scope: string[];
  milestones: string[];
  timeline: string;
  exclusions: string[];
  assumptions: string[];
  pricingInputs: string[];
  nextSteps: string[];
};

export type Deal = {
  id: string;
  company_name: string;
  company_url: string;
  contact_name: string;
  contact_title: string;
  current_step: number;
  is_sample: boolean;
  account_brief: AccountBrief | null;
  discovery_plan: DiscoveryPlan | null;
  transcript: string | null;
  structured_requirements: StructuredRequirements | null;
  follow_up_questions: FollowUpQuestions | null;
  solution_hypothesis: SolutionHypothesis | null;
  proposal: Proposal | null;
  created_at: string;
};

export type DealListItem = Pick<
  Deal,
  | "id"
  | "company_name"
  | "contact_name"
  | "contact_title"
  | "current_step"
  | "is_sample"
  | "created_at"
>;
