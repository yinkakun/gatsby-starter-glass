import { Link } from 'gatsby';
import styled from 'styled-components';

const StyledLink = styled(Link)`
  padding: 0.5rem;
  padding-left: 1.5rem;
  padding-right: 1.5rem;
  color: inherit;
  background-color: rgba(255, 255, 255, 0.4);
  text-decoration: none;
  border-radius: 0px;
  border: 1px solid rgba(255, 255, 255, 0.8);
  text-transform: uppercase;
  border-radius: 4px;
`;

export default StyledLink;
