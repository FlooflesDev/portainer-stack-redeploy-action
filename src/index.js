const core = require('@actions/core');
const { redeployStack } = require('./redeploy');

async function runAction() {
  const portainerUrl = core.getInput('portainerUrl');
  const accessToken = core.getInput('accessToken');
  const stackId = parseInt(core.getInput('stackId'));

  // Validate inputs
  if (!portainerUrl) {
    throw new Error('portainerUrl is required');
  }
  if (!accessToken) {
    throw new Error('accessToken is required');
  }
  if (!stackId) {
    throw new Error('stackId is required');
  }

  core.info(`Redeploying stack ${stackId} on ${portainerUrl}`);

  try {
    await redeployStack(portainerUrl, accessToken, stackId);
    core.info('Stack redeployment successful');
  } catch (error) {
    core.setFailed(error.message);
  }
}

runAction();