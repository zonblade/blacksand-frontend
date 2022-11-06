import Main from './route/index'
import { BrowserRouter } from 'react-router-dom'
import { Provider } from "react-redux"
import store from './redux/index'

function App() {
  return (
    <BrowserRouter>
      <Provider store={store}>
        <Main />
      </Provider>
    </BrowserRouter>
  );
}

export default App;
