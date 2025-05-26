export interface Activity {
  id: string;
  status: 'unconfirmed' | 'checked-in' | 'checked-out' | 'cancelled';
  guests: {
    countryFlag?: string;
    fullName: string;
    country?: string;
  };
  numNights: number;
}
