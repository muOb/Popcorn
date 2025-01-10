import { useEffect } from "react";
export function useKey(key, actions) {
  useEffect(
    function () {
      function handleKyeBack(e) {
        if (e.code.toLowerCase() === key.toLowerCase()) {
          actions();
        }
      }
      document.addEventListener("keydown", handleKyeBack);
      return function () {
        document.removeEventListener("keydown", handleKyeBack);
      };
    },
    [actions, key]
  );
}
