import { defineConfigWithTheme } from 'vitepress'
import { withAppDocs } from 'vitepress-theme-app-docs/config'
import type { ThemeConfig } from 'vitepress-theme-app-docs/config'

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
        pattern: 'https://github.com/Hatasoft-Studio/Lets-Meow-Toolbox-docs/edit/main/:path',
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
