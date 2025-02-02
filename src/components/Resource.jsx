import { format, getDaysInMonth } from 'date-fns';
import { useState } from 'react'
// import Events from './Events';
import {closestCenter, DndContext, useDraggable, useDroppable} from '@dnd-kit/core'
import {arrayMove} from '@dnd-kit/sortable'

import { CSS } from "@dnd-kit/utilities";

 const allEvents = [
   {
     id: "1",
     title: "Meeting",
     date: "2025-02-12",
     resource: "C",
     color: "bg-blue-400",
   },
   {
     id: "2",
     title: "Workshop",
     date: "2025-02-07",
     resource: "A",
     color: "bg-amber-500",
   },
   {
     id: "3",
     title: "Guest CheckIn",
     date: "2025-02-03",
     resource: "G",
     color: "bg-cyan-600",
   },
   {
     id: "4",
     title: "Guest Checkout",
     date: "2025-02-24",
     resource: "E",
     color: "bg-lime-400",
   },
 ];

 const colors = [
   "bg-blue-400",
   "bg-green-500",
   "bg-yellow-600",
   "bg-purple-400",
   "bg-teal-600",
 ];

 const DraggableEvent = ({ event, onDelete }) => {
   const { attributes, listeners, setNodeRef, transform } = useDraggable({
     id: event.id,
     data: event,
   });

   const style = transform
     ? {
         transform: CSS.Transform.toString(transform),
         zIndex: 10,
       }
     : undefined;

   let isDragging = false;
   const handleDelete = (e) => {
     alert("Want's to delete Event ?")
     if (!isDragging) {
       onDelete(event.id);
     }
   };

   return (
     <div
       ref={setNodeRef}
       {...attributes}
       {...listeners}
       className={`${event.color} absolute m-0 p-1 rounded cursor-move w-auto h-14 draggable-event`}
       style={style}
     >
       <div className="text-xm">{event.title}</div>
       <button
         className="text-lg font-bold cursor-pointer hover:text-red-700 z-100"
         onMouseDown={(e) => {
          //  isDragging = false; // Reset dragging state
           console.log("on mouse down");
         }}
         onMouseUp={handleDelete}
       >
         ✕
       </button>
     </div>
   );
 };


 const DroppableCell = ({ date, resource, children }) => {
   const { setNodeRef } = useDroppable({
     id: `${date}-${resource}`,
     data: { date, resource },
   });

   return (
     <div ref={setNodeRef} className="h-full w-full">
       {children}
     </div>
   );
 };

const Resource = ({ currentDate }) => {
  const [resources, setResources] = useState(["A", "B", "C", "D", "E", "F", "G", "H"])
  const [event,setEvent] = useState(allEvents)
  const [selecting, setSelecting] = useState(false);
  const [selectionStart, setSelectionStart] = useState(null);

  const daysInMonth = getDaysInMonth(currentDate);
  console.log("number of days",daysInMonth);
  console.log("current date",currentDate);
  console.log("selection",selecting);
  console.log("selection start", selectionStart);
  console.log("myeventArray",event)



  const addResource = () => {
    const resource = prompt("Add Your Resource here...")
    if(resource){setResources([...resources,resource])}
  }

  const handleSelectionStart = (date,resources,e) =>{
    if (e.button !== 0 || e.target.closest(".draggable-event")) return;
    setSelecting(true);
    setSelectionStart({date,resources});
  }

  const handleSelectionEnd = () =>{
    if(!selecting) return;
    setSelecting(false);
    
    const title = prompt("Add your Event here...");
    if (!title) return;
    
    const newEvent = {
      id: String(Date.now()),
      title,
      date: selectionStart.date,
      resource: selectionStart.resources,
      color: colors[event.length % colors.length],
    };
    
    setEvent([...event,newEvent])
  }

  const handleDragEnd = ({ active, over }) => {
    if (!over) return;
    const lastHyphenIndex = over.id.lastIndexOf("-");
    const newDate = over.id.substring(0, lastHyphenIndex);
    const newResource = over.id.substring(lastHyphenIndex + 1);
    console.log("newPosition", newDate)
    console.log("newResource", newResource);

    setEvent((prevEvents) =>
      prevEvents.map((event) =>
        event.id === active.id
          ? { ...event, date: newDate, resource: newResource }
          : event
      )
    );
  };

  // event delete function
    const handleDelete = (eventId) => {
    setEvent(event.filter((event) => event.id !== eventId));
    };



  return (
    <div className="flex">
      <div className="w-24">
        <div className="h-21 p-2 pl-3 block text-white items-center justify-center font-bold border-b border-gray-600">
          <p>Resources</p>
          <button
            onClick={addResource}
            className="cursor-pointer text-2xl text-white hover:text-red-300"
          >
            +
          </button>
        </div>

        {resources.map((resource, resocurceidx) => (
          <>
            <div
              key={resocurceidx}
              className="h-16 w-24 text-white flex items-center justify-center border-b border-gray-600"
            >
              {resource}
            </div>
          </>
        ))}
      </div>

      <div className="flex-1 overflow-hidden">
        <div
          className="grid text-white border-gray-600"
          style={{
            gridTemplateColumns: `repeat(${daysInMonth}, minmax(0,1fr))`,
          }}
        >
          {Array.from({ length: daysInMonth }).map((_, idx) => {
            const date = new Date(
              currentDate.getFullYear(),
              currentDate.getMonth(),
              idx + 1
            );
            const day = format(date, "EEE");
            const dates = idx + 1;

            const todayDate =
              date.getDate() === currentDate.getDate() &&
              date.getMonth() === currentDate.getMonth() &&
              date.getFullYear() === currentDate.getFullYear();

            return (
              <div
                key={idx}
                className={`grid p-2 h-21 text-center border-l text-white border-b border-gray-600 gap-0.5 ${
                  todayDate ? " bg-red-400 rounded text-white" : ""
                }`}
              >
                <div>{dates}</div>
                <div className="text-sm">{day}</div>
              </div>
            );
          })}

          <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
            {resources.map((resource) => (
              <>
                {Array.from({ length: daysInMonth }).map((_, idx) => {
                  const date = format( new Date(
                    currentDate.getFullYear(),
                    currentDate.getMonth(),
                    idx+1
                  ),"yyyy-MM-dd");
                  // const day = format(date, "EEE");
                  // const dates = idx + 1;
                  // console.log("my formated date", date)
                  const cellEvents = event.filter(
                    (event) =>
                      event.date === date && event.resource === resource
                  );


                  return (
                    <div
                      key={idx}
                      className="p-2 h-16 w-24 text-center flex border-l border-b text-white border-gray-600"
                      onMouseDown={(e) => handleSelectionStart(date, resource,e)}
                      onMouseUp={(e) => handleSelectionEnd(date, resource,e)}
                    >
                      {/* <div className="text-xs text-white p-1"></div> */}
                      <DroppableCell date={date} resource={resource}>
                        {cellEvents.map((event) => (
                          <DraggableEvent key={event.id} event={event} 
                            onDelete={handleDelete}
                          />
                        ))}
                      </DroppableCell>
                    </div>
                  );
                })}
              </>
            ))}
          </DndContext>
        </div>
      </div>
    </div>
  );
};

export default Resource
