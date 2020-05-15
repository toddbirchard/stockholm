import React from 'react'
import PropTypes from 'prop-types'
import { graphql, Link } from 'gatsby'
import { Layout } from '../components/common'
import { MetaData } from '../components/common/meta'

import '../styles/pages/seriesarchive.less'
import '../styles/pages/page.less'

/**
* Series page (/series/)
*
* Lists all multi-part post series.
*
*/
const SeriesArchive = ({ data, location, pageContext }) => {
  const tags = data.allGhostTag.edges
  const title = pageContext.title
  const description = pageContext.description
  const metaDescription = pageContext.metaDescription

  return (
    <>
      <MetaData
        data={data}
        location={location}
        title={title}
        description={metaDescription}
        type="series"
      />
      <Layout template="seriesarchive-template page-template" hasSidebar={false}>
        <div className="info-card">
          <div className="page-title-card">
            <h1>{title}</h1>
          </div>
          <p>{description}</p>
        </div>
        <div className="series-grid">
          {tags.map(({ node }) => (
            <Link to={`/series/${node.slug}`} className="series-card" key={node.id}>
              {node.feature_image && <div className="series-card-image" style={{ backgroundImage: `url(${node.feature_image})` }}> </div>}
              <div className="series-card-info">
                <h2 className="series-card-title">{node.name.replace(`#`, ``)}</h2>
                <p className="series-card-description">{node.description}</p>
                <span className="series-card-count">{node.postCount} Posts</span>
              </div>
            </Link>
          ))}
        </div>
      </Layout>
    </>
  )
}

SeriesArchive.propTypes = {
  data: PropTypes.shape({
    allGhostTag: PropTypes.object.isRequired,
    ghostPage: PropTypes.object.isRequired,
  }).isRequired,
  pageContext: PropTypes.shape({
    title: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
  }),
  location: PropTypes.object,
}

export default SeriesArchive

export const seriesQuery = graphql`
    query GhostSeriesArchiveQuery($slug: String) {
        allGhostTag(sort: {order: DESC, fields: postCount}, filter: {visibility: {eq: "internal"}, postCount: {gt: 1}}) {
          edges {
             node {
               id
               slug
               postCount
               feature_image
               description
               name
             }
           }
        }
        ghostPage(slug: {eq: $slug}) {
          ...GhostPageFields
        }
    }`
