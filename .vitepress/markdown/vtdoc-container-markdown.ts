/**
 * 让 VTDoc 系列组件（VTDocWarning / VTDocNote / VTDocTip / VTDocCard /
 * VTDocCardGroup / VTDocStep / VTDocSteps / VTDocAccordion /
 * VTDocAccordionGroup）标签内的内容按 Markdown 解析。
 *
 * 默认情况下，Markdown 会把「整段组件标签」当成 HTML 块原样输出，
 * 所以标签里的 `**加粗**`、`` `代码` ``、`[链接](...)`、列表等都会变成
 * 纯文本字面量。这里在解析前把每个组件标签的正文做一次「去缩进 +
 * 前后补空行」的规范化，让 Markdown 能正常解析正文内容。
 */

interface TextNode {
  kind: 'text'
  lines: string[]
}

interface ElementNode {
  kind: 'element'
  open: string
  close: string
  body: NodeType[]
}

type NodeType = TextNode | ElementNode

const OPEN_RE = /^\s*<(VTDoc[\w-]+)(?:\s[^>]*)?>\s*$/
const CLOSE_RE = /^\s*<\/(VTDoc[\w-]+)>\s*$/

/** 标记代码块（``` / ~~~）覆盖的行，避免误处理代码里出现的组件标签。 */
function fenceMask(lines: string[]): boolean[] {
  const mask = new Array<boolean>(lines.length).fill(false)
  let fence: string | null = null
  for (let i = 0; i < lines.length; i++) {
    const match = /^\s*(`{3,}|~{3,})/.exec(lines[i])
    if (fence === null) {
      if (match) {
        fence = match[1]
        mask[i] = true
      }
      continue
    }
    mask[i] = true
    if (match && match[1][0] === fence[0] && match[1].length >= fence.length) fence = null
  }
  return mask
}

function parseNodes(lines: string[], mask: boolean[]): NodeType[] {
  const nodes: NodeType[] = []
  let buffer: string[] = []

  const flush = () => {
    if (buffer.length) {
      nodes.push({ kind: 'text', lines: buffer })
      buffer = []
    }
  }

  for (let i = 0; i < lines.length; i++) {
    if (mask[i]) {
      buffer.push(lines[i])
      continue
    }
    const open = OPEN_RE.exec(lines[i])
    if (!open) {
      buffer.push(lines[i])
      continue
    }
    const tag = open[1]

    let depth = 1
    let end = -1
    for (let j = i + 1; j < lines.length; j++) {
      if (mask[j]) continue
      const innerOpen = OPEN_RE.exec(lines[j])
      const innerClose = CLOSE_RE.exec(lines[j])
      if (innerOpen && innerOpen[1] === tag) {
        depth++
      } else if (innerClose && innerClose[1] === tag) {
        depth--
        if (depth === 0) {
          end = j
          break
        }
      }
    }

    // 标签没有正常闭合时保持原样，避免破坏内容
    if (end === -1) {
      buffer.push(lines[i])
      continue
    }

    flush()
    nodes.push({
      kind: 'element',
      open: lines[i].trim(),
      close: lines[end].trim(),
      body: parseNodes(lines.slice(i + 1, end), mask.slice(i + 1, end)),
    })
    i = end
  }

  flush()
  return nodes
}

/** 按正文最小缩进去掉统一缩进，并剪掉首尾空行。 */
function dedent(lines: string[]): string[] {
  const filled = lines.filter((line) => line.trim() !== '')
  if (!filled.length) return []

  const minIndent = filled.reduce((min, line) => {
    const indent = /^[\t ]*/.exec(line)![0].length
    return Math.min(min, indent)
  }, Number.POSITIVE_INFINITY)

  const result = lines.map((line) => (line.trim() === '' ? '' : line.slice(minIndent)))
  while (result.length && result[0].trim() === '') result.shift()
  while (result.length && result[result.length - 1].trim() === '') result.pop()
  return result
}

function renderNodes(nodes: NodeType[]): string[] {
  const out: string[] = []
  for (const node of nodes) {
    if (node.kind === 'text') {
      out.push(...dedent(node.lines))
      continue
    }
    out.push('', node.open, '', ...renderNodes(node.body), '', node.close, '')
  }
  return out
}

export function vtdocContainerMarkdownPlugin(md: any): void {
  md.core.ruler.before('normalize', 'vtdoc-container-markdown', (state: any) => {
    const src: string = state.src
    if (!src.includes('<VTDoc')) return

    const lines = src.split(/\r?\n/)
    const mask = fenceMask(lines)
    state.src = renderNodes(parseNodes(lines, mask)).join('\n')
  })
}
