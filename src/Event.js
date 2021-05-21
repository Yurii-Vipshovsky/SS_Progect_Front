import React from 'react';
import PropTypes from 'prop-types';

const Event = props => {
    const { name, place, description, date, type} = props.eventInfo || {};

    return (
        <div className="col-sm-12 col-md-12">
            <div className="border-gray rounded border mx-2 my-1 align-items-center p-0 bg-light">
                <div className="px-3 row">
                    <div className="col-2 text-dark font-weight-bold">{ name }</div>
                    <div className="col-5">{ description }</div>
                    <div className="col-2">{ place }</div>
                    <div className="col-2">{ date }</div>
                    <div className="col-1">{ type }</div>
                </div>
            </div>
        </div>
    )
}

Event.propTypes = {
    info: PropTypes.shape({
        name: PropTypes.string.isRequired,
        place: PropTypes.string.isRequired,
        description: PropTypes.string.isRequired,
        type: PropTypes.string.isRequired,
        date: PropTypes.string.isRequired
    })
};

export default Event;