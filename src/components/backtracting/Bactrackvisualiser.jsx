import React from 'react'

function Bactrackvisualiser() {

    const [array,setArray] = useState(randomArray(10));

    function randomArray(size){
        const arr = [];
        for(let i=0; i<size; i++){
            arr.push(Math.floor(Math.random() * 100) + 1);
        }
        return arr;
    }

    


    // 


  return (
     <div className="h-screen w-full bg-zinc-800">
       

      <div className="flex justify-center items-center">
        <h1 className="bg-gradient-to-r from-green-500 to-white bg-clip-text text-transparent p-2 rounded-xl font-extrabold text-3xl">
          Backtracking Visualiser
        </h1>
      </div>

      <div className="h-[80%] w-[90%] sm:w-[80%] md:w-[70%] flex flex-wrap items-center mx-auto mt-5 border rounded-xl border-green-200">
        <div className="h-full w-full sm:w-[30%] md:w-[20%] flex justify-center flex-col gap-5 items-center">
            <button  className="cursor-pointer font-semibold bg-gradient-to-r from-red-400 to-white h-14 w-38 rounded-2xl m-1 ml-2">
              RESET HERE 
            </button>
        </div>

        <div className="h-[100%] w-full sm:w-[70%] flex justify-evenly  0 items-center">
        <div className="h-full  flex justify-evenly bg-blue-400 items-center">


        </div>
        </div>
        
      </div>

         
    </div>

       
      

     
  )
}

export default Bactrackvisualiser