import React from "react";

import { graphql, useStaticQuery } from "gatsby";

import outside from "../../images/outside.jpeg";

interface SEOProps {
  title?: string;
  description?: string;
  pathname?: string;
  children?: React.ReactNode;
  noIndex?: boolean;
  image?: string;
}

const SEO = ({
  title,
  description,
  pathname,
  children,
  noIndex,
  image,
}: SEOProps) => {
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

  const defaultImage = outside;

  const seo = {
    title: title ? `${title} | ${defaultTitle}` : defaultTitle,
    description: description || defaultDescription,
    url: `${siteUrl}${pathname || ``}`,
    image: `${siteUrl}${image || defaultImage}`,
  };

  return (
    <>
      <html lang="en" />
      <title>{seo.title}</title>
      <meta name="description" content={seo.description} />

      {noIndex && <meta name="robots" content="noindex, nofollow" />}

      <meta property="og:title" content={seo.title} />
      <meta property="og:description" content={seo.description} />
      <meta property="og:url" content={seo.url} />
      <meta property="og:type" content="website" />
      <meta property="og:image" content={seo.image} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta
        property="og:image:alt"
        content={`${defaultTitle} - ${seo.description}`}
      />

      {/* Twitter Card tags */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={seo.title} />
      <meta name="twitter:description" content={seo.description} />
      <meta name="twitter:image" content={seo.image} />

      <link rel="canonical" href={seo.url} />
      {children}
    </>
  );
};

export default SEO;
