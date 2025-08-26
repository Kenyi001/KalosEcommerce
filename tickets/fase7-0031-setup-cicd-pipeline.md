# Ticket Fase 7-0031: Pipeline CI/CD

## 📋 Descripción
Implementar pipeline completo de CI/CD para la plataforma Kalos, incluyendo integración continua con testing automatizado, deployment automático a múltiples ambientes, monitoreo de calidad de código y gestión de releases.

## 🎯 Objetivos
- Pipeline de integración continua (CI)
- Deployment automático (CD) a staging y producción
- Testing automatizado en múltiples niveles
- Análisis de calidad de código
- Gestión automatizada de releases
- Monitoreo y rollback automático
- Notificaciones de estado del pipeline

## 📊 Criterios de Aceptación

### ✅ Integración Continua (CI)
- [ ] Build automático en cada push/PR
- [ ] Testing unitario y de integración
- [ ] Análisis de calidad de código
- [ ] Verificación de dependencias de seguridad
- [ ] Validación de Firebase rules y schemas

### ✅ Deployment Continuo (CD)
- [ ] Deploy automático a staging en main branch
- [ ] Deploy a producción con aprobación manual
- [ ] Estrategia blue-green deployment
- [ ] Rollback automático en caso de falla
- [ ] Variables de ambiente por entorno

### ✅ Testing Automatizado
- [ ] Unit tests con coverage mínimo 80%
- [ ] Integration tests
- [ ] E2E tests críticos
- [ ] Performance tests
- [ ] Security tests

### ✅ Monitoreo y Alertas
- [ ] Monitoreo de salud del pipeline
- [ ] Alertas de falla en Slack/email
- [ ] Métricas de deployment frequency
- [ ] Métricas de lead time y MTTR
- [ ] Dashboard de estado de releases

## 🔧 Implementación Técnica

### GitHub Actions Workflow Structure
```
.github/
├── workflows/
│   ├── ci.yml                    # Integración continua
│   ├── cd-staging.yml            # Deploy a staging
│   ├── cd-production.yml         # Deploy a producción
│   ├── security-scan.yml         # Escaneo de seguridad
│   ├── dependency-check.yml      # Verificación dependencias
│   └── release.yml               # Gestión de releases
├── scripts/
│   ├── deploy.sh                 # Script de deployment
│   ├── test.sh                   # Script de testing
│   ├── build.sh                  # Script de build
│   └── rollback.sh               # Script de rollback
└── templates/
    ├── issue_template.md         # Template para issues
    └── pull_request_template.md  # Template para PRs
```

