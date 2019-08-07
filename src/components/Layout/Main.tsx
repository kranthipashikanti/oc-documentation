import React from 'react'
import {
  Theme,
  createStyles,
  Paper,
  Grid,
  Typography,
  Container,
  List,
  Box,
  makeStyles,
} from '@material-ui/core/'
import { groupBy as _groupBy, forEach as _forEach } from 'lodash'
import ListLink from '../Shared/ListLink'
import Jumbotron from '../Shared/Jumbotron'
import { graphql, useStaticQuery } from 'gatsby'
import utility from '../../utility'
import {
  mediumgrey,
  darkgrey,
  blackpearl,
} from '../../theme/ocPalette.constants'
import Footer from '../Layout/Footer'

if (typeof window !== 'undefined') {
  // attach smooth scroll to all hrefs
  require('smooth-scroll')('a[href*="#"]')
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      overflowX: 'hidden',
      overflowY: 'auto',
      minHeight: '100vh',
      marginBottom: theme.spacing(55),
      backgroundColor: mediumgrey[50],
    },
    paperRoot: {
      zIndex: 1,
    },
    paperCard: {
      position: 'relative',
      minHeight: '35vh',
      flexFlow: 'column nowrap',
      alignItems: 'center',
      maxWidth: '100vw',
    },
    paperTitleHeading: {
      color: darkgrey[900],
      paddingLeft: theme.spacing(2),
      textAlign: 'left',
    },
    paperTitleSubheading: {
      color: mediumgrey[300],
      paddingLeft: theme.spacing(2),
      marginBottom: theme.spacing(2),
    },
    paperBody: {
      position: 'absolute',
      top: '12vh',
      left: '20vh',
      margin: '0 auto',
      width: '75%',
      padding: 0,
      minHeight: 'min-content',
      zIndex: 1,
      '@media (max-width:992px)': {
        left: '10vh',
      },
    },
    paperList: {
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      '@media (max-width:768px)': {
        gridTemplateColumns: '1fr',
      },
    },
    footerBackground: {
      backgroundColor: blackpearl[700],
      height: `100% `,
    },
  })
)

const MainComponent: React.FunctionComponent = props => {
  const classes = useStyles(props)
  const data = useStaticQuery(graphql`
    query {
      allMdx(
        sort: { order: ASC, fields: [frontmatter___priority] }
        filter: { fileAbsolutePath: { glob: "**/content/docs/**/*.mdx" } }
      ) {
        totalCount
        edges {
          node {
            id
            fileAbsolutePath
            frontmatter {
              section
              title
              hidden
            }
          }
        }
      }
    }
  `)
  const sections = utility.getSectionsFromDocsQuery(data)
  const getSectionSubtitle = title => {
    switch (title) {
      case 'Getting Started':
        // self-explanatory
        return ``
      case 'Main Concepts':
        return `Establish a firm foundation by learning fundamental OrderCloud concepts`
      case 'Features':
        return `Explore at a high-level some of the features you can use to solve your complex B2B scenarios`
      case 'Guides':
        return `Hands-on guides for some of the most common scenarios you'll encounter in the OrderCloud API`
      default:
        return ''
    }
  }

  return (
    <div className={classes.root}>
      <Jumbotron />
      <Container maxWidth="xl">
        <Box marginTop={-15}>
          <Grid container spacing={5}>
            {sections.map((section, index) =>
              section.title === 'Getting Started' ? (
                <Grid item xs={12} sm={12} key={index}></Grid>
              ) : (
                <Grid
                  item
                  xs={12}
                  sm={12}
                  md={6}
                  lg={4}
                  key={index}
                  className={classes.paperRoot}
                >
                  {section.guides.filter(c => !c.frontmatter.hidden).length >
                  0 ? (
                    <Paper elevation={10}>
                      <Box p={2} zIndex={1}>
                        <div className={classes.paperCard}>
                          <Typography
                            className={classes.paperTitleHeading}
                            variant="h5"
                            component="h2"
                          >
                            {section.title}
                          </Typography>

                          <Typography
                            className={classes.paperTitleSubheading}
                            variant="body2"
                          >
                            {getSectionSubtitle(section.title)}
                          </Typography>
                          <List
                            disablePadding={true}
                            dense={true}
                            className={classes.paperList}
                          >
                            {section.guides
                              .filter(g => !g.frontmatter.hidden)
                              .map(g => {
                                return (
                                  <ListLink
                                    key={g.id}
                                    guideProps={{
                                      path: g.path,
                                      title: g.frontmatter.title,
                                    }}
                                  />
                                )
                              })}
                          </List>
                        </div>
                      </Box>
                    </Paper>
                  ) : null}
                </Grid>
              )
            )}
          </Grid>
        </Box>
      </Container>
      <div className={classes.footerBackground}></div>
      <Footer sections={sections} right={0} />
    </div>
  )
}

export default MainComponent
