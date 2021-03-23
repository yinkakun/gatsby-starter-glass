import React from 'react';
import { graphql } from 'gatsby';
import Layout from '../components/layout';

const PageTemplate = ({ data }) => {
  const { frontmatter, excerpt, html } = data.markdownRemark;

  return (
    <Layout
      title={frontmatter.title}
      description={frontmatter.description || excerpt}
    >
      <article>
        <h1>{frontmatter.title}</h1>

        <section dangerouslySetInnerHTML={{ __html: html }} />
      </article>
    </Layout>
  );
};

export default PageTemplate;

export const pageQuery = graphql`
  query PageBySlug($slug: String!) {
    markdownRemark(fields: { slug: { eq: $slug } }) {
      excerpt(pruneLength: 160)
      html
      frontmatter {
        title
        description
      }
    }
  }
`;
