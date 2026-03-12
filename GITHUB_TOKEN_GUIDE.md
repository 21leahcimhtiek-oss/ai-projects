# GitHub Token Setup Guide

## Creating a Personal Access Token (PAT)

### Step 1: Navigate to Token Settings

1. Go to GitHub.com and log in
2. Click your profile picture → **Settings**
3. In the left sidebar, click **Developer settings**
4. Click **Personal access tokens** → **Tokens (classic)**
5. Click **Generate new token (classic)**

### Step 2: Configure Token Scopes

Select the following scopes for full Copilot autonomy:

#### Required Scopes

| Scope | Purpose |
|-------|---------|
| `repo` | Full repository access (read, write, delete) |
| `workflow` | Update GitHub Actions workflows |
| `write:packages` | Upload packages to GitHub Packages |
| `read:packages` | Download packages from GitHub Packages |
| `delete:packages` | Delete packages |
| `read:org` | Read org and team membership |
| `write:org` | Update org and team membership |
| `admin:org` | Full org access (if needed) |

#### Optional Scopes

| Scope | Purpose |
|-------|---------|
| `gist` | Create gists |
| `notifications` | Access notifications |
| `user` | Update user profile |
| `delete_repo` | Delete repositories |
| `admin:repo_hook` | Manage repository webhooks |

### Step 3: Generate and Save

1. Give your token a descriptive name (e.g., "Copilot Multi-Agent System")
2. Set expiration (90 days recommended, or custom)
3. Click **Generate token**
4. **Copy the token immediately** - you won't see it again!

### Step 4: Configure in Your Environment

```bash
# Option 1: Set as environment variable
export GITHUB_TOKEN=ghp_your_token_here

# Option 2: Add to .env file
echo "GITHUB_TOKEN=ghp_your_token_here" >> .env

# Option 3: Configure MCP
# Add to .vscode/mcp.json:
{
  "mcpServers": {
    "github": {
      "env": {
        "GITHUB_PERSONAL_ACCESS_TOKEN": "ghp_your_token_here"
      }
    }
  }
}
```

## Token Security Best Practices

### DO ✅

- Store tokens in `.env` files (add to `.gitignore`)
- Use environment variables in CI/CD
- Rotate tokens regularly (every 90 days)
- Use fine-grained tokens when possible
- Audit token usage in GitHub settings

### DON'T ❌

- Never commit tokens to git
- Never share tokens in chat or email
- Never use tokens in public repositories
- Never use tokens with more scopes than needed
- Never ignore token expiration warnings

## Fine-Grained Tokens (Alternative)

For better security, consider fine-grained tokens:

1. Go to **Personal access tokens** → **Fine-grained tokens**
2. Click **Generate new token**
3. Select:
   - Resource owner: Your organization or personal account
   - Repository access: Only select repositories
   - Permissions:
     - Contents: Read and write
     - Issues: Read and write
     - Pull requests: Read and write
     - Actions: Read and write
     - Workflows: Read and write

## Troubleshooting

### Token Not Working

```bash
# Verify token is valid
curl -H "Authorization: token ghp_your_token" https://api.github.com/user

# Check token scopes
curl -H "Authorization: token ghp_your_token" -I https://api.github.com/user
# Look for "X-OAuth-Scopes" in the response
```

### Permission Denied Errors

- Ensure `repo` scope is selected
- Check if repository is in an organization (may need org scopes)
- Verify token hasn't expired
- Check if SAML enforcement is enabled

### Rate Limits

- Authenticated requests: 5,000 per hour
- Unauthenticated requests: 60 per hour
- Check remaining: `curl -H "Authorization: token ghp_token" -I https://api.github.com/user`

## MCP Configuration Template

Save as `.vscode/mcp.json`:

```json
{
  "mcpServers": {
    "github": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-github"],
      "env": {
        "GITHUB_PERSONAL_ACCESS_TOKEN": "YOUR_TOKEN_HERE"
      }
    }
  }
}
```

## Need Help?

- [GitHub Token Documentation](https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/creating-a-personal-access-token)
- [GitHub API Rate Limits](https://docs.github.com/en/rest/overview/resources-in-the-rest-api#rate-limiting)
- [Fine-Grained Tokens](https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/managing-your-personal-access-tokens#creating-a-fine-grained-personal-access-token)