### CI Workflow Implementation
```yaml
# .github/workflows/ci.yml
name: Continuous Integration

on:
  push:
    branches: [ main, develop ]
  pull_request:
    branches: [ main, develop ]

env:
  NODE_VERSION: '18'
  FIREBASE_PROJECT_ID: ${{ secrets.FIREBASE_PROJECT_ID }}

jobs:
  # =====================
  # LINTING AND FORMATTING
  # =====================
  lint:
    name: Lint and Format Check
    runs-on: ubuntu-latest
    steps:
      - name: Checkout code
        uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: ${{ env.NODE_VERSION }}
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Run ESLint
        run: npm run lint

      - name: Check Prettier formatting
        run: npm run format:check

      - name: Run Stylelint
        run: npm run lint:css

  # =====================
  # SECURITY SCANNING
  # =====================
  security:
    name: Security Scan
    runs-on: ubuntu-latest
    steps:
      - name: Checkout code
        uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: ${{ env.NODE_VERSION }}
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Run npm audit
        run: npm audit --audit-level=moderate

      - name: Run Snyk security scan
        uses: snyk/actions/node@master
        env:
          SNYK_TOKEN: ${{ secrets.SNYK_TOKEN }}
        with:
          args: --severity-threshold=medium

      - name: Upload Snyk results to GitHub Code Scanning
        uses: github/codeql-action/upload-sarif@v3
        if: always()
        with:
          sarif_file: snyk.sarif

  # =====================
  # BUILD AND VALIDATE
  # =====================
  build:
    name: Build Application
    runs-on: ubuntu-latest
    needs: [lint]
    steps:
      - name: Checkout code
        uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: ${{ env.NODE_VERSION }}
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Build application
        run: npm run build
        env:
          VITE_FIREBASE_API_KEY: ${{ secrets.VITE_FIREBASE_API_KEY_STAGING }}
          VITE_FIREBASE_AUTH_DOMAIN: ${{ secrets.VITE_FIREBASE_AUTH_DOMAIN_STAGING }}
          VITE_FIREBASE_PROJECT_ID: ${{ secrets.VITE_FIREBASE_PROJECT_ID_STAGING }}

      - name: Upload build artifacts
        uses: actions/upload-artifact@v4
        with:
          name: build-files
          path: dist/
          retention-days: 7

      - name: Validate Firebase configuration
        run: |
          npm install -g firebase-tools
          firebase use --token ${{ secrets.FIREBASE_TOKEN }} ${{ env.FIREBASE_PROJECT_ID }}
          firebase deploy --only firestore:rules --dry-run --token ${{ secrets.FIREBASE_TOKEN }}
          firebase deploy --only storage:rules --dry-run --token ${{ secrets.FIREBASE_TOKEN }}

  # =====================
  # UNIT TESTING
  # =====================
  unit-tests:
    name: Unit Tests
    runs-on: ubuntu-latest
    needs: [lint]
    steps:
      - name: Checkout code
        uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: ${{ env.NODE_VERSION }}
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Run unit tests
        run: npm run test:unit -- --coverage --watchAll=false

      - name: Upload coverage reports to Codecov
        uses: codecov/codecov-action@v4
        with:
          file: ./coverage/lcov.info
          flags: unittests
          name: codecov-umbrella

      - name: Check coverage threshold
        run: |
          COVERAGE=$(cat coverage/coverage-summary.json | jq .total.lines.pct)
          if (( $(echo "$COVERAGE < 80" | bc -l) )); then
            echo "Coverage $COVERAGE% is below 80% threshold"
            exit 1
          fi

  # =====================
  # INTEGRATION TESTING
  # =====================
  integration-tests:
    name: Integration Tests
    runs-on: ubuntu-latest
    needs: [build]
    services:
      firebase:
        image: firebase/emulator-suite
        ports:
          - 4000:4000
          - 5000:5000
          - 8080:8080
          - 9000:9000
    steps:
      - name: Checkout code
        uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: ${{ env.NODE_VERSION }}
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Download build artifacts
        uses: actions/download-artifact@v4
        with:
          name: build-files
          path: dist/

      - name: Start Firebase emulators
        run: |
          npm install -g firebase-tools
          firebase emulators:start --only firestore,auth,functions,storage --import=./test-data &
          sleep 10

      - name: Run integration tests
        run: npm run test:integration
        env:
          FIREBASE_AUTH_EMULATOR_HOST: localhost:9099
          FIRESTORE_EMULATOR_HOST: localhost:8080

      - name: Upload test results
        uses: actions/upload-artifact@v4
        if: always()
        with:
          name: integration-test-results
          path: test-results/

  # =====================
  # E2E TESTING
  # =====================
  e2e-tests:
    name: E2E Tests
    runs-on: ubuntu-latest
    needs: [build]
    steps:
      - name: Checkout code
        uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: ${{ env.NODE_VERSION }}
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Install Playwright browsers
        run: npx playwright install --with-deps

      - name: Download build artifacts
        uses: actions/download-artifact@v4
        with:
          name: build-files
          path: dist/

      - name: Start application server
        run: |
          npm run preview &
          sleep 5

      - name: Run E2E tests
        run: npm run test:e2e

      - name: Upload E2E test results
        uses: actions/upload-artifact@v4
        if: always()
        with:
          name: e2e-test-results
          path: test-results/

      - name: Upload Playwright report
        uses: actions/upload-artifact@v4
        if: always()
        with:
          name: playwright-report
          path: playwright-report/

  # =====================
  # CODE QUALITY ANALYSIS
  # =====================
  code-quality:
    name: Code Quality Analysis
    runs-on: ubuntu-latest
    needs: [lint]
    steps:
      - name: Checkout code
        uses: actions/checkout@v4
        with:
          fetch-depth: 0  # Shallow clones should be disabled for SonarQube

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: ${{ env.NODE_VERSION }}
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Run tests for SonarQube
        run: npm run test:unit -- --coverage --watchAll=false

      - name: SonarQube Scan
        uses: sonarqube-scanner-action@master
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
          SONAR_TOKEN: ${{ secrets.SONAR_TOKEN }}

      - name: SonarQube Quality Gate check
        id: sonarqube-quality-gate-check
        uses: sonarqube-quality-gate-action@master
        timeout-minutes: 5
        env:
          SONAR_TOKEN: ${{ secrets.SONAR_TOKEN }}

  # =====================
  # PERFORMANCE TESTING
  # =====================
  performance-tests:
    name: Performance Tests
    runs-on: ubuntu-latest
    needs: [build]
    steps:
      - name: Checkout code
        uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: ${{ env.NODE_VERSION }}
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Download build artifacts
        uses: actions/download-artifact@v4
        with:
          name: build-files
          path: dist/

      - name: Start application server
        run: |
          npm run preview &
          sleep 5

      - name: Run Lighthouse CI
        run: |
          npm install -g @lhci/cli@0.12.x
          lhci autorun --upload.target=filesystem --upload.outputDir=./lhci_reports
        env:
          LHCI_GITHUB_APP_TOKEN: ${{ secrets.LHCI_GITHUB_APP_TOKEN }}

      - name: Upload Lighthouse results
        uses: actions/upload-artifact@v4
        with:
          name: lighthouse-results
          path: lhci_reports/

  # =====================
  # NOTIFICATION
  # =====================
  notify-success:
    name: Notify Success
    runs-on: ubuntu-latest
    needs: [unit-tests, integration-tests, e2e-tests, code-quality, security, performance-tests]
    if: success()
    steps:
      - name: Notify Slack - Success
        uses: 8398a7/action-slack@v3
        with:
          status: success
          channel: '#kalos-ci'
          webhook_url: ${{ secrets.SLACK_WEBHOOK }}
          fields: repo,message,commit,author,action,eventName,ref,workflow

  notify-failure:
    name: Notify Failure
    runs-on: ubuntu-latest
    needs: [unit-tests, integration-tests, e2e-tests, code-quality, security, performance-tests]
    if: failure()
    steps:
      - name: Notify Slack - Failure
        uses: 8398a7/action-slack@v3
        with:
          status: failure
          channel: '#kalos-ci'
          webhook_url: ${{ secrets.SLACK_WEBHOOK }}
          fields: repo,message,commit,author,action,eventName,ref,workflow
```

