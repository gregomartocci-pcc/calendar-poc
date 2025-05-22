import { Draggable } from '@fullcalendar/interaction';

declare global {
    interface Window {
        FullCalendar?: {
            Draggable: typeof Draggable;
        };
    }

    // Extensión de HTMLElement para el draggable de FullCalendar
    interface HTMLElement {
        _draggable?: any;
    }
}

export { };