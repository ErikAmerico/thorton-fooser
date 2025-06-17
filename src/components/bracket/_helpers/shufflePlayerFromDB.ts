import { PlayerFromDB } from "../../../types";

//fisher-yates
export function shufflePlayerFromDB(array: PlayerFromDB[]): PlayerFromDB[] {
  // Make copy - Do not mutate original array
  const arrayCopy = array.slice();

  //Walk backwards through the array
  for (
    let currentIndex = arrayCopy.length - 1;
    currentIndex > 0;
    currentIndex--
  ) {
    // Pick random index between 0 and currentIndex
    const randomIndex = Math.floor(Math.random() * (currentIndex + 1));

    // Swap element currentIndex with the one at randomIndex
    const temp = arrayCopy[currentIndex];
    arrayCopy[currentIndex] = arrayCopy[randomIndex];
    arrayCopy[randomIndex] = temp;
  }

  //Return the shuffled copy
  return arrayCopy;
}
