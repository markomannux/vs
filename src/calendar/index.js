import PageController from '../common/page-controller'
import { Calendar } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';

class CalendarIndexController extends PageController {
    setUp() {
        var calendarEl = document.getElementById('calendar');

        var calendar = new Calendar(calendarEl, {
            plugins: [ dayGridPlugin ],
            events: '/calendar',
            eventDataTransform: function(eventData) {
                return {
                    title: `${eventData.contact.fullName} - ${eventData.summary}`,
                    start: eventData.start,
                    end: eventData.end
                }
            }

        });

        calendar.render(); 
    }

    tearDown() {

    }
}

new CalendarIndexController('calendar-index')