import localforage from "localforage";
import { matchSorter } from "match-sorter";
import sortBy from "sort-by";

export async function getPlaces(query) {
  await fakeNetwork(`getPlaces:${query}`);
  let places = await localforage.getItem("places");
  if (!places) places = [];
  if (query) {
    places = matchSorter(places, query, { keys: ["first", "last"] });
  }
  return places.sort(sortBy("last", "createdAt"));
}

export async function createPlace() {
  await fakeNetwork();
  let id = Math.random().toString(36).substring(2, 9);
  let place = { id, createdAt: Date.now() };
  let places = await getPlaces();
  places.unshift(place);
  await set(places);
  return place;
}

export async function getPlace(id) {
  await fakeNetwork(`place:${id}`);
  let places = await localforage.getItem("places");
  let place = places.find(place => place.id === id);
  return place ?? null;
}

export async function updatePlace(id, updates) {
  await fakeNetwork();
  let places = await localforage.getItem("places");
  let place = places.find(place => place.id === id);
  if (!place) throw new Error("No place found for", id);
  Object.assign(place, updates);
  await set(places);
  return place;
}

export async function deletePlace(id) {
  let places = await localforage.getItem("places");
  let index = places.findIndex(place => place.id === id);
  if (index > -1) {
    places.splice(index, 1);
    await set(places);
    return true;
  }
  return false;
}

function set(places) {
  return localforage.setItem("places", places);
}

// fake a cache so we don't slow down stuff we've already seen
let fakeCache = {};

async function fakeNetwork(key) {
  if (!key) {
    fakeCache = {};
  }

  if (fakeCache[key]) {
    return;
  }

  fakeCache[key] = true;
  return new Promise(res => {
    setTimeout(res, Math.random() * 800);
  });
}