import { API } from "aws-amplify";

export function loadEntities() {
  return API.get("branches", "/entities", {});
}