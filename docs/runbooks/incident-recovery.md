# Runbook: Incident and Recovery

**Status:** Initial template. Assign real contacts before a production pilot.

## Severity guide

- **SEV-1:** suspected exposure of student/staff data, unauthorized marks/attendance/result change, credential compromise, or widespread outage during a critical workflow.
- **SEV-2:** major feature unusable, important source feed systematically wrong/stale, repeated notification failures causing missed deadlines, or migration failure with user impact.
- **SEV-3:** isolated non-sensitive bug with workaround or degraded non-critical feature.

Severity and communication process must be approved by the actual institutional/project owner before production.

## First response

1. Stop the unsafe operation or disable the affected feature/integration if this can be done safely.
2. Identify affected environments, users, resources and time window.
3. Preserve relevant logs and request IDs while minimizing collection of private content.
4. Notify the designated project owner/security contact via the approved channel.
5. Do not speculate publicly or paste real student data into AI tools/issues.
6. Record the timeline, decisions and owners.

## Credential compromise

- Revoke/rotate the affected API key, service-role key, OAuth credential, or token.
- Check Git history and deployment logs; removing a secret from the latest file is not sufficient.
- Review access logs for misuse and limit privileges while investigating.
- Test the new credential path and ensure the old credential is invalid.

## Data access/ privacy incident

- Disable the vulnerable route/tool or revoke affected permissions.
- Preserve safe audit metadata; do not copy sensitive record contents into general tickets.
- Determine whether access occurred, which data categories and users may be affected, and whether data was changed or exported.
- Follow the organization's approved notification/reporting process; do not invent legal conclusions.
- Add a regression test for the specific unauthorized path and adjacent cases.

## Bad academic data or rule

- Mark the source/rule as unverified, stale, superseded or conflicting; suppress consequential calculations where needed.
- Notify the source/policy owner and stop distribution of the incorrect claim.
- Correct the source mapping through a reviewed change, not by changing values invisibly.
- Identify affected students/outputs and follow approved correction/communication procedures.
- Add regression fixtures for applicability and effective-date behavior.

## Failed migration / data integrity

1. Stop additional deployments and writes if continuing may corrupt data.
2. Inspect migration history, error output and actual schema/data state.
3. Do not force-push migration history or run drop/recreate scripts casually.
4. Decide with the database owner whether to forward-fix, restore, or roll back at the application level.
5. Test recovery in an isolated environment first.
6. Verify critical records, auth/RLS policies and workflows after recovery.
7. Document the incident and recovery actions.

## AI safety/cost incident

- Disable the specific tool/model path or apply rate/cost limits.
- Check for prompt injection, cross-user retrieval, unbounded loops, excessive file processing or invalid component output.
- Retain only necessary telemetry; redact sensitive prompts/results.
- Add/adapt adversarial test cases before re-enabling.

## Post-incident review

Within the team's agreed window, capture root cause, impact, detection gap, contributing factors, what helped, corrective actions with owners/dates, and test/monitoring changes. Blamelessly investigate systemic issues; don't normalize repeated manual fixes.

## Required contacts before real pilot

- Product owner:
- Technical lead:
- Institutional data/policy owner:
- Database/hosting admin:
- Security/privacy contact:
- Student-support escalation contact:
