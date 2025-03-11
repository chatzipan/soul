import React from "react";
import { Helmet } from "react-helmet";

import { graphql, useStaticQuery } from "gatsby";

interface SEOProps {
  title?: string;
  description?: string;
  pathname?: string;
  children?: React.ReactNode;
  noIndex?: boolean;
}

const SEO = ({ title, description, pathname, children, noIndex }: SEOProps) => {
  const { site } = useStaticQuery(graphql`
    query {
      site {
        siteMetadata {
          title
          description
          siteUrl
          author
        }
      }
    }
  `);

  const {
    title: defaultTitle,
    description: defaultDescription,
    siteUrl,
  } = site.siteMetadata;

  const seo = {
    title: title ? `${title} | ${defaultTitle}` : defaultTitle,
    description: description || defaultDescription,
    url: `${siteUrl}${pathname || ``}`,
  };

  return (
    <Helmet defer={false}>
      <html lang="en" />
      <title>{seo.title}</title>
      <meta name="description" content={seo.description} />

      {noIndex && <meta name="robots" content="noindex, nofollow" />}

      <meta property="og:title" content={seo.title} />
      <meta property="og:description" content={seo.description} />
      <meta property="og:url" content={seo.url} />
      <meta property="og:type" content="website" />

      <link rel="canonical" href={seo.url} />
      {children}
    </Helmet>
  );
};

export default SEO;
