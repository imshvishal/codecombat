/** @type {import('next').NextConfig} */
const nextConfig = {
    transpilePackages: ["next-mdx-remote"],
    images: {
        remotePatterns: [
            {
                hostname: "localhost"
            },
        ],
    }
}

module.exports = nextConfig
