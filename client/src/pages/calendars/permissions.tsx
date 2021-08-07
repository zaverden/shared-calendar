import { useSaveShacalPermissions } from "hooks/useSaveShacalPermissions";
import React, { ChangeEvent, useState } from "react";
import {Button, Input, LinkButton} from "@shacal/ui/kit";
import styled from "@emotion/styled";

type PermissionsProps = {
  publicId: string;
  addPermissionGrantedTo: string[];
  isFetching: boolean;
};

const EmailInput = styled(Input)`
  display: block;
  margin-bottom: 12px;
`;

const ButtonSave = styled(Button)`
  background-color: var(--bg-s);
  margin-top: 16px;
  max-width: 112px;
`;

export function Permissions({
  addPermissionGrantedTo,
  publicId,
  isFetching,
}: PermissionsProps) {
  const [list, setList] = useState([...addPermissionGrantedTo, ""]);
  const save = useSaveShacalPermissions();
  const onChange = (i: number) => (event: ChangeEvent<HTMLInputElement>) => {
    const newList = [...list];
    newList[i] = event.target.value;
    if (newList[newList.length - 1] !== "") {
      newList.push("");
    }
    setList(newList);
  };
  const onSaveClick = () => {
    save.mutate({
      publicId,
      addPermissionGrantedTo: list.map((p) => p.trim()).filter((p) => p !== ""),
    });
  };
  return (
    <details style={{ margin: '16px 0 20px' }}>
      <summary>Granted add permission</summary>
      {list.map((p, i) => (
        <EmailInput
          key={i}
          type="text"
          value={p}
          onChange={onChange(i)}
          disabled={isFetching || save.isLoading}
        />
      ))}
      <ButtonSave
        type="button"
        disabled={isFetching || save.isLoading}
        onClick={onSaveClick}
      >
        Save
      </ButtonSave>
    </details>
  );
}