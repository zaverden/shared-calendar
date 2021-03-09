import styled from "@emotion/styled";
import React from "react";
import ReactDatePicker, { ReactDatePickerProps } from "react-datepicker";
import { Input } from "./input";

const DatePickerStyleWrapper = styled.div`
  width: 100%;
  box-sizing: border-box;

  & .react-datepicker {
    font-size: 0.8em;
  }

  & .react-datepicker__current-month,
  & .react-datepicker-time__header,
  & .react-datepicker-year-header {
    font-size: 1em;
  }

  & .react-datepicker-wrapper {
    width: 100%;
    box-sizing: border-box;
  }

  & .react-datepicker__day--selected {
    background-color: var(--bg-p);
  }

  &
    .react-datepicker__time-container
    .react-datepicker__time
    .react-datepicker__time-box
    ul.react-datepicker__time-list
    li.react-datepicker__time-list-item {
    height: auto;
    &--selected {
      background-color: var(--bg-p);
    }
  }

  &
    .react-datepicker__time-container
    .react-datepicker__time
    .react-datepicker__time-box,
  & .react-datepicker__time-container {
    width: auto;
  }
`;

const StyledDatePicker = Input.withComponent(ReactDatePicker);

export function DatePicker(props: ReactDatePickerProps) {
  return (
    <DatePickerStyleWrapper>
      <StyledDatePicker {...props} />
    </DatePickerStyleWrapper>
  );
}
