#!/usr/bin/env node
// VitePress 的 lastUpdated 功能需要在构建时调用 git。
// 部分环境（如未把 git 加入 PATH 的终端）会报 `spawn git ENOENT`。
// 本脚本在启动 vitepress 前自动探测 git 可执行文件并临时注入 PATH。
import { spawnSync, execFileSync } from 'node:child_process'
import { existsSync, readdirSync } from 'node:fs'
import { join } from 'node:path'

function gitOnPath() {
  try {
    execFileSync('git', ['--version'], { stdio: 'ignore' })
    return true
  } catch {
    return false
  }
}

function findGitDir() {
  const local = process.env.LOCALAPPDATA || ''
  const candidates = []
  // GitHub Desktop 内置 git（匹配任意 app-<版本> 目录）
  const gdRoot = join(local, 'GitHubDesktop')
  if (existsSync(gdRoot)) {
    for (const entry of readdirSync(gdRoot)) {
      if (/^app-\d/.test(entry)) {
        candidates.push(join(gdRoot, entry, 'resources', 'app', 'git', 'cmd'))
      }
    }
  }
  candidates.push(
    'C:\\Program Files\\Git\\cmd',
    'C:\\Program Files (x86)\\Git\\cmd',
    join(local, 'Programs', 'Git', 'cmd'),
    '/usr/bin',
    '/usr/local/bin',
    '/opt/homebrew/bin',
  )
  const exe = process.platform === 'win32' ? 'git.exe' : 'git'
  return candidates.find((dir) => existsSync(join(dir, exe)))
}

const env = { ...process.env }
if (!gitOnPath()) {
  const dir = findGitDir()
  if (dir) {
    env.PATH = process.platform === 'win32' ? `${dir};${env.PATH || ''}` : `${dir}:${env.PATH || ''}`
  }
}

const bin = join(process.cwd(), 'node_modules', 'vitepress', 'bin', 'vitepress.js')
const result = spawnSync(process.execPath, [bin, ...process.argv.slice(2)], {
  stdio: 'inherit',
  env,
  cwd: process.cwd(),
})
process.exit(result.status ?? 1)
