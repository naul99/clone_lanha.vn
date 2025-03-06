/**
 * Prevent the search form and mobile menu open at the same time
 * */
const initSearchForm = () => {
  const searchElement = document.querySelector(
    ".br-search-popup--sticky input.br-search-form__field"
  );

  // not exist
  if (!searchElement) return;

  const isSearchOpen = () =>
    document.documentElement.classList.contains("search-open");

  // handle search button click
  document.querySelectorAll('[data-toggle="search-open"]').forEach((button) => {
    button.addEventListener("click", () => {
      if (!isSearchOpen()) return;

      const isMenuOpen =
        document.documentElement.classList.contains("menu-open");
      if (isMenuOpen) {
        // close menu panel
        document.documentElement.classList.remove("menu-open");
      }

      // not set time out => focus doesn't work
      // https://stackoverflow.com/a/32495861
      setTimeout(() => {
        searchElement.focus();
      }, 200);
    });
  });

  // handle click on the burger menu
  document
    .querySelectorAll('[data-toggle="menu-open"]')
    .forEach((menuButton) => {
      menuButton.addEventListener("click", () => {
        if (isSearchOpen()) {
          const searchButton = document.querySelector(
            '[data-toggle="search-open"]'
          );

          // close search panel
          searchButton.click();
        }
      });
    });
};
initSearchForm();
