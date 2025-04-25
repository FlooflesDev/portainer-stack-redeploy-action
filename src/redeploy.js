const fetch = require('node-fetch');

async function redeployStack(portainerUrl, accessToken, stackId) {
  try {
    if (isNaN(stackId)) {
      throw new Error('Stack ID must be integer');
    }

    if (accessToken.length === 0) {
      throw new Error('No access token provided');
    }

    // Normalize portainer URL
    if (!portainerUrl.includes('http')) {
      portainerUrl = `https://${portainerUrl}`;
    }
    if (portainerUrl.endsWith('/')) {
      portainerUrl = portainerUrl.slice(0, -1);
    }

    const stackResponse = await fetch(`${portainerUrl}/api/stacks/${stackId}`, {
        headers: {
            'X-API-Key': accessToken
        }
    });

    if (!stackResponse.ok) {
        throw new Error(`Failed to get stack: ${stackResponse.statusText}`);
    }

    const stackData = await stackResponse.json();
    const endpointId = stackData.EndpointId;
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
  } catch (error) {
    throw error;
  }
}

module.exports = { redeployStack }; 