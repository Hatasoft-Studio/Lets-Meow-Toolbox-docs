import type { Theme } from 'vitepress'
import AppDocsTheme from 'vitepress-theme-app-docs'

import ReleaseDownloader from './components/ReleaseDownloader.vue'
import './custom.css'

export default {
  extends: AppDocsTheme,
  enhanceApp({ app }) {
    app.component('ReleaseDownloader', ReleaseDownloader)
  },
} satisfies Theme
