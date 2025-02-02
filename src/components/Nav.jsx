import{ useState } from "react";
import { addMonths, format, subMonths } from "date-fns"
import Calendar from "./Calendar";
import Resource from "./Resource";

const Navbar = () => {
    const [date,setDate] = useState(new Date());
    const [calendar,showCalendar] = useState(false);


    const formatedDate = format(date,"MMMM yyyy")
    console.log("date",formatedDate)

    // previous & next month
    const previousMonth = () => setDate((prev)=> subMonths(prev,1) );
    const nextMonth = () => setDate((next)=> addMonths(next,1) );
    const todayDate = () => setDate(new Date())

    // handlecalender
    const handleCalendar = (date) =>{
        setDate(date);
        showCalendar(false);
    }

  return (
    <div className="relative">
      <div className="flex justify-between items-center bg-stone-800 p-2 px-6 text-red-500 ">
        {/* month section */}
        <section>
          <div
            className="text-xl font-bold hover:cursor-pointer hover:text-red-400"
            onClick={() => showCalendar(!calendar)}
          >
            {`${formatedDate}`}
          </div>
        </section>

        {/* date section*/}
        <section>
          <div className="flex items-center gap-2 font-bold text-xl">
            <button
              className="hover:cursor-pointer hover:text-red-400  "
              onClick={previousMonth}
            >
              &lt;
            </button>
            <button
              className="hover:cursor-pointer hover:text-red-400"
              onClick={todayDate}
            >
              Today
            </button>
            <button
              className="hover:cursor-pointer hover:text-red-400"
              onClick={nextMonth}
            >
              &gt;
            </button>
          </div>
        </section>
      </div>

      {/* calender */}
      {calendar && (
        <div className="">
          <Calendar
            currentDate={date}
            onDateChange={handleCalendar}
            today={formatedDate}
            prev={previousMonth}
            next={nextMonth}
          />
        </div>
      )}

      <Resource currentDate={date} />
    </div>
  );
};

export default Navbar;
