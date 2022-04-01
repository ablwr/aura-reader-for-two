import type { NextPage } from 'next'
import CreateSession from '../components/CreateSession'
import Footer from '../components/Footer'
import Header from '../components/Header'

const Home: NextPage = () => {
  return (
    <div className="flex flex-1 flex-col h-screen w-screen">
      <Header />
      <main className="flex flex-1 flex-col items-center justify-center text-center bg-gradient-to-b from-indigo-600 to-indigo-300">
        <CreateSession />
        <canvas id="todo-later"></canvas>
      </main>
      <Footer />
    </div>
  )
}

export default Home
