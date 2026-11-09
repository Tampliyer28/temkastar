import {
  bonusCases,
  starCases,
  holidayDrop,
  starOccasions,
  exclusiveCases,
} from '../data/cases';

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
    }, 1000);
  });
}