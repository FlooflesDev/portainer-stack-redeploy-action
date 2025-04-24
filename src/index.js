const core = require('@actions/core');
const fetch = require('node-fetch');

async function run() {
  try {
    let portainerUrl = core.getInput('portainerUrl');
    const accessToken = core.getInput('accessToken');
    const stackId = parseInt(core.getInput('stackId'));

    if (isNaN(stackId)) {
      throw new Error('Stack ID must be integer');
    }

    // Normalize portainer URL
    if (!portainerUrl.includes('http')) {
      portainerUrl = `https://${portainerUrl}`;
    }
    if (portainerUrl.endsWith('/')) {
      portainerUrl = portainerUrl.slice(0, -1);
    }

    // Set secrets
    core.setSecret(portainerUrl);
    core.setSecret(accessToken);

    const stackResponse = await fetch(`${portainerUrl}/api/stacks/${stackId}`, {
        headers: {
            'X-API-Key': accessToken
        }
    });

    if (!stackResponse.ok) {
        throw new Error(`Failed to get stack: ${stackResponse.statusText}`);
    }

    const stackData = await stackResponse.json();
    const endpointId = stackData.EndpointID;
    const stackEnv = stackData.Env;

    // Second, get the stack file content
    const fileResponse = await fetch(`${portainerUrl}/api/stacks/${stackId}/file`, {
      headers: {
        'X-API-Key': accessToken
      }
    });

    if (!fileResponse.ok) {
      throw new Error(`Failed to get stack file: ${fileResponse.statusText}`);
    }

    const fileData = await fileResponse.json();
    const stackFileContent = fileData.StackFileContent;

    if (!stackFileContent) {
      throw new Error('Wrong stack file content');
    }

    // Then, update the stack
    const updateUrl = `${portainerUrl}/api/stacks/${stackId}${isNaN(endpointId) ? '' : `?endpointId=${endpointId}`}`;
    const updateResponse = await fetch(updateUrl, {
      method: 'PUT',
      headers: {
        'X-API-Key': accessToken,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        env: stackEnv,
        pullImage: true,
        stackFileContent
      })
    });

    if (!updateResponse.ok) {
      throw new Error(`Failed to update stack: ${updateResponse.statusText}`);
    }

    core.info('Stack redeployment successful');
  } catch (error) {
    core.setFailed(error.message);
  }
}

run(); 