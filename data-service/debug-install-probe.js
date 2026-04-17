const fs = require('fs');
const path = require('path');

const endpoint = 'http://127.0.0.1:7574/ingest/e3a3f6d0-e877-40c3-a6bf-48f88c165934';
const baseDir = '/app';
const dataPkgPath = path.join(baseDir, 'data-service', 'package.json');
const rootPkgPath = path.join(baseDir, 'package.json');
const sharedPkgPath = path.join(baseDir, 'shared', 'package.json');
const userPkgPath = path.join(baseDir, 'user-service', 'package.json');

function readJsonSafe(filePath) {
  try {
    return JSON.parse(fs.readFileSync(filePath, 'utf8'));
  } catch (error) {
    return { __readError: String(error) };
  }
}

function logProbe(hypothesisId, message, data) {
  // #region agent log
  fetch(endpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Debug-Session-Id': '6415b8',
    },
    body: JSON.stringify({
      sessionId: '6415b8',
      runId: 'pre-fix',
      hypothesisId,
      location: 'data-service/debug-install-probe.js',
      message,
      data,
      timestamp: Date.now(),
    }),
  }).catch(() => {});
  // #endregion
}

const dataPkg = readJsonSafe(dataPkgPath);
const rootPkg = readJsonSafe(rootPkgPath);

logProbe('H1', 'Runtime stage workspace manifests presence', {
  dataServicePackageExists: fs.existsSync(dataPkgPath),
  sharedPackageExists: fs.existsSync(sharedPkgPath),
  userServicePackageExists: fs.existsSync(userPkgPath),
});

logProbe('H2', 'data-service dependencies state', {
  hasSharedDependency: Boolean(dataPkg.dependencies && dataPkg.dependencies['@monorepo/shared']),
  sharedDependencyValue: dataPkg.dependencies ? dataPkg.dependencies['@monorepo/shared'] : null,
  hasUserServiceDependency: Boolean(dataPkg.dependencies && dataPkg.dependencies['user-service']),
  userServiceDependencyValue: dataPkg.dependencies ? dataPkg.dependencies['user-service'] : null,
});

logProbe('H3', 'Root workspaces known to runtime stage', {
  workspaces: Array.isArray(rootPkg.workspaces) ? rootPkg.workspaces : [],
});
