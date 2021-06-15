import ReactDOM from 'react-dom';
import { useEffect } from 'react';
import Home from '@/pages/home';

function App() {
  useEffect(() => {
    fetch('/api/auth/info')
      .then((res) => res.json())
      .then((res) => {
        console.log(res);
      });
  }, []);

  return <Home />;
}

const root = document.getElementById('root');

ReactDOM.render(<App />, root);
