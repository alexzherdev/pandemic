import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { Button, Modal, OverlayTrigger, Popover } from 'react-bootstrap';
import Clipboard from 'clipboard';


class StateReporter extends React.Component {
  static propTypes = {
    history: PropTypes.object.isRequired
  }

  constructor(props) {
    super(props);

    this.onModalClosed = this.onModalClosed.bind(this);
  }

  state = { showModal: false };

  componentDidMount() {
    this.clipboard = new Clipboard('.reporter-button', {
      text: () => JSON.stringify(this.props.history)
    });
    this.clipboard.on('success', () => {
      this.setState({ showModal: true });
    });
  }

  componentWillUnmount() {
    this.clipboard.destroy();
  }

  onModalClosed() {
    this.setState({ showModal: false });
  }

  render() {
    return (
      <div className="state-reporter">
        <OverlayTrigger
          id="reporter-trigger"
          trigger={['hover', 'focus']}
          placement="top"
          defaultOverlayShown={true}
          overlay={
            <Popover
              className="reporter-popover"
              id="reporter-popover">
              Epidemic is currently in beta.<br />
              If you think you saw a bug, click here.
            </Popover>
          }>
          <Button
            className="reporter-button"
            bsSize="small"
            bsStyle="primary">
            <i className="fa fa-bug"></i>
          </Button>
        </OverlayTrigger>
        <Modal show={this.state.showModal} onHide={this.onModalClosed}>
          <Modal.Header closeButton>
            <Modal.Title>Debugging data copied!</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            Please send the clipboard contents to <a href="mailto:epidemic.redux@gmail.com">epidemic.redux@gmail.com</a>.
          </Modal.Body>
        </Modal>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  history: state.stateHistory
});

export default connect(mapStateToProps)(StateReporter);
