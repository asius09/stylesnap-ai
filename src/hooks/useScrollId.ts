export const useScrollId = () => {
  const scrollToId = (id: string, options?: ScrollIntoViewOptions) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({
        behavior: "smooth",
        block: "start",
        ...options,
      });
    }
  };
  return scrollToId;
};
