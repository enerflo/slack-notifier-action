import core from "@actions/core";
import { WebClient } from "@slack/web-api";

function renderContent() {
  const template = core.getInput("template");

  switch (template) {
    case "none":
      return core.getInput("content", { required: true });
    case "workflow-failure":
      return workflowFailureTemplate();
    case "build-failure":
      return buildFailureTemplate();
    default:
      throw new Error(`Bogus template: ${template}`);
  }
}

function severityIndicator(severity) {
  switch (severity) {
    case "info":
      return ":information_source";
    case "warning":
      return ":warning:";
    case "error":
      return ":rotating_light:";
    default:
      throw new Error(`Bogus severity: ${severity}`);
  }
}

function workflowRunURL() {
  return [
    process.env.GITHUB_SERVER_URL,
    process.env.GITHUB_REPOSITORY,
    "actions",
    "runs",
    process.env.GITHUB_RUN_ID,
  ].join("/");
}

function workflowFailureTemplate() {
  const severity = core.getInput("severity") ?? "error";
  const content = core.getInput("content");

  const indicator = severityIndicator(severity);

  return `
${indicator} WORKFLOW FAILURE ${indicator}

*WORKFLOW*: ${process.env.GITHUB_WORKFLOW}
*JOB*: ${process.env.GITHUB_JOB}

*REPO*: ${process.env.GITHUB_REPOSITORY}
*REF*: ${process.env.GITHUB_REF}
*LINK*: ${workflowRunURL()}

${content}
`;
}

function buildFailureTemplate() {
  const severity = core.getInput("severity") ?? "error";
  const content = core.getInput("content");

  const indicator = severityIndicator(severity);

  return `
${indicator} BUILD FAILURE ${indicator}

*APP*: ${core.getInput("app")}

*REPO*: ${process.env.GITHUB_REPOSITORY}
*REF*: ${process.env.GITHUB_REF}
*LINK*: ${workflowRunURL()}

${content}
`;
}

class SlackClient {
  constructor(token, channels) {
    this.channels = channels.split(",");
    this.client = new WebClient(token);
  }

  async post(content) {
    for (const channel of this.channels) {
      const info = await this.client.conversations.info({ channel });
      core.info(`posting to ${info.channel.name}`);
      await this.client.chat.postMessage({
        channel,
        content,
      });
    }
  }
}

async function main() {
  const token = core.getInput("token", { required: true });
  const channels = core.getInput("channels", { required: true });

  const content = renderContent();

  const client = new SlackClient(token, channels);
  await client.post(content);
}

await main()
