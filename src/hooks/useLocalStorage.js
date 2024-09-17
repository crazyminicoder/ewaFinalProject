import React, { useEffect, useState } from "react";

export const useLocalStorage = (key, initialState) => {
  const [isLoggedIn, setIsLoggedIn] = React.useState(
    JSON.parse(localStorage.getItem(key)) ?? initialState
  );

  React.useEffect(() => {
    localStorage.setItem(key, JSON.stringify(isLoggedIn));
  }, [isLoggedIn, key]);

  return [isLoggedIn, setIsLoggedIn];
};
