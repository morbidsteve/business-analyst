"use client"

import { useState } from "react"
import { Calendar as BigCalendar, momentLocalizer } from "react-big-calendar"
import moment from "moment"
import "react-big-calendar/lib/css/react-big-calendar.css"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogClose } from "@/components/ui/dialog"

moment.locale("en-GB")
const localizer = momentLocalizer(moment)

type CalendarEvent = {
    id: string
    title: string
    start: Date
    end: Date
}

export function Calendar() {
    const [events, setEvents] = useState<CalendarEvent[]>([])
    const [newEvent, setNewEvent] = useState<Partial<CalendarEvent>>({})
    const [isDialogOpen, setIsDialogOpen] = useState(false)

    const handleSelectSlot = ({ start, end }: { start: Date; end: Date }) => {
        setNewEvent({ start, end })
        setIsDialogOpen(true)
    }

    const handleAddEvent = () => {
        if (newEvent.title && newEvent.start && newEvent.end) {
            setEvents([...events, { ...newEvent, id: Date.now().toString() } as CalendarEvent])
            setNewEvent({})
            setIsDialogOpen(false)
        }
    }

    const handleSelectEvent = (event: CalendarEvent) => {
        const confirmDelete = window.confirm(`Do you want to delete the event '${event.title}'?`)
        if (confirmDelete) {
            setEvents(events.filter((e) => e.id !== event.id))
        }
    }

    return (
        <div className="h-[calc(100vh-200px)] bg-white">
            <BigCalendar
                localizer={localizer}
                events={events}
                startAccessor="start"
                endAccessor="end"
                onSelectSlot={handleSelectSlot}
                onSelectEvent={handleSelectEvent}
                selectable
                style={{ height: "100%" }}
            />
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogTrigger asChild>
                    <Button className="mt-4">Add Event</Button>
                </DialogTrigger>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Add New Event</DialogTitle>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="title" className="text-right">
                                Title
                            </Label>
                            <Input
                                id="title"
                                value={newEvent.title || ""}
                                onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
                                className="col-span-3"
                            />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="start" className="text-right">
                                Start
                            </Label>
                            <Input
                                id="start"
                                type="datetime-local"
                                value={newEvent.start ? moment(newEvent.start).format("YYYY-MM-DDTHH:mm") : ""}
                                onChange={(e) => setNewEvent({ ...newEvent, start: new Date(e.target.value) })}
                                className="col-span-3"
                            />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="end" className="text-right">
                                End
                            </Label>
                            <Input
                                id="end"
                                type="datetime-local"
                                value={newEvent.end ? moment(newEvent.end).format("YYYY-MM-DDTHH:mm") : ""}
                                onChange={(e) => setNewEvent({ ...newEvent, end: new Date(e.target.value) })}
                                className="col-span-3"
                            />
                        </div>
                    </div>
                    <DialogClose asChild>
                        <Button onClick={handleAddEvent}>Add Event</Button>
                    </DialogClose>
                </DialogContent>
            </Dialog>
        </div>
    )
}

