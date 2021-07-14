import { useSaveShacalPermissions } from "hooks/useSaveShacalPermissions";
import React, { ChangeEvent, useState } from "react";
import { Button, Input } from "@shacal/ui/kit";

type PermissionsProps = {
  publicId: string;
  addPermissionGrantedTo: string[];
  isFetching: boolean;
};

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
        <Input
          key={i}
          type="text"
          value={p}
          onChange={onChange(i)}
          disabled={isFetching || save.isLoading}
          style={{ display: "block", marginBottom: "12px" }}
        />
      ))}
      <Button
        type="button"
        disabled={isFetching || save.isLoading}
        onClick={onSaveClick}
        style={{ backgroundColor: "#515151", marginTop: "16px", maxWidth: "112px" }}
      >
        Save
      </Button>
    </details>
  );
}