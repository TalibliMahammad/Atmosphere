
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./components/layout";
import { ThemeProvider } from "./components/context/theme.provider";
import WeatherDashboard from "./pages/weatherDashboard";
import Citypage from "./pages/citypage";
import {
  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { Toaster } from "sonner";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5,
      gcTime: 1000 * 60 * 10,
      retry: false,
      refetchOnWindowFocus: false,
    }
  }
}
)


function App() {


  return (
    <div className="">

      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <ThemeProvider defaultTheme="dark">
            <Layout>
              <Routes>
                <Route path="/" element={<WeatherDashboard />} />
                <Route path="/city/:cityName" element={<Citypage />} />
              </Routes>
            </Layout>
            <Toaster richColors/>
          </ThemeProvider>
        </BrowserRouter>
        <ReactQueryDevtools initialIsOpen={false} />
      </QueryClientProvider>


    </div>

  )
}

export default App
