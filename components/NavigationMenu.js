import React from 'react';
import PropTypes from 'prop-types';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListSubheader from '@material-ui/core/ListSubheader';
import Checkbox from '@material-ui/core/Checkbox';
import Button from '@material-ui/core/Button';
import { withStyles } from '@material-ui/core/styles';

const styles = theme => ({
  mapWrapper: {
    background: 'url(/static/img_map.png)  no-repeat center center',
    backgroundSize: '100%',
    width: '100%',
    height: '112px',
    position: 'relative',
  },
  mapButton: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    whiteSpace: 'nowrap',
  },
  dense: {
    paddingTop: 0,
    paddingBottom: 0,
  },
});

class NavigationMenu extends React.Component {
  static propTypes = {
    classes: PropTypes.shape()
      .isRequired,
    items: PropTypes.arrayOf(PropTypes.string)
      .isRequired,
  };

  render() {
    const { className, items, classes, url } = this.props;
    return (
      <div className={className}>
        <List disablePadding={true}>
          <ListItem disableGutters={true}>
            <div className={classes.mapWrapper}>
              <Button className={classes.mapButton}
                      variant="contained"
                      color="primary">지도에서 보기</Button>
            </div>
          </ListItem>
          <ListItem disableGutters={true}
                    className={classes.dense}>
            <Checkbox/>
            <ListItemText primary="최근"/>
          </ListItem>
          <ListItem disableGutters={true}
                    className={classes.dense}>
            <Checkbox/>
            <ListItemText primary="추천"/>
          </ListItem>
          <ListSubheader disableGutters={true}>태그</ListSubheader>
          {items.map((item, index) => (
            <ListItem disableGutters={true}
                      className={classes.dense}
                      key={index}>
              <Checkbox/>
              <ListItemText primary={item}/>
            </ListItem>
          ))}
        </List>
      </div>
    );
  }
}

export default withStyles(styles)(NavigationMenu);
