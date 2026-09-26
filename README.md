# sethuprabakaran.com

Static site for Sethu Prabakaran's engineering-leadership mentoring. Plain HTML/CSS/JS in `site/`, with no build step. Hosted on S3 + CloudFront + Route 53 and deployed by GitHub Actions.

## Local preview

```bash
python3 -m http.server -d site 8080
```

## Editing content

Everything is in `site/index.html`:
- **Booking links:** search for `adplist.org/mentors/sethu-prabakaran`
- **Testimonials:** copy a `<figure class="quote">` block inside `#testimonials`
- **Photo:** `site/assets/sethu.jpg` (full size) and `sethu-700.jpg`; `og-image.jpg` is the social share card

## One-time infra setup

Prerequisites:
- A Route 53 public hosted zone for `sethuprabakaran.com` exists (if the domain is registered elsewhere, point its nameservers at that zone)
- AWS credentials with admin rights are available locally

```bash
cd infra
terraform init
terraform apply -var 'github_repo=OWNER/REPO'
```

Set `-var create_github_oidc_provider=false` if the account already has the GitHub OIDC provider.

Then, in GitHub, under **Settings → Secrets and variables → Actions**:

| Kind     | Name                         | Value                                  |
|----------|------------------------------|----------------------------------------|
| Secret   | `AWS_DEPLOY_ROLE_ARN`        | `terraform output -raw deploy_role_arn` |
| Variable | `S3_BUCKET`                  | `terraform output -raw bucket_name`    |
| Variable | `CLOUDFRONT_DISTRIBUTION_ID` | `terraform output -raw distribution_id` |

## Deploying

- **Automatic:** push to `main` with changes under `site/`
- **Manual:** run `./deploy.sh` (reads values from `terraform output`)
