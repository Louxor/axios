import { Form, useLoaderData, useFetcher } from "react-router-dom";
import { getPlace, updatePlace } from "../places";

export async function loader({ params }) {
  const place = await getPlace(params.placeId);
  if (!place) {
    throw new Response("", {
      status: 404,
      statusText: "Not Found",
    });
  }
  return { place };
}

export async function action({ request, params }) {
  let formData = await request.formData();
  return updatePlace(params.placeId, {
    favorite: formData.get("favorite") === "true",
  });
}

export default function Place() {
  const { place } = useLoaderData();

  return (
    <div id="place">
      <div>
        <img
          key={place.avatar}
          src={place.avatar || null}
        />
      </div>

      <div>
        <h1>
          {place.first || place.last ? (
            <>
              {place.first} {place.last}
            </>
          ) : (
            <i>No Name</i>
          )}{" "}
          <Favorite place={place} />
        </h1>

        {place.twitter && (
          <p>
            <a
              target="_blank"
              href={`https://twitter.com/${place.twitter}`} rel="noreferrer"
            >
              {place.twitter}
            </a>
          </p>
        )}

        {place.notes && <p>{place.notes}</p>}

        <div>
          <Form action="edit">
            <button type="submit">Edit</button>
          </Form>
          <Form
            method="post"
            action="destroy"
            onSubmit={(event) => {
              if (
                !confirm(
                  "Please confirm you want to delete this record."
                )
              ) {
                event.preventDefault();
              }
            }}
          >
            <button type="submit">Delete</button>
          </Form>
        </div>
      </div>
    </div>
  );
}

// eslint-disable-next-line react/prop-types
function Favorite({ place }) {
  const fetcher = useFetcher();
    // eslint-disable-next-line react/prop-types
  let favorite = place.favorite;
  if (fetcher.formData) {
    favorite = fetcher.formData.get("favorite") === "true";
  }
  // yes, this is a `let` for later
  return (
    <fetcher.Form method="post">
      <button
        name="favorite"
        value={favorite ? "false" : "true"}
        aria-label={
          favorite
            ? "Remove from favorites"
            : "Add to favorites"
        }
      >
        {favorite ? "★" : "☆"}
      </button>
    </fetcher.Form>
  );
}