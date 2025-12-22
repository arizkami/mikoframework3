import Login from './Components/login';

// App Component - Simple Login Only
function App() {
  return Login();
}

// Mount the app
document.addEventListener('DOMContentLoaded', () => {
  const root = document.getElementById('root');
  if (root) {
    const app = App();
    root.appendChild(app);
  }
});

export default App;