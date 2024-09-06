import "./style.css";
import { fetchAllRecords, User } from "./data-service.ts";
import { setupInfiniteScroll } from "./infinite-scroll.ts";

document.querySelector<HTMLDivElement>("#app")!.innerHTML = `
  <div>
    <h1>Infinite scroll</h1>
    <div id="infinite-scroll-container"></div>
  </div>
`;

function renderItem(user: User): HTMLDivElement {
  const div = document.createElement("div");
  div.classList.add("user-item");
  div.textContent = `User ${user.name}`;
  return div;
}

const cleanup = setupInfiniteScroll<User>({
  containerSelector: "#infinite-scroll-container",
  itemGenerator: fetchAllRecords(),
  renderItem: renderItem,
  loadMoreThreshold: 300,
});

window.addEventListener("beforeunload", () => {
  cleanup();
});
