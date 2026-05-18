export const generateSmartGoal = async (
  input: string
) => {
  const lowerInput = input.toLowerCase();

  if (lowerInput.includes("sales")) {
    return `
Professional Goal Title:
Increase Quarterly Sales Revenue

SMART Description:
Increase quarterly sales revenue by 20% through targeted outreach campaigns, improved client engagement, and optimized conversion strategies before the end of Q4.

Suggested Target:
20% Revenue Growth

Suggested Weightage:
25%

Suggested Unit of Measurement:
%
`;
  }

  if (
    lowerInput.includes("support") ||
    lowerInput.includes("customer")
  ) {
    return `
Professional Goal Title:
Improve Customer Support Efficiency

SMART Description:
Reduce average customer ticket resolution time from 18 hours to 8 hours by implementing streamlined workflows and proactive support management before Q3.

Suggested Target:
8 Hours Resolution Time

Suggested Weightage:
20%

Suggested Unit of Measurement:
Timeline
`;
  }

  if (
    lowerInput.includes("marketing")
  ) {
    return `
Professional Goal Title:
Boost Marketing Campaign Performance

SMART Description:
Increase campaign engagement rate by 30% through data-driven targeting and optimized content strategies before the next quarter.

Suggested Target:
30% Engagement Increase

Suggested Weightage:
15%

Suggested Unit of Measurement:
%
`;
  }

  return `
Professional Goal Title:
Improve Organizational Performance

SMART Description:
Enhance operational efficiency and team productivity through measurable process improvements and strategic execution within the upcoming quarter.

Suggested Target:
15% Improvement

Suggested Weightage:
20%

Suggested Unit of Measurement:
Numeric
`;
};

export const generateRecoveryStrategy = (
  progress: number,
  blocker: string
) => {
  const lowerBlocker =
    blocker.toLowerCase();

  if (progress >= 80) {
    return `
• Execution performance is healthy.
• Maintain current delivery velocity.
• Continue milestone tracking consistency.
• Monitor operational dependencies proactively.
`;
  }

  if (
    lowerBlocker.includes("approval")
  ) {
    return `
• Escalate approval bottlenecks to reporting managers.
• Introduce faster stakeholder review cycles.
• Schedule weekly alignment meetings.
• Implement backup approval workflows.
`;
  }

  if (
    lowerBlocker.includes("resource")
  ) {
    return `
• Reallocate workload across team members.
• Increase execution bandwidth temporarily.
• Prioritize critical deliverables first.
• Escalate resource limitations to leadership.
`;
  }

  if (
    lowerBlocker.includes("delay")
  ) {
    return `
• Break deliverables into smaller milestones.
• Increase weekly progress checkpoints.
• Improve execution accountability tracking.
• Reduce dependency bottlenecks.
`;
  }

  if (progress < 50) {
    return `
• High execution risk detected.
• Increase managerial oversight immediately.
• Conduct strategic execution review sessions.
• Focus on short-term milestone recovery planning.
`;
  }

  return `
• Moderate execution risk identified.
• Improve weekly execution consistency.
• Strengthen milestone accountability.
• Monitor blockers proactively.
`;
};