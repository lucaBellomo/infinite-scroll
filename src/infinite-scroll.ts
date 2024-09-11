export interface InfiniteScrollConfig<T> {
  containerSelector: string;
  itemGenerator: AsyncGenerator<{ data: T[]; done: boolean }, void, unknown>;
  renderItem: (items: T) => HTMLElement;
  loadMoreThreshold?: number;
}

/**
 * Creates a generic infinite scroll setup
 * @param {InfiniteScrollConfig} config - Configuration object for the infinite scroll
 * @returns A cleanup function to remove the scroll event listener
 */
export function setupInfiniteScroll<T>({
  containerSelector,
  itemGenerator,
  renderItem,
  loadMoreThreshold = 50,
}: InfiniteScrollConfig<T>): () => void {
  const container = document.querySelector(containerSelector);
  if (!container) throw new Error(`Container not found: ${containerSelector}`);

  let isLoading = false;

  const loadMoreItems = async () => {
    if (isLoading) return;
    isLoading = true;

    const eventLoading = new CustomEvent("infinite-scroll-loading", {
      detail: { loading: true },
    });
    container.dispatchEvent(eventLoading);

    const { value, done } = await itemGenerator.next();

    const eventLoadingEnded = new CustomEvent("infinite-scroll-loading", {
      detail: { loading: false },
    });

    container.dispatchEvent(eventLoadingEnded);
    isLoading = false;

    if (done) {
      container.removeEventListener("scroll", checkScroll);
      return;
    }
    if (!value) return;
    value.data.forEach((item) => {
      const el = renderItem(item);
      container.appendChild(el);
    });
  };

  const checkScroll = (): void => {
    const containerHeight = container.scrollHeight;
    const scrollPosition = container.scrollTop + container.clientHeight;

    if (containerHeight - scrollPosition < loadMoreThreshold) {
      loadMoreItems();
    }
  };

  // Initial load
  loadMoreItems();

  // Set up scroll event listener
  container.addEventListener("scroll", checkScroll);

  // Return a cleanup function
  return () => {
    container.removeEventListener("scroll", checkScroll);
  };
}
