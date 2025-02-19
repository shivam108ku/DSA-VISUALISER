import React, { useState } from "react";

function SortingVisualizer() {
  const [array, setArray] = useState(generateRandomArray(10));
  const [timeTaken, setTimeTaken] = useState(0);
  const [previousArray, setPreviousArray] = useState([]);
 

  // Function to generate a random array
  function generateRandomArray(size) {
    const arr = [];
    for (let i = 0; i < size; i++) {
      arr.push(Math.floor(Math.random() * 100) + 1);
    }
    return arr;
  }

  const calculateTimeTaken = (startTime) => {
    const endTime = Date.now();
    return ((endTime - startTime) / 1000).toFixed(2);
  };

  // Previous array function
  const checksort = async (sortingFunction) => {
    setPreviousArray([...array]); 
    const startTime = Date.now();
    await sortingFunction([...array]);
    setTimeTaken(calculateTimeTaken(startTime));
  };

  // bubbleSort

  const bubbleSort = async (arr) => {
    for (let i = 0; i < arr.length - 1; i++) {
      for (let j = 0; j < arr.length - 1 - i; j++) {
        if (arr[j] > arr[j + 1]) {
          [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
          setArray([...arr]);
          await gaptime(100);
        }
      }
    }
  };

  // selectionSort

  const selectionSort = async (arr) => {
    for (let i = 0; i < arr.length - 1; i++) {
      let minIndex = i;
      for (let j = i + 1; j < arr.length; j++) {
        if (arr[j] < arr[minIndex]) {
          minIndex = j;
        }
      }
      if (minIndex !== i) {
        [arr[i], arr[minIndex]] = [arr[minIndex], arr[i]];
        setArray([...arr]);
        await gaptime(100);
      }
    }
  };

  // quickSort

  const quickSort = async (arr, low = 0, high = arr.length - 1) => {
    if (low < high) {
      const pi = await partition(arr, low, high);
      await quickSort(arr, low, pi - 1);
      await quickSort(arr, pi + 1, high);
    }
    setArray([...arr]);
  };

  const partition = async (arr, low, high) => {
    const pivot = arr[high];
    let i = low - 1;
    for (let j = low; j < high; j++) {
      if (arr[j] < pivot) {
        i++;
        [arr[i], arr[j]] = [arr[j], arr[i]];
        setArray([...arr]);
        await gaptime(100);
      }
    }
    [arr[i + 1], arr[high]] = [arr[high], arr[i + 1]];
    setArray([...arr]);
    await gaptime(100);
    return i + 1;
  };

  // insertionSort

  const insertionSort = async (arr) => {
    for (let i = 1; i < arr.length; i++) {
      let key = arr[i];
      let j = i - 1;
      while (j >= 0 && arr[j] > key) {
        arr[j + 1] = arr[j];
        j = j - 1;
        setArray([...arr]);
        await gaptime(100);
      }
      arr[j + 1] = key;
      setArray([...arr]);
    }
  };

  // creating gap here 
  const gaptime = (time) => new Promise((resolve) => setTimeout(resolve, time));

  // Reset function

  const resetSort = () => {
    setArray(generateRandomArray(10));
    setTimeTaken(0);
  };

  return (
    <div className="h-screen w-full bg-zinc-800">
      <div className="menu flex flex-wrap justify-around items-center p-5 space-x-5">
        <h1 className="bg-gradient-to-r from-green-500 to-white bg-clip-text text-transparent p-2 rounded-xl font-extrabold text-3xl">
          DSA-VISUALISER
        </h1>
      </div>

      <div className="flex justify-center items-center">
        <h1 className="bg-gradient-to-r from-green-500 to-white bg-clip-text text-transparent p-2 rounded-xl font-extrabold text-3xl">
          Sorting Algorithms
        </h1>
      </div>

      <div className="h-[80%] w-[90%] sm:w-[80%] md:w-[70%] flex flex-wrap items-center mx-auto mt-5 border rounded-xl border-green-200">
        <div className="h-full w-full sm:w-[30%] md:w-[20%] flex flex-col gap-5 items-center">
          <div className="flex flex-col justify-center items-center gap-5 h-full">
            <button onClick={() => checksort(bubbleSort)} className="cursor-pointer font-semibold bg-gradient-to-r from-green-400 to-white h-14 w-38 rounded-2xl m-1 ml-2">
              Bubble Sort
            </button>
            <button onClick={() => checksort(selectionSort)} className="cursor-pointer font-semibold bg-gradient-to-r from-green-400 to-white h-14 w-38 rounded-2xl m-1 ml-2">
              Selection Sort
            </button>
            <button onClick={() => checksort(quickSort)} className="cursor-pointer font-semibold bg-gradient-to-r from-green-400 to-white h-14 w-38 rounded-2xl m-1 ml-2">
              Quick Sort
            </button>
            <button onClick={() => checksort(insertionSort)} className="cursor-pointer font-semibold bg-gradient-to-r from-green-400 to-white h-14 w-38 rounded-2xl m-1 ml-2">
              Insertion Sort
            </button>
            <button onClick={resetSort} className="cursor-pointer font-semibold bg-gradient-to-r from-red-400 to-white h-14 w-38 rounded-2xl m-1 ml-2">
              RESET HERE
            </button>
            <button
              onClick={() => setArray([...previousArray])}
              disabled={previousArray.length === 0}
              className={`cursor-pointer font-semibold ${
                previousArray.length === 0 ? "bg-gray-400" : "bg-gradient-to-r from-blue-400 to-white"
              } h-14 w-38 rounded-2xl m-1 ml-2`}
            >
              Previous Array
            </button>
          </div>
        </div>

        <div className="h-[80%] w-full sm:w-[70%] flex justify-evenly items-center">
          <div className="h-full w-[90%] flex justify-evenly items-center">
            {array.map((value, index) => (
              <div
                key={index}
                style={{
                  height: `${value}%`,
                  width: "30px",
                  backgroundColor: "green",
                  margin: "0 5px",
                  transition: "height 0.2s ease",
                  position: "relative",
                }}
              >
                <span
                  style={{
                    position: "absolute",
                    bottom: "-20px",
                    fontSize: "12px",
                    color: "white",
                    fontWeight: "bold",
                  }}
                >
                  {value}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="flex justify-center mt-4">
        <h2 className="font-semibold text-xl text-white">Time Taken: {timeTaken} seconds</h2>
      </div>
    </div>
  );
}

export default SortingVisualizer;
