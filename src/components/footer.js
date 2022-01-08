import React from 'react';
import Container from './container';
import styled from 'styled-components';
import SocialLinks from './social-links';
import { Link } from 'gatsby';

const Footer = () => {
  return (
    <StyledFooter>
      <FooterWrapper>
        <SocialLinks />
        <Link to="/about">© 2021 Moto Sakanosita</Link>
      </FooterWrapper>
    </StyledFooter>
  );
};

export default Footer;

const StyledFooter = styled.footer`
  padding-top: var(--size-300);
  padding-bottom: var(--size-300);
`;

// const FooterAttribution = styled.p`
//   font-size: var(--size-300);

//   & a {
//     color: inherit;
//   }
// `;

const FooterWrapper = styled(Container)`
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  align-items: center;

  & a {
    color: inherit;
    font-size: var(--size-300);
    text-decoration: none;
  }
`;
