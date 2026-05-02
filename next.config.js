import path from 'path'

const nextConfig = {
  webpack: (config) => {
    config.resolve.alias['@'] = path.resolve(process.cwd(), 'src')
    return config
  },
}

export default nextConfig