import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { createTeam } from '../actions';

const CreateTeam = ({ dispatch }) => {
  let nameInput;

  return (
    <form
      onSubmit={
        e => {
          e.preventDefault();
          if (!nameInput.value.trim()) {
            return;
          }
          dispatch(createTeam(nameInput.value));
          nameInput.value = '';
        }
      }
    >
      <div className="form-group">
        <label htmlFor="teamName">New Team</label>

        <input
          type="text"
          name="teamName"
          className="form-control"
          placeholder="New Team Name"
          ref={node => {
            nameInput = node;
          }}
        />
      </div>
      <button type="submit" className="btn btn-info">
        Save
      </button>
    </form>
  );
};

CreateTeam.propTypes = {
  dispatch: PropTypes.func.isRequired,
};

export default connect()(CreateTeam);
