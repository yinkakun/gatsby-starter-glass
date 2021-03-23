import React from 'react';
import styled from 'styled-components';
import { Link } from 'gatsby';
import Tags from './tags';

const PostList = ({ posts }) => {
  const PostList = posts.map(({ frontmatter, fields, excerpt, timeToRead }) => {
    const { title, tags, date, description } = frontmatter;
    const { slug } = fields;

    return (
      <PostListItem
        key={slug}
        tags={tags}
        title={title}
        date={date}
        slug={slug}
        timeToRead={timeToRead}
        description={description}
        excerpt={excerpt}
      />
    );
  });

  return <StyledPostList>{PostList}</StyledPostList>;
};

export default PostList;

const PostListItem = ({
  title,
  date,
  timeToRead,
  tags,
  excerpt,
  description,
  slug,
}) => {
  return (
    <StyledPostListItem>
      <Tags tags={tags} />

      <PostListTitle>
        <Link to={slug}>{title}</Link>
      </PostListTitle>
      <PostListExcerpt
        dangerouslySetInnerHTML={{
          __html: description || excerpt,
        }}
      />
      <PostListMeta>
        <PostListDate>{date}</PostListDate>

        <PostListReadTime>{timeToRead} mins</PostListReadTime>
      </PostListMeta>
    </StyledPostListItem>
  );
};

const StyledPostList = styled.ul`
  padding: 0;
  list-style: none;
  display: grid;
  justify-items: center;
  grid-gap: 2em;
  grid-template-columns: repeat(auto-fit, minmax(35ch, 1fr));
`;

const StyledPostListItem = styled.li`
  display: flex;
  flex-direction: column;
  padding: 1.5rem;
  border-radius: 8px;
  border: 1px solid rgba(255, 255, 255, 0.5);
  background-color: rgba(255, 255, 255, 0.3);
  backdrop-filter: blur(10px);

  &:hover {
    background-color: rgba(255, 255, 255, 0.5);
  }
`;

const PostListTitle = styled.h2`
  line-height: 1.2;
  margin-top: 1rem;
  margin-bottom: 1rem;
  text-transform: capitalize;
  font-size: var(--size-600);

  & a {
    text-decoration: none;
    color: inherit;
    font-weight: 400;
  }
`;

const PostListExcerpt = styled.p`
  margin-top: auto;
  font-size: var(--size-400);
  opacity: 0.7;
`;

const PostListMeta = styled.div`
  margin-top: 2rem;
  font-size: var(--size-300);
  display: flex;
  justify-content: space-between;
  opacity: 0.7;
`;

const PostListDate = styled.span``;

const PostListReadTime = styled.span``;
