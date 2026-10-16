import {
  bonusCases,
  starCases,
  holidayDrop,
  starOccasions,
  exclusiveCases,
} from '../data/cases';

// Имитация ответа сервера: возвращает Promise с задержкой 700 мс
export function fetchCasesMock() {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        bonusCases,
        starCases,
        holidayDrop,
        starOccasions,
        exclusiveCases,
      });
    }, 2000);
  });
}