import React, { useState } from "react"; // Importing React and useState hook for state management

// SortingVisualizer: A React component to visualize sorting algorithms with normal and race modes
function SortingVisualizer() {
  // State variables for managing the visualizer
  const [array, setArray] = useState(generateRandomArray(10)); // Main array for normal mode
  const [timeTaken, setTimeTaken] = useState(0); // Total time taken for sorting
  const [previousArray, setPreviousArray] = useState([]); // Stores the previous array
  const [stepCount, setStepCount] = useState(0); // To Check number of steps in sorting
  const [arraySize, setArraySize] = useState(10); // Size of the array, adjustable via user
  const [speed, setSpeed] = useState(100); // Animation speed manager
  const [isSorting, setIsSorting] = useState(false); // To indicate sorting is in progress or not
  const [description, setDescription] = useState(""); // Description of the current algorithm
  const [raceMode, setRaceMode] = useState(false); // Toggle between normal and race mode
  const [raceArrays, setRaceArrays] = useState({ // Race mode for each algorithm
    bubble: [],
    selection: [],
    quick: [],
    insertion: [],
  });
  const [raceTimes, setRaceTimes] = useState({ // Time taken by each algorithm in race mode
    bubble: 0,
    selection: 0,
    quick: 0,
    insertion: 0,
  });

  // Generates a random array of given size 
  function generateRandomArray(size) {
    const arr = [];
    for (let i = 0; i < size; i++) {
      arr.push(Math.floor(Math.random() * 100) + 1);
    }
    return arr;
  }

  // Calculates time elapsed in seconds 
  const calculateTimeTaken = (startTime) => {
    const endTime = Date.now();
    return ((endTime - startTime) / 1000).toFixed(2);  
  };

  // Creates a delay for my animations
  const gaptime = (time) => new Promise((resolve) => setTimeout(resolve, time));

  // Bubble Sort
  const bubbleSort = async (arr) => {
    let steps = 0; // Counter for steps
    for (let i = 0; i < arr.length - 1; i++) {
      for (let j = 0; j < arr.length - 1 - i; j++) {
        if (arr[j] > arr[j + 1]) {  
          [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];  
          steps++;
          // Update UI: Use raceArrays for race mode, array for normal mode
          raceMode ? setRaceArrays(prev => ({ ...prev, bubble: [...arr] })) : setArray([...arr]);
          setStepCount(steps); // Update step count
          await gaptime(speed); // Pause for animation
        }
      }
    }
    return arr; // Return sorted array
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
        steps++;
        raceMode ? setRaceArrays(prev => ({ ...prev, selection: [...arr] })) : setArray([...arr]);
        setStepCount(steps);
        await gaptime(speed);
      }
    }
    return arr;
  };

  // Quick Sort 
  const quickSort = async (arr, low = 0, high = arr.length - 1) => {
    if (low < high) {
      const pi = await partition(arr, low, high); 
      await quickSort(arr, low, pi - 1);  
      await quickSort(arr, pi + 1, high);  
    }
    raceMode ? setRaceArrays(prev => ({ ...prev, quick: [...arr] })) : setArray([...arr]);
    return arr;
  };

  // Partition helper for Quick Sort
  const partition = async (arr, low, high) => {
    const pivot = arr[high];  
    let i = low - 1;  
    let steps = stepCount;
    for (let j = low; j < high; j++) {
      if (arr[j] < pivot) {
        i++;
        [arr[i], arr[j]] = [arr[j], arr[i]];  
        steps++;
        raceMode ? setRaceArrays(prev => ({ ...prev, quick: [...arr] })) : setArray([...arr]);
        setStepCount(steps);
        await gaptime(speed);
      }
    }
    [arr[i + 1], arr[high]] = [arr[high], arr[i + 1]];  
    steps++;
    raceMode ? setRaceArrays(prev => ({ ...prev, quick: [...arr] })) : setArray([...arr]);
    setStepCount(steps);
    await gaptime(speed);
    return i + 1; // Return pivot index
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
        steps++;
        raceMode ? setRaceArrays(prev => ({ ...prev, insertion: [...arr] })) : setArray([...arr]);
        setStepCount(steps);
        await gaptime(speed);
      }
      arr[j + 1] = key;  
      steps++;
      raceMode ? setRaceArrays(prev => ({ ...prev, insertion: [...arr] })) : setArray([...arr]);
      setStepCount(steps);
    }
    return arr;
  };

  // Runs a single sorting algorithm in normal mode
  const checksort = async (sortingFunction, desc) => {
    if (isSorting) return;  
    setIsSorting(true);  
    setPreviousArray([...array]); //Saving current array
    setDescription(desc); //Algorithm description
    const startTime = Date.now();
    await sortingFunction([...array]); 
    setTimeTaken(calculateTimeTaken(startTime));  
    setIsSorting(false);  
  };

  // Starts race mode, running all algorithms simultaneously
  const startRace = async () => {
    if (isSorting) return;
    setIsSorting(true);
    const initialArray = generateRandomArray(arraySize);  
    setRaceArrays({ // Initialize all race arrays with the same initial array
      bubble: [...initialArray],
      selection: [...initialArray],
      quick: [...initialArray],
      insertion: [...initialArray],
    });
    setStepCount(0);
    setDescription("Algorithm Race Mode: Watch them compete!");

    const raceStart = Date.now();
    // Run all sorts in parallel and measure time for each
    const [bubbleResult, selectionResult, quickResult, insertionResult] = await Promise.all([
      bubbleSort([...initialArray]).then(() => calculateTimeTaken(raceStart)),
      selectionSort([...initialArray]).then(() => calculateTimeTaken(raceStart)),
      quickSort([...initialArray]).then(() => calculateTimeTaken(raceStart)),
      insertionSort([...initialArray]).then(() => calculateTimeTaken(raceStart)),
    ]);

    setRaceTimes({ // Updating the race time
      bubble: bubbleResult,
      selection: selectionResult,
      quick: quickResult,
      insertion: insertionResult,
    });
    setTimeTaken(calculateTimeTaken(raceStart)); // Total race time
    setIsSorting(false);
  };

  // Resets the visualizer to a new random array
  const resetSort = () => {
    const newArray = generateRandomArray(arraySize);
    setArray(newArray);
    setRaceArrays({ // Reset race arrays if in race mode
      bubble: raceMode ? [...newArray] : [],
      selection: raceMode ? [...newArray] : [],
      quick: raceMode ? [...newArray] : [],
      insertion: raceMode ? [...newArray] : [],
    });
    setTimeTaken(0);
    setStepCount(0);
    setIsSorting(false);
    setDescription("");
    setRaceTimes({ bubble: 0, selection: 0, quick: 0, insertion: 0 });
  };

  // Handles array size change from slider
  const handleArraySizeChange = (e) => {
    const size = parseInt(e.target.value);
    setArraySize(size);
    resetSort(); // Reset with new size
  };

  // Handles speed change from slider
  const handleSpeedChange = (e) => {
    setSpeed(parseInt(e.target.value));
  };

  // Toggles between race and normal mode
  const toggleRaceMode = () => {
    setRaceMode(!raceMode);
    resetSort(); // Reseting the state 
  };

  // Algorithm descriptions for display
  const descriptions = {
    bubbleSort: "Bubble Sort: Repeatedly steps through the list, compares adjacent elements and swaps them if they are in the wrong order. O(n²) time complexity.",
    selectionSort: "Selection Sort: Repeatedly finds the minimum element from the unsorted part and puts it at the beginning. O(n²) time complexity.",
    quickSort: "Quick Sort: Divides the array into smaller sub-arrays based on a pivot, then recursively sorts them. Average O(n log n) time complexity.",
    insertionSort: "Insertion Sort: Builds the final sorted array one item at a time by inserting elements into their correct position. O(n²) time complexity."
  };

   // UI Part started 
  return (
    <div className="min-h-screen w-full bg-zinc-900 font-poppins text-white">
     {/* My header section start */}
      <div className="flex justify-center items-center p-6">
        <h1 className="bg-gradient-to-r from-green-500 to-white bg-clip-text text-transparent text-4xl font-bold tracking-tight">
        Sorting-Visualizer
        </h1>
      </div>

      <div className="max-w-5xl mx-auto p-4">
        {/* Slider Part here  */}
        <div className="bg-zinc-800/50 backdrop-blur-md border border-green-500/20 rounded-xl p-4 mb-6 shadow-lg">
          <div className="flex flex-col sm:flex-row justify-around items-center gap-6">
            <div className="w-full sm:w-1/2">
              <label className="text-sm font-medium">Array Size: {arraySize}</label>
              <input
                type="range"
                min="5"
                max="50"
                value={arraySize}
                onChange={handleArraySizeChange}
                disabled={isSorting}
                className="w-full h-2 bg-zinc-700 rounded-lg appearance-none cursor-pointer accent-green-500"
              />
            </div>
            <div className="w-full sm:w-1/2">
              <label className="text-sm font-medium">Speed (ms): {speed}</label>
              <input
                type="range"
                min="10"
                max="500"
                step="10"
                value={speed}
                onChange={handleSpeedChange}
                className="w-full h-2 bg-zinc-700 rounded-lg appearance-none cursor-pointer accent-green-500"
              />
            </div>
          </div>
        </div>

        {/* Buttons and Visualization Part*/}
        <div className="flex flex-col md:flex-row gap-6">
          {/* Control Buttons */}
          <div className="md:w-1/4 bg-zinc-800/50 backdrop-blur-md border border-green-500/20 rounded-xl p-4 shadow-lg">
            <div className="flex flex-col gap-4">
              <button
                onClick={() => checksort(bubbleSort, descriptions.bubbleSort)}
                disabled={isSorting || raceMode} // Disabled during sorting or in race mode to stop all algo before one complete
                className={`py-3 px-6 bg-gradient-to-r from-green-500 to-green-700 rounded-lg text-sm font-semibold transition-all duration-300 ${
                  isSorting || raceMode ? "opacity-50 cursor-not-allowed" : "hover:scale-105 hover:shadow-lg"
                }`}
              >
                Bubble Sort
              </button>
              <button
                onClick={() => checksort(selectionSort, descriptions.selectionSort)}
                disabled={isSorting || raceMode}
                className={`py-3 px-6 bg-gradient-to-r from-green-500 to-green-700 rounded-lg text-sm font-semibold transition-all duration-300 ${
                  isSorting || raceMode ? "opacity-50 cursor-not-allowed" : "hover:scale-105 hover:shadow-lg"
                }`}
              >
                Selection Sort
              </button>
              <button
                onClick={() => checksort(quickSort, descriptions.quickSort)}
                disabled={isSorting || raceMode}
                className={`py-3 px-6 bg-gradient-to-r from-green-500 to-green-700 rounded-lg text-sm font-semibold transition-all duration-300 ${
                  isSorting || raceMode ? "opacity-50 cursor-not-allowed" : "hover:scale-105 hover:shadow-lg"
                }`}
              >
                Quick Sort
              </button>
              <button
                onClick={() => checksort(insertionSort, descriptions.insertionSort)}
                disabled={isSorting || raceMode}
                className={`py-3 px-6 bg-gradient-to-r from-green-500 to-green-700 rounded-lg text-sm font-semibold transition-all duration-300 ${
                  isSorting || raceMode ? "opacity-50 cursor-not-allowed" : "hover:scale-105 hover:shadow-lg"
                }`}
              >
                Insertion Sort
              </button>
              <button
                onClick={startRace}
                disabled={isSorting || !raceMode}  
                className={`py-3 px-6 bg-gradient-to-r from-purple-500 to-purple-700 rounded-lg text-sm font-semibold transition-all duration-300 ${
                  isSorting || !raceMode ? "opacity-50 cursor-not-allowed" : "hover:scale-105 hover:shadow-lg"
                }`}
              >
                Start Race
              </button>
              <button
                onClick={resetSort}
                className="py-3 px-6 bg-gradient-to-r from-red-500 to-red-700 rounded-lg text-sm font-semibold transition-all duration-300 hover:scale-105 hover:shadow-lg"
              >
                Reset
              </button>
              <button
                onClick={() => setArray([...previousArray])}
                disabled={previousArray.length === 0 || isSorting}
                className={`py-3 px-6 rounded-lg text-sm font-semibold transition-all duration-300 ${
                  previousArray.length === 0 || isSorting
                    ? "bg-gray-500 opacity-50 cursor-not-allowed"
                    : "bg-gradient-to-r from-blue-500 to-blue-700 hover:scale-105 hover:shadow-lg"
                }`}
              >
                Previous Array
              </button>
              <button
                onClick={toggleRaceMode}
                className={`py-3 px-6 bg-gradient-to-r from-yellow-500 to-yellow-700 rounded-lg text-sm font-semibold transition-all duration-300 hover:scale-105 hover:shadow-lg`}
              >
                {raceMode ? "Normal Mode" : "Race Mode"} {/* Toggle text based on mode */}
              </button>
            </div>
          </div>

          {/* Visualization section start here */}
          <div className="md:w-3/4 bg-zinc-800/50 backdrop-blur-md border border-green-500/20 rounded-xl p-4 shadow-lg overflow-hidden">
            {raceMode ? (
              // Race Mode 
              <div className="flex flex-col gap-2 h-96">
                {["bubble", "selection", "quick", "insertion"].map((algo) => (
                  <div key={algo} className="flex items-end h-1/4 relative">
                    <div className="w-full flex items-end">
                      {raceArrays[algo].map((value, index) => (
                        <div
                          key={index}
                          className="flex-1 mx-[2px] rounded-t-md transition-all duration-300 ease-in-out"
                          style={{
                            height: `${(value / 100) * 80}px`, // Managing my height by array values 
                            background: isSorting ? "linear-gradient(180deg, #facc15, #f97316)" : "linear-gradient(180deg, #22c55e, #16a34a)",
                            animation: isSorting ? "pulse 0.5s infinite alternate" : "none",
                          }}
                        />
                      ))}
                    </div>
                    <span className="text-xs text-gray-300 absolute left-2 top-2">
                      {algo.charAt(0).toUpperCase() + algo.slice(1)}  
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              // Normal Mode 
              <div className="h-96 flex items-end justify-center">
                {array.map((value, index) => (
                  <div
                    key={index}
                    className="flex-1 mx-1 rounded-t-md transition-all duration-300 ease-in-out"
                    style={{
                      height: `${(value / 100) * 300}px`,  
                      background: isSorting ? "linear-gradient(180deg, #facc15, #f97316)" : "linear-gradient(180deg, #22c55e, #16a34a)",
                      animation: isSorting ? "pulse 0.5s infinite alternate" : "none",
                    }}
                  />
                ))}
              </div>
            )}
          </div>
        </div>

         
        <div className="mt-6 bg-zinc-800/50 backdrop-blur-md border border-green-500/20 rounded-xl p-4 shadow-lg text-center">
          <h2 className="text-lg font-semibold mb-2">Current Array:</h2>
          <p className="text-sm text-gray-300">{array.join(", ")}</p>  
          {raceMode && (
            <div className="mt-4">
              <h2 className="text-lg font-semibold">Race Times:</h2>
              <p className="text-sm text-gray-300">
                Bubble: {raceTimes.bubble}s | Selection: {raceTimes.selection}s | Quick: {raceTimes.quick}s | Insertion: {raceTimes.insertion}s
              </p>  
            </div>
          )}
          <div className="flex justify-center gap-6 mt-4">
            <h2 className="text-lg font-semibold animate-fade-in">Time: {timeTaken}s</h2>
            <h2 className="text-lg font-semibold animate-fade-in">Steps: {stepCount}</h2>
          </div>
          {description && <p className="mt-2 text-sm text-gray-300 animate-fade-in">{description}</p>}
        </div>
      </div>
       

      {/* Global CSS for animations and font */}
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;600&display=swap');
        .font-poppins {
          font-family: 'Poppins', sans-serif; /* Apply Poppins font globally */
        }
        @keyframes pulse {
          0% { transform: scale(1); }
          100% { transform: scale(1.05); } /* Pulse animation for bars */
        }
        @keyframes fade-in {
          from { opacity: 0; }
          to { opacity: 1; } /* Fade-in animation for stats */
        }
        .animate-fade-in {
          animation: fade-in 0.5s ease-in;
        }
      `}</style>
    </div>
  );
}

export default SortingVisualizer;  