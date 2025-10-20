# GitHub Setup

Initial configuration required for automatic deployment.

## GitHub Variables

**Settings → Variables → Actions**

| Name | Value | Description |
|------|-------|-------------|
| `APP_DOMAIN` | `awesomeapps-frontend.meimberg.io` | Application domain |
| `SERVER_HOST` | `hc-02.meimberg.io` | Server hostname |
| `SERVER_USER` | `deploy` | SSH user (optional, defaults to `deploy`) |
| `NEXT_PUBLIC_STRAPI_BASEURL` | `https://awesomeapps-strapi.meimberg.io` | Strapi backend URL |
| `NEXT_PUBLIC_APP_BASEURL` | `https://awesomeapps-frontend.meimberg.io` | Frontend app URL |

## GitHub Secrets

**Settings → Secrets → Actions**

| Name | Value | Description |
|------|-------|-------------|
| `SSH_PRIVATE_KEY` | `<private key contents>` | Deploy user private key |
| `REVALIDATE_SECRET` | `<random secret>` | Next.js revalidation token |

**Get SSH private key:**
```bash
# Linux/Mac
cat ~/.ssh/id_rsa
# Or your deploy key: cat ~/.ssh/deploy_key

# Windows PowerShell
Get-Content C:\Users\YourName\.ssh\id_rsa
```

Copy entire output including `-----BEGIN` and `-----END` lines.

**Generate revalidate secret:**
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```



# DNS Configuration

**Add A record:**
```
awesomeapps-frontend.meimberg.io  →  CNAME  →  hc-02.meimberg.io
```

# Server Infrastructure

**Prerequisites (one-time setup):**

Run Ansible to setup server infrastructure:

```bash
cd ../io.meimberg.ansible

# Install Ansible collections
ansible-galaxy collection install -r requirements.yml

# Run infrastructure setup
ansible-playbook -i inventory/hosts.ini playbooks/site.yml --vault-password-file vault_pass
```

**This installs:**
- ✅ Docker + Docker Compose
- ✅ Traefik reverse proxy (automatic SSL)
- ✅ `deploy` user (for deployments)
- ✅ Firewall rules (SSH, HTTP, HTTPS)
- ✅ Automated backups

**Server must be ready before first deployment!**

**Note:** Ansible automatically creates deploy user and configures SSH access.



# First Deployment

After completing all steps above:

```bash
git add .
git commit -m "Setup deployment"
git push origin main
```

**Monitor:** https://github.com/meimberg-io/awesomeapps.frontend/actions

**Deployment takes ~3-4 minutes:**
1. ✅ Docker image builds
2. ✅ Pushes to GitHub Container Registry
3. ✅ SSHs to server
4. ✅ Deploys container with Traefik labels
5. ✅ App live at https://awesomeapps-frontend.meimberg.io

# Additional Information

## Checklist

Before first deployment:

- [ ] GitHub Variables added: `APP_DOMAIN`, `SERVER_HOST`, `SERVER_USER`, Next.js public vars
- [ ] GitHub Secrets added: `SSH_PRIVATE_KEY`, `REVALIDATE_SECRET`
- [ ] DNS A record configured
- [ ] Server infrastructure deployed via Ansible
- [ ] Can SSH to server: `ssh deploy@hc-02.meimberg.io`

**Estimated setup time:** 15-20 minutes


## Troubleshooting

**GitHub Actions fails at deploy step:**
```bash
# Test SSH manually
ssh -i ~/.ssh/deploy_key deploy@hc-02.meimberg.io

# Check deploy user exists
ssh root@hc-02.meimberg.io "id deploy"
```

**Container not starting:**
```bash
ssh deploy@hc-02.meimberg.io "docker logs awesomeapps-frontend"
```

**SSL certificate issues:**
```bash
# Check Traefik logs
ssh root@hc-02.meimberg.io "docker logs traefik | grep awesomeapps-frontend"

# Verify DNS propagated
dig awesomeapps-frontend.meimberg.io +short
```

**Image pull failed:**
- Automatically handled via `GITHUB_TOKEN`
- If still failing, verify package permissions in GitHub



## Changing Domain

1. Update DNS A record
2. Update GitHub Variables: `APP_DOMAIN`, `NEXT_PUBLIC_APP_BASEURL`
3. Push to trigger redeploy

No code changes needed!



## Related Documentation

- [DEPLOYMENT.md](DEPLOYMENT.md) - Deployment operations
- [../io.meimberg.ansible/README.md](../io.meimberg.ansible/README.md) - Ansible overview
- [../io.meimberg.ansible/docs/SETUP.md](../io.meimberg.ansible/docs/SETUP.md) - Server setup
- [../io.meimberg.ansible/docs/SSH-KEYS.md](../io.meimberg.ansible/docs/SSH-KEYS.md) - SSH key configuration
