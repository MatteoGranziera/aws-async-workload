const aws = require('aws-sdk')
const { Component } = require('@serverless/core')

const outputsList = ['arn', 'url']

const defaults = {
  name: 'serverless',
  region: 'eu-central-1'
}

class AwsAsyncWorkload extends Component {
  async deploy(inputs = {}) {
    console.debug(`inputs: `, JSON.stringify(inputs))
    const config = mergeDeepRight(getDefaults({ defaults }), inputs)

    // Get AWS clients
    const { sqs, lambda, sts } = getClients(this.credentials.aws, config.region)

    const accountId = await getAccountId(sts)

    this.state.name = config.name
    this.state.arn = config.arn
    this.state.url = config.url
    await this.save()

    const outputs = pick(outputsList, config)
    return outputs
  }

  async remove(inputs = {}) {
    console.debug(`inputs: `, JSON.stringify(inputs))
    const config = mergeDeepRight(getDefaults({ defaults }), inputs)
    config.name = inputs.name || this.state.name || defaults.name

    const { sqs, lambda, sts } = getClients(this.credentials.aws, config.region)

    const accountId = await getAccountId(sts)

    this.state = {}
    await this.save()

    return {}
  }
}

module.exports = AwsAsyncWorkload
