import React from "react";
import { DarkModeSwitch } from "react-toggle-dark-mode";
import useDarkMode from "use-dark-mode";
import styled from "styled-components";

const ThemeSwitch = () => {
  const { toggle, value } = useDarkMode(false);

  return (
    <StyledThemeSwitch>
      <DarkModeSwitch checked={value} size={20} onChange={toggle} />
    </StyledThemeSwitch>
  );
};

export default ThemeSwitch;

const StyledThemeSwitch = styled.div`
  display: flex;
`;
