import { useState } from "react";

const CalenderApp = () => {
  const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const monthsOfYear = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const currentDate = new Date();

  const [currentMonth, setCurrentMonth] = useState(currentDate.getMonth());
  const [currentYear, setCurrentYear] = useState(currentDate.getFullYear());

  const [selectedDate, setSelectedDate] = useState(currentDate);

  const [showEventPopup, setShowEventPopup] = useState(false);
  const [events, setEvents] = useState([]); // State to hold events

  const [eventTime, setEventTime] = useState({
    hours: "00",
    minutes: "00",
  });
  const [eventText, setEventText] = useState("");
  const [editingEvent,setEditingEvent] = useState(null);

  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();

  const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay();

  const prevMonths = () => {
    setCurrentMonth((prevMonth) => {
      if (prevMonth === 0) {
        setCurrentYear((prevYear) => prevYear - 1);
        return 11; // December
      }
      return prevMonth - 1;
    });
  };

  const nextMonths = () => {
    setCurrentMonth((prevMonth) => {
      if (prevMonth === 11) {
        setCurrentYear((prevYear) => prevYear + 1);
        return 0; // January
      }
      return prevMonth + 1;
    });
  };

  const handleDayClick = (day) => {
    const clickedDate = new Date(currentYear, currentMonth, day);
    const today = new Date();

    if (clickedDate >= today || isSameday(clickedDate, today)) {
      setSelectedDate(clickedDate);
      setShowEventPopup(true);
      setEventTime({
        hours: "00",
        minutes: "00",
      });
      setEventText("");
      setEditingEvent(null);
    }
  };

  const isSameday = (date1, date2) => {
    return (
      date1.getFullYear() === date2.getFullYear() &&
      date1.getMonth() === date2.getMonth() &&
      date1.getDate() === date2.getDate()
    );
  };

  const handleEventSubmit = () => {
    const newEvent = {
      id: editingEvent ? editingEvent.id : Date.now(),
      date: selectedDate.toISOString(),
      time: `${eventTime.hours.padStart(2, "0")}:${eventTime.minutes.padStart(2, "0")}`,
      text: eventText,
    };

    let updatedEvent = [...events]
    if(editingEvent){
      updatedEvent = updatedEvent.map((event)=>
        event.id === editingEvent.id ? newEvent :  event,
      )
    }
    else{
      updatedEvent.push(newEvent)
    }
    updatedEvent.sort((a,b)=> new Date(a.date) - new Date(b.date))

    setEvents(updatedEvent);
    setEventTime({ hours: "00", minutes: "00" });
    setEventText("");
    setShowEventPopup(false);
    setEditingEvent(null);
  };

  const handleEditEvent = (event) => {
    setSelectedDate(new Date(event.date));
    setEventTime({
      hours: event.time.split(":")[0],
      minutes: event.time.split(":")[1],
    });
    setEventText(event.text);
    setEditingEvent(event);
    setShowEventPopup(true);
  };

  const handleDeleteEvent = (eventId)=>{
      const updatedEvent = events.filter((event)=> event.id != eventId);
      setEvents(updatedEvent)
  }

const handleTimeChange = (e)=>{
  const {name,value} = e.target;

  setEventTime((prevTime)=>({...prevTime, [name]: value.padStart(2,'0')}))
}

  return (
    <div className="calender-app">
      <div className="calender">
        <h1 className="heading">Calender</h1>
        <div className="navigate-date">
          <h2 className="month">{monthsOfYear[currentMonth]}</h2>
          <h2 className="year">{currentYear}</h2>
          <div className="buttons">
            <i className="bx bx-chevron-left" onClick={prevMonths}></i>
            <i className="bx bx-chevron-right" onClick={nextMonths}></i>
          </div>
        </div>
        <div className="weekdays">
          {daysOfWeek.map((day, index) => (
            <span key={index}>{day}</span>
          ))}
        </div>
        <div className="days">
          {[...Array(firstDayOfMonth).keys()].map((_, index) => (
            <span key={`empty-${index}`} />
          ))}
          {[...Array(daysInMonth).keys()].map((day, index) => (
            <span
              key={day + 1}
              className={
                day + 1 === currentDate.getDate() &&
                currentMonth === currentDate.getMonth() &&
                currentYear === currentDate.getFullYear()
                  ? "current-day"
                  : ""
              }
              onClick={() => handleDayClick(day + 1)}
            >
              {day + 1}
            </span>
          ))}
        </div>
      </div>
      <div className="events">
        {showEventPopup && (
          <div className="events-popup">
            <div className="time-inputs">
              <div className="events-popup-time">Time</div>
              <input
                type="number"
                name="hours"
                min={0}
                max={24}
                className="hours"
                value={eventTime.hours}
                onChange={handleTimeChange
                }
              />
              <input
                type="number"
                name="minutes"
                min={0}
                max={59}
                className="minutes"
                value={eventTime.minutes}
                onChange={
                  handleTimeChange
                }
              />
            </div>
            <textarea
              placeholder="Enter Events Text(Maximum 60 Characters)"
              value={eventText}
              onChange={(e) => {
                if (e.target.value.length <= 60) {
                  setEventText(e.target.value);
                }
              }}
            ></textarea>
            <button className="event-popup-btn"
            onClick={handleEventSubmit}
            >{editingEvent?"Update Event":"Add Event"}</button>
            <button
              className="close-event-popup"
              onClick={() => setShowEventPopup(false)}
            >
              <i className="bx bx-x"></i>
            </button>
          </div>
        )}
        {events.map((event, index) => {
          const eventDate = new Date(event.date);
          return (
            <div className="event" key={event.id}>
              <div className="event-date-wrapper">
                <div className="event-date">{`${monthsOfYear[eventDate.getMonth()]} ${eventDate.getDate()}, ${eventDate.getFullYear()}`}</div>
                <div className="event-time">{event.time}</div>
              </div>
              <div className="event-text">{event.text}</div>
              <div className="event-buttons">
                <i className="bx bxs-edit-alt" onClick={() => handleEditEvent(event)}></i>
                <i className="bx bxs-message-alt-x" onClick={()=>handleDeleteEvent(event.id)}></i>
        </div>
              </div>
          );
        })}
      </div>
    </div>
  );
};
export default CalenderApp;
