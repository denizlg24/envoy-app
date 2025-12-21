import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Envoy CLI | .env versioning made easy',
  description: 'Manage and version your .env files with ease using Envoy CLI.',
}

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className=''>{children}</body>
    </html>
  )
}
