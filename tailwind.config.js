module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      width: {
        '7/10': '70%',
        '3/10': '30%',
      },
      colors: {
        customBlack: '#000507', // Black
        customGray: '#131313', // Dark gray
        customGreen: '#4caf50', // Green
        customBlue: '#032e3e', // Blue
        customBorder: '#3d3d3d', // Light gray border 
        customWhite: '#f5f5f5', //
        customLightBlue :'#0DA7E4' // White 005E83
      },
    },
  },
  plugins: [],
};
