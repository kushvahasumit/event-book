import { getDay, getDaysInMonth, startOfMonth,isToday } from 'date-fns';
import React from 'react'



const Calendar = ({ currentDate, onDateChange, today, prev,next }) => {
  const daysOfWeek = ["Sun","Mon","Tue", "Wed","Thu","Fri","Sat"];

  const firstDay = getDay(startOfMonth(currentDate));
  console.log("firstDay", firstDay);
  const daysInMonth = getDaysInMonth(currentDate);

  const handleDateSelect = (day) =>{
    const selectedDate = new Date(currentDate.getFullYear(),currentDate.getMonth(),day);
    console.log("i selected this date",selectedDate)
    onDateChange(selectedDate);
  }



  return (
    <>
      <div className="absolute top-12 left-4 bg-stone-700 p-4 rounded">
        {/* current Date */}
        <div className="flex justify-between items-center">
          <button  className="text-red-400 text-3xl hover:cursor-pointer hover:text-red-500  " onClick={prev}
          >
            &lt;
          </button>
          <div className="text-xl font-bold text-red-400">{`${today}`}</div>
          
            <button
              className="text-red-400 text-3xl hover:cursor-pointer hover:text-red-500"
              onClick={next}
            >
              &gt;
            </button>
        </div>

        {/* Days of Month by using above Array */}
        <div className='gap-2 grid grid-cols-7 font-bold text-red-400 text-center m-1'>
          {daysOfWeek.map((day)=> (
            <div key={day} >
              {day}
            </div>
          ))}
        </div>

        {/* total days of the month */}
        <div className='grid grid-cols-7 gap-2'>
          {/* empty box */}
          {Array.from({length: firstDay}).map( ( _,idx) => (
            <div key={idx} className=''></div>
          ))}

          {/* days of month */}
          {Array.from({length:daysInMonth}).map((_,idx)=>{
            const todaysDate = idx +1;
            return (
              <button
                key={todaysDate}
                className={`p-1 rounded ${
                  isToday(
                    new Date(
                      currentDate.getFullYear(),
                      currentDate.getMonth(),
                      todaysDate
                    )
                  )
                    ? "bg-red-500 text-white"
                    : "bg-stone-600 text-red-400"
                } hover:bg-red-500 hover:text-white hover:cursor-pointer`}
                 onClick={() => handleDateSelect(todaysDate)}
              >
                {todaysDate}
              </button>
            );
          }) }


        </div>
      </div>
    </>
  );
};

export default Calendar
