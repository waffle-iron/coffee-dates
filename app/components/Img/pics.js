import blackPlus from 'assets/plus.png';
import whitePlus from 'assets/plus-white.png';
import darkRedPlus from 'assets/plus-dark-red.png';
import darkGrayPlus from 'assets/plus-dark-gray.png';
import redPlus from 'assets/plus-red.png';
import blackMinus from 'assets/minus.png';
import whiteMinus from 'assets/minus-white.png';
import darkRedMinus from 'assets/minus-dark-red.png';
import redMinus from 'assets/minus-red.png';
import darkGrayMinus from 'assets/minus-dark-gray.png';
import whiteA from 'assets/white-a.png';
import grayA from 'assets/gray-a.png';

export default {
  blackPlus: {
    base: blackPlus,
    hover: darkGrayPlus,
  },
  whitePlus: {
    base: whitePlus,
    hover: darkGrayPlus,
  },
  darkRedPlus: {
    base: darkRedPlus,
    hover: redPlus,
  },
  redPlus: {
    base: redPlus,
    hover: darkRedPlus,
  },
  blackMinus: {
    base: blackMinus,
    hover: darkGrayMinus,
  },
  whiteMinus: {
    base: whiteMinus,
    hover: darkGrayMinus,
  },
  darkRedMinus: {
    base: darkRedMinus,
    hover: redMinus,
  },
  redMinus: {
    base: redMinus,
    hover: darkRedMinus,
  },

  whiteA: {
    base: whiteA,
    hover: grayA,
  },
  grayA: {
    base: grayA,
    hover: whiteA,
  },
};
