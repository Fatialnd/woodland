import { getToday } from '../utils/helpers';
import supabase from './supabase';
import { Booking, UpdateBookingData } from '../features/bookings/types';
import { PAGE_SIZE } from '../utils/constants';

export async function getBookings({
  filter,
  sortBy,
  page
}: {
  filter?: { field: string; value: any };
  sortBy?: { field: string; direction: 'asc' | 'desc' };
  page?: number;
}): Promise<{ bookings: Booking[]; count: number }> {
  let query = supabase
    .from('bookings')
    .select(
      'id, created_at, startDate, endDate, numNights, numGuests, status, totalPrice, extrasPrice, cabins(id, name), guests(id, fullName, email)',
      { count: 'exact' }
    );

  if (filter) query = query.eq(filter.field, filter.value);

  if (sortBy)
    query = query.order(sortBy.field, {
      ascending: sortBy.direction === 'asc'
    });

  if (page) {
    const from = (page - 1) * PAGE_SIZE;
    const to = from + PAGE_SIZE - 1;
    query = query.range(from, to);
  }

  const { data, error, count } = await query;

  if (error || !data) {
    console.error(error);
    throw new Error('Bookings could not be loaded');
  }

  return {
    bookings: data.map((booking) => ({
      ...booking,
      extrasPrice: booking.extrasPrice ?? 0,
      cabins: Array.isArray(booking.cabins)
        ? booking.cabins[0]
        : booking.cabins,
      guests: Array.isArray(booking.guests) ? booking.guests[0] : booking.guests
    })),
    count: count ?? 0
  };
}

export async function getBooking(id: number): Promise<Booking> {
  const { data, error } = await supabase
    .from('bookings')
    .select('*, cabins(*), guests(*)')
    .eq('id', id)
    .single();

  if (error || !data) {
    console.error(error);
    throw new Error('Booking not found');
  }

  return data;
}

export async function getBookingsAfterDate(
  date: string
): Promise<{ created_at: string; totalPrice: number; extrasPrice: number }[]> {
  const { data, error } = await supabase
    .from('bookings')
    .select('created_at, totalPrice, extrasPrice')
    .gte('created_at', date)
    .lte('created_at', getToday({ end: true }));

  if (error || !data) {
    console.error(error);
    throw new Error('Bookings could not be loaded');
  }

  return data;
}

export async function getStaysAfterDate(date: string): Promise<Booking[]> {
  const { data, error } = await supabase
    .from('bookings')
    .select('*, guests(fullName)')
    .gte('startDate', date)
    .lte('startDate', getToday());

  if (error || !data) {
    console.error(error);
    throw new Error('Bookings could not be loaded');
  }

  return data;
}

export async function getStaysTodayActivity(): Promise<Booking[]> {
  const today = new Date().toISOString().split('T')[0];

  const { data, error } = await supabase
    .from('bookings')
    .select('*, guests(fullName, nationality, countryFlag)')
    .or(
      `and(status.eq.unconfirmed,startDate.eq.${today}),and(status.eq.checked-in,startDate.lte.${today},endDate.gte.${today})`
    )

    .order('created_at', { ascending: true });

  if (error || !data) {
    console.error(error);
    throw new Error('Bookings could not be loaded');
  }

  return data;
}

export async function updateBooking(
  id: number,
  obj: UpdateBookingData
): Promise<Booking> {
  const { data, error } = await supabase
    .from('bookings')
    .update(obj)
    .eq('id', id)
    .select()
    .single();

  if (error || !data) {
    console.error(error);
    throw new Error('Booking could not be updated');
  }

  return data;
}

export async function deleteBooking(id: number): Promise<void> {
  const { error } = await supabase.from('bookings').delete().eq('id', id);

  if (error) {
    console.error(error);
    throw new Error('Booking could not be deleted');
  }
  return;
}
