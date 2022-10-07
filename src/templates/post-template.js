import React from "react";
import { Link, graphql } from "gatsby";
import Layout from "../components/layout";
import styled from "styled-components";
import Tags from "../components/tags";

const PostTemplate = ({ data }) => {
  const { frontmatter, excerpt, html } = data.markdownRemark;
  const prev = data.prev;
  const next = data.next;

  return (
    <Layout
      title={frontmatter.title}
      description={frontmatter.description || excerpt}
      socialImage={
        frontmatter.social_image ? frontmatter.social_image.absolutePath : ""
      }
    >
      <PostWrapper>
        <article>
          <PostTitle>{frontmatter.title}</PostTitle>
          <PostDate>{frontmatter.date}</PostDate>

          <PostContent dangerouslySetInnerHTML={{ __html: html }} />
        </article>

        <PostPagination>
          {prev && (
            <div>
              <span>previous</span>
              <Link to={prev.fields.slug}> {prev.frontmatter.title}</Link>
            </div>
          )}

          {next && (
            <div>
              <span>next</span>
              <Link to={next.fields.slug}> {next.frontmatter.title}</Link>
            </div>
          )}
        </PostPagination>
        <Tags tags={frontmatter.tags} />
      </PostWrapper>
    </Layout>
  );
};

export default PostTemplate;

const PostWrapper = styled.div`
  padding-top: var(--size-900);
  padding-bottom: var(--size-900);
  margin-left: auto;
  margin-right: auto;
  max-width: 70ch;
  word-wrap: break-word;
`;

const PostTitle = styled.h1`
  font-size: var(--size-700);
`;

const PostDate = styled.span`
  font-size: var(--size-400);
  display: block;
  margin-top: 0.5rem;
  text-transform: uppercase;
`;

const PostContent = styled.section`
  padding-top: var(--size-800);

  & > * + * {
    margin-top: var(--size-300);
  }

  & > p + p {
    margin-top: var(--size-700);
  }

  * + h1,
  * + h2,
  * + h3 {
    margin-top: var(--size-900);
  }

  h1 {
    font-size: var(--size-700);
  }

  h2 {
    font-size: var(--size-600);
  }

  h3 {
    font-size: var(--size-500);
  }

  b,
  strong {
    font-weight: 600;
  }

  a {
    color: inherit;
    text-decoration: underline;
    text-decoration-thickness: 0.125rem;
  }

  blockquote {
    padding-left: var(--size-400);
    border-left: 5px solid;
    font-style: italic;
  }

  code {
    font-family: "Source Sans Pro", monospace;
    overflow-x: auto;
    white-space: pre-wrap;
  }

  pre {
    overflow-x: auto;
    white-space: pre-wrap;
    max-width: 100%;
  }
`;

const PostPagination = styled.nav`
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
  margin-top: var(--size-900);

  & > * {
    position: relative;
    flex: 1;
    display: flex;
    flex-direction: column;
    padding: 1rem;
    padding-top: 0.5rem;
    padding-bottom: 0.5rem;
    border-radius: 8px;
    border: 1px solid rgba(255, 255, 255, 0.5);
    background-color: rgba(255, 255, 255, 0.3);
    backdrop-filter: blur(10px);
    margin-bottom: 1rem;
  }

  & > *:hover {
    background-color: rgba(255, 255, 255, 0.5);
  }

  & span {
    text-transform: uppercase;
    opacity: 0.6;
    font-size: var(--size-400);
    padding-bottom: var(--size-500);
  }

  & a {
    color: inherit;
    text-decoration: none;
    font-size: var(--size-400);
    text-transform: capitalize;
  }

  & a::after {
    content: "";
    position: absolute;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
  }
`;

export const pageQuery = graphql`
  query PostBySlug($slug: String!, $prevSlug: String, $nextSlug: String) {
    markdownRemark(fields: { slug: { eq: $slug } }) {
      excerpt(pruneLength: 160)
      html
      frontmatter {
        title
        tags
        date(formatString: "MMMM DD, YYYY")
        description
        social_image {
          absolutePath
        }
      }
    }

    prev: markdownRemark(fields: { slug: { eq: $prevSlug } }) {
      frontmatter {
        title
      }
      fields {
        slug
      }
    }

    next: markdownRemark(fields: { slug: { eq: $nextSlug } }) {
      frontmatter {
        title
      }
      fields {
        slug
      }
    }
  }
`;
