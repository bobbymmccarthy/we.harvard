import React from 'react'

const findAvail = (meetingPatterns) => {
    const days = []
    if(meetingPatterns.meetsOnMonday){
        days.push('M');
    }
    if(meetingPatterns.meetsOnTuesday){
        days.push('T');
    }
    if(meetingPatterns.meetsOnWednesday){
        days.push('W');
    }
    if(meetingPatterns.meetsOnThursday){
        days.push('Th');
    }
    if(meetingPatterns.meetsOnFriday){
        days.push('F');
    }
    return days.join(',')
}

const Class = ({classInfo}) => {

    return (
        <div>
            <p> {classInfo.title} </p>
            <p> {classInfo.meetingPatterns.length != 0 ? findAvail(classInfo.meetingPatterns[0]) : 'TBA'} </p>

            {classInfo.meetingPatterns.length != 0 && <p> {classInfo.meetingPatterns[0].startTime} - {classInfo.meetingPatterns[0].endTime}</p>}
        </div>
    )
}

export default Class