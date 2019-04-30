import React from 'react';
import PropTypes from 'prop-types';
import PopoverWithButton from './popover-with-button';

const TimeFrameItem = ({ selectTimeFrame, isActive, timeFrame }) => {
  let resultClass = 'result button-unstyled';
  if (isActive) {
    resultClass += ' active';
  }
  return (
    <button className={resultClass} onClick={selectTimeFrame} type="button">
      <div className="result-container">
        <div className="result-name">{timeFrame}</div>
      </div>
    </button>
  );
};

TimeFrameItem.propTypes = {
  selectTimeFrame: PropTypes.func.isRequired,
  isActive: PropTypes.bool.isRequired,
  timeFrame: PropTypes.string.isRequired,
};

const timeFrames = ['Last 4 Weeks', 'Last 2 Weeks', 'Last 24 Hours'];

const TeamAnalyticsTimePop = (props) => {
  const selectTimeFrame = (timeFrame) => () => {
    props.updateTimeFrame(timeFrame);
    props.togglePopover();
  };

  return (
    <dialog className="pop-over analytics-time-pop" tabIndex="0" ref={props.focusDialog}>
      <section className="pop-over-actions last-section results-list">
        <div className="results">
          {timeFrames.map((timeFrame) => (
            <TimeFrameItem
              key={timeFrame}
              selectTimeFrame={selectTimeFrame(timeFrame)}
              isActive={props.currentTimeFrame === timeFrame}
              timeFrame={timeFrame}
            />
          ))}
        </div>
      </section>
    </dialog>
  );
};

TeamAnalyticsTimePop.propTypes = {
  updateTimeFrame: PropTypes.func.isRequired,
  currentTimeFrame: PropTypes.string.isRequired,
  focusDialog: PropTypes.func.isRequired,
};

const TeamAnalyticsTimePopButton = ({ updateTimeFrame, currentTimeFrame }) => {
  const dropdown = <div className="down-arrow" aria-label="options" />;
  return (
    <PopoverWithButton
      buttonClass="button-small button-tertiary button-select"
      buttonText={
        <>
          {currentTimeFrame} {dropdown}
        </>
      }
    >
      {({ togglePopover, focusDialog }) => (
        <TeamAnalyticsTimePop
          updateTimeFrame={updateTimeFrame}
          currentTimeFrame={currentTimeFrame}
          togglePopover={togglePopover}
          focusDialog={focusDialog}
        />
      )}
    </PopoverWithButton>
  );
};

TeamAnalyticsTimePopButton.propTypes = {
  updateTimeFrame: PropTypes.func.isRequired,
  currentTimeFrame: PropTypes.string.isRequired,
};

export default TeamAnalyticsTimePopButton;
