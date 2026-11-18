const prettier = require('prettier')
const fs = require('fs')
const path = require('path')

function findHtmlFiles(dir) {
  const results = []
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name)
    if (entry.isDirectory() && !entry.name.startsWith('_next') && !entry.name.startsWith('.')) {
      results.push(...findHtmlFiles(full))
    } else if (entry.isFile() && entry.name.endsWith('.html')) {
      results.push(full)
    }
  }
  return results
}

async function main() {
  const root = path.join(__dirname)
  const files = findHtmlFiles(root)
  console.log(`Formatting ${files.length} HTML files...`)
  for (const file of files) {
    const content = fs.readFileSync(file, 'utf8')
    const formatted = await prettier.format(content, { parser: 'html', printWidth: 120 })
    fs.writeFileSync(file, formatted)
    console.log(`  ✓ ${path.relative(root, file)}`)
  }
  console.log('Done.')
}

main().catch(console.error)
