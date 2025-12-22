import { container, center, useState } from '../../Frameworks/MikoJS.framework';

// Login Component with Vercel-style design
function Login(onLoginSuccess?: () => void) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async () => {
    if (!email() || !password()) {
      setError('Please fill in all fields');
      return;
    }

    setIsLoading(true);
    setError('');

    // Simulate login API call
    setTimeout(() => {
      setIsLoading(false);
      if (email() === 'demo@vercel.com' && password() === 'demo') {
        console.log('Login successful!');
        setError('✅ Login successful! Welcome back.');
        if (onLoginSuccess) {
          setTimeout(() => onLoginSuccess(), 1000);
        }
      } else {
        setError('Invalid credentials. Try demo@vercel.com / demo');
      }
    }, 1500);
  };

  const handleEmailChange = (e: Event) => {
    const target = e.target as HTMLInputElement;
    setEmail(target.value);
    if (error()) setError('');
  };

  const handlePasswordChange = (e: Event) => {
    const target = e.target as HTMLInputElement;
    setPassword(target.value);
    if (error()) setError('');
  };

  const handleKeyPress = (e: KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleLogin();
    }
  };

  return container('min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-4')
    .add(
      // Login Card
      container('w-full max-w-md')
        .add(
          // Vercel Logo Area
          center('text-center mb-8')
            .add(
              container('inline-flex items-center justify-center w-12 h-12 bg-black rounded-lg mb-4')
                .add(
                  container('text-white font-bold text-xl')
                    .add('▲')
                    .build()
                )
                .build()
            )
            .title('Welcome back', 'text-2xl font-semibold text-gray-900 mb-2')
            .subtitle('Sign in to your account', 'text-sm text-gray-600')
            .build()
        )
        .add(
          // Login Form Card
          container('bg-white rounded-xl border border-gray-200 shadow-sm p-8')
            .add(
              // Email Field
              container('mb-4')
                .add(
                  container('block text-sm font-medium text-gray-700 mb-2')
                    .add('Email')
                    .build()
                )
                .add(
                  (() => {
                    const input = document.createElement('input');
                    input.type = 'email';
                    input.placeholder = 'Enter your email';
                    input.className = 'w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-all duration-200 text-sm';
                    input.value = email();
                    input.addEventListener('input', handleEmailChange);
                    input.addEventListener('keypress', handleKeyPress);
                    return input;
                  })()
                )
                .build()
            )
            .add(
              // Password Field
              container('mb-6')
                .add(
                  container('block text-sm font-medium text-gray-700 mb-2')
                    .add('Password')
                    .build()
                )
                .add(
                  (() => {
                    const input = document.createElement('input');
                    input.type = 'password';
                    input.placeholder = 'Enter your password';
                    input.className = 'w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-all duration-200 text-sm';
                    input.value = password();
                    input.addEventListener('input', handlePasswordChange);
                    input.addEventListener('keypress', handleKeyPress);
                    return input;
                  })()
                )
                .build()
            )
            .add(
              // Error/Success Message
              error() ? 
                container(`mb-4 p-3 ${error().includes('✅') ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'} border rounded-lg`)
                  .add(
                    container(`text-sm ${error().includes('✅') ? 'text-green-600' : 'text-red-600'} flex items-center`)
                      .add(error().includes('✅') ? '' : '⚠️ ')
                      .add(error())
                      .build()
                  )
                  .build()
                : container().build()
            )
            .add(
              // Login Button
              (() => {
                const button = document.createElement('button');
                button.className = `w-full py-2.5 px-4 rounded-lg font-medium text-sm transition-all duration-200 ${
                  isLoading() 
                    ? 'bg-gray-400 cursor-not-allowed' 
                    : 'bg-black hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2'
                } text-white`;
                button.disabled = isLoading();
                button.innerHTML = isLoading() 
                  ? '<span class="flex items-center justify-center"><svg class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>Signing in...</span>'
                  : 'Sign in';
                button.addEventListener('click', handleLogin);
                return button;
              })()
            )
            .build()
        )
        .add(
          // Footer Links
          center('mt-6')
            .add(
              container('text-sm text-gray-600')
                .add("Don't have an account? ")
                .add(
                  (() => {
                    const link = document.createElement('a');
                    link.href = '#';
                    link.className = 'text-black hover:underline font-medium';
                    link.textContent = 'Sign up';
                    return link;
                  })()
                )
                .build()
            )
            .add(
              container('mt-4 text-xs text-gray-500')
                .add('Demo credentials: demo@vercel.com / demo')
                .build()
            )
            .build()
        )
        .build()
    )
    .build();
}

export default Login;