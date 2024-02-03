import { useEffect } from "react";

import { Outlet, NavLink, useLoaderData, Form, redirect, useNavigation, useSubmit } from "react-router-dom";
import { getPlaces, createPlace } from "../places";

export async function loader({ request }) {
  const url = new URL(request.url);
  const q = url.searchParams.get("q");
  const places = await getPlaces(q);
  return { places, q };
}

export async function action() {
    const place = await createPlace();
    return redirect(`/places/${place.id}/edit`);
}
  

export default function Root() {
    const {places, q} = useLoaderData()
    const navigation = useNavigation();
    const submit = useSubmit();

    useEffect(() => {
      document.getElementById("q").value = q;
    }, [q]);

    const searching = navigation.location && new URLSearchParams(navigation.location.search).has("q");

    return (
      <>
        <div id="sidebar">
          <h1>The Soft Guide</h1>
          <div>
            <Form id="search-form" role="search">
              <input
                id="q"
                className={searching ? "loading" : ""}
                aria-label="Search places"
                placeholder="Search"
                type="search"
                name="q"
                defaultValue={q}
                onChange={(event) => {
                  const isFirstSearch = q == null;
                  submit(event.currentTarget.form, {
                    replace: !isFirstSearch,
                  });
                }}
              />
              <div
                id="search-spinner"
                aria-hidden
                hidden={!searching}
              />
              <div
                className="sr-only"
                aria-live="polite"
              ></div>
            </Form>
            <Form method="post">
                <button type="submit">New</button>
            </Form>
          </div>
          <nav>
            {places.length ? (
              <ul>
                  {places.map((place) => (
                    <li key={place.id}>
                      <NavLink
                        to={`places/${place.id}`}
                        className={({ isActive, isPending }) =>
                          isActive
                            ? "active"
                            : isPending
                            ? "pending"
                            : ""
                        }
                      >
                      {place.first || place.last ? (
                        <>
                            {place.first} {place.last}
                        </>
                        ) : (
                        <i>No Name</i>
                        )}{" "}
                        {place.favorite && <span>★</span>}
                      </NavLink>
                    </li>
                  ))}
              </ul>
            ) : (
                <p>
                    <i>No places</i>
                </p>
            )}
          </nav>
        </div>
        <div 
          id="detail"
          className={
            navigation.state === "loading" ? "loading" : ""
          }
        >
          <Outlet />
        </div>
      </>
    );
}