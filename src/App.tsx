import { BrowserRouter } from 'react-router-dom'
import { Provider } from 'react-redux'
import { store } from './app/store'
import { AppRouter } from './router/AppRouter'
import './App.css'

function App() {
  return (
    <Provider store={store}>
      <BrowserRouter>
        <div className="App">
          <AppRouter />
        </div>
      </BrowserRouter>
    </Provider>
  )
}

export default App