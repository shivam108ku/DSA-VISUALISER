import React, { useState } from "react";

function SortingVisualizer() {
  const [array, setArray] = useState(generateRandomArray(10));
  const [timeTaken, setTimeTaken] = useState(0);
  const [previousArray, setPreviousArray] = useState([]);
  const [stepCount, setStepCount] = useState(0);
  const [arraySize, setArraySize] = useState(10);  
  const [speed, setSpeed] = useState(100);  
  const [isSorting, setIsSorting] = useState(false);  
  const [description, setDescription] = useState("");  

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

  // Checksort with pause/resume support
  const checksort = async (sortingFunction, desc) => {
    if (isSorting) return;
    setIsSorting(true);
    setPreviousArray([...array]);
    setDescription(desc);
    const startTime = Date.now();
    await sortingFunction([...array]);
    setTimeTaken(calculateTimeTaken(startTime));
    setIsSorting(false);
  };

  // Delay function with speed control
  const gaptime = (time) => new Promise((resolve) => setTimeout(resolve, time));

  // Bubble Sort
  const bubbleSort = async (arr) => {
    let steps = 0;
    for (let i = 0; i < arr.length - 1; i++) {
      for (let j = 0; j < arr.length - 1 - i; j++) {
        if (arr[j] > arr[j + 1]) {
          [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
          setArray([...arr]);
          steps++;
          setStepCount(steps);
          await gaptime(speed);
        }
      }
    }
  };

  // Selection Sort
  const selectionSort = async (arr) => {
    let steps = 0;
    for (let i = 0; i < arr.length - 1; i++) {
      let minIndex = i;
      for (let j = i + 1; j < arr.length; j++) {
        if (arr[j] < arr[minIndex]) minIndex = j;
      }
      if (minIndex !== i) {
        [arr[i], arr[minIndex]] = [arr[minIndex], arr[i]];
        setArray([...arr]);
        steps++;
        setStepCount(steps);
        await gaptime(speed);
      }
    }
  };

  // Quick Sort
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
    let steps = stepCount;
    for (let j = low; j < high; j++) {
      if (arr[j] < pivot) {
        i++;
        [arr[i], arr[j]] = [arr[j], arr[i]];
        setArray([...arr]);
        steps++;
        setStepCount(steps);
        await gaptime(speed);
      }
    }
    [arr[i + 1], arr[high]] = [arr[high], arr[i + 1]];
    setArray([...arr]);
    steps++;
    setStepCount(steps);
    await gaptime(speed);
    return i + 1;
  };

  // Insertion Sort
  const insertionSort = async (arr) => {
    let steps = 0;
    for (let i = 1; i < arr.length; i++) {
      let key = arr[i];
      let j = i - 1;
      while (j >= 0 && arr[j] > key) {
        arr[j + 1] = arr[j];
        j--;
        setArray([...arr]);
        steps++;
        setStepCount(steps);
        await gaptime(speed);
      }
      arr[j + 1] = key;
      setArray([...arr]);
      steps++;
      setStepCount(steps);
    }
  };

  // Reset function
  const resetSort = () => {
    setArray(generateRandomArray(arraySize));
    setTimeTaken(0);
    setStepCount(0);
    setIsSorting(false);
    setDescription("");
  };

  // Handle array size change
  const handleArraySizeChange = (e) => {
    const size = parseInt(e.target.value);
    setArraySize(size);
    setArray(generateRandomArray(size));
  };

  // Handle speed change
  const handleSpeedChange = (e) => {
    setSpeed(parseInt(e.target.value));
  };

  // Algorithm descriptions
  const descriptions = {
    bubbleSort: "Bubble Sort: Repeatedly steps through the list, compares adjacent elements and swaps them if they are in the wrong order. O(n²) time complexity.",
    selectionSort: "Selection Sort: Repeatedly finds the minimum element from the unsorted part and puts it at the beginning. O(n²) time complexity.",
    quickSort: "Quick Sort: Divides the array into smaller sub-arrays based on a pivot, then recursively sorts them. Average O(n log n) time complexity.",
    insertionSort: "Insertion Sort: Builds the final sorted array one item at a time by inserting elements into their correct position. O(n²) time complexity."
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

      {/* Sliders for Array Size and Speed */}
      <div className="flex justify-center items-center gap-5 mt-4">
        <div className="flex flex-col items-center">
          <label className="text-white font-semibold">Array Size: {arraySize}</label>
          <input
            type="range"
            min="5"
            max="50"
            value={arraySize}
            onChange={handleArraySizeChange}
            disabled={isSorting}
            className="w-32 accent-green-500"
          />
        </div>
        <div className="flex flex-col items-center">
          <label className="text-white font-semibold">Speed (ms): {speed}</label>
          <input
            type="range"
            min="10"
            max="500"
            step="10"
            value={speed}
            onChange={handleSpeedChange}
            className="w-32 accent-green-500"
          />
        </div>
      </div>

      <div className="h-[80%] w-[90%] sm:w-[80%] md:w-[70%] flex flex-wrap items-center mx-auto mt-5 border rounded-xl border-green-200">
        <div className="h-full w-full sm:w-[30%] md:w-[20%] flex flex-col gap-5 items-center">
          <div className="flex flex-col justify-center items-center gap-5 h-full">
            <button
              onClick={() => checksort(bubbleSort, descriptions.bubbleSort)}
              disabled={isSorting}
              className={`cursor-pointer font-semibold bg-gradient-to-r from-green-400 to-white h-14 w-38 rounded-2xl m-1 ml-2 ${isSorting ? "opacity-50" : ""}`}
            >
              Bubble Sort
            </button>
            <button
              onClick={() => checksort(selectionSort, descriptions.selectionSort)}
              disabled={isSorting}
              className={`cursor-pointer font-semibold bg-gradient-to-r from-green-400 to-white h-14 w-38 rounded-2xl m-1 ml-2 ${isSorting ? "opacity-50" : ""}`}
            >
              Selection Sort
            </button>
            <button
              onClick={() => checksort(quickSort, descriptions.quickSort)}
              disabled={isSorting}
              className={`cursor-pointer font-semibold bg-gradient-to-r from-green-400 to-white h-14 w-38 rounded-2xl m-1 ml-2 ${isSorting ? "opacity-50" : ""}`}
            >
              Quick Sort
            </button>
            <button
              onClick={() => checksort(insertionSort, descriptions.insertionSort)}
              disabled={isSorting}
              className={`cursor-pointer font-semibold bg-gradient-to-r from-green-400 to-white h-14 w-38 rounded-2xl m-1 ml-2 ${isSorting ? "opacity-50" : ""}`}
            >
              Insertion Sort
            </button>
            <button
              onClick={resetSort}
              className="cursor-pointer font-semibold bg-gradient-to-r from-red-400 to-white h-14 w-38 rounded-2xl m-1 ml-2"
            >
              RESET HERE
            </button>
            <button
              onClick={() => setArray([...previousArray])}
              disabled={previousArray.length === 0 || isSorting}
              className={`cursor-pointer font-semibold ${
                previousArray.length === 0 || isSorting ? "bg-gray-400" : "bg-gradient-to-r from-blue-400 to-white"
              } h-14 w-38 rounded-2xl m-1 ml-2`}
            >
              Previous Array
            </button>
          </div>
        </div>

        <div className="h-[80%] w-full sm:w-[70%] flex justify-evenly items-center">
          <div className="h-full w-[90%] flex justify-evenly items-end">
            {array.map((value, index) => (
              <div
                key={index}
                style={{
                  height: `${value}%`,
                  width: `${70 / arraySize}%`, // Dynamic width
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

      <div className="flex justify-center mt-4 gap-4">
        <h2 className="font-semibold text-xl text-white">Time Taken: {timeTaken} seconds</h2>
        <h2 className="font-semibold text-xl text-white">Steps: {stepCount}</h2>
      </div>
      {description && (
        <div className="flex justify-center mt-2">
          <p className="text-white text-sm max-w-md text-center">{description}</p>
        </div>
      )}
    </div>
  );
}

export default SortingVisualizer;