### CD Staging Workflow
```yaml
# .github/workflows/cd-staging.yml
name: Deploy to Staging

on:
  push:
    branches: [ main ]
  workflow_dispatch:

env:
  NODE_VERSION: '18'
  FIREBASE_PROJECT_ID_STAGING: ${{ secrets.FIREBASE_PROJECT_ID_STAGING }}

jobs:
  # =====================
  # DEPLOY TO STAGING
  # =====================
  deploy-staging:
    name: Deploy to Staging
    runs-on: ubuntu-latest
    environment: staging
    steps:
      - name: Checkout code
        uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: ${{ env.NODE_VERSION }}
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Build for staging
        run: npm run build
        env:
          VITE_APP_ENV: staging
          VITE_FIREBASE_API_KEY: ${{ secrets.VITE_FIREBASE_API_KEY_STAGING }}
          VITE_FIREBASE_AUTH_DOMAIN: ${{ secrets.VITE_FIREBASE_AUTH_DOMAIN_STAGING }}
          VITE_FIREBASE_PROJECT_ID: ${{ secrets.VITE_FIREBASE_PROJECT_ID_STAGING }}
          VITE_FIREBASE_STORAGE_BUCKET: ${{ secrets.VITE_FIREBASE_STORAGE_BUCKET_STAGING }}
          VITE_FIREBASE_MESSAGING_SENDER_ID: ${{ secrets.VITE_FIREBASE_MESSAGING_SENDER_ID_STAGING }}
          VITE_FIREBASE_APP_ID: ${{ secrets.VITE_FIREBASE_APP_ID_STAGING }}

      - name: Deploy to Firebase Hosting
        run: |
          npm install -g firebase-tools
          firebase deploy --only hosting --token ${{ secrets.FIREBASE_TOKEN }} --project ${{ env.FIREBASE_PROJECT_ID_STAGING }}

      - name: Deploy Firestore Rules
        run: |
          firebase deploy --only firestore:rules --token ${{ secrets.FIREBASE_TOKEN }} --project ${{ env.FIREBASE_PROJECT_ID_STAGING }}

      - name: Deploy Storage Rules
        run: |
          firebase deploy --only storage:rules --token ${{ secrets.FIREBASE_TOKEN }} --project ${{ env.FIREBASE_PROJECT_ID_STAGING }}

      - name: Deploy Cloud Functions
        run: |
          cd functions
          npm ci
          cd ..
          firebase deploy --only functions --token ${{ secrets.FIREBASE_TOKEN }} --project ${{ env.FIREBASE_PROJECT_ID_STAGING }}

      - name: Run smoke tests
        run: npm run test:smoke -- --baseUrl=https://${{ env.FIREBASE_PROJECT_ID_STAGING }}.web.app

      - name: Update deployment status
        run: |
          curl -X POST -H "Authorization: Bearer ${{ secrets.GITHUB_TOKEN }}" \
            -H "Accept: application/vnd.github.v3+json" \
            https://api.github.com/repos/${{ github.repository }}/deployments \
            -d '{"ref":"${{ github.sha }}","environment":"staging","auto_merge":false}'

      - name: Notify deployment success
        uses: 8398a7/action-slack@v3
        with:
          status: success
          channel: '#kalos-deployments'
          webhook_url: ${{ secrets.SLACK_WEBHOOK }}
          fields: repo,message,commit,author
          custom_payload: |
            {
              attachments: [{
                color: 'good',
                title: '🚀 Staging Deployment Successful',
                fields: [{
                  title: 'Environment',
                  value: 'Staging',
                  short: true
                }, {
                  title: 'URL',
                  value: 'https://${{ env.FIREBASE_PROJECT_ID_STAGING }}.web.app',
                  short: true
                }, {
                  title: 'Commit',
                  value: '${{ github.sha }}',
                  short: true
                }]
              }]
            }
```

