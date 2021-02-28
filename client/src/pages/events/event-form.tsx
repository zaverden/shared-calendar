import { EventPayload } from "@shacal/ui/data-access";
import React, { FormEvent, useState } from "react";
import DatePicker from "react-datepicker";
import { getDuration, MS_IN_MINUTE } from "utils";
import { DescriptionView } from "./descriptionView";

const DEFAULT_DURATION_MIN = 60;

type EventValues = {
  summary: string;
  description: string;
  start: string;
  duration: string;
  location: string;
};

type EventFormProps = {
  event: EventPayload;
  isSaving: boolean;
  onSave: (e: EventPayload) => void;
};

export function EventForm({ event, isSaving, onSave }: EventFormProps) {
  const [startDate, setStartDate] = useState<Date | null>(
    event.start === "" ? null : new Date(event.start)
  );
  const [description, setDescription] = useState<string>(event.description);
  const [duration] = useState<number>(
    () => getDuration(event) ?? DEFAULT_DURATION_MIN
  );
  const onFormSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const target = e.target as HTMLFormElement;
    const entries = [
      "summary",
      "description",
      "start",
      "duration",
      "location",
    ].map((f) => [
      f,
      (target.elements.namedItem(f) as { value: string }).value ?? "",
    ]);
    const values = Object.fromEntries(entries) as EventValues;
    const startDate = new Date(values.start);
    const duration = parseInt(values.duration);
    const endDate = new Date(startDate.getTime() + duration * MS_IN_MINUTE);
    onSave({
      summary: values.summary,
      description: values.description,
      location: values.location,
      start: startDate.toISOString(),
      end: endDate.toISOString(),
    });
  };
  return (
    <form onSubmit={onFormSubmit}>
      <label style={{ display: "block" }}>
        Summary
        <input
          type="text"
          name="summary"
          defaultValue={event.summary}
          required
          disabled={isSaving}
        />
      </label>
      <label style={{ display: "block" }}>
        Start
        <DatePicker
          onChange={(d) => setStartDate(d as Date)}
          required
          dateFormat="Pp"
          showTimeSelect
          timeIntervals={15}
          selected={startDate}
          name="start"
          disabled={isSaving}
        />
      </label>
      <label style={{ display: "block" }}>
        Duration (minutes)
        <input
          type="number"
          name="duration"
          defaultValue={duration}
          required
          disabled={isSaving}
          step={15}
          min={15}
        />
      </label>
      <label style={{ display: "block" }}>
        Location
        <input
          type="text"
          name="location"
          defaultValue={event.location}
          disabled={isSaving}
        />
      </label>
      <label style={{ display: "block" }}>
        Description
        <textarea
          name="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
          disabled={isSaving}
        />
        <DescriptionView description={description} />
      </label>
      <button type="submit" disabled={isSaving}>
        Save
      </button>
    </form>
  );
}
