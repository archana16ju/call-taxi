module.exports = function transformer(fileInfo, api) {
  const j = api.jscodeshift
  const root = j(fileInfo.source)

  return root
    .find(j.ImportDeclaration)
    .forEach((pathNode) => {
      const source = pathNode.node.source.value

      if (typeof source !== 'string') return

      // Skip node_modules
      if (!source.startsWith('.') && !source.startsWith('/')) return

      // Convert relative → @/src
      if (source.includes('app/(payload)')) {
        const fixed = source
          .replace(/^(\.\.\/)+src\//, '@/')
          .replace(/^(\.\.\/)+/, '@/')

        pathNode.node.source.value = fixed
      }
    })
    .toSource()
}