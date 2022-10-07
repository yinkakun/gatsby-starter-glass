import React from "react";
import Layout from "../components/layout";
import { graphql } from "gatsby";
import styled from "styled-components";
import { GatsbyImage, getImage } from "gatsby-plugin-image";

const AboutTemplate = ({ data }) => {
  const { html, frontmatter } = data.markdownRemark;
  const profileImage = getImage(frontmatter.profile_image);

  return (
    <Layout title={frontmatter.title}>
      <AboutWrapper>
        <AboutImageWrapper image={profileImage} alt="" />

        <AboutCopy dangerouslySetInnerHTML={{ __html: html }} />
      </AboutWrapper>
    </Layout>
  );
};

export default AboutTemplate;

const AboutWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-around;
  height: 100%;

  @media screen and (max-width: 1000px) {
    & {
      flex-direction: column;
    }

    & > * {
      margin-top: 2rem;
      width: 100%;
      text-align: center;
    }
  }
`;

const AboutImageWrapper = styled(GatsbyImage)`
  display: block;
  border-radius: 50%;
  height: 300px;
  width: 300px;
`;

const AboutCopy = styled.div`
  max-width: 60ch;

  & p {
    font-size: var(--size-400);
  }
`;

export const pageQuery = graphql`
  query($slug: String!) {
    markdownRemark(fields: { slug: { eq: $slug } }) {
      html
      frontmatter {
        title
        profile_image {
          childImageSharp {
            gatsbyImageData(placeholder: BLURRED, formats: PNG, height: 400)
          }
        }
      }
    }
  }
`;
