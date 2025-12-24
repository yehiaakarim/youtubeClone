export const debounce = (func, delay) => {
    let timeoutId;
    return function (...args) {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => func.apply(this, args), delay);
    };
  };
  
  export const getSearchHistory = () => {
    const history = localStorage.getItem('youtube-clone-search-history');
    return history ? JSON.parse(history) : [];
  };
  
  export const addToSearchHistory = (query) => {
    if (!query.trim()) return;
    const history = getSearchHistory();
    const newHistory = [query, ...history.filter(item => item.toLowerCase() !== query.toLowerCase())].slice(0, 5);
    localStorage.setItem('youtube-clone-search-history', JSON.stringify(newHistory));
  };
  
  export const clearSearchHistory = () => {
    localStorage.removeItem('youtube-clone-search-history');
  };