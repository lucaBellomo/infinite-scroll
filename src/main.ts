import "./style.css";
import { fetchAllRecords, User } from "./data-service.ts";
import { setupInfiniteScroll } from "./infinite-scroll.ts";
import { toggleLoader } from "./toggle-loader.ts";

document.querySelector<HTMLDivElement>("#app")!.innerHTML = `
  <div>
    <h1>Infinite scroll</h1>
    <div id="infinite-scroll-container"></div>
  </div>
`;

// a function that takes a user and renders a div
function renderItem(user: User): HTMLDivElement {
  const div = document.createElement("div");
  div.classList.add("user-item");
  div.textContent = `User ${user.name}`;
  return div;
}

// the setup of infinite scroll
const cleanup = setupInfiniteScroll<User>({
  containerSelector: "#infinite-scroll-container",
  itemGenerator: fetchAllRecords(),
  renderItem: renderItem,
  loadMoreThreshold: 50,
});

// here we could show/hide a loader
document
  .querySelector("#infinite-scroll-container")
  ?.addEventListener("infinite-scroll-loading", (e) => {
    console.log((<CustomEvent>e).detail);
    toggleLoader((<CustomEvent>e).detail?.loading);
  });

window.addEventListener("beforeunload", () => {
  cleanup();
});
