import { redirect } from "react-router-dom";
import { deletePlace} from "../places";

export async function action({ params }) {
  await deletePlace(params.placeId);
  return redirect("/");
}