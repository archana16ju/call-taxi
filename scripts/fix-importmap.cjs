const fs = require('fs')
const path = require('path')

const ROOT = path.join(__dirname, '../src')
const IMPORT_MAP = path.join(__dirname, '../src/app/(payload)/admin/importMap.js')

// 🔧 Convert filename to correct casing from actual file
function findCorrectFileCase(importPath) {
  const fullPath = path.join(ROOT, importPath.replace('@/',''))

  const dir = path.dirname(fullPath)
  const fileName = path.basename(fullPath)

  if (!fs.existsSync(dir)) return null

  const files = fs.readdirSync(dir)

  const match = files.find(f => f.toLowerCase() === fileName.toLowerCase())

  if (!match) return null

  return importPath.replace(fileName, match.replace(/\.(tsx|ts|js|jsx)$/, ''))
}

// 🔧 Fix all imports inside importMap.js
function fixImportMap() {
  if (!fs.existsSync(IMPORT_MAP)) {
    console.log('❌ importMap.js not found')
    return
  }

  let content = fs.readFileSync(IMPORT_MAP, 'utf-8')

  // ✅ Fix wrong base path
  content = content.replaceAll(
    '@/app/(payload)/components',
    '@/payload/admin/components'
  )

  // ✅ Fix casing dynamically
  content = content.replace(/@\/payload\/admin\/components\/[a-zA-Z0-9_-]+/g, (match) => {
    const fixed = findCorrectFileCase(match)
    return fixed || match
  })

  fs.writeFileSync(IMPORT_MAP, content)

  console.log('✅ importMap fixed successfully')
}

// 🔧 Run
fixImportMap()