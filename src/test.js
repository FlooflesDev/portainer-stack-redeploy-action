const { redeployStack } = require('./redeploy');

// Test configuration
const config = {
  portainerUrl: '',
  accessToken: '',
  stackId: 0
};

// Run the test
async function runTest() {
  try {
    console.log('Starting test...');
    await redeployStack(config.portainerUrl, config.accessToken, config.stackId);
    console.log('Test completed successfully');
  } catch (error) {
    console.error('Test failed:', error.message);
  }
}

runTest(); 