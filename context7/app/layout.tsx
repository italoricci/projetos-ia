import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
	title: 'Next.js + Better Auth + GitHub',
	description: 'Simple demo with OAuth GitHub',
};

export default function RootLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<html lang="pt-BR">
			<body>{children}</body>
		</html>
	);
}
