import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: '英単語暗記アプリ',
  description: 'TOEIC500点突破のための英単語暗記アプリ',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ja">
      <body>{children}</body>
    </html>
  )
}