### CD Production Workflow
```yaml
# .github/workflows/cd-production.yml
name: Deploy to Production

on:
  release:
    types: [published]
  workflow_dispatch:
    inputs:
      version:
        description: 'Version to deploy'
        required: true
        type: string

env:
  NODE_VERSION: '18'
  FIREBASE_PROJECT_ID_PRODUCTION: ${{ secrets.FIREBASE_PROJECT_ID_PRODUCTION }}

jobs:
  # =====================
  # PRE-DEPLOYMENT CHECKS
  # =====================
  pre-deployment-checks:
    name: Pre-deployment Checks
    runs-on: ubuntu-latest
    outputs:
      should-deploy: ${{ steps.checks.outputs.should-deploy }}
    steps:
      - name: Checkout code
        uses: actions/checkout@v4

      - name: Verify staging deployment
        id: verify-staging
        run: |
          # Verificar que staging esté funcionando correctamente
          response=$(curl -s -o /dev/null -w "%{http_code}" https://${{ secrets.FIREBASE_PROJECT_ID_STAGING }}.web.app)
          if [ $response -eq 200 ]; then
            echo "Staging is healthy"
          else
            echo "Staging is not healthy, aborting production deployment"
            exit 1
          fi

      - name: Run production readiness checks
        id: checks
        run: |
          # Verificar que todos los tests pasaron
          # Verificar que no hay vulnerabilidades críticas
          # Verificar que la versión es válida
          echo "should-deploy=true" >> $GITHUB_OUTPUT

  # =====================
  # DEPLOY TO PRODUCTION
  # =====================
  deploy-production:
    name: Deploy to Production
    runs-on: ubuntu-latest
    needs: [pre-deployment-checks]
    if: needs.pre-deployment-checks.outputs.should-deploy == 'true'
    environment:
      name: production
      url: https://${{ env.FIREBASE_PROJECT_ID_PRODUCTION }}.web.app
    steps:
      - name: Checkout code
        uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: ${{ env.NODE_VERSION }}
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Build for production
        run: npm run build
        env:
          VITE_APP_ENV: production
          VITE_FIREBASE_API_KEY: ${{ secrets.VITE_FIREBASE_API_KEY_PRODUCTION }}
          VITE_FIREBASE_AUTH_DOMAIN: ${{ secrets.VITE_FIREBASE_AUTH_DOMAIN_PRODUCTION }}
          VITE_FIREBASE_PROJECT_ID: ${{ secrets.VITE_FIREBASE_PROJECT_ID_PRODUCTION }}
          VITE_FIREBASE_STORAGE_BUCKET: ${{ secrets.VITE_FIREBASE_STORAGE_BUCKET_PRODUCTION }}
          VITE_FIREBASE_MESSAGING_SENDER_ID: ${{ secrets.VITE_FIREBASE_MESSAGING_SENDER_ID_PRODUCTION }}
          VITE_FIREBASE_APP_ID: ${{ secrets.VITE_FIREBASE_APP_ID_PRODUCTION }}

      - name: Create backup
        run: |
          echo "Creating backup of current production"
          # Implementar backup si es necesario

      - name: Deploy to Firebase Hosting (Blue-Green)
        run: |
          npm install -g firebase-tools
          
          # Deploy to new version
          firebase hosting:clone ${{ env.FIREBASE_PROJECT_ID_PRODUCTION }}:live ${{ env.FIREBASE_PROJECT_ID_PRODUCTION }}:backup --token ${{ secrets.FIREBASE_TOKEN }}
          firebase deploy --only hosting --token ${{ secrets.FIREBASE_TOKEN }} --project ${{ env.FIREBASE_PROJECT_ID_PRODUCTION }}

      - name: Deploy infrastructure updates
        run: |
          # Deploy only if there are changes
          firebase deploy --only firestore:rules,storage:rules,functions --token ${{ secrets.FIREBASE_TOKEN }} --project ${{ env.FIREBASE_PROJECT_ID_PRODUCTION }}

      - name: Run post-deployment tests
        run: npm run test:smoke -- --baseUrl=https://${{ env.FIREBASE_PROJECT_ID_PRODUCTION }}.web.app

      - name: Verify deployment health
        run: |
          sleep 30  # Wait for deployment to propagate
          
          # Health check
          response=$(curl -s -o /dev/null -w "%{http_code}" https://${{ env.FIREBASE_PROJECT_ID_PRODUCTION }}.web.app/health)
          if [ $response -ne 200 ]; then
            echo "Health check failed, initiating rollback"
            exit 1
          fi
          
          # Performance check
          lighthouse_score=$(curl -s "https://www.googleapis.com/pagespeedonline/v5/runPagespeed?url=https://${{ env.FIREBASE_PROJECT_ID_PRODUCTION }}.web.app&key=${{ secrets.PAGESPEED_API_KEY }}" | jq '.lighthouseResult.categories.performance.score')
          if (( $(echo "$lighthouse_score < 0.8" | bc -l) )); then
            echo "Performance degradation detected"
            # Could trigger alert but not necessarily rollback
          fi

      - name: Update release status
        run: |
          curl -X PATCH -H "Authorization: Bearer ${{ secrets.GITHUB_TOKEN }}" \
            -H "Accept: application/vnd.github.v3+json" \
            https://api.github.com/repos/${{ github.repository }}/releases/${{ github.event.release.id }} \
            -d '{"body":"✅ Successfully deployed to production\n\n🔗 **Live URL:** https://${{ env.FIREBASE_PROJECT_ID_PRODUCTION }}.web.app\n📊 **Deployment Time:** $(date -Iseconds)\n🔍 **Commit:** ${{ github.sha }}"}'

      - name: Notify deployment success
        uses: 8398a7/action-slack@v3
        with:
          status: success
          channel: '#kalos-deployments'
          webhook_url: ${{ secrets.SLACK_WEBHOOK }}
          custom_payload: |
            {
              attachments: [{
                color: 'good',
                title: '🎉 Production Deployment Successful',
                fields: [{
                  title: 'Environment',
                  value: 'Production',
                  short: true
                }, {
                  title: 'Version',
                  value: '${{ github.event.release.tag_name }}',
                  short: true
                }, {
                  title: 'URL',
                  value: 'https://${{ env.FIREBASE_PROJECT_ID_PRODUCTION }}.web.app',
                  short: true
                }]
              }]
            }

  # =====================
  # ROLLBACK ON FAILURE
  # =====================
  rollback:
    name: Rollback on Failure
    runs-on: ubuntu-latest
    needs: [deploy-production]
    if: failure()
    steps:
      - name: Rollback to previous version
        run: |
          npm install -g firebase-tools
          firebase hosting:clone ${{ env.FIREBASE_PROJECT_ID_PRODUCTION }}:backup ${{ env.FIREBASE_PROJECT_ID_PRODUCTION }}:live --token ${{ secrets.FIREBASE_TOKEN }}

      - name: Notify rollback
        uses: 8398a7/action-slack@v3
        with:
          status: failure
          channel: '#kalos-deployments'
          webhook_url: ${{ secrets.SLACK_WEBHOOK }}
          custom_payload: |
            {
              attachments: [{
                color: 'danger',
                title: '⚠️ Production Deployment Failed - Rollback Initiated',
                fields: [{
                  title: 'Environment',
                  value: 'Production',
                  short: true
                }, {
                  title: 'Status',
                  value: 'Rolled back to previous version',
                  short: true
                }]
              }]
            }
```

