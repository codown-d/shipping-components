import {useCallback, useRef} from 'react';

/**
 * 创建一个稳定的回调函数，不会因为依赖项变化而改变引用
 *
 * @param callback 需要稳定化的回调函数
 * @returns 稳定化后的回调函数
 *
 * @example
 * // 原始方式，每次渲染都会创建新的函数引用
 * const handleClick = () => {
 *   console.log(count);
 * };
 *
 * // 使用useStableCallback，函数引用保持稳定
 * const handleClick = useStableCallback(() => {
 *   console.log(count);
 * });
 */
function useStableCallback<T extends (...args: any[]) => any>(callback: T): T {
  // 使用ref存储最新的回调函数
  const callbackRef = useRef<T>(callback);

  // 更新ref中的回调函数
  callbackRef.current = callback;

  // 返回一个稳定的回调函数，它会调用ref中存储的最新回调函数
  // useCallback的依赖项为空数组，确保返回的函数引用保持稳定
  return useCallback(
    ((...args: Parameters<T>): ReturnType<T> => {
      return callbackRef.current(...args);
    }) as T,
    []
  );
}

export default useStableCallback;
