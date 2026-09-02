export function proposalToMarkdown(company: string, p: {
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
}) {
  const list = (items: string[]) =>
    items.map((item) => `- ${item}`).join("\n");

  return `# Proposal — ${company}

## Executive summary
${p.executiveSummary}

## Understanding of the problem
${p.problemUnderstanding}

## Proposed solution
${p.proposedSolution}

## Scope
${list(p.scope)}

## Milestones
${list(p.milestones)}

## Timeline
${p.timeline}

## Exclusions
${list(p.exclusions)}

## Assumptions
${list(p.assumptions)}

## Pricing inputs
${list(p.pricingInputs)}

## Next steps
${list(p.nextSteps)}
`;
}
