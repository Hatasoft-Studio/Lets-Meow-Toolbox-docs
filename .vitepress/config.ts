import { defineConfigWithTheme } from 'vitepress'
import { withAppDocs } from 'vitepress-theme-app-docs/config'
import type { ThemeConfig } from 'vitepress-theme-app-docs/config'
import { vtdocContainerMarkdownPlugin } from './markdown/vtdoc-container-markdown'

const EDIT_PATTERN =
  'https://github.com/Hatasoft-Studio/Lets-Meow-Toolbox-docs/edit/main/:path'

interface LocaleStrings {
  description: string
  nav: {
    home: string
    download: string
    docs: string
    dev: string
    changelog: string
    credits: string
  }
  docsGroup: string
  docsItems: [string, string, string, string, string, string, string, string]
  devGroup: string
  devItems: [string, string, string, string, string]
  editText: string
  lastUpdatedText: string
  outlineLabel: string
  prev: string
  next: string
  footerMessage: string
}

const DOC_PATHS = [
  '/docs/getting-started.html',
  '/docs/features.html',
  '/docs/beginner-and-advanced.html',
  '/docs/uninstaller.html',
  '/docs/unlock.html',
  '/docs/high-risk-zone.html',
  '/docs/settings.html',
  '/docs/faq.html',
] as const

const DEV_PATHS = [
  '/dev/introduction.html',
  '/dev/build-and-publish.html',
  '/dev/project-structure.html',
  '/dev/modules-and-services.html',
  '/dev/high-risk-plugin-development.html',
] as const

function buildThemeConfig(prefix: string, s: LocaleStrings): ThemeConfig {
  const link = (path: string) => `${prefix}${path}`
  return {
    nav: [
      { text: s.nav.home, link: link('/') },
      { text: s.nav.download, link: link('/download.html') },
      { text: s.nav.docs, link: link(DOC_PATHS[0]) },
      { text: s.nav.dev, link: link(DEV_PATHS[0]) },
      { text: s.nav.changelog, link: link('/version.html') },
      { text: s.nav.credits, link: link('/Contributor.html') },
    ],
    sidebar: {
      [`${prefix}/docs/`]: [
        {
          text: s.docsGroup,
          items: s.docsItems.map((text, i) => ({ text, link: link(DOC_PATHS[i]) })),
        },
      ],
      [`${prefix}/dev/`]: [
        {
          text: s.devGroup,
          items: s.devItems.map((text, i) => ({ text, link: link(DEV_PATHS[i]) })),
        },
      ],
    },
    editLink: { pattern: EDIT_PATTERN, text: s.editText },
    lastUpdated: { text: s.lastUpdatedText },
    outline: { level: [2, 3], label: s.outlineLabel },
    docFooter: { prev: s.prev, next: s.next },
    footer: {
      message: s.footerMessage,
      copyright: "Copyright © 2026 Hatasoft-Studio · Let's Meow! Toolbox",
    },
  }
}

const ZH_HANT: LocaleStrings = {
  description: '一個二次元現代化 UI、新手友好的 Windows 10 / 11 一體化調優工具箱。',
  nav: {
    home: '首頁',
    download: '下載',
    docs: '使用文件',
    dev: '開發文件',
    changelog: '更新日誌',
    credits: '特別鳴謝',
  },
  docsGroup: '使用文件',
  docsItems: [
    '快速上手',
    '功能分區',
    '新手區與高級區',
    '卸載程序',
    '解除佔用',
    '高危插件區',
    '設定與關於',
    '常見問題',
  ],
  devGroup: '開發文件',
  devItems: ['開發須知', '建構與發布', '專案結構詳解', '模組與服務速覽', '高危插件開發'],
  editText: '在 GitHub 上編輯此頁',
  lastUpdatedText: '最後編輯日期',
  outlineLabel: '本頁目錄',
  prev: '上一篇',
  next: '下一篇',
  footerMessage: '基於 GPL-3.0 授權條款發布',
}

const JA: LocaleStrings = {
  description:
    '二次元モダン UI・初心者フレンドリーな Windows 10 / 11 向けオールインワン最適化ツールボックス。',
  nav: {
    home: 'ホーム',
    download: 'ダウンロード',
    docs: '利用ドキュメント',
    dev: '開発ドキュメント',
    changelog: '更新履歴',
    credits: '謝辞',
  },
  docsGroup: '利用ドキュメント',
  docsItems: [
    'クイックスタート',
    '機能ゾーン',
    'ビギナーゾーンと上級ゾーン',
    'アンインストーラー',
    '占有の解除',
    '高リスクプラグインゾーン',
    '設定とバージョン情報',
    'よくある質問',
  ],
  devGroup: '開発ドキュメント',
  devItems: [
    '開発の注意事項',
    'ビルドとリリース',
    'プロジェクト構造詳解',
    'モジュールとサービス概覧',
    '高リスクプラグイン開発',
  ],
  editText: 'このページを GitHub で編集',
  lastUpdatedText: '最終編集日',
  outlineLabel: 'ページ目次',
  prev: '前へ',
  next: '次へ',
  footerMessage: 'GPL-3.0 ライセンスのもとで公開',
}

