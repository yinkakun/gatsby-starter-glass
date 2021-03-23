import React from 'react';
import styled from 'styled-components';
import { Link } from 'gatsby';

const toKebabCase = (str) => {
  return str
    .match(/[A-Z]{2,}(?=[A-Z][a-z]+[0-9]*|\b)|[A-Z]?[a-z]+[0-9]*|[A-Z]|[0-9]+/g)
    .map((x) => x.toLowerCase())
    .join('-');
};

const Tags = ({ tags }) => {
  return (
    <PostListTagsContainer>
      {tags &&
        tags.map((tag) => {
          return (
            <Tag key={tag}>
              <Link to={`/tags/${toKebabCase(tag)}`}>{tag}</Link>
            </Tag>
          );
        })}
    </PostListTagsContainer>
  );
};

export default Tags;

const PostListTagsContainer = styled.div`
  margin-top: 1rem;
`;

const Tag = styled.span`
  margin-right: 0.6rem;
  margin-bottom: 0.6rem;
  text-transform: uppercase;
  font-size: var(--size-300);
  opacity: 0.7;

  & a {
    background-color: rgba(255, 255, 255, 0.4);
    text-decoration: none;
    color: inherit;
    position: relative;
    padding: 0.2rem 0.6rem;
    border-radius: 8px;
    border: 1px solid rgba(255, 255, 255, 0.8);
  }

  & a:hover {
    background-color: rgba(255, 255, 255, 0.7);
  }
`;
