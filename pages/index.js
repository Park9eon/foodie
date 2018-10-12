import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import Header from '../components/Header';
import EateryListItem from '../components/EateryListItem';
import withAuth from '../lib/withAuth';
import withLayout from '../lib/withLayout';
import { getEateryList } from '../lib/api/eatery';
import Card from '@material-ui/core/Card';

const styles = theme => ({
  root: {
    maxWidth: '1024px',
    margin: '0 auto',
    flexGrow: 1,
    marginTop: '48px',
    padding: theme.spacing.unit * 2,
  },
  title: {
    padding: theme.spacing.unit * 2,
  },
});

class Index extends React.Component {
  constructor(props) {
    super(props);
  }

  state = {
    eateryList: [],
  };

  async componentDidMount() {
    const eateryList = await getEateryList();
    this.setState({ eateryList });
  }

  render() {
    const { user, classes } = this.props;
    const { eateryList } = this.state;
    return (
      <div>
        <Header user={user}/>
        <main className={classes.root}>
          <Grid container
                spacing={16}>
            <Grid item
                  sm={6}
                  md={4}>
              <Paper>
                <Typography variant="h6"
                            className={classes.title}>
                  최근 등록된 음식점
                </Typography>
                <div className={classes.eateryList}>
                  {eateryList.map((eatery, index) => (
                    <div key={eatery._id}>
                      <EateryListItem eatery={eatery}
                                      isRecent={true}/>
                      {(index < eateryList.length - 1 && (<Divider/>))}
                    </div>
                  ))}
                </div>
              </Paper>
            </Grid>
            <Grid item
                  sm={6}
                  md={4}>
              <Paper>
                <Typography variant="h6"
                            className={classes.title}>
                  추천 음식점
                </Typography>
                <div className={classes.eateryList}>
                  {eateryList.map((eatery, index) => (
                    <div key={eatery._id}>
                      <EateryListItem eatery={eatery}
                                      isRecommend={true}/>
                      {(index < eateryList.length - 1 && (<Divider/>))}
                    </div>
                  ))}
                </div>
              </Paper>
            </Grid>
            <Grid item
                  sm={6}
                  md={4}>
              <Paper>
                <Typography variant="h6"
                            className={classes.title}>
                  모든 음식점
                </Typography>
                <div className={classes.eateryList}>
                  {eateryList.map((eatery, index) => (
                    <div key={eatery._id}>
                      <EateryListItem eatery={eatery}/>
                      {(index < eateryList.length - 1 && (<Divider/>))}
                    </div>
                  ))}
                </div>
              </Paper>
            </Grid>
          </Grid>
        </main>
      </div>
    );
  }
}

export default withAuth(withLayout(withStyles(styles)(Index)), { loginRequired: true });
