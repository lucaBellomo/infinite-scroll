export const toggleLoader = (show: boolean): void => {
  if (show) {
    const spinner = document.createElement("div");
    spinner.classList.add("loader");
    spinner.classList.add("--1");
    const wrapper = document.createElement("div");
    wrapper.classList.add("loader--wrapper");
    wrapper.appendChild(spinner);
    document.body.appendChild(wrapper);
  } else {
    document.querySelector(".loader--wrapper")?.remove();
  }
};
