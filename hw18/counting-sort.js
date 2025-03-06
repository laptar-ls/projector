function countingSort(arr) {
  let max = Math.max(...arr);
  let min = Math.min(...arr);

  let count = new Array(max - min + 1).fill(0);

  for (let num of arr) {
    count[num - min]++;
  }
  console.log(count);

  let sortedArray = [];
  for (let i = 0; i < count.length; i++) {
    while (count[i] > 0) {
      sortedArray.push(i + min);
      count[i]--;
    }
  }

  return sortedArray;
}

let arr = [4, 2, 2, 8, 3, 3, 1, 15];
let sortedArr = countingSort(arr);
console.log(sortedArr);