### Deployment Scripts
```bash
#!/bin/bash
# .github/scripts/deploy.sh

set -e

ENVIRONMENT=$1
PROJECT_ID=$2
FIREBASE_TOKEN=$3

echo "🚀 Starting deployment to $ENVIRONMENT"

# Install Firebase CLI
npm install -g firebase-tools

# Set Firebase project
firebase use --token $FIREBASE_TOKEN $PROJECT_ID

# Deploy hosting
echo "📦 Deploying hosting..."
firebase deploy --only hosting --token $FIREBASE_TOKEN

# Deploy Firestore rules
echo "🔒 Deploying Firestore rules..."
firebase deploy --only firestore:rules --token $FIREBASE_TOKEN

# Deploy Storage rules
echo "🗄️ Deploying Storage rules..."
firebase deploy --only storage:rules --token $FIREBASE_TOKEN

# Deploy Cloud Functions
echo "⚡ Deploying Cloud Functions..."
cd functions
npm ci
cd ..
firebase deploy --only functions --token $FIREBASE_TOKEN

echo "✅ Deployment to $ENVIRONMENT completed successfully"
```

```bash
#!/bin/bash
# .github/scripts/test.sh

set -e

TEST_TYPE=$1

case $TEST_TYPE in
  "unit")
    echo "🧪 Running unit tests..."
    npm run test:unit -- --coverage --watchAll=false
    ;;
  "integration")
    echo "🔗 Running integration tests..."
    npm run test:integration
    ;;
  "e2e")
    echo "🎭 Running E2E tests..."
    npm run test:e2e
    ;;
  "smoke")
    echo "💨 Running smoke tests..."
    npm run test:smoke
    ;;
  *)
    echo "❌ Unknown test type: $TEST_TYPE"
    exit 1
    ;;
esac

echo "✅ $TEST_TYPE tests completed successfully"
```

