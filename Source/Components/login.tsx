import { container, center, useState } from '../../Frameworks/MikoJS.framework';
import { LucideIcon } from '../../Frameworks/LucideIcons.framework';

// Login Component with Vercel-style design
function Login(onLoginSuccess?: () => void) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [isDarkMode, setIsDarkMode] = useState(true);

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

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode());
  };

  const bgClass = isDarkMode() 
    ? 'min-h-screen bg-[#21201F] flex items-center justify-center p-4'
    : 'min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-4';

  return container(bgClass)
    .add(
      // Login Card
      container('w-full max-w-md relative')
        .add(
          // Theme Switcher Button (top right)
          (() => {
            const button = document.createElement('button');
            button.className = `absolute -top-4 w-16 h-16 flex items-center justify-center right-0 p-3 rounded-full ${
              isDarkMode() 
                ? 'bg-[#212010] hover:bg-[#212000] border border-[#212000]' 
                : 'bg-white hover:bg-gray-50 border border-gray-200'
            } shadow-lg transition-all duration-200 transform hover:scale-105`;
            button.appendChild(
              LucideIcon({ 
                name: isDarkMode() ? 'sun' : 'moon', 
                size: 20, 
                color: isDarkMode() ? '#fbbf24' : '#6366f1'
              })
            );
            button.addEventListener('click', toggleTheme);
            return button;
          })()
        )
        .add(
          // Vercel Logo Area
          center('text-center mb-8')
            .add(
              container(`inline-flex items-center justify-center w-12 h-12 ${
                isDarkMode() ? 'bg-white' : 'bg-black'
              } rounded-lg mb-4`)
                .add(
                  container(`${isDarkMode() ? 'text-black' : 'text-white'} font-bold text-xl`)
                    .add('▲')
                    .build()
                )
                .build()
            )
            .title('Welcome back', `text-2xl font-semibold ${isDarkMode() ? 'text-white' : 'text-gray-900'} mb-2`)
            .subtitle('Sign in to your account', `text-sm ${isDarkMode() ? 'text-gray-400' : 'text-gray-600'}`)
            .build()
        )
        .add(
          // Login Form Card
          container(`${
            isDarkMode() 
              ? 'bg-[#212010] border-[#212000]' 
              : 'bg-white border-gray-200'
          } rounded-xl border shadow-sm p-8`)
            .add(
              // Email Field
              container('mb-4')
                .add(
                  container(`flex items-center gap-2 text-sm font-medium ${
                    isDarkMode() ? 'text-gray-300' : 'text-[#212000]'
                  } mb-2`)
                    .add(
                      LucideIcon({ 
                        name: 'mail', 
                        size: 16, 
                        color: isDarkMode() ? '#9ca3af' : '#6b7280'
                      })
                    )
                    .add('Email')
                    .build()
                )
                .add(
                  (() => {
                    const input = document.createElement('input');
                    input.type = 'email';
                    input.placeholder = 'Enter your email';
                    input.className = `w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:border-transparent transition-all duration-200 text-sm ${
                      isDarkMode()
                        ? 'bg-gray-900 border-gray-600 text-white placeholder-gray-500 focus:ring-blue-500'
                        : 'bg-white border-gray-300 text-gray-900 placeholder-gray-400 focus:ring-black'
                    }`;
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
                  container(`flex items-center gap-2 text-sm font-medium ${
                    isDarkMode() ? 'text-gray-300' : 'text-[#212000]'
                  } mb-2`)
                    .add(
                      LucideIcon({ 
                        name: 'lock', 
                        size: 16, 
                        color: isDarkMode() ? '#9ca3af' : '#6b7280'
                      })
                    )
                    .add('Password')
                    .build()
                )
                .add(
                  (() => {
                    const input = document.createElement('input');
                    input.type = 'password';
                    input.placeholder = 'Enter your password';
                    input.className = `w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:border-transparent transition-all duration-200 text-sm ${
                      isDarkMode()
                        ? 'bg-gray-900 border-gray-600 text-white placeholder-gray-500 focus:ring-blue-500'
                        : 'bg-white border-gray-300 text-gray-900 placeholder-gray-400 focus:ring-black'
                    }`;
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
                container(`mb-4 p-3 border rounded-lg ${
                  error().includes('✅') 
                    ? isDarkMode() 
                      ? 'bg-green-900/30 border-green-700' 
                      : 'bg-green-50 border-green-200'
                    : isDarkMode()
                      ? 'bg-red-900/30 border-red-700'
                      : 'bg-red-50 border-red-200'
                }`)
                  .add(
                    container(`text-sm flex items-center gap-2 ${
                      error().includes('✅') 
                        ? isDarkMode() ? 'text-green-400' : 'text-green-600'
                        : isDarkMode() ? 'text-red-400' : 'text-red-600'
                    }`)
                      .add(
                        LucideIcon({ 
                          name: error().includes('✅') ? 'check-circle' : 'alert-circle', 
                          size: 16, 
                          color: error().includes('✅') 
                            ? isDarkMode() ? '#4ade80' : '#16a34a'
                            : isDarkMode() ? '#f87171' : '#dc2626'
                        })
                      )
                      .add(error().replace('✅ ', ''))
                      .build()
                  )
                  .build()
                : container().build()
            )
            .add(
              // Login Button
              (() => {
                const button = document.createElement('button');
                button.className = `w-full py-2.5 px-4 rounded-lg font-medium text-sm transition-all duration-200 flex items-center justify-center gap-2 ${
                  isLoading() 
                    ? 'bg-gray-400 cursor-not-allowed' 
                    : isDarkMode()
                      ? 'bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-[#212010]'
                      : 'bg-black hover:bg-[#212010] focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2'
                } text-white`;
                button.disabled = isLoading();
                
                if (isLoading()) {
                  const spinner = document.createElement('div');
                  spinner.innerHTML = '<svg class="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>';
                  button.appendChild(spinner.firstChild!);
                  button.appendChild(document.createTextNode('Signing in...'));
                } else {
                  button.appendChild(
                    LucideIcon({ 
                      name: 'log-in', 
                      size: 16, 
                      color: 'white'
                    })
                  );
                  button.appendChild(document.createTextNode('Sign in'));
                }
                
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
              container(`text-sm ${isDarkMode() ? 'text-gray-400' : 'text-gray-600'}`)
                .add("Don't have an account? ")
                .add(
                  (() => {
                    const link = document.createElement('a');
                    link.href = '#';
                    link.className = `${
                      isDarkMode() ? 'text-blue-400 hover:text-blue-300' : 'text-black hover:underline'
                    } font-medium`;
                    link.textContent = 'Sign up';
                    return link;
                  })()
                )
                .build()
            )
            .add(
              container(`mt-4 text-xs ${isDarkMode() ? 'text-gray-500' : 'text-gray-500'} flex items-center justify-center gap-2`)
                .add(
                  LucideIcon({ 
                    name: 'info', 
                    size: 12, 
                    color: isDarkMode() ? '#6b7280' : '#9ca3af'
                  })
                )
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