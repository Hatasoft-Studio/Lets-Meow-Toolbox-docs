<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue'

const REPO = 'Hatasoft-Studio/Lets-Meow-Toolbox'
const RELEASES_PAGE = `https://github.com/${REPO}/releases`
const API_URL = `https://api.github.com/repos/${REPO}/releases?per_page=100`
const CACHE_KEY = 'lm-toolbox:releases:v1'
const CACHE_TTL = 10 * 60 * 1000

type ChannelId = 'release' | 'prerelease'
type MirrorId = 'github' | 'proxy'
type PlatformId = 'windows' | 'macos' | 'linux' | 'other'

interface GhAsset {
  name: string
  size: number
  browser_download_url: string
}

interface GhRelease {
  tag_name: string
  name: string | null
  published_at: string
  html_url: string
  prerelease: boolean
  draft: boolean
  assets: GhAsset[]
}

interface AssetInfo extends GhAsset {
  platform: PlatformId
  kind: string
  arch: string
}

const PLATFORM_LABELS: Record<PlatformId, string> = {
  windows: 'Windows',
  macos: 'macOS',
  linux: 'Linux',
  other: '其他',
}
const PLATFORM_ORDER: PlatformId[] = ['windows', 'macos', 'linux', 'other']

const KIND_ORDER: Record<string, number> = {
  安装版: 0,
  安装包: 1,
  免安装完整版: 2,
  便携版: 3,
  免安装精简版: 4,
  压缩包: 5,
  其他: 6,
}

// EZ-Mirror（https://mirror.hatasoft365.top）的下载入口：
// https://mirror.hatasoft365.top/api/p/{镜像目录}/{版本号}/{文件名}
const MIRRORS: { id: MirrorId; label: string }[] = [
  { id: 'github', label: 'GitHub' },
  { id: 'proxy', label: 'EZ-Mirror 镜像' },
]
const MIRROR_BASE = 'https://mirror.hatasoft365.top/api/p/'
const MIRROR_DIR = "Let's Meow Toolbox"

const releases = ref<GhRelease[]>([])
const loading = ref(true)
const error = ref('')
const channel = ref<ChannelId>('release')
const selectedTag = ref('')
const mirror = ref<MirrorId>('github')
const device = ref<{ platform: PlatformId; arch: string }>({ platform: 'windows', arch: 'x64' })

function detectPlatform(name: string): PlatformId {
  const n = name.toLowerCase()
  if (/\.(exe|msi)$/.test(n) || /-win|windows|win64|win32/.test(n)) return 'windows'
  if (/\.(dmg|pkg)$/.test(n) || /macos|darwin|osx|-mac/.test(n)) return 'macos'
  if (/\.(appimage|deb|rpm)$/.test(n) || /linux/.test(n)) return 'linux'
  return 'other'
}

function detectArch(name: string): string {
  const n = name.toLowerCase()
  if (/arm64|aarch64/.test(n)) return 'ARM64'
  if (/universal/.test(n)) return 'Universal'
  if (/x64|x86_64|amd64/.test(n)) return 'x64'
  if (/ia32|i[3-6]86/.test(n) || /\bx86\b/.test(n)) return 'x86'
  return 'x64'
}

function detectKind(name: string): string {
  const n = name.toLowerCase()
  if (/\.(exe|msi)$/.test(n)) return '安装版'
  if (/\.(dmg|pkg)$/.test(n)) return '安装包'
  if (n.endsWith('.appimage')) return '便携版'
  if (/\.(deb|rpm)$/.test(n)) return '安装包'
  if (/\.(zip|7z)$/.test(n)) {
    if (/framework-dependent|lite|slim/.test(n)) return '免安装精简版'
    if (/self-contained|standalone|full/.test(n)) return '免安装完整版'
    if (/portable/.test(n)) return '便携版'
    return '压缩包'
  }
  if (/(\.tar\.gz|\.tgz)$/.test(n)) return '压缩包'
  return '其他'
}