### Package.json Scripts
```json
{
  "scripts": {
    "build": "vite build",
    "preview": "vite preview --port 4173",
    "test:unit": "vitest run src/**/*.test.js",
    "test:integration": "vitest run src/**/*.integration.test.js",
    "test:e2e": "playwright test",
    "test:smoke": "playwright test tests/smoke/",
    "lint": "eslint src/ --ext .js,.jsx,.ts,.tsx",
    "lint:fix": "eslint src/ --ext .js,.jsx,.ts,.tsx --fix",
    "format": "prettier --write src/",
    "format:check": "prettier --check src/",
    "lint:css": "stylelint src/**/*.css",
    "security:audit": "npm audit --audit-level=moderate",
    "security:scan": "snyk test",
    "deploy:staging": ".github/scripts/deploy.sh staging $FIREBASE_PROJECT_ID_STAGING $FIREBASE_TOKEN",
    "deploy:production": ".github/scripts/deploy.sh production $FIREBASE_PROJECT_ID_PRODUCTION $FIREBASE_TOKEN",
    "ci:all": "npm run lint && npm run test:unit && npm run test:integration && npm run build",
    "lighthouse": "lhci autorun"
  }
}
```

### SonarQube Configuration
```properties
# sonar-project.properties
sonar.projectKey=kalos-ecommerce
sonar.organization=kalos-team
sonar.projectName=Kalos E-commerce Platform
sonar.projectVersion=1.0

# Source code
sonar.sources=src/
sonar.tests=src/
sonar.test.inclusions=**/*.test.js,**/*.spec.js

# Coverage
sonar.javascript.lcov.reportPaths=coverage/lcov.info
sonar.coverage.exclusions=**/*.test.js,**/*.spec.js,**/node_modules/**

# Code analysis
sonar.qualitygate.wait=true
```

