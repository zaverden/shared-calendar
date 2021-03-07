import { useParams } from "react-router-dom";

export function usePublicIdParam(): string {
  const { publicId } = useParams<{ publicId: string }>();
  return publicId;
}
