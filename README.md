# enerflo/slack-notifier-action

A Github action to post notifications to Slack, with a focus on providing templates for common
notification use-cases.

Supported templates:
- `none`: Just post some text as-is
- `workflow-failure`: Report the failure of a CI workflow
- `build-failure`: Report a failure to build a release artifact

Use the action at the current major version tag, `v1`.

You always need to supply the OAuth token for the Slack bot you want to use to post the message
using the `token` input and a list of one or more Slack channels, as a comma-separated string, using
the channel IDs.

Note that you have to make sure the bot is added to the channel for it to be able to post on it.

```yaml
uses: enerflo/slack-notifier-action@v1
with:
  token: ${{ secrets.SLACK_NOTIFIER_TOKEN }}
  channels: "ABCDEFG,QRSTUV"
```

The template is selected using the `template` input. If you don't select one the `none` "template"
will be used, in which case you need to also supply the `content` input to provide something to
post.

```yaml
uses: enerflo/slack-notifier-action@v1
with:
  token: ${{ secrets.SLACK_NOTIFIER_TOKEN }}
  channels: ${{ vars.SLACK_CHANNELS }}
  content: "This is the message that will be posted"
```

The other templates provide most of the content you'd want to post and you only need to supply
content for the post explicitly if you want.

The `workflow-failure` template is used as a generic notification that a CI workflow failed, and
includes a variety of contextual information about the workflow including a link to the failed run
in Github.

```yaml
uses: enerflo/slack-notifier-action@v1
with:
  token: ${{ secrets.SLACK_NOTIFIER_TOKEN }}
  channels: ${{ vars.SLACK_CHANNELS }}
  template: "workflow-failure"
```

The `build-failure` template is similar and has slightly different contextual information. When
using the `build-failure` template you'll need to also supply the `app` input.

```yaml
uses: enerflo/slack-notifier-action@v1
with:
  token: ${{ secrets.SLACK_NOTIFIER_TOKEN }}
  channels: ${{ vars.SLACK_CHANNELS }}
  template: "build-failure"
  app: "foo"
```

For both `workflow-failure` and `build-failure` the message includes an icon in the banner that
communicates the severity of the notification. The severity can be set using the `severity` input,
which accepts one of `info`, `warning`, or `error`. By default the severity for both templates is
`error`.

```yaml
uses: enerflo/slack-notifier-action@v1
with:
  token: ${{ secrets.SLACK_NOTIFIER_TOKEN }}
  channels: ${{ vars.SLACK_CHANNELS }}
  template: "workflow-failure"
  severity: "warning"
```
