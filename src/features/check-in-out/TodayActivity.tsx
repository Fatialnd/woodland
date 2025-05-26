import styled from 'styled-components';
import Heading from '../../ui/Heading';
import Row from '../../ui/Row';

import { useTodayActivity } from './useTodayActivity';
import Spinner from '../../ui/Spinner';
import TodayItem from './TodayItem';
import type { Activity } from './types';
import type { Booking } from '../bookings/types';

const StyledToday = styled.div`
  background-color: var(--color-grey-0);
  border: 1px solid var(--color-grey-100);
  border-radius: var(--border-radius-md);
  padding: 3.2rem;
  display: flex;
  flex-direction: column;
  gap: 2.4rem;
  grid-column: 1 / span 2;
  padding-top: 2.4rem;
`;

const TodayList = styled.ul`
  overflow: scroll;
  overflow-x: hidden;

  &::-webkit-scrollbar {
    width: 0 !important;
  }
  scrollbar-width: none;
  -ms-overflow-style: none;
`;

const NoActivity = styled.p`
  text-align: center;
  font-size: 1.8rem;
  font-weight: 500;
  margin-top: 0.8rem;
`;

function mapBookingToActivity(booking: Booking): Activity {
  if (!booking.guests) {
    throw new Error(`Booking ${booking.id} has no guest info.`);
  }

  return {
    id: booking.id,
    status: booking.status,
    guests: {
      countryFlag: booking.guests.countryFlag,
      fullName: booking.guests.fullName,
      country: booking.guests.country
    },
    numNights: booking.numNights
  };
}

function TodayActivity() {
  const { activities, isLoading } = useTodayActivity();

  const filteredActivities =
    activities
      ?.filter(
        (activity) =>
          activity.status === 'unconfirmed' || activity.status === 'checked-in'
      )
      .map(mapBookingToActivity) ?? [];

  return (
    <StyledToday>
      <Row type="horizontal">
        <Heading as="h2">Today</Heading>
      </Row>

      {!isLoading ? (
        filteredActivities.length > 0 ? (
          <TodayList>
            {filteredActivities.map((activity) => (
              <TodayItem activity={activity} key={activity.id} />
            ))}
          </TodayList>
        ) : (
          <NoActivity>No activity today...</NoActivity>
        )
      ) : (
        <Spinner />
      )}
    </StyledToday>
  );
}

export default TodayActivity;
