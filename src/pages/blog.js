import React from 'react';
import { graphql, Link } from 'gatsby';
import Layout from '../components/layout';
import PostList from '../components/post-list';
import styled from 'styled-components';

const Blog = ({ data }) => {
  const posts = data.allMarkdownRemark.nodes;

  return (
    <Layout title="Blog">
      <HeaderWrapper>
        <h1>Blog</h1>

        <Link
          css={`
            margin-top: var(--size-400);
            color: inherit;
            text-transform: uppercase;
          `}
          to="/tags"
        >
          view all tags
        </Link>
      </HeaderWrapper>

      <PostList posts={posts} />
    </Layout>
  );
};

export default Blog;

const HeaderWrapper = styled.div`
  display: flex;
  flex-direction: column;
  margin-top: var(--size-900);
  margin-bottom: var(--size-700);

  h1 {
    max-width: none;
  }
`;

export const homePageQuery = graphql`
  query {
    site {
      siteMetadata {
        title
      }
    }
    allMarkdownRemark(
      filter: { fields: { contentType: { eq: "posts" } } }
      sort: { order: DESC, fields: frontmatter___date }
    ) {
      nodes {
        fields {
          slug
        }
        excerpt
        timeToRead
        frontmatter {
          date(formatString: "MMMM DD, YYYY")
          description
          title
          tags
        }
      }
    }
  }
`;