## 🧪 Testing

### Pipeline Testing
- [ ] Testing de workflows CI/CD
- [ ] Validación de deployment scripts
- [ ] Testing de rollback automático
- [ ] Testing de notificaciones
- [ ] Validación de security checks

### Integration Testing
- [ ] Testing de integración con Firebase
- [ ] Testing de variables de ambiente
- [ ] Testing de build process
- [ ] Testing de deployment verification

## 🚀 Deployment

### Pipeline Setup
- Configuración de secrets en GitHub
- Setup de Firebase projects (staging/production)
- Configuración de webhooks y notificaciones

### Monitoring Setup
- Configuración de alertas de pipeline
- Dashboard de métricas de deployment
- Logging de pipeline events

## 📦 Dependencies
- GitHub Actions
- Firebase CLI
- Node.js 18+
- Testing frameworks (Vitest, Playwright)
- Security tools (Snyk, SonarQube)

## 🔗 Relaciones
- **Automatiza**: Todo el proceso de desarrollo
- **Depende de**: Configuración de repositorio
- **Integra con**: Firebase, testing tools

---

**Estado**: 🟡 Pendiente  
**Prioridad**: Alta  
**Estimación**: 20 horas  
**Asignado**: Senior DevOps Engineer  

**Sprint**: Sprint 7 - Producción  
**Deadline**: 14 octubre 2025