"use client"

import { useState } from "react"

interface Event {
  id: string
  title: string
  time: string
  description?: string
  priority?: "high" | "medium" | "low"
}

export const useEventsDialog = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)
  const [selectedEvents, setSelectedEvents] = useState<Event[]>([])

  const openDialog = (date: Date, events: Event[]) => {
    setSelectedDate(date)
    setSelectedEvents(events)
    setIsOpen(true)
  }

  const closeDialog = () => {
    setIsOpen(false)
    setSelectedDate(null)
    setSelectedEvents([])
  }

  return {
    isOpen,
    selectedDate,
    selectedEvents,
    openDialog,
    closeDialog,
  }
}
