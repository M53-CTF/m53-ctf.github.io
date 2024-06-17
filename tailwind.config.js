module.exports = {
  content: ['./src/**/*.{html,js}'],
  darkMode: 'class',
  theme: {
    container: {
      center: true,
      padding: '1rem',
    },
    colors: {
      current: 'currentColor',
      transparent: 'transparent',
      white: '#FFFFFF',
      black: '#090E34', // 090E34
      dark: '#1D2144', // 1D2144 // On Top of Black
      primary: '#FF8303', // #4A6CF7 (Ori) #FF8303 (Gold Orange)
      yellow: '#FBB040', // #FBB040
      'body-color': '#959CB1',
    },
    screens: {
      sm: '540px',
      // => @media (min-width: 576px) { ... }

      md: '720px',
      // => @media (min-width: 768px) { ... }

      lg: '960px',
      // => @media (min-width: 992px) { ... }

      xl: '1140px',
      // => @media (min-width: 1200px) { ... }

      '2xl': '1320px',
      // => @media (min-width: 1400px) { ... }
    },
    extend: {
      boxShadow: {
        signUp: '0px 5px 10px rgba(4, 10, 34, 0.2)',
        one: '0px 2px 3px rgba(7, 7, 77, 0.05)',
      },
    },
  },
  plugins: [],
};