const EN: LocaleStrings = {
  description:
    'An anime-styled, modern, beginner-friendly all-in-one tuning toolbox for Windows 10 / 11.',
  nav: {
    home: 'Home',
    download: 'Download',
    docs: 'User Guide',
    dev: 'Dev Docs',
    changelog: 'Changelog',
    credits: 'Credits',
  },
  docsGroup: 'User Guide',
  docsItems: [
    'Getting Started',
    'Feature Zones',
    'Beginner & Advanced Zones',
    'Uninstaller',
    'Unlock Files',
    'High-Risk Plugin Zone',
    'Settings & About',
    'FAQ',
  ],
  devGroup: 'Dev Docs',
  devItems: [
    'Before You Start',
    'Build & Publish',
    'Project Structure',
    'Modules & Services',
    'High-Risk Plugin Development',
  ],
  editText: 'Edit this page on GitHub',
  lastUpdatedText: 'Last updated',
  outlineLabel: 'On this page',
  prev: 'Previous',
  next: 'Next',
  footerMessage: 'Released under the GPL-3.0 license',
}

export default withAppDocs(
  defineConfigWithTheme<ThemeConfig>({
    lang: 'zh-CN',
    title: "Let's Meow! Toolbox",
    description: '一个二次元现代化 UI、新手友好的 Windows 10 / 11 一体化调优工具箱。',
    srcExclude: ['README.md'],
    head: [
      ['link', { rel: 'icon', type: 'image/png', href: '/app_icon.png' }],
      ['meta', { name: 'theme-color', content: '#ef5757' }],
      ['link', { rel: 'preconnect', href: 'https://api.github.com' }],
    ],
    markdown: {
      config(md) {
        md.use(vtdocContainerMarkdownPlugin)
      },
    },
    locales: {
      root: { label: '简体中文', lang: 'zh-CN' },
      'zh-hant': {
        label: '繁體中文',
        lang: 'zh-TW',
        description: ZH_HANT.description,
        themeConfig: buildThemeConfig('/zh-hant', ZH_HANT),
      },
      ja: {
        label: '日本語',
        lang: 'ja',
        description: JA.description,
        themeConfig: buildThemeConfig('/ja', JA),
      },
      en: {
        label: 'English',
        lang: 'en-US',
        description: EN.description,
        themeConfig: buildThemeConfig('/en', EN),
      },
    },
    themeConfig: {
      logo: '/app_icon.png',
      siteTitle: "Let's Meow! Toolbox",
      nav: [
        { text: '首页', link: '/' },
        { text: '下载', link: '/download.html' },
        { text: '使用文档', link: '/docs/getting-started.html' },
        { text: '开发文档', link: '/dev/introduction.html' },
        { text: '更新日志', link: '/version.html' },
        { text: '特别鸣谢', link: '/Contributor.html' },
      ],
      sidebar: {
        '/docs/': [
          {
            text: '使用文档',
            items: [
              { text: '快速上手', link: '/docs/getting-started.html' },
              { text: '功能分区', link: '/docs/features.html' },
              { text: '新手区与高级区', link: '/docs/beginner-and-advanced.html' },
              { text: '卸载程序', link: '/docs/uninstaller.html' },
              { text: '解除占用', link: '/docs/unlock.html' },
              { text: '高危插件区', link: '/docs/high-risk-zone.html' },
              { text: '设置与关于', link: '/docs/settings.html' },
              { text: '常见问题', link: '/docs/faq.html' },
            ],
          },
        ],
        '/dev/': [
          {
            text: '开发文档',
            items: [
              { text: '开发须知', link: '/dev/introduction.html' },
              { text: '构建与发布', link: '/dev/build-and-publish.html' },
              { text: '项目结构详解', link: '/dev/project-structure.html' },
              { text: '模块与服务速览', link: '/dev/modules-and-services.html' },
              { text: '高危插件开发', link: '/dev/high-risk-plugin-development.html' },
            ],
          },
        ],
      },
      editLink: {
        pattern: EDIT_PATTERN,
        text: '在 GitHub 上编辑此页',
      },
      lastUpdated: { text: '最后编辑日期' },
      socialLinks: [
        {
          icon: 'github',
          link: 'https://github.com/Hatasoft-Studio/Lets-Meow-Toolbox',
        },
      ],
      search: { provider: 'local' },
      outline: { level: [2, 3], label: '文章目录' },
      docFooter: { prev: '上一篇', next: '下一篇' },
      footer: {
        message: '基于 GPL-3.0 许可证发布',
        copyright: "Copyright © 2026 Hatasoft-Studio · Let's Meow! Toolbox",
      },
      designTokens: {
        brand: '#ef5757',
        radiusCard: '12px',
        dark: { brand: '#ff8b8b' },
      },
    },
  }),
)
