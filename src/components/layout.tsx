import  { type PropsWithChildren } from 'react'
import Header from './header'

const Layout = ({ children }: PropsWithChildren) => {
    return (
        <div className='bg-gradient-to-br from-background to-muted '>
            <Header />
            <main className='min-h-screen container mx-auto px-4 py-8'>
                {children}
            </main>

            <footer className="border-t py-6 text-center text-gray-200 bg-gradient-to-br from-background to-muted">
                <p>© {new Date().getFullYear()} Mahammad. All rights reserved.</p>
                <p className="mt-2">
                    Contact: <a href="mailto:mahammadtalibli@outlook.com" className="underline">mahammadtalibli@outlook.com</a>
                </p>
                <p className="mt-2">
                    Contact: <a href="number:+994-55-925-35-40" className="underline">+994-55-925-35-40</a>
                </p>
            </footer>


        </div>
    )
}

export default Layout