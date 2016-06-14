import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { changeSettings } from '../actions';

const UserSettings = ({ displayName, dispatch }) => {
  let nameInput;

  return (
    <div>
      <p className="lead">Profile Settings</p>
      <form
        onSubmit={
          e => {
            e.preventDefault();
            if (!nameInput.value.trim()) {
              return;
            }
            const setting = {
              displayName: nameInput.value,
            };
            dispatch(changeSettings(setting));
            nameInput.value = '';
          }
        }
      >
        <div className="form-group">
          <label htmlFor="displayName">Change Display Name</label>

          <input
            type="text"
            name="displayName"
            className="form-control"
            placeholder={displayName}
            ref={node => {
              nameInput = node;
            }}
          />
        </div>
        <button type="submit" className="btn btn-info">
          Save
        </button>
      </form>
    </div>
  );
};

UserSettings.propTypes = {
  displayName: PropTypes.string.isRequired,
  dispatch: PropTypes.func.isRequired,
};

export default connect()(UserSettings);
