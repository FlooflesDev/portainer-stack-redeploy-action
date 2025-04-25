# Portainer Stack Redeploy Action

This action allows you to update the stack with pull new images if you can't use webhooks. For example, in Portainer Community Edition.

## Inputs

### `portainerUrl`

**Required** URL to the application instance. For example, https://example.com:9443

### `accessToken`

**Required** Token for API requests, can be created on the page https://example.com:9443/#!/account/tokens/new

### `stackId`

**Required** ID of stack to be updated. Must be integer

## Example usage

```yaml
uses:  FlooflesDev/portainer-stack-redeploy-action@v1.0.1
with:
  portainerUrl: 'https://example.com:9443'
  accessToken: 'ptr_XXXyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyy'
  stackId: 8
```

## Features

- Handles URL normalization

## Error Handling

The script will fail with appropriate error messages in the following cases:
- Invalid Stack ID
- Failed API requests
- Invalid stack file content
- Network errors