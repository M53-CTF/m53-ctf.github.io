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
      black: '#1B1B1B', // 090E34 (Ori Blue) 1A1110 (Licorice Black) 0D0208 (Vantablack) #1B1B1B (Eerie Black)
      dark: '#1D2144', // 1D2144 // On Top of Black
      primary: '#DC143C', // #4A6CF7 (Ori) #FF8303 (Gold Orange) #A6192D (Crisom) #DC143C RED
      yellow: '#FBB040', // #FBB040 (Ori)
      'body-color': '#959CB1', // #959CB1 (Ori)
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
      margin: {
        4: '0.4rem',   // Previously 1rem
        8: '0.8rem',   // Previously 2rem
        9: '0.9rem',  // Previously 2.25rem
        10: '1.0rem',  // Previously 2.5rem
        16: '1.6rem',  // Previously 4rem
      },
      boxShadow: {
        signUp: '0px 5px 10px rgba(4, 10, 34, 0.2)',
        one: '0px 2px 3px rgba(7, 7, 77, 0.05)',
      },
    },
  },
  corePlugins:{
    // preflight: false, // Disable preflight styles (Self Added)
    listStyleType: false, // Disable listStyleType (Self Added)
    listStylePosition: false, // Disable listStylePosition (Self Added)
  },
  plugins: [],
};
