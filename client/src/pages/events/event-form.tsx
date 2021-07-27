import "react-quill/dist/quill.snow.css";
import React, { FormEvent, useState } from "react";
import ReactQuill from "react-quill";
import { EventPayload } from "@shacal/ui/data-access";
import { DatePicker, Input } from "@shacal/ui/kit";
import { getDuration, MS_IN_MINUTE } from "utils";

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

const modules = {
  toolbar: [
    ["clean"],
    ["bold", "italic", "underline"],
    ["link"],
    [{ list: "ordered" }, { list: "bullet" }],
  ],
  clipboard: {
    // toggle to add extra line breaks when pasting HTML:
    matchVisual: false,
  },
};
const formats = [
  "bold",
  "italic",
  "underline",
  "link",
  "list",
  "bullet",
  "indent",
];

export function EventForm({ event, isSaving, onSave }: EventFormProps) {
  const [startDate, setStartDate] = useState<Date | null>(
      event.start === "" ? null : new Date(event.start)
  );
  const [description, setDescription] = useState<string>(event.description);
  const [defaultDuration] = useState(
      () => getDuration(event) || DEFAULT_DURATION_MIN
  );
  const onFormSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (startDate == null) {
      return;
    }
    const entries = ["summary", "duration", "location"].map((f) => [
      f,
      (e.currentTarget.elements.namedItem(f) as { value: string }).value ?? "",
    ]);
    const values = Object.fromEntries(entries) as EventValues;
    const duration = parseInt(values.duration, 10);
    const endDate = new Date(startDate.getTime() + duration * MS_IN_MINUTE);
    onSave({
      summary: values.summary,
      description,
      location: values.location,
      start: startDate.toISOString(),
      end: endDate.toISOString(),
    });
  };
  return (
      <form onSubmit={onFormSubmit}>
        Summary
        <Input
            type="text"
            name="summary"
            defaultValue={event.summary}
            required
            autoComplete="off"
            disabled={isSaving}
        />
        <label style={{ display: "block" }}>
          Start
          <DatePicker
              onChange={(d) => setStartDate(d as Date)}
              required
              autoComplete="off"
              dateFormat="PPp"
              showTimeSelect
              timeIntervals={15}
              selected={startDate}
              name="start"
              disabled={isSaving}
          />
        </label>
        <label style={{ display: "block" }}>
          Duration (minutes)
          <Input
              type="number"
              name="duration"
              defaultValue={defaultDuration}
              required
              autoComplete="off"
              disabled={isSaving}
              step={15}
              min={15}
          />
        </label>
        <label style={{ display: "block" }}>
          Location
          <Input
              type="text"
              name="location"
              autoComplete="off"
              defaultValue={event.location}
              disabled={isSaving}
          />
        </label>
        <div>
          Description
          <ReactQuill
              theme="snow"
              placeholder="Describe an event"
              modules={modules}
              formats={formats}
              value={description}
              onChange={setDescription}
          />
        </div>
        <button type="submit" disabled={isSaving}>
          Save
        </button>
      </form>
  );
}
