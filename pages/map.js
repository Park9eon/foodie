import React from 'react';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import AddIcon from '@material-ui/icons/Add';
import EditDialog from '../components/editDialog';
import Map from '../components/map';
import withAuth from '../lib/withAuth';
import withLayout from '../lib/withLayout';
import { getEateryList } from '../lib/api/eatery';

class Index extends React.Component {
  constructor(props) {
    super(props);

    this.props = props;
    this.onEditDialogClose = this.onEditDialogClose.bind(this);
    this.onEditDialogOpen = this.onEditDialogOpen.bind(this);
  }

  state = {
    eateryList: [],
    isEditDialogOpen: false,
  };

  async componentDidMount() {
    const eateryList = await getEateryList();
    this.setState({ eateryList });
  }

  onEditDialogClose() {
    this.setState({ isEditDialogOpen: false });
  }

  onEditDialogOpen() {
    this.setState({ isEditDialogOpen: true });
  }

  render() {
    return (
      <div>
        <Grid container
              style={{
                position: 'relative',
              }}>
          <Grid item
                xs={3}>
            {/* 음식점 목록 */}
            <section>
              <List>
                {this.state.eateryList.map && this.state.eateryList.map(eatery => (
                  <ListItem button
                            key={eatery._id}>
                    <ListItemText primary={eatery.name}/>
                  </ListItem>
                ))}
              </List>
            </section>
          </Grid>
          <Grid item
                xs={9}
                style={{
                  position: 'relative',
                  top: 0,
                  bottom: 0,
                }}>
            {/* 지도 부분 */}
            <section style={{
              position: 'absolute',
              top: 0,
              bottom: 0,
              left: 0,
              right: 0,
            }}>
              <Map
                loadingElement={<div style={{ height: `100%` }}/>}
                containerElement={<div style={{
                  height: '100%',
                }}/>}
                mapElement={<div style={{ height: '100%' }}/>}/>
            </section>
            <Button color="primary"
                    variant="fab"
                    style={{
                      position: 'absolute',
                      bottom: '18px',
                      left: '18px',
                    }}
                    onClick={this.onEditDialogOpen}><AddIcon/></Button>
          </Grid>
        </Grid>
        {/* 추가 및 수정 dialog */}
        <EditDialog
          onClose={this.onEditDialogClose}
          open={this.state.isEditDialogOpen}
        />
        {/* 자세히보기 dialog */}
      </div>
    );
  }
}

export default withAuth(withLayout(Index), { loginRequired: true });
