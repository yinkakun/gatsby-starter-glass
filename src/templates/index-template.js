import React from 'react';
import { graphql } from 'gatsby';
import Layout from '../components/layout';
import PostList from '../components/post-list';
import styled from 'styled-components';
import StyledLink from '../components/styled-link';

const HomePage = ({ data }) => {
  const pinned = data.pinnedMarkdown.nodes;
  const posts = data.allMarkdownRemark.nodes;
  const intro = data.markdownRemark.html;
  const title = data.markdownRemark.frontmatter.title;

  return (
    <Layout title={title}>
      <Intro
        dangerouslySetInnerHTML={{
          __html: intro,
        }}
      />
      <PostList posts={posts} />
      <PostList posts={pinned} />
      <StyledLink
        css={`
          display: block;
          margin-top: var(--size-800);
          margin-bottom: var(--size-800);
          margin-left: auto;
          margin-right: auto;
          width: fit-content;
        `}
        to="/blog"
      >
        View All posts
      </StyledLink>
    </Layout>
  );
};

export default HomePage;

const Intro = styled.div`
  display: flex;
  flex-direction: column;
  max-width: 60ch;
  align-items: center;
  margin-right: auto;
  margin-left: auto;
  margin-top: var(--size-800);
  margin-bottom: var(--size-900);
  text-align: center;

  & p {
    text-transform: capitalize;
    font-size: var(--size-400);
  }

  @media screen and (max-width: 700px) {
    & h1 {
      font-size: var(--size-700);
    }
  }
`;

export const pageQuery = graphql`
  query ($slug: String!) {
    site {
      siteMetadata {
        title
      }
    }
    pinnedMarkdown: allMarkdownRemark(
      filter: {
        frontmatter: { pinned: { ne: null }},
        fields: { contentType: { eq: "posts" } } 
      }
      sort: { order: DESC, fields: frontmatter___pinned }
      limit: 3
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
    allMarkdownRemark(
      filter: {
        frontmatter: { pinned: { eq: null }},
        fields: { contentType: { eq: "posts" } }
      }
      sort: { order: DESC, fields: frontmatter___date }
      limit: 6
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
    markdownRemark(fields: { slug: { eq: $slug } }) {
      html
      frontmatter {
        title
      }
    }
  }
`;
