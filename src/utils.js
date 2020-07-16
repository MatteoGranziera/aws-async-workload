const https = require('https')
const { clone } = require('ramda')
const AWS = require('aws-sdk')

/**
 * Get AWS SDK Clients
 * @param {*} credentials
 * @param {*} region
 */
const getClients = (credentials = {}, region) => {
  AWS.config.update({
    httpOptions: {
      agent
    }
  })

  const lambda = new AWS.Lambda({ credentials, region })
  const sqs = new AWS.SQS({ credentials, region })
  const sts = new AWS.STS({ credentials, region })
  return { lambda, sqs, sts }
}

const getDefaults = ({ defaults }) => {
  const response = clone(defaults)

  return response
}

const getAccountId = async (sts) => {
  const res = await sts.getCallerIdentity({}).promise()
  return res.Account
}

const getUrl = ({ name, region, accountId }) => {
  return `https://sqs.${region}.amazonaws.com/${accountId}/${name}`
}

const getArn = ({ name, region, accountId }) => {
  return `arn:aws:sqs:${region}:${accountId}:${name}`
}

module.exports = {
  getClients,

  getAccountId,
  getArn,
  getUrl,
  getDefaults
}
