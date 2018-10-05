import React from 'react';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import EditDialog from '../components/editDialog';
import withAuth from '../lib/withAuth';
import withLayout from '../lib/withLayout';

class Index extends React.Component {
  constructor(props) {
    super(props);

    this.props = props;
    this.state = {
      isEditDialogOpen: false,
    };
    this.eateryList = [];
    this.onEditDialogClose = this.onEditDialogClose.bind(this);
    this.onEditDialogOpen = this.onEditDialogOpen.bind(this);
  }

  componentDidMount() {
    this.eateryList = [];
  }

  onEditDialogClose() {
    this.setState({ isEditDialogOpen: false });
  }

  onEditDialogOpen() {
    this.setState({ isEditDialogOpen: true });
  }

  render() {
    return (
      <Grid container spacing={16}>
        <Grid item xs={12}>
          <Grid container
                spacing={16}>
            <Grid item
                  xs={3}>
              <Paper>
                {/* 음식점 목록 */}
                <section className="eatery-list">
                  <div>
                    {this.eateryList.map(eatery => (
                      <div>
                        {eatery.name}
                      </div>
                    ))}
                  </div>
                  <Button color="primary"
                          onClick={this.onEditDialogOpen}>음식점 추가</Button>
                </section>
              </Paper>
            </Grid>
            <Grid item
                  xs={9}>
              <Paper>
                {/* 지도 부분 */}
                <section className="eatery-map">
                  지도입니다.
                </section>
              </Paper>
            </Grid>
          </Grid>
        </Grid>
        {/* 추가 및 수정 dialog */}
        <EditDialog
          onClose={this.onEditDialogClose}
          open={this.state.isEditDialogOpen}
        />
        {/* 자세히보기 dialog */}
      </Grid>
    );
  }
}

export default withAuth(withLayout(Index), { loginRequired: true });
