import {
  HiOutlineBanknotes,
  HiOutlineBriefcase,
  HiOutlineCalendarDays,
  HiOutlineChartBar
} from 'react-icons/hi2';
import Stat from './Stat';
import { formatCurrency } from '../../utils/helpers';
import type { Booking } from '../bookings/types';
type StatsProps = {
  bookings: any;
  confirmedStays: any;
  numDays?: number;
  cabinCount?: number;
};

function Stats({ bookings, confirmedStays, numDays, cabinCount }: StatsProps) {
  const numBookings = bookings.length;

  const sales = bookings.reduce(
    (acc: number, cur: Booking) => acc + cur.totalPrice,
    0
  );

  const checkins = confirmedStays.length;

  const occupation =
    confirmedStays.reduce(
      (acc: number, cur: Booking) => acc + cur.numNights,
      0
    ) /
    ((numDays ?? 1) * (cabinCount ?? 1));
  return (
    <>
      <Stat
        title="Bookings"
        color="blue"
        icon={<HiOutlineBriefcase />}
        value={numBookings.toString()}
      />
      <Stat
        title="Sales"
        color="green"
        icon={<HiOutlineBanknotes />}
        value={formatCurrency(sales)}
      />
      <Stat
        title="Check ins"
        color="indigo"
        icon={<HiOutlineCalendarDays />}
        value={checkins}
      />
      <Stat
        title="Occupancy rate"
        color="yellow"
        icon={<HiOutlineChartBar />}
        value={Math.round(occupation * 100) + '%'}
      />
    </>
  );
}

export default Stats;
