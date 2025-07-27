import { ReactNode } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';

interface LayoutProps {
  children: ReactNode;
  title?: string;
  description?: string;
}

export default function RootLayout({ 
  children, 
  title = 'Expense Tracker', 
  description = 'Track and manage your expenses easily'
}: LayoutProps) {
  const router = useRouter();
  const isAuthPage = router.pathname === '/login' || router.pathname === '/register';

  return (
    <>
      <Head>
        <title>{title}</title>
        <meta name="description" content={description} />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className={isAuthPage ? 'auth-layout' : 'main-layout'}>
        {children}
      </div>
    </>
  );
}
