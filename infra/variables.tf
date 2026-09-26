variable "domain_name" {
  description = "Apex domain. A Route 53 public hosted zone for it must already exist."
  type        = string
  default     = "sethuprabakaran.com"
}

variable "aws_region" {
  description = "Region for the S3 bucket."
  type        = string
  default     = "ap-southeast-1"
}

variable "github_repo" {
  description = "GitHub repo allowed to deploy, as owner/name (e.g. sethuraghavan/sethuprabakaran)."
  type        = string
}

variable "github_immutable_repo" {
  description = "Repo in GitHub's immutable OIDC subject format, owner@id/name@id. Get it from: gh api repos/OWNER/REPO/actions/oidc/customization/sub"
  type        = string
  default     = null
}

variable "github_branch" {
  description = "Branch allowed to deploy."
  type        = string
  default     = "main"
}

variable "create_github_oidc_provider" {
  description = "Set false if the account already has the token.actions.githubusercontent.com OIDC provider."
  type        = bool
  default     = true
}
