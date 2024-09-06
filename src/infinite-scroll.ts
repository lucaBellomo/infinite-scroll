export interface InfiniteScrollConfig<T> {
  containerSelector: string;
  itemGenerator: AsyncGenerator<{ data: T[]; done: boolean }, void, unknown>;
  renderItem: (items: T) => HTMLElement;
  loadMoreThreshold?: number;
}

/**
 * Creates a generic infinite scroll setup
 * @param config -    Configuration object for the infinite scroll
 * @returns A cleanup function to remove the scroll event listener
 */
export function setupInfiniteScroll<T>({
  containerSelector,
  itemGenerator,
  renderItem,
  loadMoreThreshold = 200,
}: InfiniteScrollConfig<T>): () => void {
  const container = document.querySelector(containerSelector);
  if (!container) throw new Error(`Container not found: ${containerSelector}`);

  const loadMoreItems = async () => {
    const { value, done } = await itemGenerator.next();
    if (done) {
      document.removeEventListener("scroll", checkScroll);
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
  document.addEventListener("scroll", checkScroll);

  // Return a cleanup function
  return () => {
    console.log("cleaned");
    document.removeEventListener("scroll", checkScroll);
  };
}
