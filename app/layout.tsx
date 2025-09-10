import type { Metadata } from 'next'
import './globals.css'
import { Providers } from './providers'

export const metadata: Metadata = {
  title: 'Resume Optimizer - ATS-Ready Resumes in 60 Seconds',
  description: 'Paste your resume + job ad → get an ATS-ready rewrite, tailored cover letter, and skill gap report in 60 seconds.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  )
}
