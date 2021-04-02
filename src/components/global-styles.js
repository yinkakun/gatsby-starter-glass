import { createGlobalStyle } from 'styled-components';

const GlobalStyle = createGlobalStyle`
*,
*::before,
*::after {
  box-sizing: border-box;
}

body,
h1,
h2,
h3,
h4,
p,
figure,
blockquote,
dl,
dd {
  margin: 0;
}

ul[role='list'],
ol[role='list'] {
  list-style: none;
}

html:focus-within {
  scroll-behavior: smooth;
}

html {
  height: -webkit-fill-available;
}

body {
  min-height: 100vh;
  min-height: -webkit-fill-available;
  text-rendering: optimizeSpeed;
  line-height: 1.5;
}

a:not([class]) {
  text-decoration-skip-ink: auto;
}

img,
picture {
  max-width: 100%;
  display: block;
}

input,
button,
textarea,
select {
  font: inherit;
}

@media (prefers-reduced-motion: reduce) {
  html:focus-within {
   scroll-behavior: auto;
  }
  
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
}

html {
  width:100vw;
  overflow-x:hidden;
}

body::-webkit-scrollbar {
    width: 10px;
}

body::-webkit-scrollbar-thumb {
  background-color: rgba(55, 41, 44, .4);
}

body::-webkit-scrollbar-track {
    background: transparent;
}

:root {
  scroll-behavior: smooth;
  --size-300: 0.75rem;
  --size-400: 1rem;
  --size-500: 1.33rem;
  --size-600: 1.77rem;
  --size-700: 2.36rem;
  --size-800: 3.15rem;
  --size-900: 4.2rem;
}

body {
  font-family: 'Poppins', -apple-system, BlinkMacSystemFont, avenir next, avenir, helvetica neue,
    helvetica, Ubuntu, roboto, noto, segoe ui, arial, sans-serif;
  color: #37292C;
  background-attachment: fixed;
  background-color: #d9e4f5;
  background-image: linear-gradient(315deg, #d9e4f5 0%, #f5e3e6 74%);

}

h1,
h2,
h3,
h4 {
  line-height: 1.125;
}

h1,
h2,
h3 {
  font-weight: 700;
}

h1 {
  font-size: var(--size-800);
}

h2 {
  font-size: var(--size-700);
}

h3 {
  font-size: var(--size-600);
}

p {
  font-size: var(--size-400);
}

::selection {
  background: rgba(255, 255, 255, 0.9);
}

p, li {
    max-width: none;
}

.gatsby-resp-image-wrapper {
    margin-left: 0 !important;
}


`;

export default GlobalStyle;
