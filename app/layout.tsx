import './globals.css'
import { Nunito } from 'next/font/google'
import Navbar from './components/navbar/Navbar';
import ClientOnly from './components/ClientOnly';
import RegisterModal from './components/modals/RegisterModal';
import LoginModal from './components/modals/LoginModal';
import ToasterProvider from './providers/ToasterProvider';
import getCurrentUser from './actions/getCurrentUser';


export const metadata = {
  title: 'AirBnB',
  description: 'AirBnB clone',
}

interface Props {
  children: React.ReactNode
}

const nunito = Nunito({
  subsets: ['latin']
})

export default async function RootLayout({
  children,
}: Props) {
  
  //get current user
  const currentUser = await getCurrentUser();

  return (
    <html lang="en">
      <body className={nunito.className}>
        <ClientOnly>
          <ToasterProvider />
          <LoginModal />
          <RegisterModal />
          <Navbar currentUser={currentUser} />
        </ClientOnly>
        {children}
      </body>
    </html>
  )
}
