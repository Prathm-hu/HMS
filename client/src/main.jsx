import { createRoot } from 'react-dom/client'
import { Provider } from 'react-redux'
import { Toaster } from 'sonner'
import App from './App.jsx'
import appStore from './app/store'
import LoadingSpinner from './components/LoadingSpinner'
import { useLoadUserQuery } from './features/api/apiApi'
import './index.css'

const Custom = ({ children }) => {
  const { isLoading } = useLoadUserQuery();
  return (

    <>
      {
        isLoading ? <LoadingSpinner /> : children

      }

    </>
  )
}

createRoot(document.getElementById('root')).render(
  <Provider store={appStore}>
    <Custom>
      <App />
      <Toaster />
    </Custom>
  </Provider>,
)
