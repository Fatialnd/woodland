import supabase, { supabaseUrl } from './supabase';

export async function getCabins() {
  const { data, error } = await supabase.from('cabins').select('*');

  if (error) {
    console.error(error);
    throw new Error('Cabins could not be loaded');
  }

  return data;
}

interface Cabin {
  id?: number;
  name: string;
  description: string;
  image: File | string;
  [key: string]: any;
}

interface SupabaseResponse<T> {
  data: T | null;
  error: Error | null;
}

export async function createEditCabin(
  newCabin: Cabin,
  id?: number
): Promise<Cabin> {
  const hasImagePath = (newCabin.image as string)?.startsWith?.(supabaseUrl);

  const imageName = `${Math.random()}-${
    (newCabin.image as File).name
  }`.replaceAll('/', '');
  const imagePath = hasImagePath
    ? (newCabin.image as string)
    : `${supabaseUrl}/storage/v1/object/public/cabin-images/${imageName}`;
  let query;

  // A) CREATE
  if (!id) {
    query = supabase.from('cabins').insert([{ ...newCabin, image: imagePath }]);
  } else {
    // B) EDIT
    query = supabase
      .from('cabins')
      .update({ ...newCabin, image: imagePath })
      .eq('id', id);
  }

  const { data, error }: SupabaseResponse<Cabin> = await query
    .select()
    .single();

  if (error) {
    console.error(error);
    throw new Error('Cabin could not be created');
  }

  if (hasImagePath) return data as Cabin;

  const { error: storageError } = await supabase.storage
    .from('cabin-images')
    .upload(imageName, newCabin.image as File);

  if (storageError) {
    await supabase
      .from('cabins')
      .delete()
      .eq('id', (data as Cabin).id);
    console.error(storageError);
    throw new Error(
      'Cabin image could not be uploaded and the cabin was not created'
    );
  }

  return data as Cabin;
}

interface DeleteCabinResponse {
  data: any;
  error: Error | null;
}

export async function deleteCabin(id: number | undefined): Promise<any> {
  if (!id) {
    console.error('Error: Attempted to delete a cabin with an undefined ID.');
    throw new Error('Invalid cabin ID.');
  }

  const { data: bookings, error: bookingsError } = await supabase
    .from('bookings')
    .select('*')
    .eq('id', id);

  if (bookingsError) {
    console.error('Error fetching bookings:', bookingsError.message);
    throw new Error('Error fetching related bookings.');
  }

  if (bookings?.length > 0) {
    const { error: deleteBookingsError } = await supabase
      .from('bookings')
      .delete()
      .eq('cabinId', id);

    if (deleteBookingsError) {
      console.error('Error deleting bookings:', deleteBookingsError.message);
      throw new Error('Error deleting related bookings.');
    }
  }

  const { data, error } = await supabase.from('cabins').delete().eq('id', id);

  if (error) {
    console.error('Error deleting cabin:', error.message);
    throw new Error('Cabin could not be deleted');
  }

  return data;
}
