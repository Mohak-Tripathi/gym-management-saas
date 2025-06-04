// To handle full rupees and paise conversion:
import converter from 'number-to-words';

function convertAmountToWords(amount: number): string {
    const [rupeesStr, paiseStr] = amount.toFixed(2).split('.');
    const rupees = parseInt(rupeesStr, 10);
    const paise = parseInt(paiseStr, 10);
  
    let words = `${converter.toWords(rupees)} rupees`;
    if (paise > 0) {
      words += ` and ${converter.toWords(paise)} paise`;
    }
    return words.charAt(0).toUpperCase() + words.slice(1);
  }

export default convertAmountToWords