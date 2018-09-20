import React from 'react';
import PropTypes from 'prop-types';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContentText from '@material-ui/core/DialogContentText';
import Button from '@material-ui/core/Button';

class Alert extends React.Component {
  static propTypes = {
    open: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    title: PropTypes.string,
    message: PropTypes.string,
    nagativeName: PropTypes.string,
    positiveName: PropTypes.string,
    positiveAction: PropTypes.func,
  };

  static defaultProps = {
    title: null,
    message: null,
    nagativeName: '취소',
    positiveName: '확인',
    positiveAction: null,
  };

  render() {
    const {
      onClose, open, title, message, positiveName, nagativeName, positiveAction,
    } = this.props;
    return (
      <Dialog open={open}
              onClose={onClose}>
        {title && (<DialogTitle>{title}</DialogTitle>)}
        {message && (
          <DialogContent>
            {message}
          </DialogContent>
        )}
        <DialogActions>
          {nagativeName && (
            <Button onClick={onClose}
                    color="primary">
              {nagativeName}
            </Button>
          )}
          <Button onClick={positiveAction || onClose}
                  color="primary"
                  autoFocus>
            {positiveName}
          </Button>
        </DialogActions>
      </Dialog>
    );
  }
}

export default Alert;