function formatDate(value: string): string {
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return ''
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${date.getFullYear()}-${month}-${day}`
}

const channels = computed<Record<ChannelId, GhRelease[]>>(() => {
  const list = releases.value.filter((r) => !r.draft)
  return {
    release: list.filter((r) => !r.prerelease),
    prerelease: list.filter((r) => r.prerelease),
  }
})

function syncVersion() {
  const list = channels.value[channel.value]
  if (!list.some((r) => r.tag_name === selectedTag.value)) {
    selectedTag.value = list[0]?.tag_name ?? ''
  }
}

watch(channels, syncVersion, { immediate: true })

watch(channel, () => {
  syncVersion()
  if (channel.value === 'prerelease') mirror.value = 'github'
})

const currentRelease = computed<GhRelease | null>(
  () => channels.value[channel.value].find((r) => r.tag_name === selectedTag.value) ?? null,
)

const channelOptions = computed(() => [
  { id: 'release' as ChannelId, label: 'Release', disabled: !channels.value.release.length },
  { id: 'prerelease' as ChannelId, label: 'Pre Release', disabled: !channels.value.prerelease.length },
])

const versionOptions = computed(() =>
  channels.value[channel.value].map((r, index) => ({
    id: r.tag_name,
    label: `${r.tag_name}${index === 0 ? '（最新）' : ''} · ${formatDate(r.published_at)}`,
  })),
)

const channelNote = computed(() =>
  channel.value === 'prerelease'
    ? '预发布版本，仅支持 GitHub 下载（镜像站未同步）。'
    : '正式发布版本，可通过 GitHub 或 EZ-Mirror 镜像下载。',
)

const displayTag = computed(() => {
  const tag = currentRelease.value?.tag_name ?? ''
  if (!tag) return ''
  return tag.startsWith('v') ? tag : `v${tag}`
})

const parsed = computed<AssetInfo[]>(() =>
  (currentRelease.value?.assets ?? []).map((asset) => ({
    ...asset,
    platform: detectPlatform(asset.name),
    kind: detectKind(asset.name),
    arch: detectArch(asset.name),
  })),
)

const groups = computed(() =>
  PLATFORM_ORDER.map((platform) => ({
    id: platform,
    label: PLATFORM_LABELS[platform],
    assets: parsed.value
      .filter((asset) => asset.platform === platform)
      .sort(
        (a, b) =>
          (KIND_ORDER[a.kind] ?? 9) - (KIND_ORDER[b.kind] ?? 9) ||
          a.name.localeCompare(b.name),
      ),
  })).filter((group) => group.assets.length > 0),
)

const recommendation = computed(() => {
  if (!parsed.value.length) return null
  const samePlatform = parsed.value.filter((asset) => asset.platform === device.value.platform)
  const pool = samePlatform.length ? samePlatform : parsed.value
  const sorted = [...pool].sort(
    (a, b) =>
      (a.arch === device.value.arch ? 0 : 1) - (b.arch === device.value.arch ? 0 : 1) ||
      (KIND_ORDER[a.kind] ?? 9) - (KIND_ORDER[b.kind] ?? 9),
  )
  // 按发布类型去重：安装版只在当前版本确实提供时才出现
  const choices: AssetInfo[] = []
  for (const asset of sorted) {
    if (choices.some((item) => item.kind === asset.kind)) continue
    choices.push(asset)
    if (choices.length === 3) break
  }
  return { choices, matched: samePlatform.length > 0 }
})

const deviceLabel = computed(
  () => `${PLATFORM_LABELS[device.value.platform]} · ${device.value.arch}`,
)

function formatSize(bytes: number): string {
  const mb = bytes / 1048576
  return mb >= 1024 ? `${(mb / 1024).toFixed(1)} GB` : `${mb.toFixed(1)} MB`
}

function assetUrl(asset: GhAsset): string {
  if (channel.value === 'prerelease' || mirror.value !== 'proxy') {
    return asset.browser_download_url
  }
  const tag = currentRelease.value?.tag_name ?? ''
  return (
    MIRROR_BASE +
    [MIRROR_DIR, tag, asset.name].map((part) => encodeURIComponent(part)).join('/')
  )
}

function assetLabel(asset: AssetInfo): string {
  return `${PLATFORM_LABELS[asset.platform]} ${asset.kind}`
}

function readCache(): GhRelease[] | null {
  try {
    const raw = sessionStorage.getItem(CACHE_KEY)
    if (!raw) return null
    const cached = JSON.parse(raw) as { time: number; data: GhRelease[] }
    if (Date.now() - cached.time > CACHE_TTL) return null
    return cached.data
  } catch {
    return null
  }
}

function writeCache(data: GhRelease[]) {
  try {
    sessionStorage.setItem(CACHE_KEY, JSON.stringify({ time: Date.now(), data }))
  } catch {
    /* 存储不可用时忽略 */
  }
}

async function load(force = false) {
  loading.value = true
  error.value = ''
  try {
    if (!force) {
      const cached = readCache()
      if (cached) {
        releases.value = cached
        return
      }
    }
    const data: GhRelease[] = []
    for (let page = 1; page <= 10; page += 1) {
      const response = await fetch(`${API_URL}&page=${page}`, {
        headers: { Accept: 'application/vnd.github+json' },
      })
      if (!response.ok) {
        throw new Error(
          response.status === 403
            ? 'GitHub API 请求过于频繁（403），请稍后重试'
            : `HTTP ${response.status}`,
        )
      }
      const batch = (await response.json()) as GhRelease[]
      data.push(...batch)
      if (batch.length < 100) break
    }
    releases.value = data
    writeCache(data)
  } catch (err) {
    error.value = err instanceof Error ? err.message : String(err)
  } finally {
    loading.value = false
  }
}

function detectDevice() {
  const ua = navigator.userAgent.toLowerCase()
  const platform: PlatformId = /windows|win32|win64/.test(ua)
    ? 'windows'
    : /macintosh|mac os x|iphone|ipad/.test(ua)
      ? 'macos'
      : /linux|x11/.test(ua)
        ? 'linux'
        : 'windows'
  const arch = /arm64|aarch64/.test(ua) ? 'ARM64' : 'x64'
  device.value = { platform, arch }
}

onMounted(() => {
  detectDevice()
  void load()
})
</script>

<template>
  <div class="lm-dl">
    <div v-if="loading" class="lm-dl-status">
      <span class="lm-dl-dots"><i /><i /><i /></span>
      正在获取最新版本…
    </div>

    <div v-else-if="error" class="lm-dl-status lm-dl-error">
      <p>无法从 GitHub 获取版本信息：{{ error }}</p>
      <p>
        <button class="lm-dl-retry" type="button" @click="load(true)">重试</button>
        <a :href="RELEASES_PAGE" target="_blank" rel="noopener">前往 GitHub Releases</a>
      </p>
    </div>

    <template v-else-if="currentRelease">
      <div class="lm-dl-head">
        <div>
          <div class="lm-dl-tag">{{ displayTag }}</div>
          <div class="lm-dl-note">{{ channelNote }}</div>
        </div>

        <div class="lm-dl-controls">
          <div class="lm-dl-field">
            <label class="lm-dl-label" for="lm-channel">更新通道</label>
            <span class="lm-dl-select">
              <select id="lm-channel" v-model="channel">
                <option
                  v-for="item in channelOptions"
                  :key="item.id"
                  :value="item.id"
                  :disabled="item.disabled"
                >
                  {{ item.label }}
                </option>
              </select>
              <svg viewBox="0 0 16 16" width="14" height="14" aria-hidden="true">
                <path d="M4 6l4 4 4-4" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" />
              </svg>
            </span>
          </div>

          <div class="lm-dl-field">
            <label class="lm-dl-label" for="lm-version">版本</label>
            <span class="lm-dl-select">
              <select id="lm-version" v-model="selectedTag">
                <option v-for="item in versionOptions" :key="item.id" :value="item.id">
                  {{ item.label }}
                </option>
              </select>
              <svg viewBox="0 0 16 16" width="14" height="14" aria-hidden="true">
                <path d="M4 6l4 4 4-4" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" />
              </svg>
            </span>
          </div>

          <div v-if="channel === 'release'" class="lm-dl-field">
            <label class="lm-dl-label" for="lm-mirror">下载线路</label>
            <span class="lm-dl-select">
              <select id="lm-mirror" v-model="mirror">
                <option v-for="item in MIRRORS" :key="item.id" :value="item.id">
                  {{ item.label }}
                </option>
              </select>
              <svg viewBox="0 0 16 16" width="14" height="14" aria-hidden="true">
                <path d="M4 6l4 4 4-4" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" />
              </svg>
            </span>
          </div>
        </div>
      </div>

      <div v-if="recommendation" class="lm-dl-recommend">
        <span class="lm-dl-dot" />
        <span>{{ recommendation.matched ? '为你的设备推荐' : '推荐下载' }}</span>
        <strong>{{
          recommendation.matched ? deviceLabel : assetLabel(recommendation.choices[0])
        }}</strong>
      </div>

      <div v-if="recommendation" class="lm-dl-actions">
        <a
          v-for="(asset, index) in recommendation.choices"
          :key="asset.name"
          :class="index === 0 ? 'lm-dl-primary' : 'lm-dl-secondary'"
          :href="assetUrl(asset)"
        >
          <template v-if="index === 0">
            下载 {{ assetLabel(asset) }} {{ formatSize(asset.size) }}
          </template>
          <template v-else>
            {{ assetLabel(asset) }} {{ formatSize(asset.size) }}
          </template>
        </a>
      </div>

      <p v-if="channel === 'prerelease'" class="lm-dl-mirror-note">
        Pre Release 版本仅支持 GitHub 下载，EZ-Mirror 镜像暂未同步预发布版本。
      </p>
      <p v-else-if="mirror === 'proxy' && recommendation" class="lm-dl-mirror-note">
        当前线路由 EZ-Mirror（mirror.hatasoft365.top）提供；若该版本尚未同步到镜像，请切换回 GitHub 直连。
      </p>

      <div class="lm-dl-groups">
        <section v-for="group in groups" :key="group.id">
          <h3 class="lm-dl-group-title">{{ group.label }}</h3>
          <a
            v-for="asset in group.assets"
            :key="asset.name"
            class="lm-dl-row"
            :href="assetUrl(asset)"
          >
            <span class="lm-dl-file">{{ asset.name }}</span>
            <span class="lm-dl-meta">
              {{ PLATFORM_LABELS[asset.platform] }} {{ asset.kind }} · {{ asset.arch }} ·
              {{ formatSize(asset.size) }}
            </span>
          </a>
        </section>
      </div>

      <p v-if="!parsed.length" class="lm-dl-empty">
        该版本暂未上传安装包，可前往
        <a :href="currentRelease.html_url" target="_blank" rel="noopener">GitHub Releases</a>
        查看。
      </p>
    </template>

    <div v-else class="lm-dl-status">当前通道暂无可下载的版本。</div>
  </div>
</template>

<style scoped>
.lm-dl {
  margin: 28px 0 8px;
}

.lm-dl-status {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  min-height: 120px;
  color: var(--vp-c-text-2);
  font-size: 15px;
}

.lm-dl-error {
  flex-direction: column;
  text-align: center;
}

.lm-dl-error p {
  margin: 4px 0;
}

.lm-dl-retry {
  margin-right: 14px;
  padding: 6px 14px;
  border: 1px solid var(--vp-c-divider);
  border-radius: 8px;
  background: var(--vp-c-bg);
  color: var(--vp-c-text-1);
  cursor: pointer;
}

.lm-dl-dots i {
  display: inline-block;
  width: 6px;
  height: 6px;
  margin-right: 4px;
  border-radius: 50%;
  background: var(--vp-c-brand-1);
  animation: lm-dl-pulse 1.2s infinite ease-in-out;
}

.lm-dl-dots i:nth-child(2) {
  animation-delay: 0.2s;
}

.lm-dl-dots i:nth-child(3) {
  animation-delay: 0.4s;
}

@keyframes lm-dl-pulse {
  0%,
  100% {
    opacity: 0.25;
    transform: translateY(0);
  }
  50% {
    opacity: 1;
    transform: translateY(-2px);
  }
}

.lm-dl-head {
  display: flex;
  flex-wrap: wrap;
  gap: 20px 32px;
  align-items: flex-start;
  justify-content: space-between;
}

.lm-dl-tag {
  font-size: 26px;
  font-weight: 700;
  line-height: 1.2;
  letter-spacing: -0.02em;
  color: var(--vp-c-brand-1);
}

.lm-dl-note {
  margin-top: 4px;
  font-size: 15px;
  color: var(--vp-c-text-2);
}

.lm-dl-controls {
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
  align-items: center;
}

.lm-dl-field {
  display: flex;
  align-items: center;
  gap: 8px;
}

.lm-dl-label {
  font-size: 14px;
  color: var(--vp-c-text-2);
  white-space: nowrap;
}

.lm-dl-select {
  position: relative;
  display: inline-flex;
  align-items: center;
}

.lm-dl-select select {
  appearance: none;
  min-width: 124px;
  padding: 8px 34px 8px 12px;
  border: 1px solid var(--vp-c-divider);
  border-radius: 8px;
  background: var(--vp-c-bg);
  color: var(--vp-c-text-1);
  font-size: 14px;
  line-height: 1.4;
  cursor: pointer;
  transition: border-color 0.2s;
}

.lm-dl-select select:hover,
.lm-dl-select select:focus {
  border-color: var(--vp-c-brand-1);
  outline: none;
}

.lm-dl-select svg {
  position: absolute;
  right: 10px;
  color: var(--vp-c-text-2);
  pointer-events: none;
}

.lm-dl-recommend {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 8px;
  margin-top: 34px;
  font-size: 15px;
  color: var(--vp-c-text-2);
}

.lm-dl-dot {
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: var(--vp-c-brand-1);
}

.lm-dl-recommend strong {
  color: var(--vp-c-text-1);
  font-weight: 600;
}

.lm-dl-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 14px;
  margin-top: 14px;
}

.lm-dl-primary {
  display: inline-flex;
  align-items: center;
  padding: 15px 26px;
  border-radius: 10px;
  background: #f2686a;
  color: #fff;
  font-size: 16px;
  font-weight: 600;
  text-decoration: none;
  transition: background-color 0.2s, transform 0.2s;
}

.lm-dl-primary:hover {
  background: #e05759;
  color: #fff;
}

.lm-dl-secondary {
  display: inline-flex;
  align-items: center;
  padding: 15px 26px;
  border: 1px solid var(--vp-c-divider);
  border-radius: 10px;
  background: var(--vp-c-bg);
  color: var(--vp-c-text-1);
  font-size: 16px;
  text-decoration: none;
  transition: border-color 0.2s, color 0.2s;
}

.lm-dl-secondary:hover {
  border-color: var(--vp-c-brand-1);
  color: var(--vp-c-brand-1);
}

.lm-dl-groups {
  margin-top: 32px;
}

.lm-dl-group-title {
  margin: 24px 0 12px;
  font-size: 17px;
  font-weight: 700;
  color: var(--vp-c-text-1);
}

.lm-dl-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 20px;
  margin-bottom: 10px;
  padding: 15px 18px;
  border: 1px solid var(--vp-c-divider);
  border-radius: 10px;
  background: var(--vp-c-bg);
  text-decoration: none;
  transition: border-color 0.2s, background-color 0.2s;
}

.lm-dl-row:hover {
  border-color: var(--vp-c-brand-1);
  background: var(--vp-c-bg-soft);
}

.lm-dl-file {
  font-size: 15px;
  color: var(--vp-c-text-1);
  word-break: break-all;
}

.lm-dl-meta {
  flex-shrink: 0;
  font-size: 14px;
  color: var(--vp-c-text-2);
}

.lm-dl-empty {
  margin-top: 18px;
  font-size: 14px;
  color: var(--vp-c-text-2);
}

.lm-dl-mirror-note {
  margin-top: 12px;
  font-size: 13px;
  color: var(--vp-c-text-3);
}

@media (max-width: 640px) {
  .lm-dl-row {
    flex-direction: column;
    align-items: flex-start;
    gap: 4px;
  }

  .lm-dl-actions {
    flex-direction: column;
    align-items: stretch;
  }

  .lm-dl-primary,
  .lm-dl-secondary {
    justify-content: center;
  }
}
</style>
