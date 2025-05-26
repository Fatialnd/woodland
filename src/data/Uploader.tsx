import { useState } from 'react';
import { isFuture, isPast, isToday } from 'date-fns';
import supabase from '../services/supabase';
import Button from '../ui/Button';
import { subtractDates } from '../utils/helpers';

import { bookings } from './data-bookings';
import { cabins } from './data-cabins';
import { guests } from './data-guests';

const BREAKFAST_PRICE = 15;

async function deleteGuests() {
  try {
    const { error } = await supabase.from('guests').delete().gt('id', 0);
    if (error) throw error;
  } catch (error: any) {
    console.error('Error deleting guests:', error.message);
  }
}

async function deleteCabins() {
  try {
    const { error } = await supabase.from('cabins').delete().gt('id', 0);
    if (error) throw error;
  } catch (error: any) {
    console.error('Error deleting cabins:', error.message);
  }
}

async function deleteBookings() {
  try {
    const { error } = await supabase.from('bookings').delete().gt('id', 0);
    if (error) throw error;
  } catch (error: any) {
    console.error('Error deleting bookings:', error.message);
  }
}

async function createGuests() {
  try {
    const { error } = await supabase.from('guests').insert(guests);
    if (error) throw error;
  } catch (error: any) {
    console.error('Error creating guests:', error.message);
  }
}

async function createCabins() {
  try {
    const { error } = await supabase.from('cabins').insert(cabins);
    if (error) throw error;
  } catch (error: any) {
    console.error('Error creating cabins:', error.message);
  }
}

async function createBookings() {
  try {
    // Get actual guest and cabin IDs from DB
    const { data: guestsIds, error: guestError } = await supabase
      .from('guests')
      .select('id')
      .order('id');

    if (guestError || !guestsIds)
      throw guestError || new Error('No guest IDs found');
    const allGuestIds = guestsIds.map((g) => g.id);

    const { data: cabinsIds, error: cabinError } = await supabase
      .from('cabins')
      .select('id')
      .order('id');

    if (cabinError || !cabinsIds)
      throw cabinError || new Error('No cabin IDs found');
    const allCabinIds = cabinsIds.map((c) => c.id);

    const finalBookings = bookings.map((booking) => {
      const cabin = cabins[booking.cabinId - 1]; // assuming 1-based indexing in original data
      const numNights = subtractDates(booking.endDate, booking.startDate);
      const cabinPrice =
        numNights * ((cabin?.regularPrice ?? 0) - (cabin?.discount ?? 0));
      const extrasPrice = booking.hasBreakfast
        ? numNights * BREAKFAST_PRICE * booking.numGuests
        : 0;
      const totalPrice = cabinPrice + extrasPrice;

      // Map guestId and cabinId safely
      const guestId = allGuestIds[booking.guestId - 1];
      const cabinId = allCabinIds[booking.cabinId - 1];
      if (guestId === undefined)
        console.warn(
          `Guest ID mapping missing for original guestId ${booking.guestId}`
        );
      if (cabinId === undefined)
        console.warn(
          `Cabin ID mapping missing for original cabinId ${booking.cabinId}`
        );

      // Determine status with if-else if chain
      let status = 'unknown';
      const startDate = new Date(booking.startDate);
      const endDate = new Date(booking.endDate);
      if (isPast(endDate) && !isToday(endDate)) {
        status = 'checked-out';
      } else if (isFuture(startDate) || isToday(startDate)) {
        status = 'unconfirmed';
      } else if (
        (isFuture(endDate) || isToday(endDate)) &&
        isPast(startDate) &&
        !isToday(startDate)
      ) {
        status = 'checked-in';
      }

      return {
        ...booking,
        numNights,
        cabinPrice,
        extrasPrice,
        totalPrice,
        guestId,
        cabinId,
        status
      };
    });

    console.log('Final bookings to insert:', finalBookings);

    const { error } = await supabase.from('bookings').insert(finalBookings);
    if (error) throw error;
  } catch (error: any) {
    console.error('Error creating bookings:', error.message);
  }
}

function Uploader() {
  const [isLoading, setIsLoading] = useState(false);

  async function uploadAll() {
    setIsLoading(true);
    try {
      // Delete in correct order to avoid FK constraint issues
      await deleteBookings();
      await deleteGuests();
      await deleteCabins();

      // Create in correct order
      await createGuests();
      await createCabins();
      await createBookings();
    } catch (error) {
      console.error('Upload all error:', error);
    } finally {
      setIsLoading(false);
    }
  }

  async function uploadBookings() {
    setIsLoading(true);
    try {
      await deleteBookings();
      await createBookings();
    } catch (error) {
      console.error('Upload bookings error:', error);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div
      style={{
        marginTop: 'auto',
        backgroundColor: '#e0e7ff',
        padding: '8px',
        borderRadius: '5px',
        textAlign: 'center',
        display: 'flex',
        flexDirection: 'column',
        gap: '8px'
      }}
    >
      <h3>SAMPLE DATA</h3>

      <Button onClick={uploadAll} disabled={isLoading}>
        Upload ALL
      </Button>

      <Button onClick={uploadBookings} disabled={isLoading}>
        Upload bookings ONLY
      </Button>
    </div>
  );
}

export default Uploader;
