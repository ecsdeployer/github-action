[![GitHub release](https://img.shields.io/github/release/ecsdeployer/github-action.svg?logo=github&style=flat-square)](https://github.com/ecsdeployer/github-action/releases/latest)
<!-- [![GitHub Marketplace](https://img.shields.io/badge/marketplace-ecsdeployer--action-blue?logo=github&style=flat-square)](https://github.com/marketplace/actions/ecsdeployer-action) -->

# ECSDeployer GitHub Action
A [GitHub Action](https://github.com/features/actions) for [ECSDeployer](https://ecsdeployer.com/)

## Usage
```yaml
name: "Deploy"
on:
  push:
    tags:
      - 'v**'

permissions:
  contents: read
  id-token: write

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v4
      
      - name: Configure AWS Credentials
        uses: aws-actions/configure-aws-credentials@v4
        with:
          role-to-assume: arn:aws:iam::12345678910:role/deployment-role
          aws-region: us-east-1

      - name: Login to Amazon ECR
        id: login-ecr
        uses: aws-actions/amazon-ecr-login@v1

      - name: Set up QEMU
        uses: docker/setup-qemu-action@v2

      - name: Setup up Docker Buildx
        uses: docker/setup-buildx-action@v2

      - name: Build Push
        uses: docker/build-push-action@v3
        with:
          push: true
          tags: ${{ steps.login-ecr.outputs.registry }}/myapp:${{ github.ref_name }}

      - name: Deploy
        uses: ecsdeployer/github-action@v1
        with:
          image: ${{ steps.login-ecr.outputs.registry }}/myapp:${{ github.ref_name }}
```

## Customizing

### inputs

Name       | Type     | Description
-----------|----------|------------
`config` | String | Deployment YML file for the project (default `.ecsdeployer.yml`)
`image` | String | Provide the full URI of your container image
`tag` | String | Provide the tag portion of a container image
`app-version` | String | Provide a version identifier for your app
`extra-args` | String | Additional arguments to pass to the deployer command
`workdir` | String | Working directory of execution (default `.`)
`timeout` | String | Sets a timeout for the deployment (default `90m`)
`install-only` | Bool | Installs ECSDeployer but does not run it (default: `false`)
`ecsdeployer-version` | String | Use a specific version of ECSDeployer (default `latest`)

## See Also
* [ECS Deployer Documentation](https://ecsdeployer.com/)
* [ECS Deployer: GitHub Actions](https://ecsdeployer.com/ci/github/)

## License
MIT