export function createLocalStorageSpy(): {
  getItemSpy: jest.SpyInstance;
  setItemSpy: jest.SpyInstance;
  removeItemSpy: jest.SpyInstance;
} {
  const getItemSpy = jest.spyOn(window.localStorage['__proto__'], 'getItem');
  getItemSpy.mockReset();
  window.localStorage['__proto__'].getItem = jest.fn();
  const setItemSpy = jest.spyOn(window.localStorage['__proto__'], 'setItem');
  setItemSpy.mockReset();
  window.localStorage['__proto__'].setItem = jest.fn();
  const removeItemSpy = jest.spyOn(window.localStorage['__proto__'], 'removeItem');
  removeItemSpy.mockReset();
  window.localStorage['__proto__'].removeItem = jest.fn();

  return { getItemSpy, setItemSpy, removeItemSpy };
}
